import { createContext, useContext, useState, ReactNode } from 'react';
import React from 'react';

// Define types for user profile and auth context
export type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
  travelPreferences?: Record<string, any>;
};

export type AuthContextType = {
  currentUser: any | null;
  user: any | null; // Alias for currentUser to maintain compatibility
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  saveUserPreferences: (preferences: Record<string, any>) => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // For demo purposes, we'll use a simulated login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login with admin/admin123456
      if (email === 'admin' && password === 'admin123456') {
        setCurrentUser({ uid: '123', email });
        setUserProfile({
          id: '123',
          name: 'Demo User',
          email,
          travelPreferences: {
            travelerType: 'adventure',
            interests: ['hiking', 'food', 'culture'],
            budget: 'moderate',
            preferredAccommodation: 'boutique',
            languages: ['English', 'Spanish']
          }
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserPreferences = async (preferences: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          travelPreferences: {
            ...userProfile.travelPreferences,
            ...preferences
          }
        });
      }
    } catch (error) {
      console.error('Save preferences error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    user: currentUser, // Alias for currentUser
    userProfile,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    saveUserPreferences
  };

  return (
    AuthContext.Provider !== undefined 
      ? React.createElement(AuthContext.Provider, { value }, children)
      : null
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};