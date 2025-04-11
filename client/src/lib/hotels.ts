// Hotel search and booking API integration
// This file connects to Booking.com, Expedia, or other hotel booking services
// through our proxy server to avoid CORS issues

import { apiRequest } from './queryClient';

export interface HotelSearchParams {
  destination: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
  starRating?: number[];
  amenities?: string[];
  propertyType?: string[];
}

export interface HotelResult {
  id: string;
  name: string;
  stars: number;
  rating: number;
  ratingCount: number;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  currency: string;
  imageUrl: string;
  imageUrls: string[];
  amenities: string[];
  roomTypes: {
    id: string;
    name: string;
    description: string;
    pricePerNight: number;
    capacity: number;
    bedType: string;
    available: boolean;
  }[];
  url: string;
  provider: string;
}

/**
 * Search for hotels based on destination and other params
 */
export async function searchHotels(params: HotelSearchParams): Promise<HotelResult[]> {
  try {
    const response = await apiRequest('GET', '/api/hotels/search', params);
    const data = await response.json();
    return data.hotels;
  } catch (error) {
    console.error('Error searching hotels:', error);
    // For demo purposes, return mock data
    // This would be replaced with real API calls in production
    return getMockHotels(params.destination, params.priceMin, params.priceMax);
  }
}

/**
 * Get detailed information about a specific hotel
 */
export async function getHotelDetails(hotelId: string, provider: string): Promise<HotelResult | null> {
  try {
    const response = await apiRequest('GET', `/api/hotels/${hotelId}`, { provider });
    const data = await response.json();
    return data.hotel;
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    return null;
  }
}

/**
 * Mock data for hotel search
 * This would be removed when real API is connected
 */
function getMockHotels(destination: string, minPrice = 0, maxPrice = 1000): HotelResult[] {
  const destinationLower = destination.toLowerCase();
  
  // Return different hotels based on the destination
  if (destinationLower.includes('bali') || destinationLower.includes('indonesia')) {
    return [
      {
        id: 'bali001',
        name: 'Ubud Harmony Resort',
        stars: 4,
        rating: 4.7,
        ratingCount: 532,
        description: 'A serene retreat nestled in the heart of Ubud\'s cultural landscape, offering a perfect blend of luxury and natural beauty.',
        address: 'Jl. Monkey Forest, Ubud',
        city: 'Ubud',
        country: 'Indonesia',
        postalCode: '80571',
        latitude: -8.518,
        longitude: 115.263,
        pricePerNight: 120,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzb3J0JTIwYmFsaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        imageUrls: [
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzb3J0JTIwYmFsaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzb3J0JTIwYmFsaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1559627735-67ca4a442021?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc29ydCUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        ],
        amenities: [
          'Swimming Pool',
          'Spa',
          'Restaurant',
          'Free WiFi',
          'Airport Shuttle',
          'Fitness Center',
          'Yoga Classes'
        ],
        roomTypes: [
          {
            id: 'bali001-r1',
            name: 'Deluxe Garden View',
            description: 'Spacious room with 40m² terrace overlooking lush gardens.',
            pricePerNight: 120,
            capacity: 2,
            bedType: 'King',
            available: true
          },
          {
            id: 'bali001-r2',
            name: 'Pool Villa',
            description: 'Private villa with personal plunge pool and outdoor shower.',
            pricePerNight: 250,
            capacity: 2,
            bedType: 'King',
            available: true
          }
        ],
        url: 'https://www.booking.com',
        provider: 'booking.com'
      },
      {
        id: 'bali002',
        name: 'Seminyak Beach Resort',
        stars: 5,
        rating: 4.9,
        ratingCount: 876,
        description: 'Luxurious beachfront resort with stunning ocean views and world-class amenities.',
        address: 'Jl. Kayu Aya, Seminyak',
        city: 'Seminyak',
        country: 'Indonesia',
        postalCode: '80361',
        latitude: -8.683,
        longitude: 115.156,
        pricePerNight: 280,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1559627735-67ca4a442021?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc29ydCUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        imageUrls: [
          'https://images.unsplash.com/photo-1559627735-67ca4a442021?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc29ydCUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJlc29ydCUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1573790387438-4da905039392?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlc29ydCUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        ],
        amenities: [
          'Private Beach',
          'Infinity Pool',
          'Spa',
          'Multiple Restaurants',
          'Bar',
          'Fitness Center',
          'Concierge',
          'Room Service'
        ],
        roomTypes: [
          {
            id: 'bali002-r1',
            name: 'Ocean View Suite',
            description: 'Elegant suite with panoramic ocean views and private balcony.',
            pricePerNight: 280,
            capacity: 2,
            bedType: 'King',
            available: true
          },
          {
            id: 'bali002-r2',
            name: 'Beachfront Villa',
            description: 'Exclusive villa with direct beach access and private infinity pool.',
            pricePerNight: 450,
            capacity: 4,
            bedType: 'King + Sofa Bed',
            available: true
          }
        ],
        url: 'https://www.expedia.com',
        provider: 'expedia'
      },
      {
        id: 'bali003',
        name: 'Canggu Eco Hostel',
        stars: 2,
        rating: 4.5,
        ratingCount: 312,
        description: 'Sustainable hostel with bamboo architecture, perfect for eco-conscious travelers and digital nomads.',
        address: 'Jl. Batu Mejan, Canggu',
        city: 'Canggu',
        country: 'Indonesia',
        postalCode: '80351',
        latitude: -8.654,
        longitude: 115.130,
        pricePerNight: 20,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1604868189265-a0c7e853ce47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvc3RlbCUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        imageUrls: [
          'https://images.unsplash.com/photo-1604868189265-a0c7e853ce47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvc3RlbCUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1610271340738-726e199f0258?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9zdGVsJTIwYmFsaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        ],
        amenities: [
          'Free WiFi',
          'Communal Kitchen',
          'Co-working Space',
          'Bicycle Rental',
          'Surfboard Rental',
          'Daily Yoga',
          'Organic Cafe'
        ],
        roomTypes: [
          {
            id: 'bali003-r1',
            name: 'Dorm Bed',
            description: 'Comfortable bed in 8-person mixed dormitory with air conditioning.',
            pricePerNight: 20,
            capacity: 1,
            bedType: 'Single',
            available: true
          },
          {
            id: 'bali003-r2',
            name: 'Private Room',
            description: 'Simple but cozy private room with garden view.',
            pricePerNight: 45,
            capacity: 2,
            bedType: 'Queen',
            available: true
          }
        ],
        url: 'https://www.hostelworld.com',
        provider: 'hostelworld'
      }
    ];
  }
  
  if (destinationLower.includes('paris') || destinationLower.includes('france')) {
    return [
      {
        id: 'paris001',
        name: 'Le Grand Palais Hotel',
        stars: 5,
        rating: 4.8,
        ratingCount: 1243,
        description: 'Opulent hotel housed in a 19th-century building with stunning views of the Eiffel Tower.',
        address: '15 Avenue des Champs-Élysées',
        city: 'Paris',
        country: 'France',
        postalCode: '75008',
        latitude: 48.866,
        longitude: 2.311,
        pricePerNight: 450,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        imageUrls: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1576675784201-0e142b423952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        ],
        amenities: [
          'Michelin-Starred Restaurant',
          'Spa',
          'Fitness Center',
          'Concierge',
          'Butler Service',
          'Limousine Service',
          'Valet Parking'
        ],
        roomTypes: [
          {
            id: 'paris001-r1',
            name: 'Deluxe Room',
            description: 'Elegant room with Parisian decor and marble bathroom.',
            pricePerNight: 450,
            capacity: 2,
            bedType: 'King',
            available: true
          },
          {
            id: 'paris001-r2',
            name: 'Eiffel Tower Suite',
            description: 'Luxurious suite with private terrace offering panoramic views of the Eiffel Tower.',
            pricePerNight: 1200,
            capacity: 2,
            bedType: 'King',
            available: true
          }
        ],
        url: 'https://www.booking.com',
        provider: 'booking.com'
      },
      {
        id: 'paris002',
        name: 'Montmartre Artistic Hotel',
        stars: 3,
        rating: 4.5,
        ratingCount: 867,
        description: 'Charming boutique hotel in the artistic district of Montmartre, steps away from Sacré-Cœur.',
        address: '23 Rue des Abbesses, Montmartre',
        city: 'Paris',
        country: 'France',
        postalCode: '75018',
        latitude: 48.884,
        longitude: 2.337,
        pricePerNight: 150,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGFyaXMlMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        imageUrls: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGFyaXMlMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBhcmlzJTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1549298222-1c31e8915347?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhcmlzJTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        ],
        amenities: [
          'Free WiFi',
          'Breakfast Included',
          'Art Gallery',
          'Rooftop Terrace',
          'Bicycle Rental',
          'Airport Shuttle'
        ],
        roomTypes: [
          {
            id: 'paris002-r1',
            name: 'Artist Room',
            description: 'Unique room decorated with works by local artists.',
            pricePerNight: 150,
            capacity: 2,
            bedType: 'Queen',
            available: true
          },
          {
            id: 'paris002-r2',
            name: 'Montmartre Suite',
            description: 'Spacious suite with sitting area and views of the Parisian rooftops.',
            pricePerNight: 250,
            capacity: 3,
            bedType: 'Queen + Sofa Bed',
            available: true
          }
        ],
        url: 'https://www.expedia.com',
        provider: 'expedia'
      },
      {
        id: 'paris003',
        name: 'Le Marais Budget Hostel',
        stars: 2,
        rating: 4.2,
        ratingCount: 562,
        description: 'Modern hostel in the trendy Le Marais district, perfect for budget travelers.',
        address: '45 Rue des Archives, Le Marais',
        city: 'Paris',
        country: 'France',
        postalCode: '75004',
        latitude: 48.859,
        longitude: 2.358,
        pricePerNight: 35,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        imageUrls: [
          'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9zdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        ],
        amenities: [
          'Free WiFi',
          'Communal Kitchen',
          'Lounge Area',
          'Luggage Storage',
          'Walking Tours',
          '24-hour Reception',
          'Laundry Facilities'
        ],
        roomTypes: [
          {
            id: 'paris003-r1',
            name: 'Dorm Bed',
            description: 'Comfortable bed in 6-person mixed dormitory.',
            pricePerNight: 35,
            capacity: 1,
            bedType: 'Single',
            available: true
          },
          {
            id: 'paris003-r2',
            name: 'Private Twin Room',
            description: 'Basic private room with two single beds.',
            pricePerNight: 80,
            capacity: 2,
            bedType: 'Twin',
            available: true
          }
        ],
        url: 'https://www.hostelworld.com',
        provider: 'hostelworld'
      }
    ];
  }

  // Default hotels for any other destination
  return [
    {
      id: 'hotel001',
      name: 'Grand Central Hotel',
      stars: 4,
      rating: 4.5,
      ratingCount: 324,
      description: 'Elegant hotel in the heart of the city with modern amenities and comfortable rooms.',
      address: '123 Main Street',
      city: destination,
      country: 'Various',
      postalCode: '10001',
      latitude: 40.7128,
      longitude: -74.006,
      pricePerNight: 180,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      imageUrls: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1576675784201-0e142b423952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
      ],
      amenities: [
        'Free WiFi',
        'Restaurant',
        'Fitness Center',
        'Room Service',
        'Concierge',
        'Laundry'
      ],
      roomTypes: [
        {
          id: 'hotel001-r1',
          name: 'Standard Room',
          description: 'Comfortable room with all essential amenities.',
          pricePerNight: 180,
          capacity: 2,
          bedType: 'Queen',
          available: true
        },
        {
          id: 'hotel001-r2',
          name: 'Deluxe Suite',
          description: 'Spacious suite with separate living area.',
          pricePerNight: 280,
          capacity: 3,
          bedType: 'King + Sofa Bed',
          available: true
        }
      ],
      url: 'https://www.booking.com',
      provider: 'booking.com'
    },
    {
      id: 'hotel002',
      name: 'Budget Inn Express',
      stars: 2,
      rating: 3.8,
      ratingCount: 186,
      description: 'Affordable accommodation with clean rooms and friendly service.',
      address: '456 Oak Avenue',
      city: destination,
      country: 'Various',
      postalCode: '10002',
      latitude: 40.7138,
      longitude: -74.008,
      pricePerNight: 75,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1557127275-f8b5ba93e24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJ1ZGdldCUyMGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      imageUrls: [
        'https://images.unsplash.com/photo-1557127275-f8b5ba93e24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJ1ZGdldCUyMGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVkZ2V0JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJ1ZGdldCUyMGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
      ],
      amenities: [
        'Free WiFi',
        'Free Parking',
        'Continental Breakfast',
        'Air Conditioning'
      ],
      roomTypes: [
        {
          id: 'hotel002-r1',
          name: 'Standard Room',
          description: 'Simple room with basic amenities.',
          pricePerNight: 75,
          capacity: 2,
          bedType: 'Double',
          available: true
        },
        {
          id: 'hotel002-r2',
          name: 'Family Room',
          description: 'Larger room suitable for families.',
          pricePerNight: 110,
          capacity: 4,
          bedType: 'Two Double Beds',
          available: true
        }
      ],
      url: 'https://www.expedia.com',
      provider: 'expedia'
    },
    {
      id: 'hotel003',
      name: 'Luxury Skyline Resort',
      stars: 5,
      rating: 4.9,
      ratingCount: 512,
      description: 'Premium luxury hotel with panoramic views and exceptional service.',
      address: '789 Skyline Drive',
      city: destination,
      country: 'Various',
      postalCode: '10003',
      latitude: 40.7118,
      longitude: -74.004,
      pricePerNight: 350,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1576675784201-0e142b423952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      imageUrls: [
        'https://images.unsplash.com/photo-1576675784201-0e142b423952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHV4dXJ5JTIwaG90ZWwlMjBwYXJpc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
      ],
      amenities: [
        'Free WiFi',
        'Gourmet Restaurant',
        'Spa',
        'Indoor & Outdoor Pools',
        'Butler Service',
        'Valet Parking',
        'Fitness Center',
        'Business Center'
      ],
      roomTypes: [
        {
          id: 'hotel003-r1',
          name: 'Luxury Room',
          description: 'Elegantly appointed room with premium amenities.',
          pricePerNight: 350,
          capacity: 2,
          bedType: 'King',
          available: true
        },
        {
          id: 'hotel003-r2',
          name: 'Executive Suite',
          description: 'Lavish suite with separate living and dining areas.',
          pricePerNight: 550,
          capacity: 2,
          bedType: 'King',
          available: true
        }
      ],
      url: 'https://www.hotels.com',
      provider: 'hotels.com'
    }
  ];
}