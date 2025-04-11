import OpenAI from "openai";
import * as fs from 'fs';
import * as path from 'path';

// Initialize OpenAI client if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY || process.env.OPENAI_KEY) {
  openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || '' 
  });
}

// Initialize Google Gemini client
let geminiClient: any = null;

// Load credentials from the Google credentials JSON file
try {
  const credentialsPath = path.resolve(process.cwd(), 'google-credentials-global.json');
  if (fs.existsSync(credentialsPath)) {
    console.log("Found Google credentials file, initializing Gemini...");
    
    // Use the Google Generative AI SDK
    import('@google/generative-ai').then(({ GoogleGenerativeAI }) => {
      // Get project ID from credentials
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      
      // Use the Vertex AI API with service account credentials
      const genAI = new GoogleGenerativeAI();
      geminiClient = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("Google Gemini AI initialized successfully!");
    }).catch(err => {
      console.error("Error initializing Google Generative AI:", err);
    });
  } else {
    console.warn("Google credentials file not found at:", credentialsPath);
  }
} catch (error) {
  console.error("Error loading Google credentials:", error);
}

// Export chat message interface
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Export chat response interface
export interface ChatResponse {
  message: string;
  suggestions?: string[];
  destinations?: {
    id: string;
    name: string;
    country: string;
    description: string;
    imageUrl: string;
    rating: number;
  }[];
  itinerary?: {
    days: {
      day: number;
      activities: {
        time: string;
        title: string;
        description: string;
        location?: string;
      }[];
    }[];
  };
}

// System prompts
const TRAVEL_AGENT_PROMPT = `
You are JetAI, an expert travel assistant. Your role is to help users plan their perfect trips by providing personalized recommendations, creating custom itineraries, and answering travel-related questions.

Some guidelines for your responses:
1. Be conversational, friendly, and enthusiastic about travel.
2. Provide specific, detailed recommendations based on the user's preferences.
3. When recommending destinations, include practical information like best times to visit, local transportation, and budget considerations.
4. For itineraries, structure them by day with specific activities, times, and locations.
5. If the user's query is vague, ask clarifying questions about their preferences (budget, travel style, interests, etc.).
6. Always prioritize authentic, local experiences over generic tourist activities.
7. If you don't know something specific, be honest about limitations and suggest general guidance instead.
8. Format your responses with clear sections, bullet points when appropriate, and highlight important information.

For JSON responses, use the following structure:
{
  "message": "Your conversational response to the user",
  "suggestions": ["Suggested follow-up 1", "Suggested follow-up 2", "Suggested follow-up 3"],
  "destinations": [
    {
      "id": "unique-id",
      "name": "Destination Name",
      "country": "Country",
      "description": "Brief description",
      "imageUrl": "Image URL from Unsplash (prefer using https://images.unsplash.com/...)",
      "rating": 4.5
    }
  ],
  "itinerary": {
    "days": [
      {
        "day": 1,
        "activities": [
          {
            "time": "09:00",
            "title": "Activity title",
            "description": "Activity description",
            "location": "Location name"
          }
        ]
      }
    ]
  }
}

Only include destinations or itinerary in JSON when specifically appropriate for the response.
`;

/**
 * Main chat handler function
 * @param message The user's message
 * @param history Previous chat history
 * @param userId Optional user ID for personalization
 * @returns ChatResponse object
 */
export async function chatHandler(
  message: string,
  history: ChatMessage[] = [],
  userId?: number | null
): Promise<ChatResponse> {
  // Determine if this is a destination recommendation or itinerary request
  const isDestinationRequest = /recommend|suggest|where|destination|place to visit/i.test(message);
  const isItineraryRequest = /itinerary|plan|schedule|agenda|what to do/i.test(message);
  
  // Format history for AI context
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  // Try to use OpenAI first
  if (process.env.OPENAI_API_KEY || process.env.OPENAI_KEY) {
    try {
      return await handleWithOpenAI(message, formattedHistory, isDestinationRequest, isItineraryRequest);
    } catch (error) {
      console.error("OpenAI error:", error);
      // Fall back to Gemini if available
      if (geminiClient) {
        return await handleWithGemini(message, formattedHistory, isDestinationRequest, isItineraryRequest);
      }
      throw error;
    }
  } 
  // Try Gemini if no OpenAI key
  else if (geminiClient) {
    try {
      return await handleWithGemini(message, formattedHistory, isDestinationRequest, isItineraryRequest);
    } catch (error) {
      console.error("Gemini error:", error);
      throw error;
    }
  } 
  // No API keys available
  else {
    return {
      message: "I'm sorry, I can't process your request at the moment. Please check your API configuration for OpenAI or Google Gemini.",
      suggestions: [
        "Try again later",
        "Check API settings",
        "Contact support"
      ]
    };
  }
}

/**
 * Handle chat with OpenAI
 */
async function handleWithOpenAI(
  message: string,
  formattedHistory: any[],
  isDestinationRequest: boolean,
  isItineraryRequest: boolean
): Promise<ChatResponse> {
  // Build messages array
  const messages = [
    { role: "system", content: TRAVEL_AGENT_PROMPT },
    ...formattedHistory,
    { role: "user", content: message }
  ];

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages as any,
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content || "{}";
  
  try {
    const parsedResponse = JSON.parse(content);
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing OpenAI JSON response:", error);
    return {
      message: content,
      suggestions: ["Can you tell me more about what you're looking for?"]
    };
  }
}

/**
 * Handle chat with Google Gemini
 */
async function handleWithGemini(
  message: string,
  formattedHistory: any[],
  isDestinationRequest: boolean,
  isItineraryRequest: boolean
): Promise<ChatResponse> {
  // Build prompt for Gemini
  let prompt = `${TRAVEL_AGENT_PROMPT}\n\n`;
  
  // Add chat history
  for (const msg of formattedHistory) {
    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
  }
  
  // Add current message
  prompt += `User: ${message}\n\nRespond with valid JSON only:`;

  const result = await geminiClient.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    // Extract JSON from response (Gemini might add text before/after JSON)
    const jsonMatch = text.match(/({[\s\S]*})/);
    if (jsonMatch && jsonMatch[0]) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      return parsedResponse;
    }
    
    // Fallback if no JSON detected
    return {
      message: text,
      suggestions: ["Can you tell me more about what you're looking for?"]
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return {
      message: text,
      suggestions: ["Can you tell me more about what you're looking for?"]
    };
  }
}

/**
 * Generate destination recommendations
 */
export async function generateDestinationRecommendations(
  preferences: {
    climate?: string;
    activities?: string[];
    budget?: string;
    duration?: string;
  }
): Promise<any[]> {
  const prompt = `
    Please recommend 5 travel destinations based on the following preferences:
    Climate: ${preferences.climate || 'Any'}
    Activities: ${preferences.activities?.join(', ') || 'Any'}
    Budget: ${preferences.budget || 'Any'}
    Duration: ${preferences.duration || 'Any'}
    
    Return a JSON array of destination objects with these properties:
    id, name, country, description, imageUrl (from Unsplash), and rating (1-5).
  `;
  
  try {
    const response = await chatHandler(prompt, []);
    return response.destinations || [];
  } catch (error) {
    console.error("Error generating destinations:", error);
    return [];
  }
}

/**
 * Generate a travel itinerary
 */
export async function generateItinerary(
  destination: string,
  days: number,
  preferences: {
    activities?: string[];
    pace?: "relaxed" | "balanced" | "intense";
    interests?: string[];
  }
): Promise<any> {
  const prompt = `
    Create a detailed ${days}-day itinerary for ${destination}.
    Pace: ${preferences.pace || 'balanced'}
    Activities: ${preferences.activities?.join(', ') || 'varied'}
    Interests: ${preferences.interests?.join(', ') || 'general'}
    
    For each day, provide a structured schedule with times, activity names, descriptions, and locations.
    Make recommendations for authentic local experiences, not just tourist spots.
    Return as JSON with an itinerary object containing a days array.
  `;
  
  try {
    const response = await chatHandler(prompt, []);
    return response.itinerary || null;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return null;
  }
}
