import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize the Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let geminiClient: GoogleGenerativeAI | null = null;
let generativeModel: GenerativeModel | null = null;

try {
  if (apiKey) {
    geminiClient = new GoogleGenerativeAI(apiKey);
    generativeModel = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Google Gemini AI initialized successfully!");
  } else {
    console.warn("GEMINI_API_KEY not set. Gemini AI functionality will be limited.");
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