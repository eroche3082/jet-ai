import { initializeApp, cert, App } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

// Initialize Firebase
const firebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`
};

let storageInstance: any = null;
export let firebaseApp: App | null = null;

// Attempt to initialize Firebase with fallback for local development
try {
  // Use local file upload when Firebase credentials are not available
  if (process.env.VITE_FIREBASE_PROJECT_ID) {
    try {
      // Use a proper empty private key for development to avoid ASN.1 parsing errors
      const publicProjectMode = !process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY.length < 10;
      
      if (publicProjectMode) {
        console.log('Firebase in development mode - using local file storage');
      } else {
        firebaseApp = initializeApp({
          credential: cert({
            projectId: process.env.VITE_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || `firebase-adminsdk-xxxx@${process.env.VITE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
          storageBucket: firebaseConfig.storageBucket
        }, 'storage-app');
        
        storageInstance = getStorage(firebaseApp);
        console.log('✅ Firebase configured successfully for media uploads');
      }
    } catch (certError) {
      console.warn('Firebase credential error, using local storage:', certError.message);
    }
  } else {
    console.warn('Missing Firebase project ID. Using local file storage.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

/**
 * Uploads media to Firebase Storage
 * @param file The file to upload
 * @param userId The user ID uploading the file
 * @param folder Optional folder name (default: 'uploads')
 * @returns The public URL of the uploaded file
 */
export async function uploadMediaToFirebase(
  file: Express.Multer.File,
  userId: number,
  folder: string = 'uploads'
): Promise<string> {
  try {
    // Check if Firebase is properly initialized
    if (!storageInstance) {
      // Fallback to local storage if Firebase is not available
      return saveFileLocally(file, userId, folder);
    }
    
    const bucket = storageInstance.bucket();
    
    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${userId}/${Date.now()}-${randomUUID()}.${fileExtension}`;
    
    // Create a file reference
    const fileRef = bucket.file(fileName);
    
    // Upload the file
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    // Make the file publicly accessible
    await fileRef.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Firebase, falling back to local storage:', error);
    // Fallback to local storage
    return saveFileLocally(file, userId, folder);
  }
}

// Helper function to save files locally
function saveFileLocally(
  file: Express.Multer.File,
  userId: number,
  folder: string = 'uploads'
): string {
  try {
    // Ensure uploads directory exists
    const baseUploadsDir = path.join(process.cwd(), 'public/uploads');
    const folderPath = path.join(baseUploadsDir, folder, userId.toString());
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop() || '';
    const fileName = `${Date.now()}-${randomUUID()}${fileExtension ? '.' + fileExtension : ''}`;
    const filePath = path.join(folderPath, fileName);
    
    // Write the file
    fs.writeFileSync(filePath, file.buffer);
    
    // Return the public URL path relative to the domain
    return `/uploads/${folder}/${userId}/${fileName}`;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error('Failed to save media file');
  }
}

/**
 * Delete media from Firebase Storage or local storage
 * @param url The public URL or local path of the file to delete
 * @returns Boolean indicating success
 */
export async function deleteMediaFromFirebase(url: string): Promise<boolean> {
  try {
    // Check if it's a local file path (starting with '/uploads')
    if (url.startsWith('/uploads/')) {
      return deleteFileLocally(url);
    }
    
    // Otherwise, it's a Firebase URL
    if (!storageInstance) {
      console.warn('Firebase Storage not initialized, cannot delete remote file');
      return false;
    }
    
    const bucket = storageInstance.bucket();
    
    // Extract filename from URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const fileName = pathSegments.slice(2).join('/'); // Skip /storage.googleapis.com/bucket-name
    
    // Delete the file
    await bucket.file(fileName).delete();
    
    return true;
  } catch (error) {
    console.error('Error deleting media:', error);
    return false;
  }
}

/**
 * Delete a file from local storage
 * @param localPath The local file path (starting with '/uploads/')
 * @returns Boolean indicating success
 */
function deleteFileLocally(localPath: string): boolean {
  try {
    // Convert relative path to absolute path
    const fullPath = path.join(process.cwd(), 'public', localPath);
    
    // Check if file exists
    if (fs.existsSync(fullPath)) {
      // Delete the file
      fs.unlinkSync(fullPath);
      return true;
    } else {
      console.warn(`File not found for deletion: ${fullPath}`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting local file:', error);
    return false;
  }
}