import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ExperienceCard from '@/components/ExperienceCard';
import Newsletter from '@/components/Newsletter';

// Experiences
const experiences = [
  {
    id: '1',
    title: 'Authentic Cooking Class',
    location: 'Bangkok',
    country: 'Thailand',
    duration: '4 hours',
    description: 'Learn to prepare authentic Thai dishes with local ingredients from a master chef in a traditional setting.',
    imageUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 65,
    category: 'Cultural' as const,
    rating: 4.5,
    reviewCount: 218,
    difficulty: 'Easy',
    groupSize: 'Small'
  },
  {
    id: '2',
    title: 'Hot Air Balloon Safari',
    location: 'Cappadocia',
    country: 'Turkey',
    duration: '3 hours',
    description: 'Soar above the stunning fairy chimneys and unique landscapes of Cappadocia at sunrise.',
    imageUrl: 'https://images.unsplash.com/photo-1530866495561-253f6a300745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 175,
    category: 'Adventure' as const,
    rating: 5.0,
    reviewCount: 342,
    difficulty: 'Easy',
    groupSize: 'Medium'
  },
  {
    id: '3',
    title: 'Private Yacht Sunset Cruise',
    location: 'Santorini',
    country: 'Greece',
    duration: '5 hours',
    description: 'Sail around the caldera on a private yacht with gourmet dinner and premium wine as the sun sets.',
    imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 320,
    category: 'Luxury' as const,
    rating: 4.5,
    reviewCount: 156,
    difficulty: 'Easy',
    groupSize: 'Small'
  },
  {
    id: '4',
    title: 'Northern Lights Expedition',
    location: 'Tromsø',
    country: 'Norway',
    duration: '6 hours',
    description: 'Chase the Aurora Borealis with expert guides who know the best viewing locations away from light pollution.',
    imageUrl: 'https://images.unsplash.com/photo-1464037946554-55bf5c27f07a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 195,
    category: 'Nature' as const,
    rating: 5.0,
    reviewCount: 289,
    difficulty: 'Moderate',
    groupSize: 'Medium'
  },
  {
    id: '5',
    title: 'Hidden Trails Hiking Tour',
    location: 'Swiss Alps',
    country: 'Switzerland',
    duration: '8 hours',
    description: 'Experience breathtaking vistas on trails known only to locals, led by certified mountain guides.',
    imageUrl: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 115,
    category: 'Adventure' as const,
    rating: 4.5,
    reviewCount: 176,
    difficulty: 'Challenging',
    groupSize: 'Small'
  },
  {
    id: '6',
    title: 'Exclusive Vineyard Tour',
    location: 'Tuscany',
    country: 'Italy',
    duration: '7 hours',
    description: 'Visit family-owned vineyards, enjoy premium wine tastings, and learn about traditional winemaking.',
    imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 135,
    category: 'Cultural' as const,
    rating: 5.0,
    reviewCount: 235,
    difficulty: 'Easy',
    groupSize: 'Medium'
  },
  {
    id: '7',
    title: 'Tokyo Street Food Tour',
    location: 'Tokyo',
    country: 'Japan',
    duration: '4 hours',
    description: 'Sample the best street food in Tokyo\'s hidden alleys and local neighborhoods with an expert food guide.',
    imageUrl: 'https://images.unsplash.com/photo-1536551390137-87f66575222a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 85,
    category: 'Cultural' as const,
    rating: 4.8,
    reviewCount: 195,
    difficulty: 'Easy',
    groupSize: 'Small'
  },
  {
    id: '8',
    title: 'Sahara Desert Camel Trek',
    location: 'Marrakech',
    country: 'Morocco',
    duration: '2 days',
    description: 'Journey through the Sahara on camelback and sleep under the stars in a traditional Berber camp.',
    imageUrl: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 240,
    category: 'Adventure' as const,
    rating: 4.9,
    reviewCount: 132,
    difficulty: 'Moderate',
    groupSize: 'Medium'
  },
  {
    id: '9',
    title: 'Scuba Diving Adventure',
    location: 'Great Barrier Reef',
    country: 'Australia',
    duration: '6 hours',
    description: 'Explore the world\'s largest coral reef system with expert dive masters and discover amazing marine life.',
    imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 175,
    category: 'Adventure' as const,
    rating: 4.7,
    reviewCount: 210,
    difficulty: 'Challenging',
    groupSize: 'Small'
  }
];

const categories = ['All', 'Cultural', 'Adventure', 'Luxury', 'Nature'];
const difficulties = ['All', 'Easy', 'Moderate', 'Challenging'];
const groupSizes = ['All', 'Small', 'Medium', 'Large'];
const priceRanges = ['All', 'Under $100', '$100 - $200', 'Over $200'];

export default function Itineraries() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedGroupSize, setSelectedGroupSize] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search initiated",
      description: `Searching for experiences matching: "${searchQuery}"`,
    });
  };
  
  const isPriceInRange = (price: number, range: string) => {
    switch (range) {
      case 'Under $100':
        return price < 100;
      case '$100 - $200':
        return price >= 100 && price <= 200;
      case 'Over $200':
        return price > 200;
      default:
        return true;
    }
  };
  
  const filteredExperiences = experiences.filter(experience => {
    const matchesCategory = selectedCategory === 'All' || experience.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || experience.difficulty === selectedDifficulty;
    const matchesGroupSize = selectedGroupSize === 'All' || experience.groupSize === selectedGroupSize;
    const matchesPriceRange = selectedPriceRange === 'All' || isPriceInRange(experience.price, selectedPriceRange);
    const matchesSearch = searchQuery === '' || 
                         experience.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         experience.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experience.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesGroupSize && matchesPriceRange && matchesSearch;
  });
  
  return (
    <>
      {/* Page Header */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-dark text-center mb-6">Discover Unique Experiences</h1>
          <p className="text-lg text-dark/70 text-center max-w-3xl mx-auto mb-8">
            Find and book unforgettable activities around the world, from cooking classes to adventure tours and luxury experiences.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experiences, locations, or activities..." 
                className="w-full py-3 px-5 pl-12 rounded-full border border-gray-200 focus:outline-none focus:border-primary"
              />
              <button type="submit" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <h3 className="font-accent font-semibold mb-3">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button 
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedDifficulty === difficulty 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Group Size Filter */}
            <div>
              <h3 className="font-accent font-semibold mb-3">Group Size</h3>
              <div className="flex flex-wrap gap-2">
                {groupSizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedGroupSize(size)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedGroupSize === size 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div>
              <h3 className="font-accent font-semibold mb-3">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button 
                    key={range}
                    onClick={() => setSelectedPriceRange(range)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedPriceRange === range 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Experiences Grid */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          {filteredExperiences.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-dark">
                  {filteredExperiences.length} Experiences Found
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExperiences.map((experience) => (
                  <ExperienceCard 
                    key={experience.id}
                    id={experience.id}
                    title={experience.title}
                    location={experience.location}
                    country={experience.country}
                    duration={experience.duration}
                    description={experience.description}
                    imageUrl={experience.imageUrl}
                    price={experience.price}
                    category={experience.category}
                    rating={experience.rating}
                    reviewCount={experience.reviewCount}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-compass text-gray-400 text-2xl"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No experiences found</h3>
              <p className="text-dark/70 mb-6">Try adjusting your search criteria or explore our top experiences.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                  setSelectedGroupSize('All');
                  setSelectedPriceRange('All');
                  setSearchQuery('');
                }}
                className="bg-primary hover:bg-primary/90 text-white font-accent font-medium px-5 py-2 rounded-full transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
