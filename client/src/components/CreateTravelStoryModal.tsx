import { useState, useRef, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Tag, Image, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CreateTravelStoryModalProps {
  onSuccess?: () => void;
}

export function CreateTravelStoryModal({ onSuccess }: CreateTravelStoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle location selection - in a real app, this could connect to Maps API
  const handleLocationSearch = (locationName: string) => {
    setLocation(locationName);
    // Mocked coordinates - in a real implementation, get these from Google Maps or similar
    setCoordinates({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    });
  };

  // Handle tag input
  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Maximum 5 files
      const newFiles = [...selectedFiles, ...files].slice(0, 5);
      setSelectedFiles(newFiles);
      
      // Generate previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please share your travel experience",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to share your travel story",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("content", content);
      formData.append("location", location);
      formData.append("locationCoordinates", JSON.stringify(coordinates));
      formData.append("tags", JSON.stringify(tags));
      
      // Append all selected files
      selectedFiles.forEach(file => {
        formData.append("media", file);
      });

      // Submit the form
      const response = await fetch("/api/community/posts", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      const data = await response.json();
      
      toast({
        title: "Story Shared!",
        description: "Your travel experience has been posted",
      });
      
      // Reset the form
      setContent("");
      setLocation("");
      setCoordinates({ lat: 0, lng: 0 });
      setTags([]);
      setSelectedFiles([]);
      setPreviews([]);
      setIsOpen(false);
      
      // Clean up object URLs
      previews.forEach(URL.revokeObjectURL);
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to share your travel story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  // Clean up object URLs when component is unmounted
  useEffect(() => {
    return () => {
      previews.forEach(URL.revokeObjectURL);
    };
  }, [previews]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4a89dc] hover:bg-[#3b7dd4] rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Share Your Journey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Share Your Travel Experience</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Story Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Share Your Experience</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your amazing journey..."
              className="min-h-[120px]"
              required
            />
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => handleLocationSearch(e.target.value)}
              placeholder="Where did you travel to?"
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center">
              <Tag className="h-4 w-4 mr-1 text-gray-500" /> Add Tags
            </Label>
            <div className="flex items-center">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags (e.g., adventure, beach, etc.)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            
            {/* Display Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-[#4a89dc] text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#3b7dd4]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Media Upload */}
          <div className="space-y-2">
            <Label htmlFor="media" className="flex items-center">
              <Image className="h-4 w-4 mr-1 text-gray-500" /> Upload Photos
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="media"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= 5}
              >
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} file(s) selected ${selectedFiles.length >= 5 ? '(max)' : ''}`
                  : "Select Photos"
                }
              </Button>
            </div>
            
            {/* Media Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#4a89dc] hover:bg-[#3b7dd4]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing... {progress > 0 && `(${progress}%)`}
                </>
              ) : (
                'Share Your Story'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}