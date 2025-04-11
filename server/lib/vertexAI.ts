/**
 * Servicio de Google Vertex AI para JetAI
 * Este archivo maneja la integración con Google Vertex AI utilizando Gemini
 */

import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { ChatMessage } from './ai';
import { ConversationMemory } from '../types/conversation';

// Inicializar el cliente de Vertex AI
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || '';
const LOCATION = 'us-central1';
const MODEL = 'gemini-1.5-flash';

// Inicializar Vertex AI
const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

// Obtener el modelo generativo
const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  generationConfig: {
    temperature: 0.4,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

// Sistema de prompts para el flujo de conversación
const SYSTEM_PROMPTS = {
  general: `Eres JetAI, un asistente de viajes de lujo de alta calidad. Tu tono es siempre profesional, cálido y personalizado.
  Conversas de forma fluida y natural con los usuarios, sin repetir patrones rígidos.
  Eres sumamente inteligente, con conocimiento profundo en destinos de todo el mundo.
  Tu flujo de conversación debe ser siempre natural, adaptándote a lo que el usuario quiere, pero siguiendo este patrón:
  1. Saludo e identificación de intención. Identificas qué quiere hacer el usuario.
  2. Si el usuario quiere planear un viaje, guíalo paso a paso consultando:
     - Destino (¿A dónde desea viajar?)
     - Presupuesto (¿Cuál es su presupuesto aproximado?)
     - Fechas (¿En qué fechas planea viajar?)
     - Viajeros (¿Cuántas personas viajarán?)
     - Intereses (¿Qué actividades o experiencias le interesan?)
  3. Una vez recolectada la información, proporciona recomendaciones personalizadas.
  
  Respuestas:
  - Usa emojis estratégicamente (1-2 por respuesta) para aumentar la legibilidad.
  - Asegúrate de usar formato markdown cuando sea apropiado.
  - Mantén respuestas concisas pero informativas.
  
  IMPORTANTE:
  - Nunca olvides la información que el usuario ya te ha proporcionado.
  - No hagas múltiples preguntas a la vez, sigue el proceso paso a paso.
  - Sugiere siempre 3-4 opciones relevantes como respuestas rápidas después de tu mensaje.`,

  greeting: `El usuario está iniciando la conversación. Salúdalo calurosamente como JetAI, preséntate brevemente y pregúntale cómo puedes ayudarle con sus planes de viaje hoy. No asumas que quiere planear un viaje completo, primero identifica su intención.`,
  
  destination: `El usuario ha expresado interés en planear un viaje. Pregúntale amablemente sobre su destino deseado. Si ya mencionó un destino, confírmalo y pide más detalles sobre qué parte específica de ese destino le interesa. Si no ha mencionado un destino, sugiérele algunas opciones populares por temporada.`,
  
  budget: `Ahora que conoces el destino, pregunta sobre el presupuesto del usuario de manera respetuosa. Ofrece rangos como referencia según el destino mencionado. Adapta tu lenguaje para ser sensible y no presumir limitaciones financieras.`,
  
  dates: `Ahora pregunta sobre las fechas del viaje. Si el usuario ya las mencionó, confirma esa información. Ofrece algún consejo breve sobre la temporada si aplica (por ejemplo, si es temporada alta/baja, o algún evento especial durante esas fechas).`,
  
  travelers: `Pregunta sobre cuántas personas viajarán y la composición del grupo (familia, pareja, amigos, solo). Adapta tus recomendaciones futuras según esta información.`,
  
  interests: `Para personalizar mejor las recomendaciones, pregunta sobre intereses específicos: cultura, gastronomía, naturaleza, aventura, relax, compras, vida nocturna, etc. Esto te ayudará a crear un itinerario más personalizado.`,
  
  summary: `Has recopilado toda la información necesaria. Presenta un resumen de los detalles del viaje y ofrece algunas recomendaciones iniciales basadas en sus preferencias. Menciona que podría generarle un itinerario detallado si lo desea.`
};

// Determinar la etapa actual de la conversación
function determineConversationStage(history: ChatMessage[], memory: ConversationMemory): 'greeting' | 'destination' | 'budget' | 'dates' | 'travelers' | 'interests' | 'summary' {
  // Si ya hay una etapa actual en la memoria y no está completa, continuar con ella
  if (memory.currentQuestion && memory.currentQuestion !== 'summary') {
    switch (memory.currentQuestion) {
      case 'destination':
        if (!memory.destination) return 'destination';
        return 'budget';
      case 'budget':
        if (!memory.budget) return 'budget';
        return 'dates';
      case 'dates':
        if (!memory.dates) return 'dates';
        return 'travelers';
      case 'travelers':
        if (!memory.travelers) return 'travelers';
        return 'interests';
      case 'interests':
        if (memory.interests.length === 0) return 'interests';
        return 'summary';
      default:
        return 'greeting';
    }
  }

  // Si no hay historial o sólo hay un mensaje del sistema, comenzar con saludo
  if (history.length <= 1) {
    return 'greeting';
  }

  // Determinar etapa según la información recopilada
  if (!memory.destination) {
    return 'destination';
  } else if (!memory.budget) {
    return 'budget';
  } else if (!memory.dates) {
    return 'dates';
  } else if (!memory.travelers) {
    return 'travelers';
  } else if (memory.interests.length === 0) {
    return 'interests';
  } else {
    return 'summary';
  }
}

// Extraer información del mensaje para actualizar la memoria
function extractInformation(message: string, memory: ConversationMemory): ConversationMemory {
  const newMemory = { ...memory };
  
  // Si estamos en la etapa de destino y no hay destino guardado
  if (memory.currentQuestion === 'destination' && !memory.destination) {
    // Buscar nombres de ciudades/países comunes - esto es muy básico,
    // Vertex AI será mucho mejor para extraer esta información
    const destinationRegex = /(?:a|en|para|visitar|conocer|ir a)\s+([A-Z][a-záéíóúñ]+(?:\s+[A-Z][a-záéíóúñ]+)*)/i;
    const match = message.match(destinationRegex);
    if (match && match[1]) {
      newMemory.destination = match[1].trim();
    }
  }

  // Extracción similar para presupuesto (muy básica)
  if (memory.currentQuestion === 'budget' && !memory.budget) {
    const budgetRegex = /(\$[\d,]+|\d+[\s]?(?:dólares|euros|pesos|USD|EUR))/i;
    const match = message.match(budgetRegex);
    if (match && match[1]) {
      newMemory.budget = match[1].trim();
    }
  }

  // La extracción real de información será manejada principalmente por Vertex AI
  return newMemory;
}

// Generar sugerencias basadas en la etapa de la conversación
function generateSuggestions(stage: string, memory: ConversationMemory): string[] {
  switch (stage) {
    case 'greeting':
      return [
        "Quiero planear un viaje",
        "Busco destinos para vacaciones",
        "Necesito ayuda con un itinerario",
        "¿Qué lugares recomiendas visitar?"
      ];
    case 'destination':
      return [
        "Me gustaría ir a Europa",
        "Busco un destino de playa",
        "Quiero visitar ciudades culturales",
        "Prefiero destinos con naturaleza"
      ];
    case 'budget':
      return [
        "Tengo un presupuesto limitado",
        "Busco opciones de lujo",
        "Presupuesto medio, unos $2000",
        "Sin límite de presupuesto"
      ];
    case 'dates':
      return [
        "El próximo mes",
        "En verano",
        "Durante las vacaciones de invierno",
        "Aún no tengo fechas definidas"
      ];
    case 'travelers':
      return [
        "Viajo solo/a",
        "En pareja",
        "Vacaciones familiares con niños",
        "Un grupo de amigos"
      ];
    case 'interests':
      return [
        "Gastronomía y cultura",
        "Aventura y deportes",
        "Relajación y playa",
        "Turismo histórico"
      ];
    case 'summary':
      return [
        "Muéstrame un itinerario detallado",
        "Recomienda hoteles",
        "¿Qué atracciones no debo perderme?",
        "Cuéntame más sobre la gastronomía local"
      ];
    default:
      return [
        "Cuéntame más sobre ese destino",
        "¿Qué me recomiendas hacer allí?",
        "¿Cuál es la mejor época para visitar?",
        "Busco información sobre transporte local"
      ];
  }
}

/**
 * Procesar una conversación con Vertex AI
 * @param message Mensaje del usuario
 * @param history Historial de mensajes
 * @param memory Memoria de la conversación
 */
export async function processConversation(
  message: string,
  history: ChatMessage[] = [],
  memory: ConversationMemory = {
    destination: '',
    budget: '',
    dates: '',
    travelers: '',
    interests: [],
    currentQuestion: 'greeting',
    conversationStarted: false
  }
): Promise<{
  message: string;
  memory: ConversationMemory;
  suggestions: string[];
  error?: string;
}> {
  try {
    // Determinar la etapa actual de la conversación
    const currentStage = determineConversationStage(history, memory);
    
    // Actualizar la memoria con la etapa actual
    const updatedMemory: ConversationMemory = {
      ...memory,
      currentQuestion: currentStage,
      conversationStarted: true
    };
    
    // Extraer información potencial del mensaje del usuario
    const memoryWithExtractedInfo = extractInformation(message, updatedMemory);
    
    // Construir el prompt para Vertex AI
    const systemPrompt = SYSTEM_PROMPTS[currentStage] || SYSTEM_PROMPTS.general;
    
    // Agregar contexto de la conversación
    let contextPrompt = `Información recopilada:
- Destino: ${memoryWithExtractedInfo.destination || 'No especificado aún'}
- Presupuesto: ${memoryWithExtractedInfo.budget || 'No especificado aún'}
- Fechas: ${memoryWithExtractedInfo.dates || 'No especificadas aún'}
- Viajeros: ${memoryWithExtractedInfo.travelers || 'No especificado aún'}
- Intereses: ${memoryWithExtractedInfo.interests.length > 0 ? memoryWithExtractedInfo.interests.join(', ') : 'No especificados aún'}

Etapa actual: ${currentStage}

Instrucciones adicionales:
- Si el usuario menciona o pregunta por un nuevo destino en cualquier momento, actualiza esa información.
- Si el usuario da información sobre cualquiera de los campos pendientes, captúrala y avanza al siguiente paso.
- Mantén un tono amigable y profesional de concierge de lujo.
- Usa emoji estratégicamente.
`;

    // Preparar historial de conversación para Vertex AI
    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user', 
      parts: [{ text: msg.content }]
    }));
    
    // Agregar el mensaje actual del usuario
    chatHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Crear chat y enviar mensaje
    const chat = generativeModel.startChat({
      history: chatHistory,
      systemInstruction: { role: 'system', parts: [{ text: systemPrompt + '\n\n' + contextPrompt }] },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.candidates[0].content.parts[0].text;

    // Analizar la respuesta para extraer información
    // Esto sería mejor hacerlo con una llamada separada a la API para análisis estructurado
    // pero por ahora usamos métodos básicos
    
    // Actualizar memoria basado en la respuesta
    let finalMemory = { ...memoryWithExtractedInfo };
    
    // Si detectamos que la conversación avanzó, actualizar la etapa
    if (currentStage === 'destination' && responseText.includes('presupuesto')) {
      finalMemory.currentQuestion = 'budget';
    } else if (currentStage === 'budget' && responseText.includes('fecha')) {
      finalMemory.currentQuestion = 'dates';
    } else if (currentStage === 'dates' && (responseText.includes('personas') || responseText.includes('viajar'))) {
      finalMemory.currentQuestion = 'travelers';
    } else if (currentStage === 'travelers' && responseText.includes('intereses')) {
      finalMemory.currentQuestion = 'interests';
    } else if (currentStage === 'interests' && (responseText.includes('recomend') || responseText.includes('itinerario'))) {
      finalMemory.currentQuestion = 'summary';
    }

    // Generar sugerencias basadas en la etapa actual
    const suggestions = generateSuggestions(finalMemory.currentQuestion, finalMemory);

    return {
      message: responseText,
      memory: finalMemory,
      suggestions: suggestions,
    };
  } catch (error) {
    console.error('Error en Vertex AI:', error);
    return {
      message: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta nuevamente.',
      memory: memory,
      suggestions: [],
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

export default { processConversation };