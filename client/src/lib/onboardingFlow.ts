/**
 * onboardingFlow.ts
 * Defines the dynamic onboarding flow for JetAI Travel Assistant
 */

export interface OnboardingQuestion {
  id: string;
  label: string;
  field: string;
  type: 'text' | 'multipleChoice' | 'boolean' | 'file' | 'voice' | 'multiSelect';
  options?: string[];
  required: boolean;
  validation?: RegExp | ((value: any) => boolean);
  placeholder?: string;
  description?: string;
}

// Travel-specific onboarding questions
export const travelOnboardingFlow: OnboardingQuestion[] = [
  {
    id: 'name',
    label: "What's your name?",
    field: 'name',
    type: 'text',
    required: true,
    placeholder: 'Enter your name',
    description: 'We will use this to personalize your experience'
  },
  {
    id: 'email',
    label: "What's your email address?",
    field: 'email',
    type: 'text',
    required: true,
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    placeholder: 'your.email@example.com',
    description: 'We will use this for important travel notifications'
  },
  {
    id: 'upcomingDestinations',
    label: 'Where are you planning to travel next?',
    field: 'travelPreferences.upcomingDestinations',
    type: 'text',
    required: false,
    placeholder: 'Paris, Tokyo, New York',
    description: 'Enter destinations separated by commas'
  },
  {
    id: 'travelerType',
    label: 'What type of traveler are you?',
    field: 'travelPreferences.travelerType',
    type: 'multipleChoice',
    options: [
      'Luxury traveler',
      'Budget backpacker',
      'Family traveler',
      'Business traveler',
      'Adventure seeker',
      'Cultural explorer',
      'Beach lounger'
    ],
    required: true,
    description: 'This helps us tailor our recommendations to your style'
  },
  {
    id: 'interests',
    label: 'What are your travel interests?',
    field: 'travelPreferences.interests',
    type: 'multiSelect',
    options: [
      'Food & Cuisine',
      'Art & Museums',
      'History & Culture',
      'Outdoor Activities',
      'Shopping',
      'Nightlife',
      'Beach & Relaxation',
      'Adventure Sports',
      'Wildlife & Nature',
      'Photography'
    ],
    required: false,
    description: 'Select all that apply'
  },
  {
    id: 'budget',
    label: 'What is your typical travel budget?',
    field: 'travelPreferences.budget',
    type: 'multipleChoice',
    options: [
      'Economy (under $100/day)',
      'Mid-range ($100-300/day)',
      'Luxury ($300-600/day)',
      'Ultra-Luxury ($600+/day)'
    ],
    required: false,
    description: 'This helps us find options in your price range'
  },
  {
    id: 'preferredAccommodation',
    label: 'What type of accommodation do you prefer?',
    field: 'travelPreferences.preferredAccommodation',
    type: 'multipleChoice',
    options: [
      'Luxury Hotels',
      'Boutique Hotels',
      'Mid-range Hotels',
      'Budget Hotels',
      'Vacation Rentals',
      'Hostels',
      'Resorts',
      'All-Inclusive'
    ],
    required: false,
    description: 'Your preferred place to stay'
  },
  {
    id: 'dietaryRestrictions',
    label: 'Do you have any dietary restrictions?',
    field: 'travelPreferences.dietaryRestrictions',
    type: 'multiSelect',
    options: [
      'Vegetarian',
      'Vegan',
      'Gluten-free',
      'Nut Allergy',
      'Lactose Intolerant',
      'Kosher',
      'Halal',
      'None'
    ],
    required: false,
    description: 'This helps us suggest appropriate dining options'
  },
  {
    id: 'languages',
    label: 'What languages do you speak?',
    field: 'travelPreferences.languages',
    type: 'multiSelect',
    options: [
      'English',
      'Spanish',
      'French',
      'German',
      'Italian',
      'Portuguese',
      'Chinese',
      'Japanese',
      'Korean',
      'Russian',
      'Arabic'
    ],
    required: false,
    description: 'This helps us provide language tips for your destinations'
  }
];

// Health-specific onboarding questions (for future expansion)
export const healthOnboardingFlow: OnboardingQuestion[] = [
  // Health-specific questions would go here
];

// Crypto-specific onboarding questions (for future expansion)
export const cryptoOnboardingFlow: OnboardingQuestion[] = [
  // Crypto-specific questions would go here
];

/**
 * Returns the appropriate onboarding questions based on agent type
 */
export function getOnboardingQuestions(agentType: string): OnboardingQuestion[] {
  switch (agentType.toLowerCase()) {
    case 'travel':
      return travelOnboardingFlow;
    case 'health':
      return healthOnboardingFlow;
    case 'crypto':
      return cryptoOnboardingFlow;
    default:
      return travelOnboardingFlow; // Default to travel
  }
}