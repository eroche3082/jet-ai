// Access Code System for JET AI
// Handles code generation, validation, and management

import { firestore } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { UserProfile } from './firebase';

// Code types and formats
export enum CodeType {
  TRAVEL = 'TRAVEL',
  FIT = 'FIT',
  SHOP = 'SHOP',
  FINANCE = 'FINANCE'
}

export enum UserCategory {
  BEGINNER = 'BEG',
  INTERMEDIATE = 'INT',
  ADVANCED = 'ADV',
  LUXURY = 'LUX',
  ECONOMY = 'ECO',
  ADVENTURE = 'ADV',
  VIP = 'VIP',
  STANDARD = 'STD'
}

// CountryCode is a two-letter country code (e.g., ES for Spain)
type CountryCode = string;

export interface AccessCode {
  code: string;
  type: CodeType;
  category: UserCategory;
  countryCode?: CountryCode;
  sequenceNumber: number;
  createdAt: Date;
  userId: string;
  unlockedLevels: string[];
  paymentStatus: 'free' | 'paid';
  stripePaymentId?: string;
  referredBy?: string;
}

/**
 * Generates a unique access code for a user
 */
export function generateAccessCode(
  type: CodeType,
  category: UserCategory,
  countryCode?: CountryCode
): string {
  // Generate a random 4-digit number for uniqueness
  const sequenceNumber = Math.floor(1000 + Math.random() * 9000);
  
  // Format: TYPE-CATEGORY-CC-XXXX (e.g., TRAVEL-LUX-ES-1099)
  // If countryCode is provided, include it, otherwise just TYPE-CATEGORY-XXXX
  return countryCode 
    ? `${type}-${category}-${countryCode}-${sequenceNumber}`
    : `${type}-${category}-${sequenceNumber}`;
}

/**
 * Saves a new access code to Firestore
 */
export async function saveAccessCode(
  userId: string,
  code: string,
  type: CodeType,
  category: UserCategory,
  countryCode?: CountryCode,
  referredBy?: string
): Promise<boolean> {
  try {
    const sequenceNumber = parseInt(code.split('-').pop() || '0000');
    const codeRef = doc(firestore, 'accessCodes', code);
    
    await setDoc(codeRef, {
      code,
      type,
      category,
      countryCode,
      sequenceNumber,
      createdAt: new Date(),
      userId,
      unlockedLevels: ['Level 1', 'Level 2', 'Level 3'],
      paymentStatus: 'free',
      referredBy
    });
    
    // Also update the user profile with the code
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      accessCode: code,
      completedOnboarding: true
    });
    
    return true;
  } catch (error) {
    console.error('Error saving access code:', error);
    return false;
  }
}

/**
 * Validates if an access code exists and is valid
 */
export async function validateAccessCode(code: string): Promise<AccessCode | null> {
  try {
    const codeRef = doc(firestore, 'accessCodes', code);
    const codeSnap = await getDoc(codeRef);
    
    if (codeSnap.exists()) {
      return codeSnap.data() as AccessCode;
    }
    
    return null;
  } catch (error) {
    console.error('Error validating access code:', error);
    return null;
  }
}

/**
 * Get user profile by access code
 */
export async function getUserByAccessCode(code: string): Promise<UserProfile | null> {
  try {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('accessCode', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by access code:', error);
    return null;
  }
}

/**
 * Updates the unlocked levels for a specific code
 */
export async function unlockLevel(code: string, level: string, paymentId?: string): Promise<boolean> {
  try {
    const codeRef = doc(firestore, 'accessCodes', code);
    const codeSnap = await getDoc(codeRef);
    
    if (!codeSnap.exists()) {
      return false;
    }
    
    const accessCode = codeSnap.data() as AccessCode;
    const newUnlockedLevels = [...accessCode.unlockedLevels];
    
    if (!newUnlockedLevels.includes(level)) {
      newUnlockedLevels.push(level);
    }
    
    const updateData: Partial<AccessCode> = {
      unlockedLevels: newUnlockedLevels,
    };
    
    // If payment ID is provided, this was a paid unlock
    if (paymentId) {
      updateData.paymentStatus = 'paid';
      updateData.stripePaymentId = paymentId;
    }
    
    await updateDoc(codeRef, updateData);
    return true;
  } catch (error) {
    console.error('Error unlocking level:', error);
    return false;
  }
}

/**
 * Add an activity record for tracking
 */
export async function addCodeActivity(
  code: string,
  activity: 'login' | 'payment' | 'referral' | 'unlock'
): Promise<void> {
  try {
    const activityRef = doc(collection(firestore, 'code_activities'));
    await setDoc(activityRef, {
      code,
      activity,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error adding code activity:', error);
  }
}