import { apiRequest } from "./queryClient";
import { useQuery } from "@tanstack/react-query";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  destinations?: Destination[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export interface Itinerary {
  id: string;
  destination: string;
  days: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  location?: string;
}

export interface AssistantPersonality {
  id: string;
  name: string;
  description: string;
  voiceStyle: string;
  exampleResponse: string;
}

export async function sendChatMessage(
  message: string, 
  history: ChatMessage[],
  personality: string = 'concierge'
): Promise<ChatResponse> {
  try {
    const response = await apiRequest("POST", "/api/chat", {
      message,
      history,
      personality
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

export function useAssistantPersonalities() {
  return useQuery({
    queryKey: ['/api/chat/personalities'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/chat/personalities');
      const data = await response.json();
      return data.personalities as AssistantPersonality[];
    }
  });
}

export async function getDestinationRecommendations(
  preferences: {
    climate?: string;
    activity?: string;
    budget?: string;
    duration?: string;
  }
): Promise<Destination[]> {
  try {
    const response = await apiRequest("POST", "/api/destinations/recommend", preferences);
    return await response.json();
  } catch (error) {
    console.error("Error getting destination recommendations:", error);
    throw error;
  }
}

export async function generateItinerary(
  destination: string,
  days: number,
  preferences: {
    activities?: string[];
    pace?: "relaxed" | "balanced" | "intense";
    interests?: string[];
  }
): Promise<Itinerary> {
  try {
    const response = await apiRequest("POST", "/api/itinerary/generate", {
      destination,
      days,
      preferences
    });
    return await response.json();
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}
