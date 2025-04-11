/**
 * Vertex AI Integration for JetAI
 * 
 * Este archivo integra la API de Google Vertex AI con gemini-1.5-flash para
 * proporcionar una experiencia conversacional fluida en JetAI.
 */

import { VertexAI } from '@google-cloud/vertexai';

// Configuración de Vertex AI
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'jetai-travel-companion';
const LOCATION = 'us-central1';
const MODEL = 'gemini-1.5-flash';

// Inicializar Vertex AI
let vertexAI: VertexAI;

try {
  vertexAI = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
  });
  console.log('Vertex AI initialized successfully');
} catch (error) {
  console.error('Error initializing Vertex AI:', error);
}

// Tipo para los mensajes de chat
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Tipo para la memoria de conversación
export interface ConversationMemory {
  destination: string;
  budget: string;
  dates: string;
  travelers: string;
  interests: string[];
  currentQuestion: 'greeting' | 'destination' | 'budget' | 'dates' | 'travelers' | 'interests' | 'summary';
  conversationStarted: boolean;
}

/**
 * Envía un mensaje al modelo Gemini y obtiene una respuesta
 */
export async function sendMessageToGemini(
  prompt: string,
  history: ChatMessage[] = [],
  options: {
    temperature?: number;
    maxOutputTokens?: number;
    systemPrompt?: string;
  } = {}
): Promise<string> {
  try {
    // Obtener el modelo Gemini
    const generativeModel = vertexAI.getGenerativeModel({
      model: MODEL,
      generation_config: {
        temperature: options.temperature || 0.2,
        max_output_tokens: options.maxOutputTokens || 1024,
      },
    });

    // Preparar los mensajes para la conversación
    const chatHistory = [];
    
    // Agregar el mensaje del sistema si existe
    if (options.systemPrompt) {
      chatHistory.push({ role: 'system', parts: [{ text: options.systemPrompt }] });
    }
    
    // Agregar el historial de mensajes
    for (const msg of history) {
      chatHistory.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
    
    // Agregar el mensaje actual
    chatHistory.push({ role: 'user', parts: [{ text: prompt }] });

    // Realizar la llamada a la API
    const chat = generativeModel.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error in Vertex AI call:', error);
    throw new Error(`Failed to get response from Gemini: ${error.message}`);
  }
}

/**
 * Envía un mensaje al modelo Gemini con el contexto de viaje
 */
export async function sendTravelContextMessage(
  userMessage: string,
  memory: ConversationMemory,
  history: ChatMessage[] = []
): Promise<string> {
  // Crear un prompt de sistema con el contexto actual
  let systemPrompt = `Eres JetAI, un asistente de viajes inteligente, emotivo y profesional. 
Estás ayudando al usuario a planificar un viaje.`;

  // Agregar el contexto de viaje si existe
  if (memory.destination) {
    systemPrompt += `\nDestino actual: ${memory.destination}`;
  }
  if (memory.budget) {
    systemPrompt += `\nPresupuesto: ${memory.budget}`;
  }
  if (memory.dates) {
    systemPrompt += `\nFechas: ${memory.dates}`;
  }
  if (memory.travelers) {
    systemPrompt += `\nViajeros: ${memory.travelers}`;
  }
  if (memory.interests && memory.interests.length > 0) {
    systemPrompt += `\nIntereses: ${memory.interests.join(', ')}`;
  }

  // Agregar el estado actual de la conversación
  systemPrompt += `\nPregunta actual: ${memory.currentQuestion}`;

  // Enviar el mensaje con el contexto
  return sendMessageToGemini(userMessage, history, {
    systemPrompt,
    temperature: 0.2,
  });
}

/**
 * Determina si un mensaje es un saludo
 */
export function isGreeting(input: string): boolean {
  const greetings = ['hello', 'hi', 'hey', 'hola', 'buenos días', 'buenas', 'saludos'];
  const lowercaseInput = input.toLowerCase().trim();
  
  // Verificar si es exactamente un saludo (posiblemente con puntuación)
  const exactGreeting = greetings.some(greeting => 
    lowercaseInput === greeting || 
    lowercaseInput === `${greeting}!` || 
    lowercaseInput === `${greeting}.` ||
    lowercaseInput === `${greeting}?`);
  
  // Verificar si es un saludo corto
  const hasShortGreeting = lowercaseInput.split(/\s+/).length <= 2 && 
                     greetings.some(greeting => lowercaseInput.includes(greeting));
                     
  return exactGreeting || hasShortGreeting;
}

/**
 * Procesa una respuesta del usuario y actualiza la memoria de conversación
 */
export function processUserResponse(
  input: string, 
  currentMemory: ConversationMemory
): ConversationMemory {
  // Clonar la memoria actual para no modificar el original
  const memory = { ...currentMemory };
  
  // Marcar que la conversación ha comenzado
  memory.conversationStarted = true;
  
  // Si el mensaje es un saludo y estamos en la etapa inicial, mantener la pregunta actual
  if (isGreeting(input) && memory.currentQuestion === 'greeting') {
    console.log("Detected greeting in initial stage, keeping current question");
    return memory;
  }
  
  // Procesar la respuesta según la pregunta actual
  switch (memory.currentQuestion) {
    case 'greeting':
      memory.currentQuestion = 'destination';
      break;
      
    case 'destination':
      // Extraer el destino (implementar lógica más robusta según necesidades)
      memory.destination = input.trim();
      memory.currentQuestion = 'budget';
      break;
      
    case 'budget':
      memory.budget = input.trim();
      memory.currentQuestion = 'dates';
      break;
      
    case 'dates':
      memory.dates = input.trim();
      memory.currentQuestion = 'travelers';
      break;
      
    case 'travelers':
      memory.travelers = input.trim();
      memory.currentQuestion = 'interests';
      break;
      
    case 'interests':
      // Extraer intereses como array
      memory.interests = input.split(',').map(i => i.trim());
      memory.currentQuestion = 'summary';
      break;
      
    case 'summary':
      // En el resumen, mantenemos el mismo estado a menos que
      // se detecte una intención específica de cambiar algo
      break;
  }
  
  return memory;
}

/**
 * Genera la siguiente pregunta basada en el estado actual de la conversación
 */
export function generateNextQuestion(memory: ConversationMemory): string {
  switch (memory.currentQuestion) {
    case 'greeting':
      return "¡Bienvenido a JetAI! Soy tu asistente personal de viajes. ¿En qué puedo ayudarte hoy?";
      
    case 'destination':
      return "¡Excelente! Para comenzar, me encantaría saber: ¿a dónde te gustaría viajar?";
      
    case 'budget':
      return `${memory.destination} es una excelente elección! Para personalizar tu experiencia, ¿podrías compartir tu presupuesto aproximado para este viaje? (Lujo, Medio, Económico)`;
      
    case 'dates':
      return `¡Perfecto! ¿Y cuándo planeas visitar ${memory.destination}? (Mes, temporada o fechas específicas)`;
      
    case 'travelers':
      return `¡Estupendo! ¿Viajarás solo, en pareja, o con familia/amigos?`;
      
    case 'interests':
      return `¡Maravilloso! Para crear la experiencia perfecta en ${memory.destination}, ¿qué actividades o experiencias te interesan más? (Playa, cultura, gastronomía, aventura, etc.)`;
      
    case 'summary':
      return `¡Gracias por todos los detalles! Esto es lo que tengo para tu viaje:\n\n` +
             `🌍 Destino: ${memory.destination}\n` +
             `💰 Presupuesto: ${memory.budget}\n` +
             `📅 Fechas: ${memory.dates}\n` +
             `👥 Viajeros: ${memory.travelers}\n` +
             `🎯 Intereses: ${memory.interests.join(', ')}\n\n` +
             `¿Te gustaría que creara un itinerario personalizado basado en esta información, o hay algo que te gustaría ajustar?`;
             
    default:
      return "¿Qué más te gustaría saber sobre tu próximo viaje?";
  }
}

/**
 * Analiza un mensaje del usuario para detectar intenciones específicas
 */
export async function analyzeUserIntent(
  message: string,
  memory: ConversationMemory
): Promise<{
  intent: string;
  confidence: number;
  entities?: Record<string, string>;
}> {
  try {
    // Enviar a Gemini para análisis de intención
    const prompt = `
    Analiza este mensaje del usuario e identifica la intención principal.
    Opciones de intención: greeting, destination_query, budget_query, dates_query, traveler_query, interests_query, itinerary_request, change_info, general_question.
    
    Mensaje: "${message}"
    
    Responde en formato JSON con esta estructura exacta:
    {
      "intent": "nombre_de_la_intención",
      "confidence": 0.95,
      "entities": {
        // Entidades detectadas como pares clave-valor (opcional)
      }
    }
    `;
    
    const response = await sendMessageToGemini(prompt, [], {
      systemPrompt: "Eres un analizador de intenciones de viaje. Tu trabajo es extraer la intención principal de los mensajes de los usuarios y convertirlos en datos estructurados.",
      temperature: 0.1,
    });
    
    // Parsear la respuesta JSON
    try {
      const jsonResponse = JSON.parse(response);
      return jsonResponse;
    } catch (e) {
      console.error("Error parsing intent analysis response:", e);
      // Fallback a análisis básico
      return {
        intent: isGreeting(message) ? "greeting" : "general_question",
        confidence: 0.6
      };
    }
  } catch (error) {
    console.error("Error in intent analysis:", error);
    return {
      intent: "unknown",
      confidence: 0.5
    };
  }
}