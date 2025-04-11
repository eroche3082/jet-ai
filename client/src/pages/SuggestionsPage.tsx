import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar as CalendarIcon, 
  PlaneTakeoff, 
  Hotel, 
  MapPin,
  Star, 
  ThumbsUp,
  MessageCircle,
  Sparkles,
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  CalendarDays,
  Users,
  Utensils,
  Camera,
  Heart,
  Lightbulb
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

// Types
interface Suggestion {
  id: string;
  type: 'destination' | 'experience' | 'hotel' | 'restaurant' | 'tip';
  title: string;
  description: string;
  location?: string;
  tags: string[];
  imageUrl?: string;
  rating?: number;
  priceIndicator?: string;
  recommended?: boolean;
  trendingScore?: number;
  bestTime?: string;
}

export default function SuggestionsPage() {
  const [activeTab, setActiveTab] = useState<string>('for-you');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  
  // Generate sample suggestions for demonstration
  const generateSampleSuggestions = (): Suggestion[] => {
    return [
      {
        id: '1',
        type: 'destination',
        title: 'Santorini, Greece',
        description: 'Famous for stunning sunsets, white-washed buildings, and blue domes overlooking the Aegean Sea.',
        location: 'Greece',
        tags: ['Island', 'Romantic', 'Views'],
        imageUrl: 'https://placehold.co/800x500/d1d5db/6b7280?text=Santorini',
        rating: 4.8,
        priceIndicator: '$$$',
        recommended: true,
        trendingScore: 92,
        bestTime: 'May to October'
      },
      {
        id: '2',
        type: 'experience',
        title: 'Northern Lights Tour',
        description: 'Witness the magical aurora borealis dancing across the Arctic sky, one of nature\'s most spectacular displays.',
        location: 'Iceland',
        tags: ['Nature', 'Winter', 'Photography'],
        imageUrl: 'https://placehold.co/800x500/d1d5db/6b7280?text=Northern+Lights',
        rating: 4.9,
        priceIndicator: '$$',
        recommended: true,
        trendingScore: 87,
        bestTime: 'September to March'
      },
      {
        id: '3',
        type: 'hotel',
        title: 'Underwater Suite, Atlantis The Palm',
        description: 'Luxury suite with floor-to-ceiling windows looking directly into the Ambassador Lagoon aquarium.',
        location: 'Dubai, UAE',
        tags: ['Luxury', 'Unique', 'Romantic'],
        imageUrl: 'https://placehold.co/800x500/d1d5db/6b7280?text=Underwater+Suite',
        rating: 4.7,
        priceIndicator: '$$$$$',
        recommended: true,
        trendingScore: 78
      },
      {
        id: '4',
        type: 'restaurant',
        title: 'Noma',
        description: 'Renowned for its reinvention and interpretation of Nordic cuisine, multiple-time winner of World\'s Best Restaurant.',
        location: 'Copenhagen, Denmark',
        tags: ['Fine Dining', 'Nordic', 'Innovative'],
        imageUrl: 'https://placehold.co/800x500/d1d5db/6b7280?text=Noma',
        rating: 4.9,
        priceIndicator: '$$$$$',
        recommended: true
      },
      {
        id: '5',
        type: 'tip',
        title: 'Pack a Portable Charger',
        description: 'Never run out of battery while traveling. A good quality power bank is essential for keeping your devices charged on long journeys.',
        tags: ['Packing', 'Technology', 'Essential'],
        recommended: true
      },
      {
        id: '6',
        type: 'destination',
        title: 'Kyoto, Japan',
        description: 'Ancient temples, traditional gardens, and geisha districts showcase Japan\'s cultural heritage.',
        location: 'Japan',
        tags: ['Culture', 'History', 'Temple'],
        imageUrl: 'https://placehold.co/800x500/d1d5db/6b7280?text=Kyoto',
        rating: 4.7,
        priceIndicator: '$$$',
        trendingScore: 85,
        bestTime: 'March-May and October-November'
      },
      {
        id: '7',
        type: 'experience',
        title: 'Hot Air Balloon Over Cappadocia',
        description: 'Float over the surreal landscape of fairy chimneys and unique rock formations at sunrise.',
        location: 'Cappadocia, Turkey',
        tags: ['Adventure', 'Views', 'Photography'],
        imageUrl: 'https://placehold.co/800x500/d1d5db/6b7280?text=Cappadocia',
        rating: 4.9,
        priceIndicator: '$$$',
        trendingScore: 94,
        bestTime: 'April to November'
      },
      {
        id: '8',
        type: 'tip',
        title: 'Learn Basic Local Phrases',
        description: 'Even just knowing how to say "hello," "thank you," and "please" in the local language can enhance your travel experience significantly.',
        tags: ['Culture', 'Communication', 'Respect'],
        recommended: true
      }
    ];
  };
  
  const suggestions = generateSampleSuggestions();
  
  // Filter suggestions based on active tab and search query
  useEffect(() => {
    let filtered = [...suggestions];
    
    // Filter by tab
    if (activeTab === 'for-you') {
      filtered = filtered.filter(item => item.recommended);
    } else if (activeTab === 'trending') {
      filtered = filtered
        .filter(item => item.trendingScore && item.trendingScore > 80)
        .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
    } else if (activeTab === 'seasonal') {
      // For demo, seasonal will show items that are best in current season
      const currentMonth = new Date().getMonth();
      const isSummer = currentMonth >= 5 && currentMonth <= 8;
      const isWinter = currentMonth <= 1 || currentMonth >= 10;
      
      filtered = filtered.filter(item => {
        if (isSummer && item.bestTime && (item.bestTime.includes('Summer') || item.bestTime.includes('June') || item.bestTime.includes('July') || item.bestTime.includes('August'))) {
          return true;
        }
        if (isWinter && item.bestTime && (item.bestTime.includes('Winter') || item.bestTime.includes('December') || item.bestTime.includes('January') || item.bestTime.includes('February'))) {
          return true;
        }
        return false;
      });
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        (item.location && item.location.toLowerCase().includes(query)) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredSuggestions(filtered);
  }, [activeTab, searchQuery, suggestions]);
  
  // Get icon for suggestion type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'destination':
        return <MapPin className="h-5 w-5" />;
      case 'experience':
        return <Camera className="h-5 w-5" />;
      case 'hotel':
        return <Hotel className="h-5 w-5" />;
      case 'restaurant':
        return <Utensils className="h-5 w-5" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };
  
  // Get badge color for suggestion type
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'destination':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'experience':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'hotel':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'restaurant':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'tip':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Suggestions</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
            <TabsTrigger value="for-you">
              <Sparkles className="w-4 h-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="seasonal">
              <CalendarDays className="w-4 h-4 mr-2" />
              Seasonal
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search suggestions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredSuggestions.length === 0 ? (
        <Card className="w-full p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Suggestions Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any travel suggestions matching your criteria. Try different filters or a new search term.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="overflow-hidden flex flex-col h-full">
              {suggestion.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={suggestion.imageUrl} 
                    alt={suggestion.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/800x500/d1d5db/6b7280?text=${encodeURIComponent(suggestion.title)}`;
                    }}
                  />
                </div>
              )}
              
              <CardContent className={suggestion.imageUrl ? 'p-4 flex-1' : 'p-4 flex-1'}>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getTypeBadgeClass(suggestion.type)}>
                    <div className="flex items-center">
                      {getTypeIcon(suggestion.type)}
                      <span className="ml-1 capitalize">{suggestion.type}</span>
                    </div>
                  </Badge>
                  
                  {suggestion.trendingScore && suggestion.trendingScore > 85 && (
                    <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-medium text-lg mb-2">{suggestion.title}</h3>
                
                {suggestion.location && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {suggestion.location}
                  </div>
                )}
                
                <p className="text-sm flex-1">{suggestion.description}</p>
                
                {suggestion.bestTime && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Best time: {suggestion.bestTime}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {suggestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="px-4 py-3 border-t flex justify-between">
                <div className="flex items-center space-x-4">
                  {suggestion.rating && (
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{suggestion.rating}</span>
                    </div>
                  )}
                  
                  {suggestion.priceIndicator && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {suggestion.priceIndicator}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Save</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MessageCircle className="h-4 w-4" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Separator className="my-8" />
      
      <div className="rounded-lg border bg-gray-50 dark:bg-gray-800/50 p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
        <p className="mb-6">Based on your previous trips and preferences, you might enjoy these destinations:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                Portugal
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Solo friendly
                </Badge>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  87% match
                </div>
              </div>
              <div className="text-sm">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                <span>Best time: May-October</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border">
            <div className="h-32 bg-gradient-to-r from-green-500 to-yellow-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                Vietnam
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Budget friendly
                </Badge>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  82% match
                </div>
              </div>
              <div className="text-sm">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                <span>Best time: Nov-April</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border">
            <div className="h-32 bg-gradient-to-r from-amber-500 to-red-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                Croatia
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  <Hotel className="h-3 w-3 mr-1" />
                  Great accommodations
                </Badge>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  79% match
                </div>
              </div>
              <div className="text-sm">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                <span>Best time: June-September</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border">
            <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-600 relative">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                Costa Rica
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  <Camera className="h-3 w-3 mr-1" />
                  Photo-worthy
                </Badge>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  75% match
                </div>
              </div>
              <div className="text-sm">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                <span>Best time: Dec-April</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}