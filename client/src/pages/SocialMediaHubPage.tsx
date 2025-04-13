import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SocialPostGenerator } from "@/components/SocialPostGenerator";
import { 
  Sparkles, 
  Instagram, 
  Facebook, 
  Twitter, 
  Menu, 
  BarChart2, 
  Loader2, 
  Calendar, 
  Image as ImageIcon,
  Video,
  Heart,
  MessageSquare,
  Share,
  Clock,
  UserIcon
} from "lucide-react";

interface SocialPost {
  id: string;
  content: string;
  mediaUrls: string[];
  platform: string;
  postType: string;
  likes: number;
  comments: number;
  shares: number;
  publishedAt: string; // ISO string
  status: 'draft' | 'published' | 'scheduled';
  scheduledFor?: string; // ISO string, optional
  analytics?: {
    impressions: number;
    engagement: number;
    clicks: number;
  };
}

export default function SocialMediaHubPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch social posts
  useEffect(() => {
    async function fetchSocialPosts() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/social/posts', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        } else {
          console.error("Failed to fetch social posts");
        }
      } catch (error) {
        console.error("Error fetching social posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSocialPosts();
  }, [user]);

  // Filter posts by platform
  const filteredPosts = selectedPlatform === "all" 
    ? posts 
    : posts.filter(post => post.platform === selectedPlatform);
  
  // Group posts by status
  const draftPosts = filteredPosts.filter(post => post.status === 'draft');
  const publishedPosts = filteredPosts.filter(post => post.status === 'published');
  const scheduledPosts = filteredPosts.filter(post => post.status === 'scheduled');
  
  // Handle successful post creation
  const handlePostSuccess = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/social/posts', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        
        toast({
          title: "Content Created!",
          description: "Your social post has been created successfully",
        });
      }
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Social Media Hub</h1>
        <p className="text-muted-foreground mb-6">
          Create, schedule, and manage your travel content across multiple platforms
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={selectedPlatform === "all" ? "bg-secondary" : ""}
              onClick={() => setSelectedPlatform("all")}
            >
              All Platforms
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={selectedPlatform === "instagram" ? "bg-secondary" : ""}
              onClick={() => setSelectedPlatform("instagram")}
            >
              <Instagram className="h-4 w-4 mr-2 text-[#E1306C]" />
              Instagram
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={selectedPlatform === "facebook" ? "bg-secondary" : ""}
              onClick={() => setSelectedPlatform("facebook")}
            >
              <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={selectedPlatform === "twitter" ? "bg-secondary" : ""}
              onClick={() => setSelectedPlatform("twitter")}
            >
              <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
              Twitter
            </Button>
          </div>
          
          <SocialPostGenerator onSuccess={handlePostSuccess} />
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Analytics & Overview */}
        <div className="col-span-1 order-2 lg:order-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Social Media Analytics</CardTitle>
              <CardDescription>Performance overview of your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Followers</span>
                  <span className="text-sm font-bold">5,280</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Posts</span>
                  <span className="text-sm font-bold">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Engagement</span>
                  <span className="text-sm font-bold">12,436</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Likes</span>
                  <span className="text-sm font-bold">342</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-3">Platform Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Instagram className="h-4 w-4 mr-2 text-[#E1306C]" />
                      <span className="text-sm">Instagram</span>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E1306C]" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-xs font-medium">65%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
                      <span className="text-sm">Facebook</span>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4267B2]" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-xs font-medium">20%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
                      <span className="text-sm">Twitter</span>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1DA1F2]" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-xs font-medium">15%</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-2">
                <BarChart2 className="mr-2 h-4 w-4" />
                Detailed Analytics
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Content Calendar</CardTitle>
              <CardDescription>Upcoming scheduled posts</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {scheduledPosts.length > 0 ? (
                  <div className="space-y-3">
                    {scheduledPosts.map(post => (
                      <div key={post.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div className="bg-gray-100 rounded-md flex items-center justify-center p-2">
                          {post.platform === 'instagram' && <Instagram className="h-4 w-4 text-[#E1306C]" />}
                          {post.platform === 'facebook' && <Facebook className="h-4 w-4 text-[#4267B2]" />}
                          {post.platform === 'twitter' && <Twitter className="h-4 w-4 text-[#1DA1F2]" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm line-clamp-2">{post.content.substring(0, 60)}...</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.scheduledFor || "").toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No scheduled posts</p>
                    <Button 
                      variant="link" 
                      onClick={() => document.querySelector('button:has(.create-post-trigger)')?.click()}
                      className="mt-2"
                    >
                      Schedule a new post
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 lg:col-span-2 order-1 lg:order-2">
          <Tabs defaultValue="published">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            
            {/* PUBLISHED CONTENT */}
            <TabsContent value="published" className="mt-4">
              {isLoading ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#4a89dc] mb-4" />
                  <p className="text-muted-foreground">Loading your social posts...</p>
                </div>
              ) : publishedPosts.length > 0 ? (
                <div className="space-y-4">
                  {publishedPosts.map(post => (
                    <SocialPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border rounded-lg bg-gray-50">
                  <div className="mx-auto h-12 w-12 text-muted-foreground mb-3">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No published posts yet</h3>
                  <p className="text-muted-foreground mb-4">Create and share your first social post</p>
                  <SocialPostGenerator onSuccess={handlePostSuccess} />
                </div>
              )}
            </TabsContent>
            
            {/* SCHEDULED CONTENT */}
            <TabsContent value="scheduled" className="mt-4">
              {isLoading ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#4a89dc] mb-4" />
                  <p className="text-muted-foreground">Loading scheduled posts...</p>
                </div>
              ) : scheduledPosts.length > 0 ? (
                <div className="space-y-4">
                  {scheduledPosts.map(post => (
                    <SocialPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border rounded-lg bg-gray-50">
                  <div className="mx-auto h-12 w-12 text-muted-foreground mb-3">
                    <Calendar className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No scheduled posts</h3>
                  <p className="text-muted-foreground mb-4">Plan ahead by scheduling your content</p>
                  <SocialPostGenerator onSuccess={handlePostSuccess} />
                </div>
              )}
            </TabsContent>
            
            {/* DRAFT CONTENT */}
            <TabsContent value="drafts" className="mt-4">
              {isLoading ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#4a89dc] mb-4" />
                  <p className="text-muted-foreground">Loading draft posts...</p>
                </div>
              ) : draftPosts.length > 0 ? (
                <div className="space-y-4">
                  {draftPosts.map(post => (
                    <SocialPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border rounded-lg bg-gray-50">
                  <div className="mx-auto h-12 w-12 text-muted-foreground mb-3">
                    <Menu className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No draft posts</h3>
                  <p className="text-muted-foreground mb-4">Create drafts to work on later</p>
                  <SocialPostGenerator onSuccess={handlePostSuccess} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Social Post Card Component
function SocialPostCard({ post }: { post: SocialPost }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {post.platform === 'instagram' && <Instagram className="h-5 w-5 text-[#E1306C]" />}
            {post.platform === 'facebook' && <Facebook className="h-5 w-5 text-[#4267B2]" />}
            {post.platform === 'twitter' && <Twitter className="h-5 w-5 text-[#1DA1F2]" />}
            <div>
              <CardTitle className="text-sm">
                {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} {post.postType}
              </CardTitle>
              <CardDescription className="text-xs">
                {post.status === 'published' 
                  ? `Published on ${formatDate(post.publishedAt)}`
                  : post.status === 'scheduled'
                    ? `Scheduled for ${formatDate(post.scheduledFor || '')}`
                    : 'Draft'}
              </CardDescription>
            </div>
          </div>
          
          <Badge 
            variant={post.status === 'published' ? 'default' : post.status === 'scheduled' ? 'outline' : 'secondary'}
            className="capitalize"
          >
            {post.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm mb-3">{post.content}</p>
        
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {post.mediaUrls.slice(0, 4).map((url, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-md bg-gray-100 overflow-hidden relative"
              >
                <img 
                  src={url} 
                  alt={`Media ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                {index === 3 && post.mediaUrls.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-medium">
                    +{post.mediaUrls.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {post.analytics && (
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="font-bold">{post.analytics.impressions.toLocaleString()}</p>
              <p className="text-muted-foreground">Impressions</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="font-bold">{post.analytics.engagement.toLocaleString()}</p>
              <p className="text-muted-foreground">Engagement</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="font-bold">{post.analytics.clicks.toLocaleString()}</p>
              <p className="text-muted-foreground">Clicks</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
            <Heart className="h-4 w-4" /> 
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-4 w-4" /> 
            <span>{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
            <Share className="h-4 w-4" /> 
            <span>{post.shares}</span>
          </Button>
        </div>
        
        <div>
          <Button variant="outline" size="sm">
            {post.status === 'draft' 
              ? 'Edit Draft' 
              : post.status === 'scheduled' 
                ? 'Reschedule' 
                : 'Boost Post'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}