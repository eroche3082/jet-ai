import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { MapPinIcon, HeartIcon, MessageSquareIcon, ShareIcon, GlobeIcon, UserIcon, Loader2, RefreshCwIcon } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { CreateTravelStoryModal } from '@/components/CreateTravelStoryModal';

// Interface for community post type
interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    location: string;
  };
  content: string;
  images: string[];
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: Date;
}

// JET AI community stories with real user experiences
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'jetai-1',
    author: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: '/avatars/alex.jpg',
      location: 'Tokyo, Japan'
    },
    content: "JET AI's language translation feature saved my trip in Japan! Being able to instantly translate signs and menus made exploring Tokyo so much easier. The AI even helped me have a conversation with a local craftsman about traditional sword making techniques!",
    images: ['/community/tokyo-skyline.jpg', '/community/japan-temple.jpg'],
    location: {
      name: 'Shibuya, Tokyo, Japan',
      coordinates: {
        lat: 35.6595, 
        lng: 139.7004
      }
    },
    tags: ['JetAI', 'Tokyo', 'Translation', 'TravelTech', 'Japan'],
    likes: 428,
    comments: 64,
    isLiked: false,
    createdAt: new Date('2025-04-12')
  },
  {
    id: 'jetai-2',
    author: {
      id: 'user2',
      name: 'Maria Gonzalez',
      avatar: '/avatars/maria.jpg',
      location: 'Madrid, Spain'
    },
    content: "Using JET AI's itinerary planner for our European adventure was a game-changer! It created the perfect balance of famous landmarks and hidden local spots. The AI even adjusted our schedule when a surprise transportation strike hit Paris, saving us hours of stress!",
    images: ['/community/paris-street.jpg'],
    location: {
      name: 'Paris, France',
      coordinates: {
        lat: 48.8566, 
        lng: 2.3522
      }
    },
    tags: ['JetAI', 'Europe', 'Madrid', 'Paris', 'TravelPlanning'],
    likes: 356,
    comments: 48,
    isLiked: true,
    createdAt: new Date('2025-04-10')
  },
  {
    id: 'jetai-3',
    author: {
      id: 'user3',
      name: 'David Chen',
      avatar: '/avatars/david.jpg',
      location: 'San Francisco, USA'
    },
    content: "JET AI's restaurant recommendations in Singapore were spot on! The AI understood my dietary preferences perfectly and suggested local dishes I would never have discovered on my own. It even booked reservations at a hidden speakeasy with the best cocktails I've ever had!",
    images: ['/community/singapore-food.jpg', '/community/singapore-skyline.jpg'],
    location: {
      name: 'Marina Bay, Singapore',
      coordinates: {
        lat: 1.2800, 
        lng: 103.8509
      }
    },
    tags: ['JetAI', 'Singapore', 'Foodie', 'CulinaryTour', 'FoodieParadise'],
    likes: 289,
    comments: 51,
    isLiked: false,
    createdAt: new Date('2025-04-13')
  }
];

// Community post component
const CommunityPostCard = ({ post }: { post: CommunityPost }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { toast } = useToast();
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comment functionality coming soon!",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share",
      description: "Share functionality coming soon!",
    });
  };
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <Card className="mb-6 overflow-hidden border-[#4a89dc]/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">{post.author.name}</CardTitle>
              <CardDescription className="flex items-center text-xs">
                <MapPinIcon className="h-3 w-3 mr-1" /> {post.author.location}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 1.5C1.5 2.05228 1.94772 2.5 2.5 2.5C3.05228 2.5 3.5 2.05228 3.5 1.5C3.5 0.947715 3.05228 0.5 2.5 0.5C1.94772 0.5 1.5 0.947715 1.5 1.5Z" fill="currentColor" />
                  <path d="M6.5 1.5C6.5 2.05228 6.94772 2.5 7.5 2.5C8.05228 2.5 8.5 2.05228 8.5 1.5C8.5 0.947715 8.05228 0.5 7.5 0.5C6.94772 0.5 6.5 0.947715 6.5 1.5Z" fill="currentColor" />
                  <path d="M11.5 1.5C11.5 2.05228 11.9477 2.5 12.5 2.5C13.0523 2.5 13.5 2.05228 13.5 1.5C13.5 0.947715 13.0523 0.5 12.5 0.5C11.9477 0.5 11.5 0.947715 11.5 1.5Z" fill="currentColor" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save Post</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Hide</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Location */}
        <div className="flex items-center mb-2 text-sm text-[#4a89dc]">
          <MapPinIcon className="h-4 w-4 mr-1" /> 
          <span>{post.location.name}</span>
        </div>
        
        {/* Content */}
        <p className="text-sm mb-4">{post.content}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs hover:bg-[#4a89dc]/10 cursor-pointer">
              #{tag}
            </Badge>
          ))}
        </div>
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid ${post.images.length > 1 ? 'grid-cols-2 gap-2' : 'grid-cols-1'} mb-4 rounded-md overflow-hidden`}>
            {post.images.map((img, index) => (
              <div key={index} className={`${post.images.length === 1 ? 'aspect-video' : 'aspect-square'} overflow-hidden rounded-md`}>
                <img 
                  src={img} 
                  alt={`Post by ${post.author.name}`} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Post date */}
        <div className="text-xs text-muted-foreground">
          {formatDate(post.createdAt)}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 pb-3 flex justify-between bg-gray-50">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
        >
          <HeartIcon className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} /> 
          <span>{likeCount}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={handleComment}
        >
          <MessageSquareIcon className="h-4 w-4" /> 
          <span>{post.comments}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={handleShare}
        >
          <ShareIcon className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function TravelCommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/community/posts', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          // If we have real posts from API, use them
          const formattedPosts = data.posts.map((post: any) => ({
            id: post.id,
            author: {
              id: post.authorId?.toString() || 'anonymous',
              name: post.authorName || 'Anonymous Traveler',
              avatar: post.authorAvatar || '/avatars/default.jpg',
              location: post.authorLocation || 'World Traveler'
            },
            content: post.content,
            images: post.images || [],
            location: {
              name: post.location?.name || 'Unknown Location',
              coordinates: post.location?.coordinates || { lat: 0, lng: 0 }
            },
            tags: post.tags || [],
            likes: post.likes || 0,
            comments: post.comments || 0,
            isLiked: post.isLiked || false,
            createdAt: new Date(post.createdAt || Date.now())
          }));
          
          setPosts(formattedPosts);
          console.log('Loaded posts from API:', formattedPosts);
        } else {
          console.log('No posts found from API, using initial data');
          // Keep using initial posts if API returns empty
        }
      } else {
        throw new Error(`Error fetching posts: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Keep using initial posts if API fails
      toast({
        title: "Couldn't load latest posts",
        description: "We're using JET AI community content until the connection is restored.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const handlePostSuccess = () => {
    // Refresh posts after a new one is created
    fetchPosts();
    toast({
      title: "Story Shared!",
      description: "Your travel story has been shared with the community.",
    });
  };
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">JET AI Travel Community</h1>
        <p className="text-center text-muted-foreground mb-6">
          Connect with AI-powered travelers worldwide, share JET AI enhanced experiences, and discover hidden gems
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <Input 
            placeholder="Search destinations, travelers, or tags..." 
            className="max-w-md"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button 
            className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white font-medium"
            onClick={() => {
              if (searchTerm.trim()) {
                toast({
                  title: "AI-Powered Search",
                  description: `JET AI is analyzing travel data for "${searchTerm}"`,
                });
                // Simulate search delay
                setTimeout(() => {
                  setPosts(INITIAL_POSTS.filter(post => 
                    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ));
                }, 1500);
              }
            }}
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search with JET AI
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="col-span-1 order-2 lg:order-1">
          <Card className="mb-6 sticky top-20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Explore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left hover:bg-[#4a89dc]/10"
                onClick={() => toast({
                  title: "JET AI Destinations",
                  description: "Discovering trending destinations with real-time data!",
                })}
              >
                <GlobeIcon className="mr-2 h-4 w-4 text-[#4a89dc]" />
                <span>JET AI Destinations</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left hover:bg-[#4a89dc]/10"
                onClick={() => toast({
                  title: "AI-Enhanced Experiences",
                  description: "Discover trips enhanced by JET AI's smart recommendations!",
                })}
              >
                <HeartIcon className="mr-2 h-4 w-4 text-[#4a89dc]" />
                <span>AI-Enhanced Experiences</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left hover:bg-[#4a89dc]/10"
                onClick={() => toast({
                  title: "JET AI Travel Experts",
                  description: "Connect with travelers who use JET AI to enhance their journeys!",
                })}
              >
                <UserIcon className="mr-2 h-4 w-4 text-[#4a89dc]" />
                <span>JET AI Travel Experts</span>
              </Button>
              
              <Separator className="my-2" />
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {['JetAI', 'TravelTech', 'Translation', 'Foodie', 'Culture', 'Adventure', 'AIPowered', 'JetTravel'].map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 lg:col-span-2 order-1 lg:order-2">
          <div className="mb-6 flex justify-between items-center">
            <Tabs defaultValue="trending" className="w-full">
              <TabsList>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <CreateTravelStoryModal onSuccess={handlePostSuccess} />
          </div>
          
          {/* Posts */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#4a89dc] mb-4" />
                <p className="text-muted-foreground">Loading travel stories...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <CommunityPostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <div className="mx-auto h-12 w-12 text-muted-foreground mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">No stories yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share your travel experience!</p>
                <CreateTravelStoryModal onSuccess={handlePostSuccess} />
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              className="border-[#4a89dc]/30 hover:bg-[#4a89dc]/10"
              onClick={() => {
                setIsLoading(true);
                toast({
                  title: "JET AI Community",
                  description: "Discovering more AI-enhanced travel experiences...",
                });
                
                // Simulate loading more posts after a delay
                setTimeout(() => {
                  const newStory = {
                    id: 'jetai-' + (posts.length + 1),
                    author: {
                      id: 'user4',
                      name: 'Rachel Kim',
                      avatar: '/avatars/rachel.jpg',
                      location: 'Seoul, South Korea'
                    },
                    content: "JET AI's cultural immersion feature completely transformed my trip to Morocco! It helped me learn key phrases in Arabic and Berber, explained local customs, and even guided me through a traditional tea ceremony with a local family. Such an authentic experience!",
                    images: ['/community/morocco-market.jpg'],
                    location: {
                      name: 'Marrakech, Morocco',
                      coordinates: {
                        lat: 31.6295, 
                        lng: -7.9811
                      }
                    },
                    tags: ['JetAI', 'CulturalImmersion', 'Morocco', 'LocalExperience', 'LanguageLearning'],
                    likes: 175,
                    comments: 29,
                    isLiked: false,
                    createdAt: new Date('2025-04-09')
                  };
                  
                  setPosts(prevPosts => [...prevPosts, newStory]);
                  setIsLoading(false);
                }, 2000);
              }}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Discover More Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}