import { GoogleGenerativeAI } from '@google/generative-ai';

export interface SocialPostParams {
  mediaType: 'Story' | 'Carousel' | 'Reel' | 'Regular Post';
  tone: 'Luxury' | 'Adventure' | 'Relaxed' | 'Informative' | 'Vlog';
  keywords: string;
  platform: 'Instagram' | 'TikTok' | 'Facebook' | 'Pinterest' | 'YouTube';
}

export interface SocialPostResult {
  caption: string;
  hashtags: string[];
  postingTip: string;
}

export async function generateSocialPost({ mediaType, tone, keywords, platform }: SocialPostParams): Promise<SocialPostResult> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_VERTEX_KEY_ID || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const prompt = `
    Create a ${mediaType} social media post for ${platform}.
    Tone: ${tone}.
    Keywords: ${keywords}.
    
    Return your response exactly in this JSON format:
    {
      "caption": "The engaging caption text here",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", ...],
      "postingTip": "A specific tip about when or how to post this content"
    }
    
    Make sure the caption is engaging and authentic.
    Include 5-7 relevant hashtags.
    For the posting tip, include platform-specific advice about timing or engagement.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }
    
    const jsonData = JSON.parse(jsonMatch[0]);
    return {
      caption: jsonData.caption || '',
      hashtags: jsonData.hashtags || [],
      postingTip: jsonData.postingTip || ''
    };
  } catch (error) {
    console.error('Error generating social post:', error);
    return {
      caption: 'Experience the journey of a lifetime. The perfect blend of adventure and relaxation awaits.',
      hashtags: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation'],
      postingTip: 'Post during evening hours for maximum engagement.'
    };
  }
}