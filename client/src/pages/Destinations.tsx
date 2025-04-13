import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DestinationCard from '@/components/DestinationCard';
import DestinationSearchInput from '@/components/DestinationSearchInput';

// Destination data
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
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedClimate, setSelectedClimate] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search initiated",
      description: `Searching for destinations matching: "${searchQuery}"`,
    });
  };
  
  const filteredDestinations = destinations.filter(destination => {
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
      <div className="bg-gradient-to-r from-[#ff6b35]/20 to-yellow-500/20 py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-dark text-center mb-6">Explore Destinations</h1>
          <p className="text-lg text-dark/70 text-center max-w-3xl mx-auto mb-8">
            Discover amazing places around the world, from vibrant cities to tropical beaches and historic landmarks.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <DestinationSearchInput 
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={(place) => {
                setSearchQuery(place.description);
                toast({
                  title: "Destination selected",
                  description: `Showing results for ${place.mainText}, ${place.secondaryText || ''}`,
                });
              }}
            />
          </form>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white border-b py-8 backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-center font-display text-2xl font-bold text-gray-800 mb-2">Customize Your Adventure</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">Use these filters to discover the perfect destination for your next adventure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Continent Filter */}
            <div className="bg-gradient-to-br from-[#ff6b35]/5 to-transparent p-5 rounded-xl">
              <h3 className="font-accent font-bold mb-3 flex items-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#ff6b35]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
                Continent
              </h3>
              <div className="flex flex-wrap gap-2">
                {continents.map((continent) => (
                  <button 
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      selectedContinent === continent 
                        ? 'bg-[#ff6b35] hover:bg-[#e85a24] text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Climate Filter */}
            <div className="bg-gradient-to-br from-yellow-500/5 to-transparent p-5 rounded-xl">
              <h3 className="font-accent font-bold mb-3 flex items-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zM6 9a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zm-4 4a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Climate
              </h3>
              <div className="flex flex-wrap gap-2">
                {climates.map((climate) => (
                  <button 
                    key={climate}
                    onClick={() => setSelectedClimate(climate)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      selectedClimate === climate 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    {climate}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="bg-gradient-to-br from-emerald-500/5 to-transparent p-5 rounded-xl">
              <h3 className="font-accent font-bold mb-3 flex items-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      selectedCategory === category 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
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
      <section className="py-16 bg-gradient-to-b from-white to-yellow-50">
        <div className="container mx-auto px-4">
          {filteredDestinations.length > 0 ? (
            <>
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <span className="inline-block bg-[#ff6b35]/10 text-[#ff6b35] text-sm font-bold px-3 py-1 rounded-full mb-2">Discover</span>
                  <h2 className="font-display text-3xl font-extrabold text-gray-800 flex items-center">
                    {filteredDestinations.length} Amazing Destinations
                    <span className="ml-2 relative inline-flex">
                      <span className="animate-ping absolute h-3 w-3 rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                  </h2>
                </div>
                <div className="hidden md:block">
                  <span className="text-gray-500 text-sm">
                    <span className="text-[#ff6b35] font-semibold">Pro tip:</span> Click on any destination for detailed adventures!
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
            <div className="text-center py-16 px-4 md:px-12 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-gray-800">Adventure Not Found!</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">Your dream destination might be hiding behind different filters. Try adjusting your search criteria or explore our trending adventures.</p>
              <button 
                onClick={() => {
                  setSelectedContinent('All');
                  setSelectedClimate('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="bg-gradient-to-r from-[#ff6b35] to-yellow-500 hover:from-yellow-500 hover:to-[#ff6b35] text-white font-bold px-6 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
