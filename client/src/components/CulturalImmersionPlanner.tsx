import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CustomProgress } from '@/components/custom-ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Utensils,
  MessageCircle,
  Music,
  AlertCircle,
  CheckCircle,
  InfoIcon,
  Bookmark,
  History,
  Globe,
  Umbrella,
  ShoppingBag,
  Coffee,
  PieChart,
  Mail,
  Filter,
  Brain,
  LineChart,
  Rocket
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Define types
interface TripDetails {
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  userPreferences?: string[];
}

interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  type: 'tour' | 'cultural' | 'food' | 'music' | 'activity';
  price?: number;
  bookingUrl?: string;
  imageUrl?: string;
}

interface CulturalContent {
  id: string;
  title: string;
  content: string;
  type: 'history' | 'food' | 'etiquette' | 'safety' | 'language' | 'news';
  dateAdded: Date;
  imageUrl?: string;
  sourceUrl?: string;
}

interface CulturalImmersionPlannerProps {
  tripDetails?: TripDetails;
}

export default function CulturalImmersionPlanner({ tripDetails: propsTripDetails }: CulturalImmersionPlannerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('timeline');
  const [tripDetails, setTripDetails] = useState<TripDetails | undefined>(propsTripDetails);
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [culturalContent, setCulturalContent] = useState<CulturalContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [isNewsSubscribed, setIsNewsSubscribed] = useState(false);
  
  // Mock destination for demo
  const defaultDestination = {
    destination: 'Tokyo, Japan',
    departureDate: addDays(new Date(), 45), // 45 days from now
    userPreferences: ['Food', 'History', 'Photography', 'Technology']
  };

  useEffect(() => {
    // If no trip details provided, use default
    if (!tripDetails) {
      setTripDetails(defaultDestination);
    }
    
    // Load cultural immersion data
    loadCulturalImmersionData();
  }, [tripDetails]);

  const loadCulturalImmersionData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate the data loading and set mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock events
      const mockEvents: CulturalEvent[] = [
        {
          id: '1',
          title: 'Tsukiji Fish Market Tour',
          description: 'Experience the world-famous fish market with a local guide who will take you through the best stalls and explain the history of this iconic location.',
          location: 'Tsukiji, Tokyo',
          date: addDays(new Date(), 46), // First day of trip
          type: 'food',
          price: 55,
          imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
          bookingUrl: '#'
        },
        {
          id: '2',
          title: 'Traditional Tea Ceremony',
          description: 'Learn the art of Japanese tea ceremony from a tea master in an authentic setting.',
          location: 'Asakusa, Tokyo',
          date: addDays(new Date(), 48),
          type: 'cultural',
          price: 40,
          imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3',
          bookingUrl: '#'
        },
        {
          id: '3',
          title: 'Shinjuku Night Photography Tour',
          description: 'Capture the neon lights of Tokyo\'s busiest district with photography tips from an expert.',
          location: 'Shinjuku, Tokyo',
          date: addDays(new Date(), 47),
          type: 'activity',
          price: 75,
          imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc',
          bookingUrl: '#'
        },
        {
          id: '4',
          title: 'Robot Restaurant Show',
          description: 'Experience the famous technological spectacle in the heart of Tokyo.',
          location: 'Shinjuku, Tokyo',
          date: addDays(new Date(), 50),
          type: 'activity',
          price: 80,
          imageUrl: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570',
          bookingUrl: '#'
        },
        {
          id: '5',
          title: 'Ramen Cooking Class',
          description: 'Learn to make authentic Japanese ramen from scratch with a professional chef.',
          location: 'Shibuya, Tokyo',
          date: addDays(new Date(), 49),
          type: 'food',
          price: 65,
          imageUrl: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da',
          bookingUrl: '#'
        }
      ];
      
      // Set mock cultural content
      const mockContent: CulturalContent[] = [
        {
          id: '1',
          title: 'A Brief History of Tokyo',
          content: 'Tokyo, originally known as Edo, became the capital of Japan in 1868. Learn about its transformation from a small fishing village to one of the world\'s most populous cities.',
          type: 'history',
          dateAdded: new Date(),
          imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc',
          sourceUrl: '#'
        },
        {
          id: '2',
          title: 'Essential Japanese Phrases for Travelers',
          content: 'Master these 10 basic phrases to navigate Japan more easily and show respect for the local culture.',
          type: 'language',
          dateAdded: new Date(),
          imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d',
          sourceUrl: '#'
        },
        {
          id: '3',
          title: 'Understanding Japanese Dining Etiquette',
          content: 'Learn the proper way to use chopsticks, when to say "itadakimasu," and other important dining customs to respect Japanese traditions.',
          type: 'etiquette',
          dateAdded: new Date(),
          imageUrl: 'https://images.unsplash.com/photo-1584670747417-594a9412fba5',
          sourceUrl: '#'
        },
        {
          id: '4',
          title: 'Tokyo\'s Summer Festivals You Shouldn\'t Miss',
          content: 'Discover the vibrant matsuri (festival) culture with these upcoming events that coincide with your travel dates.',
          type: 'news',
          dateAdded: new Date(),
          imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
          sourceUrl: '#'
        },
        {
          id: '5',
          title: 'Safety Tips for Foreign Visitors in Japan',
          content: 'Japan is one of the safest countries for tourists, but here are important tips on navigating earthquakes, typhoon season, and the local emergency systems.',
          type: 'safety',
          dateAdded: new Date(),
          imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
          sourceUrl: '#'
        }
      ];
      
      setEvents(mockEvents);
      setCulturalContent(mockContent);
      
      // Calculate progress based on mocked data
      const targetDate = tripDetails?.departureDate || defaultDestination.departureDate;
      const daysRemaining = differenceInDays(targetDate, new Date());
      const progressPercent = Math.max(0, Math.min(100, ((90 - daysRemaining) / 90) * 100));
      setProgress(Math.round(progressPercent));
      
    } catch (err) {
      console.error('Error loading cultural immersion data:', err);
      setError('Failed to load cultural immersion data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCalendar = async () => {
    setIsSyncingCalendar(true);
    
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Calendar synced successfully',
        description: 'Your events have been added to your Google Calendar',
      });
    } catch (err) {
      toast({
        title: 'Calendar sync failed',
        description: 'Could not sync with your Google Calendar',
        variant: 'destructive',
      });
    } finally {
      setIsSyncingCalendar(false);
    }
  };
  
  const handleNewsSubscription = async () => {
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsNewsSubscribed(!isNewsSubscribed);
      
      toast({
        title: isNewsSubscribed ? 'Unsubscribed from news updates' : 'Subscribed to news updates',
        description: isNewsSubscribed 
          ? 'You will no longer receive news updates about your destination' 
          : 'You will receive news updates about your destination every 3 days',
      });
    } catch (err) {
      toast({
        title: 'Subscription update failed',
        description: 'Could not update your subscription status',
        variant: 'destructive',
      });
    }
  };
  
  const handleBookEvent = (event: CulturalEvent) => {
    toast({
      title: 'Event booking initiated',
      description: `Redirecting to booking page for ${event.title}`,
    });
  };
  
  // Calculate time remaining until the trip
  const getTimeRemainingText = () => {
    if (!tripDetails?.departureDate) return '';
    
    const daysRemaining = differenceInDays(tripDetails.departureDate, new Date());
    
    if (daysRemaining <= 0) return 'Your trip has started!';
    if (daysRemaining === 1) return '1 day until your trip!';
    return `${daysRemaining} days until your trip!`;
  };
  
  return (
    <div className="space-y-6">
      {/* Trip Header Card */}
      <Card className="bg-[#0a1021] border-[#4a89dc]/30">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{tripDetails?.destination || 'Plan Your Trip'}</CardTitle>
              <CardDescription className="text-gray-400">
                Pre-Trip Cultural Immersion & Planning
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-[#4a89dc]/10 text-[#4a89dc] border-[#4a89dc]/30">
              {getTimeRemainingText()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cultural Immersion Progress</span>
                <span className="text-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-800" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center space-x-3">
                <div className="bg-[#4a89dc]/10 p-2 rounded-md">
                  <Calendar className="h-5 w-5 text-[#4a89dc]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Departure</p>
                  <p className="font-medium">
                    {tripDetails?.departureDate 
                      ? format(tripDetails.departureDate, 'MMM d, yyyy') 
                      : 'Not set'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-[#4a89dc]/10 p-2 rounded-md">
                  <Globe className="h-5 w-5 text-[#4a89dc]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cultural Items</p>
                  <p className="font-medium">{culturalContent.length} guides available</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-[#4a89dc]/10 p-2 rounded-md">
                  <Bookmark className="h-5 w-5 text-[#4a89dc]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Suggested Events</p>
                  <p className="font-medium">{events.length} events found</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#0a1021] border border-gray-800 grid grid-cols-4">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-[#4a89dc]">
            <History className="h-4 w-4 mr-2 inline-block" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-[#4a89dc]">
            <Calendar className="h-4 w-4 mr-2 inline-block" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="data-[state=active]:bg-[#4a89dc]">
            <FileText className="h-4 w-4 mr-2 inline-block" />
            <span className="hidden sm:inline">Guides</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="data-[state=active]:bg-[#4a89dc]">
            <Globe className="h-4 w-4 mr-2 inline-block" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card className="bg-[#0a1021] border-[#4a89dc]/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-[#4a89dc]" />
                Cultural Immersion Timeline
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your personalized schedule to prepare for your trip to {tripDetails?.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Week 8 - Geography, Politics, History */}
                <div className="relative pl-8 pb-8 border-l border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 bg-[#4a89dc] rounded-full w-4 h-4"></div>
                  <div className="mb-1 flex items-center">
                    <Badge variant="outline" className="bg-[#4a89dc]/10 text-[#4a89dc] border-[#4a89dc]/30 mr-2">
                      Week 8
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {progress >= 10 ? 
                        <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" /> : 
                        <Clock className="h-4 w-4 text-gray-500 inline mr-1" />}
                      {progress >= 10 ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium">Geography, Politics & History</h3>
                  <p className="text-gray-400 mt-1">Learn the geography, political system, and key historical events of Japan to understand the context of your destination.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Geography & Climate
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Understanding Japan's island geography and seasonal climate patterns.</p>
                    </div>
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <History className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Historical Context
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Key events that shaped modern Japan, from feudal history to postwar developments.</p>
                    </div>
                  </div>
                </div>
                
                {/* Week 6 - Food, Etiquette, Religion */}
                <div className="relative pl-8 pb-8 border-l border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 bg-[#4a89dc] rounded-full w-4 h-4"></div>
                  <div className="mb-1 flex items-center">
                    <Badge variant="outline" className="bg-[#4a89dc]/10 text-[#4a89dc] border-[#4a89dc]/30 mr-2">
                      Week 6
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {progress >= 35 ? 
                        <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" /> : 
                        <Clock className="h-4 w-4 text-gray-500 inline mr-1" />}
                      {progress >= 35 ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium">Food, Etiquette & Religious Customs</h3>
                  <p className="text-gray-400 mt-1">Explore Japan's culinary traditions, social etiquette, and religious practices to appreciate the cultural nuances.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <Utensils className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Japanese Cuisine
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Beyond sushi: Regional specialties and seasonal dishes to try.</p>
                    </div>
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Social Etiquette
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Proper greetings, gift-giving, and social interactions in Japan.</p>
                    </div>
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Shinto & Buddhism
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Understanding temple and shrine etiquette for respectful visits.</p>
                    </div>
                  </div>
                </div>
                
                {/* Week 4 - Events, Music, Clothing */}
                <div className="relative pl-8 pb-8 border-l border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 bg-[#4a89dc] rounded-full w-4 h-4"></div>
                  <div className="mb-1 flex items-center">
                    <Badge variant="outline" className="bg-[#4a89dc]/10 text-[#4a89dc] border-[#4a89dc]/30 mr-2">
                      Week 4
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {progress >= 50 ? 
                        <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" /> : 
                        <Clock className="h-4 w-4 text-gray-500 inline mr-1" />}
                      {progress >= 50 ? 'In Progress' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium">Events, Music & Appropriate Clothing</h3>
                  <p className="text-gray-400 mt-1">Discover local events during your stay, learn about musical traditions, and prepare appropriate attire for your activities.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Seasonal Events
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Festivals, exhibitions and cultural events coinciding with your visit.</p>
                    </div>
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <Music className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Music & Arts
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Traditional and contemporary Japanese music scenes and performance art.</p>
                    </div>
                    <div className="bg-[#050b17] rounded-md p-4 border border-gray-800">
                      <h4 className="font-medium flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-[#4a89dc]" />
                        Dress Code Tips
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">Appropriate clothing for temples, restaurants, and seasonal considerations.</p>
                    </div>
                  </div>
                </div>
                
                {/* Week 2 - Packing, Weather, Safety */}
                <div className="relative pl-8 pb-8 border-l border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 bg-gray-700 rounded-full w-4 h-4"></div>
                  <div className="mb-1 flex items-center">
                    <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700 mr-2">
                      Week 2
                    </Badge>
                    <span className="text-sm text-gray-500">Upcoming</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-400">Packing List, Weather & Safety</h3>
                  <p className="text-gray-500 mt-1">Prepare for your trip with a customized packing list, detailed weather forecast, and essential safety information.</p>
                </div>
                
                {/* Week 1 - Final Checklist */}
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 -translate-x-1/2 bg-gray-700 rounded-full w-4 h-4"></div>
                  <div className="mb-1 flex items-center">
                    <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700 mr-2">
                      Week 1
                    </Badge>
                    <span className="text-sm text-gray-500">Upcoming</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-400">Final Checklist & Travel Tips</h3>
                  <p className="text-gray-500 mt-1">Last-minute preparations, airport navigation tips, and emergency contact information for your journey.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6 flex justify-between">
              <Button variant="outline" className="border-gray-700">
                <PieChart className="h-4 w-4 mr-2" />
                View Full Timeline
              </Button>
              
              <Button 
                onClick={handleSyncCalendar} 
                disabled={isSyncingCalendar}
                className="bg-[#4a89dc] hover:bg-[#3a79cc]"
              >
                {isSyncingCalendar ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                    Syncing...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Sync to Calendar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card className="bg-[#0a1021] border-[#4a89dc]/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#4a89dc]" />
                Recommended Events
              </CardTitle>
              <CardDescription className="text-gray-400">
                Cultural experiences and activities during your trip to {tripDetails?.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-[#050b17] rounded-md overflow-hidden border border-gray-800 flex flex-col">
                    {event.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <Badge variant="outline" className="bg-[#4a89dc]/10 text-[#4a89dc] border-[#4a89dc]/30">
                          {event.type === 'food' ? 'Cuisine' : 
                           event.type === 'cultural' ? 'Cultural' : 
                           event.type === 'music' ? 'Music' : 
                           event.type === 'tour' ? 'Tour' : 'Activity'}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                        {event.price !== undefined && (
                          <div className="flex items-center text-sm">
                            <PieChart className="h-4 w-4 mr-2 text-gray-500" />
                            <span>${event.price.toFixed(2)} USD</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 pt-0 mt-3 border-t border-gray-800 flex justify-between items-center">
                      <Button variant="ghost" size="sm" className="text-[#4a89dc]">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#4a89dc] hover:bg-[#3a79cc]"
                        onClick={() => handleBookEvent(event)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6">
              <div className="w-full flex justify-between">
                <Button variant="outline" className="border-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Events
                </Button>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc]">
                  Discover More Events
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Cultural Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <Card className="bg-[#0a1021] border-[#4a89dc]/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#4a89dc]" />
                Cultural Guides & Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Learn about the history, customs, and practices of {tripDetails?.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {culturalContent.map((content) => (
                  <div key={content.id} className="bg-[#050b17] rounded-md overflow-hidden border border-gray-800">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg">{content.title}</h3>
                        <Badge variant="outline" className="bg-[#4a89dc]/10 text-[#4a89dc] border-[#4a89dc]/30">
                          {content.type === 'history' ? 'History' : 
                           content.type === 'food' ? 'Cuisine' : 
                           content.type === 'etiquette' ? 'Etiquette' : 
                           content.type === 'safety' ? 'Safety' : 
                           content.type === 'language' ? 'Language' : 'News'}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-4">{content.content}</p>
                      {content.imageUrl && (
                        <div className="rounded-md overflow-hidden h-48 mb-4">
                          <img 
                            src={content.imageUrl} 
                            alt={content.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                        <span className="text-xs text-gray-500">
                          Added {format(content.dateAdded, 'MMM d, yyyy')}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-[#4a89dc]">
                            <Bookmark className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          {content.sourceUrl && (
                            <Button variant="outline" size="sm" className="border-gray-700">
                              Read More
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6">
              <div className="w-full flex justify-between">
                <Button variant="outline" className="border-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Guides
                </Button>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc]">
                  View All Cultural Guides
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* News & Updates Tab */}
        <TabsContent value="news" className="space-y-6">
          <Card className="bg-[#0a1021] border-[#4a89dc]/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-[#4a89dc]" />
                    News & Local Updates
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Stay informed about current events in {tripDetails?.destination}
                  </CardDescription>
                </div>
                <Button 
                  variant={isNewsSubscribed ? "default" : "outline"} 
                  size="sm"
                  onClick={handleNewsSubscription}
                  className={isNewsSubscribed ? "bg-[#4a89dc] hover:bg-[#3a79cc]" : "border-gray-700"}
                >
                  {isNewsSubscribed ? (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Subscribe to Updates
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="bg-[#050b17] border-[#4a89dc]/30 mb-6">
                <InfoIcon className="h-4 w-4 text-[#4a89dc]" />
                <AlertTitle>Stay Informed</AlertTitle>
                <AlertDescription>
                  Subscribe to receive local news, weather updates, and travel alerts about {tripDetails?.destination} directly to your email every 3 days.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-6">
                <div className="bg-[#050b17] rounded-md overflow-hidden border border-gray-800">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">Typhoon Warning Lifted for Tokyo Area</h3>
                      <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-900/50">
                        Weather Update
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-3">The Japan Meteorological Agency has lifted the typhoon warning for the Tokyo metropolitan area. Train services have resumed normal operations.</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                      <span className="text-xs text-gray-500">
                        April 10, 2025 • Japan Times
                      </span>
                      <Button variant="outline" size="sm" className="border-gray-700">
                        Read Full Article
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#050b17] rounded-md overflow-hidden border border-gray-800">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">Cherry Blossom Festival Dates Announced</h3>
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-900/50">
                        Cultural Event
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-3">The Tokyo Cherry Blossom Festival will be held from May 1-7 in Ueno Park. Special evening illuminations and food stalls will be available throughout the event.</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                      <span className="text-xs text-gray-500">
                        April 5, 2025 • Tokyo Tourism Board
                      </span>
                      <Button variant="outline" size="sm" className="border-gray-700">
                        Read Full Article
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#050b17] rounded-md overflow-hidden border border-gray-800">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">New Express Train Service to Kyoto Launched</h3>
                      <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-900/50">
                        Transportation
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-3">Japan Railways has launched a new express train service between Tokyo and Kyoto, reducing travel time to just under 2 hours. The service includes premium cars with rotating seats.</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                      <span className="text-xs text-gray-500">
                        April 2, 2025 • Transportation Weekly
                      </span>
                      <Button variant="outline" size="sm" className="border-gray-700">
                        Read Full Article
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6">
              <div className="w-full flex justify-between">
                <Button variant="outline" className="border-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Updates
                </Button>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc]">
                  View All News & Updates
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}