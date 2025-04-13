import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(firebaseApp);

console.log("✅ Firebase configured successfully for media uploads");

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param userId The ID of the user uploading the file
 * @param folder The folder to store the file in (e.g., 'travel-stories', 'social-posts')
 * @returns A promise resolving to the download URL
 */
export async function uploadMediaToFirebase(
  file: Express.Multer.File,
  userId: number,
  folder: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${userId}_${timestamp}_${originalName}`;
    
    // Create a storage reference
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    });
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw new Error('Failed to upload media to Firebase Storage');
  }
}