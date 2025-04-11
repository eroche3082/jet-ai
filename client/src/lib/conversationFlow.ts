/**
 * Cliente de flujo de conversación para JetAI
 * Este archivo maneja la lógica del flujo de conversación en el cliente,
 * enviando mensajes al servidor y actualizando la UI.
 */

import { apiRequest } from '@/lib/queryClient';

// Etapas de la conversación (debe coincidir con el servidor)
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

// Interfaz del perfil de usuario (debe coincidir con el servidor)
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

// Interfaz de mensaje para el chat
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'sent' | 'delivered' | 'error';
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
}

// Preguntas para cada etapa (debe coincidir con el servidor)
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
 * Crea un nuevo perfil de usuario vacío
 */
export function createNewUserProfile(): UserProfile {
  return {
    currentStage: ConversationStage.GREETING,
    conversationHistory: []
  };
}

/**
 * Genera un ID único para los mensajes
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Comprueba si un mensaje está relacionado con vuelos
 */
export function isFlightRelated(text: string): boolean {
  const flightKeywords = [
    'vuelo', 'vuelos', 'flight', 'flights', 'avión', 'airplane', 'aerolínea', 'airline',
    'aeropuerto', 'airport', 'reserva de vuelo', 'flight booking', 'escala', 'layover'
  ];

  const lowerText = text.toLowerCase();
  return flightKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Comprueba si un mensaje está relacionado con hoteles
 */
export function isHotelRelated(text: string): boolean {
  const hotelKeywords = [
    'hotel', 'hoteles', 'hotels', 'alojamiento', 'accommodation', 'hospedaje', 'lodging',
    'habitación', 'room', 'motel', 'hostal', 'hostel', 'apartamento', 'apartment', 'airbnb',
    'reserva', 'booking', 'check-in', 'checkout'
  ];

  const lowerText = text.toLowerCase();
  return hotelKeywords.some(keyword => lowerText.includes(keyword));
}

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
 * Extrae información de idioma del texto
 */
export function detectLanguage(text: string): string | null {
  // Esta es una implementación simple - en producción se usaría una API de detección de idioma
  const spanishPatterns = ['hola', 'buenos días', 'gracias', 'por favor', 'cómo estás', 'me gustaría', 'quiero', 'viaje'];
  const frenchPatterns = ['bonjour', 'merci', 's\'il vous plaît', 'comment allez-vous', 'je voudrais', 'voyage'];
  const germanPatterns = ['hallo', 'guten tag', 'danke', 'bitte', 'wie geht es dir', 'ich möchte', 'reise'];
  
  const lowerText = text.toLowerCase();
  
  if (spanishPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'es-ES';
  } else if (frenchPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'fr-FR';
  } else if (germanPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'de-DE';
  }
  
  // Por defecto asumimos inglés
  return 'en-US';
}

/**
 * Extrae la emoción del texto (análisis básico)
 */
export function detectEmotion(text: string): 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' {
  // Esta es una implementación simple - en producción se usaría una API de análisis de sentimientos
  const happyPatterns = ['feliz', 'contento', 'happy', 'great', 'awesome', 'amazing', 'excelente', 'bueno', 'good'];
  const sadPatterns = ['triste', 'sad', 'disappointed', 'unhappy', 'unfortunate', 'lamentable'];
  const angryPatterns = ['enfadado', 'angry', 'mad', 'furious', 'upset', 'frustrado', 'frustrated'];
  const excitedPatterns = ['emocionado', 'excited', 'thrilled', 'entusiasmado', 'enthusiastic', 'cannot wait'];
  const confusedPatterns = ['confundido', 'confused', 'not sure', 'no entiendo', 'don\'t understand', 'unclear'];
  
  const lowerText = text.toLowerCase();
  
  if (happyPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'happy';
  } else if (sadPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'sad';
  } else if (angryPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'angry';
  } else if (excitedPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'excited';
  } else if (confusedPatterns.some(pattern => lowerText.includes(pattern))) {
    return 'confused';
  }
  
  return 'neutral';
}

/**
 * Envía un mensaje al servidor para procesar
 */
export async function processMessage(
  message: string,
  profile: UserProfile
): Promise<{
  response: string;
  updatedProfile: UserProfile;
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
}> {
  try {
    const response = await apiRequest('POST', '/api/conversation/process', {
      message,
      profile
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error procesando mensaje:', error);
    return {
      response: 'Lo siento, tuve problemas procesando tu mensaje. ¿Podrías intentarlo nuevamente?',
      updatedProfile: profile,
      emotion: 'confused'
    };
  }
}

/**
 * Solicita al servidor generar un itinerario
 */
export async function requestItinerary(profile: UserProfile): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/itinerary/generate-from-profile', {
      profile
    });
    
    const result = await response.json();
    return result.itinerary;
  } catch (error) {
    console.error('Error generando itinerario:', error);
    return 'Lo siento, no pude generar un itinerario en este momento. Por favor, intenta nuevamente más tarde.';
  }
}

/**
 * Crea un nuevo mensaje del sistema para iniciar la conversación
 */
export function createInitialSystemMessage(): Message {
  return {
    id: generateMessageId(),
    role: 'system',
    content: STAGE_QUESTIONS[ConversationStage.GREETING],
    timestamp: new Date(),
    status: 'delivered'
  };
}

/**
 * Crea un nuevo mensaje del usuario
 */
export function createUserMessage(content: string): Message {
  return {
    id: generateMessageId(),
    role: 'user',
    content: content,
    timestamp: new Date(),
    status: 'sent'
  };
}

/**
 * Crea un nuevo mensaje del asistente
 */
export function createAssistantMessage(
  content: string,
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' = 'neutral',
  status: 'pending' | 'sent' | 'delivered' | 'error' = 'delivered'
): Message {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content: content,
    timestamp: new Date(),
    status: status,
    emotion: emotion
  };
}

/**
 * Extrae comandos especiales de un mensaje del usuario
 */
export function extractCommand(message: string): { command: string; args: string } | null {
  const commandRegex = /^\/([a-zA-Z0-9]+)(?:\s+(.+))?$/;
  const match = message.match(commandRegex);
  
  if (match) {
    const [, command, args = ''] = match;
    return { command, args };
  }
  
  return null;
}

/**
 * Ejecuta un comando especial
 */
export function executeCommand(command: string, args: string): string {
  switch (command.toLowerCase()) {
    case 'help':
      return `
### Comandos disponibles:
- **/help** - Muestra esta ayuda
- **/restart** - Reinicia la conversación
- **/language [código]** - Cambia el idioma (en, es, fr, de)
- **/itinerary** - Genera un itinerario con la información proporcionada
- **/voice [on/off]** - Activa o desactiva la voz
`;
    
    case 'restart':
      return 'Conversación reiniciada.';
    
    case 'language':
      const lang = args.trim().toLowerCase();
      let langName = '';
      
      switch (lang) {
        case 'en': case 'english': case 'inglés': langName = 'inglés'; break;
        case 'es': case 'spanish': case 'español': langName = 'español'; break;
        case 'fr': case 'french': case 'francés': langName = 'francés'; break;
        case 'de': case 'german': case 'alemán': langName = 'alemán'; break;
        default: return 'Idioma no reconocido. Idiomas soportados: en (inglés), es (español), fr (francés), de (alemán).';
      }
      
      return `Idioma cambiado a ${langName}.`;
    
    case 'itinerary':
      return 'Generando itinerario con la información proporcionada...';
    
    case 'voice':
      const voiceOption = args.trim().toLowerCase();
      
      if (voiceOption === 'on') {
        return 'Asistente por voz activado.';
      } else if (voiceOption === 'off') {
        return 'Asistente por voz desactivado.';
      } else {
        return 'Opción no reconocida. Utiliza "/voice on" para activar o "/voice off" para desactivar.';
      }
    
    default:
      return `Comando no reconocido: /${command}. Usa /help para ver los comandos disponibles.`;
  }
}