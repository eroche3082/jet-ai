import { useState, useRef, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Image as ImageIcon, 
  Sparkles, 
  Edit, 
  Video, 
  Loader2, 
  Share2, 
  BarChart2,
  Instagram, 
  Facebook, 
  Twitter, 
  Clock, 
  Upload, 
  Download,
  Zap,
  Plus,
  X
} from "lucide-react";

// Types
interface SocialPostGeneratorProps {
  tripMetadata?: TripMetadata;
  onSuccess?: () => void;
}

interface TripMetadata {
  title?: string;
  destination?: string;
  dates?: {
    start: string;
    end: string;
  };
  images?: string[];
  highlights?: string[];
}

interface GeneratedContent {
  caption: string;
  hashtags: string[];
  title: string;
  suggestedAudio?: string;
  suggestedTime?: string;
}

// Component
export function SocialPostGenerator({ tripMetadata, onSuccess }: SocialPostGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [postType, setPostType] = useState<'reel' | 'story' | 'post'>('post');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'facebook' | 'twitter'>('instagram');
  const [tone, setTone] = useState<'casual' | 'professional' | 'adventurous' | 'luxurious'>('casual');
  const [customPrompt, setCustomPrompt] = useState("");
  const [isIncludeHashtags, setIsIncludeHashtags] = useState(true);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [editedCaption, setEditedCaption] = useState("");
  
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Prefill form if trip metadata is provided
  useEffect(() => {
    if (tripMetadata) {
      if (tripMetadata.images && tripMetadata.images.length > 0) {
        // Convert URLs to File objects or handle differently as needed
        console.log("Trip images available:", tripMetadata.images);
      }
      
      if (tripMetadata.highlights && tripMetadata.highlights.length > 0) {
        setCustomPrompt(`Trip to ${tripMetadata.destination || 'destination'} with highlights: ${tripMetadata.highlights.join(', ')}`);
      } else if (tripMetadata.destination) {
        setCustomPrompt(`My trip to ${tripMetadata.destination}`);
      }
    }
  }, [tripMetadata]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Limit to 10 files
      const newFiles = [...selectedMediaFiles, ...files].slice(0, 10);
      setSelectedMediaFiles(newFiles);
      
      // Generate previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setMediaPreviews(newPreviews);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedMediaFiles];
    newFiles.splice(index, 1);
    setSelectedMediaFiles(newFiles);
    
    const newPreviews = [...mediaPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);
  };
  
  // Generate content
  const handleGenerateContent = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate social media content",
        variant: "destructive",
      });
      return;
    }
    
    if (customPrompt.trim() === "") {
      toast({
        title: "Content Required",
        description: "Please provide details about your trip",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Call AI content generation API
      const response = await fetch('/api/social/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customPrompt,
          postType,
          platform,
          tone,
          includeHashtags: isIncludeHashtags,
          mediaCount: selectedMediaFiles.length
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error generating content: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set generated content
      setGeneratedContent(data);
      setEditedCaption(data.caption);
      
      toast({
        title: "Content Generated!",
        description: "Your social media post has been created",
      });
      
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Failed",
        description: "Couldn't generate content. Please try again later.",
        variant: "destructive",
      });
      
      // Fallback sample content
      setGeneratedContent({
        caption: "Just explored the beautiful trails of [destination]! The views were absolutely breathtaking and the local cuisine was incredible. Can't wait to come back!",
        hashtags: ["#travel", "#adventure", "#wanderlust", "#jetai", "#exploremore"],
        title: "My Amazing Journey",
        suggestedTime: "Best posted between 5-7 PM local time"
      });
      setEditedCaption("Just explored the beautiful trails of [destination]! The views were absolutely breathtaking and the local cuisine was incredible. Can't wait to come back!");
      
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Export/Share post
  const handleExportPost = async () => {
    if (!generatedContent) return;
    
    try {
      setIsExporting(true);
      
      // If media files are provided, upload them first
      let mediaUrls: string[] = [];
      if (selectedMediaFiles.length > 0) {
        const formData = new FormData();
        selectedMediaFiles.forEach((file, index) => {
          formData.append(`media_${index}`, file);
        });
        
        formData.append('caption', editedCaption);
        formData.append('hashtags', JSON.stringify(generatedContent.hashtags));
        formData.append('platform', platform);
        
        const uploadResponse = await fetch('/api/social/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload media');
        }
        
        const uploadData = await uploadResponse.json();
        mediaUrls = uploadData.mediaUrls || [];
      }
      
      // Share to selected platform (or save draft)
      const shareResponse = await fetch('/api/social/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: editedCaption,
          hashtags: generatedContent.hashtags,
          mediaUrls,
          platform,
          postType,
        }),
        credentials: 'include'
      });
      
      if (!shareResponse.ok) {
        throw new Error('Failed to share content');
      }
      
      toast({
        title: "Content Ready for Sharing!",
        description: `Your ${postType} has been prepared for ${platform}`,
      });
      
      // Reset form
      setIsOpen(false);
      setSelectedMediaFiles([]);
      setMediaPreviews([]);
      setCustomPrompt("");
      setGeneratedContent(null);
      setEditedCaption("");
      
      // Clean up object URLs
      mediaPreviews.forEach(URL.revokeObjectURL);
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error sharing content:", error);
      toast({
        title: "Sharing Failed",
        description: "Couldn't share your content. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Clean up object URLs when component is unmounted
  useEffect(() => {
    return () => {
      mediaPreviews.forEach(URL.revokeObjectURL);
    };
  }, [mediaPreviews]);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4a89dc] hover:bg-[#3b7dd4] rounded-full flex items-center">
          <Sparkles className="mr-2 h-4 w-4" />
          Create Social Post
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            AI-Powered Social Media Content Creator
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="create" className="w-full mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedContent}>Preview</TabsTrigger>
            <TabsTrigger value="export" disabled={!generatedContent}>Export</TabsTrigger>
          </TabsList>
          
          {/* CREATE TAB */}
          <TabsContent value="create" className="space-y-4 mt-4">
            {/* Content Type Selection */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postType">Content Type</Label>
                <Select value={postType} onValueChange={(value: any) => setPostType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Regular Post</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="reel">Reel/Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Content Tone</Label>
                <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="adventurous">Adventurous</SelectItem>
                    <SelectItem value="luxurious">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Trip Details */}
            <div className="space-y-2">
              <Label htmlFor="tripDetails">Trip Details</Label>
              <Textarea
                id="tripDetails"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Share details about your trip (destination, activities, highlights, feelings, etc.)"
                className="min-h-[120px]"
              />
            </div>
            
            {/* Media Upload */}
            <div className="space-y-2">
              <Label htmlFor="media" className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-1 text-gray-500" /> 
                Upload Photos/Videos
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="media"
                  ref={mediaFileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => mediaFileInputRef.current?.click()}
                  disabled={selectedMediaFiles.length >= 10}
                >
                  {selectedMediaFiles.length > 0 
                    ? `${selectedMediaFiles.length} file(s) selected ${selectedMediaFiles.length >= 10 ? '(max)' : ''}`
                    : "Select Media Files"
                  }
                </Button>
              </div>
              
              {/* Media Previews */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {mediaPreviews.map((preview, index) => (
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
            
            {/* Additional Options */}
            <div className="flex items-center space-x-2">
              <Switch
                id="includeHashtags"
                checked={isIncludeHashtags}
                onCheckedChange={setIsIncludeHashtags}
              />
              <Label htmlFor="includeHashtags" className="cursor-pointer">
                Generate hashtags
              </Label>
            </div>
            
            {/* Generate Button */}
            <Button 
              className="w-full bg-[#4a89dc] hover:bg-[#3b7dd4] mt-4"
              onClick={handleGenerateContent}
              disabled={isGenerating || customPrompt.trim() === ""}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Content
                </>
              )}
            </Button>
          </TabsContent>
          
          {/* PREVIEW TAB */}
          <TabsContent value="preview" className="space-y-4 mt-4">
            {generatedContent && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="caption">Caption</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => setEditedCaption(generatedContent.caption)}
                    >
                      Reset
                    </Button>
                  </div>
                  <Textarea
                    id="caption"
                    value={editedCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                {isIncludeHashtags && generatedContent.hashtags && (
                  <div className="space-y-2">
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                      {generatedContent.hashtags.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-[#4a89dc] text-white px-2 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {generatedContent.suggestedTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                    <Clock className="h-4 w-4" />
                    <span>{generatedContent.suggestedTime}</span>
                  </div>
                )}
                
                {mediaPreviews.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Media Preview</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {mediaPreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Media ${index + 1}`}
                          className="rounded-md object-cover aspect-square w-full"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleGenerateContent()}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    className="bg-[#4a89dc] hover:bg-[#3b7dd4]"
                    onClick={() => document.querySelector('[data-value="export"]')?.dispatchEvent(new MouseEvent('click'))}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Continue to Export
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* EXPORT TAB */}
          <TabsContent value="export" className="space-y-4 mt-4">
            {generatedContent && (
              <>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    {platform === 'instagram' && <Instagram className="h-6 w-6 text-[#E1306C]" />}
                    {platform === 'facebook' && <Facebook className="h-6 w-6 text-[#4267B2]" />}
                    {platform === 'twitter' && <Twitter className="h-6 w-6 text-[#1DA1F2]" />}
                    {platform === 'tiktok' && 
                      <div className="font-bold text-lg">TikTok</div>
                    }
                    <h3 className="font-medium">Ready to share to {platform}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Post Preview</h4>
                      <div className="border rounded-md p-3 bg-gray-50">
                        <p className="text-sm">{editedCaption}</p>
                        {isIncludeHashtags && generatedContent.hashtags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {generatedContent.hashtags.map((tag, index) => (
                              <span key={index} className="text-[#4a89dc] text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Media Files ({selectedMediaFiles.length})</h4>
                      <div className="border rounded-md p-3 flex items-center justify-center h-24 bg-gray-50">
                        {selectedMediaFiles.length > 0 ? (
                          <div className="flex gap-1 overflow-x-auto">
                            {mediaPreviews.slice(0, 3).map((preview, index) => (
                              <img
                                key={index}
                                src={preview}
                                alt={`Media ${index + 1}`}
                                className="h-16 w-16 object-cover rounded"
                              />
                            ))}
                            {selectedMediaFiles.length > 3 && (
                              <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded">
                                +{selectedMediaFiles.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No media files selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Sharing Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button variant="outline" className="justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Save as Draft
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule Post
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => document.querySelector('[data-value="preview"]')?.dispatchEvent(new MouseEvent('click'))}
                  >
                    Back to Preview
                  </Button>
                  
                  <Button 
                    className="bg-[#4a89dc] hover:bg-[#3b7dd4]"
                    onClick={handleExportPost}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share to {platform}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}