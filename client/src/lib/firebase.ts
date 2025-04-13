// Firebase configuration for JetAI
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from "firebase/firestore";

// Firebase configuration with environment variables
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "jetai-travel-companion";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0",
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: "744217150021",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:744217150021:web:803371f49c503bb17c192c",
  measurementId: "G-J42ZMB67JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: any;
  lastActive: any;
  // Travel-specific preferences
  travelPreferences?: {
    upcomingDestinations?: string[];
    travelerType?: string;
    interests?: string[];
    budget?: string;
    preferredAccommodation?: string;
    dietaryRestrictions?: string[];
    languages?: string[];
  };
  // User metadata
  membership?: 'basic' | 'freemium' | 'premium';
  completedOnboarding?: boolean;
  language?: string;
  aiInteractions?: number;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  uid: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: any;
  emotion?: string;
}

// Firebase user profile functions
export async function createUserProfile(user: User, additionalData: Partial<UserProfile> = {}): Promise<void> {
  if (!user.uid) return;

  const userRef = doc(firestore, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email } = user;
    
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        name: additionalData.name || '',
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        membership: 'basic',
        completedOnboarding: false,
        aiInteractions: 0,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile', error);
    }
  } else {
    // Update last active timestamp
    await updateDoc(userRef, {
      lastActive: serverTimestamp()
    });
  }
}

// Get user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;

  try {
    const userRef = doc(firestore, 'users', uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (!uid) return;

  try {
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile', error);
  }
}

// Save chat message
export async function saveChatMessage(message: Omit<ChatMessage, 'id'>): Promise<string> {
  try {
    const chatRef = collection(firestore, 'chatMessages');
    const newMessageRef = doc(chatRef);
    
    await setDoc(newMessageRef, {
      ...message,
      id: newMessageRef.id,
      timestamp: serverTimestamp()
    });
    
    return newMessageRef.id;
  } catch (error) {
    console.error('Error saving chat message', error);
    return '';
  }
}

// Get user chat history
export async function getUserChatHistory(uid: string, limit_count = 50): Promise<ChatMessage[]> {
  try {
    const chatRef = collection(firestore, 'chatMessages');
    const q = query(
      chatRef,
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(limit_count)
    );
    
    const snapshot = await getDocs(q);
    const messages: ChatMessage[] = [];
    
    snapshot.forEach((doc) => {
      messages.push(doc.data() as ChatMessage);
    });
    
    return messages.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return a.timestamp.seconds - b.timestamp.seconds;
    });
  } catch (error) {
    console.error('Error getting chat history', error);
    return [];
  }
}

// Check if user has completed onboarding
export async function hasCompletedOnboarding(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.completedOnboarding || false;
}

// Direct authentication functions
export async function registerWithEmail(email: string, password: string): Promise<User | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user', error);
    return null;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<User | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out', error);
  }
}

export { app, auth, analytics, storage, firestore, googleProvider, onAuthStateChanged };
export default app;