import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { API_KEYS } from './googleApiConfig';

// Initialize the Gemini client with verified working API key
const apiKey = process.env.GEMINI_API_KEY || API_KEYS.GEMINI_API_KEY;
let geminiClient: GoogleGenerativeAI | null = null;
let generativeModel: GenerativeModel | null = null;

try {
  // We prioritize the key from the environment variable first
  if (apiKey) {
    geminiClient = new GoogleGenerativeAI(apiKey);
    generativeModel = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Google Gemini AI initialized successfully!");
  } else {
    console.warn("GEMINI_API_KEY not set. Using fallback API key for Gemini AI.");
    // Fallback to the verified working GROUP2 key
    geminiClient = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
    generativeModel = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Google Gemini AI initialized with fallback API key successfully!");
  }
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
}

/**
 * Generates content using Google's Gemini model
 * @param prompt The prompt to send to the model
 * @returns The generated text or null if generation fails
 */
export async function generateContent(prompt: string): Promise<string | null> {
  try {
    if (!geminiClient || !generativeModel) {
      console.warn("Gemini AI not initialized");
      return null;
    }
    
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return null;
  }
}

/**
 * Generates structured content using Google's Gemini model
 * @param prompt The prompt to send to the model
 * @returns JSON structured response or null if generation fails
 */
export async function generateStructuredContent(
  prompt: string,
  systemPrompt: string = "You are a helpful assistant. Please respond with valid JSON."
): Promise<any | null> {
  try {
    if (!geminiClient || !generativeModel) {
      console.warn("Gemini AI not initialized");
      return null;
    }
    
    const enhancedPrompt = `${systemPrompt}\n\n${prompt}\n\nRespond with valid JSON only, no additional text.`;
    const result = await generativeModel.generateContent(enhancedPrompt);
    const responseText = result.response.text();
    
    if (responseText) {
      try {
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse structured content:", parseError);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating structured content with Gemini:", error);
    return null;
  }
}