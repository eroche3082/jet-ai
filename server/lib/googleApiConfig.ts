/**
 * Google Cloud APIs Configuration for JetAI
 * 
 * This file centralizes the configuration and verification of Google Cloud APIs
 * used in the JetAI application.
 * 
 * API Keys system by groups:
 * GROUP 1 (AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U): 
 * - Places API, Maps APIs, Weather API, Vision AI, Geocoding API
 * 
 * GROUP 2 (AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08):
 * - Generative Language API, Vision AI, Cloud Storage, Translation, Text-to-Speech
 * - Cloud Video Intelligence, Vertex AI, Google Search Console
 * 
 * GROUP 3 (AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0):
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

// API Keys for each service group
const GOOGLE_KEYS = {
  // Group 1: Maps, Places, Vision AI, Weather
  MAPS: process.env.GOOGLE_GROUP1_API_KEY || 'AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U',
  
  // Group 2: Generative AI, Storage, Translation, Text-to-Speech, Video Intelligence
  AI: process.env.GOOGLE_GROUP2_API_KEY || 'AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08',
  
  // Group 3: Firebase, Gemini, Routes, Calendar, Sheets
  FIREBASE: process.env.GOOGLE_GROUP3_API_KEY || 'AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0'
};

// Main API Key for fallback and compatibility
const GOOGLE_API_KEY = GOOGLE_KEYS.AI;

// Initialize the Gemini client (Generative Language API)
// We use API key from group 2 or 3 which have Generative Language API enabled
const genAI = new GoogleGenerativeAI(GOOGLE_KEYS.AI || GOOGLE_KEYS.FIREBASE);

// IMPORTANT: Available models:
// - models/gemini-1.5-flash-latest (fast, efficient)
// - models/gemini-1.5-pro-latest (more powerful, multimodal)
// - gemini-pro (legacy fallback model)

// Interfaces for API clients
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

// Storage for API clients
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

// Verify if environment variables are configured
export const isKeyAvailable = (key: string): boolean => {
  return !!process.env[key] || key === 'GOOGLE_CLOUD_API_KEY';
};

// Initialize API clients with error handling and appropriate API key selection
export const initializeApiClients = (): void => {
  try {
    console.log('Initializing Google Cloud APIs with specific API keys...');

    // Initialize Vision API (for image analysis) - Uses GROUP 1 or 2
    try {
      apiClients.vision = new ImageAnnotatorClient({
        key: GOOGLE_KEYS.AI // Both groups have Vision enabled, we use GROUP 2
      });
      console.log('✅ Google Cloud Vision client initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Vision API:', error);
    }

    // Initialize Translation API (for multilingual translations) - Uses GROUP 2
    try {
      apiClients.translation = new TranslationServiceClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Google Cloud Translate client initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Translation API:', error);
    }

    // Initialize Text-to-Speech API (for voice synthesis) - Uses GROUP 2
    try {
      apiClients.textToSpeech = new TextToSpeechClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Google Cloud Text-to-Speech client initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Text-to-Speech API:', error);
    }

    // Initialize Maps API (for geocoding, places, routes) - Uses GROUP 1
    try {
      // Maps API typically uses the key in each request, so we configure the client here
      // but send the key in each request
      apiClients.maps = new MapsClient({});
      console.log('✅ Google Maps client initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Maps API:', error);
    }

    // Initialize Video Intelligence API (for video analysis) - Uses GROUP 2
    try {
      apiClients.videoIntelligence = new VideoIntelligenceServiceClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Google Cloud Video Intelligence client initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Video Intelligence API:', error);
    }

    // Initialize Vertex AI (for advanced AI models) - Uses GROUP 2
    try {
      apiClients.vertexAi = new VertexAI({
        project: 'jetai-travel-companion',
        location: 'us-central1',
      });
      console.log('✅ Google Vertex AI client initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Vertex AI:', error);
    }

    // Initialize Generative Language API (Gemini) - Uses GROUP 2 for main LLM
    // Note: Already initialized in the genAI definition
    if (apiClients.generativeAI) {
      console.log('✅ Google Generative AI (Gemini) client initialized successfully');
    } else {
      console.error('❌ Error initializing Generative AI (Gemini)');
      
      // Attempt re-initialization with another key if it failed
      try {
        apiClients.generativeAI = new GoogleGenerativeAI(GOOGLE_KEYS.FIREBASE);
        console.log('✅ Google Generative AI (Gemini) client initialized with alternative key');
      } catch (secondError) {
        console.error('❌ Error initializing Generative AI (Gemini) with alternative key:', secondError);
      }
    }

    // Initialize Secret Manager (for secure secrets management) - Any key
    try {
      apiClients.secretManager = new SecretManagerServiceClient({
        key: GOOGLE_KEYS.AI
      });
      console.log('✅ Secret Manager client initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Secret Manager:', error);
    }

    console.log('🚀 API initialization completed!');

  } catch (error) {
    console.error('❌ Error initializing Google Cloud API clients:', error);
  }
};

// Getters to access API clients
export const getVisionClient = (): ImageAnnotatorClient | null => apiClients.vision;
export const getTranslationClient = (): TranslationServiceClient | null => apiClients.translation;
export const getTextToSpeechClient = (): TextToSpeechClient | null => apiClients.textToSpeech;
export const getMapsClient = (): MapsClient | null => apiClients.maps;
export const getVideoIntelligenceClient = (): VideoIntelligenceServiceClient | null => apiClients.videoIntelligence;
export const getVertexAiClient = (): VertexAI | null => apiClients.vertexAi;
export const getSecretManagerClient = (): SecretManagerServiceClient | null => apiClients.secretManager;
export const getGenerativeAIClient = (): GoogleGenerativeAI | null => apiClients.generativeAI;

// URLs for APIs that are accessed directly from the client
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

// Verify if an API is available for use
export const isApiAvailable = (apiName: keyof typeof apiClients): boolean => {
  return apiClients[apiName] !== null;
};

// Initialize all APIs when importing the module
initializeApiClients();

// Function to explicitly configure the API key
export const configureApiKey = (apiKey: string): void => {
  if (!apiKey) {
    console.error('No valid API key has been provided');
    return;
  }
  
  process.env.GOOGLE_CLOUD_API_KEY = apiKey;
  console.log('Google Cloud API key configured successfully');
  
  // Reinitialize clients that depend on the API key
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