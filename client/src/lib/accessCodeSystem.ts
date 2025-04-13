// Access Code System for JET AI

/**
 * Enum for different types of access codes
 */
export enum CodeType {
  TRAVEL = 'TRAVEL',
  BUSINESS = 'BUSINESS',
  PROMOTIONAL = 'PROMO',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN'
}

/**
 * Enum for different user categories
 */
export enum UserCategory {
  STANDARD = 'STD',
  PREMIUM = 'PRE',
  LUXURY = 'LUX',
  BUSINESS = 'BIZ',
  ENTERPRISE = 'ENT'
}

/**
 * Interface for access code data
 */
export interface AccessCodeData {
  code: string;
  userId: string;
  type: CodeType;
  category: UserCategory;
  countryCode: string;
  unlockedLevels: string[];
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

/**
 * Generates a unique access code based on type, category, and country
 * Format: TYPE-CATEGORY-COUNTRY-RANDOM
 * Example: TRAVEL-LUX-ES-1099
 */
export function generateAccessCode(
  type: CodeType = CodeType.TRAVEL,
  category: UserCategory = UserCategory.STANDARD,
  countryCode: string = 'US'
): string {
  // Ensure country code is uppercase and limited to 2 chars
  const formattedCountryCode = countryCode.toUpperCase().substring(0, 2);
  
  // Generate random 4-digit number
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  
  // Format the code
  return `${type}-${category}-${formattedCountryCode}-${randomDigits}`;
}

/**
 * Saves an access code to the database
 * In a real implementation, this would call an API endpoint
 */
export async function saveAccessCode(
  userId: string,
  code: string,
  type: CodeType,
  category: UserCategory,
  countryCode: string,
  unlockedLevels: string[] = ['Level 1'],
  expiresAt?: Date
): Promise<boolean> {
  try {
    // This would be an API call in a real implementation
    // For now, we'll simulate success
    console.log('Saving access code:', {
      code,
      userId,
      type,
      category,
      countryCode,
      unlockedLevels,
      createdAt: new Date(),
      expiresAt,
      isActive: true
    });
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, we store in localStorage
    const codes = JSON.parse(localStorage.getItem('accessCodes') || '[]');
    codes.push({
      code,
      userId,
      type,
      category,
      countryCode,
      unlockedLevels,
      createdAt: new Date(),
      expiresAt,
      isActive: true
    });
    localStorage.setItem('accessCodes', JSON.stringify(codes));
    
    return true;
  } catch (error) {
    console.error('Error saving access code:', error);
    return false;
  }
}

/**
 * Validates an access code and returns its data if valid
 * In a real implementation, this would call an API endpoint
 */
export async function validateAccessCode(code: string): Promise<AccessCodeData | null> {
  try {
    // This would be an API call in a real implementation
    // For now, we'll simulate validation
    console.log('Validating access code:', code);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check code format with regex
    const codePattern = /^([A-Z]+)-([A-Z]+)-([A-Z]{2})-(\d{4})$/;
    const match = code.match(codePattern);
    
    if (!match) {
      console.log('Invalid code format');
      return null;
    }
    
    // For demo purposes, we check localStorage
    const codes = JSON.parse(localStorage.getItem('accessCodes') || '[]');
    const foundCode = codes.find((c: any) => c.code === code && c.isActive);
    
    // If we have a stored code, return it
    if (foundCode) {
      return foundCode;
    }
    
    // Otherwise, for demo, we can consider the format-valid code as valid
    // with basic unlocked levels
    if (match) {
      return {
        code,
        userId: 'demo-user',
        type: match[1] as CodeType,
        category: match[2] as UserCategory,
        countryCode: match[3],
        unlockedLevels: ['Level 1', 'Level 2', 'Level 3'],
        createdAt: new Date(),
        isActive: true
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error validating access code:', error);
    return null;
  }
}

/**
 * Unlocks a specific level for an access code
 * In a real implementation, this would call an API endpoint
 */
export async function unlockLevel(accessCode: string, level: string): Promise<boolean> {
  try {
    // This would be an API call in a real implementation
    console.log(`Unlocking ${level} for code ${accessCode}`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, update in localStorage
    const codes = JSON.parse(localStorage.getItem('accessCodes') || '[]');
    const codeIndex = codes.findIndex((c: any) => c.code === accessCode);
    
    if (codeIndex >= 0) {
      // Add the level if not already unlocked
      if (!codes[codeIndex].unlockedLevels.includes(level)) {
        codes[codeIndex].unlockedLevels.push(level);
      }
      localStorage.setItem('accessCodes', JSON.stringify(codes));
      return true;
    }
    
    // If code not found in localStorage, create a new entry
    const newCode: AccessCodeData = {
      code: accessCode,
      userId: 'demo-user',
      type: CodeType.TRAVEL,
      category: UserCategory.STANDARD,
      countryCode: 'US',
      unlockedLevels: ['Level 1', level],
      createdAt: new Date(),
      isActive: true
    };
    
    codes.push(newCode);
    localStorage.setItem('accessCodes', JSON.stringify(codes));
    
    return true;
  } catch (error) {
    console.error('Error unlocking level:', error);
    return false;
  }
}

/**
 * Gets all unlocked levels for an access code
 * In a real implementation, this would call an API endpoint
 */
export async function getUnlockedLevels(accessCode: string): Promise<string[]> {
  try {
    const validatedCode = await validateAccessCode(accessCode);
    
    if (validatedCode) {
      return validatedCode.unlockedLevels;
    }
    
    return ['Level 1']; // Default level
  } catch (error) {
    console.error('Error getting unlocked levels:', error);
    return ['Level 1']; // Default level on error
  }
}

/**
 * Checks if a specific level is unlocked for an access code
 */
export async function isLevelUnlocked(accessCode: string, level: string): Promise<boolean> {
  const unlockedLevels = await getUnlockedLevels(accessCode);
  return unlockedLevels.includes(level);
}

/**
 * Generates a referral code based on an existing access code
 */
export function generateReferralCode(accessCode: string): string {
  // Extract parts of the access code
  const parts = accessCode.split('-');
  
  if (parts.length !== 4) {
    // If invalid format, generate a new one
    return generateAccessCode(CodeType.PROMOTIONAL, UserCategory.STANDARD);
  }
  
  // Change type to PROMO and generate new random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `PROMO-${parts[1]}-${parts[2]}-${randomDigits}`;
}