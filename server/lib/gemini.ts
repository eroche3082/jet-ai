import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Generates content using Google's Gemini model
 * @param prompt The prompt to send to the model
 * @returns The generated text or null if generation fails
 */
export async function generateContent(prompt: string): Promise<string | null> {
  try {
    if (!genAI) {
      console.warn("Gemini API key not configured");
      return null;
    }
    
    // For text-only input, use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return null;
  }
}

/**
 * Generates content with a structured output format
 * @param prompt The prompt to send to the model
 * @returns JSON structured response or null if generation fails
 */
export async function generateStructuredContent(prompt: string): Promise<any | null> {
  try {
    const text = await generateContent(prompt);
    if (!text) return null;
    
    // Try to parse JSON from the response
    try {
      // First, try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // If not in code blocks, try to parse the entire text as JSON
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse structured content:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Error generating structured content with Gemini:", error);
    return null;
  }
}