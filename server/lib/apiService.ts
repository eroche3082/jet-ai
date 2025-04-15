/**
 * API Service para JetAI
 * Este archivo contiene funciones para interactuar con diferentes APIs externas
 * como análisis de sentimiento, búsqueda de destinos, etc.
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile } from './conversationFlow';

// Inicializar clientes de APIs
let anthropicClient: Anthropic | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

try {
  // Inicializar Anthropic si API_KEY está disponible
  if (process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    console.log("Anthropic client initialized");
  }

  // Inicializar Gemini si API_KEY está disponible
  if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (error) {
  console.error("Error initializing AI clients:", error);
}

/**
 * Analiza texto con IA. Intenta usar Anthropic primero, luego Gemini como fallback.
 */
async function analyzeText(prompt: string, type: string): Promise<string> {
  try {
    // Intentar usar Anthropic Claude
    if (anthropicClient) {
      try {
        const message = await anthropicClient.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 1500,
          system: `You are an AI assistant for JetAI, a luxury travel platform. You are analyzing user input to help with ${type}.`,
          messages: [{ role: "user", content: prompt }]
        });
        
        // Extraer el texto de la respuesta
        return message.content[0].text;
      } catch (error) {
        console.error("Anthropic analysis error:", error);
        // Continuar con Gemini como fallback
      }
    }
    
    // Intentar usar Gemini como fallback
    if (geminiClient) {
      try {
        const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        });
        
        return result.response.text();
      } catch (error) {
        console.error("Gemini analysis error:", error);
      }
    }
    
    // If everything fails, return a generic message
    return "It was not possible to analyze the text at this time. Please try again later.";
  } catch (error) {
    console.error("Error analyzing text:", error);
    return "Error in text analysis.";
  }
}

/**
 * Analyzes the sentiment of the user's message
 */
export async function analyzeSentiment(profile: UserProfile): Promise<{
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
  confidence: number;
}> {
  try {
    // If there's no conversation history, return neutral
    if (!profile.conversationHistory || profile.conversationHistory.length === 0) {
      return { emotion: 'neutral', confidence: 1.0 };
    }
    
    // Get the last message from the user
    const lastUserMessage = [...profile.conversationHistory]
      .reverse()
      .find(msg => msg.role === 'user')?.content;
    
    if (!lastUserMessage) {
      return { emotion: 'neutral', confidence: 1.0 };
    }
    
    // Analyze sentiment with AI
    const prompt = `
      Analyze the sentiment in this message: "${lastUserMessage}"
      
      Respond with a JSON object containing:
      1. emotion: One of ["happy", "sad", "angry", "neutral", "excited", "confused"]
      2. confidence: A number between 0 and 1 indicating confidence
      
      JSON only, no explanation.
    `;
    
    const response = await analyzeText(prompt, "sentiment analysis");
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/({[\s\S]*})/);
      let result: { emotion: any, confidence: number };
      
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        // If we can't extract the JSON, try to parse the entire response
        result = JSON.parse(response);
      }
      
      // Validate and ensure that emotion is one of the allowed values
      const validEmotions = ['happy', 'sad', 'angry', 'neutral', 'excited', 'confused'];
      const emotion = validEmotions.includes(result.emotion) ? 
        result.emotion as 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' : 
        'neutral';
      
      // Ensure that confidence is a number between 0 and 1
      const confidence = Math.max(0, Math.min(1, result.confidence || 0.5));
      
      return { emotion, confidence };
    } catch (error) {
      console.error("Error parsing sentiment response:", error);
      console.log("Raw sentiment response:", response);
      return { emotion: 'neutral', confidence: 0.5 };
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return { emotion: 'neutral', confidence: 0.5 };
  }
}

/**
 * Activates the relevant APIs based on the user's profile
 */
export async function triggerAPIs(profile: UserProfile): Promise<any[]> {
  const results = [];
  
  try {
    // If we have a destination, search for information about it
    if (profile.destination) {
      try {
        const destinationPrompt = `
          Provide brief but comprehensive travel information about ${profile.destination}.
          Include:
          - Best time to visit
          - Local currency
          - Language spoken
          - 2-3 must-see attractions
          - Weather details for different seasons
          - Local transportation options
          Format as concise markdown with headings.
        `;
        
        const destinationInfo = await analyzeText(destinationPrompt, "destination research");
        
        results.push({
          type: 'destination_info',
          success: true,
          data: destinationInfo
        });
      } catch (error) {
        console.error("Error fetching destination info:", error);
        results.push({
          type: 'destination_info',
          success: false,
          error: "Unable to obtain destination information"
        });
      }
    }
    
    // Here you could add more API calls:
    // - Weather
    // - Local currency and exchange rates
    // - Tourist attractions
    // - Available flights
    // - Recommended accommodations
    
    return results;
  } catch (error) {
    console.error("Error triggering APIs:", error);
    return results;
  }
}