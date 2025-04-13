import { Router } from 'express';
import { generateSocialContent } from '../vertex/generateSocialPost';

const router = Router();

// Generate a social media post using Vertex AI
router.post('/generate-social-post', async (req, res) => {
  try {
    const { mediaType, tone, keywords, platform } = req.body;
    
    if (!mediaType || !tone || !keywords || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const prompt = `Create a social media post for ${platform} about ${keywords.join(', ')} using a ${tone} tone.`;
    const includeHashtags = true;
    const mediaCount = mediaType === 'image' ? 1 : 0;
    
    const result = await generateSocialContent(
      prompt,
      mediaType,
      platform,
      tone,
      includeHashtags,
      mediaCount
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error generating social post:', error);
    res.status(500).json({ error: 'Failed to generate social post content' });
  }
});

// Store social post in database
router.post('/save-social-post', async (req, res) => {
  try {
    const { userId, mediaUrl, caption, hashtags, platform, type, tone, scheduledFor } = req.body;
    
    // In a real implementation, this would save to Firestore
    // For now we'll just return a success message
    
    res.json({ 
      success: true, 
      postId: `post_${Date.now()}`,
      message: 'Social post saved successfully' 
    });
  } catch (error) {
    console.error('Error saving social post:', error);
    res.status(500).json({ error: 'Failed to save social post' });
  }
});

export default router;