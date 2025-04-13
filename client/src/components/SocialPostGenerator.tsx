import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Upload, 
  Sparkles, 
  Copy, 
  Download, 
  Share2, 
  Check 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { uploadMedia } from '@/lib/uploadMediaToFirebase';

type MediaType = 'Story' | 'Carousel' | 'Reel' | 'Regular Post';
type ToneType = 'Luxury' | 'Adventure' | 'Relaxed' | 'Informative' | 'Vlog';
type PlatformType = 'Instagram' | 'TikTok' | 'Facebook' | 'Pinterest' | 'YouTube';

interface GeneratedResult {
  caption: string;
  hashtags: string[];
  postingTip: string;
}

export default function SocialPostGenerator() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Form state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('Regular Post');
  const [tone, setTone] = useState<ToneType>('Adventure');
  const [keywords, setKeywords] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('Instagram');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Result state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setMediaPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate post content with AI
  const generatePost = async () => {
    if (!keywords) {
      toast({
        title: "Missing information",
        description: "Please enter some keywords or a description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest(
        'POST',
        '/api/social/generate-social-post',
        {
          mediaType,
          tone,
          keywords,
          platform
        }
      );
      
      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Post Generated",
        description: "AI has created your social post content",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate post content. Please try again.",
        variant: "destructive"
      });
      console.error('Error generating post:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Upload media to Firebase
  const uploadToFirebase = async () => {
    if (!mediaFile || !user) {
      toast({
        title: "Cannot Upload",
        description: "Please select a file and make sure you're logged in",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const url = await uploadMedia(mediaFile, user.id.toString());
      setMediaUrl(url);
      
      toast({
        title: "Upload Successful",
        description: "Your media has been uploaded",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not upload media. Please try again.",
        variant: "destructive"
      });
      console.error('Error uploading media:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Save post to database
  const savePost = async () => {
    if (!result || !mediaUrl) {
      toast({
        title: "Cannot Save",
        description: "Please generate content and upload your media first",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await apiRequest(
        'POST',
        '/api/social/save-social-post',
        {
          userId: user?.id,
          mediaUrl,
          caption: result.caption,
          hashtags: result.hashtags,
          platform: [platform],
          type: mediaType,
          tone,
          scheduledFor: selectedDate && selectedTime 
            ? new Date(`${selectedDate}T${selectedTime}`) 
            : null
        }
      );
      
      const data = await response.json();
      
      toast({
        title: "Post Saved",
        description: data.message || "Your post has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save your post. Please try again.",
        variant: "destructive"
      });
      console.error('Error saving post:', error);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Social Media Content Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Social Post</CardTitle>
            <CardDescription>
              Upload your media and customize the settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Media Upload */}
            <div>
              <Label htmlFor="media">Upload Photo or Video</Label>
              <div 
                className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-[#4a89dc]/5"
                onClick={() => document.getElementById('media')?.click()}
              >
                {mediaPreview ? (
                  <div className="relative">
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMediaFile(null);
                        setMediaPreview(null);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, GIF or MP4 (max. 10MB)
                    </p>
                  </div>
                )}
                <input
                  id="media"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Media Type */}
              <div>
                <Label htmlFor="type">Post Type</Label>
                <Select onValueChange={(value) => setMediaType(value as MediaType)} defaultValue={mediaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular Post">Regular Post</SelectItem>
                    <SelectItem value="Story">Story</SelectItem>
                    <SelectItem value="Carousel">Carousel</SelectItem>
                    <SelectItem value="Reel">Reel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Tone */}
              <div>
                <Label htmlFor="tone">Content Tone</Label>
                <Select onValueChange={(value) => setTone(value as ToneType)} defaultValue={tone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Relaxed">Relaxed</SelectItem>
                    <SelectItem value="Informative">Informative</SelectItem>
                    <SelectItem value="Vlog">Vlog Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Keywords */}
            <div>
              <Label htmlFor="keywords">Description or Keywords</Label>
              <Textarea
                id="keywords"
                placeholder="Describe your photo or enter keywords (e.g., beach sunset, vacation vibes)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="min-h-24"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Platform */}
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select onValueChange={(value) => setPlatform(value as PlatformType)} defaultValue={platform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Pinterest">Pinterest</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Scheduling */}
              <div>
                <Label>Schedule (Optional)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="relative flex-1">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="pr-10"
                    />
                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={uploadToFirebase} disabled={!mediaFile || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            <Button onClick={generatePost} disabled={isGenerating || !keywords}>
              {isGenerating ? 'Generating...' : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Result Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Social Post</CardTitle>
            <CardDescription>
              AI-powered content ready for your social media
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="preview">
            <div className="px-6">
              <TabsList className="w-full">
                <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="preview" className="p-0">
              <CardContent className="pt-6">
                {mediaPreview ? (
                  <div className="aspect-square max-h-80 mb-4 overflow-hidden rounded-md mx-auto">
                    <img 
                      src={mediaPreview} 
                      alt="Post" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square max-h-80 mb-4 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-400">Upload media to preview</p>
                  </div>
                )}
                
                {result ? (
                  <div className="space-y-4 mt-2">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Caption</h3>
                      <div className="p-3 bg-gray-50 rounded text-sm relative">
                        {result.caption}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => copyToClipboard(result.caption)}
                        >
                          {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Hashtags</h3>
                      <div className="flex flex-wrap gap-1">
                        {result.hashtags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-[#4a89dc]/10 text-[#4a89dc] text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Posting Tip</h3>
                      <p className="text-sm text-gray-600">{result.postingTip}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Generate content to see preview</p>
                  </div>
                )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="edit">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="edit-caption">Caption</Label>
                  <Textarea 
                    id="edit-caption"
                    value={result?.caption || ''}
                    onChange={(e) => setResult(prev => prev ? {...prev, caption: e.target.value} : null)}
                    placeholder="Enter your caption"
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-hashtags">Hashtags (comma separated)</Label>
                  <Input 
                    id="edit-hashtags"
                    value={result?.hashtags.join(', ') || ''}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      setResult(prev => prev ? {...prev, hashtags: tags} : null);
                    }}
                    placeholder="#travel, #adventure"
                  />
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(
                `${result?.caption || ''}\n\n${(result?.hashtags || []).join(' ')}`
              )} disabled={!result}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button variant="outline" size="sm" disabled={!mediaPreview}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" disabled={!result}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <h3 className="font-medium mb-2">Share to Platform</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="#E4405F" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="#1877F2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="#000000" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                      TikTok
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              onClick={savePost} 
              className="bg-[#4a89dc] hover:bg-[#3a79cc]"
              disabled={!result || !mediaUrl}
            >
              Save Post
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}