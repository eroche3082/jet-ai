import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { 
  Bookmark,
  MapPin, 
  Calendar as CalendarIcon,
  Globe,
  BarChart,
  FileImage,
  MapPinned,
  Map,
  Heart,
  Share2,
  Clock,
  ArrowUpRight,
  Image as ImageIcon,
  PenLine,
  FileText
} from 'lucide-react';

// Types
interface Trip {
  id: string;
  title: string;
  coverImage: string;
  location: string;
  date: string;
  description: string;
  status: 'draft' | 'published' | 'private';
  likes: number;
  views: number;
  saves: number;
  tags: string[];
}

interface CollectionItem {
  id: string;
  type: 'photo' | 'note' | 'place' | 'experience';
  title: string;
  content: string;
  date: string;
  location?: string;
  image?: string;
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<string>('trips');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripDialog, setShowTripDialog] = useState<boolean>(false);
  
  // Generate sample trips for demonstration
  const sampleTrips: Trip[] = [
    {
      id: '1',
      title: 'Summer in Paris',
      coverImage: 'https://placehold.co/800x500/d1d5db/6b7280?text=Paris',
      location: 'Paris, France',
      date: 'Jul 12 - Jul 19, 2024',
      description: 'A magical week exploring the city of lights, visiting iconic landmarks and enjoying French cuisine.',
      status: 'published',
      likes: 128,
      views: 2345,
      saves: 87,
      tags: ['Europe', 'City Break', 'Culture']
    },
    {
      id: '2',
      title: 'Italian Adventure',
      coverImage: 'https://placehold.co/800x500/d1d5db/6b7280?text=Italy',
      location: 'Rome & Florence, Italy',
      date: 'Sep 5 - Sep 15, 2024',
      description: 'Exploring ancient ruins, renaissance art, and enjoying the best pasta and pizza in the world.',
      status: 'draft',
      likes: 0,
      views: 3,
      saves: 0,
      tags: ['Europe', 'History', 'Food']
    },
    {
      id: '3',
      title: 'Japanese Journey',
      coverImage: 'https://placehold.co/800x500/d1d5db/6b7280?text=Japan',
      location: 'Tokyo, Kyoto & Osaka, Japan',
      date: 'Mar 10 - Mar 24, 2025',
      description: 'From ancient temples to futuristic cityscapes, experiencing the fascinating blend of tradition and innovation.',
      status: 'private',
      likes: 42,
      views: 156,
      saves: 23,
      tags: ['Asia', 'Culture', 'Adventure']
    }
  ];
  
  // Collection items
  const collectionItems: CollectionItem[] = [
    {
      id: '1',
      type: 'photo',
      title: 'Eiffel Tower at Sunset',
      content: 'The iconic Eiffel Tower glowing in the golden light of sunset.',
      date: 'Jul 14, 2024',
      location: 'Paris, France',
      image: 'https://placehold.co/800x600/d1d5db/6b7280?text=Eiffel+Tower'
    },
    {
      id: '2',
      type: 'note',
      title: 'Favorite Parisian Café',
      content: 'Le Café de Flore on Boulevard Saint-Germain has the most amazing croissants and coffee. Perfect spot for people watching!',
      date: 'Jul 15, 2024',
      location: 'Paris, France'
    },
    {
      id: '3',
      type: 'place',
      title: 'Louvre Museum',
      content: 'Home to thousands of works of art including the Mona Lisa. Plan to spend at least half a day here.',
      date: 'Jul 16, 2024',
      location: 'Paris, France',
      image: 'https://placehold.co/800x600/d1d5db/6b7280?text=Louvre'
    },
    {
      id: '4',
      type: 'experience',
      title: 'Seine River Cruise',
      content: 'The evening cruise along the Seine offered spectacular views of illuminated monuments. Highly recommend booking the sunset time slot.',
      date: 'Jul 17, 2024',
      location: 'Paris, France',
      image: 'https://placehold.co/800x600/d1d5db/6b7280?text=Seine+Cruise'
    },
    {
      id: '5',
      type: 'photo',
      title: 'Roman Colosseum',
      content: 'Standing within the ancient walls of the Colosseum, imagining the history that took place here.',
      date: 'Sep 6, 2024',
      location: 'Rome, Italy',
      image: 'https://placehold.co/800x600/d1d5db/6b7280?text=Colosseum'
    },
    {
      id: '6',
      type: 'note',
      title: 'Best Gelato in Florence',
      content: 'Vivoli Gelateria near Santa Croce has the most amazing pistachio and stracciatella flavors.',
      date: 'Sep 10, 2024',
      location: 'Florence, Italy'
    }
  ];
  
  // Stats for the travel statistics section
  const travelStats = {
    countries: 14,
    cities: 37,
    totalTrips: 23,
    daysAbroad: 187,
    flightsTaken: 46,
    accommodations: 31,
    photos: 2843,
    notes: 156
  };
  
  // View trip details
  const viewTripDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowTripDialog(true);
  };
  
  // Get typeicon for collection items
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="h-5 w-5" />;
      case 'note':
        return <PenLine className="h-5 w-5" />;
      case 'place':
        return <MapPinned className="h-5 w-5" />;
      case 'experience':
        return <FileText className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Published</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Draft</Badge>;
      case 'private':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Private</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Portfolio</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="trips">
            <Map className="w-4 h-4 mr-2" />
            My Trips
          </TabsTrigger>
          <TabsTrigger value="collection">
            <Bookmark className="w-4 h-4 mr-2" />
            Collection
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart className="w-4 h-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>
        
        {/* My Trips Tab */}
        <TabsContent value="trips">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Travel Journal</h2>
            <Button size="sm">
              <FileImage className="w-4 h-4 mr-2" />
              New Trip
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleTrips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={trip.coverImage} 
                    alt={trip.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/800x500/d1d5db/6b7280?text=${encodeURIComponent(trip.title)}`;
                    }}
                  />
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{trip.title}</h3>
                    {getStatusBadge(trip.status)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {trip.location}
                    <span className="mx-2">•</span>
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    {trip.date}
                  </div>
                  
                  <p className="text-sm line-clamp-2 mb-3">
                    {trip.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Heart className="h-3.5 w-3.5 mr-1" />
                        {trip.likes}
                      </div>
                      <div className="flex items-center">
                        <Bookmark className="h-3.5 w-3.5 mr-1" />
                        {trip.saves}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewTripDetails(trip)}
                    >
                      View Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Collection Tab */}
        <TabsContent value="collection">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Travel Collection</h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <MapPinned className="w-4 h-4 mr-2" />
                Add Place
              </Button>
              <Button size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Memory
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionItems.map((item) => (
              <Card key={item.id}>
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/800x600/d1d5db/6b7280?text=${encodeURIComponent(item.title)}`;
                      }}
                    />
                  </div>
                )}
                
                <CardContent className={item.image ? 'p-4' : 'p-4'}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      className={`
                        ${item.type === 'photo' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
                        ${item.type === 'note' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                        ${item.type === 'place' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${item.type === 'experience' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                      `}
                    >
                      <div className="flex items-center">
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                      </div>
                    </Badge>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.date}
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                  
                  {item.location && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {item.location}
                    </div>
                  )}
                  
                  <p className={`text-sm ${!item.image ? 'mt-2' : ''} ${item.type === 'note' ? '' : 'line-clamp-3'}`}>
                    {item.content}
                  </p>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Travel Statistics</h2>
            <Button size="sm" variant="outline">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Share Stats
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {travelStats.countries}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Countries Visited
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {travelStats.cities}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cities Explored
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {travelStats.totalTrips}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Trips
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {travelStats.daysAbroad}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Days Abroad
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Travel Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Continents Visited</span>
                    </div>
                    <span className="font-medium">4/7</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Average Trip Length</span>
                    </div>
                    <span className="font-medium">8.1 days</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Most Visited Country</span>
                    </div>
                    <span className="font-medium">Italy (5 trips)</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Longest Trip</span>
                    </div>
                    <span className="font-medium">21 days (Southeast Asia)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Photos Taken</span>
                    </div>
                    <span className="font-medium">{travelStats.photos}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <PenLine className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Notes Written</span>
                    </div>
                    <span className="font-medium">{travelStats.notes}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Bookmark className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Places Saved</span>
                    </div>
                    <span className="font-medium">92</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-gray-500" />
                      <span>Total Likes Received</span>
                    </div>
                    <span className="font-medium">1,284</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Trip Detail Dialog */}
      <Dialog open={showTripDialog} onOpenChange={setShowTripDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          {selectedTrip && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTrip.title}</DialogTitle>
                <DialogDescription className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {selectedTrip.location}
                  <span className="mx-2">•</span>
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {selectedTrip.date}
                </DialogDescription>
              </DialogHeader>
              
              <div className="h-80 overflow-hidden mb-4">
                <img 
                  src={selectedTrip.coverImage} 
                  alt={selectedTrip.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/800x500/d1d5db/6b7280?text=${encodeURIComponent(selectedTrip.title)}`;
                  }}
                />
              </div>
              
              <ScrollArea className="flex-1 pr-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">About This Trip</h3>
                    <p>{selectedTrip.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Trip Content</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {collectionItems
                        .filter(item => item.location?.includes(selectedTrip.location.split(',')[0]))
                        .map((item) => (
                          <div 
                            key={item.id} 
                            className="p-3 border rounded-md flex gap-3"
                          >
                            <div className={`p-2 rounded-full ${
                              item.type === 'photo' ? 'bg-purple-100 text-purple-600' : 
                              item.type === 'note' ? 'bg-amber-100 text-amber-600' : 
                              item.type === 'place' ? 'bg-blue-100 text-blue-600' : 
                              'bg-green-100 text-green-600'
                            }`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {item.content.substring(0, 60)}...
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <DialogFooter className="flex justify-between mt-4 pt-4 border-t">
                <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {selectedTrip.likes} likes
                  </div>
                  <div className="flex items-center">
                    <Bookmark className="h-4 w-4 mr-1" />
                    {selectedTrip.saves} saves
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline">
                    Edit Trip
                  </Button>
                  <Button>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}