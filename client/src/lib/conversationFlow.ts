/**
 * Sistema de flujo de conversación para JetAI
 * Este archivo maneja el flujo conversacional del asistente de viajes
 * con un enfoque de una pregunta a la vez.
 */

// Etapas de la conversación para guiar al usuario
export enum ConversationStage {
  GREETING,
  ASK_DESTINATION,
  ASK_BUDGET,
  ASK_DATES,
  ASK_TRAVELERS,
  ASK_INTERESTS,
  ITINERARY_REQUEST,
  GENERAL
}

// Información del perfil de viaje del usuario
export interface TravelProfile {
  destination: string | null;
  budget: string | null;
  dates: string | null;
  travelers: string | null;
  interests: string[] | null;
}

// Preguntas predefinidas para cada etapa de la conversación
export const STAGE_QUESTIONS: Record<ConversationStage, string> = {
  [ConversationStage.GREETING]: "¡Hola! Soy JetAI, tu asistente de viajes personal. ¿A dónde te gustaría viajar?",
  [ConversationStage.ASK_DESTINATION]: "¿A qué destino te gustaría viajar? Puedes indicar una ciudad, un país o una región.",
  [ConversationStage.ASK_BUDGET]: "¿Cuál es tu presupuesto aproximado para este viaje?",
  [ConversationStage.ASK_DATES]: "¿En qué fechas planeas viajar? Puedes ser específico o general (por ejemplo, 'julio 2025' o 'próximo fin de semana').",
  [ConversationStage.ASK_TRAVELERS]: "¿Cuántas personas viajarán? ¿Viajará con niños o tienes necesidades especiales?",
  [ConversationStage.ASK_INTERESTS]: "¿Qué tipo de actividades te interesan para este viaje? (por ejemplo: gastronomía, cultura, aventura, relax...)",
  [ConversationStage.ITINERARY_REQUEST]: "¡Genial! Basado en tus preferencias, ¿te gustaría que te prepare un itinerario personalizado?",
  [ConversationStage.GENERAL]: "¿En qué más puedo ayudarte con tu viaje?"
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
 * Actualiza el perfil de viaje basado en la etapa actual y la entrada del usuario
 */
export function updateTravelProfile(
  stage: ConversationStage,
  userInput: string,
  currentProfile: TravelProfile
): TravelProfile {
  // Clonar el perfil actual para no modificar el original
  const updatedProfile: TravelProfile = { ...currentProfile };
  
  switch (stage) {
    case ConversationStage.ASK_DESTINATION:
    case ConversationStage.GREETING:
      // Si el usuario está saludando en la primera interacción, no actualizar el destino
      if (!isGreeting(userInput) || stage === ConversationStage.ASK_DESTINATION) {
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
      // Dividir las entradas separadas por comas o 'y'
      const interests = userInput
        .split(/,|\sy\s/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      updatedProfile.interests = interests;
      break;
      
    default:
      // Para otras etapas como GENERAL, no actualizamos el perfil
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
  profile: TravelProfile
): ConversationStage {
  // Si el usuario está saludando (excepto en la primera interacción),
  // reiniciamos el flujo
  if (currentStage !== ConversationStage.GREETING && isGreeting(userInput)) {
    return ConversationStage.GREETING;
  }
  
  switch (currentStage) {
    case ConversationStage.GREETING:
      // Si es un saludo, mantén la etapa de saludo y pide el destino de nuevo
      if (isGreeting(userInput)) {
        return ConversationStage.ASK_DESTINATION;
      }
      // Si no es un saludo, asumimos que es una respuesta al destino
      return ConversationStage.ASK_BUDGET;
      
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
      // Después de solicitar el itinerario, pasamos a conversación general
      return ConversationStage.GENERAL;
      
    default:
      return ConversationStage.GENERAL;
  }
}

/**
 * Genera un resumen del perfil de viaje
 */
export function getTravelProfileSummary(profile: TravelProfile): string {
  const parts: string[] = [];
  
  if (profile.destination) {
    parts.push(`📍 **Destino:** ${profile.destination}`);
  }
  
  if (profile.budget) {
    parts.push(`💰 **Presupuesto:** ${profile.budget}`);
  }
  
  if (profile.dates) {
    parts.push(`📅 **Fechas:** ${profile.dates}`);
  }
  
  if (profile.travelers) {
    parts.push(`👥 **Viajeros:** ${profile.travelers}`);
  }
  
  if (profile.interests && profile.interests.length > 0) {
    parts.push(`🌟 **Intereses:** ${profile.interests.join(', ')}`);
  }
  
  if (parts.length === 0) {
    return "";
  }
  
  return `### Tu perfil de viaje:\n${parts.join('\n')}`;
}

/**
 * Extrae preferencias del usuario de su mensaje
 */
export function extractPreferences(text: string): Record<string, string> {
  const preferences: Record<string, string> = {};
  
  // Patrones para detectar preferencias comunes
  const patterns = [
    { key: 'transportation', pattern: /prefiero\s+(viajar|ir|moverme)\s+en\s+(\w+)/i },
    { key: 'accommodation', pattern: /prefiero\s+(alojarme|hospedarme|quedarme)\s+en\s+(\w+)/i },
    { key: 'cuisine', pattern: /me\s+gusta\s+la\s+comida\s+(\w+)/i },
    { key: 'budget_level', pattern: /busco\s+algo\s+(económico|barato|lujoso|exclusivo)/i },
    { key: 'activity_level', pattern: /prefiero\s+actividades\s+(relajantes|tranquilas|aventureras|intensas)/i },
  ];
  
  // Buscar coincidencias
  patterns.forEach(({ key, pattern }) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      preferences[key] = match[1];
    }
  });
  
  return preferences;
}

/**
 * Mejora las respuestas con emojis basados en el contenido
 */
export function enhanceResponseWithEmojis(text: string): string {
  const emojiMappings: [RegExp, string][] = [
    // Destinos y lugares
    [/\b(destino|ciudad|país|lugar|sitio)\b/gi, '📍'],
    [/\b(hotel|alojamiento|hospedaje|resort)\b/gi, '🏨'],
    [/\b(playa|mar|océano|costa)\b/gi, '🏖️'],
    [/\b(montaña|sierra|cordillera)\b/gi, '⛰️'],
    [/\b(parque|jardín|naturaleza|bosque)\b/gi, '🌳'],
    
    // Transporte
    [/\b(vuelo|avión|aeropuerto)\b/gi, '✈️'],
    [/\b(tren|estación|ferrocarril)\b/gi, '🚆'],
    [/\b(coche|auto|carro|conducir)\b/gi, '🚗'],
    [/\b(barco|crucero|navegar|ferry)\b/gi, '🚢'],
    
    // Actividades
    [/\b(tour|visita|excursión|paseo)\b/gi, '🧭'],
    [/\b(museo|exposición|arte|galería)\b/gi, '🏛️'],
    [/\b(restaurante|comida|cena|cenar|comer)\b/gi, '🍽️'],
    [/\b(actividad|aventura|experiencia)\b/gi, '🌟'],
    [/\b(fiesta|festival|celebración|evento)\b/gi, '🎉'],
    [/\b(senderismo|caminata|trekking|hiking)\b/gi, '🥾'],
    [/\b(nadar|natación|buceo|snorkel)\b/gi, '🏊'],
    
    // Tiempo y clima
    [/\b(clima|tiempo|temperatura)\b/gi, '🌤️'],
    [/\b(calor|caluroso|sol|soleado)\b/gi, '☀️'],
    [/\b(frío|helado|nieve|nevado)\b/gi, '❄️'],
    [/\b(lluvia|lluvioso|precipitación)\b/gi, '🌧️'],
    
    // Planificación
    [/\b(presupuesto|costo|precio|dinero)\b/gi, '💰'],
    [/\b(fecha|día|mes|calendario)\b/gi, '📅'],
    [/\b(itinerario|plan|agenda|programa)\b/gi, '📋'],
    [/\b(reserva|reservación|booking)\b/gi, '📝'],
    
    // Emociones y experiencias
    [/\b(disfrutar|divertir|diversión|entretenimiento)\b/gi, '😄'],
    [/\b(relajar|descansar|relajación|tranquilidad)\b/gi, '😌'],
    [/\b(asombroso|increíble|espectacular|maravilloso)\b/gi, '😮'],
    [/\b(recomendación|sugerencia|consejo|tip)\b/gi, '💡'],
    
    // Culturales
    [/\b(cultura|tradición|historia|histórico)\b/gi, '🏺'],
    [/\b(gastronomía|culinario|platillo|cocina)\b/gi, '👨‍🍳'],
    [/\b(idioma|lengua|dialecto|hablar)\b/gi, '🗣️'],
    
    // Familias y grupos
    [/\b(familia|familiar|niños|niñas|bebé)\b/gi, '👨‍👩‍👧‍👦'],
    [/\b(grupo|amigos|compañeros)\b/gi, '👥'],
    
    // Geografía general
    [/\b(isla|archipiélago|islote)\b/gi, '🏝️'],
    [/\b(río|lago|laguna)\b/gi, '🏞️'],
    [/\b(desierto|arena|dunas)\b/gi, '🏜️'],
    
    // Temporadas
    [/\b(verano|estival)\b/gi, '☀️'],
    [/\b(invierno|invernal)\b/gi, '⛄'],
    [/\b(primavera|primaveral)\b/gi, '🌷'],
    [/\b(otoño|otoñal)\b/gi, '🍂'],
  ];
  
  // No modifiques el texto si ya tiene suficientes emojis
  const existingEmojiCount = (text.match(/[\p{Emoji}]/gu) || []).length;
  const textLength = text.length;
  const emojiDensity = existingEmojiCount / textLength;
  
  // Si ya hay una buena densidad de emojis, devuelve el texto original
  if (emojiDensity > 0.02) {
    return text;
  }
  
  // Aplica mapeo de emojis
  let enhancedText = text;
  let addedEmojis = 0;
  
  for (const [pattern, emoji] of emojiMappings) {
    // Solo agregamos un máximo de emojis por mensaje para evitar sobrecarga
    if (addedEmojis >= 5) break;
    
    // Solo reemplazamos la primera ocurrencia de cada patrón
    const match = enhancedText.match(pattern);
    if (match && match[0]) {
      // Evitar agregar emojis a palabras que ya tienen un emoji cerca
      const position = match.index;
      const surroundingText = enhancedText.substring(
        Math.max(0, position - 10),
        Math.min(enhancedText.length, position + match[0].length + 10)
      );
      
      if (!/[\p{Emoji}]/gu.test(surroundingText)) {
        enhancedText = enhancedText.replace(
          pattern,
          (matched) => `${emoji} ${matched}`
        );
        addedEmojis++;
      }
    }
  }
  
  // Si es un mensaje corto de bienvenida y no tiene emojis, añadir uno al principio
  if (enhancedText.length < 100 && addedEmojis === 0 && !enhancedText.startsWith('👋')) {
    if (/^(hola|bienvenid|bienvenidos|saludos|buenos días|buenas tardes|buenas noches|hi|hello|welcome)/i.test(enhancedText)) {
      enhancedText = `👋 ${enhancedText}`;
    }
  }
  
  return enhancedText;
}