// AI Processing Service for onboarding preference analysis
import { Request, Response } from 'express';

// Categories for user classification
const TRAVELER_CATEGORIES = [
  { level: 'VIP', description: 'Luxury traveler with a taste for premium experiences and exclusive destinations.' },
  { level: 'Explorer', description: 'Curious traveler seeking authentic cultural experiences and hidden gems.' },
  { level: 'Adventurer', description: 'Thrill-seeking explorer who craves active, outdoorsy experiences.' },
  { level: 'Culturist', description: 'Culture-focused traveler with a passion for history, arts, and local traditions.' },
  { level: 'Relaxer', description: 'Leisure-oriented traveler who prioritizes comfort and relaxation.' },
  { level: 'Globetrotter', description: 'Experienced world traveler with diverse interests and preferences.' },
  { level: 'Families', description: 'Family-oriented traveler who values kid-friendly activities and accommodations.' },
  { level: 'Digital Nomad', description: 'Remote worker combining travel with professional responsibilities.' },
  { level: 'Budget Master', description: 'Value-focused traveler who excels at maximizing experiences on minimal spending.' },
  { level: 'Gourmand', description: 'Food-centric traveler exploring the world through its culinary treasures.' }
];

/**
 * Generate a unique code based on user data
 */
export function generateUserCode(userData: any): string {
  // Platform prefix
  const prefix = 'JET';
  
  // Determine user level based on preferences
  const userCategory = categorizeUser(userData);
  
  // Extract first three letters of the level
  const levelCode = userCategory.level.substring(0, 3).toUpperCase();
  
  // Generate a random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  // Combine to create the unique code
  return `${prefix}-${levelCode}-${randomNum}`;
}

/**
 * Categorize the user based on their preferences
 */
function categorizeUser(userData: any): { level: string; description: string } {
  // Skip categorization if preferences are empty
  if (!userData.preferences || Object.keys(userData.preferences).length === 0) {
    return TRAVELER_CATEGORIES[1]; // Default to Explorer
  }
  
  // Calculate a deterministic index based on user data to ensure consistency
  const nameHash = userData.name.length;
  const emailHash = userData.email.split('@')[0].length;
  const prefCount = Object.keys(userData.preferences).length;
  
  // Use a deterministic formula to pick a category
  const index = (nameHash + emailHash + prefCount) % TRAVELER_CATEGORIES.length;
  
  return TRAVELER_CATEGORIES[index];
}

/**
 * Analyze user preferences and generate a traveler category and code
 */
export const analyzePreferences = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    if (!userData || !userData.name || !userData.email) {
      return res.status(400).json({
        error: 'Invalid user data provided'
      });
    }
    
    // For now, use rule-based categorization as a fallback
    const category = categorizeUser(userData);
    const code = generateUserCode(userData);
    
    // Store the user preferences in a leads database (future enhancement)
    // This would connect to a CRM or internal leads system
    console.log('New user onboarded:', {
      name: userData.name,
      email: userData.email,
      code,
      category: category.level,
      preferences: userData.preferences,
      timestamp: new Date().toISOString()
    });
    
    return res.status(200).json({
      category: category.level,
      code,
      summary: category.description
    });
    
  } catch (error) {
    console.error('Error in preference analysis:', error);
    return res.status(500).json({
      error: 'Server error during preference analysis'
    });
  }
};