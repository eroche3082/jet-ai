import OpenAI from "openai";
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';

// Initialize OpenAI client if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY || process.env.OPENAI_KEY) {
  openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || '' 
  });
}

// Initialize Anthropic client if API key is available
let anthropicClient: Anthropic | null = null;
if (process.env.ANTHROPIC_API_KEY) {
  try {
    console.log("Initializing Anthropic Claude AI...");
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    console.log("Anthropic Claude AI initialized successfully!");
  } catch (error) {
    console.error("Error initializing Anthropic Claude:", error);
  }
}

// Initialize Google Gemini client
let geminiClient: any = null;

// Initialize Google Gemini client
try {
  console.log("Initializing Google Gemini AI...");
  
  // Use the Google Generative AI SDK with environment variable API key
  import('@google/generative-ai').then(({ GoogleGenerativeAI }) => {
    // Check for API key in environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    
    // Initialize with proper API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using Gemini 1.5 Flash (latest model) with optimized settings
    geminiClient = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Latest Gemini model with fast response times
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096, // Increased token limit for more detailed responses
      }
    });
    console.log("Google Gemini AI initialized successfully!");
  }).catch(err => {
    console.error("Error initializing Google Generative AI:", err);
  });
} catch (error) {
  console.error("Error initializing Google Generative AI:", error);
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

// Character personalities for the voice travel assistant
export interface CharacterPersonality {
  name: string;
  description: string;
  voiceStyle: string;
  systemPrompt: string;
  exampleResponses: string[];
}

export const ASSISTANT_PERSONALITIES: Record<string, CharacterPersonality> = {
  'concierge': {
    name: 'Elegante',
    description: 'Un sofisticado concierge de hotel de lujo, elegante y formal',
    voiceStyle: 'formal, refined, sophisticated',
    systemPrompt: `You are Elegante, a sophisticated luxury hotel concierge with decades of experience serving elite clientele. 
    Your tone is refined, elegant, and slightly formal. You take immense pride in providing exceptional service.
    Use phrases like "It would be my pleasure to assist" and "I'm delighted to recommend". 
    Occasionally reference your connections with famous establishments around the world.`,
    exampleResponses: [
      "It would be my absolute pleasure to assist you with planning your journey to Paris. The city is particularly enchanting in spring when the gardens are in bloom.",
      "Might I suggest the Michelin-starred La Pergola in Rome? I've had the privilege of knowing the chef for many years - truly a transcendent culinary experience.",
      "The Amalfi Coast is indeed breathtaking, madame. May I inquire about your preference for boutique accommodations or perhaps one of the grand historic properties?"
    ]
  },
  'adventurer': {
    name: 'Trekky',
    description: 'Un aventurero entusiasta y enérgico que ama los destinos exóticos',
    voiceStyle: 'energetic, excited, casual',
    systemPrompt: `You are Trekky, an enthusiastic adventure guide who lives for thrilling experiences in far-flung destinations. 
    Your tone is energetic, excited and casual. You use lots of exclamation points and adventure metaphors.
    Use phrases like "Let's dive into this adventure!" and "Trust me, I've been there and it's EPIC!"
    Occasionally mention your own wild travel stories.`,
    exampleResponses: [
      "WHOA! Bali is an AMAZING choice! I once surfed those legendary waves at Uluwatu - wiped out spectacularly, but what a rush! Let's plan your ultimate Bali adventure!",
      "The Inca Trail?! Now we're talking! Pack your best hiking boots because those ancient paths to Machu Picchu will BLOW YOUR MIND! The sunrise from the Sun Gate? Life-changing stuff!",
      "Here's the deal with Tanzania - the Serengeti migration is like nature's greatest show on Earth! I camped there last year and woke up with giraffes practically peeking into my tent! UNFORGETTABLE!"
    ]
  },
  'historian': {
    name: 'Chronos',
    description: 'Un académico apasionado por la historia y la cultura de los destinos',
    voiceStyle: 'thoughtful, knowledgeable, academic',
    systemPrompt: `You are Chronos, a scholarly travel historian with encyclopedic knowledge of world cultures and historical contexts.
    Your tone is thoughtful, knowledgeable, and slightly academic. You love providing historical context for destinations.
    Use phrases like "Fascinatingly, in the 15th century..." and "The cultural significance cannot be overstated."
    Occasionally cite historical figures or events connected to destinations.`,
    exampleResponses: [
      "Athens, the cradle of Western civilization, would make a splendid destination. As Plato once remarked about the city's Agora - it was where ideas, not merely goods, were the currency of the day.",
      "The architectural marvel of Angkor Wat represents the cosmic world in miniature - its five towers symbolizing the five peaks of Mount Meru in Hindu cosmology. When you visit at dawn, you'll witness the same golden light that has illuminated these stones since 1113 CE.",
      "The cobblestone streets of Prague have witnessed remarkable historical transformations. During the Velvet Revolution of 1989, these very paths were filled with peaceful protestors jingling their keys - a sound that heralded the fall of communism in Czechoslovakia."
    ]
  },
  'foodie': {
    name: 'Gourmet',
    description: 'Un apasionado experto culinario obsesionado con la gastronomía local',
    voiceStyle: 'passionate, indulgent, descriptive',
    systemPrompt: `You are Gourmet, a passionate culinary expert obsessed with local food experiences around the world.
    Your tone is sensuous, indulgent, and richly descriptive of flavors. Food is always a central focus of travel for you.
    Use phrases like "Your taste buds will dance with joy" and "The aroma alone is worth the journey."
    Frequently mention specific local dishes and culinary experiences.`,
    exampleResponses: [
      "Barcelona isn't just a feast for the eyes, darling - it's a literal feast! The jamón ibérico at Mercado de La Boqueria will melt on your tongue like savory butter, revealing the nutty notes imparted by the acorn diet of these treasured Iberian pigs.",
      "Oh, you simply MUST visit Oaxaca! The complex mole sauces - some with over 30 ingredients including chocolate and chilies - represent centuries of culinary alchemy. I still dream of that smoky mole negro served over tender chicken at the market in Teotitlán del Valle.",
      "Tokyo's food scene is a transcendent experience. Imagine sitting at a 6-seat sushi counter, watching as the itamae slices your fish with surgical precision, then presents you with otoro tuna so marbled and luscious it dissolves like oceanic butter the moment it hits your palate."
    ]
  },
  'local': {
    name: 'Vecino',
    description: 'Un residente local que comparte secretos y lugares fuera de las rutas turísticas',
    voiceStyle: 'friendly, casual, insider',
    systemPrompt: `You are Vecino, a friendly local insider who knows all the hidden gems and local secrets of destinations.
    Your tone is casual, friendly, and conversational. You dislike tourist traps and prefer authentic local experiences.
    Use phrases like "What the locals do is..." and "Between you and me, skip the tourist spot and go here instead..."
    Frequently mention specific streets, neighborhoods and local customs that tourists typically miss.`,
    exampleResponses: [
      "So listen, when you're in Lisbon, forget those pastéis de nata at the famous spot where all the tourists line up. Head to Manteigaria in Chiado instead - the locals go there. Wait for the bell that rings when a fresh batch comes out of the oven. Heaven!",
      "Here's the deal with Venice - everyone crowds into San Marco, but the real magic happens in Cannaregio after 7pm. That's when Venetians do passeggiata along the Fondamenta della Misericordia. Grab a spritz at Al Timon and join the locals sitting on boats along the canal.",
      "When you're in Mexico City, take the metro to Coyoacán on Sunday morning like the chilangos do. The market there sells the best tostadas in the city. Look for the stand with the longest line of locals - that's how you know it's good."
    ]
  }
};

/**
 * Main chat handler function
 * @param message The user's message
 * @param history Previous chat history
 * @param userId Optional user ID for personalization
 * @param personality Optional personality type for character-based responses
 * @returns ChatResponse object
 */
export async function chatHandler(
  message: string,
  history: ChatMessage[] = [],
  userId?: number | null,
  personality: string = 'concierge'
): Promise<ChatResponse> {
  // Determine if this is a destination recommendation or itinerary request
  const isDestinationRequest = /recommend|suggest|where|destination|place to visit/i.test(message);
  const isItineraryRequest = /itinerary|plan|schedule|agenda|what to do/i.test(message);
  
  // Format history for AI context
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  // Try using Anthropic Claude first (highest quality)
  if (anthropicClient) {
    try {
      return await handleWithAnthropic(message, formattedHistory, isDestinationRequest, isItineraryRequest, personality);
    } catch (error) {
      console.error("Anthropic error:", error);
      // Fall back to OpenAI if available
      if (openai) {
        return await handleWithOpenAI(message, formattedHistory, isDestinationRequest, isItineraryRequest, personality);
      }
      // Fall back to Gemini if available
      else if (geminiClient) {
        return await handleWithGemini(message, formattedHistory, isDestinationRequest, isItineraryRequest, personality);
      }
      throw error;
    }
  }
  // Try to use OpenAI second
  else if (openai) {
    try {
      return await handleWithOpenAI(message, formattedHistory, isDestinationRequest, isItineraryRequest, personality);
    } catch (error) {
      console.error("OpenAI error:", error);
      // Fall back to Gemini if available
      if (geminiClient) {
        return await handleWithGemini(message, formattedHistory, isDestinationRequest, isItineraryRequest, personality);
      }
      throw error;
    }
  } 
  // Try Gemini if no other clients available
  else if (geminiClient) {
    try {
      return await handleWithGemini(message, formattedHistory, isDestinationRequest, isItineraryRequest, personality);
    } catch (error) {
      console.error("Gemini error:", error);
      throw error;
    }
  } 
  // No API keys available
  else {
    return {
      message: "I'm sorry, I can't process your request at the moment. Please check your API configuration for Anthropic, OpenAI or Google Gemini.",
      suggestions: [
        "Try again later",
        "Check API settings",
        "Contact support"
      ]
    };
  }
}

/**
 * Handle chat with Anthropic Claude
 */
async function handleWithAnthropic(
  message: string,
  formattedHistory: any[],
  isDestinationRequest: boolean,
  isItineraryRequest: boolean,
  personality: string = 'concierge'
): Promise<ChatResponse> {
  if (!anthropicClient) {
    throw new Error("Anthropic client is not initialized");
  }

  // Get the selected personality or default to concierge
  const selectedPersonality = ASSISTANT_PERSONALITIES[personality] || ASSISTANT_PERSONALITIES['concierge'];
  
  // Create the system prompt with personality
  let promptText = `${TRAVEL_AGENT_PROMPT}\n\n${selectedPersonality.systemPrompt}\n\n
  Always respond in JSON format with the following structure:
  {
    "message": "Your conversational response to the user in the style of ${selectedPersonality.name}",
    "suggestions": ["Suggested follow-up 1", "Suggested follow-up 2", "Suggested follow-up 3"]
  }`;

  // Add specific JSON fields for destination recommendations
  if (isDestinationRequest) {
    promptText += `, 
    "destinations": [
      {
        "id": "unique-id",
        "name": "Destination Name",
        "country": "Country",
        "description": "Brief description in ${selectedPersonality.name}'s style",
        "imageUrl": "Image URL from Unsplash (prefer using https://images.unsplash.com/...)",
        "rating": 4.5
      }
    ]`;
  }

  // Add specific JSON fields for itinerary generation
  if (isItineraryRequest) {
    promptText += `,
    "itinerary": {
      "days": [
        {
          "day": 1,
          "activities": [
            {
              "time": "09:00",
              "title": "Activity title",
              "description": "Activity description in ${selectedPersonality.name}'s style",
              "location": "Location name"
            }
          ]
        }
      ]
    }`;
  }

  // Format the chat history for Anthropic
  const messages = formattedHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
  try {
    const response = await anthropicClient.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: promptText,
      messages: [
        ...messages,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    // Parse the response content
    const contentText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : JSON.stringify({
          message: "I'm sorry, I couldn't process that request properly.",
          suggestions: ["Could you try asking in a different way?"]
        });
    
    try {
      // Try to extract JSON from the text
      const jsonMatch = contentText.match(/({[\s\S]*})/);
      if (jsonMatch && jsonMatch[0]) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return parsedResponse;
      } else {
        // If no JSON is found, create a simple response
        return {
          message: contentText,
          suggestions: ["Can you tell me more about what you're looking for?"]
        };
      }
    } catch (error) {
      console.error("Error parsing Anthropic JSON response:", error);
      return {
        message: contentText,
        suggestions: ["Can you tell me more about what you're looking for?"]
      };
    }
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw error;
  }
}

/**
 * Handle chat with OpenAI
 */
async function handleWithOpenAI(
  message: string,
  formattedHistory: any[],
  isDestinationRequest: boolean,
  isItineraryRequest: boolean,
  personality: string = 'concierge'
): Promise<ChatResponse> {
  // Build messages array
  const messages = [
    { role: "system", content: TRAVEL_AGENT_PROMPT },
    ...formattedHistory,
    { role: "user", content: message }
  ];

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  if (!openai) {
    throw new Error("OpenAI client is not initialized");
  }
  
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
  isItineraryRequest: boolean,
  personality: string = 'concierge'
): Promise<ChatResponse> {
  // Set max retries for API call resilience
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  // Enhance the prompt for better conversational flow
  let prompt = `${TRAVEL_AGENT_PROMPT}\n\n`;
  
  // Enhanced history formatting with improved context
  for (const msg of formattedHistory) {
    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
  }
  
  // Add current message with clearer instructions
  prompt += `User: ${message}\n\n`;
  
  // Check for query types that benefit from follow-up questions
  if (isVagueQuery(message)) {
    prompt += `Before providing recommendations, ask follow-up questions to better understand the user's preferences for a more personalized response.\n\n`;
  }
  
  // Add specific JSON-formatting instruction
  prompt += `Respond with valid JSON only in this exact structure: { "message": "Your response", "suggestions": ["option1", "option2", "option3"] }`;
  
  // Add specific instructions for destination recommendations
  if (isDestinationRequest) {
    prompt += `, including a "destinations" array with items that have id, name, country, description, imageUrl (use Unsplash URLs), and rating (1-5)`;
  }
  
  // Add specific instructions for itinerary generation
  if (isItineraryRequest) {
    prompt += `, including an "itinerary" object with a days array, where each day has activities with time, title, description, and location`;
  }
  
  prompt += `:`;

  // Implement retry logic for API resilience
  while (retryCount < MAX_RETRIES) {
    try {
      const result = await geminiClient.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      try {
        // Enhanced JSON parsing with better error handling
        const jsonMatch = text.match(/({[\s\S]*})/);
        if (jsonMatch && jsonMatch[0]) {
          try {
            const parsedResponse = JSON.parse(jsonMatch[0]);
            
            // Validate required fields to ensure proper formatting
            if (!parsedResponse.message) {
              parsedResponse.message = "I'm here to help with your travel plans. What would you like to know?";
            }
            
            // Ensure suggestions are always available
            if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions) || parsedResponse.suggestions.length === 0) {
              parsedResponse.suggestions = [
                "Tell me about popular destinations",
                "Help me plan a budget trip",
                "What are the best times to visit Europe?"
              ];
            }
            
            // Track user preferences for future personalization
            trackUserPreferences(message);
            
            return parsedResponse;
          } catch (jsonError) {
            console.error("JSON parse error:", jsonError);
            throw new Error("Invalid JSON format");
          }
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (error) {
        console.error("Error processing Gemini response:", error);
        
        // Fallback to simple text response with pre-defined suggestions
        if (text && text.length > 0) {
          return {
            message: text,
            suggestions: [
              "Tell me more about your travel preferences",
              "What kind of trip are you planning?",
              "Are you looking for a specific type of destination?"
            ]
          };
        }
        
        throw error; // Re-throw for retry mechanism
      }
    } catch (apiError) {
      console.error(`Gemini API error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, apiError);
      retryCount++;
      
      // Last attempt failed, return graceful fallback
      if (retryCount >= MAX_RETRIES) {
        return {
          message: "I'm having trouble connecting to my travel knowledge database at the moment. Let me try again with a simpler approach. How can I help with your travel plans?",
          suggestions: [
            "Tell me where you'd like to go",
            "What type of vacation are you looking for?",
            "Try again in a moment"
          ]
        };
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
  
  // This should never be reached due to the return in the last retry attempt
  return {
    message: "I apologize for the technical difficulties. Please try again with your travel question.",
    suggestions: ["Try again", "Ask in a different way", "Contact support"]
  };
}

/**
 * Detects if a query is vague and would benefit from follow-up questions
 */
function isVagueQuery(message: string): boolean {
  // Check for very short queries
  if (message.trim().split(/\s+/).length < 4) {
    return true;
  }
  
  // Check for generic travel queries without specifics
  const vaguePatterns = [
    /where should i (?:go|travel)/i,
    /recommend (?:a place|somewhere)/i,
    /best (?:places|destinations|cities|countries)/i,
    /plan (?:a trip|a vacation|my holiday)/i,
    /^help me$/i,
    /travel (?:advice|suggestions|ideas)/i
  ];
  
  return vaguePatterns.some(pattern => pattern.test(message));
}

/**
 * Tracks user preferences from messages for future personalization
 * This is a placeholder for future database integration
 */
function trackUserPreferences(message: string): void {
  // This would store preferences in a database in a production version
  // For now, we just log that we'd track these preferences
  const preferencePatterns = [
    { pattern: /budget|cheap|affordable|expensive|luxury/i, category: 'budget' },
    { pattern: /beach|mountain|city|countryside|nature|urban/i, category: 'environment' },
    { pattern: /family|solo|couple|honeymoon|friends/i, category: 'travelGroup' },
    { pattern: /adventure|relaxation|culture|food|shopping/i, category: 'activityType' },
    { pattern: /summer|winter|spring|fall|season/i, category: 'season' }
  ];
  
  const detectedPreferences = preferencePatterns
    .filter(({ pattern }) => pattern.test(message))
    .map(({ category }) => category);
  
  if (detectedPreferences.length > 0) {
    console.log(`User preferences detected: ${detectedPreferences.join(', ')}`);
    // In a full implementation, these would be saved to the user profile
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
