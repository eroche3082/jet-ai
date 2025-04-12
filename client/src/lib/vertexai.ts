/**
 * Google Vertex AI Integration for JetAI
 * Handles interactions with Google's Gemini models through Vertex AI
 */

import { apiRequest } from './queryClient';
import { ChatMessage } from './firebase';

export interface VertexAIRequestOptions {
  temperature?: number;
  maxOutputTokens?: number;
  topK?: number;
  topP?: number;
  stream?: boolean;
}

export interface VertexAIResponse {
  text: string;
  emotion?: string;
  suggestions?: string[];
  structuredData?: any;
}

// Default system instructions for JetAI Concierge
export const DEFAULT_SYSTEM_INSTRUCTIONS = `You are JetAI, a professional luxury travel assistant with expertise in global destinations, accommodations, flights, and experiences. 

Personality traits:
- Helpful, friendly, and knowledgeable
- Detail-oriented and precise
- Personalized in your approach
- Empathetic to traveler concerns
- Proactive with suggestions
- Patient with any question

Main capabilities:
- Find and recommend flights, hotels, and experiences
- Create personalized travel itineraries
- Provide weather, safety, and cultural information
- Offer budget optimization suggestions
- Help with booking logistics
- Support travelers during their journey

When responding:
- Be warm and conversational
- Provide concise yet comprehensive information
- Tailor suggestions to the user's preferences
- Include specific details like prices, distances, times when available
- Offer both popular options and hidden gems
- Present information in a well-organized, easy-to-read format
- Proactively suggest next steps or follow-up questions

Above all, your goal is to make travel planning enjoyable and to help users create memorable, personalized travel experiences.`;

// Vertex AI chat API wrapper
export async function sendVertexAIChatMessage(
  messages: ChatMessage[],
  options: VertexAIRequestOptions = {}
): Promise<VertexAIResponse> {
  try {
    // Add system message if none exists
    if (!messages.some(msg => msg.role === 'system')) {
      messages = [
        {
          id: 'system-default',
          uid: '',
          role: 'system',
          content: DEFAULT_SYSTEM_INSTRUCTIONS,
          timestamp: null
        },
        ...messages
      ];
    }
    
    const response = await apiRequest('POST', '/api/ai/vertex', {
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      options: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxOutputTokens || 1024,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        stream: options.stream || false
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending chat message to Vertex AI:', error);
    throw error;
  }
}

// Get a simple text completion from Vertex AI
export async function getVertexAITextCompletion(
  prompt: string,
  options: VertexAIRequestOptions = {}
): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/vertex/completion', {
      prompt,
      options: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxOutputTokens || 1024,
        topK: options.topK || 40,
        topP: options.topP || 0.95
      }
    });
    
    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error('Error getting text completion from Vertex AI:', error);
    throw error;
  }
}

// Generate structured data using Vertex AI
export async function generateStructuredData(
  prompt: string,
  schema: object,
  options: VertexAIRequestOptions = {}
): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/ai/vertex/structured', {
      prompt,
      schema,
      options: {
        temperature: options.temperature || 0.2, // Lower temperature for structured data
        maxOutputTokens: options.maxOutputTokens || 2048,
        topK: options.topK || 40,
        topP: options.topP || 0.95
      }
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error generating structured data with Vertex AI:', error);
    throw error;
  }
}

// Extract user preferences from conversation
export async function extractUserPreferences(
  messages: ChatMessage[]
): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/ai/vertex/extract-preferences', {
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error extracting user preferences:', error);
    throw error;
  }
}

// Detect user's emotion from message
export async function detectEmotion(text: string): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/vertex/emotion', {
      text
    });
    
    const result = await response.json();
    return result.emotion;
  } catch (error) {
    console.error('Error detecting emotion:', error);
    return 'neutral';
  }
}

// Get travel recommendations based on user preferences
export async function getTravelRecommendations(preferences: any): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/ai/vertex/recommendations', {
      preferences
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting travel recommendations:', error);
    throw error;
  }
}

// Generate a travel itinerary based on destination and preferences
export async function generateItinerary(destination: string, preferences: any): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/ai/vertex/generate-itinerary', {
      destination,
      preferences
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}