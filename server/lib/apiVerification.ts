/**
 * API Verification utility
 * Checks the status of all external API integrations
 * 
 * Verifies connection status for JetAI's comprehensive travel ecosystem including:
 * - Core Travel Services (Flights, Hotels, Activities)
 * - AI/ML Services (Gemini, Language Processing, Sentiment Analysis)
 * - Voice & Multimodal Interaction
 * - Payments & Loyalty
 * - Communication & Social Features
 */

export type ApiStatus = {
  api: string;
  keyPresent: boolean;
  notes: string;
  category: 'Travel' | 'Accommodation' | 'Experience' | 'Transport' | 'Location' | 
           'Weather' | 'Payment' | 'Voice' | 'Calendar' | 'Document' | 'Loyalty' | 
           'Auth' | 'Communication' | 'Language' | 'Search' | 'AI' | 'Vision' | 'Wearable';
};

export async function verifyApiIntegrations(): Promise<ApiStatus[]> {
  const apiStatuses: ApiStatus[] = [
    // Flight Services
    {
      api: 'Skyscanner/Amadeus',
      keyPresent: !!process.env.SKYSCANNER_API_KEY || !!process.env.AMADEUS_API_KEY, 
      notes: 'Flight search and booking',
      category: 'Travel'
    },
    
    // Accommodation Services
    {
      api: 'Booking.com/Expedia',
      keyPresent: !!process.env.BOOKING_API_KEY || !!process.env.EXPEDIA_API_KEY,
      notes: 'Hotel discovery & reservations',
      category: 'Accommodation'
    },
    {
      api: 'Airbnb',
      keyPresent: !!process.env.AIRBNB_API_KEY,
      notes: 'Alternative accommodations',
      category: 'Accommodation'
    },
    
    // Experience & Activity Services
    {
      api: 'Viator/GetYourGuide',
      keyPresent: !!process.env.VIATOR_API_KEY || !!process.env.GETYOURGUIDE_API_KEY,
      notes: 'Tours and experiences',
      category: 'Experience'
    },
    
    // Transportation Services
    {
      api: 'Rome2Rio/Transit',
      keyPresent: !!process.env.ROME2RIO_API_KEY || !!process.env.TRANSIT_API_KEY,
      notes: 'Ground transportation',
      category: 'Transport'
    },
    {
      api: 'Rental Cars API',
      keyPresent: !!process.env.RENTAL_CARS_API_KEY,
      notes: 'Car rentals',
      category: 'Transport'
    },
    
    // Location Services
    {
      api: 'Google Maps/Places',
      keyPresent: !!process.env.GOOGLE_MAPS_API_KEY,
      notes: 'Maps, locations, coordinates',
      category: 'Location'
    },
    
    // Weather Services
    {
      api: 'OpenWeather/WeatherAPI',
      keyPresent: !!process.env.WEATHER_API_KEY || !!process.env.OPEN_WEATHER_API_KEY,
      notes: 'Weather forecasts & alerts',
      category: 'Weather'
    },
    
    // Payment Services
    {
      api: 'Stripe',
      keyPresent: !!process.env.STRIPE_SECRET_KEY,
      notes: 'Payments processing',
      category: 'Payment'
    },
    {
      api: 'Crypto Payment Gateway',
      keyPresent: !!process.env.CRYPTO_PAYMENT_API_KEY,
      notes: 'Cryptocurrency payments',
      category: 'Payment'
    },
    
    // Voice & Speech Services
    {
      api: 'Google TTS',
      keyPresent: !!process.env.GOOGLE_TTS_API_KEY,
      notes: 'Text-to-speech capabilities',
      category: 'Voice'
    },
    {
      api: 'ElevenLabs',
      keyPresent: !!process.env.ELEVENLABS_API_KEY,
      notes: 'Natural voice output',
      category: 'Voice'
    },
    {
      api: 'Web Speech API',
      keyPresent: true, // Browser based, always available
      notes: 'Basic voice I/O',
      category: 'Voice'
    },
    {
      api: 'Google STT',
      keyPresent: !!process.env.GOOGLE_STT_API_KEY,
      notes: 'Advanced speech recognition',
      category: 'Voice'
    },
    
    // Calendar & Sync Services
    {
      api: 'Google Calendar',
      keyPresent: !!process.env.GOOGLE_CALENDAR_API_KEY,
      notes: 'Trip calendar sync',
      category: 'Calendar'
    },
    
    // QR & Boarding Pass
    {
      api: 'QR Code Generator',
      keyPresent: true, // Client-side library, always available
      notes: 'Boarding pass generator',
      category: 'Document'
    },
    
    // Rewards & Loyalty
    {
      api: 'JetAI Rewards',
      keyPresent: true, // Internal system
      notes: 'Points & perks system',
      category: 'Loyalty'
    },
    {
      api: 'Partner Airlines',
      keyPresent: !!process.env.AIRLINE_REWARDS_API_KEY,
      notes: 'Airline loyalty integration',
      category: 'Loyalty'
    },
    
    // Auth & Data Services
    {
      api: 'Firebase',
      keyPresent: !!process.env.VITE_FIREBASE_API_KEY,
      notes: 'Authentication & database',
      category: 'Auth'
    },
    {
      api: 'Firestore',
      keyPresent: !!process.env.VITE_FIREBASE_API_KEY,
      notes: 'User preferences storage',
      category: 'Auth'
    },
    
    // Communication Services
    {
      api: 'Mailchimp/Sendinblue',
      keyPresent: !!process.env.MAILCHIMP_API_KEY || !!process.env.SENDINBLUE_API_KEY,
      notes: 'Email newsletter',
      category: 'Communication'
    },
    {
      api: 'WhatsApp/Telegram',
      keyPresent: !!process.env.WHATSAPP_API_KEY || !!process.env.TELEGRAM_API_KEY,
      notes: 'Messaging platform integration',
      category: 'Communication'
    },
    
    // Language & Emotion Services
    {
      api: 'Google Translate',
      keyPresent: !!process.env.GOOGLE_TRANSLATE_API_KEY,
      notes: 'Multilingual support',
      category: 'Language'
    },
    {
      api: 'Google Cloud Natural Language',
      keyPresent: !!process.env.GOOGLE_NATURAL_LANGUAGE_API_KEY,
      notes: 'Sentiment & emotion analysis',
      category: 'Language'
    },
    
    // Search & Content Services
    {
      api: 'Google Custom Search',
      keyPresent: !!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY,
      notes: 'Travel blogs & content search',
      category: 'Search'
    },
    
    // AI Services
    {
      api: 'Gemini Flash 1.5 Pro',
      keyPresent: !!process.env.GEMINI_API_KEY,
      notes: 'Primary AI assistant',
      category: 'AI'
    },
    {
      api: 'Google Vertex AI',
      keyPresent: !!process.env.GOOGLE_VERTEX_AI_KEY,
      notes: 'Advanced recommendation engine',
      category: 'AI'
    },
    
    // Camera & Vision Services
    {
      api: 'Device Camera API',
      keyPresent: true, // Browser-based capability
      notes: 'Image upload capabilities',
      category: 'Vision'
    },
    {
      api: 'Google Cloud Vision',
      keyPresent: !!process.env.GOOGLE_CLOUD_VISION_API_KEY,
      notes: 'Image analysis for travel photos',
      category: 'Vision'
    },
    {
      api: 'AR/VR Framework',
      keyPresent: !!process.env.AR_FRAMEWORK_API_KEY,
      notes: 'Augmented reality experiences',
      category: 'Vision'
    },
    
    // Wearable Integration
    {
      api: 'Wearable API',
      keyPresent: !!process.env.WEARABLE_API_KEY,
      notes: 'Smartwatch compatibility',
      category: 'Wearable'
    }
  ];

  return apiStatuses;
}

export function suggestNextApiConnections(apiStatuses: ApiStatus[]): string[] {
  const missingApis = apiStatuses.filter(status => !status.keyPresent);
  
  // Core service priorities based on JetAI system requirements document
  const priorities: Record<string, number> = {
    // Critical travel services - Highest priority (20-25)
    'Skyscanner/Amadeus': 25,           // Flight search critical for travel platform
    'Booking.com/Expedia': 24,          // Hotel search critical for accommodation
    'Viator/GetYourGuide': 23,          // Activities essential for experience booking
    'Google Maps/Places': 22,           // Location and mapping services are foundational
    'OpenWeather/WeatherAPI': 21,       // Weather data essential for travel planning
    'Stripe': 20,                       // Payment processing is essential 
    
    // Essential AI and data features (15-19)
    'Firebase': 19,                     // Auth and database core architecture
    'Firestore': 18,                    // User preferences storage
    'Gemini Flash 1.5 Pro': 17,         // Primary AI assistant
    'Google Cloud Natural Language': 16,// Emotional intelligence capabilities
    'Google Translate': 15,             // Multilingual support is critical for global usage
    
    // Voice and speech capabilities (10-14)
    'Google TTS': 14,                   // Text-to-speech for voice responses
    'Google STT': 13,                   // Speech recognition for voice commands
    'Web Speech API': 12,               // Basic voice interface
    'ElevenLabs': 11,                   // Enhanced voice quality
    'Google Cloud Vision': 10,          // Vision capabilities for image analysis
    
    // Advanced travel features (5-9)
    'Rome2Rio/Transit': 9,              // Ground transportation planning
    'Rental Cars API': 8,               // Car rental services
    'Google Calendar': 7,               // Trip calendar synchronization
    'Google Vertex AI': 6,              // Advanced personalization
    'QR Code Generator': 5,             // Boarding pass generation
    
    // Secondary features (1-4)
    'Airbnb': 4,                        // Alternative accommodations
    'Partner Airlines': 3,              // Airline loyalty integration
    'Google Custom Search': 2,          // Travel blogs & content search
    'WhatsApp/Telegram': 2,             // Messaging platform integration
    'AR/VR Framework': 1,               // Augmented reality experiences
    'Wearable API': 1,                  // Smartwatch compatibility
    'Crypto Payment Gateway': 1         // Cryptocurrency payments
  };
  
  missingApis.sort((a, b) => {
    const priorityA = priorities[a.api] || 0;
    const priorityB = priorities[b.api] || 0;
    return priorityB - priorityA;
  });
  
  return missingApis.slice(0, 5).map(api => api.api);
}