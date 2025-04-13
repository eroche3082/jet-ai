import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { storage } from '../storage';
import { generateSocialContent } from '../vertex/generateSocialPost';
import { uploadMediaToFirebase } from '../lib/firebase';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Get all social posts for the current user
router.get('/posts', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const userId = req.user?.id;
    const posts = await storage.getSocialPostsByUserId(userId);
    
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching social posts:', error);
    res.status(500).json({ 
      message: 'Failed to fetch social posts',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Generate AI content for social post
router.post('/generate', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    // Validate request body
    const schema = z.object({
      prompt: z.string().min(1, 'Prompt is required'),
      postType: z.enum(['post', 'story', 'reel']),
      platform: z.enum(['instagram', 'facebook', 'twitter', 'tiktok']),
      tone: z.enum(['casual', 'professional', 'adventurous', 'luxurious']),
      includeHashtags: z.boolean().default(true),
      mediaCount: z.number().int().min(0).default(0)
    });

    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Invalid request data',
        errors: validationResult.error.format()
      });
    }

    const data = validationResult.data;
    
    // Generate content using AI
    const generatedContent = await generateSocialContent(
      data.prompt,
      data.postType,
      data.platform,
      data.tone,
      data.includeHashtags,
      data.mediaCount
    );
    
    res.status(200).json(generatedContent);
  } catch (error) {
    console.error('Error generating social content:', error);
    res.status(500).json({ 
      message: 'Failed to generate content',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Upload media files for social post
router.post('/upload', upload.array('media', 10), async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const userId = req.user?.id;
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Upload files to Firebase Storage
    const uploadPromises = files.map(file => {
      return uploadMediaToFirebase(file, userId, 'social-posts');
    });
    
    const mediaUrls = await Promise.all(uploadPromises);
    
    res.status(200).json({ mediaUrls });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ 
      message: 'Failed to upload media files',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Create/share a social post
router.post('/share', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const userId = req.user?.id;
    
    // Validate request body
    const schema = z.object({
      caption: z.string().min(1, 'Caption is required'),
      hashtags: z.array(z.string()).default([]),
      mediaUrls: z.array(z.string()).default([]),
      platform: z.enum(['instagram', 'facebook', 'twitter', 'tiktok']),
      postType: z.enum(['post', 'story', 'reel']),
      status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
      scheduledFor: z.string().optional()
    });

    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Invalid request data',
        errors: validationResult.error.format()
      });
    }

    const postData = validationResult.data;
    
    // Save post to database
    const newPost = await storage.createSocialPost({
      userId,
      content: postData.caption,
      hashtags: postData.hashtags,
      mediaUrls: postData.mediaUrls,
      platform: postData.platform,
      postType: postData.postType,
      status: postData.status,
      scheduledFor: postData.scheduledFor,
      publishedAt: postData.status === 'published' ? new Date().toISOString() : undefined
    });
    
    res.status(201).json({ post: newPost });
  } catch (error) {
    console.error('Error creating social post:', error);
    res.status(500).json({ 
      message: 'Failed to create post',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Delete a social post
router.delete('/posts/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const userId = req.user?.id;
    const postId = req.params.id;
    
    // Check if post exists and belongs to user
    const post = await storage.getSocialPostById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }
    
    // Delete post
    await storage.deleteSocialPost(postId);
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      message: 'Failed to delete post',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;