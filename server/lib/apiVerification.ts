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
    {
      api: 'Skyscanner/Amadeus',
      keyPresent: !!process.env.SKYSCANNER_API_KEY || !!process.env.AMADEUS_API_KEY, 
      notes: 'Flight search'
    },
    {
      api: 'Booking/Expedia',
      keyPresent: !!process.env.BOOKING_API_KEY || !!process.env.EXPEDIA_API_KEY,
      notes: 'Hotel integration'
    },
    {
      api: 'Viator/GetYourGuide',
      keyPresent: !!process.env.VIATOR_API_KEY || !!process.env.GETYOURGUIDE_API_KEY,
      notes: 'Activities'
    },
    {
      api: 'Google Maps',
      keyPresent: !!process.env.GOOGLE_MAPS_API_KEY,
      notes: 'Place names + coordinates'
    },
    {
      api: 'Stripe',
      keyPresent: !!process.env.STRIPE_SECRET_KEY,
      notes: 'Payments'
    },
    {
      api: 'Firebase',
      keyPresent: !!process.env.VITE_FIREBASE_API_KEY,
      notes: 'Auth + DB'
    },
    {
      api: 'ElevenLabs / Web Speech',
      keyPresent: !!process.env.ELEVENLABS_API_KEY,
      notes: 'Voice output'
    },
    {
      api: 'Web Speech / Google STT',
      keyPresent: !!process.env.GOOGLE_STT_API_KEY,
      notes: 'Voice input'
    },
    {
      api: 'Google Calendar',
      keyPresent: !!process.env.GOOGLE_CALENDAR_API_KEY,
      notes: 'Sync trips'
    },
    {
      api: 'Mailchimp/Sendinblue',
      keyPresent: !!process.env.MAILCHIMP_API_KEY || !!process.env.SENDINBLUE_API_KEY,
      notes: 'Newsletter'
    },
    {
      api: 'Weather API',
      keyPresent: !!process.env.WEATHER_API_KEY,
      notes: 'Forecast per destination'
    },
    {
      api: 'Google Custom Search',
      keyPresent: !!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY,
      notes: 'Travel blogs'
    },
    {
      api: 'VidaRewards',
      keyPresent: !!process.env.VIDAREWARDS_API_KEY,
      notes: 'Points & perks'
    },
    {
      api: 'Camera API',
      keyPresent: false, // Server cannot verify client-side capabilities
      notes: 'Image upload or AR use'
    },
    {
      api: 'Rome2Rio / Transit',
      keyPresent: !!process.env.ROME2RIO_API_KEY || !!process.env.TRANSIT_API_KEY,
      notes: 'Transport routes'
    },
    {
      api: 'Gemini',
      keyPresent: !!process.env.GEMINI_API_KEY,
      notes: 'AI assistant'
    }
  ];

  return apiStatuses;
}

export function suggestNextApiConnections(apiStatuses: ApiStatus[]): string[] {
  const missingApis = apiStatuses.filter(status => !status.keyPresent);
  
  // Sort based on travel flow priority
  const priorities: Record<string, number> = {
    'Skyscanner/Amadeus': 10,
    'Booking/Expedia': 9,
    'Google Maps': 8,
    'Weather API': 7,
    'Viator/GetYourGuide': 6,
    'Rome2Rio / Transit': 5,
    'Web Speech / Google STT': 4,
    'ElevenLabs / Web Speech': 3,
    'Google Calendar': 2,
    'Google Custom Search': 1
  };
  
  missingApis.sort((a, b) => {
    const priorityA = priorities[a.api] || 0;
    const priorityB = priorities[b.api] || 0;
    return priorityB - priorityA;
  });
  
  return missingApis.slice(0, 5).map(api => api.api);
}