/**
 * API Service para JetAI
 * Este archivo contiene funciones para interactuar con diferentes APIs externas
 * como análisis de sentimiento, búsqueda de destinos, etc.
 */

import Anthropic from '@anthropic-ai/sdk';
import { UserProfile } from './conversationFlow';
import { googleCloud } from './googlecloud';
// Esta función será implementada o reemplazada según sea necesario
async function analyzeText(prompt: string, type: string): Promise<string> {
  try {
    // En una implementación real, esto se conectaría con una API de IA
    // Por ahora, devolveremos respuestas genéricas para pruebas
    if (type === 'ai') {
      return `${prompt}\n\nThis is a placeholder response for AI text analysis.`;
    } else if (type === 'weather') {
      return `The weather is generally pleasant year-round. Pack for varying conditions.`;
    } else if (type === 'itinerary') {
      // Devolver un JSON simple para itinerario de prueba
      return JSON.stringify({
        days: [
          {
            day: 1,
            activities: [
              {
                time: "9:00 AM",
                activity: "City Tour",
                description: "Explore the main attractions",
                location: "City Center",
                cost: "$30"
              },
              {
                time: "1:00 PM",
                activity: "Lunch",
                description: "Enjoy local cuisine",
                location: "Old Town Restaurant",
                cost: "$15-25"
              }
            ]
          }
        ],
        additionalInfo: {
          weather: "Generally sunny, pack sunscreen",
          localCurrency: "Local currency is accepted everywhere",
          safetyTips: "The area is generally safe for tourists",
          customTips: ["Learn a few local phrases", "Try the local specialty dishes"]
        }
      });
    }
    
    return "No specific analysis available for this query type.";
  } catch (error) {
    console.error('Error in analyzeText:', error);
    return "Error processing text analysis request.";
  }
};

// Initialize Anthropic client if API key is available
let anthropicClient: Anthropic | null = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  console.log('Anthropic client initialized');
} else {
  console.log('ANTHROPIC_API_KEY not found, Anthropic features will be disabled');
}

/**
 * Analiza el sentimiento del mensaje del usuario
 */
export async function analyzeSentiment(profile: UserProfile): Promise<{
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
  score: number;
}> {
  try {
    // Si tenemos Anthropic configurado, usamos su API para un análisis más sofisticado
    if (anthropicClient) {
      // Extraer el último mensaje del usuario si hay historial
      const lastUserMessage = profile.conversationHistory?.findLast(
        (msg) => msg.role === 'user'
      )?.content || '';

      const response = await anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        system: "You are a sentiment analysis expert. Analyze the emotional tone of the user's message and categorize it as 'happy', 'sad', 'angry', 'confused', 'excited', or 'neutral'. Provide only a JSON object with 'emotion' and 'score' (0-1) keys.",
        messages: [
          { role: 'user', content: lastUserMessage || 'Hello' }
        ],
      });

      // Intentar extraer JSON de la respuesta
      const content = response.content[0].text;
      try {
        const result = JSON.parse(content);
        return {
          emotion: result.emotion || 'neutral',
          score: result.score || 0.5
        };
      } catch (e) {
        console.error('Could not parse sentiment JSON:', content);
        return { emotion: 'neutral', score: 0.5 };
      }
    } else {
      // Fallback a un análisis más simple con Google NLP si está disponible
      try {
        // Extraer el último mensaje del usuario si hay historial
        const lastUserMessage = profile.conversationHistory?.findLast(
          (msg) => msg.role === 'user'
        )?.content || '';

        if (process.env.GOOGLE_NATURAL_LANGUAGE_API_KEY) {
          const result = await googleCloud.naturalLanguage.analyzeSentiment(lastUserMessage);
          // Mapear el score a una emoción
          let emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' = 'neutral';
          
          if (result.score > 0.5) emotion = 'happy';
          else if (result.score > 0.8) emotion = 'excited';
          else if (result.score < -0.5) emotion = 'sad';
          else if (result.score < -0.8) emotion = 'angry';
          
          return {
            emotion,
            score: (result.score + 1) / 2 // Normalizar de [-1,1] a [0,1]
          };
        }
      } catch (error) {
        console.error('Error using Google NLP for sentiment:', error);
      }
      
      // Fallback a un análisis basado en reglas simples
      const text = profile.conversationHistory?.findLast(
        (msg) => msg.role === 'user'
      )?.content?.toLowerCase() || '';
      
      // Patrones emocionales simples
      const happyPatterns = ['happy', 'glad', 'great', 'good', 'excellent', 'fantastic', 'wonderful'];
      const sadPatterns = ['sad', 'unhappy', 'disappointed', 'sorry', 'unfortunately'];
      const angryPatterns = ['angry', 'annoyed', 'frustrated', 'terrible', 'worst', 'bad', 'hate'];
      const excitedPatterns = ['excited', 'amazing', 'wow', 'awesome', 'incredible', 'love', 'can\'t wait'];
      const confusedPatterns = ['confused', 'unsure', 'not sure', 'don\'t understand', 'what do you mean'];
      
      // Verificar patrones
      if (happyPatterns.some(pattern => text.includes(pattern))) {
        return { emotion: 'happy', score: 0.8 };
      }
      
      if (sadPatterns.some(pattern => text.includes(pattern))) {
        return { emotion: 'sad', score: 0.3 };
      }
      
      if (angryPatterns.some(pattern => text.includes(pattern))) {
        return { emotion: 'angry', score: 0.2 };
      }
      
      if (excitedPatterns.some(pattern => text.includes(pattern))) {
        return { emotion: 'excited', score: 0.9 };
      }
      
      if (confusedPatterns.some(pattern => text.includes(pattern))) {
        return { emotion: 'confused', score: 0.4 };
      }
      
      // Signos de exclamación para entusiasmo
      if (text.includes('!') && !text.includes('?')) {
        return { emotion: 'excited', score: 0.7 };
      }
      
      // Por defecto, neutral
      return { emotion: 'neutral', score: 0.5 };
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { emotion: 'neutral', score: 0.5 };
  }
}

/**
 * Activa las APIs relevantes según el perfil del usuario
 */
export async function triggerAPIs(profile: UserProfile): Promise<any[]> {
  const results = [];
  
  // Si el perfil tiene destino, podemos buscar información sobre ese destino
  if (profile.destination) {
    try {
      // Buscar información general sobre el destino
      const destinationInfo = await analyzeText(
        `Provide a brief overview of ${profile.destination} as a travel destination, including climate, culture, and top attractions.`,
        'ai'
      );
      
      results.push({
        type: 'destination_info',
        success: true,
        data: destinationInfo
      });
    } catch (error) {
      console.error(`Error fetching destination info for ${profile.destination}:`, error);
      results.push({
        type: 'destination_info',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Si el perfil tiene fechas, podemos buscar información de clima
  if (profile.destination && profile.dates) {
    try {
      // Podríamos integrar una API de clima real aquí
      const weatherInfo = await analyzeText(
        `What's the typical weather in ${profile.destination} during ${profile.dates}?`,
        'weather'
      );
      
      results.push({
        type: 'weather_info',
        success: true,
        data: weatherInfo
      });
    } catch (error) {
      console.error(`Error fetching weather info for ${profile.destination}:`, error);
      results.push({
        type: 'weather_info',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}