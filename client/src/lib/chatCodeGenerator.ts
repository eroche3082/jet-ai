// File: client/src/lib/chatCodeGenerator.ts
// Handles the AI-based user categorization and code generation

import { onboardingSteps } from './onboardingFlow';

export interface UserData {
  name: string;
  email: string;
  preferences: Record<string, any>;
  currentStep: number;
}

interface UserCategory {
  level: string;
  description: string;
  travelStyle: string;
  interestScore: Record<string, number>;
}

/**
 * Generate a unique code based on user data
 */
export function generateUserCode(userData: UserData): string {
  // Platform prefix
  const prefix = 'JET';
  
  // Determine user level based on preferences
  const userCategory = categorizeUser(userData);
  
  // Extract first two letters of the level
  const levelCode = userCategory.level.substring(0, 3).toUpperCase();
  
  // Generate a random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  // Combine to create the unique code
  return `${prefix}-${levelCode}-${randomNum}`;
}

/**
 * Categorize the user based on their preferences
 */
function categorizeUser(userData: UserData): UserCategory {
  // Default category
  let category: UserCategory = {
    level: 'Explorer',
    description: 'Curious traveler seeking new experiences',
    travelStyle: 'Balanced',
    interestScore: {}
  };
  
  // Skip categorization if preferences are empty
  if (!userData.preferences || Object.keys(userData.preferences).length === 0) {
    return category;
  }
  
  // Calculate interest scores
  const interestScore: Record<string, number> = {};
  
  // Track frequency for luxury/budget indicators
  let luxuryCount = 0;
  let budgetCount = 0;
  let adventureCount = 0;
  let relaxationCount = 0;
  let culturalCount = 0;
  
  // Process travel experience types
  const travelTypes = userData.preferences.travelExperienceTypes || [];
  if (travelTypes.includes('luxury')) luxuryCount++;
  if (travelTypes.includes('adventure')) adventureCount++;
  if (travelTypes.includes('relaxation')) relaxationCount++;
  if (travelTypes.includes('cultural') || travelTypes.includes('historical')) culturalCount++;
  
  // Process budget preference
  const budget = userData.preferences.budget;
  if (budget === 'luxury' || budget === 'premium') luxuryCount += 2;
  if (budget === 'budget') budgetCount += 2;
  
  // Process accommodation preferences
  const accommodations = userData.preferences.accommodationPreference || [];
  if (accommodations.includes('luxury')) luxuryCount++;
  if (accommodations.includes('hostel') || accommodations.includes('camping')) budgetCount++;
  
  // Calculate overall scores
  interestScore.luxury = luxuryCount;
  interestScore.budget = budgetCount;
  interestScore.adventure = adventureCount;
  interestScore.relaxation = relaxationCount;
  interestScore.cultural = culturalCount;
  
  // Determine the primary travel style
  const travelFrequency = userData.preferences.travelFrequency;
  let frequencyScore = 0;
  
  if (travelFrequency === 'frequently') frequencyScore = 3;
  else if (travelFrequency === 'regularly') frequencyScore = 2;
  else if (travelFrequency === 'occasionally') frequencyScore = 1;
  
  // Determine travel level based on scores
  if (luxuryCount >= 3 && frequencyScore >= 2) {
    category.level = 'VIP';
    category.description = 'Luxury traveler with exclusive preferences';
    category.travelStyle = 'Premium';
  } else if (adventureCount >= 2) {
    category.level = 'Adventurer';
    category.description = 'Thrill-seeking explorer who loves active experiences';
    category.travelStyle = 'Dynamic';
  } else if (culturalCount >= 2) {
    category.level = 'Culturist';
    category.description = 'Culturally curious traveler seeking authentic experiences';
    category.travelStyle = 'Immersive';
  } else if (relaxationCount >= 2) {
    category.level = 'Relaxer';
    category.description = 'Relaxation-focused traveler who enjoys leisure';
    category.travelStyle = 'Tranquil';
  } else if (frequencyScore >= 2) {
    category.level = 'Globetrotter';
    category.description = 'Frequent traveler with diverse experiences';
    category.travelStyle = 'Versatile';
  }
  
  category.interestScore = interestScore;
  return category;
}

/**
 * Generate a URL with encoded user data (for QR code)
 */
export function generateUserURL(code: string): string {
  const baseURL = window.location.origin;
  return `${baseURL}/dashboard?code=${encodeURIComponent(code)}`;
}

/**
 * Process user preferences with AI (will call the backend Vertex AI service)
 */
export async function processWithAI(userData: UserData): Promise<{
  category: string;
  code: string;
  summary: string;
}> {
  try {
    // First try to call the backend AI service
    const response = await fetch('/api/analyze-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      return await response.json();
    }
    
    // Fallback to local categorization if server fails
    console.warn('AI preference analysis failed, using fallback categorization');
    const category = categorizeUser(userData);
    const code = generateUserCode(userData);
    
    return {
      category: category.level,
      code,
      summary: category.description,
    };
  } catch (error) {
    console.error('Error processing preferences with AI:', error);
    
    // Local fallback
    const category = categorizeUser(userData);
    const code = generateUserCode(userData);
    
    return {
      category: category.level,
      code,
      summary: category.description,
    };
  }
}

/**
 * Create QR code data URL for the given code
 * Note: This requires the qrcode library to be installed
 */
export async function generateQRCode(code: string): Promise<string | null> {
  try {
    const QRCode = await import('qrcode');
    const url = generateUserURL(code);
    return await QRCode.toDataURL(url);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}