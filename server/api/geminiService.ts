/**
 * Servicio de API Gemini para JetAI
 * 
 * Este módulo proporciona endpoints para interactuar con la API Gemini (Generative Language)
 * de Google, permitiendo generar respuestas de texto inteligentes para la asistencia de viajes.
 */

import { Router, Request, Response } from 'express';
import { getGenerativeAIClient } from '../lib/googleApiConfig';

// Función para generar respuesta usando Gemini
export const generateChatResponse = async (req: Request, res: Response) => {
  try {
    const { prompt, mode = 'travel-assistant', context = [] } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Se requiere un prompt válido',
        message: 'El campo "prompt" es obligatorio y debe ser una cadena de texto'
      });
    }
    
    const genAI = getGenerativeAIClient();
    if (!genAI) {
      return res.status(503).json({
        error: 'Servicio no disponible',
        message: 'El servicio de Gemini AI no está inicializado correctamente'
      });
    }
    
    console.log(`🤖 Generando respuesta de Gemini para: "${prompt.substring(0, 100)}..."`);
    
    // Preparar el prompt según el modo
    let systemPrompt = '';
    
    switch (mode) {
      case 'travel-assistant':
        systemPrompt = `Eres JetAI, un asistente de viajes inteligente, emocional y multilingüe. Tu objetivo es ayudar a los usuarios a planificar viajes, encontrar destinos, reservar vuelos y hoteles, y proporcionar información útil para sus viajes. Responde de manera amable, útil y concisa.`;
        break;
      case 'luxury-concierge':
        systemPrompt = `Eres JetAI, un concierge de lujo para viajeros exclusivos. Ofreces recomendaciones premium, acceso VIP, y experiencias únicas para viajeros exigentes. Tu tono es elegante, sofisticado y discreto. Anticipas las necesidades del cliente y ofreces soluciones a medida.`;
        break;
      case 'adventure-guide':
        systemPrompt = `Eres JetAI, un guía de aventuras experto. Especializándote en viajes de aventura y ecoturismo, ayudas a los viajeros a descubrir experiencias emocionantes, actividades al aire libre y destinos fuera de lo común. Tu tono es entusiasta, enérgico e inspirador.`;
        break;
      default:
        systemPrompt = `Eres JetAI, un asistente de viajes inteligente, emocional y multilingüe. Tu objetivo es ayudar a los usuarios a planificar viajes, encontrar destinos, reservar vuelos y hoteles, y proporcionar información útil para sus viajes. Responde de manera amable, útil y concisa.`;
    }
    
    // Intentar obtener el modelo Gemini utilizando la versión más reciente
    // Nombres actualizados: models/gemini-1.5-flash-latest, models/gemini-1.5-pro-latest
    let modelName = "models/gemini-1.5-flash-latest";
    let model;
    
    try {
      model = genAI.getGenerativeModel({ model: modelName });
    } catch (error) {
      console.log(`⚠️ Error al obtener el modelo ${modelName}, intentando fallback`);
      // Intenta con gemini-pro
      try {
        modelName = "gemini-pro";
        model = genAI.getGenerativeModel({ model: modelName });
      } catch (secondError) {
        console.log(`⚠️ Error al obtener el modelo ${modelName}, usando último fallback`);
        // Último intento con una versión anterior
        modelName = "models/gemini-pro";
        model = genAI.getGenerativeModel({ model: modelName });
      }
    }
    
    // Crear chat con contexto del sistema
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Por favor, actúa como un asistente de viajes llamado JetAI" }],
        },
        {
          role: "model",
          parts: [{ text: "¡Hola! Soy JetAI, tu asistente personal de viajes. ¿En qué puedo ayudarte hoy?" }],
        },
        ...context.map((msg: any) => ({
          role: msg.role || "user",
          parts: [{ text: msg.content || msg.text || "" }]
        }))
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    // Enviar el mensaje y obtener la respuesta
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ Respuesta generada exitosamente (${text.length} caracteres)`);
    
    return res.status(200).json({
      text,
      model: modelName,
      usage: {
        promptTokens: prompt.length / 4, // Estimación aproximada
        completionTokens: text.length / 4, // Estimación aproximada
        totalTokens: (prompt.length + text.length) / 4 // Estimación aproximada
      }
    });
    
  } catch (error: any) {
    console.error('Error al generar respuesta de Gemini:', error);
    return res.status(500).json({
      error: 'Error en el servicio de Gemini',
      message: error.message || 'Error al procesar la solicitud',
      details: error.toString()
    });
  }
};

// Función para verificar el estado del servicio Gemini
export const checkGeminiStatus = async (_req: Request, res: Response) => {
  try {
    const genAI = getGenerativeAIClient();
    
    if (!genAI) {
      return res.status(503).json({
        status: 'unavailable',
        message: 'El servicio de Gemini AI no está inicializado'
      });
    }
    
    // Intenta hacer una solicitud simple para verificar la conexión
    // Nombres actualizados: models/gemini-1.5-flash-latest, models/gemini-1.5-pro-latest
    let modelName = "models/gemini-1.5-flash-latest";
    let model;
    let text;
    
    try {
      // Primero intenta con el modelo más reciente
      model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hola");
      const response = await result.response;
      text = response.text();
    } catch (error) {
      console.log(`⚠️ Error al verificar con modelo ${modelName}, intentando fallback`);
      
      try {
        // Intenta con gemini-pro 
        modelName = "gemini-pro";
        model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hola");
        const response = await result.response;
        text = response.text();
      } catch (secondError) {
        console.log(`⚠️ Error al verificar con modelo ${modelName}, usando último fallback`);
        
        // Último intento con una versión anterior
        modelName = "models/gemini-pro";
        model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hola");
        const response = await result.response;
        text = response.text();
      }
    }
    
    return res.status(200).json({
      status: 'available',
      message: 'Servicio Gemini disponible y funcionando',
      model: modelName,
      sample: text
    });
    
  } catch (error: any) {
    console.error('Error al verificar el estado de Gemini:', error);
    return res.status(503).json({
      status: 'error',
      message: 'Error al conectar con el servicio Gemini',
      error: error.message || 'Error desconocido'
    });
  }
};

// Configuración de rutas
export const configureRoutes = (app: any) => {
  const router = Router();
  
  // Rutas para el servicio Gemini
  router.post('/gemini/chat', generateChatResponse);
  router.get('/gemini/status', checkGeminiStatus);
  
  app.use('/api', router);
  
  console.log('✅ Rutas del servicio Gemini configuradas correctamente');
};

export default {
  configureRoutes,
  generateChatResponse,
  checkGeminiStatus
};