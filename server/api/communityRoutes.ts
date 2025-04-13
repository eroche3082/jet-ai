import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Firebase imports
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { firebaseApp } from '../lib/firebase';

const router = Router();
const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Configure multer for temporary file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, '../../temp_uploads');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      const uniqueFileName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueFileName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and MP4 files are allowed.') as any);
    }
  }
});

// Get community posts with pagination
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    
    const postsQuery = query(
      collection(firestore, 'communityPosts'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      posts,
      page,
      pageSize,
      hasMore: posts.length === pageSize
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

// Get posts by tag
router.get('/posts/tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    
    const postsQuery = query(
      collection(firestore, 'communityPosts'),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      posts,
      page,
      pageSize,
      hasMore: posts.length === pageSize
    });
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    res.status(500).json({ error: 'Failed to fetch posts by tag' });
  }
});

// Create a new community post with image/video upload
router.post('/posts', upload.array('media', 5), async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in to create a post' });
    }
    
    const { content, location, locationCoordinates, tags } = req.body;
    const files = req.files as Express.Multer.File[];
    const mediaUrls = [];
    
    // Upload files to Firebase Storage
    if (files && files.length > 0) {
      for (const file of files) {
        const fileBuffer = fs.readFileSync(file.path);
        const fileExtension = path.extname(file.originalname);
        const fileName = `community/${Date.now()}-${uuidv4()}${fileExtension}`;
        const storageRef = ref(storage, fileName);
        
        await uploadBytes(storageRef, fileBuffer);
        const downloadUrl = await getDownloadURL(storageRef);
        mediaUrls.push({
          url: downloadUrl,
          type: file.mimetype.startsWith('image/') ? 'image' : 'video'
        });
        
        // Remove temp file
        fs.unlinkSync(file.path);
      }
    }
    
    // Generate a unique journey code for this post
    const journeyCode = `JET-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}`;
    
    // Create post document in Firestore
    const postData = {
      author: {
        id: req.user.id,
        name: req.user.username,
        location: req.user.preferences?.location || 'Unknown',
        avatar: req.user.preferences?.avatar || '/avatars/default.jpg'
      },
      content,
      media: mediaUrls,
      location: {
        name: location,
        coordinates: locationCoordinates ? JSON.parse(locationCoordinates) : null
      },
      tags: tags ? JSON.parse(tags) : [],
      likes: 0,
      comments: 0,
      journeyCode,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(firestore, 'communityPosts'), postData);
    
    res.status(201).json({
      id: docRef.id,
      ...postData,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ error: 'Failed to create community post' });
  }
});

// Get user's posts
router.get('/posts/user', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in to view your posts' });
    }
    
    const postsQuery = query(
      collection(firestore, 'communityPosts'),
      where('author.id', '==', req.user.id),
      orderBy('createdAt', 'desc')
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Like/unlike a post
router.post('/posts/:id/like', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in to like a post' });
    }
    
    const { id } = req.params;
    
    // This is simplified for now - in a real app, we'd use transactions to update the like count
    // and maintain a separate collection of user likes
    
    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

export default router;