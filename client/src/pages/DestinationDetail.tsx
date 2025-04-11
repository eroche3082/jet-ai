import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Globe, Calendar, MapPin, Hotel, Plane, Star, ChevronLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// This would come from your shared schema
type AttractionType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating: number;
};

type HotelType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  stars: number;
  price: string;
  amenities: string[];
};

type SeasonType = 'spring' | 'summer' | 'fall' | 'winter';

type ClimateDataType = {
  season: SeasonType;
  temperature: string;
  rainfall: string;
  recommendation: string;
};

// Destination data (this would come from API/database)
const destinations = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    description: 'Experience the city of lights with its iconic landmarks and romantic charm.',
    longDescription: `Paris, the City of Light, captivates with its elegance, cultural treasures, and iconic landmarks. Stroll along the Seine, visit world-class museums like the Louvre and Musée d'Orsay, and marvel at architectural wonders like the Eiffel Tower and Notre-Dame Cathedral. Indulge in exquisite cuisine at charming cafés and restaurants. Explore vibrant neighborhoods from elegant Saint-Germain-des-Prés to bohemian Montmartre. Paris offers a perfect blend of history, art, gastronomy, and timeless romance.`,
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1300&q=80',
    rating: 4.5,
    continent: 'Europe',
    climate: 'Temperate',
    category: 'City',
    aiSummary: `Paris is a dream destination that goes beyond the iconic Eiffel Tower. For an authentic experience, explore the hidden passages like Passage des Panoramas, enjoy apéritif at local cafés in the Marais, and visit smaller museums like Musée de la Vie Romantique. The city has an elegant, dreamy vibe that pairs history with contemporary culture. While French is the official language, most locals in tourist areas speak English, though attempting a few French phrases is appreciated. The best hidden gems include Canal Saint-Martin's waterside cafés, Parc des Buttes-Chaumont for stunning views, and Rue Crémieux for colorful house facades.`,
    climateData: [
      { season: 'spring', temperature: '8-16°C (46-61°F)', rainfall: 'Moderate', recommendation: 'Excellent time to visit with blooming gardens and moderate crowds' },
      { season: 'summer', temperature: '15-25°C (59-77°F)', rainfall: 'Light', recommendation: 'Peak tourist season with warm weather but largest crowds' },
      { season: 'fall', temperature: '7-15°C (45-59°F)', rainfall: 'Moderate', recommendation: 'Beautiful colors and fewer tourists, but pack for occasional rain' },
      { season: 'winter', temperature: '1-7°C (34-45°F)', rainfall: 'Moderate', recommendation: 'Lowest season with festive decorations but cold, gray weather' }
    ],
    attractions: [
      {
        id: 'a1',
        name: 'Eiffel Tower',
        description: 'Iconic iron tower built in 1889 that offers stunning views of the city.',
        imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: 'Champ de Mars, 5 Avenue Anatole France',
        coordinates: { lat: 48.8584, lng: 2.2945 },
        rating: 4.7
      },
      {
        id: 'a2',
        name: 'Louvre Museum',
        description: 'World\'s largest art museum and historic monument housing the Mona Lisa.',
        imageUrl: 'https://images.unsplash.com/photo-1566159196870-55f132311bbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: 'Rue de Rivoli',
        coordinates: { lat: 48.8606, lng: 2.3376 },
        rating: 4.8
      },
      {
        id: 'a3',
        name: 'Notre-Dame Cathedral',
        description: 'Medieval Catholic cathedral on the Île de la Cité known for its Gothic architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1519229930259-76d15fb63b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: 'Île de la Cité',
        coordinates: { lat: 48.8530, lng: 2.3499 },
        rating: 4.6
      },
      {
        id: 'a4',
        name: 'Montmartre',
        description: 'Charming historic district known for its artistic history and the Sacré-Cœur Basilica.',
        imageUrl: 'https://images.unsplash.com/photo-1581979902612-f13bc9d05e7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: '18th arrondissement',
        coordinates: { lat: 48.8872, lng: 2.3411 },
        rating: 4.5
      }
    ],
    hotels: [
      {
        id: 'h1',
        name: 'Le Meurice',
        description: 'Opulent 5-star hotel opposite the Tuileries Garden with elegant rooms and fine dining.',
        imageUrl: 'https://images.unsplash.com/photo-1592394533824-9440e5d61b08?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 5,
        price: '€750',
        amenities: ['Spa', 'Restaurant', 'Room Service', 'WiFi', 'Pool']
      },
      {
        id: 'h2',
        name: 'Hôtel Plaza Athénée',
        description: 'Luxury hotel with Eiffel Tower views, known for its haute couture style and refined hospitality.',
        imageUrl: 'https://images.unsplash.com/photo-1534612899740-55c821a90129?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 5,
        price: '€850',
        amenities: ['Spa', 'Restaurant', 'Room Service', 'WiFi', 'Gym']
      },
      {
        id: 'h3',
        name: 'Hôtel des Arts Montmartre',
        description: 'Charming boutique hotel in the heart of Montmartre with artistic decor.',
        imageUrl: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 3,
        price: '€120',
        amenities: ['WiFi', 'Continental Breakfast', '24-hour Reception']
      },
      {
        id: 'h4',
        name: 'CitizenM Paris Gare de Lyon',
        description: 'Contemporary hotel with modern amenities and affordable luxury near Gare de Lyon.',
        imageUrl: 'https://images.unsplash.com/photo-1580207276594-1883fda2d8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 4,
        price: '€180',
        amenities: ['WiFi', 'Bar', 'Smart Room Technology', '24-hour Food']
      }
    ]
  },
  // More destinations...
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Blend of traditional culture and cutting-edge technology in Japan\'s vibrant capital.',
    longDescription: `Tokyo, a city where ultramodern meets traditional, is Japan's bustling capital. Experience a sensory overload among the neon-lit skyscrapers of Shibuya and Shinjuku, find tranquility in ancient temples and gardens like Senso-ji and the Imperial Palace Gardens, and enjoy world-class shopping in Ginza. Tokyo boasts the most Michelin-starred restaurants of any city, offering everything from high-end sushi to comforting ramen. Navigate the city via its efficient public transportation system, allowing easy exploration of diverse neighborhoods each with their own distinct character.`,
    imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1300&q=80',
    rating: 4.9,
    continent: 'Asia',
    climate: 'Temperate',
    category: 'City',
    aiSummary: `Tokyo is a fascinating blend of ultramodern and traditional, where ancient temples sit in the shadows of gleaming skyscrapers. The city's vibe shifts dramatically by neighborhood - from the electric energy of Shibuya's Crossing to the quiet beauty of Yanaka's traditional wooden homes. For an authentic experience, explore the yokocho (narrow alleyways) in Shinjuku filled with tiny bars and eateries, visit local neighborhood onsen (baths), and discover smaller shrines away from major tourist spots. While Japanese is the primary language, English signage is common in tourist areas and train stations, and many young people speak some English. Hidden gems include the Shimokitazawa neighborhood for vintage shopping, the teamLab Planets digital art museum, and eating at standing-only local sushi counters for the freshest fish at reasonable prices.`,
    climateData: [
      { season: 'spring', temperature: '10-20°C (50-68°F)', rainfall: 'Light to Moderate', recommendation: 'Cherry blossom season (late March to early April) is beautiful but crowded' },
      { season: 'summer', temperature: '22-31°C (72-88°F)', rainfall: 'Heavy (rainy season in June)', recommendation: 'Hot and humid with occasional typhoons, but many festivals' },
      { season: 'fall', temperature: '10-25°C (50-77°F)', rainfall: 'Light', recommendation: 'Excellent time to visit with comfortable temperatures and autumn colors' },
      { season: 'winter', temperature: '1-10°C (34-50°F)', rainfall: 'Light', recommendation: 'Cold but dry with fewer tourists and winter illuminations' }
    ],
    attractions: [
      {
        id: 'a1',
        name: 'Tokyo Skytree',
        description: 'The tallest structure in Japan offering panoramic views of the metropolitan area.',
        imageUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: 'Sumida City',
        coordinates: { lat: 35.7101, lng: 139.8107 },
        rating: 4.5
      },
      {
        id: 'a2',
        name: 'Senso-ji Temple',
        description: 'Ancient Buddhist temple in Asakusa and Tokyo\'s oldest temple.',
        imageUrl: 'https://images.unsplash.com/photo-1583416750470-965b5c4e4975?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: 'Asakusa',
        coordinates: { lat: 35.7147, lng: 139.7966 },
        rating: 4.7
      },
      {
        id: 'a3',
        name: 'Meiji Shrine',
        description: 'Shinto shrine dedicated to Emperor Meiji and Empress Shoken surrounded by a forest.',
        imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: 'Shibuya',
        coordinates: { lat: 35.6763, lng: 139.6993 },
        rating: 4.6
      },
      {
        id: 'a4',
        name: 'Shibuya Crossing',
        description: 'Famous scramble intersection and one of the busiest crosswalks in the world.',
        imageUrl: 'https://images.unsplash.com/photo-1593204513649-0d50914eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        location: 'Shibuya',
        coordinates: { lat: 35.6595, lng: 139.7004 },
        rating: 4.4
      }
    ],
    hotels: [
      {
        id: 'h1',
        name: 'Park Hyatt Tokyo',
        description: 'Luxury hotel featured in "Lost in Translation" with stunning city views.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 5,
        price: '¥60,000',
        amenities: ['Spa', 'Multiple Restaurants', 'Pool', 'Gym', 'Bar']
      },
      {
        id: 'h2',
        name: 'Hotel Ryumeikan Tokyo',
        description: 'Historic hotel combining traditional Japanese hospitality with modern comfort.',
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 4,
        price: '¥25,000',
        amenities: ['Restaurant', 'Tea Ceremony', 'WiFi', 'Room Service']
      },
      {
        id: 'h3',
        name: 'MIMARU Tokyo Ueno North',
        description: 'Modern apartment hotel perfect for families and longer stays.',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 3,
        price: '¥15,000',
        amenities: ['Kitchenette', 'WiFi', 'Family Rooms', 'Laundry']
      },
      {
        id: 'h4',
        name: 'The Millennials Shibuya',
        description: 'High-tech capsule hotel with smart pods and co-working space.',
        imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        stars: 2,
        price: '¥5,000',
        amenities: ['Co-working Space', 'WiFi', 'Smart Pod', 'Lounge']
      }
    ]
  }
];

export default function DestinationDetail() {
  const [, params] = useRoute('/destinations/:id/:slug');
  const { toast } = useToast();
  const [destination, setDestination] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params && params.id) {
      // Simulate API fetch with loading state
      setIsLoading(true);
      
      // Find destination by ID from our local data
      // In a real app, you would fetch from your API
      const foundDestination = destinations.find(d => d.id === params.id);
      
      setTimeout(() => {
        setDestination(foundDestination || null);
        setIsLoading(false);
      }, 500); // Simulate network delay
    }
  }, [params]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked 
        ? `${destination?.name} has been removed from your saved destinations.` 
        : `${destination?.name} has been added to your saved destinations.`,
    });
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
        <h2 className="text-xl font-display font-bold text-dark">Loading destination details...</h2>
      </div>
    );
  }

  // Display error if destination not found
  if (!destination) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <i className="fas fa-map-marker-alt text-red-500 text-3xl"></i>
        </div>
        <h2 className="text-2xl font-display font-bold text-dark mb-3">Destination Not Found</h2>
        <p className="text-dark/70 mb-6">The destination you're looking for doesn't exist or has been removed.</p>
        <Link href="/destinations">
          <Button variant="default">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Destinations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div 
        className="relative h-[60vh] bg-cover bg-center" 
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-dark/50"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 container mx-auto">
          <Link href="/destinations">
            <Button variant="outline" className="bg-white/90 hover:bg-white absolute top-4 left-4 md:top-8 md:left-8">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <div className="mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="bg-white/20 text-white border-none">
                    {destination.category}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-none">
                    {destination.continent}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-none">
                    {destination.climate}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{destination.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-white/80 mr-1" />
                    <span className="text-white/90">{destination.country}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white/90">{destination.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                className={`rounded-full ${isBookmarked ? 'bg-primary border-primary text-white' : 'bg-white/20 border-white/30 text-white hover:bg-white/30'}`}
                onClick={toggleBookmark}
              >
                <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
                <TabsTrigger value="attractions" className="text-base">Attractions</TabsTrigger>
                <TabsTrigger value="hotels" className="text-base">Hotels</TabsTrigger>
                <TabsTrigger value="flights" className="text-base">Flights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-display font-bold text-dark">About {destination.name}</h2>
                  <p>{destination.longDescription}</p>
                  
                  <h3 className="font-display font-semibold text-xl mt-8">AI Travel Assistant Summary</h3>
                  <div className="bg-primary/5 p-5 rounded-xl border border-primary/20 mb-6">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <i className="fas fa-robot text-primary text-sm"></i>
                        </div>
                      </div>
                      <div>
                        <p className="text-base text-dark/90 italic">{destination.aiSummary}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-display font-bold text-dark mb-4">
                    <Calendar className="inline-block mr-2 h-5 w-5 text-primary" />
                    Best Time to Visit
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.climateData.map((data: ClimateDataType) => (
                      <Card key={data.season} className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="capitalize text-lg">
                            {data.season}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-0">
                          <div className="text-sm">
                            <span className="font-medium">Temperature:</span> {data.temperature}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Rainfall:</span> {data.rainfall}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Recommendation:</span> {data.recommendation}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="attractions" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold text-dark">Top Attractions</h2>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="mr-1 h-4 w-4" /> View Map
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {destination.attractions.map((attraction: AttractionType) => (
                    <Card key={attraction.id} className="overflow-hidden border-none shadow-md group hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <img 
                          src={attraction.imageUrl} 
                          alt={attraction.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 text-xs font-medium flex items-center">
                          <Star className="text-yellow-500 mr-1 h-3 w-3 fill-current" />
                          {attraction.rating}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-display font-bold text-lg mb-1">{attraction.name}</h3>
                        <p className="text-dark/70 text-sm mb-3">{attraction.description}</p>
                        <div className="flex items-center text-dark/60 text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {attraction.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="hotels" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold text-dark">Places to Stay</h2>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <i className="fas fa-filter mr-2"></i> Filter
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {destination.hotels.map((hotel: HotelType) => (
                    <Card key={hotel.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <img 
                          src={hotel.imageUrl} 
                          alt={hotel.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-xs font-medium">
                          {hotel.price} / night
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-bold text-lg">{hotel.name}</h3>
                          <div className="flex">
                            {[...Array(hotel.stars)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-dark/70 text-sm mb-3">{hotel.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hotel.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-100">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="flights" className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-center space-x-3 mb-4 text-dark/70">
                    <Plane className="h-5 w-5 transform -rotate-45" />
                    <span className="text-sm font-medium">Flight Information</span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-display font-bold text-dark mb-2">Find flights to {destination.name}</h3>
                    <p className="text-dark/70 mb-6">Search for the best deals on flights to {destination.name} from your location.</p>
                    
                    <Button className="mx-auto">
                      <Globe className="mr-2 h-4 w-4" />
                      Search Flights
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-display font-bold text-dark mb-4">Travel Tips</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <i className="fas fa-plane-arrival text-primary"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">Major Airport</h4>
                        <p className="text-dark/70 text-sm">The main international gateway to {destination.name} is {destination.name === 'Paris' ? 'Charles de Gaulle Airport (CDG)' : 'Haneda Airport (HND) and Narita Airport (NRT)'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <i className="fas fa-calendar-alt text-primary"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">Best Time to Book</h4>
                        <p className="text-dark/70 text-sm">For the best deals, book flights 2-3 months in advance. Avoid peak season if you're on a budget.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <i className="fas fa-subway text-primary"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">Airport to City</h4>
                        <p className="text-dark/70 text-sm">
                          {destination.name === 'Paris' 
                            ? 'Take the RER B train from CDG to central Paris in about 30-45 minutes.' 
                            : 'Both airports connect to central Tokyo via train, monorail or bus services.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Call-to-action Card */}
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="bg-primary text-white p-4">
                  <h3 className="font-display font-bold text-lg">Plan Your Trip to {destination.name}</h3>
                  <p className="text-white/80 text-sm mt-1">Get personalized recommendations and assistance</p>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center text-dark/70 text-sm">
                    <i className="fas fa-check-circle text-primary mr-2"></i>
                    <span>Customized itineraries</span>
                  </div>
                  <div className="flex items-center text-dark/70 text-sm">
                    <i className="fas fa-check-circle text-primary mr-2"></i>
                    <span>Local recommendations</span>
                  </div>
                  <div className="flex items-center text-dark/70 text-sm">
                    <i className="fas fa-check-circle text-primary mr-2"></i>
                    <span>24/7 travel assistance</span>
                  </div>
                  
                  <Button className="w-full">
                    <i className="fas fa-magic mr-2"></i>
                    Create Itinerary
                  </Button>
                </CardContent>
              </Card>
              
              {/* Weather & Climate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <i className="fas fa-cloud-sun mr-2 text-primary"></i>
                    Weather & Climate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Climate:</span> {destination.climate}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Best season:</span> {destination.name === 'Paris' ? 'Spring (April-June) and Fall (September-October)' : 'Spring (March-May) and Fall (September-November)'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Rainy season:</span> {destination.name === 'Paris' ? 'Winter (November-February)' : 'Early summer (June-July)'}
                  </div>
                </CardContent>
              </Card>
              
              {/* Practical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <i className="fas fa-info-circle mr-2 text-primary"></i>
                    Practical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Language:</span> {destination.name === 'Paris' ? 'French' : 'Japanese'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Currency:</span> {destination.name === 'Paris' ? 'Euro (€)' : 'Japanese Yen (¥)'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Time zone:</span> {destination.name === 'Paris' ? 'Central European Time (CET)' : 'Japan Standard Time (JST)'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Visa:</span> {destination.name === 'Paris' ? 'Schengen visa for non-EU citizens' : 'Tourist visa required for many nationalities'}
                  </div>
                </CardContent>
              </Card>
              
              {/* Similar Destinations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <i className="fas fa-map-marked-alt mr-2 text-primary"></i>
                    Similar Destinations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {destination.name === 'Paris' ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <img src="https://images.unsplash.com/photo-1549944850-84e00be4203b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Rome" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">Rome, Italy</div>
                          <div className="text-xs text-dark/60">Historic European capital</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <img src="https://images.unsplash.com/photo-1527154643590-39c2f6eae316?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Barcelona" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">Barcelona, Spain</div>
                          <div className="text-xs text-dark/60">Vibrant coastal city</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <img src="https://images.unsplash.com/photo-1548919973-5cef591cdbc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Seoul" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">Seoul, South Korea</div>
                          <div className="text-xs text-dark/60">Modern Asian metropolis</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <img src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Taipei" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">Taipei, Taiwan</div>
                          <div className="text-xs text-dark/60">Cultural hub with great food</div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}