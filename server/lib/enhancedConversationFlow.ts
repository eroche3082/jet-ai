/**
 * Enhanced conversation flow with fallback integration
 * for JetAI Travel Companion
 * 
 * This module enhances the conversation flow by integrating fallback
 * services to ensure system resilience.
 */

import { processConversation } from './vertexAI';
import { storage } from '../storage';
import { generateUserItinerary } from './itineraryGenerator';
import fetch from 'node-fetch';
import { UserProfile as BaseUserProfile } from './conversationFlow';

// Conversation stages
export enum ConversationStage {
  GREETING = 'greeting',
  UNDERSTANDING_NEEDS = 'understanding_needs',
  SUGGESTIONS = 'suggestions',
  PLANNING = 'planning',
  BOOKING = 'booking',
  SUPPORT = 'support',
  FEEDBACK = 'feedback',
}

// Metrics system for primary services vs fallbacks
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

// Initialize metrics
let apiMetrics: ApiUsageMetrics = {
  weather: { primary: 0, fallback: 0, errors: 0 },
  geocoding: { primary: 0, fallback: 0, errors: 0 },
  routes: { primary: 0, fallback: 0, errors: 0 },
  vertexAI: { primary: 0, fallback: 0, errors: 0 }
};

// Main function to process user messages
export async function processUserMessage(
  message: string,
  history: any[],
  userId?: number | null,
  stage?: ConversationStage
) {
  try {
    // Detect the conversation stage if not provided
    const currentStage = stage || detectConversationStage(message, history);
    
    // Save the user's message if authenticated
    if (userId) {
      await storage.saveChatMessage(userId, message, 'user');
    }
    
    // Check if we need weather, route, or location information
    const needsWeatherInfo = detectWeatherQuery(message);
    const needsRouteInfo = detectRouteQuery(message);
    const needsLocationInfo = detectLocationQuery(message);
    
    // Variables to store additional data
    let weatherData: any = null;
    let routeData: any = null;
    let locationData: any = null;
    let enhancedResponse: boolean = false;
    
    // Get weather information if needed
    if (needsWeatherInfo) {
      const locationName = extractLocationFromMessage(message);
      if (locationName) {
        try {
          const coordinates = await getCoordinatesFromName(locationName);
          if (coordinates) {
            weatherData = await getWeatherForLocation(coordinates.lat, coordinates.lng);
            
            // Record metrics based on the data source
            if (weatherData._source === 'fallback_openmeteo') {
              apiMetrics.weather.fallback++;
            } else {
              apiMetrics.weather.primary++;
            }
          }
        } catch (error) {
          console.error('Error getting weather information:', error);
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
          // Extraer el perfil del usuario del historial de conversación
          const userProfile = extractUserProfileFromHistory(history);
          const itinerary = await generateUserItinerary(userProfile);
          response = {
            message: `I've created an itinerary for you! What do you think?`,
            itinerary,
            suggestions: [
              "I love it. Save it",
              "Make some adjustments",
              "Show me other options"
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
            enhancedMessage += `\n\n_Some data was obtained through alternative services to ensure the best possible experience._`;
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
    console.error("Error in conversation flow:", error);
    apiMetrics.vertexAI.errors++;
    
    return {
      message: "I'm sorry, I'm having trouble processing your request. Can you try again?",
      stage: stage || ConversationStage.GREETING,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Function to detect conversation stage based on current message and history
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
  
  // If we can't determine, we assume it's in the understanding needs stage
  return ConversationStage.UNDERSTANDING_NEEDS;
}

// Function to predict the next stage of the conversation
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

// Function to determine if an itinerary should be generated
function shouldGenerateItinerary(message: string, history: any[]): boolean {
  const messageText = message.toLowerCase();
  
  // Check if the message explicitly mentions creating an itinerary
  if (
    messageText.includes('crear itinerario') || 
    messageText.includes('generar itinerario') ||
    messageText.includes('hacer un plan') ||
    messageText.includes('organizar mi viaje')
  ) {
    return true;
  }
  
  // Check if there is enough context to generate a meaningful itinerary
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

// FUNCTIONS FOR API INTEGRATION AND FALLBACKS

// Detect if a query needs weather information
function detectWeatherQuery(message: string): boolean {
  const weatherKeywords = [
    'clima', 'tiempo', 'temperatura', 'lluvia', 'llover', 'soleado', 'sol', 
    'nublado', 'nubes', 'pronóstico', 'meteorológico', 'grados', 'calor', 
    'frío', 'humedad', 'viento', 'tormenta'
  ];
  
  const messageText = message.toLowerCase();
  
  // Specific patterns for weather-related questions
  const weatherPatterns = [
    /cómo\s+está\s+el\s+(clima|tiempo)/i,
    /qué\s+(clima|tiempo)\s+(hay|hace)/i,
    /cuál\s+es\s+(?:la|el)\s+(temperatura|clima|pronóstico)/i
  ];
  
  // Check specific patterns
  for (const pattern of weatherPatterns) {
    if (pattern.test(messageText)) {
      return true;
    }
  }
  
  // Check keywords
  return weatherKeywords.some(keyword => messageText.includes(keyword));
}

// Detect if a query needs route information
function detectRouteQuery(message: string): boolean {
  const routeKeywords = [
    'ruta', 'camino', 'trayecto', 'cómo llegar', 'ir de', 'ir desde', 
    'distancia entre', 'cuánto tarda', 'tiempo de viaje', 'dirección',
    'mapa', 'transporte'
  ];
  
  const messageText = message.toLowerCase();
  return routeKeywords.some(keyword => messageText.includes(keyword));
}

// Detect if a query needs location information
function detectLocationQuery(message: string): boolean {
  const locationKeywords = [
    'dónde está', 'dónde queda', 'ubicación de', 'coordenadas', 'dirección',
    'país', 'ciudad', 'cerca de', 'sitios en', 'lugares en', 'qué hay en'
  ];
  
  const messageText = message.toLowerCase();
  return locationKeywords.some(keyword => messageText.includes(keyword));
}

// Extract location name from a message
function extractLocationFromMessage(message: string): string | null {
  // Enfoque mejorado: soporte multilingüe con más patrones
  const messageText = message.toLowerCase();
  
  // Ampliar prefijos para incluir múltiples idiomas: español, inglés, italiano, portugués, francés, alemán
  const locationPrefixes = [
    // Español
    'en ', 'a ', 'de ', 'sobre ', 'cerca de ', 'para ', 'el clima en ', 
    'el tiempo en ', 'la temperatura en ', 'cómo está ', 'visitar ', 'ir a ',
    'viajar a ', 'conocer ', 'qué hacer en ', 'atracciones en ',
    
    // Inglés
    'in ', 'to ', 'at ', 'near ', 'about ', 'the weather in ', 'temperature in ',
    'how is the weather in ', 'visit ', 'traveling to ', 'what to do in ',
    'attractions in ', 'places in ',
    
    // Italiano
    'a ', 'in ', 'il tempo a ', 'temperatura a ', 'come è il tempo a ',
    'visitare ', 'viaggiare a ', 'cosa fare a ', 'attrazioni a ',
    
    // Portugués
    'em ', 'para ', 'o tempo em ', 'a temperatura em ', 'como está o tempo em ',
    'visitar ', 'viajar para ', 'o que fazer em ', 'atrações em ',
    
    // Francés
    'à ', 'en ', 'le temps à ', 'la température à ', 'comment est le temps à ',
    'visiter ', 'voyager à ', 'que faire à ', 'attractions à ',
    
    // Alemán
    'in ', 'nach ', 'das wetter in ', 'die temperatur in ', 'wie ist das wetter in ',
    'besuchen ', 'reisen nach ', 'was kann man in ', 'attraktionen in '
  ];
  
  for (const prefix of locationPrefixes) {
    if (messageText.includes(prefix)) {
      const startIndex = messageText.indexOf(prefix) + prefix.length;
      let endIndex = messageText.length;
      
      // Buscar fin de la ubicación (puntuación o palabras finales comunes en múltiples idiomas)
      const endMarkers = [
        // Puntuación general
        '.', '?', ',', '!', ';', ':', 
        
        // Español
        ' y ', ' para ', ' el ', ' la ', ' los ', ' las ', ' con ', ' por ', ' que ',
        
        // Inglés
        ' and ', ' with ', ' for ', ' the ', ' that ', ' when ',
        
        // Italiano
        ' e ', ' con ', ' per ', ' il ', ' la ', ' che ',
        
        // Portugués
        ' e ', ' com ', ' para ', ' o ', ' a ', ' os ', ' as ', ' que ',
        
        // Francés
        ' et ', ' avec ', ' pour ', ' le ', ' la ', ' les ', ' que ',
        
        // Alemán
        ' und ', ' mit ', ' für ', ' der ', ' die ', ' das ', ' wenn '
      ];
      
      for (const marker of endMarkers) {
        const markerIndex = messageText.indexOf(marker, startIndex);
        if (markerIndex !== -1 && markerIndex < endIndex) {
          endIndex = markerIndex;
        }
      }
      
      const location = messageText.substring(startIndex, endIndex).trim();
      
      // Evitar extraer frases muy largas o muy cortas
      // Verificar que no contenga palabras de exclusión en varios idiomas
      const exclusionWords = [
        'como', 'like', 'come', 'como', 'comme', 'wie', // "como" en varios idiomas
        'por ejemplo', 'for example', 'per esempio', 'por exemplo', 'par exemple', 'zum beispiel'
      ];
      
      const containsExclusion = exclusionWords.some(word => location.includes(word));
      
      if (location.length > 2 && location.length < 50 && !containsExclusion) {
        return location;
      }
    }
  }
  
  return null;
}

// Extract route information from a message with multilingual support
function extractRouteFromMessage(message: string): { origin: string | null; destination: string | null } {
  const messageText = message.toLowerCase();
  
  // Patrones comunes para rutas en múltiples idiomas
  const routePatterns = [
    // Español
    { startPattern: 'de ', separatorPattern: ' a ' },
    { startPattern: 'desde ', separatorPattern: ' hasta ' },
    { startPattern: 'ir de ', separatorPattern: ' a ' },
    { startPattern: 'viajar de ', separatorPattern: ' a ' },
    { startPattern: 'entre ', separatorPattern: ' y ' },
    { startPattern: 'ruta de ', separatorPattern: ' a ' },
    { startPattern: 'trayecto de ', separatorPattern: ' a ' },
    { startPattern: 'camino de ', separatorPattern: ' a ' },
    
    // Inglés
    { startPattern: 'from ', separatorPattern: ' to ' },
    { startPattern: 'travel from ', separatorPattern: ' to ' },
    { startPattern: 'route from ', separatorPattern: ' to ' },
    { startPattern: 'directions from ', separatorPattern: ' to ' },
    { startPattern: 'journey from ', separatorPattern: ' to ' },
    { startPattern: 'going from ', separatorPattern: ' to ' },
    { startPattern: 'driving from ', separatorPattern: ' to ' },
    { startPattern: 'flying from ', separatorPattern: ' to ' },
    { startPattern: 'between ', separatorPattern: ' and ' },
    
    // Italiano
    { startPattern: 'da ', separatorPattern: ' a ' },
    { startPattern: 'da ', separatorPattern: ' fino a ' },
    { startPattern: 'viaggiare da ', separatorPattern: ' a ' },
    { startPattern: 'percorso da ', separatorPattern: ' a ' },
    { startPattern: 'rotta da ', separatorPattern: ' a ' },
    { startPattern: 'tra ', separatorPattern: ' e ' },
    
    // Portugués
    { startPattern: 'de ', separatorPattern: ' para ' },
    { startPattern: 'de ', separatorPattern: ' até ' },
    { startPattern: 'viajar de ', separatorPattern: ' para ' },
    { startPattern: 'rota de ', separatorPattern: ' para ' },
    { startPattern: 'trajeto de ', separatorPattern: ' para ' },
    { startPattern: 'entre ', separatorPattern: ' e ' },
    
    // Francés
    { startPattern: 'de ', separatorPattern: ' à ' },
    { startPattern: 'de ', separatorPattern: ' jusqu\'à ' },
    { startPattern: 'voyager de ', separatorPattern: ' à ' },
    { startPattern: 'trajet de ', separatorPattern: ' à ' },
    { startPattern: 'itinéraire de ', separatorPattern: ' à ' },
    { startPattern: 'entre ', separatorPattern: ' et ' },
    
    // Alemán
    { startPattern: 'von ', separatorPattern: ' nach ' },
    { startPattern: 'von ', separatorPattern: ' zu ' },
    { startPattern: 'reise von ', separatorPattern: ' nach ' },
    { startPattern: 'route von ', separatorPattern: ' nach ' },
    { startPattern: 'fahrt von ', separatorPattern: ' nach ' },
    { startPattern: 'zwischen ', separatorPattern: ' und ' }
  ];
  
  for (const pattern of routePatterns) {
    if (messageText.includes(pattern.startPattern) && messageText.includes(pattern.separatorPattern)) {
      const startIndex = messageText.indexOf(pattern.startPattern) + pattern.startPattern.length;
      const separatorIndex = messageText.indexOf(pattern.separatorPattern, startIndex);
      
      if (separatorIndex !== -1) {
        const origin = messageText.substring(startIndex, separatorIndex).trim();
        
        const destStartIndex = separatorIndex + pattern.separatorPattern.length;
        let destEndIndex = messageText.length;
        
        // Buscar fin del destino (puntuación o palabras finales comunes en múltiples idiomas)
        const endMarkers = [
          // Puntuación general
          '.', '?', ',', '!', ';', ':', 
          
          // Español
          ' y ', ' para ', ' el ', ' la ', ' los ', ' las ', ' con ', ' por ', ' que ',
          
          // Inglés
          ' and ', ' with ', ' for ', ' the ', ' that ', ' when ',
          
          // Italiano
          ' e ', ' con ', ' per ', ' il ', ' la ', ' che ',
          
          // Portugués
          ' e ', ' com ', ' para ', ' o ', ' a ', ' os ', ' as ', ' que ',
          
          // Francés
          ' et ', ' avec ', ' pour ', ' le ', ' la ', ' les ', ' que ',
          
          // Alemán
          ' und ', ' mit ', ' für ', ' der ', ' die ', ' das ', ' wenn '
        ];
        
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

/**
 * Extrae el perfil del usuario del historial de conversación
 * para generar un itinerario personalizado
 */
function extractUserProfileFromHistory(history: any[]): BaseUserProfile {
  // Crear un perfil básico
  const userProfile: BaseUserProfile = {
    currentStage: null as any, // Lo asignaremos después correctamente
  };

  // Analizar conversación para extraer datos clave
  if (!history || history.length === 0) {
    return userProfile;
  }

  let destinationMentions: string[] = [];
  let budgetMentions: string[] = [];
  let dateMentions: string[] = [];
  let travelersMentions: string[] = [];
  let interestMentions: string[] = [];

  // Patrones para extraer información
  const destinationPatterns = [
    /(?:voy|viaje|visitar|ir)\s+a\s+([A-Za-zÀ-ÿ\s]{2,30})/i,
    /(?:conocer|viaje\s+a)\s+([A-Za-zÀ-ÿ\s]{2,30})/i
  ];
  
  const budgetPatterns = [
    /(?:presupuesto|gastar)\s+(?:de|es|:)?\s*(\d{1,5}(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:€|euros|USD|dólares|\$)?/i,
    /(\d{1,5}(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:€|euros|USD|dólares|\$)/i
  ];
  
  const datePatterns = [
    // Patrones de fechas exactas (del X al Y) - español
    /(?:del|desde el)\s+(\d{1,2}\s+(?:de\s+)?[A-Za-zÀ-ÿ]+(?:\s+(?:de\s+)?\d{4})?)\s+(?:al|hasta el)\s+(\d{1,2}\s+(?:de\s+)?[A-Za-zÀ-ÿ]+(?:\s+(?:de\s+)?\d{4})?)/i,
    
    // Patrones de fechas exactas - italiano
    /(?:dal|da)\s+(\d{1,2}\s+(?:di\s+)?[A-Za-zÀ-ÿ]+(?:\s+(?:di\s+)?\d{4})?)\s+(?:al|fino al)\s+(\d{1,2}\s+(?:di\s+)?[A-Za-zÀ-ÿ]+(?:\s+(?:di\s+)?\d{4})?)/i,
    
    // Patrones de fechas exactas - portugués
    /(?:de|desde)\s+(\d{1,2}\s+(?:de\s+)?[A-Za-zÀ-ÿ]+(?:\s+(?:de\s+)?\d{4})?)\s+(?:a|até)\s+(\d{1,2}\s+(?:de\s+)?[A-Za-zÀ-ÿ]+(?:\s+(?:de\s+)?\d{4})?)/i,
    
    // Patrones de meses o temporadas generales
    /(?:en|para|in|em|no|na)\s+([A-Za-zÀ-ÿ]+)/i,
    
    // Fechas sueltas (un día específico)
    /(\d{1,2}\s+(?:de|di|de\s+)\s*[A-Za-zÀ-ÿ]+(?:\s+(?:de|di|de\s+)\s*\d{4})?)/i,
    
    // Duración en días - multilingüe (español, italiano, portugués, inglés)
    /(?:por|durante|per|para|for|by)\s+(\d+)\s*(?:d[ií]as?|giorni|dias?|days?)/i,
    
    // Duración en semanas - multilingüe
    /(?:por|durante|per|para|for|by)\s+(\d+)\s*(?:semanas?|settimane?|semanas?|weeks?)/i,
    
    // Duración en noches - multilingüe
    /(?:por|durante|per|para|for|by)\s+(\d+)\s*(?:noches?|notti|noites?|nights?)/i
  ];
  
  const travelersPatterns = [
    /(?:somos|seremos|vamos)\s+(\d+)\s+personas?/i,
    /(\d+)\s+personas?/i,
    /(?:voy|viajo)\s+(?:solo|sola|con\s+mi\s+pareja|en\s+familia|con\s+amigos)/i
  ];
  
  const interestsPatterns = [
    /(?:interesa|gusta)\s+(?:la\s+)?([A-Za-zÀ-ÿ\s,]+)/i,
    /(?:actividades|lugares)\s+(?:de|para)\s+([A-Za-zÀ-ÿ\s,]+)/i
  ];

  // Procesar cada mensaje de la conversación
  for (const entry of history) {
    if (entry.role === 'user') {
      const message = entry.content.toLowerCase();
      
      // Extraer destino
      for (const pattern of destinationPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          destinationMentions.push(match[1].trim());
        }
      }
      
      // Extraer presupuesto
      for (const pattern of budgetPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          budgetMentions.push(match[1].trim());
        }
      }
      
      // Extraer fechas
      for (const pattern of datePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          dateMentions.push(match[1].trim());
          if (match[2]) {
            dateMentions.push(match[2].trim());
          }
        }
      }
      
      // Extraer número/tipo de viajeros
      for (const pattern of travelersPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          travelersMentions.push(match[1].trim());
        } else if (match) {
          // Si no hay grupo de captura pero hay coincidencia (ej: "voy solo")
          travelersMentions.push(match[0].trim());
        }
      }
      
      // Extraer intereses
      for (const pattern of interestsPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          interestMentions.push(match[1].trim());
        }
      }
      
      // Buscar palabras clave de intereses
      const interestKeywords = [
        'playa', 'montaña', 'cultural', 'historia', 'arte', 'museos',
        'gastronomía', 'comida', 'aventura', 'naturaleza', 'relax',
        'shopping', 'compras', 'fiesta', 'fotografía', 'arquitectura'
      ];
      
      for (const keyword of interestKeywords) {
        if (message.includes(keyword)) {
          interestMentions.push(keyword);
        }
      }
    }
  }
  
  // Rellenar el perfil con la información extraída
  if (destinationMentions.length > 0) {
    userProfile.destination = destinationMentions[destinationMentions.length - 1]; // Usar la mención más reciente
  }
  
  if (budgetMentions.length > 0) {
    userProfile.budget = budgetMentions[budgetMentions.length - 1];
  }
  
  if (dateMentions.length > 0) {
    // Filtrar fechas para eliminar duplicados o menciones incorrectas
    const cleanedDates = dateMentions.filter(date => 
      date.length < 30 && // Solo fechas cortas (evitar concatenaciones erróneas)
      !date.includes('personas') && // Evitar contaminación de otros campos
      !date.includes('euros') && 
      !date.includes('€')
    );
    
    // Si tenemos fechas limpias, las usamos; de lo contrario, tratamos de extraer solo la duración
    if (cleanedDates.length > 0) {
      userProfile.dates = cleanedDates.length > 1 
        ? `${cleanedDates[0]} a ${cleanedDates[cleanedDates.length - 1]}` 
        : cleanedDates[0];
    } else {
      // Buscar directamente menciones de duración en el historial original usando patrones multilingües
      for (const entry of history) {
        if (entry.role === 'user') {
          // Patrones para duración en varios idiomas
          const durationPatterns = [
            { pattern: /(\d+)\s*d[ií]as?/i, format: (num) => `${num} días` },
            { pattern: /(\d+)\s*giorni/i, format: (num) => `${num} días` },
            { pattern: /(\d+)\s*days?/i, format: (num) => `${num} días` },
            { pattern: /(\d+)\s*semanas?/i, format: (num) => `${num} semanas` },
            { pattern: /(\d+)\s*settimane?/i, format: (num) => `${num} semanas` },
            { pattern: /(\d+)\s*weeks?/i, format: (num) => `${num} semanas` },
            { pattern: /(\d+)\s*noches?/i, format: (num) => `${num} noches` },
            { pattern: /(\d+)\s*notti/i, format: (num) => `${num} noches` },
            { pattern: /(\d+)\s*nights?/i, format: (num) => `${num} noches` },
            { pattern: /(\d+)\s*mese?/i, format: (num) => `${num} meses` },
            { pattern: /(\d+)\s*mesi/i, format: (num) => `${num} meses` },
            { pattern: /(\d+)\s*months?/i, format: (num) => `${num} meses` }
          ];
          
          // Probar cada patrón
          for (const { pattern, format } of durationPatterns) {
            const match = entry.content.match(pattern);
            if (match && match[1]) {
              userProfile.dates = format(match[1]);
              
              // Si encontramos fecha, salimos del bucle
              break;
            }
          }
          
          // Si ya encontramos una duración, no seguimos buscando
          if (userProfile.dates) {
            break;
          }
        }
      }
    }
  }
  
  if (travelersMentions.length > 0) {
    userProfile.travelers = travelersMentions[travelersMentions.length - 1];
  }
  
  if (interestMentions.length > 0) {
    userProfile.interests = interestMentions.join(', ');
  }
  
  return userProfile;
}

// Exportar funciones y tipos para uso en otros módulos
export {
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
  ApiUsageMetrics,
  extractUserProfileFromHistory
};