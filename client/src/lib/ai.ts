import { apiRequest } from "./queryClient";

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

export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<ChatResponse> {
  try {
    const response = await apiRequest("POST", "/api/chat", {
      message,
      history
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
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
