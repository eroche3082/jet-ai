/**
 * Servidor de flujo de conversación para JetAI
 * Este archivo maneja la lógica del flujo de conversación en el servidor,
 * procesando las respuestas del usuario y generando la siguiente pregunta.
 */

import { analyzeSentiment, triggerAPIs } from './apiService';

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

// Interfaz del perfil de usuario
export interface UserProfile {
  currentStage: ConversationStage;
  name?: string;
  email?: string;
  destination?: string;
  budget?: string;
  dates?: string;
  travelers?: string;
  interests?: string;
  confirmation?: string;
  language?: string;
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

// Preguntas para cada etapa
export const STAGE_QUESTIONS: Record<ConversationStage, string> = {
  [ConversationStage.GREETING]: "👋 ¡Hola! Soy JetAI, tu asistente de viajes personal. Estoy aquí para ayudarte a planificar tu próxima aventura. ¿Cómo puedo ayudarte hoy?",
  [ConversationStage.ASK_NAME_EMAIL]: "Para personalizar mejor tu experiencia, ¿podrías compartir tu nombre y email?",
  [ConversationStage.ASK_DESTINATION]: "¡Excelente! ¿A dónde te gustaría viajar?",
  [ConversationStage.ASK_BUDGET]: "¿Cuál es tu presupuesto aproximado para este viaje?",
  [ConversationStage.ASK_DATES]: "¿En qué fechas estás considerando viajar?",
  [ConversationStage.ASK_TRAVELERS]: "¿Con quién viajarás? ¿Solo, en pareja, familia o amigos?",
  [ConversationStage.ASK_INTERESTS]: "¿Qué tipo de actividades o experiencias te interesan para este viaje? (Por ejemplo: cultura, gastronomía, aventura, relax, etc.)",
  [ConversationStage.ITINERARY_REQUEST]: "¡Gracias por toda la información! ¿Te gustaría que te genere un itinerario personalizado basado en tus preferencias?",
  [ConversationStage.GENERAL]: "¿Hay algo más en lo que pueda ayudarte con respecto a tu viaje?"
};

/**
 * Detecta si un mensaje es un saludo
 */
export function isGreeting(text: string): boolean {
  const greetings = [
    'hola', 'hello', 'hi', 'hey', 'buenos días', 'buenas tardes', 'buenas noches',
    'good morning', 'good afternoon', 'good evening', 'saludos', 'greetings',
    'qué tal', 'cómo estás', 'how are you'
  ];
  
  const lowerText = text.toLowerCase();
  return greetings.some(greeting => lowerText.includes(greeting));
}

/**
 * Extrae nombre y email del mensaje del usuario
 */
export function extractNameAndEmail(text: string): { name?: string, email?: string } {
  const result: { name?: string, email?: string } = {};
  
  // Extraer email usando una expresión regular
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  
  if (emailMatch) {
    result.email = emailMatch[0];
  }
  
  // Intentar extraer el nombre (esto es una aproximación simplificada)
  // Buscamos patrones comunes como "Me llamo [nombre]" o "Mi nombre es [nombre]"
  const namePatterns = [
    /me llamo ([A-Za-zÀ-ÿ\s]+)(?:,|\.|y|$)/i,
    /mi nombre es ([A-Za-zÀ-ÿ\s]+)(?:,|\.|y|$)/i,
    /soy ([A-Za-zÀ-ÿ\s]+)(?:,|\.|y|$)/i,
    /my name is ([A-Za-z\s]+)(?:,|\.|and|$)/i,
    /i am ([A-Za-z\s]+)(?:,|\.|and|$)/i,
    /i'm ([A-Za-z\s]+)(?:,|\.|and|$)/i
  ];
  
  for (const pattern of namePatterns) {
    const nameMatch = text.match(pattern);
    if (nameMatch && nameMatch[1]) {
      result.name = nameMatch[1].trim();
      break;
    }
  }
  
  // Si no encontramos un patrón claro, intentamos buscar el primer nombre propio
  // después de quitar el email (si existe)
  if (!result.name) {
    const textWithoutEmail = result.email ? text.replace(result.email, '') : text;
    const words = textWithoutEmail.split(/\s+/);
    
    // Buscar una palabra que comience con mayúscula y no sea la primera palabra de una oración
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      if (word.length > 1 && word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
        // Es probable que sea un nombre
        result.name = word.replace(/[.,;:!?]$/, ''); // Quitar signos de puntuación
        break;
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
  const updatedProfile: UserProfile = { ...currentProfile };
  
  switch (stage) {
    case ConversationStage.ASK_NAME_EMAIL: {
      const nameAndEmail = extractNameAndEmail(userInput);
      if (nameAndEmail.name) {
        updatedProfile.name = nameAndEmail.name;
      }
      if (nameAndEmail.email) {
        updatedProfile.email = nameAndEmail.email;
      }
      break;
    }
    
    case ConversationStage.ASK_DESTINATION: {
      // Extraer el destino, eliminar palabras como "a", "to", "quiero ir a", etc.
      let destination = userInput
        .replace(/^(quiero|me gustaría|quisiera|deseo|voy a|iré a|planeo|pienso) (ir|viajar|visitar) (a|al|hacia) /i, '')
        .replace(/^(quiero|me gustaría|quisiera|deseo|voy a|iré a|planeo|pienso) (ir|viajar|visitar) /i, '')
        .replace(/^(i want|i would like|i'd like|i plan|i'm going|i am going) to (go|travel|visit) to /i, '')
        .replace(/^(i want|i would like|i'd like|i plan|i'm going|i am going) to (go|travel|visit) /i, '')
        .replace(/^(a|al|hacia|to) /i, '');
      
      // Capitalizar primera letra de cada palabra para el destino
      destination = destination.replace(/\b\w/g, c => c.toUpperCase()).trim();
      
      updatedProfile.destination = destination;
      break;
    }
    
    case ConversationStage.ASK_BUDGET: {
      // Extraer presupuesto, intentando detectar monedas y números
      const budgetRegex = /(\$|€|£|USD|EUR|GBP|MXN|CAD)?\s*(\d+[\d\s,.]*)\s*(\$|€|£|USD|EUR|GBP|MXN|CAD)?/i;
      const budgetMatch = userInput.match(budgetRegex);
      
      if (budgetMatch) {
        const currencyPrefix = budgetMatch[1] || '';
        const amount = budgetMatch[2].replace(/[\s,]/g, '');
        const currencySuffix = budgetMatch[3] || '';
        
        const currency = currencyPrefix || currencySuffix || '';
        updatedProfile.budget = `${currency}${amount}`;
      } else {
        // Si no detectamos un formato específico, guardamos la entrada tal cual
        updatedProfile.budget = userInput.trim();
      }
      break;
    }
    
    case ConversationStage.ASK_DATES: {
      // Guardamos las fechas tal cual las ingresa el usuario
      updatedProfile.dates = userInput.trim();
      break;
    }
    
    case ConversationStage.ASK_TRAVELERS: {
      // Guardamos la información de viajeros
      updatedProfile.travelers = userInput.trim();
      break;
    }
    
    case ConversationStage.ASK_INTERESTS: {
      // Guardamos los intereses
      updatedProfile.interests = userInput.trim();
      break;
    }
    
    case ConversationStage.ITINERARY_REQUEST: {
      // Verificar confirmación para generar itinerario
      const positiveResponses = ['sí', 'si', 'yes', 'por favor', 'please', 'claro', 'of course', 'sure'];
      const negativeResponses = ['no', 'nope', 'not now', 'ahora no', 'más tarde', 'later'];
      
      const lowerInput = userInput.toLowerCase();
      
      if (positiveResponses.some(resp => lowerInput.includes(resp))) {
        updatedProfile.confirmation = 'yes';
      } else if (negativeResponses.some(resp => lowerInput.includes(resp))) {
        updatedProfile.confirmation = 'no';
      } else {
        updatedProfile.confirmation = 'unknown';
      }
      break;
    }
  }
  
  // Actualizar el historial de conversación
  if (!updatedProfile.conversationHistory) {
    updatedProfile.conversationHistory = [];
  }
  
  updatedProfile.conversationHistory.push({
    role: 'user',
    content: userInput,
    timestamp: new Date().toISOString()
  });
  
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
  // Detectar si el usuario está comenzando una nueva conversación con un saludo
  if (isGreeting(userInput) && currentStage !== ConversationStage.GREETING) {
    return ConversationStage.GREETING;
  }
  
  // Detectar si el usuario menciona claramente que quiere un itinerario
  const itineraryKeywords = ['itinerario', 'itinerary', 'planifica', 'plan', 'agenda', 'schedule'];
  if (itineraryKeywords.some(keyword => userInput.toLowerCase().includes(keyword)) && 
      profile.destination && 
      currentStage >= ConversationStage.ASK_DESTINATION) {
    return ConversationStage.ITINERARY_REQUEST;
  }
  
  // Flujo normal de conversación
  switch (currentStage) {
    case ConversationStage.GREETING:
      return ConversationStage.ASK_NAME_EMAIL;
      
    case ConversationStage.ASK_NAME_EMAIL:
      return ConversationStage.ASK_DESTINATION;
      
    case ConversationStage.ASK_DESTINATION:
      return ConversationStage.ASK_BUDGET;
      
    case ConversationStage.ASK_BUDGET:
      return ConversationStage.ASK_DATES;
      
    case ConversationStage.ASK_DATES:
      return ConversationStage.ASK_TRAVELERS;
      
    case ConversationStage.ASK_TRAVELERS:
      return ConversationStage.ASK_INTERESTS;
      
    case ConversationStage.ASK_INTERESTS:
      return ConversationStage.ITINERARY_REQUEST;
      
    case ConversationStage.ITINERARY_REQUEST:
      // Si el usuario confirmó que quiere un itinerario, pasamos a la etapa general
      // Si no confirmó, también pasamos a la etapa general para ofrecer otros servicios
      return ConversationStage.GENERAL;
      
    default:
      return ConversationStage.GENERAL;
  }
}

/**
 * Genera un resumen del perfil de usuario para mostrar
 */
export function getUserProfileSummary(profile: UserProfile): string {
  const summary = [];
  
  if (profile.name) {
    summary.push(`**Nombre:** ${profile.name}`);
  }
  
  if (profile.email) {
    summary.push(`**Email:** ${profile.email}`);
  }
  
  if (profile.destination) {
    summary.push(`**Destino:** ${profile.destination}`);
  }
  
  if (profile.budget) {
    summary.push(`**Presupuesto:** ${profile.budget}`);
  }
  
  if (profile.dates) {
    summary.push(`**Fechas:** ${profile.dates}`);
  }
  
  if (profile.travelers) {
    summary.push(`**Viajeros:** ${profile.travelers}`);
  }
  
  if (profile.interests) {
    summary.push(`**Intereses:** ${profile.interests}`);
  }
  
  return summary.length > 0 ? `### Tu perfil de viaje:\n${summary.join('\n')}` : '';
}

/**
 * Procesa el mensaje del usuario y genera una respuesta
 */
export async function processUserMessage(
  userMessage: string,
  profile: UserProfile
): Promise<{ response: string; updatedProfile: UserProfile; emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' }> {
  try {
    // Actualizar la etapa actual
    const currentStage = profile.currentStage || ConversationStage.GREETING;
    
    // Actualizar el perfil con la información de la entrada del usuario
    const updatedProfile = updateUserProfile(currentStage, userMessage, profile);
    
    // Determinar la siguiente etapa
    const nextStage = determineNextStage(currentStage, userMessage, updatedProfile);
    updatedProfile.currentStage = nextStage;
    
    // Analizar el sentimiento del mensaje
    const sentimentResult = await analyzeSentiment(updatedProfile);
    updatedProfile.emotion = sentimentResult.emotion;
    
    // Generar la respuesta
    let response = '';
    
    // Si pasamos de ASK_INTERESTS a ITINERARY_REQUEST, mostrar un resumen del perfil
    if (currentStage === ConversationStage.ASK_INTERESTS && nextStage === ConversationStage.ITINERARY_REQUEST) {
      const profileSummary = getUserProfileSummary(updatedProfile);
      response = `${profileSummary}\n\n${STAGE_QUESTIONS[nextStage]}`;
    } 
    // Si estamos en ITINERARY_REQUEST y el usuario confirmó que quiere un itinerario
    else if (currentStage === ConversationStage.ITINERARY_REQUEST && updatedProfile.confirmation === 'yes') {
      response = "¡Perfecto! Estoy generando tu itinerario personalizado. Esto tomará un momento...";
    }
    // Para otras etapas, usar la pregunta predefinida
    else {
      response = STAGE_QUESTIONS[nextStage];
    }
    
    // Activar APIs relevantes basadas en el perfil actualizado
    if (updatedProfile.destination && nextStage === ConversationStage.ASK_DATES) {
      const apiResults = await triggerAPIs(updatedProfile);
      
      // Si hay información sobre el destino, agregarla a la respuesta
      const destinationInfo = apiResults.find(result => result.type === 'destination_info' && result.success);
      if (destinationInfo) {
        response = `${destinationInfo.data}\n\n${response}`;
      }
    }
    
    // Agregar la respuesta al historial
    if (!updatedProfile.conversationHistory) {
      updatedProfile.conversationHistory = [];
    }
    
    updatedProfile.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    });
    
    return {
      response,
      updatedProfile,
      emotion: updatedProfile.emotion
    };
  } catch (error) {
    console.error('Error processing user message:', error);
    return {
      response: "Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentar de nuevo?",
      updatedProfile: profile,
      emotion: 'neutral'
    };
  }
}