import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { MapPinIcon, HeartIcon, MessageSquareIcon, ShareIcon, GlobeIcon, UserIcon } from 'lucide-react';
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

// Sample data for community posts
const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Emma Wilson',
      avatar: '/avatars/emma.jpg',
      location: 'London, UK'
    },
    content: "Just discovered this hidden gem in Kyoto! The Arashiyama Bamboo Grove is even more breathtaking in person. The morning light filtering through the towering bamboo creates an almost magical atmosphere. Definitely worth waking up early to avoid the crowds.",
    images: ['/community/kyoto-bamboo.jpg', '/community/kyoto-temple.jpg'],
    location: {
      name: 'Arashiyama Bamboo Grove, Kyoto, Japan',
      coordinates: {
        lat: 35.0160, 
        lng: 135.6711
      }
    },
    tags: ['Japan', 'Kyoto', 'NatureLovers', 'Photography'],
    likes: 248,
    comments: 42,
    isLiked: false,
    createdAt: new Date('2025-04-10')
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'James Rodriguez',
      avatar: '/avatars/james.jpg',
      location: 'Barcelona, Spain'
    },
    content: "Trekking through Patagonia has been on my bucket list for years, and it did not disappoint! The landscapes are absolutely breathtaking and change dramatically as you move through different areas. Torres del Paine was the highlight - those granite peaks against the turquoise lakes are unforgettable.",
    images: ['/community/patagonia-mountains.jpg'],
    location: {
      name: 'Torres del Paine, Patagonia, Chile',
      coordinates: {
        lat: -51.0310, 
        lng: -73.0599
      }
    },
    tags: ['Patagonia', 'Chile', 'Hiking', 'Mountains', 'Adventure'],
    likes: 312,
    comments: 56,
    isLiked: true,
    createdAt: new Date('2025-04-08')
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Sophia Chen',
      avatar: '/avatars/sophia.jpg',
      location: 'Singapore'
    },
    content: "Food tour in Bangkok's Chinatown (Yaowarat) was the highlight of my trip to Thailand! From incredible seafood at Rut & Lek to the best pad thai at Thipsamai, and endless street food stalls in between. Pro tip: Go hungry and pace yourself, there's so much to try!",
    images: ['/community/bangkok-food.jpg', '/community/bangkok-market.jpg'],
    location: {
      name: 'Yaowarat (Chinatown), Bangkok, Thailand',
      coordinates: {
        lat: 13.7422, 
        lng: 100.5130
      }
    },
    tags: ['Thailand', 'Bangkok', 'FoodTour', 'StreetFood', 'Culinary'],
    likes: 189,
    comments: 37,
    isLiked: false,
    createdAt: new Date('2025-04-11')
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
  
  const handleCreatePost = () => {
    toast({
      title: "Coming Soon",
      description: "Create post functionality will be available soon!",
    });
  };
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Global Travel Community</h1>
        <p className="text-center text-muted-foreground mb-6">
          Connect with travelers worldwide, share experiences, and discover hidden gems
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <Input 
            placeholder="Search destinations, travelers, or tags..." 
            className="max-w-md"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button className="bg-[#4a89dc] hover:bg-[#3a79cc]">
            Search
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
              <Button variant="ghost" className="w-full justify-start text-left">
                <GlobeIcon className="mr-2 h-4 w-4" />
                <span>Trending Destinations</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <HeartIcon className="mr-2 h-4 w-4" />
                <span>Popular Experiences</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Featured Travelers</span>
              </Button>
              
              <Separator className="my-2" />
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {['Adventure', 'Foodie', 'Culture', 'Beach', 'City', 'Mountains', 'Budget', 'Luxury'].map(tag => (
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
            
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc]" onClick={handleCreatePost}>
              Share Experience
            </Button>
          </div>
          
          {/* Posts */}
          <div className="space-y-2">
            {SAMPLE_POSTS.map(post => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}