/**
 * Travel API module
 * Handles external API calls to travel services
 */

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

// Experiences data
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
    category: 'Cultural',
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
    category: 'Adventure',
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
    category: 'Luxury',
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
    category: 'Nature',
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
    category: 'Adventure',
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
    category: 'Cultural',
    rating: 5.0,
    reviewCount: 235,
    difficulty: 'Easy',
    groupSize: 'Medium'
  }
];

// Accommodations data
const accommodations = [
  {
    id: '1',
    name: 'Oceanview Villa',
    description: 'Private beach access with panoramic ocean views.',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 350,
    rating: 4.9,
    location: 'Bali, Indonesia',
    amenities: ['Private Pool', 'Beach Access', 'Free Wi-Fi', 'Breakfast Included']
  },
  {
    id: '2',
    name: 'Mountain Chalet',
    description: 'Secluded retreat with stunning alpine views.',
    imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 280,
    rating: 4.8,
    location: 'Swiss Alps, Switzerland',
    amenities: ['Fireplace', 'Hot Tub', 'Ski-in/Ski-out', 'Mountain Views']
  },
  {
    id: '3',
    name: 'Desert Oasis',
    description: 'Luxury villa with private pool in serene desert setting.',
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 320,
    rating: 4.7,
    location: 'Dubai, UAE',
    amenities: ['Private Pool', 'Desert Views', 'Air Conditioning', 'Concierge Service']
  },
  {
    id: '4',
    name: 'Urban Penthouse',
    description: 'Luxury apartment with skyline views in city center.',
    imageUrl: 'https://images.unsplash.com/photo-1560200353-ce0a76b1d438?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    pricePerNight: 420,
    rating: 4.9,
    location: 'New York City, USA',
    amenities: ['Rooftop Terrace', 'City Views', 'Gym Access', 'Doorman']
  }
];

/**
 * Search for destinations based on preferences
 */
export async function travelSearchDestinations(preferences: {
  climate?: string;
  activity?: string;
  budget?: string;
  duration?: string;
}) {
  try {
    // Check if external API keys are available
    if (process.env.TRAVEL_API_KEY) {
      // Call external API - but for now we'll filter our sample data
    }
    
    // Filter destinations based on preferences
    let filtered = [...destinations];
    
    if (preferences.climate && preferences.climate !== 'All') {
      filtered = filtered.filter(
        d => d.climate.toLowerCase() === preferences.climate?.toLowerCase()
      );
    }
    
    if (preferences.activity && preferences.activity !== 'All') {
      filtered = filtered.filter(
        d => d.category.toLowerCase().includes(preferences.activity?.toLowerCase() || '')
      );
    }
    
    // Return filtered destinations, or all if no matches
    return filtered.length > 0 ? filtered : destinations;
  } catch (error) {
    console.error("Error searching destinations:", error);
    return destinations.slice(0, 4); // Return a subset as fallback
  }
}

/**
 * Search for accommodations based on criteria
 */
export async function travelSearchAccommodations(criteria: {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  try {
    // Filter accommodations by location if specified
    let results = [...accommodations];
    
    if (criteria.location) {
      results = results.filter(
        a => a.location.toLowerCase().includes(criteria.location.toLowerCase())
      );
    }
    
    // Add availability and pricing
    return results.map(accommodation => ({
      ...accommodation,
      available: true, // In a real app, this would check availability for the given dates
      totalPrice: accommodation.pricePerNight * calculateNights(criteria.checkIn, criteria.checkOut)
    }));
  } catch (error) {
    console.error("Error searching accommodations:", error);
    return accommodations; // Return all as fallback
  }
}

/**
 * Search for experiences based on criteria
 */
export async function travelSearchExperiences(criteria: {
  location: string;
  date: string;
  category?: string;
}) {
  try {
    let results = [...experiences];
    
    // Filter by location if specified
    if (criteria.location) {
      results = results.filter(
        e => 
          e.location.toLowerCase().includes(criteria.location.toLowerCase()) ||
          e.country.toLowerCase().includes(criteria.location.toLowerCase())
      );
    }
    
    // Filter by category if specified
    if (criteria.category && criteria.category !== 'All') {
      results = results.filter(
        e => e.category.toLowerCase() === criteria.category?.toLowerCase()
      );
    }
    
    return results;
  } catch (error) {
    console.error("Error searching experiences:", error);
    return experiences; // Return all as fallback
  }
}

/**
 * Helper function to calculate number of nights between two dates
 */
function calculateNights(checkIn: string, checkOut: string) {
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Default to 1 if calculation fails
  } catch (error) {
    return 1; // Default to 1 night
  }
}
