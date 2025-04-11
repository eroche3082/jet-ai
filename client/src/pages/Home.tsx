import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import DestinationCard from '@/components/DestinationCard';
import ExperienceCard from '@/components/ExperienceCard';
import AccommodationCard from '@/components/AccommodationCard';
import TestimonialCard from '@/components/TestimonialCard';
import Newsletter from '@/components/Newsletter';
import { useToast } from '@/hooks/use-toast';

// Destination data
const destinations = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    description: 'Experience the city of lights with its iconic landmarks and romantic charm.',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Blend of traditional culture and cutting-edge technology in Japan\'s vibrant capital.',
    imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Santorini',
    country: 'Greece',
    description: 'Picturesque white-washed buildings overlooking the azure Aegean Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.7
  },
  {
    id: '4',
    name: 'New York City',
    country: 'USA',
    description: 'The city that never sleeps offers world-class entertainment, dining, and culture.',
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.0
  },
  {
    id: '5',
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'Ancient Incan citadel set high in the Andes Mountains, a wonder of engineering.',
    imageUrl: 'https://images.unsplash.com/photo-1523592121529-f6dde35f079e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.8
  },
  {
    id: '6',
    name: 'Amalfi Coast',
    country: 'Italy',
    description: 'Dramatic coastline with colorful fishing villages and cliffside lemon groves.',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.6
  },
  {
    id: '7',
    name: 'Dubai',
    country: 'UAE',
    description: 'Futuristic cityscape with record-breaking architecture and luxury shopping.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.3
  },
  {
    id: '8',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Island paradise with lush landscapes, spiritual temples, and vibrant culture.',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    rating: 4.7
  }
];

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
    reviewCount: 218
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
    reviewCount: 342
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
    reviewCount: 156
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
    reviewCount: 289
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
    reviewCount: 176
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
    reviewCount: 235
  }
];

// Accommodations
const accommodations = [
  {
    id: '1',
    name: 'Oceanview Villa',
    description: 'Private beach access with panoramic ocean views.',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 350,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Mountain Chalet',
    description: 'Secluded retreat with stunning alpine views.',
    imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 280,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Desert Oasis',
    description: 'Luxury villa with private pool in serene desert setting.',
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 320,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Urban Penthouse',
    description: 'Luxury apartment with skyline views in city center.',
    imageUrl: 'https://images.unsplash.com/photo-1560200353-ce0a76b1d438?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 420,
    rating: 4.9
  }
];

// Testimonials
const testimonials = [
  {
    id: '1',
    name: 'Sarah J.',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    testimonial: 'JetAI recommended a perfect itinerary for our family trip to Japan. The AI suggested activities that kept both our teenagers and us parents happy, which is no small feat! The restaurant recommendations were spot on.',
    rating: 5.0
  },
  {
    id: '2',
    name: 'Miguel R.',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    testimonial: 'As a solo traveler, I was worried about planning my Europe backpacking trip. JetAI not only created a budget-friendly route but also connected me with group experiences where I met amazing people. Absolutely life-changing!',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Emma T.',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    testimonial: 'My husband wanted adventure, I wanted relaxation. Somehow, JetAI managed to create a Bali itinerary that perfectly balanced both! The personalized recommendations based on our conversation with the AI were incredibly accurate.',
    rating: 5.0
  }
];

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      // Show toast
      toast({
        title: prev.includes(id) ? "Removed from favorites" : "Added to favorites",
        description: prev.includes(id) 
          ? "The accommodation has been removed from your favorites." 
          : "The accommodation has been added to your favorites.",
      });
      
      return newFavorites;
    });
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] bg-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")' }}
        >
          <div className="absolute inset-0 gradient-overlay"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-shadow animate-fade-in">
              Discover Your Perfect Journey with AI
            </h1>
            <p className="text-lg md:text-xl mb-8 text-shadow max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Let our intelligent travel assistant create personalized itineraries based on your preferences and travel style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link 
                href="#ai-assistant" 
                className="inline-block bg-primary hover:bg-primary/90 text-white font-accent font-semibold px-8 py-3 rounded-full transition text-center"
              >
                Chat with AI Assistant
              </Link>
              <Link 
                href="/destinations" 
                className="inline-block bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-accent font-semibold px-8 py-3 rounded-full transition text-center"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section id="destinations" className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">Popular Destinations</h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Explore trending locations curated by our AI based on traveler reviews and seasonal attractions.
            </p>
          </div>
          
          {/* Destination Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.slice(0, 4).map((destination) => (
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
          
          {/* More destinations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {destinations.slice(4).map((destination) => (
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
          
          <div className="text-center mt-12">
            <Link 
              href="/destinations" 
              className="inline-block bg-dark hover:bg-dark/90 text-white font-accent font-semibold px-6 py-3 rounded-full transition"
            >
              Explore All Destinations <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>
      
      {/* AI Features */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-6">Smart Travel Planning with AI</h2>
              <p className="text-lg text-dark/70 mb-8">
                Our advanced AI assistant learns your preferences to create personalized travel experiences 
                tailored to your interests, budget, and travel style.
              </p>
              
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-map-marked-alt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold text-dark mb-2">Personalized Itineraries</h3>
                    <p className="text-dark/70">
                      Get custom travel plans based on your interests, time constraints, and budget preferences.
                    </p>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-globe-americas text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold text-dark mb-2">Destination Matching</h3>
                    <p className="text-dark/70">
                      Discover perfect destinations that match your travel preferences and dream vacation criteria.
                    </p>
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-calendar-alt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold text-dark mb-2">Smart Scheduling</h3>
                    <p className="text-dark/70">
                      Optimize your daily activities with AI-powered scheduling that considers opening hours, 
                      travel time, and crowd levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Example chat interface preview */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transform rotate-1">
                <div className="bg-primary text-white p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <i className="fas fa-robot text-white"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-accent font-semibold">JetAI Assistant</h3>
                      <p className="text-xs text-white/80">Your personal travel planner</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 h-80 overflow-y-auto">
                  {/* AI Message */}
                  <div className="mb-4 flex">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-robot text-primary text-sm"></i>
                    </div>
                    <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                      <p className="text-sm">Hello! I'm your JetAI travel assistant. Where would you like to travel next?</p>
                    </div>
                  </div>
                  
                  {/* User Message */}
                  <div className="mb-4 flex justify-end">
                    <div className="bg-primary/10 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                      <p className="text-sm">I'd like to plan a beach vacation in July with cultural experiences.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0">
                      <i className="fas fa-user text-gray-500 text-sm"></i>
                    </div>
                  </div>
                  
                  {/* AI Response with Options */}
                  <div className="mb-4 flex">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-robot text-primary text-sm"></i>
                    </div>
                    <div className="space-y-3 max-w-[80%]">
                      <div className="bg-gray-100 rounded-lg rounded-tl-none p-3">
                        <p className="text-sm">
                          Great choice! Based on your preferences, here are some destinations that combine beautiful beaches with rich culture:
                        </p>
                      </div>
                      
                      {/* Recommendation Cards */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {/* Card 1 */}
                        <div className="flex-shrink-0 w-32 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                          <img 
                            src="https://images.unsplash.com/photo-1530538095376-a4936b35b5f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                            alt="Bali recommendation" 
                            className="w-full h-20 object-cover" 
                          />
                          <div className="p-2">
                            <p className="font-semibold text-xs">Bali</p>
                            <p className="text-xs text-gray-500">Indonesia</p>
                          </div>
                        </div>
                        
                        {/* Card 2 */}
                        <div className="flex-shrink-0 w-32 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                          <img 
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                            alt="Cancun recommendation" 
                            className="w-full h-20 object-cover" 
                          />
                          <div className="p-2">
                            <p className="font-semibold text-xs">Cancún</p>
                            <p className="text-xs text-gray-500">Mexico</p>
                          </div>
                        </div>
                        
                        {/* Card 3 */}
                        <div className="flex-shrink-0 w-32 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                          <img 
                            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                            alt="Greece recommendation" 
                            className="w-full h-20 object-cover" 
                          />
                          <div className="p-2">
                            <p className="font-semibold text-xs">Santorini</p>
                            <p className="text-xs text-gray-500">Greece</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 rounded-lg rounded-tl-none p-3">
                        <p className="text-sm">Would you like me to create a detailed itinerary for any of these destinations?</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User typing animation */}
                  <div className="flex justify-end">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm typing-animation">I'd love an itinerary for Bali</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0">
                      <i className="fas fa-user text-gray-500 text-sm"></i>
                    </div>
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      placeholder="Type your travel question..." 
                      className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none"
                    />
                    <button className="ml-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-white transition">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute -z-10 w-full h-full -top-4 -right-4 bg-primary/5 rounded-2xl"></div>
              <div className="absolute -z-10 w-full h-full -bottom-4 -left-4 bg-secondary/5 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Luxury Stays */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">Luxury Accommodations</h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Discover exceptional stays curated by our AI to match your comfort preferences and style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accommodations.map((accommodation) => (
              <AccommodationCard 
                key={accommodation.id}
                id={accommodation.id}
                name={accommodation.name}
                description={accommodation.description}
                imageUrl={accommodation.imageUrl}
                pricePerNight={accommodation.pricePerNight}
                rating={accommodation.rating}
                isFavorite={favorites.includes(accommodation.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/checkout" 
              className="inline-block bg-white border border-primary text-primary hover:bg-primary hover:text-white font-accent font-semibold px-6 py-3 rounded-full transition"
            >
              Browse All Accommodations
            </Link>
          </div>
        </div>
      </section>
      
      {/* Popular Experiences */}
      <section id="itineraries" className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">Popular Experiences</h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Unique activities curated by our AI to create unforgettable memories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
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
          
          <div className="text-center mt-12">
            <Link 
              href="/itineraries" 
              className="inline-block bg-accent hover:bg-accent/90 text-white font-accent font-semibold px-6 py-3 rounded-full transition"
            >
              Discover All Experiences <i className="fas fa-compass ml-2"></i>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">Traveler Stories</h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Hear what our community has to say about their experiences with JetAI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id}
                id={testimonial.id}
                name={testimonial.name}
                avatarUrl={testimonial.avatarUrl}
                testimonial={testimonial.testimonial}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
