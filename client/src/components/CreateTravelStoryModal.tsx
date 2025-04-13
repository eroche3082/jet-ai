import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { MapPinIcon, ImageIcon, TagIcon, XIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { apiRequest } from '@/lib/queryClient';

interface CreateTravelStoryModalProps {
  onSuccess?: () => void;
}

export function CreateTravelStoryModal({ onSuccess }: CreateTravelStoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [locationCoordinates, setLocationCoordinates] = useState({ lat: 0, lng: 0 });
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [journeyCode, setJourneyCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check file size limit - 10MB per file
      const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "Files too large",
          description: "One or more files exceed the 10MB limit",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
      const invalidFiles = newFiles.filter(file => !validTypes.includes(file.type));
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid file format",
          description: "Only JPEG, PNG, GIF, and MP4 files are allowed",
          variant: "destructive",
        });
        return;
      }
      
      // Check max number of files
      if (mediaFiles.length + newFiles.length > 5) {
        toast({
          title: "Too many files",
          description: "Maximum 5 files allowed",
          variant: "destructive",
        });
        return;
      }
      
      // Generate preview URLs for the files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setMediaFiles(prev => [...prev, ...newFiles]);
      setMediaPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const removeMedia = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(mediaPreviewUrls[index]);
    
    setMediaFiles(files => files.filter((_, i) => i !== index));
    setMediaPreviewUrls(urls => urls.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = () => {
    setContent('');
    setLocation('');
    setLocationCoordinates({ lat: 0, lng: 0 });
    setTagInput('');
    setTags([]);
    
    // Revoke all preview URLs to avoid memory leaks
    mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setMediaFiles([]);
    setMediaPreviewUrls([]);
    setJourneyCode('');
    setQrCodeUrl('');
    setIsSuccess(false);
  };
  
  const handleClose = () => {
    if (isSuccess) {
      resetForm();
    }
    setIsOpen(false);
  };
  
  const generateQRCode = async (journeyCode: string) => {
    try {
      const dashboardUrl = `${window.location.origin}/access-dashboard?code=${journeyCode}`;
      const qrCodeDataUrl = await QRCode.toDataURL(dashboardUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#4a89dc',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content || !location) {
      toast({
        title: "Missing information",
        description: "Please provide both a description and location",
        variant: "destructive",
      });
      return;
    }
    
    if (mediaFiles.length === 0) {
      toast({
        title: "Media required",
        description: "Please add at least one photo or video",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('content', content);
      formData.append('location', location);
      formData.append('locationCoordinates', JSON.stringify(locationCoordinates));
      formData.append('tags', JSON.stringify(tags));
      
      mediaFiles.forEach(file => {
        formData.append('media', file);
      });
      
      // Send the request
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      const data = await response.json();
      
      // Show success state with journey code
      setJourneyCode(data.journeyCode);
      await generateQRCode(data.journeyCode);
      setIsSuccess(true);
      
      toast({
        title: "Story shared successfully!",
        description: "Your travel story has been shared with the community",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error sharing story",
        description: "There was a problem sharing your travel story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc]">
          Share Experience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Share Your Travel Story</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {/* Media upload */}
              <div className="space-y-2">
                <Label>Photos & Videos (Up to 5)</Label>
                
                <div className="grid grid-cols-3 gap-2">
                  {mediaPreviewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                      {url.includes('video') ? (
                        <video
                          src={url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {mediaFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center"
                    >
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">Add Media</span>
                    </button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <p className="text-xs text-gray-500">
                  Accepted formats: JPEG, PNG, GIF, MP4. Max 10MB per file.
                </p>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="content">Your Travel Experience</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share what made this experience special..."
                  className="min-h-[120px]"
                />
              </div>
              
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Santorini, Greece"
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="relative">
                  <TagIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add tags e.g., Beach, Family, Adventure"
                    className="pl-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addTag}
                    className="absolute right-1 top-1 h-8"
                  >
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                        {tag}
                        <XIcon
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#4a89dc] hover:bg-[#3a79cc]" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    'Share Story'
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-medium mb-2">Story Shared Successfully!</h3>
            <p className="text-gray-500 mb-6">
              Your travel experience has been added to the community.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg w-full mb-6">
              <p className="text-gray-700 mb-2">Your unique journey code:</p>
              <p className="text-xl font-mono font-semibold text-[#4a89dc] mb-4">
                {journeyCode}
              </p>
              
              {qrCodeUrl && (
                <div className="flex justify-center mb-2">
                  <img src={qrCodeUrl} alt="Journey QR Code" width={180} height={180} />
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                Save this code to unlock special features and track engagement with your story.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button 
                className="bg-[#4a89dc] hover:bg-[#3a79cc]"
                onClick={() => {
                  resetForm();
                  setIsSuccess(false);
                }}
              >
                Share Another Story
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}