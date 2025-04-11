import axios from 'axios';

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
    
    // Add optional parameters
    if (params.returnDate) {
      queryParams.append('returnDate', params.returnDate);
    }
    
    if (params.adults) {
      queryParams.append('adults', params.adults.toString());
    }
    
    if (params.children) {
      queryParams.append('children', params.children.toString());
    }
    
    if (params.infants) {
      queryParams.append('infants', params.infants.toString());
    }
    
    if (params.cabinClass) {
      queryParams.append('cabinClass', params.cabinClass);
    }
    
    if (params.direct !== undefined) {
      queryParams.append('direct', params.direct.toString());
    }
    
    const response = await axios.get(`/api/flights/search?${queryParams.toString()}`);
    return response.data.flights || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific flight
 */
export async function getFlightDetails(flightId: string): Promise<FlightResult | null> {
  try {
    const response = await axios.get(`/api/flights/${flightId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flight details:', error);
    throw error;
  }
}

/**
 * Book a flight
 */
export async function bookFlight(flightId: string, passengers: any[]): Promise<any> {
  try {
    const response = await axios.post('/api/flights/book', {
      flightId,
      passengers
    });
    return response.data;
  } catch (error) {
    console.error('Error booking flight:', error);
    throw error;
  }
}