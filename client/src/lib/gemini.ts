import { apiRequest } from "./queryClient";

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string[];
}

export interface GeminiResponse {
  text: string;
  recommendations?: any[];
}

export async function getGeminiResponse(messages: GeminiMessage[]): Promise<GeminiResponse> {
  try {
    const response = await apiRequest('POST', '/api/gemini', { messages });
    return await response.json();
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw new Error('Failed to get response from Gemini AI assistant');
  }
}

export async function getDestinationInsights(destination: string): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/gemini/insights', { destination });
    return await response.json();
  } catch (error) {
    console.error('Error getting destination insights:', error);
    throw new Error('Failed to get destination insights');
  }
}
