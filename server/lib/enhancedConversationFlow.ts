/**
 * Flujo de conversación mejorado con integración de fallbacks
 * para JetAI Travel Companion
 * 
 * Este módulo mejora el flujo de conversación integrando los servicios
 * de fallback para asegurar la resiliencia del sistema.
 */

import { processConversation } from './vertexAI';
import { storage } from '../storage';
import { generateUserItinerary } from './itineraryGenerator';
import fetch from 'node-fetch';

// Etapas de la conversación
export enum ConversationStage {
  GREETING = 'greeting',
  UNDERSTANDING_NEEDS = 'understanding_needs',
  SUGGESTIONS = 'suggestions',
  PLANNING = 'planning',
  BOOKING = 'booking',
  SUPPORT = 'support',
  FEEDBACK = 'feedback',
}

// Sistema de métricas para servicios principales vs fallbacks
interface ApiUsageMetrics {
  weather: {
    primary: number;
    fallback: number;
    errors: number;
  };
  geocoding: {
    primary: number;
    fallback: number;
    errors: number;
  };
  routes: {
    primary: number;
    fallback: number;
    errors: number;
  };
  vertexAI: {
    primary: number;
    fallback: number;
    errors: number;
  };
}

// Inicializar métricas
let apiMetrics: ApiUsageMetrics = {
  weather: { primary: 0, fallback: 0, errors: 0 },
  geocoding: { primary: 0, fallback: 0, errors: 0 },
  routes: { primary: 0, fallback: 0, errors: 0 },
  vertexAI: { primary: 0, fallback: 0, errors: 0 }
};

// Función principal para procesar mensajes de usuario
export async function processUserMessage(
  message: string,
  history: any[],
  userId?: number | null,
  stage?: ConversationStage
) {
  try {
    // Detectar la etapa de la conversación si no se proporciona
    const currentStage = stage || detectConversationStage(message, history);
    
    // Guardar el mensaje del usuario si está autenticado
    if (userId) {
      await storage.saveChatMessage(userId, message, 'user');
    }
    
    // Comprobar si necesitamos información de clima o rutas
    const needsWeatherInfo = detectWeatherQuery(message);
    const needsRouteInfo = detectRouteQuery(message);
    const needsLocationInfo = detectLocationQuery(message);
    
    // Variables para almacenar datos adicionales
    let weatherData: any = null;
    let routeData: any = null;
    let locationData: any = null;
    let enhancedResponse: boolean = false;
    
    // Obtener información meteorológica si es necesario
    if (needsWeatherInfo) {
      const locationName = extractLocationFromMessage(message);
      if (locationName) {
        try {
          const coordinates = await getCoordinatesFromName(locationName);
          if (coordinates) {
            weatherData = await getWeatherForLocation(coordinates.lat, coordinates.lng);
            
            // Registrar métricas basadas en la fuente de datos
            if (weatherData._source === 'fallback_openmeteo') {
              apiMetrics.weather.fallback++;
            } else {
              apiMetrics.weather.primary++;
            }
          }
        } catch (error) {
          console.error('Error obteniendo información del clima:', error);
          apiMetrics.weather.errors++;
        }
      }
    }
    
    // Obtener información de ruta si es necesario
    if (needsRouteInfo) {
      const { origin, destination } = extractRouteFromMessage(message);
      if (origin && destination) {
        try {
          routeData = await getRouteInformation(origin, destination);
          
          // Registrar métricas basadas en la fuente de datos
          if (routeData._source === 'fallback_osrm') {
            apiMetrics.routes.fallback++;
          } else {
            apiMetrics.routes.primary++;
          }
        } catch (error) {
          console.error('Error obteniendo información de ruta:', error);
          apiMetrics.routes.errors++;
        }
      }
    }
    
    // Obtener información de ubicación si es necesario
    if (needsLocationInfo) {
      const locationName = extractLocationFromMessage(message);
      if (locationName) {
        try {
          locationData = await getLocationInformation(locationName);
          
          // Registrar métricas basadas en la fuente de datos
          if (locationData._source === 'fallback_nominatim') {
            apiMetrics.geocoding.fallback++;
          } else {
            apiMetrics.geocoding.primary++;
          }
        } catch (error) {
          console.error('Error obteniendo información de ubicación:', error);
          apiMetrics.geocoding.errors++;
        }
      }
    }
    
    // Procesar según la etapa
    let response;
    
    switch (currentStage) {
      case ConversationStage.PLANNING:
        // Si está en etapa de planificación, generar itinerario
        if (shouldGenerateItinerary(message, history)) {
          const itinerary = await generateUserItinerary(message, history);
          response = {
            message: `¡He creado un itinerario para ti! ¿Qué te parece?`,
            itinerary,
            suggestions: [
              "Me encanta. Guárdalo",
              "Hazle algunos ajustes",
              "Mejor muéstrame otras opciones"
            ]
          };
          break;
        }
        // Si no necesita generar itinerario, continuar con procesamiento normal
        
      default:
        // Para todas las demás etapas, usar procesamiento estándar
        response = await processConversation(message, history);
        
        // Enriquecer la respuesta con datos adicionales
        if (weatherData || routeData || locationData) {
          enhancedResponse = true;
          let enhancedMessage = response.message;
          
          // Agregar información del clima
          if (weatherData) {
            const weatherInfo = formatWeatherInfo(weatherData);
            enhancedMessage += `\n\n${weatherInfo}`;
          }
          
          // Agregar información de ruta
          if (routeData) {
            const routeInfo = formatRouteInfo(routeData);
            enhancedMessage += `\n\n${routeInfo}`;
          }
          
          // Agregar información de ubicación
          if (locationData) {
            const locationInfo = formatLocationInfo(locationData);
            enhancedMessage += `\n\n${locationInfo}`;
          }
          
          // Si se usó algún servicio alternativo, agregar una nota sutil
          if (weatherData?._source === 'fallback_openmeteo' || 
              routeData?._source === 'fallback_osrm' ||
              locationData?._source === 'fallback_nominatim') {
            enhancedMessage += `\n\n_Algunos datos fueron obtenidos a través de servicios alternativos para garantizar la mejor experiencia posible._`;
          }
          
          response.message = enhancedMessage;
          
          // Agregar datos estructurados
          response.enhancedData = {
            weather: weatherData,
            route: routeData,
            location: locationData
          };
        }
    }
    
    // Guardar la respuesta del asistente si el usuario está autenticado
    if (userId && response) {
      await storage.saveChatMessage(userId, response.message, 'assistant');
    }
    
    // Registrar uso de servicios de IA
    if (!enhancedResponse) {
      // Si se utilizó solo IA generativa
      apiMetrics.vertexAI.primary++;
    }
    
    // Generar alerta para administrador si hay muchos errores
    checkForAPIAlerts();
    
    return {
      ...response,
      stage: currentStage,
      nextStage: predictNextStage(currentStage, message, response?.message || ''),
      metrics: shouldIncludeMetrics(message) ? apiMetrics : undefined
    };
  } catch (error) {
    console.error("Error en el flujo de conversación:", error);
    apiMetrics.vertexAI.errors++;
    
    return {
      message: "Lo siento, estoy teniendo problemas para procesar tu solicitud. ¿Puedes intentarlo de nuevo?",
      stage: stage || ConversationStage.GREETING,
      error: error instanceof Error ? error.message : "Error desconocido"
    };
  }
}

// Función para detectar la etapa de la conversación basada en el mensaje actual e historial
function detectConversationStage(message: string, history: any[]): ConversationStage {
  const messageText = message.toLowerCase();
  
  // Si no hay historial, es un saludo
  if (!history || history.length === 0) {
    return ConversationStage.GREETING;
  }
  
  // Detectar etapa por palabras clave
  
  // Planificación - itinerarios, planear, programar
  if (
    messageText.includes('itinerario') || 
    messageText.includes('planear') || 
    messageText.includes('programar') ||
    messageText.includes('organizar mi viaje') ||
    messageText.includes('plan de viaje')
  ) {
    return ConversationStage.PLANNING;
  }
  
  // Reservas - reservar, comprar, boletos
  if (
    messageText.includes('reservar') || 
    messageText.includes('comprar') ||
    messageText.includes('boleto') || 
    messageText.includes('ticket') ||
    messageText.includes('habitación')
  ) {
    return ConversationStage.BOOKING;
  }
  
  // Sugerencias - recomendar, sugerir, mejor lugar
  if (
    messageText.includes('recomienda') || 
    messageText.includes('sugerir') ||
    messageText.includes('mejor lugar') || 
    messageText.includes('qué visitar') ||
    messageText.includes('lugares para')
  ) {
    return ConversationStage.SUGGESTIONS;
  }
  
  // Soporte - ayuda, problema, no funciona
  if (
    messageText.includes('ayuda') || 
    messageText.includes('problema') ||
    messageText.includes('no funciona') || 
    messageText.includes('error')
  ) {
    return ConversationStage.SUPPORT;
  }
  
  // Feedback - gracias, genial, terrible
  if (
    messageText.includes('gracias') || 
    messageText.includes('genial') ||
    messageText.includes('terrible') || 
    messageText.includes('opinión')
  ) {
    return ConversationStage.FEEDBACK;
  }
  
  // Si no podemos determinar, asumimos que está en etapa de entendimiento
  return ConversationStage.UNDERSTANDING_NEEDS;
}

// Función para predecir la siguiente etapa de la conversación
function predictNextStage(
  currentStage: ConversationStage, 
  userMessage: string,
  assistantResponse: string
): ConversationStage {
  // Lógica simplificada para predecir la siguiente etapa
  switch (currentStage) {
    case ConversationStage.GREETING:
      return ConversationStage.UNDERSTANDING_NEEDS;
      
    case ConversationStage.UNDERSTANDING_NEEDS:
      if (userMessage.toLowerCase().includes('recomendar') || 
          userMessage.toLowerCase().includes('sugerir')) {
        return ConversationStage.SUGGESTIONS;
      }
      return ConversationStage.UNDERSTANDING_NEEDS;
      
    case ConversationStage.SUGGESTIONS:
      if (assistantResponse.includes('itinerario') || 
          userMessage.toLowerCase().includes('planear')) {
        return ConversationStage.PLANNING;
      }
      return ConversationStage.SUGGESTIONS;
      
    case ConversationStage.PLANNING:
      if (userMessage.toLowerCase().includes('reservar') || 
          userMessage.toLowerCase().includes('comprar')) {
        return ConversationStage.BOOKING;
      }
      return ConversationStage.PLANNING;
      
    default:
      return currentStage;
  }
}

// Función para determinar si se debe generar un itinerario
function shouldGenerateItinerary(message: string, history: any[]): boolean {
  const messageText = message.toLowerCase();
  
  // Verificar si el mensaje menciona explícitamente crear un itinerario
  if (
    messageText.includes('crear itinerario') || 
    messageText.includes('generar itinerario') ||
    messageText.includes('hacer un plan') ||
    messageText.includes('organizar mi viaje')
  ) {
    return true;
  }
  
  // Verificar si hay suficiente contexto para generar un itinerario significativo
  const hasDestination = messageText.includes('a ') && (
    messageText.includes('viaje') || 
    messageText.includes('visitar') || 
    messageText.includes('ir')
  );
  
  const hasDuration = 
    messageText.includes('días') || 
    messageText.includes('semanas') ||
    messageText.includes('noches');
  
  return hasDestination && hasDuration;
}

// FUNCIONES PARA INTEGRACIÓN CON APIS Y FALLBACKS

// Detectar si una consulta necesita información meteorológica
function detectWeatherQuery(message: string): boolean {
  const weatherKeywords = [
    'clima', 'tiempo', 'temperatura', 'lluvia', 'llover', 'soleado', 'sol', 
    'nublado', 'nubes', 'pronóstico', 'meteorológico', 'grados', 'calor', 
    'frío', 'humedad', 'viento', 'tormenta'
  ];
  
  const messageText = message.toLowerCase();
  
  // Patrones específicos de preguntas sobre clima
  const weatherPatterns = [
    /cómo\s+está\s+el\s+(clima|tiempo)/i,
    /qué\s+(clima|tiempo)\s+(hay|hace)/i,
    /cuál\s+es\s+(?:la|el)\s+(temperatura|clima|pronóstico)/i
  ];
  
  // Comprobar patrones específicos
  for (const pattern of weatherPatterns) {
    if (pattern.test(messageText)) {
      return true;
    }
  }
  
  // Verificar palabras clave
  return weatherKeywords.some(keyword => messageText.includes(keyword));
}

// Detectar si una consulta necesita información de rutas
function detectRouteQuery(message: string): boolean {
  const routeKeywords = [
    'ruta', 'camino', 'trayecto', 'cómo llegar', 'ir de', 'ir desde', 
    'distancia entre', 'cuánto tarda', 'tiempo de viaje', 'dirección',
    'mapa', 'transporte'
  ];
  
  const messageText = message.toLowerCase();
  return routeKeywords.some(keyword => messageText.includes(keyword));
}

// Detectar si una consulta necesita información de ubicación
function detectLocationQuery(message: string): boolean {
  const locationKeywords = [
    'dónde está', 'dónde queda', 'ubicación de', 'coordenadas', 'dirección',
    'país', 'ciudad', 'cerca de', 'sitios en', 'lugares en', 'qué hay en'
  ];
  
  const messageText = message.toLowerCase();
  return locationKeywords.some(keyword => messageText.includes(keyword));
}

// Extraer nombre de ubicación de un mensaje
function extractLocationFromMessage(message: string): string | null {
  // Enfoque simple: buscar después de palabras clave
  const messageText = message.toLowerCase();
  
  const locationPrefixes = [
    'en ', 'a ', 'de ', 'sobre ', 'cerca de ', 'para ', 'el clima en ', 
    'el tiempo en ', 'la temperatura en ', 'cómo está '
  ];
  
  for (const prefix of locationPrefixes) {
    if (messageText.includes(prefix)) {
      const startIndex = messageText.indexOf(prefix) + prefix.length;
      let endIndex = messageText.length;
      
      // Buscar fin de la ubicación (puntuación o palabras finales comunes)
      const endMarkers = ['.', '?', ',', '!', ' y ', ' para ', ' el '];
      for (const marker of endMarkers) {
        const markerIndex = messageText.indexOf(marker, startIndex);
        if (markerIndex !== -1 && markerIndex < endIndex) {
          endIndex = markerIndex;
        }
      }
      
      const location = messageText.substring(startIndex, endIndex).trim();
      
      // Evitar extraer frases muy largas o muy cortas
      if (location.length > 2 && location.length < 50 && !location.includes(' como ')) {
        return location;
      }
    }
  }
  
  return null;
}

// Extraer información de ruta de un mensaje
function extractRouteFromMessage(message: string): { origin: string | null; destination: string | null } {
  const messageText = message.toLowerCase();
  
  // Patrones comunes para rutas
  const routePatterns = [
    { startPattern: 'de ', separatorPattern: ' a ' },
    { startPattern: 'desde ', separatorPattern: ' hasta ' },
    { startPattern: 'ir de ', separatorPattern: ' a ' },
    { startPattern: 'viajar de ', separatorPattern: ' a ' },
    { startPattern: 'entre ', separatorPattern: ' y ' },
  ];
  
  for (const pattern of routePatterns) {
    if (messageText.includes(pattern.startPattern) && messageText.includes(pattern.separatorPattern)) {
      const startIndex = messageText.indexOf(pattern.startPattern) + pattern.startPattern.length;
      const separatorIndex = messageText.indexOf(pattern.separatorPattern, startIndex);
      
      if (separatorIndex !== -1) {
        const origin = messageText.substring(startIndex, separatorIndex).trim();
        
        const destStartIndex = separatorIndex + pattern.separatorPattern.length;
        let destEndIndex = messageText.length;
        
        // Buscar fin del destino (puntuación o palabras finales comunes)
        const endMarkers = ['.', '?', ',', '!', ' y ', ' para ', ' el '];
        for (const marker of endMarkers) {
          const markerIndex = messageText.indexOf(marker, destStartIndex);
          if (markerIndex !== -1 && markerIndex < destEndIndex) {
            destEndIndex = markerIndex;
          }
        }
        
        const destination = messageText.substring(destStartIndex, destEndIndex).trim();
        
        // Verificar que las ubicaciones tengan sentido
        if (origin && destination && origin.length > 2 && destination.length > 2 && origin !== destination) {
          return { origin, destination };
        }
      }
    }
  }
  
  return { origin: null, destination: null };
}

// Obtener coordenadas a partir de un nombre de ubicación
async function getCoordinatesFromName(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/geocode?address=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error(`Error en geocodificación: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'ZERO_RESULTS' || !data.results || data.results.length === 0) {
      return null;
    }
    
    const result = data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng
    };
  } catch (error) {
    console.error('Error obteniendo coordenadas:', error);
    return null;
  }
}

// Obtener información meteorológica para una ubicación
async function getWeatherForLocation(lat: number, lng: number): Promise<any | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      throw new Error(`Error en servicio meteorológico: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo información meteorológica:', error);
    return null;
  }
}

// Obtener información de ruta entre dos ubicaciones
async function getRouteInformation(origin: string, destination: string): Promise<any | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/routes?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
    
    if (!response.ok) {
      throw new Error(`Error en servicio de rutas: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo información de ruta:', error);
    return null;
  }
}

// Obtener información sobre una ubicación
async function getLocationInformation(location: string): Promise<any | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/geocode?address=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error(`Error en geocodificación: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo información de ubicación:', error);
    return null;
  }
}

// Formatear información meteorológica para respuesta
function formatWeatherInfo(weatherData: any): string {
  if (!weatherData || !weatherData.current) {
    return '';
  }
  
  const current = weatherData.current;
  const temp = current.temperature?.value || '';
  const unit = current.temperature?.unit || '°C';
  const humidity = current.humidity?.value || '';
  const windSpeed = current.windSpeed?.value || '';
  const windUnit = current.windSpeed?.unit || 'km/h';
  
  // Determinar condición meteorológica
  let condition = 'Despejado';
  if (current.weatherCode) {
    const code = current.weatherCode;
    if (code >= 200 && code < 300) condition = 'Tormenta eléctrica';
    else if (code >= 300 && code < 400) condition = 'Llovizna';
    else if (code >= 500 && code < 600) condition = 'Lluvia';
    else if (code >= 600 && code < 700) condition = 'Nieve';
    else if (code >= 700 && code < 800) condition = 'Niebla';
    else if (code === 800) condition = 'Despejado';
    else if (code > 800) condition = 'Nublado';
  }
  
  return `**Información meteorológica:**\n` +
         `- Temperatura: ${temp}${unit}\n` +
         `- Condición: ${condition}\n` +
         `- Humedad: ${humidity}%\n` +
         `- Viento: ${windSpeed} ${windUnit}`;
}

// Formatear información de ruta para respuesta
function formatRouteInfo(routeData: any): string {
  if (!routeData || !routeData.routes || routeData.routes.length === 0) {
    return '';
  }
  
  const route = routeData.routes[0];
  
  // Convertir duración en segundos a formato legible
  let durationText = 'Desconocida';
  if (route.duration && route.duration.seconds) {
    const totalMinutes = Math.floor(route.duration.seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      durationText = `${hours} hora${hours > 1 ? 's' : ''} y ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else {
      durationText = `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
  }
  
  // Convertir distancia a formato legible
  let distanceText = 'Desconocida';
  if (route.distanceMeters) {
    const kilometers = (route.distanceMeters / 1000).toFixed(1);
    distanceText = `${kilometers} km`;
  }
  
  let sourceInfo = '';
  if (routeData._source_info) {
    sourceInfo = `\n- Perfil de ruta: ${routeData._source_info.profile || 'conducción'}`;
  }
  
  return `**Información de ruta:**\n` +
         `- Distancia: ${distanceText}\n` +
         `- Tiempo estimado: ${durationText}${sourceInfo}`;
}

// Formatear información de ubicación para respuesta
function formatLocationInfo(locationData: any): string {
  if (!locationData || !locationData.results || locationData.results.length === 0) {
    return '';
  }
  
  const location = locationData.results[0];
  
  let countryName = '';
  let cityName = '';
  let formattedAddress = location.formatted_address || '';
  
  // Intentar extraer país y ciudad de los componentes de dirección
  if (location.address_components) {
    for (const component of location.address_components) {
      if (component.types && component.types.includes('country')) {
        countryName = component.long_name;
      }
      if (component.types && (component.types.includes('locality') || component.types.includes('administrative_area_level_1'))) {
        cityName = component.long_name;
      }
    }
  }
  
  return `**Información de ubicación:**\n` +
         `- Dirección: ${formattedAddress}\n` +
         (cityName ? `- Ciudad: ${cityName}\n` : '') +
         (countryName ? `- País: ${countryName}\n` : '') +
         `- Coordenadas: ${location.geometry.location.lat.toFixed(4)}, ${location.geometry.location.lng.toFixed(4)}`;
}

// Determinar si incluir métricas en la respuesta (solo para administradores)
function shouldIncludeMetrics(message: string): boolean {
  const messageText = message.toLowerCase();
  return messageText.includes('métricas') && 
         messageText.includes('sistema') &&
         messageText.includes('admin');
}

// Verificar si hay alertas que enviar al administrador
function checkForAPIAlerts(): void {
  const errorThreshold = 5; // Umbral a partir del cual generar alertas
  
  // Verificar cada servicio
  if (apiMetrics.weather.errors >= errorThreshold) {
    console.warn(`⚠️ ALERTA: El servicio de clima ha experimentado ${apiMetrics.weather.errors} errores consecutivos.`);
  }
  
  if (apiMetrics.geocoding.errors >= errorThreshold) {
    console.warn(`⚠️ ALERTA: El servicio de geocodificación ha experimentado ${apiMetrics.geocoding.errors} errores consecutivos.`);
  }
  
  if (apiMetrics.routes.errors >= errorThreshold) {
    console.warn(`⚠️ ALERTA: El servicio de rutas ha experimentado ${apiMetrics.routes.errors} errores consecutivos.`);
  }
  
  if (apiMetrics.vertexAI.errors >= errorThreshold) {
    console.warn(`⚠️ ALERTA: El servicio de IA ha experimentado ${apiMetrics.vertexAI.errors} errores consecutivos.`);
  }
  
  // Generar alerta de relación de uso primario vs fallback
  const weatherFallbackRatio = apiMetrics.weather.fallback / (apiMetrics.weather.primary + apiMetrics.weather.fallback || 1);
  const geocodingFallbackRatio = apiMetrics.geocoding.fallback / (apiMetrics.geocoding.primary + apiMetrics.geocoding.fallback || 1);
  const routesFallbackRatio = apiMetrics.routes.fallback / (apiMetrics.routes.primary + apiMetrics.routes.fallback || 1);
  
  if (weatherFallbackRatio > 0.9 && (apiMetrics.weather.primary + apiMetrics.weather.fallback) > 10) {
    console.warn(`⚠️ ALERTA: El servicio de clima está usando fallbacks en el ${(weatherFallbackRatio * 100).toFixed(1)}% de las solicitudes.`);
  }
  
  if (geocodingFallbackRatio > 0.9 && (apiMetrics.geocoding.primary + apiMetrics.geocoding.fallback) > 10) {
    console.warn(`⚠️ ALERTA: El servicio de geocodificación está usando fallbacks en el ${(geocodingFallbackRatio * 100).toFixed(1)}% de las solicitudes.`);
  }
  
  if (routesFallbackRatio > 0.9 && (apiMetrics.routes.primary + apiMetrics.routes.fallback) > 10) {
    console.warn(`⚠️ ALERTA: El servicio de rutas está usando fallbacks en el ${(routesFallbackRatio * 100).toFixed(1)}% de las solicitudes.`);
  }
}

// Exportar funciones y tipos para uso en otros módulos
export {
  ConversationStage,
  processUserMessage,
  shouldGenerateItinerary,
  detectWeatherQuery,
  detectRouteQuery,
  detectLocationQuery,
  extractLocationFromMessage,
  extractRouteFromMessage,
  getWeatherForLocation,
  getRouteInformation,
  getLocationInformation,
  formatWeatherInfo,
  formatRouteInfo,
  formatLocationInfo,
  ApiUsageMetrics
};