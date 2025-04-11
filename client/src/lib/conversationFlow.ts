/**
 * Cliente de flujo de conversación para JetAI
 * Este archivo maneja la lógica del flujo de conversación en el cliente,
 * conectando con el servidor para procesar las respuestas y mantener el estado.
 */

// Las mismas definiciones de tipos que en el servidor para mantener consistencia
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

// Tipos de mensajes
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'sent' | 'delivered' | 'error';
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
}

/**
 * Crea un nuevo perfil de usuario vacío
 */
export function createNewUserProfile(): UserProfile {
  return {
    currentStage: ConversationStage.GREETING,
    conversationHistory: []
  };
}

// Mensajes predefinidos para cada etapa (igual que en el servidor)
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
 * Genera un ID único para los mensajes
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Comprueba si un mensaje está relacionado con vuelos
 */
export function isFlightRelated(text: string): boolean {
  const flightTerms = [
    "flight", "fly", "airline", "airport", "departure", "arrival", "connection", 
    "connection", "vuelo", "volar", "aerolínea", "aeropuerto", "vuelos", "plane", "avión"
  ];
  
  const lowercaseText = text.toLowerCase();
  return flightTerms.some(term => lowercaseText.includes(term));
}

/**
 * Comprueba si un mensaje está relacionado con hoteles
 */
export function isHotelRelated(text: string): boolean {
  const hotelTerms = [
    "hotel", "hostel", "airbnb", "resort", "accommodation", "stay", "room", "lodge", 
    "booking", "alojamiento", "hostal", "habitación", "reserva", "hospedaje"
  ];
  
  const lowercaseText = text.toLowerCase();
  return hotelTerms.some(term => lowercaseText.includes(term));
}

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
 * Extrae información de idioma del texto
 */
export function detectLanguage(text: string): string | null {
  // Patrones simples para detectar idiomas basados en caracteres distintivos o expresiones
  if (/[áéíóúüñ¿¡]/i.test(text)) {
    return 'es-ES'; // Español
  }
  
  if (/[àâçéèêëîïôùûüÿ]/i.test(text)) {
    return 'fr-FR'; // Francés
  }
  
  if (/[äöüß]/i.test(text)) {
    return 'de-DE'; // Alemán
  }
  
  if (/[àèéìòó]/i.test(text)) {
    return 'it-IT'; // Italiano
  }
  
  if (/[ãõêç]/i.test(text)) {
    return 'pt-BR'; // Portugués
  }
  
  // Detectar frases en diferentes idiomas
  const text_lower = text.toLowerCase();
  if (text_lower.includes('gracias') || text_lower.includes('buenos días') || text_lower.includes('cómo estás')) {
    return 'es-ES';
  }
  
  if (text_lower.includes('merci') || text_lower.includes('bonjour') || text_lower.includes('comment ça va')) {
    return 'fr-FR';
  }
  
  if (text_lower.includes('danke') || text_lower.includes('guten tag') || text_lower.includes('wie geht es dir')) {
    return 'de-DE';
  }
  
  if (text_lower.includes('grazie') || text_lower.includes('buongiorno') || text_lower.includes('come stai')) {
    return 'it-IT';
  }
  
  if (text_lower.includes('obrigado') || text_lower.includes('bom dia') || text_lower.includes('como vai')) {
    return 'pt-BR';
  }
  
  return null; // No se detectó un idioma específico, probablemente inglés o indeterminado
}

/**
 * Extrae la emoción del texto (análisis básico)
 */
export function detectEmotion(text: string): 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' {
  const text_lower = text.toLowerCase();
  
  // Patrones emocionales simples
  const happyPatterns = ['happy', 'glad', 'great', 'good', 'excellent', 'fantastic', 'wonderful', 'contento', 'feliz', 'genial'];
  const sadPatterns = ['sad', 'unhappy', 'disappointed', 'sorry', 'unfortunately', 'triste', 'lamento', 'desafortunadamente'];
  const angryPatterns = ['angry', 'annoyed', 'frustrated', 'terrible', 'worst', 'bad', 'hate', 'furioso', 'molesto', 'terrible'];
  const excitedPatterns = ['excited', 'amazing', 'wow', 'awesome', 'incredible', 'love', 'can\'t wait', 'emocionado', 'increíble', 'impresionante'];
  const confusedPatterns = ['confused', 'unsure', 'not sure', 'don\'t understand', 'what do you mean', 'confundido', 'no entiendo', 'qué quieres decir'];
  
  // Verificar patrones
  if (happyPatterns.some(pattern => text_lower.includes(pattern))) {
    return 'happy';
  }
  
  if (sadPatterns.some(pattern => text_lower.includes(pattern))) {
    return 'sad';
  }
  
  if (angryPatterns.some(pattern => text_lower.includes(pattern))) {
    return 'angry';
  }
  
  if (excitedPatterns.some(pattern => text_lower.includes(pattern))) {
    return 'excited';
  }
  
  if (confusedPatterns.some(pattern => text_lower.includes(pattern))) {
    return 'confused';
  }
  
  // Signos de exclamación para entusiasmo
  if (text.includes('!') && !text.includes('?')) {
    return 'excited';
  }
  
  // Preguntas largas pueden indicar confusión
  if ((text.match(/\?/g) || []).length > 1) {
    return 'confused';
  }
  
  // Por defecto, neutral
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
    const response = await fetch('/api/conversation/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        profile,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing message:', error);
    
    // Manejo de errores básico (en modo offline o cuando hay errores)
    // Intentamos imitar el comportamiento del servidor
    const detectedEmotion = detectEmotion(message);
    
    // Actualizar perfil con información básica (análisis en el cliente)
    let updatedProfile = { ...profile };
    
    // Detectar idioma
    const detectedLanguage = detectLanguage(message);
    if (detectedLanguage) {
      updatedProfile.language = detectedLanguage;
    }
    
    // Crear una respuesta básica
    let response = "I'm sorry, I'm having trouble connecting to my knowledge base. Could you try again?";
    
    // Si estamos en modo offline, intentar avanzar la conversación
    if (isGreeting(message)) {
      updatedProfile.currentStage = ConversationStage.ASK_NAME_EMAIL;
      response = STAGE_QUESTIONS[ConversationStage.ASK_NAME_EMAIL];
    } else if (profile.currentStage === ConversationStage.GREETING || profile.currentStage === ConversationStage.ASK_NAME_EMAIL) {
      // Extraer nombre/email manualmente
      if (message.includes('@')) {
        updatedProfile.email = message;
      } else {
        updatedProfile.name = message;
      }
      updatedProfile.currentStage = ConversationStage.ASK_DESTINATION;
      response = STAGE_QUESTIONS[ConversationStage.ASK_DESTINATION];
    } else {
      // Solo avanzamos una etapa
      const currentStageIndex = Object.values(ConversationStage).indexOf(profile.currentStage);
      const nextStageIndex = Math.min(currentStageIndex + 1, Object.values(ConversationStage).length - 1);
      const nextStage = Object.values(ConversationStage)[nextStageIndex];
      
      updatedProfile.currentStage = nextStage as ConversationStage;
      response = STAGE_QUESTIONS[nextStage as ConversationStage];
    }
    
    return {
      response,
      updatedProfile,
      emotion: detectedEmotion,
    };
  }
}

/**
 * Solicita al servidor generar un itinerario
 */
export async function requestItinerary(profile: UserProfile): Promise<string> {
  try {
    const response = await fetch('/api/itinerary/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.itinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return "I'm sorry, I couldn't generate your itinerary at this time. Please try again later.";
  }
}

/**
 * Crea un nuevo mensaje del sistema para iniciar la conversación
 */
export function createInitialSystemMessage(): Message {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content: STAGE_QUESTIONS[ConversationStage.GREETING],
    timestamp: new Date(),
    status: 'delivered',
  };
}

/**
 * Crea un nuevo mensaje del usuario
 */
export function createUserMessage(content: string): Message {
  return {
    id: generateMessageId(),
    role: 'user',
    content,
    timestamp: new Date(),
    status: 'sent',
    emotion: detectEmotion(content)
  };
}

/**
 * Crea un nuevo mensaje del asistente
 */
export function createAssistantMessage(
  content: string, 
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' = 'neutral'
): Message {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content,
    timestamp: new Date(),
    status: 'delivered',
    emotion
  };
}

/**
 * Extrae comandos especiales de un mensaje del usuario
 */
export function extractCommand(message: string): { command: string; args: string } | null {
  const commandPattern = /^\/([a-zA-Z]+)(?:\s+(.+))?$/;
  const match = message.match(commandPattern);
  
  if (match) {
    const command = match[1].toLowerCase();
    const args = match[2] || '';
    return { command, args };
  }
  
  return null;
}

/**
 * Ejecuta un comando especial
 */
export function executeCommand(command: string, args: string): string {
  switch (command) {
    case 'help':
      return `
**Available commands:**
- /reset - Reset the conversation
- /itinerary - Generate a travel itinerary
- /flights - Search for flights
- /hotels - Search for accommodations
- /activities - Find local activities
- /language [code] - Change language (e.g., /language es)
- /help - Show this help message
      `;
    case 'reset':
      // El reseteo real se maneja en el componente
      return "Conversation has been reset. How can I help you plan your next journey?";
    case 'language':
      const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
      const lang = args.trim().toLowerCase();
      
      if (!lang || !validLanguages.includes(lang)) {
        return `Please specify a valid language code: ${validLanguages.join(', ')}`;
      }
      
      return `Language changed to ${lang}. How can I assist you with your travel plans?`;
    default:
      return `Unknown command: /${command}. Type /help to see available commands.`;
  }
}