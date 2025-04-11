/**
 * API Verification utility
 * Checks the status of all external API integrations
 */

export type ApiStatus = {
  api: string;
  keyPresent: boolean;
  notes: string;
};

export async function verifyApiIntegrations(): Promise<ApiStatus[]> {
  const apiStatuses: ApiStatus[] = [
    // Flight Services
    {
      api: 'Skyscanner/Amadeus',
      keyPresent: !!process.env.SKYSCANNER_API_KEY || !!process.env.AMADEUS_API_KEY, 
      notes: 'Flight search and booking'
    },
    
    // Accommodation Services
    {
      api: 'Booking.com/Expedia',
      keyPresent: !!process.env.BOOKING_API_KEY || !!process.env.EXPEDIA_API_KEY,
      notes: 'Hotel discovery & reservations'
    },
    {
      api: 'Airbnb',
      keyPresent: !!process.env.AIRBNB_API_KEY,
      notes: 'Alternative accommodations'
    },
    
    // Experience & Activity Services
    {
      api: 'Viator/GetYourGuide',
      keyPresent: !!process.env.VIATOR_API_KEY || !!process.env.GETYOURGUIDE_API_KEY,
      notes: 'Tours and experiences'
    },
    
    // Transportation Services
    {
      api: 'Rome2Rio/Transit',
      keyPresent: !!process.env.ROME2RIO_API_KEY || !!process.env.TRANSIT_API_KEY,
      notes: 'Ground transportation'
    },
    {
      api: 'Rental Cars API',
      keyPresent: !!process.env.RENTAL_CARS_API_KEY,
      notes: 'Car rentals'
    },
    
    // Location Services
    {
      api: 'Google Maps/Places',
      keyPresent: !!process.env.GOOGLE_MAPS_API_KEY,
      notes: 'Maps, locations, coordinates'
    },
    
    // Weather Services
    {
      api: 'OpenWeather/WeatherAPI',
      keyPresent: !!process.env.WEATHER_API_KEY || !!process.env.OPEN_WEATHER_API_KEY,
      notes: 'Weather forecasts & alerts'
    },
    
    // Payment Services
    {
      api: 'Stripe',
      keyPresent: !!process.env.STRIPE_SECRET_KEY,
      notes: 'Payments processing'
    },
    {
      api: 'Crypto Payment Gateway',
      keyPresent: !!process.env.CRYPTO_PAYMENT_API_KEY,
      notes: 'Cryptocurrency payments'
    },
    
    // Voice & Speech Services
    {
      api: 'ElevenLabs',
      keyPresent: !!process.env.ELEVENLABS_API_KEY,
      notes: 'Natural voice output'
    },
    {
      api: 'Web Speech API',
      keyPresent: true, // Browser based, always available
      notes: 'Basic voice I/O'
    },
    {
      api: 'Google STT',
      keyPresent: !!process.env.GOOGLE_STT_API_KEY,
      notes: 'Advanced speech recognition'
    },
    
    // Calendar & Sync Services
    {
      api: 'Google Calendar',
      keyPresent: !!process.env.GOOGLE_CALENDAR_API_KEY,
      notes: 'Trip calendar sync'
    },
    
    // QR & Boarding Pass
    {
      api: 'QR Code Generator',
      keyPresent: true, // Client-side library, always available
      notes: 'Boarding pass generator'
    },
    
    // Rewards & Loyalty
    {
      api: 'JetAI Rewards',
      keyPresent: true, // Internal system
      notes: 'Points & perks system'
    },
    {
      api: 'Partner Airlines',
      keyPresent: !!process.env.AIRLINE_REWARDS_API_KEY,
      notes: 'Airline loyalty integration'
    },
    
    // Auth & Data Services
    {
      api: 'Firebase',
      keyPresent: !!process.env.VITE_FIREBASE_API_KEY,
      notes: 'Authentication & database'
    },
    
    // Communication Services
    {
      api: 'Mailchimp/Sendinblue',
      keyPresent: !!process.env.MAILCHIMP_API_KEY || !!process.env.SENDINBLUE_API_KEY,
      notes: 'Email newsletter'
    },
    {
      api: 'WhatsApp/Telegram',
      keyPresent: !!process.env.WHATSAPP_API_KEY || !!process.env.TELEGRAM_API_KEY,
      notes: 'Messaging platform integration'
    },
    
    // Language Services
    {
      api: 'Google Translate',
      keyPresent: !!process.env.GOOGLE_TRANSLATE_API_KEY,
      notes: 'Multilingual support'
    },
    
    // Search & Content Services
    {
      api: 'Google Custom Search',
      keyPresent: !!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY,
      notes: 'Travel blogs & content search'
    },
    
    // AI Services
    {
      api: 'Gemini Flash 1.5 Pro',
      keyPresent: !!process.env.GEMINI_API_KEY,
      notes: 'Primary AI assistant'
    },
    
    // Camera & AR Services
    {
      api: 'Device Camera API',
      keyPresent: true, // Browser-based capability
      notes: 'Image upload capabilities'
    },
    {
      api: 'AR/VR Framework',
      keyPresent: !!process.env.AR_FRAMEWORK_API_KEY,
      notes: 'Augmented reality experiences'
    },
    
    // Wearable Integration
    {
      api: 'Wearable API',
      keyPresent: !!process.env.WEARABLE_API_KEY,
      notes: 'Smartwatch compatibility'
    }
  ];

  return apiStatuses;
}

export function suggestNextApiConnections(apiStatuses: ApiStatus[]): string[] {
  const missingApis = apiStatuses.filter(status => !status.keyPresent);
  
  // Core service priorities based on JetAI system requirements document
  const priorities: Record<string, number> = {
    // Critical travel services - Highest priority (14-20)
    'Skyscanner/Amadeus': 20,           // Flight search critical for travel platform
    'Booking.com/Expedia': 19,          // Hotel search critical for accommodation
    'Viator/GetYourGuide': 18,          // Activities essential for experience booking
    'Google Maps/Places': 17,           // Location and mapping services are foundational
    'OpenWeather/WeatherAPI': 16,       // Weather data essential for travel planning
    'Stripe': 15,                       // Payment processing is essential 
    'Firebase': 14,                     // Auth and database core architecture
    
    // Advanced travel experience features (8-13)
    'Rome2Rio/Transit': 13,             // Ground transportation planning
    'Rental Cars API': 12,              // Car rental services
    'Airbnb': 11,                       // Alternative accommodations
    'Google Calendar': 10,              // Trip calendar synchronization
    'QR Code Generator': 9,             // Boarding pass generation
    'JetAI Rewards': 8,                 // Rewards system
    
    // Enhanced AI and Voice features (3-7)
    'Gemini Flash 1.5 Pro': 7,          // Primary AI assistant
    'ElevenLabs': 6,                    // Natural voice output
    'Google STT': 5,                    // Advanced speech recognition
    'Google Translate': 4,              // Multilingual support
    'Google Custom Search': 3,          // Travel blogs & content search
    
    // Newer integration features (Below 3)
    'Partner Airlines': 2,              // Airline loyalty integration
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