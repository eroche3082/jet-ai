import { apiRequest } from "./queryClient";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  message: string;
  recommendations?: Recommendation[];
}

export interface Recommendation {
  name: string;
  country?: string;
  image?: string;
  description?: string;
}

export async function getAIResponse(messages: OpenAIMessage[]): Promise<OpenAIResponse> {
  try {
    const response = await apiRequest('POST', '/api/chat', { messages });
    return await response.json();
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

export async function getDestinationRecommendations(preferences: string): Promise<Recommendation[]> {
  try {
    const response = await apiRequest('POST', '/api/recommendations/destinations', { preferences });
    return await response.json();
  } catch (error) {
    console.error('Error getting destination recommendations:', error);
    throw new Error('Failed to get destination recommendations');
  }
}

export async function generateItinerary(destination: string, days: number, preferences: string): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/generate/itinerary', { 
      destination, 
      days, 
      preferences 
    });
    return await response.json();
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary');
  }
}
