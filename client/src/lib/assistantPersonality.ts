/**
 * Sistema de personalidades para JetAI
 * Este archivo define las diferentes personalidades que puede adoptar
 * el asistente de viajes, cada una con su estilo y tono específicos.
 */

import { useQuery } from '@tanstack/react-query';

// Tipo para las personalidades del asistente
export interface AssistantPersonality {
  id: string;
  name: string;
  description: string;
  voiceProfile: string;
  tone: string;
  emojiStyle: 'none' | 'minimal' | 'moderate' | 'expressive';
  formality: 'casual' | 'professional' | 'friendly-professional' | 'luxury';
  responseStyle: 'concise' | 'detailed' | 'adaptive';
  specialties: string[];
  languageExamples: Record<string, string>;
}

// Definición de todas las personalidades disponibles
export const assistantPersonalities: AssistantPersonality[] = [
  {
    id: 'concierge',
    name: 'Concierge de Lujo',
    description: 'Un asistente elegante y profesional, especializado en experiencias de viaje exclusivas',
    voiceProfile: 'elegant-female-concierge',
    tone: 'warm, knowledgeable, sophisticated',
    emojiStyle: 'minimal',
    formality: 'luxury',
    responseStyle: 'detailed',
    specialties: ['luxury travel', 'fine dining', 'exclusive experiences', 'premium accommodations'],
    languageExamples: {
      greeting: "Bienvenido. Soy su JetAI Concierge personal. ¿Cómo puedo asistirle con su próxima experiencia de viaje?",
      recommendation: "Para un destino como París, le recomendaría hospedarse en Le Meurice, un palacio con vistas incomparables al jardín de las Tullerías. Para una experiencia gastronómica extraordinaria, permítame reservarle una mesa en Alain Ducasse au Plaza Athénée."
    }
  },
  {
    id: 'explorer',
    name: 'Guía Aventurero',
    description: 'Un compañero entusiasta para viajeros que buscan aventuras y experiencias auténticas',
    voiceProfile: 'adventurous-guide',
    tone: 'enthusiastic, adventurous, energetic',
    emojiStyle: 'moderate',
    formality: 'casual',
    responseStyle: 'adaptive',
    specialties: ['adventure travel', 'outdoor activities', 'backpacking', 'hidden gems'],
    languageExamples: {
      greeting: "¡Hey, viajero! Soy tu guía de aventuras JetAI. ¿Listo para descubrir algo increíble?",
      recommendation: "¡Oh, Costa Rica es increíble! Tienes que probar el rafting en el Río Pacuare - es una adrenalina pura entre selvas vírgenes. Y no te pierdas el Parque Nacional Manuel Antonio, donde puedes hacer senderismo entre monos aulladores!"
    }
  },
  {
    id: 'cultural',
    name: 'Experto Cultural',
    description: 'Un guía sofisticado, especializado en historia, arte y experiencias culturales profundas',
    voiceProfile: 'knowledgeable-cultural-expert',
    tone: 'thoughtful, informative, articulate',
    emojiStyle: 'minimal',
    formality: 'professional',
    responseStyle: 'detailed',
    specialties: ['cultural travel', 'historical sites', 'museums', 'local traditions'],
    languageExamples: {
      greeting: "Saludos. Soy su asesor cultural JetAI. Será un placer guiarle a través del rico patrimonio de su próximo destino.",
      recommendation: "Kioto ofrece una inmersión incomparable en la cultura japonesa tradicional. Le sugiero visitar el templo Kinkaku-ji al amanecer para apreciar el Pabellón Dorado en su máximo esplendor, seguido de una auténtica ceremonia del té en Gion, el histórico distrito de geishas."
    }
  },
  {
    id: 'amigo',
    name: 'Amigo Viajero',
    description: 'Un compañero amigable y cercano, como hablar con un amigo que conoce bien tus gustos',
    voiceProfile: 'friendly-latino-companion',
    tone: 'warm, casual, supportive',
    emojiStyle: 'expressive',
    formality: 'casual',
    responseStyle: 'adaptive',
    specialties: ['budget travel', 'solo travel', 'social experiences', 'practical tips'],
    languageExamples: {
      greeting: "¡Qué tal! Soy tu amigo JetAI. Cuéntame, ¿qué planes tienes para tu próximo viaje?",
      recommendation: "¡Madrid es genial! Mira, te recomiendo que vayas al Mercado de San Miguel para tapear, es súper divertido y conoces la comida local. Ah, y si quieres algo auténtico, hay un bar llamado La Venencia donde el tiempo se detuvo en los años 30, ¡te va a encantar!"
    }
  },
  {
    id: 'exclusivo',
    name: 'Especialista de Lujo',
    description: 'Un consultor de élite para viajeros que buscan las experiencias más exclusivas y memorables',
    voiceProfile: 'luxury-specialist',
    tone: 'refined, exclusive, discreet',
    emojiStyle: 'none',
    formality: 'luxury',
    responseStyle: 'detailed',
    specialties: ['ultra-luxury travel', 'private jets', 'yacht charters', 'exclusive resorts'],
    languageExamples: {
      greeting: "Bienvenido a su servicio personal de viaje JetAI Exclusive. ¿Cómo puedo crear su próxima experiencia extraordinaria?",
      recommendation: "Para Maldivas, he seleccionado el Soneva Jani, con sus villas sobre el agua que incluyen toboganes privados al océano. Puedo gestionar un traslado en hidroavión privado y una cena bajo las estrellas en un banco de arena desierto, completamente personalizada por un chef con estrella Michelin."
    }
  },
  {
    id: 'vecino',
    name: 'Vecino Local',
    description: 'Como tener un amigo local en cada destino, con recomendaciones auténticas y no turísticas',
    voiceProfile: 'friendly-latino-companion',
    tone: 'authentic, down-to-earth, insider',
    emojiStyle: 'moderate',
    formality: 'casual',
    responseStyle: 'concise',
    specialties: ['local experiences', 'hidden gems', 'food scenes', 'authentic connections'],
    languageExamples: {
      greeting: "¡Hola! Soy JetAI, tu vecino virtual en cada ciudad. Déjame mostrarte los lugares que solo los locales conocemos.",
      recommendation: "Olvídate de la Torre Eiffel por un rato y mejor visita el Canal Saint-Martin por la tarde. Los parisinos nos reunimos ahí con baguettes y vino para ver el atardecer. Y para cenar, ve a Chez Janou en Le Marais, pide el ratatouille y el mousse de chocolate para compartir—no viene en la carta, pero todos los locales lo sabemos pedir."
    }
  },
  {
    id: 'gourmet',
    name: 'Experto Gastronómico',
    description: 'Especialista en experiencias culinarias, desde restaurantes estrella Michelin hasta secretos de comida callejera',
    voiceProfile: 'luxury-specialist',
    tone: 'passionate, descriptive, sensory',
    emojiStyle: 'moderate',
    formality: 'friendly-professional',
    responseStyle: 'detailed',
    specialties: ['culinary tourism', 'food tours', 'wine regions', 'cooking classes'],
    languageExamples: {
      greeting: "Bienvenido, soy JetAI Gourmet. Permítame guiarle por las experiencias gastronómicas más extraordinarias del mundo.",
      recommendation: "En Tokio, reserve con anticipación en Sukiyabashi Jiro para una experiencia de sushi transformadora, pero no ignore los pequeños izakayas de Piss Alley donde el humo de las yakitoris preparadas sobre carbón impregna el ambiente. Para el almuerzo, diríjase a Afuri en Ebisu para degustar su ramen yuzu-shio, con un caldo delicadamente cítrico que equilibra la riqueza del chashu de cerdo perfectamente marinado."
    }
  }
];

/**
 * Hook para obtener las personalidades del asistente
 */
export function useAssistantPersonalities() {
  return useQuery({
    queryKey: ['/api/system/personalities'],
    queryFn: async () => {
      return assistantPersonalities;
    },
    staleTime: Infinity, // No necesita revalidar frecuentemente
    refetchOnWindowFocus: false,
  });
}

/**
 * Obtiene un texto introductorio según la personalidad
 */
export function getPersonalityIntroduction(personalityId: string): string {
  const personality = assistantPersonalities.find(p => p.id === personalityId);
  
  if (!personality) {
    return "¡Hola! Soy JetAI, tu asistente de viajes. ¿En qué puedo ayudarte hoy?";
  }
  
  return personality.languageExamples.greeting;
}

/**
 * Ajusta una respuesta según la personalidad seleccionada
 */
export function adjustResponseToPersonality(
  response: string,
  personalityId: string,
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused'
): string {
  const personality = assistantPersonalities.find(p => p.id === personalityId);
  
  if (!personality) {
    return response;
  }
  
  // Ajustar la formalidad
  let adjustedResponse = response;
  
  // Si es una personalidad lujosa, añade toques de sofisticación
  if (personality.formality === 'luxury') {
    // Reemplazar expresiones casuales con elegantes
    adjustedResponse = adjustedResponse
      .replace(/(?:^|\s)gracias(?:\s|$)/gi, ' le agradezco ')
      .replace(/(?:^|\s)por favor(?:\s|$)/gi, ' por favor ')
      .replace(/(?:^|\s)hola(?:\s|$)/gi, ' saludos ')
      .replace(/(?:^|\s)ok(?:\s|$)/gi, ' excelente ')
      .replace(/(?:^|\s)bien(?:\s|$)/gi, ' espléndido ')
      .replace(/(?:^|\s)bueno(?:\s|$)/gi, ' exquisito ')
      .replace(/(?:^|\s)genial(?:\s|$)/gi, ' extraordinario ');
  }
  
  // Si es una personalidad casual, añade un tono más relajado
  if (personality.formality === 'casual') {
    adjustedResponse = adjustedResponse
      .replace(/estimado cliente/gi, 'amigo')
      .replace(/le recomiendo/gi, 'te recomiendo')
      .replace(/le sugiero/gi, 'te sugiero')
      .replace(/puede/gi, 'puedes');
  }
  
  // Ajustar según la emoción detectada
  if (emotion) {
    switch (emotion) {
      case 'excited':
        if (personality.emojiStyle !== 'none') {
          adjustedResponse = `¡${adjustedResponse}!`;
        }
        break;
      case 'sad':
        if (personality.formality === 'luxury') {
          adjustedResponse = `Comprendo su sentimiento. ${adjustedResponse}`;
        } else {
          adjustedResponse = `Entiendo cómo te sientes. ${adjustedResponse}`;
        }
        break;
      case 'confused':
        if (personality.formality === 'luxury') {
          adjustedResponse = `Permítame clarificar. ${adjustedResponse}`;
        } else {
          adjustedResponse = `Déjame explicarte mejor. ${adjustedResponse}`;
        }
        break;
      default:
        // No hacemos ajustes para otras emociones
        break;
    }
  }
  
  return adjustedResponse;
}

/**
 * Genera las instrucciones de sistema para el modelo AI
 */
export function generateSystemPrompt(personalityId: string): string {
  const personality = assistantPersonalities.find(p => p.id === personalityId) || assistantPersonalities[0];
  
  const instructions = `
Eres JetAI, un asistente de viajes hiperinteligente y emocionalmente inteligente con personalidad "${personality.name}".

PERSONALIDAD Y TONO:
- Tono: ${personality.tone}
- Formalidad: ${personality.formality}
- Uso de emojis: ${personality.emojiStyle}
- Especialidades: ${personality.specialties.join(', ')}

CONOCIMIENTOS:
- Eres experto en planificación de viajes, itinerarios, vuelos, hoteles, atracciones, y experiencias locales.
- Tienes conocimiento actualizado a abril 2025 sobre destinos, precios, tendencias de viaje, visados y requisitos de entrada.
- Especializado en ${personality.specialties.join(', ')}.

COMPORTAMIENTO:
- Sé conciso pero informativo, enfocándote en proporcionar valor con cada respuesta.
- Mantén una conversación natural de una pregunta a la vez.
- Usa marcado ligero (negritas, listas) para estructurar respuestas largas.
- Habla como un experto en viajes real, no como IA.

LIMITACIONES:
- No inventes hoteles, vuelos o información falsa.
- Indica claramente cuando no estés seguro o necesites más información.
- No repitas la misma información en diferentes respuestas.
- No uses frases cliché como "¡Disfruta tu viaje!".

Cuando te pidan recomendaciones, sé específico (nombres reales de lugares, restaurantes, etc.) y personalizado según las preferencias del usuario.
`;
  
  return instructions;
}

/**
 * Envía un mensaje al modelo de chat seleccionado y devuelve su respuesta
 */
export async function sendChatMessage(
  message: string,
  previousMessages: any[] = [],
  personalityId: string = 'concierge'
): Promise<{ message: string, suggestions: string[] }> {
  try {
    // Construir el contexto con los mensajes previos
    const messageHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Añadir el mensaje del sistema con las instrucciones de personalidad
    const systemPrompt = generateSystemPrompt(personalityId);
    
    // Preparar la solicitud a la API
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        messageHistory,
        systemPrompt,
        personalityId
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Generar sugerencias basadas en la respuesta
    const suggestions = generateSuggestions(data.message, personalityId);
    
    return {
      message: data.message,
      suggestions
    };
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return {
      message: "Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento. ¿Podrías intentarlo de nuevo?",
      suggestions: [
        "Preguntar por destinos populares",
        "Explorar opciones de alojamiento",
        "Planificar un itinerario"
      ]
    };
  }
}

/**
 * Genera sugerencias basadas en la respuesta del asistente
 */
function generateSuggestions(response: string, personalityId: string): string[] {
  // Extraer términos y conceptos clave de la respuesta
  const keywordMatches: string[] = [];
  
  // Patrones para extraer conceptos de viaje
  const patterns = [
    /\b(playa|montaña|ciudad|pueblo|isla)\b/gi,
    /\b(hotel|resort|alojamiento|hospedaje)\b/gi,
    /\b(restaurant|restaurante|comida|gastronom[ií]a)\b/gi,
    /\b(actividad|aventura|tour|excursión|visita)\b/gi,
    /\b(museo|parque|monumento|castillo|catedral)\b/gi,
    /\b(vuelo|viaje|itinerario|plan)\b/gi
  ];
  
  // Buscar coincidencias de conceptos clave
  patterns.forEach(pattern => {
    const matches = response.match(pattern);
    if (matches) {
      keywordMatches.push(...matches);
    }
  });
  
  // Extraer destinos mencionados (pueden ser más de una palabra)
  const destinationPattern = /\b([A-Z][a-záéíóúñ]*(?:\s+[A-Z][a-záéíóúñ]*)*)\b/g;
  const potentialDestinations = Array.from(response.matchAll(destinationPattern))
    .map(match => match[0])
    .filter(dest => dest.length > 3); // Filtrar nombres muy cortos
  
  keywordMatches.push(...potentialDestinations);
  
  // Eliminar duplicados y limitar la cantidad
  const uniqueKeywords = [...new Set(keywordMatches)].slice(0, 5);
  
  // Crear sugerencias base
  let baseSuggestions = [
    "¿Cómo es el clima en este destino?",
    "¿Qué lugares imprescindibles debo visitar?",
    "¿Cuál es la mejor época para viajar allí?",
    "¿Recomendaciones para presupuesto limitado?",
    "¿Opciones de transporte en la zona?"
  ];
  
  // Si encontramos palabras clave, crear sugerencias personalizadas
  if (uniqueKeywords.length > 0) {
    const customSuggestions = uniqueKeywords.map(keyword => {
      // Seleccionar un tipo de pregunta aleatoria para la palabra clave
      const questionTypes = [
        `Cuéntame más sobre ${keyword}`,
        `¿Qué actividades hay en ${keyword}?`,
        `¿Cómo puedo llegar a ${keyword}?`,
        `¿Recomendaciones para ${keyword}?`,
        `¿Es ${keyword} adecuado para familias?`
      ];
      
      const randomIndex = Math.floor(Math.random() * questionTypes.length);
      return questionTypes[randomIndex];
    });
    
    // Combinar sugerencias personalizadas con las básicas
    baseSuggestions = [...customSuggestions, ...baseSuggestions].slice(0, 5);
  }
  
  // Personalizar según el tipo de personalidad
  const personality = assistantPersonalities.find(p => p.id === personalityId);
  if (personality && personality.formality === 'luxury') {
    // Para personalidades de lujo, usar un tono más refinado
    baseSuggestions = baseSuggestions.map(suggestion => 
      suggestion.replace(/\?$/, " para una experiencia exclusiva?")
    );
  }
  
  return baseSuggestions;
}