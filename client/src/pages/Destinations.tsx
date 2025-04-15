import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import DestinationCard from '@/components/DestinationCard';
import DestinationSearchInput from '@/components/DestinationSearchInput';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

// Default destination data if API fails
const destinations = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    description: 'Experience the city of lights with its iconic landmarks and romantic charm.',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    continent: 'Europe',
    climate: 'Temperate',
    category: 'City'
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Blend of traditional culture and cutting-edge technology in Japan\'s vibrant capital.',
    imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    continent: 'Asia',
    climate: 'Temperate',
    category: 'City'
  },
  {
    id: '3',
    name: 'Santorini',
    country: 'Greece',
    description: 'Picturesque white-washed buildings overlooking the azure Aegean Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    continent: 'Europe',
    climate: 'Mediterranean',
    category: 'Beach'
  },
  {
    id: '4',
    name: 'New York City',
    country: 'USA',
    description: 'The city that never sleeps offers world-class entertainment, dining, and culture.',
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.0,
    continent: 'North America',
    climate: 'Temperate',
    category: 'City'
  },
  {
    id: '5',
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'Ancient Incan citadel set high in the Andes Mountains, a wonder of engineering.',
    imageUrl: 'https://images.unsplash.com/photo-1523592121529-f6dde35f079e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    continent: 'South America',
    climate: 'Highland',
    category: 'Historical'
  },
  {
    id: '6',
    name: 'Amalfi Coast',
    country: 'Italy',
    description: 'Dramatic coastline with colorful fishing villages and cliffside lemon groves.',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    continent: 'Europe',
    climate: 'Mediterranean',
    category: 'Coastal'
  },
  {
    id: '7',
    name: 'Dubai',
    country: 'UAE',
    description: 'Futuristic cityscape with record-breaking architecture and luxury shopping.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.3,
    continent: 'Asia',
    climate: 'Desert',
    category: 'City'
  },
  {
    id: '8',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Island paradise with lush landscapes, spiritual temples, and vibrant culture.',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    continent: 'Asia',
    climate: 'Tropical',
    category: 'Beach'
  },
  {
    id: '9',
    name: 'Kyoto',
    country: 'Japan',
    description: 'Ancient capital with over 1,600 Buddhist temples and 400 Shinto shrines.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    continent: 'Asia',
    climate: 'Temperate',
    category: 'Historical'
  },
  {
    id: '10',
    name: 'Barcelona',
    country: 'Spain',
    description: 'Vibrant city known for stunning architecture, Mediterranean beaches, and Catalan cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    continent: 'Europe',
    climate: 'Mediterranean',
    category: 'City'
  },
  {
    id: '11',
    name: 'Maldives',
    country: 'Maldives',
    description: 'Tropical paradise with overwater bungalows and pristine white-sand beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    continent: 'Asia',
    climate: 'Tropical',
    category: 'Beach'
  },
  {
    id: '12',
    name: 'Cairo',
    country: 'Egypt',
    description: 'Ancient pyramids, sphinx, and rich cultural heritage on the banks of the Nile.',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.2,
    continent: 'Africa',
    climate: 'Desert',
    category: 'Historical'
  }
];

const continents = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Australia'];
const climates = ['All', 'Tropical', 'Mediterranean', 'Temperate', 'Desert', 'Highland'];
const categories = ['All', 'City', 'Beach', 'Historical', 'Coastal', 'Mountain'];

export default function Destinations() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('q') || '';
  const dateParam = params.get('date') || '';
  
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedClimate, setSelectedClimate] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  
  // Load destinations from API when the page loads with search parameters
  useEffect(() => {
    if (searchParam) {
      setIsLoading(true);
      fetch('/api/search/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          destination: searchParam, 
          date: dateParam,
          useGemini: true,
          useRapidAPI: true
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.results && data.results.length > 0) {
          setSearchResults(data.results);
          setHasSearched(true);
          toast({
            title: "Search Results",
            description: `Found ${data.results.length} destinations matching "${searchParam}"`,
          });
        } else {
          // If no results, show a message and use default destinations
          toast({
            title: "No results found",
            description: `No destinations found matching "${searchParam}". Showing all destinations.`,
            variant: "destructive"
          });
          setSearchResults([]);
        }
      })
      .catch(err => {
        console.error('Error searching destinations:', err);
        toast({
          title: "Search error",
          description: "An error occurred while searching. Please try again.",
          variant: "destructive"
        });
        setSearchResults([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [searchParam, dateParam, toast]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // If empty search, reset to showing all destinations
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }
    
    fetch('/api/search/destinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        destination: searchQuery, 
        date: dateParam,
        useGemini: true,
        useRapidAPI: true
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.results && data.results.length > 0) {
        setSearchResults(data.results);
        setHasSearched(true);
        toast({
          title: "Search Results",
          description: `Found ${data.results.length} destinations matching "${searchQuery}"`,
        });
      } else {
        // If no results, show a message and use default destinations
        toast({
          title: "No results found",
          description: `No destinations found matching "${searchQuery}". Showing all destinations.`,
          variant: "destructive"
        });
        setSearchResults([]);
        setHasSearched(false);
      }
    })
    .catch(err => {
      console.error('Error searching destinations:', err);
      toast({
        title: "Search error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive"
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  // Use search results if available, otherwise filter the default destinations
  const filteredDestinations = hasSearched && searchResults.length > 0 ? 
    searchResults.filter(destination => {
      const matchesContinent = selectedContinent === 'All' || destination.continent === selectedContinent;
      const matchesClimate = selectedClimate === 'All' || destination.climate === selectedClimate;
      const matchesCategory = selectedCategory === 'All' || destination.category === selectedCategory;
      
      return matchesContinent && matchesClimate && matchesCategory;
    }) 
    : 
    destinations.filter(destination => {
      const matchesContinent = selectedContinent === 'All' || destination.continent === selectedContinent;
      const matchesClimate = selectedClimate === 'All' || destination.climate === selectedClimate;
      const matchesCategory = selectedCategory === 'All' || destination.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
                           destination.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           destination.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesContinent && matchesClimate && matchesCategory && matchesSearch;
    });
  
  return (
    <>
      {/* Page Header */}
      <div className="bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1931&q=80')] bg-cover bg-center relative py-20">
        <div className="absolute inset-0 bg-[#050b17]/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-white/5 text-white text-sm font-serif mb-6 mx-auto">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              CURATED BY JET AI
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 font-display">Explore <span className="text-[#4a89dc]">Destinations</span></h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 font-serif">
              Discover your next adventure with our curated selection of exceptional destinations, each offering unique experiences.
            </p>
            
            {/* Search Form */}
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-10 w-10 rounded-full bg-[#4a89dc]/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4a89dc]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-white font-serif font-medium text-lg">Where would you like to explore?</h2>
              </div>
              
              <form onSubmit={handleSearch}>
                <DestinationSearchInput 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={(place) => {
                    setSearchQuery(place.description);
                    toast({
                      title: "Destination selected",
                      description: `Showing results for ${place.mainText}, ${place.secondaryText || ''}`,
                      variant: "default",
                    });
                  }}
                  placeholder="Search for cities, countries, or landmarks..."
                  className="bg-white/90 backdrop-blur-md border-[#4a89dc]/30 focus:border-[#4a89dc] shadow-lg font-serif"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white border-b py-8 backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path d="M9 22V12h6v10" />
                </svg>
                TAILOR YOUR JOURNEY
              </div>
            </div>
            <h2 className="text-center font-display text-3xl font-bold text-[#050b17] mb-2">Customize Your Adventure</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto font-serif">Use these filters to discover the perfect destination for your next adventure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Continent Filter */}
            <div className="bg-gradient-to-br from-[#4a89dc]/5 to-transparent p-5 rounded-xl border border-[#4a89dc]/10">
              <h3 className="font-serif font-medium mb-3 flex items-center text-[#050b17]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4a89dc]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
                Continent
              </h3>
              <div className="flex flex-wrap gap-2">
                {continents.map((continent) => (
                  <button 
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`px-4 py-1.5 rounded-full text-sm font-serif transition-all duration-300 ${
                      selectedContinent === continent 
                        ? 'bg-[#4a89dc] hover:bg-[#3a79cc] text-white shadow-md' 
                        : 'bg-[#050b17]/5 text-[#050b17] hover:bg-[#050b17]/10'
                    }`}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Climate Filter */}
            <div className="bg-gradient-to-br from-[#4a89dc]/5 to-transparent p-5 rounded-xl border border-[#4a89dc]/10">
              <h3 className="font-serif font-medium mb-3 flex items-center text-[#050b17]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4a89dc]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zM6 9a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zm-4 4a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Climate
              </h3>
              <div className="flex flex-wrap gap-2">
                {climates.map((climate) => (
                  <button 
                    key={climate}
                    onClick={() => setSelectedClimate(climate)}
                    className={`px-4 py-1.5 rounded-full text-sm font-serif transition-all duration-300 ${
                      selectedClimate === climate 
                        ? 'bg-[#4a89dc] hover:bg-[#3a79cc] text-white shadow-md' 
                        : 'bg-[#050b17]/5 text-[#050b17] hover:bg-[#050b17]/10'
                    }`}
                  >
                    {climate}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="bg-gradient-to-br from-[#4a89dc]/5 to-transparent p-5 rounded-xl border border-[#4a89dc]/10">
              <h3 className="font-serif font-medium mb-3 flex items-center text-[#050b17]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4a89dc]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-serif transition-all duration-300 ${
                      selectedCategory === category 
                        ? 'bg-[#4a89dc] hover:bg-[#3a79cc] text-white shadow-md' 
                        : 'bg-[#050b17]/5 text-[#050b17] hover:bg-[#050b17]/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Destinations Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-[#4a89dc]/5">
        <div className="container mx-auto px-4">
          {filteredDestinations.length > 0 ? (
            <>
              <div className="mb-10 flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" stroke="currentColor" strokeWidth="2">
                      <path d="M3 22V8l9-6 9 6v14h-7v-8h-4v8H3z" />
                    </svg>
                    FEATURED DESTINATIONS
                  </div>
                  <h2 className="font-display text-3xl font-bold text-[#050b17] flex items-center">
                    {filteredDestinations.length} Amazing <span className="text-[#4a89dc] ml-2">Destinations</span>
                    <span className="ml-2 relative inline-flex">
                      <span className="animate-ping absolute h-3 w-3 rounded-full bg-[#4a89dc] opacity-75"></span>
                      <span className="relative rounded-full h-3 w-3 bg-[#4a89dc]"></span>
                    </span>
                  </h2>
                </div>
                <div className="hidden md:block">
                  <span className="text-gray-600 text-sm font-serif">
                    <span className="text-[#4a89dc] font-medium">Pro tip:</span> Click on any destination for detailed adventures
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredDestinations.map((destination) => (
                  <DestinationCard 
                    key={destination.id} 
                    id={destination.id}
                    name={destination.name} 
                    country={destination.country} 
                    description={destination.description} 
                    imageUrl={destination.imageUrl} 
                    rating={destination.rating} 
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 px-4 md:px-12 bg-white rounded-lg shadow-sm border border-[#4a89dc]/10 max-w-3xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#4a89dc]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4a89dc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-[#050b17]">Adventure Not Found!</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg font-serif">Your dream destination might be hiding behind different filters. Try adjusting your search criteria or explore our trending adventures.</p>
              <button 
                onClick={() => {
                  setSelectedContinent('All');
                  setSelectedClimate('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white font-serif font-medium px-6 py-3 rounded shadow-lg transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* AI Assistant Button (Fixed position) - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <div className="absolute inset-0 rounded-full bg-[#4a89dc] animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <button 
          onClick={() => {
            // This will eventually open the chat dialog component
            console.log('Opening AI chat dialog');
            // Future implementation: setShowChatDialog(true);
            window.location.href = '/chat';
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#4a89dc] hover:bg-[#050b17] text-white shadow-lg border border-white/10 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-[#4a89dc] animate-pulse opacity-30"></div>
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </>
  );
}
