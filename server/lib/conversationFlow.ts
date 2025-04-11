/**
 * Servidor de flujo de conversación para JetAI
 * Este archivo maneja la lógica del flujo de conversación en el servidor,
 * procesando las respuestas del usuario y generando la siguiente pregunta.
 */

import { analyzeSentiment, triggerAPIs } from './apiService';
import { FormData, generateItinerary } from './itineraryGenerator';

// Etapas de la conversación
export enum ConversationStage {
  GREETING,
  ASK_NAME_EMAIL,
  ASK_DESTINATION,
  ASK_BUDGET,
  ASK_DATES,
  ASK_TRAVELERS,
  ASK_INTERESTS,
  ITINERARY_REQUEST,
  GENERAL
}

// Información de perfil de usuario
export interface UserProfile extends FormData {
  currentStage: ConversationStage;
  language?: string;
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

// Preguntas predefinidas para cada etapa de la conversación
export const STAGE_QUESTIONS: Record<ConversationStage, string> = {
  [ConversationStage.GREETING]: "🛫 Welcome aboard JetAI, your personal AI-powered concierge. Before we begin planning your unforgettable journey, may I have your name and email?",
  [ConversationStage.ASK_NAME_EMAIL]: "Before we begin planning your unforgettable journey, may I have your name and email?",
  [ConversationStage.ASK_DESTINATION]: "Thank you! Now, where would you like to travel to? You can specify a city, country, or region.",
  [ConversationStage.ASK_BUDGET]: "Excellent choice! What's your approximate budget for this trip?",
  [ConversationStage.ASK_DATES]: "When are you planning to travel? You can be specific or general (e.g., 'July 2025' or 'next weekend').",
  [ConversationStage.ASK_TRAVELERS]: "How many people will be traveling? Will you be traveling with children or have any special needs?",
  [ConversationStage.ASK_INTERESTS]: "What activities or experiences interest you for this trip? (e.g., cuisine, culture, adventure, relaxation...)",
  [ConversationStage.ITINERARY_REQUEST]: "Great! Based on your preferences, would you like me to prepare a personalized itinerary?",
  [ConversationStage.GENERAL]: "Is there anything else you'd like to know about your trip?"
};

/**
 * Detecta si un mensaje es un saludo
 */
export function isGreeting(text: string): boolean {
  const greetings = [
    // Inglés
    "hi", "hello", "hey", "howdy", "hiya", "good morning", "good afternoon", "good evening", "what's up", "sup",
    // Español
    "hola", "buenos días", "buenas tardes", "buenas noches", "qué tal", "cómo estás",
    // Francés
    "bonjour", "salut", "bonsoir", "ça va",
    // Alemán
    "hallo", "guten tag", "guten morgen", "guten abend",
    // Italiano
    "ciao", "buongiorno", "buonasera", "salve",
    // Portugués
    "olá", "bom dia", "boa tarde", "boa noite",
  ];

  const lowercaseText = text.toLowerCase().trim();
  
  return greetings.some(greeting => 
    lowercaseText === greeting || 
    lowercaseText.startsWith(`${greeting} `) ||
    lowercaseText.startsWith(`${greeting},`)
  );
}

/**
 * Extrae nombre y email del mensaje del usuario
 */
export function extractNameAndEmail(text: string): { name?: string, email?: string } {
  const result: { name?: string, email?: string } = {};

  // Buscar email
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const emailMatch = text.match(emailPattern);
  if (emailMatch) {
    result.email = emailMatch[0];
  }

  // Buscar nombre - esto es una aproximación simple
  // Si no hay email, asumimos que todo el texto podría ser el nombre
  if (!result.email && text.trim().length > 0) {
    result.name = text.trim();
    return result;
  }

  // Si hay email, intentamos extraer el nombre de lo que queda
  if (result.email) {
    const namePattern = /(?:(?:I am|my name is|I'm|call me|this is)\s+)([A-Za-z\s]+)(?:\s+and|,|\.|$)/i;
    const nameMatch = text.match(namePattern);
    if (nameMatch && nameMatch[1]) {
      result.name = nameMatch[1].trim();
    } else {
      // Si no encontramos un patrón claro, tomamos el texto antes del email
      const textBeforeEmail = text.split(result.email)[0].trim();
      if (textBeforeEmail && textBeforeEmail.length > 0 && textBeforeEmail.length < 30) {
        result.name = textBeforeEmail.replace(/^\W+|\W+$/, ''); // Elimina símbolos al inicio y final
      }
    }
  }

  return result;
}

/**
 * Actualiza el perfil de usuario basado en la etapa actual y la entrada del usuario
 */
export function updateUserProfile(
  stage: ConversationStage,
  userInput: string,
  currentProfile: UserProfile
): UserProfile {
  // Clonar el perfil actual
  const updatedProfile: UserProfile = { ...currentProfile };
  
  switch (stage) {
    case ConversationStage.GREETING:
    case ConversationStage.ASK_NAME_EMAIL:
      const nameEmail = extractNameAndEmail(userInput);
      if (nameEmail.name) updatedProfile.name = nameEmail.name;
      if (nameEmail.email) updatedProfile.email = nameEmail.email;
      break;
      
    case ConversationStage.ASK_DESTINATION:
      if (!isGreeting(userInput)) {
        updatedProfile.destination = userInput;
      }
      break;
      
    case ConversationStage.ASK_BUDGET:
      updatedProfile.budget = userInput;
      break;
      
    case ConversationStage.ASK_DATES:
      updatedProfile.dates = userInput;
      break;
      
    case ConversationStage.ASK_TRAVELERS:
      updatedProfile.travelers = userInput;
      break;
      
    case ConversationStage.ASK_INTERESTS:
      updatedProfile.interests = userInput;
      break;
      
    case ConversationStage.ITINERARY_REQUEST:
      updatedProfile.confirmation = userInput;
      break;
      
    default:
      // Para otras etapas, no actualizamos campos específicos
      break;
  }
  
  return updatedProfile;
}

/**
 * Determina la siguiente etapa basada en la etapa actual y la entrada del usuario
 */
export function determineNextStage(
  currentStage: ConversationStage,
  userInput: string,
  profile: UserProfile
): ConversationStage {
  // Si el usuario está saludando (excepto en la primera interacción), reiniciar
  if (currentStage !== ConversationStage.GREETING && isGreeting(userInput)) {
    return ConversationStage.GREETING;
  }
  
  switch (currentStage) {
    case ConversationStage.GREETING:
      return ConversationStage.ASK_DESTINATION;
      
    case ConversationStage.ASK_NAME_EMAIL:
      if (profile.name || profile.email) {
        return ConversationStage.ASK_DESTINATION;
      }
      return ConversationStage.ASK_NAME_EMAIL;
      
    case ConversationStage.ASK_DESTINATION:
      if (profile.destination) {
        return ConversationStage.ASK_BUDGET;
      }
      return ConversationStage.ASK_DESTINATION;
      
    case ConversationStage.ASK_BUDGET:
      return ConversationStage.ASK_DATES;
      
    case ConversationStage.ASK_DATES:
      return ConversationStage.ASK_TRAVELERS;
      
    case ConversationStage.ASK_TRAVELERS:
      return ConversationStage.ASK_INTERESTS;
      
    case ConversationStage.ASK_INTERESTS:
      return ConversationStage.ITINERARY_REQUEST;
      
    case ConversationStage.ITINERARY_REQUEST:
      // Si la respuesta es afirmativa, generamos un itinerario
      const affirmativeResponse = /yes|yeah|sure|ok|please|go ahead|absolutely|definitely|i'd like that|sounds good/i.test(userInput);
      
      // Si es afirmativa, llamamos a la función para generar itinerario
      if (affirmativeResponse) {
        // En una implementación real, aquí se triggerea el proceso de generación
        // Por ahora pasamos directamente a GENERAL
        return ConversationStage.GENERAL;
      } else {
        // Si la respuesta es negativa, pasamos a conversación general
        return ConversationStage.GENERAL;
      }
      
    default:
      return ConversationStage.GENERAL;
  }
}

/**
 * Genera un resumen del perfil de usuario para mostrar
 */
export function getUserProfileSummary(profile: UserProfile): string {
  const parts: string[] = [];
  
  if (profile.name) {
    parts.push(`👤 **Name:** ${profile.name}`);
  }
  
  if (profile.destination) {
    parts.push(`📍 **Destination:** ${profile.destination}`);
  }
  
  if (profile.budget) {
    parts.push(`💰 **Budget:** ${profile.budget}`);
  }
  
  if (profile.dates) {
    parts.push(`📅 **Dates:** ${profile.dates}`);
  }
  
  if (profile.travelers) {
    parts.push(`👥 **Travelers:** ${profile.travelers}`);
  }
  
  if (profile.interests) {
    parts.push(`🌟 **Interests:** ${profile.interests}`);
  }
  
  if (parts.length === 0) {
    return "";
  }
  
  return `### Your travel profile:\n${parts.join('\n')}`;
}

/**
 * Procesa el mensaje del usuario y genera una respuesta
 */
export async function processUserMessage(
  message: string,
  profile: UserProfile
): Promise<{
  response: string;
  updatedProfile: UserProfile;
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
}> {
  try {
    // Analizar el sentimiento
    const sentiment = await analyzeSentiment(profile);
    
    // Actualizar el perfil con la etapa actual y la entrada del usuario
    const updatedProfile = updateUserProfile(profile.currentStage, message, profile);
    
    // Determinar la siguiente etapa
    const nextStage = determineNextStage(profile.currentStage, message, updatedProfile);
    updatedProfile.currentStage = nextStage;
    
    // Generar respuesta según la etapa
    let response = STAGE_QUESTIONS[nextStage];
    
    // Agregar el resumen del perfil si estamos en ITINERARY_REQUEST
    if (nextStage === ConversationStage.ITINERARY_REQUEST) {
      const profileSummary = getUserProfileSummary(updatedProfile);
      if (profileSummary) {
        response = `${profileSummary}\n\n${response}`;
      }
    }
    
    // Agregar a la historia de la conversación
    if (!updatedProfile.conversationHistory) {
      updatedProfile.conversationHistory = [];
    }
    
    updatedProfile.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    updatedProfile.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    });
    
    // Actualizar la emoción detectada
    updatedProfile.emotion = sentiment.emotion;
    
    return {
      response,
      updatedProfile,
      emotion: sentiment.emotion
    };
  } catch (error) {
    console.error('Error processing user message:', error);
    return {
      response: "I'm sorry, but I'm having trouble processing your request. Could you try again?",
      updatedProfile: profile,
      emotion: 'neutral'
    };
  }
}

/**
 * Genera un itinerario basado en el perfil del usuario
 */
export async function generateUserItinerary(profile: UserProfile): Promise<string> {
  try {
    // Primero activamos las APIs relevantes
    const apiResponses = await triggerAPIs(profile);
    
    // Generamos el itinerario
    const itinerary = await generateItinerary(profile);
    
    // Formateamos el itinerario para mostrar en el chat
    let formattedItinerary = `# Your Personalized Itinerary for ${itinerary.destination}\n\n`;
    formattedItinerary += `**Travel Period:** ${itinerary.dateRange}\n`;
    formattedItinerary += `**Travelers:** ${itinerary.travelers}\n\n`;
    
    // Agregar días del itinerario
    itinerary.days.forEach(day => {
      formattedItinerary += `## Day ${day.day}\n\n`;
      
      day.activities.forEach(activity => {
        formattedItinerary += `**${activity.time}** - **${activity.activity}**\n`;
        formattedItinerary += `${activity.description}\n`;
        if (activity.location) {
          formattedItinerary += `Location: ${activity.location}\n`;
        }
        if (activity.cost) {
          formattedItinerary += `Approximate cost: ${activity.cost}\n`;
        }
        formattedItinerary += '\n';
      });
    });
    
    // Agregar notas adicionales si hay información de APIs
    if (apiResponses.length > 0 && apiResponses[0].success) {
      formattedItinerary += `\n## Additional Information\n\n`;
      formattedItinerary += `- Weather: The forecast for your trip shows typical temperatures between 20°C and 25°C with sunny conditions.\n`;
      formattedItinerary += `- Local Currency: Remember to exchange to the local currency or check if your cards are accepted at your destination.\n`;
      formattedItinerary += `- Safety: Your destination is generally safe for tourists. Always keep your valuables secure and be aware of your surroundings.\n`;
    }
    
    return formattedItinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return "I'm sorry, but I couldn't generate your itinerary at this time. Please try again later.";
  }
}