// File: client/src/lib/onboardingFlow.ts
// Defines the 20-question onboarding flow for JET AI travel preferences

export type OnboardingStepData = {
  id: string;
  title: string;
  description?: string;
  type: 'select' | 'multiselect' | 'radio' | 'checkbox' | 'input' | 'text-area' | 'destination-input';
  options?: Array<{
    id: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
  required?: boolean;
  placeholder?: string;
};

export const onboardingSteps: OnboardingStepData[] = [
  {
    id: 'travelExperienceTypes',
    title: 'What types of travel experiences are you interested in?',
    description: 'Select all that apply to personalize your recommendations.',
    type: 'multiselect',
    options: [
      { id: 'cultural', label: 'Cultural Immersion', icon: 'culture' },
      { id: 'adventure', label: 'Adventure & Outdoor', icon: 'adventure' },
      { id: 'luxury', label: 'Luxury & Premium', icon: 'luxury' },
      { id: 'relaxation', label: 'Relaxation & Wellness', icon: 'relaxation' },
      { id: 'foodie', label: 'Culinary & Food Tours', icon: 'food' },
      { id: 'historical', label: 'Historical Sites', icon: 'historical' },
      { id: 'nightlife', label: 'Nightlife & Entertainment', icon: 'nightlife' },
      { id: 'photography', label: 'Photography Trips', icon: 'camera' }
    ],
    required: true
  },
  {
    id: 'budget',
    title: 'What\'s your typical travel budget per day?',
    description: 'This helps us recommend experiences within your price range.',
    type: 'radio',
    options: [
      { id: 'budget', label: 'Budget (under $100/day)' },
      { id: 'moderate', label: 'Moderate ($100-$300/day)' },
      { id: 'premium', label: 'Premium ($300-$500/day)' },
      { id: 'luxury', label: 'Luxury (over $500/day)' }
    ],
    required: true
  },
  {
    id: 'travelCompanions',
    title: 'Who do you typically travel with?',
    type: 'radio',
    options: [
      { id: 'solo', label: 'Solo Travel' },
      { id: 'partner', label: 'With Partner' },
      { id: 'family', label: 'With Family' },
      { id: 'friends', label: 'With Friends' },
      { id: 'group', label: 'Group Tours' },
      { id: 'business', label: 'Business Travel' }
    ],
    required: true
  },
  {
    id: 'bucketListDestinations',
    title: 'What destinations are on your bucket list?',
    description: 'Add places you dream of visiting.',
    type: 'destination-input',
    required: false,
    placeholder: 'Type a destination and press Enter'
  },
  {
    id: 'itineraryPreference',
    title: 'What\'s your preferred itinerary style?',
    type: 'radio',
    options: [
      { id: 'packed', label: 'Action-packed (many activities)' },
      { id: 'balanced', label: 'Balanced (mix of activities and relaxation)' },
      { id: 'relaxed', label: 'Relaxed (few planned activities)' },
      { id: 'spontaneous', label: 'Spontaneous (minimal planning)' }
    ],
    required: true
  },
  {
    id: 'tripDuration',
    title: 'What\'s your typical trip duration?',
    type: 'radio',
    options: [
      { id: 'weekend', label: 'Weekend Getaway (1-3 days)' },
      { id: 'short', label: 'Short Trip (4-7 days)' },
      { id: 'medium', label: 'Medium Trip (1-2 weeks)' },
      { id: 'long', label: 'Extended Trip (2-4 weeks)' },
      { id: 'extendedTravel', label: 'Long-term Travel (1+ months)' }
    ],
    required: true
  },
  {
    id: 'accommodationPreference',
    title: 'What accommodation types do you prefer?',
    description: 'Select all that apply.',
    type: 'multiselect',
    options: [
      { id: 'luxury', label: 'Luxury Hotels & Resorts' },
      { id: 'boutique', label: 'Boutique Hotels' },
      { id: 'midrange', label: 'Mid-range Hotels' },
      { id: 'vacation-rental', label: 'Vacation Rentals/Airbnb' },
      { id: 'hostel', label: 'Hostels' },
      { id: 'camping', label: 'Camping/Glamping' },
      { id: 'unique', label: 'Unique Stays (Treehouses, etc.)' }
    ],
    required: true
  },
  {
    id: 'dietaryRestrictions',
    title: 'Do you have any dietary restrictions or preferences?',
    description: 'Select all that apply.',
    type: 'multiselect',
    options: [
      { id: 'none', label: 'No restrictions' },
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
      { id: 'gluten-free', label: 'Gluten-free' },
      { id: 'dairy-free', label: 'Dairy-free' },
      { id: 'halal', label: 'Halal' },
      { id: 'kosher', label: 'Kosher' },
      { id: 'allergies', label: 'Food Allergies' }
    ],
    required: false
  },
  {
    id: 'internationalTravel',
    title: 'How comfortable are you with international travel?',
    type: 'radio',
    options: [
      { id: 'very-comfortable', label: 'Very comfortable (seasoned traveler)' },
      { id: 'comfortable', label: 'Comfortable (some international experience)' },
      { id: 'somewhat', label: 'Somewhat comfortable (limited experience)' },
      { id: 'nervous', label: 'Nervous but willing to try' },
      { id: 'domestic', label: 'Prefer domestic travel only' }
    ],
    required: true
  },
  {
    id: 'preferredActivities',
    title: 'What activities do you enjoy while traveling?',
    description: 'Select all that apply.',
    type: 'multiselect',
    options: [
      { id: 'sightseeing', label: 'Sightseeing' },
      { id: 'museums', label: 'Museums & Art' },
      { id: 'hiking', label: 'Hiking & Nature' },
      { id: 'water-sports', label: 'Water Sports' },
      { id: 'food-tours', label: 'Food Tours & Cooking Classes' },
      { id: 'shopping', label: 'Shopping' },
      { id: 'nightlife', label: 'Nightlife & Entertainment' },
      { id: 'relaxation', label: 'Relaxation & Spa' },
      { id: 'photography', label: 'Photography' },
      { id: 'local-experiences', label: 'Local Experiences' }
    ],
    required: true
  },
  {
    id: 'ecofriendlyTravel',
    title: 'How important is eco-friendly/sustainable travel to you?',
    type: 'radio',
    options: [
      { id: 'very-important', label: 'Very important (a top priority)' },
      { id: 'important', label: 'Important (I make an effort)' },
      { id: 'somewhat', label: 'Somewhat important' },
      { id: 'not-critical', label: 'Not a critical factor' }
    ],
    required: false
  },
  {
    id: 'travelFrequency',
    title: 'How often do you typically travel?',
    type: 'radio',
    options: [
      { id: 'frequently', label: 'Frequently (6+ trips per year)' },
      { id: 'regularly', label: 'Regularly (3-5 trips per year)' },
      { id: 'occasionally', label: 'Occasionally (1-2 trips per year)' },
      { id: 'rarely', label: 'Rarely (less than once a year)' }
    ],
    required: false
  },
  {
    id: 'accessibilityNeeds',
    title: 'Do you have any accessibility requirements?',
    description: 'Select all that apply.',
    type: 'multiselect',
    options: [
      { id: 'none', label: 'No special requirements' },
      { id: 'mobility', label: 'Mobility accommodations' },
      { id: 'dietary', label: 'Special dietary needs' },
      { id: 'visual', label: 'Visual accommodations' },
      { id: 'auditory', label: 'Auditory accommodations' },
      { id: 'other', label: 'Other special requirements' }
    ],
    required: false
  },
  {
    id: 'bookingManagement',
    title: 'How do you prefer to manage your travel bookings?',
    type: 'radio',
    options: [
      { id: 'self-book', label: 'Self-booking all components' },
      { id: 'packages', label: 'Pre-arranged travel packages' },
      { id: 'travel-agent', label: 'Working with a travel agent' },
      { id: 'mix', label: 'A mix of the above' }
    ],
    required: false
  },
  {
    id: 'transportationPreference',
    title: 'What transportation options do you prefer while traveling?',
    description: 'Select all that apply.',
    type: 'multiselect',
    options: [
      { id: 'public', label: 'Public Transportation' },
      { id: 'rental-car', label: 'Rental Car' },
      { id: 'rideshare', label: 'Rideshare Services' },
      { id: 'private-driver', label: 'Private Driver/Chauffeur' },
      { id: 'walking', label: 'Walking' },
      { id: 'biking', label: 'Biking' },
      { id: 'tour-bus', label: 'Tour Bus/Group Transport' }
    ],
    required: false
  },
  {
    id: 'languages',
    title: 'Which languages do you speak?',
    description: 'Select all that apply.',
    type: 'multiselect',
    options: [
      { id: 'english', label: 'English' },
      { id: 'spanish', label: 'Spanish' },
      { id: 'french', label: 'French' },
      { id: 'german', label: 'German' },
      { id: 'italian', label: 'Italian' },
      { id: 'chinese', label: 'Chinese' },
      { id: 'japanese', label: 'Japanese' },
      { id: 'portuguese', label: 'Portuguese' },
      { id: 'russian', label: 'Russian' },
      { id: 'arabic', label: 'Arabic' },
      { id: 'other', label: 'Other' }
    ],
    required: true
  },
  {
    id: 'socialPreference',
    title: 'What\'s your social preference while traveling?',
    type: 'radio',
    options: [
      { id: 'very-social', label: 'Very social (meeting new people is a priority)' },
      { id: 'somewhat-social', label: 'Somewhat social (open to meeting others)' },
      { id: 'private', label: 'Private (prefer to keep to myself/my group)' },
      { id: 'varies', label: 'Varies by trip' }
    ],
    required: false
  },
  {
    id: 'aiAssistancePreference',
    title: 'How would you prefer JET AI to assist you?',
    description: 'Select all that apply.',
    type: 'multiselect',
    options: [
      { id: 'recommendations', label: 'Personalized Recommendations' },
      { id: 'planning', label: 'Trip Planning & Itineraries' },
      { id: 'booking', label: 'Booking Assistance' },
      { id: 'on-trip', label: 'On-Trip Support & Guidance' },
      { id: 'inspiration', label: 'Travel Inspiration' },
      { id: 'budgeting', label: 'Budgeting & Cost Tracking' },
      { id: 'local-insights', label: 'Local Insights & Hidden Gems' }
    ],
    required: true
  },
  {
    id: 'journeySharing',
    title: 'Do you like to document and share your travel experiences?',
    type: 'radio',
    options: [
      { id: 'yes-social', label: 'Yes, on social media' },
      { id: 'yes-private', label: 'Yes, but privately' },
      { id: 'sometimes', label: 'Sometimes/Selectively' },
      { id: 'no', label: 'No, I prefer not to document' }
    ],
    required: false
  },
  {
    id: 'experienceCuration',
    title: 'How do you typically discover travel experiences?',
    type: 'radio',
    options: [
      { id: 'research', label: 'In-depth personal research' },
      { id: 'recommendations', label: 'Recommendations from others' },
      { id: 'spontaneous', label: 'Spontaneous discovery while there' },
      { id: 'travel-agent', label: 'Travel agent/service recommendations' },
      { id: 'social-media', label: 'Social media inspiration' }
    ],
    required: false
  }
];

// Mapping of onboarding step IDs to their position in the flow
export const onboardingStepOrder: Record<string, number> = 
  onboardingSteps.reduce((acc, step, index) => {
    acc[step.id] = index;
    return acc;
  }, {} as Record<string, number>);

// Helper function to get the next step in the flow
export function getNextStep(currentStepId: string): string | null {
  const currentIndex = onboardingStepOrder[currentStepId];
  if (currentIndex === undefined || currentIndex >= onboardingSteps.length - 1) {
    return null; // No next step
  }
  return onboardingSteps[currentIndex + 1].id;
}

// Helper function to get the previous step in the flow
export function getPreviousStep(currentStepId: string): string | null {
  const currentIndex = onboardingStepOrder[currentStepId];
  if (currentIndex === undefined || currentIndex <= 0) {
    return null; // No previous step
  }
  return onboardingSteps[currentIndex - 1].id;
}