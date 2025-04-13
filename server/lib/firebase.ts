import { initializeApp, cert, App } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';

// Initialize Firebase
const firebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`
};

let storageInstance: any = null;
export let firebaseApp: App | null = null;

try {
  firebaseApp = initializeApp({
    credential: cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || `firebase-adminsdk-xxxx@${process.env.VITE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
    storageBucket: firebaseConfig.storageBucket
  }, 'storage-app');
  
  storageInstance = getStorage(firebaseApp);
  console.log('✅ Firebase configured successfully for media uploads');
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
    if (!storageInstance) {
      throw new Error('Firebase Storage not initialized');
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
    console.error('Error uploading to Firebase:', error);
    throw new Error('Failed to upload media');
  }
}

/**
 * Delete media from Firebase Storage
 * @param url The public URL of the file to delete
 * @returns Boolean indicating success
 */
export async function deleteMediaFromFirebase(url: string): Promise<boolean> {
  try {
    if (!storageInstance) {
      throw new Error('Firebase Storage not initialized');
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
    console.error('Error deleting from Firebase:', error);
    return false;
  }
}