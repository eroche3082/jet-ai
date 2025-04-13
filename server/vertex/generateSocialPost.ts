import { generateStructuredContent } from '../lib/gemini';
import { generateStructuredContentWithClaude } from '../lib/claude';
import { generateStructuredContentWithGPT4 } from '../lib/openai';

// Platform-specific formatting guidelines
const platformGuidelines = {
  instagram: 'Instagram posts perform best with 3-5 sentences, 5-10 relevant hashtags, and compelling first line that hooks viewers.',
  facebook: 'Facebook content should be more detailed, with 3-5 paragraphs and minimal hashtags (1-3 max).',
  twitter: 'Twitter posts must be concise (under 280 characters) with 1-2 relevant hashtags and a clear call to action.',
  tiktok: 'TikTok captions should be extremely short (1-2 lines) with trending hashtags and emojis.'
};

// Post type formatting guidelines
const postTypeGuidelines = {
  post: 'Create a standard feed post with complete sentences and storytelling elements.',
  story: 'Design a brief, casual story update with conversational language and a question to engage viewers.',
  reel: 'Write a catchy, brief caption for a short video with relevant trending hashtags.'
};

// Tone guides
const toneGuidelines = {
  casual: 'Use relaxed, conversational language with some slang and emojis.',
  professional: 'Maintain a polished, informative tone with proper grammar and minimal emojis.',
  adventurous: 'Incorporate exciting, action-oriented language with exclamation points and vivid descriptions.',
  luxurious: 'Adopt sophisticated, premium language emphasizing exclusivity, quality, and refined experiences.'
};

/**
 * Generates AI-powered social media content based on user input
 * @param prompt User's input describing the content they want
 * @param postType Type of post (post, story, reel)
 * @param platform Target social media platform
 * @param tone Content tone
 * @param includeHashtags Whether to include hashtags
 * @param mediaCount Number of media files to suggest
 * @returns Generated social media content
 */
export async function generateSocialContent(
  prompt: string,
  postType: 'post' | 'story' | 'reel',
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok',
  tone: 'casual' | 'professional' | 'adventurous' | 'luxurious',
  includeHashtags: boolean = true,
  mediaCount: number = 0
): Promise<{
  caption: string;
  hashtags: string[];
  mediaPrompts?: string[];
  error?: string;
}> {
  try {
    // Build comprehensive system prompt
    const systemPrompt = `
      You are a professional social media content creator specialized in travel content.
      
      CONTENT REQUEST: "${prompt}"
      
      PLATFORM GUIDELINES: ${platformGuidelines[platform]}
      
      POST TYPE: ${postTypeGuidelines[postType]}
      
      TONE: ${toneGuidelines[tone]}
      
      ${includeHashtags ? 'Include relevant hashtags for this content.' : 'Do not include any hashtags.'}
      ${mediaCount > 0 ? `Suggest ${mediaCount} media prompts for images or videos that would go well with this post.` : ''}
      
      Respond with a JSON object containing:
      - "caption": The main caption text for the ${platform} ${postType}
      - "hashtags": Array of relevant hashtags (without the # symbol)
      ${mediaCount > 0 ? '- "mediaPrompts": Array of suggested visual media prompts' : ''}
      
      All content must be high quality, travel-focused and in English only.
    `;

    // Try to use Google's Gemini first
    let generatedContent = await generateStructuredContent(prompt, systemPrompt);
    
    // If Gemini fails, try Claude
    if (!generatedContent) {
      generatedContent = await generateStructuredContentWithClaude(prompt, systemPrompt);
    }
    
    // If Claude fails, try OpenAI
    if (!generatedContent) {
      generatedContent = await generateStructuredContentWithGPT4(prompt, systemPrompt);
    }
    
    // If all models fail, return error
    if (!generatedContent) {
      return {
        caption: '',
        hashtags: [],
        error: 'Failed to generate content with all available AI models'
      };
    }
    
    // Validate and format response
    const result = {
      caption: generatedContent.caption || '',
      hashtags: Array.isArray(generatedContent.hashtags) ? generatedContent.hashtags : [],
      mediaPrompts: mediaCount > 0 && Array.isArray(generatedContent.mediaPrompts) ? generatedContent.mediaPrompts : undefined
    };
    
    // Ensure hashtags don't contain # symbol
    result.hashtags = result.hashtags.map(tag => tag.replace(/^#/, ''));
    
    return result;
  } catch (error) {
    console.error('Error generating social content:', error);
    return {
      caption: '',
      hashtags: [],
      error: error instanceof Error ? error.message : 'Unknown error generating content'
    };
  }
}