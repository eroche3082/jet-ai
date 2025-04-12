/**
 * promptGeneration.ts
 * Generates AI system prompts based on user profile data
 */

import { UserProfile } from './firebase';

/**
 * Generates a personalized system prompt based on user profile
 * @param profile User profile data
 * @returns Personalized system prompt
 */
export function generateSystemPrompt(profile?: UserProfile | null): string {
  // Base system prompt for travel assistant
  let basePrompt = `You are JetAI, a luxury travel assistant with expertise in global destinations, accommodations, flights, and experiences. 
You provide personalized, thoughtful travel advice that is accurate and helpful.
Always be respectful, professional, and maintain a conversational, friendly tone.
When recommending destinations, consider the traveler's preferences, budget, and interests.
For flights and accommodations, prioritize options that match the user's specified comfort level and price range.
If you don't have specific information, acknowledge that and provide general advice instead of making up details.`;

  // If no profile exists, return base prompt
  if (!profile) {
    return basePrompt;
  }

  // Add personalized information
  let personalizedPrompt = basePrompt + '\n\n';
  
  // Add name-specific greeting
  if (profile.name) {
    personalizedPrompt += `The user name is ${profile.name}. Address them by name occasionally to personalize the conversation.\n`;
  }
  
  // Add membership level context
  if (profile.membership) {
    personalizedPrompt += `The user has a ${profile.membership} membership tier. `;
    
    if (profile.membership === 'premium') {
      personalizedPrompt += `As a premium member, they have access to exclusive luxury recommendations, VIP services, and priority support.\n`;
    } else if (profile.membership === 'freemium') {
      personalizedPrompt += `As a freemium member, they have access to standard recommendations and basic services.\n`;
    } else {
      personalizedPrompt += `As a basic member, they have access to essential features.\n`;
    }
  }
  
  // Add travel preferences section if available
  if (profile.travelPreferences) {
    const prefs = profile.travelPreferences;
    personalizedPrompt += '\n--- USER TRAVEL PREFERENCES ---\n';
    
    // Add upcoming destinations
    if (prefs.upcomingDestinations && prefs.upcomingDestinations.length > 0) {
      personalizedPrompt += `Upcoming Destinations: ${prefs.upcomingDestinations.join(', ')}. Tailor recommendations and insights relevant to these locations.\n`;
    }
    
    // Add traveler type
    if (prefs.travelerType) {
      personalizedPrompt += `Traveler Type: ${prefs.travelerType}. Adapt suggestions to match this travel style.\n`;
      
      // Add specific guidance based on traveler type
      switch (prefs.travelerType.toLowerCase()) {
        case 'luxury traveler':
          personalizedPrompt += `Focus on high-end experiences, five-star accommodations, fine dining, and exclusive services.\n`;
          break;
        case 'budget backpacker':
          personalizedPrompt += `Emphasize affordable options, hostels, budget transportation, and free or low-cost activities.\n`;
          break;
        case 'family traveler':
          personalizedPrompt += `Recommend family-friendly accommodations, activities suitable for children, and convenient transportation options.\n`;
          break;
        case 'business traveler':
          personalizedPrompt += `Prioritize efficient transportation, accommodations with work facilities, and time-optimized itineraries.\n`;
          break;
        case 'adventure seeker':
          personalizedPrompt += `Suggest thrilling activities, unique experiences, off-the-beaten-path destinations, and adventure sports.\n`;
          break;
        case 'cultural explorer':
          personalizedPrompt += `Focus on historical sites, museums, local traditions, authentic cultural experiences, and language tips.\n`;
          break;
        case 'beach lounger':
          personalizedPrompt += `Recommend coastal destinations, beachfront resorts, relaxation activities, and water-based recreation.\n`;
          break;
      }
    }
    
    // Add interests
    if (prefs.interests && prefs.interests.length > 0) {
      personalizedPrompt += `Travel Interests: ${prefs.interests.join(', ')}. Highlight attractions and activities related to these interests.\n`;
    }
    
    // Add budget considerations
    if (prefs.budget) {
      personalizedPrompt += `Budget Level: ${prefs.budget}. Ensure recommendations align with this spending capacity.\n`;
    }
    
    // Add accommodation preferences
    if (prefs.preferredAccommodation) {
      personalizedPrompt += `Preferred Accommodation: ${prefs.preferredAccommodation}. Recommend similar lodging options.\n`;
    }
    
    // Add dietary restrictions
    if (prefs.dietaryRestrictions && prefs.dietaryRestrictions.length > 0) {
      personalizedPrompt += `Dietary Restrictions: ${prefs.dietaryRestrictions.join(', ')}. Consider these when suggesting restaurants or food experiences.\n`;
    }
    
    // Add language considerations
    if (prefs.languages && prefs.languages.length > 0) {
      personalizedPrompt += `Languages Spoken: ${prefs.languages.join(', ')}. Provide language tips relevant to their destinations and language abilities.\n`;
    }
  }
  
  // Add experience level based on AI interactions
  if (profile.aiInteractions !== undefined) {
    personalizedPrompt += '\n';
    if (profile.aiInteractions < 5) {
      personalizedPrompt += 'The user is new to JetAI. Provide more detailed explanations and suggestions.\n';
    } else if (profile.aiInteractions >= 20) {
      personalizedPrompt += 'The user is experienced with JetAI. You can be more concise and offer advanced insights.\n';
    }
  }
  
  // Add specific behavioral instructions
  personalizedPrompt += `\nBehavioral Guidance:
1. Be conversational but professional, embodying a luxury travel concierge demeanor
2. Avoid overly long responses unless the user requests detailed information
3. When recommending destinations or services, consider their stated preferences
4. If they inquire about premium features not available in their tier, gently mention upgrading
5. Always prioritize their explicit requests over assumed preferences\n`;
  
  return personalizedPrompt;
}

/**
 * Generates conversation starters based on user profile
 * @param profile User profile data
 * @returns Array of personalized conversation starters
 */
export function generateConversationStarters(profile?: UserProfile | null): string[] {
  // Default conversation starters
  const defaultStarters = [
    "Where are you planning to travel next?",
    "Need help finding the perfect hotel for your trip?",
    "Looking for flight options to your destination?",
    "Can I help you discover unique experiences for your next vacation?",
    "Want recommendations for must-see attractions anywhere in the world?"
  ];
  
  // If no profile exists, return default starters
  if (!profile || !profile.travelPreferences) {
    return defaultStarters;
  }
  
  const starters: string[] = [];
  const prefs = profile.travelPreferences;
  
  // Add personalized starters based on upcoming destinations
  if (prefs.upcomingDestinations && prefs.upcomingDestinations.length > 0) {
    const destination = prefs.upcomingDestinations[0];
    starters.push(`Need help planning your trip to ${destination}?`);
    starters.push(`Want to discover hidden gems in ${destination}?`);
  }
  
  // Add starters based on traveler type
  if (prefs.travelerType) {
    switch (prefs.travelerType.toLowerCase()) {
      case 'luxury traveler':
        starters.push("Looking for exclusive luxury experiences for your next trip?");
        break;
      case 'budget backpacker':
        starters.push("Want to find budget-friendly options that don't compromise on experience?");
        break;
      case 'family traveler':
        starters.push("Need recommendations for family-friendly activities and accommodations?");
        break;
      case 'business traveler':
        starters.push("Can I help optimize your business travel itinerary?");
        break;
      case 'adventure seeker':
        starters.push("Ready to discover thrilling adventures for your next destination?");
        break;
      case 'cultural explorer':
        starters.push("Interested in authentic cultural experiences for your upcoming trip?");
        break;
      case 'beach lounger':
        starters.push("Looking for the perfect beach destination for relaxation?");
        break;
    }
  }
  
  // Add starters based on interests
  if (prefs.interests && prefs.interests.length > 0) {
    const interest = prefs.interests[0];
    starters.push(`Want recommendations related to your interest in ${interest.toLowerCase()}?`);
  }
  
  // If we have personalized starters, add a couple default ones to round it out
  if (starters.length > 0) {
    // Add two defaults to ensure we have enough options
    starters.push(defaultStarters[0]);
    starters.push(defaultStarters[4]);
    return starters;
  }
  
  // Fallback to default if no personalizations could be made
  return defaultStarters;
}