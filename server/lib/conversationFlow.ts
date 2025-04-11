import { ChatMessage } from './ai';

// Define los diferentes estados de la conversación y sus transiciones
export enum ConversationStage {
  GREETING = 'greeting',
  DESTINATION = 'destination',
  BUDGET = 'budget',
  DATES = 'dates',
  TRAVELERS = 'travelers',
  INTERESTS = 'interests',
  ITINERARY_REQUEST = 'itinerary_request',
  SAVE_ITINERARY = 'save_itinerary',
  GENERAL = 'general'
}

// Define las preguntas para cada etapa de la conversación
export const STAGE_QUESTIONS: Record<ConversationStage, string> = {
  [ConversationStage.GREETING]: "Welcome aboard JetAI! I'm your personal travel concierge. To get started, where are you dreaming of going?",
  [ConversationStage.DESTINATION]: "Where are you dreaming of going?",
  [ConversationStage.BUDGET]: "Amazing choice! What's your approximate budget? (Luxury, Mid-range, Budget-friendly)",
  [ConversationStage.DATES]: "Great! When are you planning to travel? (Specific dates, month, or season)",
  [ConversationStage.TRAVELERS]: "Will you be traveling solo, with a partner, with friends, or with family?",
  [ConversationStage.INTERESTS]: "What kind of activities do you enjoy on a trip? (Beach, nature, food, nightlife, adventure, relaxation)",
  [ConversationStage.ITINERARY_REQUEST]: "Perfect! I'll now generate a tailored travel itinerary based on your answers. Would you like to include hotels, flights, or local experiences too?",
  [ConversationStage.SAVE_ITINERARY]: "Would you like me to store this itinerary for easy access and future updates?",
  [ConversationStage.GENERAL]: "How else can I help with your travel plans?"
};

// Estructura para almacenar los datos de viaje del usuario
export interface TravelProfile {
  destination: string | null;
  budget: string | null;
  dates: string | null;
  travelers: string | null;
  interests: string[] | null;
}

// Verifica si el mensaje es un saludo
export function isGreeting(message: string): boolean {
  const greetingPatterns = [
    /^hi$/i,
    /^hello$/i,
    /^hey$/i,
    /^hola$/i,
    /^buenos dias$/i,
    /^buenas tardes$/i,
    /^buenas noches$/i,
    /^bonjour$/i,
    /^salut$/i,
    /^ciao$/i,
    /^hi there$/i,
    /^hello there$/i,
  ];
  
  return greetingPatterns.some(pattern => pattern.test(message.trim()));
}

// Determina la siguiente etapa de la conversación basada en el mensaje y el estado actual
export function determineNextStage(
  currentStage: ConversationStage,
  message: string,
  profile: TravelProfile
): ConversationStage {
  // Si el usuario está saludando, siempre responder con un saludo
  if (isGreeting(message) && currentStage !== ConversationStage.GREETING) {
    return ConversationStage.GREETING;
  }
  
  // Lógica de transición de estado basada en la etapa actual
  switch (currentStage) {
    case ConversationStage.GREETING:
      return ConversationStage.DESTINATION;
      
    case ConversationStage.DESTINATION:
      // Si ya tenemos un destino, avanzar a presupuesto
      return ConversationStage.BUDGET;
      
    case ConversationStage.BUDGET:
      // Si ya tenemos un presupuesto, avanzar a fechas
      return ConversationStage.DATES;
      
    case ConversationStage.DATES:
      // Si ya tenemos fechas, avanzar a viajeros
      return ConversationStage.TRAVELERS;
      
    case ConversationStage.TRAVELERS:
      // Si ya tenemos información de viajeros, avanzar a intereses
      return ConversationStage.INTERESTS;
      
    case ConversationStage.INTERESTS:
      // Si ya tenemos intereses, preguntar si quiere un itinerario
      return ConversationStage.ITINERARY_REQUEST;
      
    case ConversationStage.ITINERARY_REQUEST:
      // Si ya pidió un itinerario, preguntar si quiere guardarlo
      return ConversationStage.SAVE_ITINERARY;
      
    case ConversationStage.SAVE_ITINERARY:
      // Después de guardar, pasar a conversación general
      return ConversationStage.GENERAL;
      
    default:
      return ConversationStage.GENERAL;
  }
}

// Actualiza el perfil de viaje basado en el mensaje y la etapa actual
export function updateTravelProfile(
  currentStage: ConversationStage,
  message: string,
  profile: TravelProfile
): TravelProfile {
  const updatedProfile = { ...profile };
  
  // No actualizar el perfil si es un saludo
  if (isGreeting(message)) {
    return updatedProfile;
  }
  
  switch (currentStage) {
    case ConversationStage.DESTINATION:
      updatedProfile.destination = message.trim();
      break;
      
    case ConversationStage.BUDGET:
      updatedProfile.budget = message.trim();
      break;
      
    case ConversationStage.DATES:
      updatedProfile.dates = message.trim();
      break;
      
    case ConversationStage.TRAVELERS:
      updatedProfile.travelers = message.trim();
      break;
      
    case ConversationStage.INTERESTS:
      // Convertir intereses en array
      updatedProfile.interests = message
        .split(/[,;&]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      break;
  }
  
  return updatedProfile;
}

// Extrae un resumen del perfil de viaje para mostrar al usuario
export function getTravelProfileSummary(profile: TravelProfile): string {
  const items = [];
  
  if (profile.destination) items.push(`🌍 Destination: ${profile.destination}`);
  if (profile.budget) items.push(`💰 Budget: ${profile.budget}`);
  if (profile.dates) items.push(`📅 Dates: ${profile.dates}`);
  if (profile.travelers) items.push(`👥 Travelers: ${profile.travelers}`);
  if (profile.interests && profile.interests.length > 0) {
    items.push(`🎯 Interests: ${profile.interests.join(', ')}`);
  }
  
  return items.length > 0 
    ? `**Here's what I know about your trip so far:**\n\n${items.join('\n')}`
    : '';
}

// Construye un prompt para el asistente basado en el perfil de viaje
export function buildAssistantPrompt(profile: TravelProfile): string {
  let prompt = "You are JetAI, a world-class travel concierge. ";
  
  if (profile.destination) {
    prompt += `The user wants to travel to ${profile.destination}. `;
  }
  
  if (profile.budget) {
    prompt += `Their budget is ${profile.budget}. `;
  }
  
  if (profile.dates) {
    prompt += `They plan to travel ${profile.dates}. `;
  }
  
  if (profile.travelers) {
    prompt += `They will be traveling with ${profile.travelers}. `;
  }
  
  if (profile.interests && profile.interests.length > 0) {
    prompt += `They're interested in ${profile.interests.join(', ')}. `;
  }
  
  return prompt;
}

// Determina si tenemos suficiente información para generar un itinerario
export function canGenerateItinerary(profile: TravelProfile): boolean {
  return !!profile.destination && 
         (!!profile.budget || !!profile.dates || !!profile.interests);
}