/**
 * Sistema de flujo de conversación para JetAI
 * Este archivo define el flujo "una-pregunta-a-la-vez" que guía al usuario a través
 * de una secuencia de preguntas para obtener su perfil de viaje completo
 */

// Etapas de la conversación
export enum ConversationStage {
  GREETING = 'greeting',           // Saludo inicial
  DESTINATION = 'destination',     // Destino deseado
  BUDGET = 'budget',               // Presupuesto del viaje
  DATES = 'dates',                 // Fechas del viaje
  TRAVELERS = 'travelers',         // Número y tipo de viajeros
  INTERESTS = 'interests',         // Intereses/actividades
  ITINERARY_REQUEST = 'itinerary', // Solicitud de itinerario
  GENERAL = 'general'              // Conversación general (cuando ya se tienen los datos básicos)
}

// Preguntas pre-definidas para cada etapa
export const STAGE_QUESTIONS: Record<ConversationStage, string> = {
  [ConversationStage.GREETING]: "¡Hola! Soy JetAI, tu asistente de viajes personal. ¿A qué destino te gustaría viajar?",
  [ConversationStage.DESTINATION]: "¡Excelente elección! ¿Cuál es tu presupuesto aproximado para este viaje?",
  [ConversationStage.BUDGET]: "¿En qué fechas te gustaría viajar?",
  [ConversationStage.DATES]: "¿Para cuántas personas estás planeando este viaje?",
  [ConversationStage.TRAVELERS]: "¿Qué tipo de actividades o experiencias te interesan más en este viaje?",
  [ConversationStage.INTERESTS]: "¡Perfecto! Tengo toda la información que necesito. ¿Te gustaría que te genere un itinerario personalizado o prefieres que te recomiende algo específico primero?",
  [ConversationStage.ITINERARY_REQUEST]: "Estoy creando tu itinerario personalizado. ¿Hay algo específico que quieras incluir?",
  [ConversationStage.GENERAL]: "¿En qué más puedo ayudarte con tu viaje?"
};

// Modelo de datos para el perfil de viaje
export interface TravelProfile {
  destination: string | null;
  budget: string | null;
  dates: string | null;
  travelers: string | null;
  interests: string | null;
}

/**
 * Determina si un texto es un saludo
 */
export function isGreeting(text: string): boolean {
  // Lista de saludos comunes en varios idiomas
  const greetingPatterns = [
    /^(hi|hello|hey|howdy|greetings)/i,
    /^(hola|buenos días|buenas tardes|buenas noches)/i,
    /^(bonjour|salut)/i,
    /^(ciao|buongiorno|buonasera)/i,
    /^(olá|bom dia|boa tarde|boa noite)/i,
    /^(hallo|guten tag|guten morgen)/i
  ];
  
  // Devuelve true si el texto coincide con alguno de los patrones de saludo
  return greetingPatterns.some(pattern => pattern.test(text.trim()));
}

/**
 * Actualiza el perfil de viaje del usuario basado en la respuesta actual
 */
export function updateTravelProfile(
  stage: ConversationStage,
  userInput: string,
  currentProfile: TravelProfile
): TravelProfile {
  // Crea una copia del perfil actual para actualizarlo
  const updatedProfile = { ...currentProfile };
  
  // Actualiza el campo correspondiente según la etapa actual
  switch (stage) {
    case ConversationStage.GREETING:
      // No actualizamos nada en la etapa de saludo
      break;
      
    case ConversationStage.DESTINATION:
      // Si el usuario está respondiendo sobre el destino
      if (!isGreeting(userInput)) {
        updatedProfile.destination = userInput;
      }
      break;
      
    case ConversationStage.BUDGET:
      updatedProfile.budget = userInput;
      break;
      
    case ConversationStage.DATES:
      updatedProfile.dates = userInput;
      break;
      
    case ConversationStage.TRAVELERS:
      updatedProfile.travelers = userInput;
      break;
      
    case ConversationStage.INTERESTS:
      updatedProfile.interests = userInput;
      break;
      
    // En las etapas de conversación general no actualizamos el perfil
    case ConversationStage.ITINERARY_REQUEST:
    case ConversationStage.GENERAL:
      break;
  }
  
  return updatedProfile;
}

/**
 * Determina la siguiente etapa de la conversación basada en la etapa actual
 * y el perfil de viaje actualizado
 */
export function determineNextStage(
  currentStage: ConversationStage,
  userInput: string,
  profile: TravelProfile
): ConversationStage {
  // Si es un saludo y estamos en otra etapa, volvemos a la etapa de destino
  if (isGreeting(userInput) && currentStage !== ConversationStage.GREETING) {
    return ConversationStage.DESTINATION;
  }
  
  // Progresión normal a través de las etapas en secuencia
  switch (currentStage) {
    case ConversationStage.GREETING:
      return ConversationStage.DESTINATION;
      
    case ConversationStage.DESTINATION:
      return ConversationStage.BUDGET;
      
    case ConversationStage.BUDGET:
      return ConversationStage.DATES;
      
    case ConversationStage.DATES:
      return ConversationStage.TRAVELERS;
      
    case ConversationStage.TRAVELERS:
      return ConversationStage.INTERESTS;
      
    case ConversationStage.INTERESTS:
      // Una vez completados los intereses, pasamos a solicitar un itinerario
      return ConversationStage.ITINERARY_REQUEST;
      
    case ConversationStage.ITINERARY_REQUEST:
      // Después de generar el itinerario, pasamos a conversación general
      return ConversationStage.GENERAL;
      
    case ConversationStage.GENERAL:
      // En la etapa general seguimos en la etapa general
      return ConversationStage.GENERAL;
      
    default:
      return ConversationStage.GREETING;
  }
}

/**
 * Genera un resumen del perfil de viaje para mostrar al usuario
 */
export function getTravelProfileSummary(profile: TravelProfile): string {
  const summaryParts = [];
  
  if (profile.destination) {
    summaryParts.push(`📍 **Destino**: ${profile.destination}`);
  }
  
  if (profile.budget) {
    summaryParts.push(`💰 **Presupuesto**: ${profile.budget}`);
  }
  
  if (profile.dates) {
    summaryParts.push(`🗓️ **Fechas**: ${profile.dates}`);
  }
  
  if (profile.travelers) {
    summaryParts.push(`👥 **Viajeros**: ${profile.travelers}`);
  }
  
  if (profile.interests) {
    summaryParts.push(`🎯 **Intereses**: ${profile.interests}`);
  }
  
  if (summaryParts.length === 0) {
    return '';
  }
  
  return `**Tu perfil de viaje:**\n${summaryParts.join('\n')}`;
}