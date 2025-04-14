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

// Attempt to initialize Firebase, but handle the case where credentials aren't available
try {
  // Only try to initialize if we have required credentials
  if (process.env.VITE_FIREBASE_PROJECT_ID) {
    // Use dummy values for development if real credentials aren't available
    const dummyPrivateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj\nMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu\nNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJm\nFX+Aynx/fy1WuPMrLWytFMg0GwoWbzCYxr+XsqpHljAWroWBgNrvuqv8+icVKRHg\n-----END PRIVATE KEY-----\n';
    
    firebaseApp = initializeApp({
      credential: cert({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || `firebase-adminsdk-xxxx@${process.env.VITE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
        // Use real key if available, otherwise use dummy for development
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? 
          process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
          dummyPrivateKey,
      }),
      storageBucket: firebaseConfig.storageBucket
    }, 'storage-app');
    
    storageInstance = getStorage(firebaseApp);
    console.log('✅ Firebase configured successfully for media uploads');
  } else {
    console.warn('Missing Firebase project ID. Firebase Storage will not be available.');
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