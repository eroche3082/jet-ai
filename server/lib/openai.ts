import OpenAI from 'openai';

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY;
const openaiClient = apiKey ? new OpenAI({ apiKey }) : null;

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generates content using OpenAI's GPT-4o model
 * @param prompt The prompt to send to the model
 * @returns The generated text or null if generation fails
 */
export async function generateContentWithGPT4(prompt: string): Promise<string | null> {
  try {
    if (!openaiClient) {
      console.warn("OpenAI API key not configured");
      return null;
    }
    
    const completion = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });
    
    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Error generating content with GPT-4o:", error);
    return null;
  }
}

/**
 * Generates structured JSON content using OpenAI's GPT-4o model
 * @param prompt The prompt to send to the model
 * @param systemPrompt Optional system prompt to guide the model's response
 * @returns JSON structured response or null if generation fails
 */
export async function generateStructuredContentWithGPT4(
  prompt: string,
  systemPrompt: string = "You are a helpful assistant. Please respond with valid JSON."
): Promise<any | null> {
  try {
    if (!openaiClient) {
      console.warn("OpenAI API key not configured");
      return null;
    }
    
    const completion = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });
    
    const responseText = completion.choices[0]?.message?.content || null;
    
    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse structured content:", parseError);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating structured content with GPT-4o:", error);
    return null;
  }
}