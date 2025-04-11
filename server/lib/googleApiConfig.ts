/**
 * Configuración de APIs de Google Cloud para JetAI
 * 
 * Este archivo centraliza la configuración y verificación de las APIs de Google Cloud
 * utilizadas en la aplicación JetAI.
 */

import { VertexAI } from '@google-cloud/vertexai';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { TranslationServiceClient } from '@google-cloud/translate';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';

// API Key principal para servicios que la requieren directamente
const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_API_KEY || '';

// Interfaces para los clientes de APIs
interface ApiClients {
  vision: ImageAnnotatorClient | null;
  translation: TranslationServiceClient | null;
  textToSpeech: TextToSpeechClient | null;
  maps: MapsClient | null;
  videoIntelligence: VideoIntelligenceServiceClient | null;
  vertexAi: VertexAI | null;
  secretManager: SecretManagerServiceClient | null;
}

// Almacenamiento de clientes de API
const apiClients: ApiClients = {
  vision: null,
  translation: null,
  textToSpeech: null,
  maps: null,
  videoIntelligence: null,
  vertexAi: null,
  secretManager: null
};

// Verificar si las variables de entorno están configuradas
export const isKeyAvailable = (key: string): boolean => {
  return !!process.env[key];
};

// Inicializar clientes de API con manejo de errores
export const initializeApiClients = (): void => {
  try {
    // Verificar credenciales de Google Cloud
    const hasCredentialsFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!hasCredentialsFile) {
      console.warn('La variable de entorno GOOGLE_APPLICATION_CREDENTIALS no está configurada.');
      console.warn('Si quieres utilizar los servicios de Google Cloud, debes configurar esta variable.');
    }

    // Inicializar Vision API
    if (isKeyAvailable('GOOGLE_CLOUD_VISION_API_KEY')) {
      try {
        apiClients.vision = new ImageAnnotatorClient();
        console.log('Cliente de Google Cloud Vision inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Vision API:', error);
      }
    }

    // Inicializar Translation API
    if (isKeyAvailable('GOOGLE_TRANSLATE_API_KEY')) {
      try {
        apiClients.translation = new TranslationServiceClient();
        console.log('Cliente de Google Cloud Translate inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Translation API:', error);
      }
    }

    // Inicializar Text-to-Speech API
    if (isKeyAvailable('GOOGLE_TTS_API_KEY')) {
      try {
        apiClients.textToSpeech = new TextToSpeechClient();
        console.log('Cliente de Google Cloud Text-to-Speech inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Text-to-Speech API:', error);
      }
    }

    // Inicializar Maps API
    if (isKeyAvailable('GOOGLE_CLOUD_API_KEY')) {
      try {
        apiClients.maps = new MapsClient({});
        console.log('Cliente de Google Maps inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Maps API:', error);
      }
    }

    // Inicializar Video Intelligence API
    if (isKeyAvailable('GOOGLE_CLOUD_API_KEY')) {
      try {
        apiClients.videoIntelligence = new VideoIntelligenceServiceClient();
        console.log('Cliente de Google Cloud Video Intelligence inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Video Intelligence API:', error);
      }
    }

    // Inicializar Vertex AI
    if (isKeyAvailable('GOOGLE_CLOUD_API_KEY')) {
      try {
        apiClients.vertexAi = new VertexAI({
          project: 'jetai-travel-companion',
          location: 'us-central1',
        });
        console.log('Cliente de Google Vertex AI inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Vertex AI:', error);
      }
    }

    // Inicializar Secret Manager
    try {
      apiClients.secretManager = new SecretManagerServiceClient();
      console.log('Cliente de Secret Manager inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Secret Manager:', error);
    }

  } catch (error) {
    console.error('Error al inicializar clientes de API de Google Cloud:', error);
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