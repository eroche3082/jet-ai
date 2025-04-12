/**
 * Configuración de APIs de Google Cloud para JetAI
 * 
 * Este archivo centraliza la configuración y verificación de las APIs de Google Cloud
 * utilizadas en la aplicación JetAI.
 * 
 * Sistema de API Keys por grupos:
 * GRUPO 1 (AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U): 
 * - Places API, Maps APIs, Weather API, Vision AI, Geocoding API
 * 
 * GRUPO 2 (AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08):
 * - Generative Language API, Vision AI, Cloud Storage, Translation, Text-to-Speech
 * - Cloud Video Intelligence, Vertex AI, Google Search Console
 * 
 * GRUPO 3 (AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0):
 * - Firebase APIs, Gemini for Google Cloud, Google Sheets, Calendar
 * - Routes API, Weather API, Time Zone API, Street View
 */

import { VertexAI } from '@google-cloud/vertexai';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { TranslationServiceClient } from '@google-cloud/translate';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Keys para cada grupo de servicios
const GOOGLE_KEYS = {
  // Grupo 1: Maps, Places, Vision AI, Weather
  MAPS: process.env.GOOGLE_GROUP1_API_KEY || 'AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U',
  
  // Grupo 2: Generative AI, Storage, Translation, Text-to-Speech, Video Intelligence
  AI: process.env.GOOGLE_GROUP2_API_KEY || 'AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08',
  
  // Grupo 3: Firebase, Gemini, Routes, Calendar, Sheets
  FIREBASE: process.env.GOOGLE_GROUP3_API_KEY || 'AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0'
};

// API Key principal para fallback y compatibilidad
const GOOGLE_API_KEY = GOOGLE_KEYS.AI;

// Inicializar el cliente de Gemini (Generative Language API)
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Interfaces para los clientes de APIs
interface ApiClients {
  vision: ImageAnnotatorClient | null;
  translation: TranslationServiceClient | null;
  textToSpeech: TextToSpeechClient | null;
  maps: MapsClient | null;
  videoIntelligence: VideoIntelligenceServiceClient | null;
  vertexAi: VertexAI | null;
  secretManager: SecretManagerServiceClient | null;
  generativeAI: GoogleGenerativeAI | null;
}

// Almacenamiento de clientes de API
const apiClients: ApiClients = {
  vision: null,
  translation: null,
  textToSpeech: null,
  maps: null,
  videoIntelligence: null,
  vertexAi: null,
  secretManager: null,
  generativeAI: genAI
};

// Verificar si las variables de entorno están configuradas
export const isKeyAvailable = (key: string): boolean => {
  return !!process.env[key] || key === 'GOOGLE_CLOUD_API_KEY';
};

// Inicializar clientes de API con manejo de errores y selección de API key apropiada
export const initializeApiClients = (): void => {
  try {
    console.log('Inicializando APIs de Google Cloud con API keys específicas...');

    // Inicializar Vision API (para análisis de imágenes) - Usa GRUPO 1 o 2
    try {
      apiClients.vision = new ImageAnnotatorClient({
        key: GOOGLE_KEYS.AI // Ambos grupos tienen Vision habilitado, usamos GRUPO 2
      });
      console.log('✅ Cliente de Google Cloud Vision inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Vision API:', error);
    }

    // Inicializar Translation API (para traducciones multilingüe) - Usa GRUPO 2
    try {
      apiClients.translation = new TranslationServiceClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Cliente de Google Cloud Translate inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Translation API:', error);
    }

    // Inicializar Text-to-Speech API (para síntesis de voz) - Usa GRUPO 2
    try {
      apiClients.textToSpeech = new TextToSpeechClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Cliente de Google Cloud Text-to-Speech inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Text-to-Speech API:', error);
    }

    // Inicializar Maps API (para geocodificación, places, rutas) - Usa GRUPO 1
    try {
      // Maps API suele usar el key en cada solicitud, así que configuramos el cliente aquí
      // pero enviamos la clave en cada solicitud
      apiClients.maps = new MapsClient({});
      console.log('✅ Cliente de Google Maps inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Maps API:', error);
    }

    // Inicializar Video Intelligence API (para análisis de videos) - Usa GRUPO 2
    try {
      apiClients.videoIntelligence = new VideoIntelligenceServiceClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Cliente de Google Cloud Video Intelligence inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Video Intelligence API:', error);
    }

    // Inicializar Vertex AI (para modelos de IA avanzados) - Usa GRUPO 2
    try {
      apiClients.vertexAi = new VertexAI({
        project: 'jetai-travel-companion',
        location: 'us-central1',
      });
      console.log('✅ Cliente de Google Vertex AI inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Vertex AI:', error);
    }

    // Inicializar Generative Language API (Gemini) - Usa GRUPO 2 para LLM principal
    // Nota: Ya se inicializó en la definición de genAI
    if (apiClients.generativeAI) {
      console.log('✅ Cliente de Google Generative AI (Gemini) inicializado correctamente');
    } else {
      console.error('❌ Error al inicializar Generative AI (Gemini)');
      
      // Intento de re-inicialización con otra clave si falló
      try {
        apiClients.generativeAI = new GoogleGenerativeAI(GOOGLE_KEYS.FIREBASE);
        console.log('✅ Cliente de Google Generative AI (Gemini) inicializado con clave alternativa');
      } catch (secondError) {
        console.error('❌ Error al inicializar Generative AI (Gemini) con clave alternativa:', secondError);
      }
    }

    // Inicializar Secret Manager (para gestión segura de secretos) - Cualquier clave
    try {
      apiClients.secretManager = new SecretManagerServiceClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Cliente de Secret Manager inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Secret Manager:', error);
    }

    console.log('🚀 Inicialización de APIs completada!');

  } catch (error) {
    console.error('❌ Error al inicializar clientes de API de Google Cloud:', error);
  }
};

// Getters para acceder a los clientes de API
export const getVisionClient = (): ImageAnnotatorClient | null => apiClients.vision;
export const getTranslationClient = (): TranslationServiceClient | null => apiClients.translation;
export const getTextToSpeechClient = (): TextToSpeechClient | null => apiClients.textToSpeech;
export const getMapsClient = (): MapsClient | null => apiClients.maps;
export const getVideoIntelligenceClient = (): VideoIntelligenceServiceClient | null => apiClients.videoIntelligence;
export const getVertexAiClient = (): VertexAI | null => apiClients.vertexAi;
export const getSecretManagerClient = (): SecretManagerServiceClient | null => apiClients.secretManager;
export const getGenerativeAIClient = (): GoogleGenerativeAI | null => apiClients.generativeAI;

// URLs para APIs que se acceden directamente desde el cliente
export const apiUrls = {
  mapsJavascript: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places,geometry,visualization`,
  mapsEmbed: `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=`,
  weatherApi: `https://weather.googleapis.com/v1/current?key=${GOOGLE_API_KEY}`,
  geocodingApi: `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}`,
  placesApi: `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_API_KEY}`,
  routesApi: `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_API_KEY}`,
  timeZoneApi: `https://maps.googleapis.com/maps/api/timezone/json?key=${GOOGLE_API_KEY}`,
  streetViewApi: `https://maps.googleapis.com/maps/api/streetview?key=${GOOGLE_API_KEY}`,
  mapsStaticApi: `https://maps.googleapis.com/maps/api/staticmap?key=${GOOGLE_API_KEY}`
};

// Verificar si una API está disponible para su uso
export const isApiAvailable = (apiName: keyof typeof apiClients): boolean => {
  return apiClients[apiName] !== null;
};

// Inicializar todas las APIs al importar el módulo
initializeApiClients();

// Función para configurar la clave API explícitamente
export const configureApiKey = (apiKey: string): void => {
  if (!apiKey) {
    console.error('No se ha proporcionado una clave API válida');
    return;
  }
  
  process.env.GOOGLE_CLOUD_API_KEY = apiKey;
  console.log('Clave API de Google Cloud configurada correctamente');
  
  // Reinicializar los clientes que dependen de la clave API
  initializeApiClients();
};

export default {
  getVisionClient,
  getTranslationClient,
  getTextToSpeechClient,
  getMapsClient,
  getVideoIntelligenceClient,
  getVertexAiClient,
  getSecretManagerClient,
  apiUrls,
  isApiAvailable,
  configureApiKey,
  GOOGLE_API_KEY
};