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
      <div className="bg-[#3a55e7]/10 py-12">
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
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Continent Filter */}
            <div>
              <h3 className="font-accent font-semibold mb-3">Continent</h3>
              <div className="flex flex-wrap gap-2">
                {continents.map((continent) => (
                  <button 
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedContinent === continent 
                        ? 'bg-[#3a55e7] hover:bg-[#2b3fbb] text-white' 
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
                    }`}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Climate Filter */}
            <div>
              <h3 className="font-accent font-semibold mb-3">Climate</h3>
              <div className="flex flex-wrap gap-2">
                {climates.map((climate) => (
                  <button 
                    key={climate}
                    onClick={() => setSelectedClimate(climate)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedClimate === climate 
                        ? 'bg-[#3a55e7] hover:bg-[#2b3fbb] text-white' 
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
                    }`}
                  >
                    {climate}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <h3 className="font-accent font-semibold mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedCategory === category 
                        ? 'bg-[#3a55e7] hover:bg-[#2b3fbb] text-white' 
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
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
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          {filteredDestinations.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-dark">
                  {filteredDestinations.length} Destinations Found
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-search text-gray-400 text-2xl"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-dark/70 mb-6">Try adjusting your search criteria or explore our top destinations.</p>
              <button 
                onClick={() => {
                  setSelectedContinent('All');
                  setSelectedClimate('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="bg-[#3a55e7] hover:bg-[#2b3fbb] text-white font-accent font-medium px-5 py-2 rounded-full transition"
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
