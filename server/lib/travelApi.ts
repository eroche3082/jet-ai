/**
 * Travel API module
 * Handles external API calls to travel services
 */

import axios from 'axios';
import Amadeus from 'amadeus';

// Initialize Amadeus client with API key and secret
let amadeusClient: Amadeus | null = null;
try {
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET_KEY) {
    amadeusClient = new Amadeus({
      clientId: process.env.AMADEUS_API_KEY,
      clientSecret: process.env.AMADEUS_API_SECRET_KEY
    });
    console.log('✅ Amadeus API client initialized successfully');
  } else {
    console.warn('⚠️ Amadeus API credentials not found');
  }
} catch (error) {
  console.error('❌ Error initializing Amadeus client:', error);
}

// Initialize RapidAPI client configuration
const rapidApiConfig = process.env.RAPIDAPI_KEY
  ? {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': '',
      }
    }
  : null;

if (rapidApiConfig) {
  console.log('✅ RapidAPI configuration initialized successfully');
} else {
  console.warn('⚠️ RapidAPI key not found');
}

/**
 * Set RapidAPI host dynamically based on service
 */
function setRapidApiHost(service: string): string | null {
  if (!rapidApiConfig) return null;
  
  switch (service) {
    case 'tripadvisor':
      rapidApiConfig.headers['x-rapidapi-host'] = 'tripadvisor16.p.rapidapi.com';
      return 'tripadvisor16.p.rapidapi.com';
    case 'booking':
      rapidApiConfig.headers['x-rapidapi-host'] = 'booking-com15.p.rapidapi.com';
      return 'booking-com15.p.rapidapi.com';
    case 'airbnb':
      rapidApiConfig.headers['x-rapidapi-host'] = 'airbnb19.p.rapidapi.com';
      return 'airbnb19.p.rapidapi.com';
    case 'googleflights':
      rapidApiConfig.headers['x-rapidapi-host'] = 'google-flights2.p.rapidapi.com';
      return 'google-flights2.p.rapidapi.com';
    case 'aerodata': 
      rapidApiConfig.headers['x-rapidapi-host'] = 'aerodatabox.p.rapidapi.com';
      return 'aerodatabox.p.rapidapi.com';
    default:
      return null;
  }
}

// Flight API integration
/**
 * Search for flights based on criteria
 */
export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: string;
  direct?: boolean;
}) {
  try {
    // Try Amadeus first if available
    if (amadeusClient) {
      console.log('Searching flights with Amadeus API');
      try {
        const response = await amadeusClient.shopping.flightOffersSearch.get({
          originLocationCode: params.origin,
          destinationLocationCode: params.destination,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.adults || 1,
          children: params.children,
          infants: params.infants,
          travelClass: mapCabinClass(params.cabinClass),
          nonStop: params.direct,
          currencyCode: 'USD',
          max: 20
        });
        
        return formatAmadeusFlights(response.data);
      } catch (amadeusError) {
        console.error("Error with Amadeus flight search:", amadeusError);
        // Fall through to RapidAPI
      }
    }
    
    // Try RapidAPI Google Flights as backup
    if (rapidApiConfig) {
      const host = setRapidApiHost('googleflights');
      if (host) {
        console.log('Falling back to RapidAPI Google Flights');
        try {
          const response = await axios.get(
            `https://${host}/api/v1/search`, 
            {
              ...rapidApiConfig,
              params: {
                departureAirport: params.origin,
                arrivalAirport: params.destination,
                departureDate: params.departureDate,
                returnDate: params.returnDate,
                adults: params.adults || 1,
                currency: 'USD',
                cabinClass: params.cabinClass?.toLowerCase() || 'economy'
              }
            }
          );
          
          return formatRapidApiFlights(response.data);
        } catch (rapidApiError) {
          console.error("Error with RapidAPI Google Flights:", rapidApiError);
          // Fall through to sample data
        }
      }
    }
    
    // If all APIs fail, use the sample flight data
    console.log("All flight APIs failed, using internal flight data for:", params.origin, "to", params.destination);
    const filteredFlights = generateFlightData(params);
    return { flights: filteredFlights, source: 'fallback' };
  } catch (error) {
    console.error("Error searching flights:", error);
    // If there's an API error, fall back to sample data
    const filteredFlights = generateFlightData(params);
    return { flights: filteredFlights, source: 'fallback' };
  }
}

/**
 * Convert cabin class to Amadeus format
 */
function mapCabinClass(cabinClass?: string): string {
  if (!cabinClass) return 'ECONOMY';
  
  const cabin = cabinClass.toLowerCase();
  if (cabin.includes('business')) return 'BUSINESS';
  if (cabin.includes('first')) return 'FIRST';
  if (cabin.includes('premium') || cabin.includes('plus')) return 'PREMIUM_ECONOMY';
  return 'ECONOMY';
}

/**
 * Format Amadeus API flight response to a common format
 */
function formatAmadeusFlights(data: any): { flights: any[], source: string } {
  try {
    if (!data || !Array.isArray(data)) {
      return { flights: [], source: 'amadeus' };
    }
    
    const flights = data.map((offer: any) => {
      const firstSegment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
      
      return {
        id: offer.id,
        airline: firstSegment.carrierCode,
        airlineCode: firstSegment.carrierCode,
        flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
        origin: firstSegment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
        departureTime: firstSegment.departure.at,
        arrivalTime: lastSegment.arrival.at,
        duration: offer.itineraries[0].duration ? parseInt(offer.itineraries[0].duration.replace('PT', '').replace('H', '').replace('M', '')) : 0,
        stops: offer.itineraries[0].segments.length - 1,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        deep_link: '', // Amadeus doesn't provide direct booking links
        cabinClass: offer.travelerPricings[0].fareDetailsBySegment[0].cabin.toLowerCase(),
        availableSeats: offer.numberOfBookableSeats || 1,
        logoUrl: `https://www.gstatic.com/flights/airline_logos/70px/${firstSegment.carrierCode}.png`
      };
    });
    
    return { flights, source: 'amadeus' };
  } catch (error) {
    console.error('Error formatting Amadeus flights:', error);
    return { flights: [], source: 'amadeus_error' };
  }
}

/**
 * Format RapidAPI flights response to a common format
 */
function formatRapidApiFlights(data: any): { flights: any[], source: string } {
  try {
    if (!data || !data.data || !Array.isArray(data.data.flightOffers)) {
      return { flights: [], source: 'rapidapi' };
    }
    
    const flights = data.data.flightOffers.map((offer: any) => {
      const firstSegment = offer.segments[0];
      const lastSegment = offer.segments[offer.segments.length - 1];
      
      return {
        id: offer.id || `rapidapi-${Math.random().toString(36).substring(7)}`,
        airline: firstSegment.airline.name,
        airlineCode: firstSegment.airline.code,
        flightNumber: firstSegment.flightNumber,
        origin: firstSegment.departure.airport.code,
        destination: lastSegment.arrival.airport.code,
        departureTime: firstSegment.departure.time,
        arrivalTime: lastSegment.arrival.time,
        duration: offer.duration,
        stops: offer.segments.length - 1,
        price: offer.price.total,
        currency: offer.price.currency,
        deep_link: offer.deep_link || '',
        cabinClass: offer.cabin.toLowerCase(),
        availableSeats: offer.availableSeats || 1,
        logoUrl: firstSegment.airline.logo || `https://www.gstatic.com/flights/airline_logos/70px/${firstSegment.airline.code}.png`
      };
    });
    
    return { flights, source: 'rapidapi' };
  } catch (error) {
    console.error('Error formatting RapidAPI flights:', error);
    return { flights: [], source: 'rapidapi_error' };
  }
}

/**
 * Get detailed information about a specific flight
 */
export async function getFlightById(flightId: string) {
  try {
    // Try Amadeus first if available
    if (amadeusClient) {
      try {
        const response = await amadeusClient.shopping.flightOffers.get(flightId);
        if (response.data) {
          return formatAmadeusFlights([response.data]);
        }
      } catch (amadeusError) {
        console.error("Error with Amadeus flight details:", amadeusError);
        // Fall through to RapidAPI
      }
    }
    
    // Try RapidAPI Google Flights as backup
    if (rapidApiConfig) {
      const host = setRapidApiHost('googleflights');
      if (host) {
        try {
          const response = await axios.get(
            `https://${host}/api/v1/flight_details`, 
            {
              ...rapidApiConfig,
              params: { flightId }
            }
          );
          
          if (response.data && response.data.data) {
            return formatRapidApiFlights(response.data);
          }
        } catch (rapidApiError) {
          console.error("Error with RapidAPI Google Flights details:", rapidApiError);
          // Fall through to sample data
        }
      }
    }
    
    // If API calls fail, find the flight in our sample data
    console.log("All flight APIs failed, using internal flight data for ID:", flightId);
    const flight = sampleFlights.find(f => f.id === flightId);
    
    if (!flight) {
      throw new Error(`Flight with ID ${flightId} not found in backup data`);
    }
    
    return { flights: [flight], source: 'fallback' };
  } catch (error) {
    console.error("Error getting flight details:", error);
    // Final fallback
    const flight = sampleFlights.find(f => f.id === flightId);
      
    if (!flight) {
      throw new Error(`Flight with ID ${flightId} not found in any data source`);
    }
    
    return { flights: [flight], source: 'fallback' };
  }
}

// Sample flight data for testing when API is not available
const sampleFlights = [
  {
    id: 'fl-001',
    airline: 'Skyline Airways',
    airlineCode: 'SKA',
    flightNumber: 'SKA1234',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2025-06-15T08:30:00',
    arrivalTime: '2025-06-15T11:45:00',
    duration: 315, // in minutes
    stops: 0,
    price: 329,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-001',
    cabinClass: 'economy',
    availableSeats: 23,
    logoUrl: 'https://example.com/airlines/skyline.png'
  },
  {
    id: 'fl-002',
    airline: 'Eagle Airlines',
    airlineCode: 'EAG',
    flightNumber: 'EA789',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2025-06-15T10:15:00',
    arrivalTime: '2025-06-15T14:05:00',
    duration: 350, // in minutes
    stops: 1,
    price: 278,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-002',
    cabinClass: 'economy',
    availableSeats: 15,
    logoUrl: 'https://example.com/airlines/eagle.png'
  },
  {
    id: 'fl-003',
    airline: 'Global Express',
    airlineCode: 'GLX',
    flightNumber: 'GX432',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2025-06-15T13:20:00',
    arrivalTime: '2025-06-15T16:35:00',
    duration: 315, // in minutes
    stops: 0,
    price: 412,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-003',
    cabinClass: 'premium_economy',
    availableSeats: 8,
    logoUrl: 'https://example.com/airlines/global.png'
  },
  {
    id: 'fl-004',
    airline: 'Ocean Air',
    airlineCode: 'OCN',
    flightNumber: 'OA567',
    origin: 'SFO',
    destination: 'LHR',
    departureTime: '2025-06-20T19:45:00',
    arrivalTime: '2025-06-21T13:55:00',
    duration: 630, // in minutes
    stops: 0,
    price: 876,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-004',
    cabinClass: 'economy',
    availableSeats: 32,
    logoUrl: 'https://example.com/airlines/ocean.png'
  },
  {
    id: 'fl-005',
    airline: 'Star Alliance',
    airlineCode: 'SAL',
    flightNumber: 'SA901',
    origin: 'SFO',
    destination: 'LHR',
    departureTime: '2025-06-20T16:30:00',
    arrivalTime: '2025-06-21T11:15:00',
    duration: 645, // in minutes
    stops: 1,
    price: 785,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-005',
    cabinClass: 'economy',
    availableSeats: 14,
    logoUrl: 'https://example.com/airlines/star.png'
  },
  {
    id: 'fl-006',
    airline: 'Skyline Airways',
    airlineCode: 'SKA',
    flightNumber: 'SKA775',
    origin: 'LAX',
    destination: 'CDG',
    departureTime: '2025-07-10T14:20:00',
    arrivalTime: '2025-07-11T10:30:00',
    duration: 700, // in minutes
    stops: 0,
    price: 995,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-006',
    cabinClass: 'business',
    availableSeats: 6,
    logoUrl: 'https://example.com/airlines/skyline.png'
  },
  {
    id: 'fl-007',
    airline: 'Air Europa',
    airlineCode: 'AEU',
    flightNumber: 'AE332',
    origin: 'LAX',
    destination: 'CDG',
    departureTime: '2025-07-10T17:40:00',
    arrivalTime: '2025-07-11T13:55:00',
    duration: 675, // in minutes
    stops: 1,
    price: 845,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-007',
    cabinClass: 'economy',
    availableSeats: 19,
    logoUrl: 'https://example.com/airlines/europa.png'
  },
  {
    id: 'fl-008',
    airline: 'Air France',
    airlineCode: 'AFR',
    flightNumber: 'AF228',
    origin: 'CDG',
    destination: 'HND',
    departureTime: '2025-07-12T11:05:00',
    arrivalTime: '2025-07-13T06:30:00',
    duration: 730, // in minutes
    stops: 0,
    price: 1125,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-008',
    cabinClass: 'economy',
    availableSeats: 22,
    logoUrl: 'https://example.com/airlines/airfrance.png'
  },
  {
    id: 'fl-009',
    airline: 'Japan Airways',
    airlineCode: 'JPN',
    flightNumber: 'JA459',
    origin: 'CDG',
    destination: 'HND',
    departureTime: '2025-07-12T14:25:00',
    arrivalTime: '2025-07-13T09:40:00',
    duration: 715, // in minutes
    stops: 0,
    price: 1075,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-009',
    cabinClass: 'premium_economy',
    availableSeats: 11,
    logoUrl: 'https://example.com/airlines/japan.png'
  },
  {
    id: 'fl-010',
    airline: 'Delta',
    airlineCode: 'DLT',
    flightNumber: 'DL887',
    origin: 'ATL',
    destination: 'MEX',
    departureTime: '2025-08-05T09:30:00',
    arrivalTime: '2025-08-05T12:15:00',
    duration: 225, // in minutes
    stops: 0,
    price: 310,
    currency: 'USD',
    deep_link: 'https://example.com/book/fl-010',
    cabinClass: 'economy',
    availableSeats: 28,
    logoUrl: 'https://example.com/airlines/delta.png'
  }
];

/**
 * Generate flight data based on search parameters
 */
function generateFlightData(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: string;
  direct?: boolean;
}) {
  try {
    // Create a departure date object
    const departureDate = new Date(params.departureDate);
    
    // Filter flights based on origin and destination
    let availableFlights = sampleFlights.filter(flight => {
      // Case insensitive airport code matching
      const originMatches = flight.origin.toLowerCase() === params.origin.toLowerCase() ||
                            flight.origin.toLowerCase().includes(params.origin.toLowerCase()) ||
                            params.origin.toLowerCase().includes(flight.origin.toLowerCase());
      
      const destMatches = flight.destination.toLowerCase() === params.destination.toLowerCase() ||
                          flight.destination.toLowerCase().includes(params.destination.toLowerCase()) ||
                          params.destination.toLowerCase().includes(flight.destination.toLowerCase());
      
      return originMatches && destMatches;
    });

    // If no direct matches, return all flights but adjust them to match requested route
    if (availableFlights.length === 0) {
      availableFlights = sampleFlights.map(flight => ({
        ...flight,
        origin: params.origin.toUpperCase(),
        destination: params.destination.toUpperCase(),
        id: `${flight.id}-custom`, // Append -custom to avoid id conflicts
      }));
    }

    // Filter by cabin class if specified
    if (params.cabinClass) {
      const cabinClass = params.cabinClass.toLowerCase();
      availableFlights = availableFlights.filter(flight => 
        flight.cabinClass.toLowerCase() === cabinClass
      );
    }
    
    // Filter direct flights if requested
    if (params.direct) {
      availableFlights = availableFlights.filter(flight => flight.stops === 0);
    }

    // Adjust flight dates to match the requested departure date
    return availableFlights.map(flight => {
      // Create new departure and arrival times based on the requested date
      const departureTime = new Date(flight.departureTime);
      departureTime.setFullYear(departureDate.getFullYear());
      departureTime.setMonth(departureDate.getMonth());
      departureTime.setDate(departureDate.getDate());
      
      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(departureTime.getMinutes() + flight.duration);
      
      return {
        ...flight,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        // Adjust price based on number of travelers
        price: flight.price * (params.adults || 1)
      };
    });
  } catch (error) {
    console.error("Error generating flight data:", error);
    return sampleFlights.slice(0, 3); // Return a subset as fallback
  }
}

// Destination data with real API integration
export async function searchDestinations(location?: string, category?: string, limit?: number) {
  try {
    if (rapidApiConfig) {
      // Try to search using TripAdvisor via RapidAPI
      const host = setRapidApiHost('tripadvisor');
      if (host) {
        try {
          console.log('Searching destinations with TripAdvisor API');
          const searchTerm = location || '';
          // Try all TripAdvisor API endpoints that might work
          let response = null;
          let apiPaths = [
            'locations/search',
            'locations/v2/search',
            'location/search',
            'hotels/searchLocation',
            'restaurant/searchLocation'
          ];
          
          // Try each endpoint, use the first one that works
          for (const path of apiPaths) {
            try {
              console.log(`Trying TripAdvisor endpoint: ${path}`);
              response = await axios.get(
                `https://${host}/${path}`, 
                {
                  ...rapidApiConfig,
                  params: {
                    query: searchTerm,
                    limit: limit || 10,
                    language: 'en',
                    currency: 'USD'
                  }
                }
              );
              
              if (response.status === 200 && response.data) {
                console.log(`Successfully connected to TripAdvisor endpoint: ${path}`);
                break;
              }
            } catch (err) {
              console.log(`Endpoint ${path} failed: ${err.message}`);
            }
          }
          
          // Updated for the latest TripAdvisor location search API format
          if (response && response.data && response.data.results && Array.isArray(response.data.results)) {
            console.log('TripAdvisor API returned results');
            return {
              destinations: response.data.results.map((item: any) => ({
                id: item.locationId || item.location_id || item.id || crypto.randomUUID(),
                name: item.name || item.title || 'Unknown Location',
                country: item.country || item.address_obj?.country || item.secondaryText || '',
                description: item.description || `Explore the wonders of ${item.name || item.title || 'this destination'}`,
                imageUrl: item.photo?.images?.medium?.url || item.image?.url || 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                rating: item.rating || 4.5,
                continent: item.continent || item.address_obj?.continent || '',
                climate: item.climate || '',
                category: category || item.category?.name || item.type || 'City',
                source: 'tripadvisor'
              })),
              source: 'tripadvisor'
            };
          }
        } catch (error) {
          console.error('Error fetching destinations from TripAdvisor:', error);
          // Fall through to backup data
        }
      }
    }
    
    // Use backup data if API fails
    console.log('Using backup destination data');
    let filteredDestinations = [...destinations];
    
    if (location) {
      const searchTerm = location.toLowerCase();
      filteredDestinations = filteredDestinations.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm) || 
        dest.country.toLowerCase().includes(searchTerm) ||
        dest.continent.toLowerCase().includes(searchTerm)
      );
    }
    
    if (category) {
      const searchCategory = category.toLowerCase();
      filteredDestinations = filteredDestinations.filter(dest => 
        dest.category.toLowerCase().includes(searchCategory)
      );
    }
    
    if (limit && limit > 0) {
      filteredDestinations = filteredDestinations.slice(0, limit);
    }
    
    return { 
      destinations: filteredDestinations,
      source: 'fallback'
    };
  } catch (error) {
    console.error('Error in searchDestinations:', error);
    return { 
      destinations: destinations.slice(0, 5), 
      source: 'fallback_error'
    };
  }
}

// Backup destination data
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
