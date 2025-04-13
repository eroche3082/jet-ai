import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const apiKey = process.env.ANTHROPIC_API_KEY;
const anthropicClient = apiKey ? new Anthropic({ apiKey }) : null;

// The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const MODEL = "claude-3-7-sonnet-20250219";

/**
 * Generates content using Anthropic's Claude model
 * @param prompt The prompt to send to the model
 * @returns The generated text or null if generation fails
 */
export async function generateContentWithClaude(prompt: string): Promise<string | null> {
  try {
    if (!anthropicClient) {
      console.warn("Anthropic API key not configured");
      return null;
    }
    
    const message = await anthropicClient.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    
    if (message.content && message.content.length > 0) {
      return message.content[0].text;
    }
    
    return null;
  } catch (error) {
    console.error("Error generating content with Claude:", error);
    return null;
  }
}

/**
 * Generates structured content using Anthropic's Claude model
 * @param prompt The prompt to send to the model
 * @param systemPrompt Optional system prompt to guide Claude's response
 * @returns JSON structured response or null if generation fails
 */
export async function generateStructuredContentWithClaude(
  prompt: string,
  systemPrompt: string = "You are a helpful assistant. Please respond with valid JSON."
): Promise<any | null> {
  try {
    if (!anthropicClient) {
      console.warn("Anthropic API key not configured");
      return null;
    }
    
    const message = await anthropicClient.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });
    
    if (message.content && message.content.length > 0) {
      const responseText = message.content[0].text;
      
      // Try to parse JSON from the response
      try {
        // First, try to extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          return JSON.parse(jsonMatch[1]);
        }
        
        // If not in code blocks, try to parse the entire text as JSON
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse structured content:", parseError);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating structured content with Claude:", error);
    return null;
  }
}