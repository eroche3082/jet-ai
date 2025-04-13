import type { Request, Response } from 'express';

type UserData = {
  name: string;
  email: string;
  preferences: Record<string, any>;
};

type AIResponse = {
  code: string;
  category: string;
  summary: string;
};

// Map of travel types to traveler categories
const TRAVELER_CATEGORIES: Record<string, string> = {
  'Luxury Travel': 'Luxury Traveler',
  'Adventure Travel': 'Adventure Seeker',
  'Business Travel': 'Business Traveler',
  'Family Travel': 'Family Explorer',
  'Solo Travel': 'Solo Explorer',
  'Budget Travel': 'Value Seeker',
  'Cultural Travel': 'Cultural Enthusiast',
  'Eco Travel': 'Eco-Conscious Traveler'
};

// Map of travel types to code prefixes
const CODE_PREFIXES: Record<string, string> = {
  'Luxury Travel': 'VIP',
  'Adventure Travel': 'ADV',
  'Business Travel': 'BIZ',
  'Family Travel': 'FAM',
  'Solo Travel': 'SOLO',
  'Budget Travel': 'ECO',
  'Cultural Travel': 'CULT',
  'Eco Travel': 'GREEN'
};

/**
 * AI Analysis of User Preferences
 * 
 * This function analyzes the user's travel preferences and categorizes them,
 * providing a custom travel profile with personalized suggestions.
 */
export async function analyzePreferences(req: Request, res: Response) {
  try {
    const userData: UserData = req.body;
    
    if (!userData || !userData.preferences) {
      return res.status(400).json({ error: 'Invalid user data provided' });
    }
    
    // Extract key preferences
    const travelTypes = userData.preferences.travelTypes || [];
    const budget = userData.preferences.budget || 'Medium';
    const companions = userData.preferences.travelCompanions || 'Solo';
    
    // Determine primary travel type
    let primaryType = 'Standard Travel';
    let category = 'Standard Traveler';
    let prefix = 'STD';
    
    // Find the first matching travel type in our category map
    for (const type of travelTypes) {
      if (TRAVELER_CATEGORIES[type]) {
        primaryType = type;
        category = TRAVELER_CATEGORIES[type];
        prefix = CODE_PREFIXES[type] || 'STD';
        break;
      }
    }
    
    // Generate a unique code
    const random = Math.floor(1000 + Math.random() * 9000);
    const code = `JET-${prefix}-${random}`;
    
    // Generate a personalized summary based on preferences
    let summary = `As a ${category}, you'll receive tailored recommendations for your travel style. `;
    
    // Add budget context
    if (budget.includes('Luxury')) {
      summary += "We'll focus on premium experiences, exclusive accommodations, and high-end dining options. ";
    } else if (budget.includes('Budget')) {
      summary += "We'll help you find the best value accommodations, affordable dining options, and free activities. ";
    } else {
      summary += "We'll balance quality and value in our recommendations for accommodations and activities. ";
    }
    
    // Add travel companion context
    if (companions.includes('Family')) {
      summary += "Your recommendations will include family-friendly destinations, activities for all ages, and suitable accommodations. ";
    } else if (companions.includes('Friends')) {
      summary += "Your recommendations will focus on social experiences, group-friendly accommodations, and activities to enjoy together. ";
    } else if (companions.includes('Partner')) {
      summary += "Your recommendations will include romantic destinations, couples activities, and intimate dining experiences. ";
    } else {
      summary += "Your recommendations will include solo-friendly destinations, social opportunities, and safety-focused advice. ";
    }
    
    // Complete the summary
    summary += "Your JET AI dashboard is now ready with personalized recommendations just for you.";
    
    // Prepare response object
    const response: AIResponse = {
      code,
      category,
      summary
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in AI preference analysis:", error);
    return res.status(500).json({ 
      error: "Failed to analyze preferences",
      code: "JET-ERR-500",
      category: "Standard Traveler",
      summary: "We experienced an error analyzing your preferences. A default profile has been created for you."
    });
  }
}