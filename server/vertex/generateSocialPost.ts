import { generateContent as generateWithGemini } from '../lib/gemini';
import { generateContentWithClaude } from '../lib/claude';
import { generateContentWithGPT4 } from '../lib/openai';

export interface GeneratedSocialContent {
  caption: string;
  hashtags: string[];
  title: string;
  suggestedAudio?: string;
  suggestedTime?: string;
}

/**
 * Generates social media content using AI models with fallback
 */
export async function generateSocialContent(
  prompt: string,
  postType: string, 
  platform: string,
  tone: string,
  includeHashtags: boolean,
  mediaCount: number
): Promise<GeneratedSocialContent> {
  // Enhance the prompt with specific instructions
  const enhancedPrompt = buildPrompt(prompt, postType, platform, tone, includeHashtags, mediaCount);
  
  try {
    // First try with Gemini
    const geminiResult = await generateWithGemini(enhancedPrompt);
    if (geminiResult) {
      return parseGeminiResponse(geminiResult);
    }
    
    // Fall back to Claude
    const claudeResult = await generateContentWithClaude(enhancedPrompt);
    if (claudeResult) {
      return parseClaudeResponse(claudeResult);
    }
    
    // Fall back to GPT-4o
    const gptResult = await generateContentWithGPT4(enhancedPrompt);
    if (gptResult) {
      return parseGPTResponse(gptResult);
    }
    
    // If all AI services fail, return a generic response
    return {
      caption: "Just had an amazing travel experience! The views were breathtaking and the local culture was incredible. #travel #adventure #explore",
      hashtags: ["#travel", "#adventure", "#explore", "#jetai", "#wanderlust"],
      title: "My Travel Adventure",
      suggestedTime: "Best posted between 5-7 PM local time"
    };
  } catch (error) {
    console.error("Error generating social content:", error);
    
    // Provide a generic fallback response
    return {
      caption: "Just had an amazing travel experience! The views were breathtaking and the local culture was incredible. #travel #adventure #explore",
      hashtags: ["#travel", "#adventure", "#explore", "#jetai", "#wanderlust"],
      title: "My Travel Adventure",
      suggestedTime: "Best posted between 5-7 PM local time"
    };
  }
}

/**
 * Builds a detailed prompt for the AI model
 */
function buildPrompt(
  userPrompt: string,
  postType: string,
  platform: string,
  tone: string,
  includeHashtags: boolean,
  mediaCount: number
): string {
  // Base system prompt with structured output format
  const systemPrompt = `
You are JET AI's social media content creator. Generate a ${postType} for ${platform} about a travel experience.
Use a ${tone} tone in the content.
${mediaCount > 0 ? `The post will include ${mediaCount} images.` : 'The post will be text-only.'}
${includeHashtags ? 'Include relevant travel hashtags.' : 'Do not include hashtags.'}

The user's travel details: "${userPrompt}"

Respond with JSON in this exact format:
{
  "caption": "The main caption text for the post",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", ...],
  "title": "A catchy title for the post",
  "suggestedAudio": "A music track suggestion for reels/stories (if applicable)",
  "suggestedTime": "The optimal time to post for engagement"
}

Make the content authentic, engaging, and emotion-filled. Focus on the highlights, feelings, and key experiences.
For ${platform}, consider the optimal caption length, formatting, and engagement strategies.
Keep captions between 70-140 characters for optimal engagement.
`;

  return systemPrompt;
}

/**
 * Parses the response from Gemini
 */
function parseGeminiResponse(response: string): GeneratedSocialContent {
  try {
    // Extract JSON content from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        caption: parsedResponse.caption || "",
        hashtags: Array.isArray(parsedResponse.hashtags) ? parsedResponse.hashtags : [],
        title: parsedResponse.title || "Travel Adventure",
        suggestedAudio: parsedResponse.suggestedAudio,
        suggestedTime: parsedResponse.suggestedTime
      };
    }
    
    throw new Error("Could not parse JSON from Gemini response");
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw error;
  }
}

/**
 * Parses the response from Claude
 */
function parseClaudeResponse(response: string): GeneratedSocialContent {
  try {
    // Extract JSON content from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        caption: parsedResponse.caption || "",
        hashtags: Array.isArray(parsedResponse.hashtags) ? parsedResponse.hashtags : [],
        title: parsedResponse.title || "Travel Adventure",
        suggestedAudio: parsedResponse.suggestedAudio,
        suggestedTime: parsedResponse.suggestedTime
      };
    }
    
    throw new Error("Could not parse JSON from Claude response");
  } catch (error) {
    console.error("Error parsing Claude response:", error);
    throw error;
  }
}

/**
 * Parses the response from GPT
 */
function parseGPTResponse(response: string): GeneratedSocialContent {
  try {
    // For GPT with JSON mode, the response should already be JSON
    const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
    
    return {
      caption: parsedResponse.caption || "",
      hashtags: Array.isArray(parsedResponse.hashtags) ? parsedResponse.hashtags : [],
      title: parsedResponse.title || "Travel Adventure",
      suggestedAudio: parsedResponse.suggestedAudio,
      suggestedTime: parsedResponse.suggestedTime
    };
  } catch (error) {
    console.error("Error parsing GPT response:", error);
    throw error;
  }
}