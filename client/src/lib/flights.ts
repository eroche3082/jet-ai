import { apiRequest } from "./queryClient";

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  direct?: boolean;
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  stops: number;
  price: number;
  currency: string;
  deep_link: string;
  returnFlightId?: string;
  cabinClass: string;
  availableSeats?: number;
  logoUrl: string;
}

/**
 * Search for flights based on origin, destination and dates
 */
export async function searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
  try {
    const queryParams = new URLSearchParams();
    
    // Add required parameters
    queryParams.append('origin', params.origin);
    queryParams.append('destination', params.destination);
    queryParams.append('departureDate', params.departureDate);
    
    // Add optional parameters if provided
    if (params.returnDate) queryParams.append('returnDate', params.returnDate);
    if (params.adults) queryParams.append('adults', params.adults.toString());
    if (params.children) queryParams.append('children', params.children.toString());
    if (params.infants) queryParams.append('infants', params.infants.toString());
    if (params.cabinClass) queryParams.append('cabinClass', params.cabinClass);
    if (params.direct !== undefined) queryParams.append('direct', params.direct.toString());
    
    const response = await apiRequest('GET', `/api/flights/search?${queryParams.toString()}`);
    const data = await response.json();
    return data.flights;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw new Error('Failed to search for flights. Please try again later.');
  }
}

/**
 * Get detailed information about a specific flight
 */
export async function getFlightDetails(flightId: string): Promise<FlightResult | null> {
  try {
    const response = await apiRequest('GET', `/api/flights/${flightId}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting flight details:', error);
    throw new Error('Failed to get flight details. Please try again later.');
  }
}

/**
 * Create a flight booking
 */
export async function bookFlight(flightId: string, passengers: any[]): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/flights/book', {
      flightId,
      passengers
    });
    return await response.json();
  } catch (error) {
    console.error('Error booking flight:', error);
    throw new Error('Failed to book flight. Please try again later.');
  }
}