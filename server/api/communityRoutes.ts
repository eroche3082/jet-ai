import express from 'express';
import { randomUUID } from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage } from '../storage';

const router = express.Router();

// Configure Firebase storage
import { firebaseApp } from '../lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const firebaseStorage = getStorage(firebaseApp);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos only
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  },
});

// Utility function to ensure public uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Authentication middleware
const ensureAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Get all community posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await storage.getCommunityPosts();
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ message: 'Error fetching community posts' });
  }
});

// Get a single post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await storage.getCommunityPostById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ post });
  } catch (error) {
    console.error('Error fetching community post:', error);
    res.status(500).json({ message: 'Error fetching community post' });
  }
});

// Create a new post (with media upload)
router.post('/posts', ensureAuthenticated, upload.array('media', 5), async (req, res) => {
  try {
    const { content, location, locationCoordinates, tags } = req.body;
    const files = req.files as Express.Multer.File[];
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const user = req.user;
    
    // Generate a unique journey code for this post
    const journeyCode = `JT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Upload files to Firebase Storage
    const mediaUrls = [];
    
    try {
      // Upload to Firebase if available
      for (const file of files) {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${randomUUID()}${fileExtension}`;
        const storageRef = ref(firebaseStorage, `community/${fileName}`);
        
        await uploadBytes(storageRef, file.buffer);
        const downloadUrl = await getDownloadURL(storageRef);
        mediaUrls.push(downloadUrl);
      }
    } catch (uploadError) {
      console.error('Firebase upload error:', uploadError);
      
      // Fallback to local storage
      const uploadsDir = ensureUploadsDir();
      
      for (const file of files) {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${randomUUID()}${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);
        
        fs.writeFileSync(filePath, file.buffer);
        const fileUrl = `/uploads/${fileName}`;
        mediaUrls.push(fileUrl);
      }
    }
    
    // Parse the tags and location coordinates from JSON strings
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedCoordinates = locationCoordinates ? JSON.parse(locationCoordinates) : { lat: 0, lng: 0 };

    // Create the post in our storage
    const post = await storage.createCommunityPost({
      authorId: user.id,
      content,
      images: mediaUrls,
      location: {
        name: location || 'Unknown Location',
        coordinates: parsedCoordinates
      },
      tags: parsedTags,
      journeyCode,
      createdAt: new Date(),
    });
    
    res.status(201).json({
      message: 'Post created successfully',
      postId: post.id,
      journeyCode,
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ message: 'Error creating community post' });
  }
});

// Like a post
router.post('/posts/:id/like', ensureAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user;
    
    const result = await storage.likeCommunityPost(postId, user.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ 
      message: result.action === 'added' ? 'Post liked' : 'Post unliked',
      likeCount: result.likeCount 
    });
  } catch (error) {
    console.error('Error liking community post:', error);
    res.status(500).json({ message: 'Error liking community post' });
  }
});

// Add a comment to a post
router.post('/posts/:id/comments', ensureAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const user = req.user;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const comment = await storage.addCommunityPostComment({
      postId,
      authorId: user.id,
      content,
      createdAt: new Date(),
    });
    
    res.status(201).json({ 
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Get comments for a post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await storage.getCommunityPostComments(postId);
    
    res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Get posts by journey code
router.get('/journey/:code', async (req, res) => {
  try {
    const journeyCode = req.params.code;
    const posts = await storage.getCommunityPostsByJourneyCode(journeyCode);
    
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching journey posts:', error);
    res.status(500).json({ message: 'Error fetching journey posts' });
  }
});

export default router;