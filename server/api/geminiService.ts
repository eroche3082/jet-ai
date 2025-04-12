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
    
    // Seleccionar modelo según el modo - para casos que requieran imagen o análisis más profundo
    let modelName = "models/gemini-1.5-flash-latest"; // modelo rápido por defecto
    let requestedModel = modelName; // guardamos el modelo solicitado originalmente
    
    // Si se solicita un modo específico que requiere análisis de imagen o capacidades avanzadas
    if (mode === 'vision' || mode === 'analyze' || mode === 'multimodal') {
      requestedModel = "models/gemini-1.5-pro-latest"; // modelo más poderoso con capacidades multimodales
    }
    
    // Lista priorizada de modelos a intentar (de más avanzado a más básico)
    const modelPriority = [
      requestedModel,             // 1. El modelo solicitado (Pro o Flash según el modo)
      "models/gemini-1.5-flash-latest", // 2. Flash como primera opción de fallback
      "gemini-pro",               // 3. Modelo antiguo como segunda opción
      "models/gemini-pro",        // 4. Última opción con nomenclatura alternativa
    ];
    
    // Filtrar los modelos duplicados para tener una lista única
    const uniqueModels: string[] = [];
    for (const model of modelPriority) {
      if (!uniqueModels.includes(model)) {
        uniqueModels.push(model);
      }
    }
    
    // Variable para almacenar el modelo una vez se inicialice con éxito
    let model;
    let modelError: Error | null = null;
    
    // Intentar cada modelo hasta que uno funcione
    for (const candidateModel of uniqueModels) {
      try {
        console.log(`🔄 Intentando inicializar modelo: ${candidateModel}`);
        model = genAI.getGenerativeModel({ model: candidateModel });
        modelName = candidateModel; // actualizar el nombre del modelo que se está usando
        console.log(`✅ Modelo inicializado con éxito: ${modelName}`);
        break; // Si tiene éxito, salimos del bucle
      } catch (error: any) { // tipo 'any' para poder acceder a error.message
        console.log(`⚠️ Error al inicializar modelo ${candidateModel}: ${error.message || 'Error desconocido'}`);
        modelError = error;
        // Continuar con el siguiente modelo
      }
    }
    
    // Si ningún modelo funcionó después de probar todos
    if (!model) {
      throw new Error(`No se pudo inicializar ningún modelo de Gemini: ${modelError?.message}`);
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
        ...context.map((msg: any) => {
          // Mapear 'assistant' a 'model' para compatibilidad con la API de Gemini
          const role = msg.role === 'assistant' ? 'model' : (msg.role || 'user');
          return {
            role: role,
            parts: [{ text: msg.content || msg.text || "" }]
          };
        })
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    // Intentar enviar el mensaje con el modelo actual y fallback si falla por cuota
    let text: string;
    let usedModel = modelName;
    let attemptCount = 0;
    const maxAttempts = 3;
    
    // Lista de modelos para intentar en orden de preferencia si el actual falla
    const fallbackModels = [
      "models/gemini-1.5-flash-latest", // Modelo flash es más permisivo con cuotas
      "gemini-pro",                    // Modelo antiguo como último recurso
    ].filter(m => m !== modelName); // Excluir el modelo actual
    
    try {
      // Primer intento con el modelo seleccionado
      console.log(`🔄 Intentando generar respuesta con modelo: ${modelName}`);
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      text = response.text();
      console.log(`✅ Respuesta generada exitosamente con ${modelName} (${text.length} caracteres)`);
    } catch (error: any) {
      console.log(`⚠️ Error al generar respuesta con modelo ${modelName}: ${error.message}`);
      
      // Si falló por exceder cuota, intentar con modelos de fallback
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        console.log('⚠️ Error de cuota o límite de velocidad, intentando con modelos alternativos...');
        
        // Intentar con cada modelo de fallback
        let fallbackSuccess = false;
        
        for (const fallbackModel of fallbackModels) {
          try {
            console.log(`🔄 Intentando fallback con modelo: ${fallbackModel}`);
            
            // Inicializar nuevo modelo de fallback
            const fallbackModelInstance = genAI.getGenerativeModel({ model: fallbackModel });
            
            // Crear un nuevo chat con el modelo de fallback
            const fallbackChat = fallbackModelInstance.startChat({
              history: [
                {
                  role: "user",
                  parts: [{ text: "Por favor, actúa como un asistente de viajes llamado JetAI" }],
                },
                {
                  role: "model",
                  parts: [{ text: "¡Hola! Soy JetAI, tu asistente personal de viajes. ¿En qué puedo ayudarte hoy?" }],
                },
                ...context.map((msg: any) => {
                  const role = msg.role === 'assistant' ? 'model' : (msg.role || 'user');
                  return {
                    role: role,
                    parts: [{ text: msg.content || msg.text || "" }]
                  };
                })
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40, 
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            });
            
            // Enviar el mensaje con el modelo de fallback
            const fallbackResult = await fallbackChat.sendMessage(prompt);
            const fallbackResponse = await fallbackResult.response;
            text = fallbackResponse.text();
            
            // Si llegamos aquí, funcionó el fallback
            fallbackSuccess = true;
            usedModel = fallbackModel;
            console.log(`✅ Respuesta generada exitosamente con modelo fallback ${fallbackModel} (${text.length} caracteres)`);
            break;
          } catch (fallbackError: any) {
            console.log(`⚠️ Error con modelo fallback ${fallbackModel}: ${fallbackError.message}`);
            // Continuar al siguiente modelo
          }
        }
        
        // Si ningún fallback funcionó, lanza el error original
        if (!fallbackSuccess) {
          throw error;
        }
      } else {
        // Si el error no es de cuota, lanza el error original
        throw error;
      }
    }
    
    return res.status(200).json({
      text,
      model: usedModel,
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
    // Lista priorizada de modelos a intentar (de más avanzado a más básico)
    const modelPriority = [
      "models/gemini-1.5-flash-latest", // 1. Flash como modelo principal por su eficiencia
      "models/gemini-1.5-pro-latest",   // 2. Pro como alternativa (puede fallar por cuota)
      "gemini-pro",                     // 3. Modelo antiguo
      "models/gemini-pro",              // 4. Nomenclatura alternativa
    ];
    
    // Variable para almacenar el modelo una vez se inicialice con éxito
    let modelName = "";
    let model;
    let text = "";
    let modelError: Error | null = null;
    
    // Intentar cada modelo hasta que uno funcione
    for (const candidateModel of modelPriority) {
      try {
        console.log(`🔄 Verificando disponibilidad del modelo: ${candidateModel}`);
        model = genAI.getGenerativeModel({ model: candidateModel });
        
        // Intentar generar contenido mínimo para verificar
        const result = await model.generateContent("Hola");
        const response = await result.response;
        text = response.text();
        
        // Si llegamos aquí, el modelo funciona correctamente
        modelName = candidateModel;
        console.log(`✅ Modelo disponible y funcionando: ${modelName}`);
        break; // Si tiene éxito, salimos del bucle
      } catch (error: any) {
        console.log(`⚠️ Error al verificar modelo ${candidateModel}: ${error.message || 'Error desconocido'}`);
        modelError = error;
        // Continuar con el siguiente modelo
      }
    }
    
    // Si ningún modelo funcionó después de probar todos
    if (!modelName) {
      throw new Error(`No se pudo verificar ningún modelo de Gemini: ${modelError?.message}`);
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
  
  console.log('✅ Gemini service routes configured successfully');
};

export default {
  configureRoutes,
  generateChatResponse,
  checkGeminiStatus
};