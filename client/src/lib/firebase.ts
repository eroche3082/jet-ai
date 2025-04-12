// Firebase configuration for JetAI
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration with Firebase API Key from Group 3
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0",
  authDomain: "erudite-creek-431302-q3.firebaseapp.com",
  projectId: "erudite-creek-431302-q3",
  storageBucket: "erudite-creek-431302-q3.firebasestorage.app",
  messagingSenderId: "744217150021",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:744217150021:web:c3310bd6d4e10f237c192c",
  measurementId: "G-J42ZMB67JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, analytics, storage, googleProvider };
export default app;