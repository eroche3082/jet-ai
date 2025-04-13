import OpenAI from 'openai';

// Initialize the OpenAI client
const apiKey = process.env.OPENAI_API_KEY;
let openaiClient: OpenAI | null = null;

try {
  if (apiKey) {
    openaiClient = new OpenAI({ apiKey });
    console.log("OpenAI GPT initialized successfully!");
  } else {
    console.warn("OPENAI_API_KEY not set. OpenAI GPT functionality will be limited.");
  }
} catch (error) {
  console.error("Error initializing OpenAI GPT:", error);
}

/**
 * Generates content using OpenAI's GPT-4o model
 * @param prompt The prompt to send to the model
 * @returns The generated text or null if generation fails
 */
export async function generateContentWithGPT4(prompt: string): Promise<string | null> {
  try {
    if (!openaiClient) {
      console.warn("OpenAI GPT not initialized");
      return null;
    }
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024
    });
    
    return response.choices[0].message.content;
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
      console.warn("OpenAI GPT not initialized");
      return null;
    }
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${prompt}\n\nRespond with valid JSON only, no additional text.` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1024
    });
    
    const content = response.choices[0].message.content;
    
    if (content) {
      try {
        return JSON.parse(content);
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