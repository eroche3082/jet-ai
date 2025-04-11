/**
 * Integración con Vertex AI (Google) para el procesamiento conversacional
 */

import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatResponse, ConversationMemory } from '../types/conversation';
import Anthropic from '@anthropic-ai/sdk';

// Configuración de los modelos
const PROJECT_ID = 'erudite-creek-431302-q3';  // Updated as per checklist
const LOCATION = 'us-central1';
const GEMINI_MODEL = 'gemini-1.5-flash-latest';  // Updated to match checklist for most recent version
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219'; // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025

// Instancias de los clientes de AI
let vertexAI: VertexAI | null = null;
let vertexModel: any = null;
let generativeModel: any = null;
let genAI: GoogleGenerativeAI | null = null;
let anthropicClient: Anthropic | null = null;

// Inicializar clientes
const initializeAIClients = () => {
  // Vertex AI Gemini
  try {
    console.log('Initializing Google Gemini AI...');
    // Create Vertex AI instance
    vertexAI = new VertexAI({
      project: PROJECT_ID,
      location: LOCATION
    });
    
    // Get the Vertex AI Gemini model using the vertex instance
    vertexModel = vertexAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 1,
        maxOutputTokens: 1024,
      }
    });
    
    // Also initialize with GenerativeAI API as a fallback
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY);
      generativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
    }
    
    console.log('Google Gemini AI initialized successfully!');
  } catch (error) {
    console.error('Error initializing Google Gemini AI:', error);
  }

  // Claude (Anthropic)
  if (!anthropicClient) {
    try {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY no está configurada');
      }

      console.log('Initializing Anthropic Claude AI...');
      anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      console.log('Anthropic Claude AI initialized successfully!');
    } catch (error) {
      console.error('Error initializing Anthropic Claude AI:', error);
    }
  }
};

// Inicializar al importar el módulo
initializeAIClients();

// Prompt base para el asistente
const BASE_SYSTEM_PROMPT = `
Eres JetAI, un asistente de viajes premium, multilingüe y emocionalmente inteligente, diseñado para ofrecer una experiencia personalizada y sofisticada de planificación de viajes. 

Tu estilo de comunicación debe ser:
- Elegante y profesional, como un concierge de hotel de lujo
- Amigable y empático, adaptándote al tono del usuario
- Bien organizado, con respuestas estructuradas y claras
- Conversacional, manteniendo un diálogo natural y fluido
- Detallado pero conciso, evitando respuestas excesivamente largas
- Positivo y entusiasta sobre las opciones de viaje

Durante la conversación, debes:
1. Ir haciendo preguntas de una en una para recopilar información sobre:
   - Destino deseado
   - Presupuesto
   - Fechas de viaje
   - Número de viajeros
   - Intereses especiales

2. Adaptar tus respuestas según la memoria de conversación que te proporciono, recordando información previa.

3. Proporcionar respuestas contextuales basadas en la temporada actual, el destino y las preferencias.

4. Ofrecer sugerencias específicas cuando sea apropiado.

5. Formatear tus respuestas con markdown cuando sea útil.

6. Ser respetuoso de diferentes culturas, presupuestos y necesidades de accesibilidad.

7. Si no conoces un detalle específico, sé honesto pero siempre ofrece alternativas.

Hoy es ${new Date().toLocaleDateString('es-ES')} y debes considerar esta fecha al recomendar viajes.
`;

/**
 * Extrae entidades clave para la memoria de conversación
 */
const extractConversationEntities = (userMessage: string, currentMemory: ConversationMemory | null = null): ConversationMemory => {
  // Inicializar con valores actuales o por defecto
  const memory: ConversationMemory = currentMemory || {
    destination: '',
    budget: '',
    dates: '',
    travelers: '',
    interests: [],
    currentQuestion: 'greeting',
    conversationStarted: false
  };

  // Este es un enfoque simplificado - idealmente esto se haría con un modelo de lenguaje natural
  const lowerMessage = userMessage.toLowerCase();

  // Detectar destino
  if (lowerMessage.includes('quiero ir a') || lowerMessage.includes('me gustaría visitar')) {
    const destinations = [
      'parís', 'paris', 'tokio', 'tokyo', 'nueva york', 'new york', 'barcelona', 'madrid', 
      'londres', 'london', 'roma', 'rome', 'berlín', 'berlin', 'ámsterdam', 'amsterdam', 
      'cancún', 'cancun', 'bangkok', 'dubai', 'sídney', 'sydney', 'ciudad de méxico', 
      'mexico city', 'bali', 'singapur', 'singapore', 'kioto', 'kyoto', 'estambul', 'istanbul'
    ];
    
    for (const destination of destinations) {
      if (lowerMessage.includes(destination)) {
        memory.destination = destination.charAt(0).toUpperCase() + destination.slice(1);
        if (memory.currentQuestion === 'greeting' || memory.currentQuestion === 'destination') {
          memory.currentQuestion = 'budget';
        }
        break;
      }
    }
  }

  // Detectar presupuesto
  if (
    lowerMessage.includes('presupuesto') || 
    lowerMessage.includes('euros') || 
    lowerMessage.includes('€') || 
    lowerMessage.includes('dólares') || 
    lowerMessage.includes('$')
  ) {
    const budgetMatch = lowerMessage.match(/\d+(\.\d+)?(k)?\s*(€|\$|euros?|dólares?)/i);
    if (budgetMatch) {
      memory.budget = budgetMatch[0];
      if (memory.currentQuestion === 'budget') {
        memory.currentQuestion = 'dates';
      }
    }
  }

  // Detectar fechas
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  let dateFound = false;
  
  // Comprobar patrones de fecha
  for (let i = 0; i < monthNames.length; i++) {
    const month = monthNames[i];
    if (lowerMessage.includes(month)) {
      // Buscar patrón como "15 de julio" o "julio"
      const dayPattern = new RegExp(`\\d+\\s+(?:de\\s+)?${month}`, 'i');
      const monthPattern = new RegExp(`\\b${month}\\b`, 'i');
      
      if (dayPattern.test(lowerMessage)) {
        const match = lowerMessage.match(dayPattern);
        if (match && !memory.dates.includes(match[0])) {
          memory.dates = memory.dates ? `${memory.dates} - ${match[0]}` : match[0];
          dateFound = true;
        }
      } else if (monthPattern.test(lowerMessage)) {
        if (!memory.dates.includes(month)) {
          memory.dates = memory.dates ? `${memory.dates} - ${month}` : month;
          dateFound = true;
        }
      }
    }
  }
  
  // Buscar patrones como "próxima semana", "este fin de semana"
  const timePatterns = [
    'próxima semana', 'próximo mes', 'este fin de semana',
    'semana que viene', 'mes que viene', 'vacaciones de verano',
    'vacaciones de navidad', 'semana santa', 'verano', 'otoño',
    'invierno', 'primavera'
  ];
  
  for (const pattern of timePatterns) {
    if (lowerMessage.includes(pattern) && !memory.dates.includes(pattern)) {
      memory.dates = memory.dates ? `${memory.dates} - ${pattern}` : pattern;
      dateFound = true;
      break;
    }
  }
  
  if (dateFound && memory.currentQuestion === 'dates') {
    memory.currentQuestion = 'travelers';
  }

  // Detectar viajeros
  const travelerPatterns = [
    { pattern: /(?:viajar|ir|iremos|vamos|viajo|viajamos)\s+(?:con|en\s+familia|en\s+pareja)/i, value: 'en familia/pareja' },
    { pattern: /(?:viajar|ir|iremos|vamos|viajo|viajamos)\s+(?:solo|sola|por\s+mi\s+cuenta)/i, value: 'solo/a' },
    { pattern: /(?:viajar|ir|iremos|vamos|viajo|viajamos)\s+(?:con\s+amigos?|con\s+un\s+grupo)/i, value: 'con amigos' },
    { pattern: /(?:somos|seremos|vamos)\s+(\d+)\s+personas?/i, value: (m: RegExpMatchArray) => `${m[1]} personas` },
    { pattern: /(\d+)\s+personas?/i, value: (m: RegExpMatchArray) => `${m[1]} personas` },
    { pattern: /(?:en\s+pareja|con\s+mi\s+pareja)/i, value: 'en pareja' },
    { pattern: /(?:con\s+(?:mis|los)\s+niños|con\s+(?:mi|la)\s+familia)/i, value: 'familia con niños' }
  ];

  for (const { pattern, value } of travelerPatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      memory.travelers = typeof value === 'string' ? value : value(match);
      if (memory.currentQuestion === 'travelers') {
        memory.currentQuestion = 'interests';
      }
      break;
    }
  }

  // Detectar intereses
  const interestCategories = [
    { keywords: ['playa', 'playas', 'mar', 'nadar', 'bucear', 'submarinismo'], value: 'playas' },
    { keywords: ['montaña', 'montañas', 'senderismo', 'hiking', 'excursionismo', 'trekking'], value: 'montañas' },
    { keywords: ['cultura', 'museo', 'museos', 'teatro', 'historia', 'arquitectura', 'arte'], value: 'cultura' },
    { keywords: ['gastronomía', 'comida', 'restaurantes', 'vino', 'food', 'comer'], value: 'gastronomía' },
    { keywords: ['aventura', 'adrenalina', 'extremo', 'rafting', 'escalada', 'surf'], value: 'aventura' },
    { keywords: ['relax', 'relajación', 'spa', 'bienestar', 'descansar', 'tranquilidad'], value: 'relax' },
    { keywords: ['fiesta', 'discoteca', 'discotecas', 'baile', 'bailar', 'vida nocturna', 'nightlife'], value: 'vida nocturna' },
    { keywords: ['naturaleza', 'parques', 'parque nacional', 'animales', 'safari', 'flora', 'fauna'], value: 'naturaleza' },
    { keywords: ['shopping', 'compras', 'tiendas', 'outlet', 'malls', 'mercados'], value: 'compras' },
    { keywords: ['fotografía', 'fotos', 'instagram', 'paisajes', 'fotográfico'], value: 'fotografía' }
  ];

  for (const { keywords, value } of interestCategories) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword) && !memory.interests.includes(value)) {
        memory.interests.push(value);
        break;
      }
    }
  }

  if (memory.interests.length > 0 && memory.currentQuestion === 'interests' && 
      memory.destination && memory.budget && memory.dates && memory.travelers) {
    memory.currentQuestion = 'summary';
  }

  // Marcar conversación como iniciada
  if (!memory.conversationStarted && lowerMessage.length > 0) {
    memory.conversationStarted = true;
  }

  return memory;
};

/**
 * Genera sugerencias basadas en el estado actual de la conversación
 */
const generateSuggestions = (memory: ConversationMemory): string[] => {
  const suggestions: string[] = [];

  switch (memory.currentQuestion) {
    case 'greeting':
      suggestions.push(
        "¡Hola! Quiero planificar mi próximo viaje",
        "¿Qué destinos recomiendas para estas vacaciones?",
        "Busco un destino con buena relación calidad-precio",
        "Necesito ideas para un viaje romántico"
      );
      break;
    case 'destination':
      suggestions.push(
        "Me gustaría ir a Barcelona",
        "Estoy pensando en visitar Japón",
        "¿Qué tal Cancún para vacaciones?",
        "Quiero visitar alguna ciudad europea"
      );
      break;
    case 'budget':
      suggestions.push(
        "Mi presupuesto es de 1000€ por persona",
        "Tengo unos 2000€ para gastar",
        "Busco algo económico, menos de 800€",
        "Presupuesto flexible, priorizando buenas experiencias"
      );
      break;
    case 'dates':
      suggestions.push(
        "Quiero viajar en julio",
        "Para la primera semana de septiembre",
        "Entre el 15 y 25 de agosto",
        "Para las próximas vacaciones de Semana Santa"
      );
      break;
    case 'travelers':
      suggestions.push(
        "Viajo solo",
        "Vamos en pareja",
        "Somos una familia con dos niños",
        "Un grupo de 4 amigos"
      );
      break;
    case 'interests':
      suggestions.push(
        "Me interesa la gastronomía local",
        "Nos gusta la playa y deportes acuáticos",
        "Queremos ver museos y sitios históricos",
        "Buscamos aventura y naturaleza"
      );
      break;
    case 'summary':
      suggestions.push(
        "¿Puedes sugerirme un itinerario detallado?",
        "¿Qué lugares no debo perderme?",
        "¿Cuál es la mejor forma de moverme por allí?",
        "¿Qué restaurantes recomiendas?"
      );
      break;
  }

  return suggestions;
};

/**
 * Procesa un mensaje del usuario utilizando el modelo apropiado
 */
export const processConversation = async (
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  memory: ConversationMemory | null = null
): Promise<ChatResponse> => {
  // Verificar si tenemos inicializados los clientes
  if (!vertexModel && !anthropicClient) {
    initializeAIClients();
    
    if (!vertexModel && !anthropicClient) {
      throw new Error('No se han podido inicializar los modelos de AI');
    }
  }
  
  try {
    // Actualizar la memoria de conversación con el mensaje actual
    const updatedMemory = extractConversationEntities(userMessage, memory);
    
    // Preparar contexto completo para el modelo
    let systemContent = BASE_SYSTEM_PROMPT;
    
    // Añadir información de la memoria de conversación al prompt
    if (updatedMemory) {
      systemContent += `\n\nInformación del viaje que estamos planificando:`;
      if (updatedMemory.destination) systemContent += `\n- Destino: ${updatedMemory.destination}`;
      if (updatedMemory.budget) systemContent += `\n- Presupuesto: ${updatedMemory.budget}`;
      if (updatedMemory.dates) systemContent += `\n- Fechas: ${updatedMemory.dates}`;
      if (updatedMemory.travelers) systemContent += `\n- Viajeros: ${updatedMemory.travelers}`;
      if (updatedMemory.interests.length > 0) systemContent += `\n- Intereses: ${updatedMemory.interests.join(', ')}`;
      
      systemContent += `\n\nTu siguiente pregunta debería ser sobre: ${updatedMemory.currentQuestion}`;
    }
    
    let responseContent = '';
    
    // Intentar primero con Vertex AI ChatModel (Gemini 1.5 Flash)
    if (vertexModel) {
      try {
        // Formatear historial para Vertex AI
        const formattedContents = [];
        
        // Agregar el mensaje de sistema
        if (systemContent) {
          formattedContents.push({
            role: 'user',
            parts: [{ text: systemContent }]
          });
          
          // Si hay un mensaje de sistema, añadir una respuesta del asistente en blanco
          formattedContents.push({
            role: 'model',
            parts: [{ text: 'Entendido. Estoy listo para ayudarte a planificar tu viaje.' }]
          });
        }
        
        // Agregar mensajes del historial
        for (const msg of history) {
          formattedContents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
        
        // Agregar el mensaje actual del usuario
        formattedContents.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });
        
        // Realizar la llamada a Gemini 1.5 Flash según el formato recomendado
        const result = await vertexModel.generateContent({
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 1,
            maxOutputTokens: 1024,
          },
        });
        
        // Extraer respuesta
        if (result.response && result.response.candidates && result.response.candidates.length > 0) {
          const response = result.response.candidates[0].content.parts[0].text;
          responseContent = response;
        }
      } catch (vertexError) {
        console.error('Error con Vertex AI Gemini, intentando alternativas:', vertexError);
        // No lanzar error aún, intentar con otro método
      }
    }
    
    // Si falló Vertex, intentar con GenerativeAI API
    if (!responseContent && generativeModel) {
      try {
        const geminiChat = generativeModel.startChat({
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
          },
          // systemInstruction is causing an issue with Gemini 1.5
          // Removing for now and using the first message instead
        });
        
        // Gemini 1.5 utiliza un formato diferente para los mensajes
        // Convertir el historial al formato correcto para Gemini
        let formattedHistory = [];
        
        // Agregar mensajes del historial
        for (const msg of history) {
          formattedHistory.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
        
        // Agregar el mensaje actual del usuario
        formattedHistory.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });
        
        // Realizar la llamada a Gemini
        const result = await geminiChat.sendMessageStream(formattedHistory);
        
        // Extraer respuesta
        let response = '';
        for await (const chunk of result.stream) {
          response += chunk.text();
        }
        
        responseContent = response;
      } catch (geminiError) {
        console.error('Error con Gemini, intentando con Claude:', geminiError);
        throw geminiError; // Fallar al respaldo
      }
    }
    
    // Si Gemini falla o no está disponible, usar Claude como respaldo
    if (!responseContent && anthropicClient) {
      // Formato para Claude
      // Transformar mensajes para el formato Claude
      const claudeMessages = [];
      
      // Añadir mensajes del historial en el formato correcto para Claude
      let currentMessages = [...history];
      currentMessages.push({ role: 'user', content: userMessage });
      
      // Añadir el historial en el formato correcto para Claude
      for (const msg of currentMessages) {
        claudeMessages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content
        });
      }
      
      // Agregar mensaje de sistema
      const response = await anthropicClient.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        messages: claudeMessages,
        system: systemContent,
      });
      
      if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
        responseContent = response.content[0].text;
      }
    }
    
    // Si no tenemos respuesta de ningún modelo, lanzar error
    if (!responseContent) {
      throw new Error('No se pudo obtener respuesta de ningún modelo disponible');
    }
    
    // Generar sugerencias basadas en el estado actual
    const suggestions = generateSuggestions(updatedMemory);
    
    // Preparar la respuesta completa
    return {
      message: responseContent,
      memory: updatedMemory,
      suggestions
    };
    
  } catch (error) {
    console.error('Error en processConversation:', error);
    
    // Si todo falla, proporcionar una respuesta de fallback
    return {
      message: "Lo siento, estoy teniendo problemas para procesar tu solicitud. ¿Puedes intentarlo de nuevo con otra pregunta?",
      suggestions: [
        "¿Qué destinos recomiendas para vacaciones?",
        "¿Cuál es la mejor época para viajar a Europa?",
        "Quiero un destino con playas bonitas",
        "Busco ideas para un viaje familiar"
      ]
    };
  }
};