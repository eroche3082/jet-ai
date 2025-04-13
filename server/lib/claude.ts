import Anthropic from '@anthropic-ai/sdk';

// Initialize the Claude client
const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropicClient: Anthropic | null = null;

try {
  if (apiKey) {
    anthropicClient = new Anthropic({
      apiKey
    });
    console.log("Anthropic Claude AI initialized successfully!");
  } else {
    console.warn("ANTHROPIC_API_KEY not set. Claude AI functionality will be limited.");
  }
} catch (error) {
  console.error("Error initializing Claude AI:", error);
}

/**
 * Generates content using Anthropic's Claude model
 * @param prompt The prompt to send to the model
 * @returns The generated text or null if generation fails
 */
export async function generateContentWithClaude(prompt: string): Promise<string | null> {
  try {
    if (!anthropicClient) {
      console.warn("Claude AI not initialized");
      return null;
    }
    
    const message = await anthropicClient.messages.create({
      model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });
    
    return message.content[0].text;
  } catch (error) {
    console.error("Error generating content with Claude:", error);
    return null;
  }
}

/**
 * Generates structured JSON content using Anthropic's Claude model
 * @param prompt The prompt to send to the model
 * @param systemPrompt Optional system prompt to guide the model's response
 * @returns JSON structured response or null if generation fails
 */
export async function generateStructuredContentWithClaude(
  prompt: string,
  systemPrompt: string = "You are a helpful assistant. Please respond with valid JSON."
): Promise<any | null> {
  try {
    if (!anthropicClient) {
      console.warn("Claude AI not initialized");
      return null;
    }
    
    const message = await anthropicClient.messages.create({
      model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: `${prompt}\n\nRespond with valid JSON only, no additional text.` }]
    });
    
    const responseText = message.content[0].text;
    
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
    console.error("Error generating structured content with Claude:", error);
    return null;
  }
}