/**
 * subscriberService.ts
 * Handles interaction with Firebase for subscriber data management
 */

import { auth, firestore, UserProfile } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

// Collection references
const SUBSCRIBERS_COLLECTION = 'subscribers';

/**
 * Saves subscriber data to Firestore
 * @param userId User ID to save data for
 * @param data Subscriber data to save
 */
export async function saveSubscriberData(userId: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, SUBSCRIBERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    // Prepare data with timestamps
    const updatedData = {
      ...data,
      lastActive: Timestamp.now()
    };
    
    // If document doesn't exist, create it with createdAt timestamp
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...updatedData,
        createdAt: Timestamp.now(),
        aiInteractions: 0
      });
    } else {
      // Otherwise, update the existing document
      await updateDoc(userRef, updatedData);
    }
  } catch (error) {
    console.error('Error saving subscriber data:', error);
    throw new Error('Failed to save subscriber data');
  }
}

/**
 * Gets a subscriber's profile from Firestore
 * @param userId User ID to fetch data for
 */
export async function getSubscriberProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, SUBSCRIBERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching subscriber profile:', error);
    throw new Error('Failed to fetch subscriber profile');
  }
}

/**
 * Checks if a user has completed the onboarding process
 * @param userId User ID to check
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  try {
    const profile = await getSubscriberProfile(userId);
    return !!profile?.completedOnboarding;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Completes the onboarding process for a user
 * @param userId User ID to update
 * @param preferences Optional travel preferences to save
 */
export async function completeOnboarding(userId: string, preferences?: UserProfile['travelPreferences']): Promise<void> {
  try {
    const updateData: Partial<UserProfile> = {
      completedOnboarding: true,
      lastActive: Timestamp.now() as any
    };
    
    if (preferences) {
      updateData.travelPreferences = preferences;
    }
    
    await saveSubscriberData(userId, updateData);
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw new Error('Failed to complete onboarding');
  }
}

/**
 * Increments the AI interaction counter for a user
 * @param userId User ID to update
 */
export async function incrementAIInteractions(userId: string): Promise<void> {
  try {
    const userRef = doc(db, SUBSCRIBERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const currentCount = userData.aiInteractions || 0;
      
      await updateDoc(userRef, {
        aiInteractions: currentCount + 1,
        lastActive: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error incrementing AI interactions:', error);
    // Non-critical error, so we don't throw
  }
}

/**
 * Updates a user's membership level
 * @param userId User ID to update
 * @param membershipLevel New membership level (basic, freemium, premium)
 */
export async function updateMembership(userId: string, membershipLevel: 'basic' | 'freemium' | 'premium'): Promise<void> {
  try {
    await saveSubscriberData(userId, {
      membership: membershipLevel
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    throw new Error('Failed to update membership');
  }
}