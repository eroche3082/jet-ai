import { apiRequest } from "./queryClient";
import { Destination, Experience, Accommodation } from "@shared/schema";

export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  limit?: number;
  page?: number;
}

export async function searchDestinations(params: SearchParams = {}): Promise<Destination[]> {
  try {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    const response = await apiRequest('GET', `/api/destinations?${queryString}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw new Error('Failed to search destinations');
  }
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  try {
    const response = await apiRequest('GET', '/api/destinations/featured');
    return await response.json();
  } catch (error) {
    console.error('Error getting featured destinations:', error);
    throw new Error('Failed to get featured destinations');
  }
}

export async function getDestinationById(id: string | number): Promise<Destination> {
  try {
    const response = await apiRequest('GET', `/api/destinations/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error getting destination ${id}:`, error);
    throw new Error('Failed to get destination details');
  }
}

export async function searchExperiences(params: SearchParams = {}): Promise<Experience[]> {
  try {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    const response = await apiRequest('GET', `/api/experiences?${queryString}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching experiences:', error);
    throw new Error('Failed to search experiences');
  }
}

export async function searchAccommodations(params: SearchParams = {}): Promise<Accommodation[]> {
  try {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    const response = await apiRequest('GET', `/api/accommodations?${queryString}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching accommodations:', error);
    throw new Error('Failed to search accommodations');
  }
}
