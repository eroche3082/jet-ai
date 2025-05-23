/**
 * Google API Configuration
 * Manages API keys and service account credentials for Google Cloud services
 * Integrates with API Key Manager for dynamic API key assignment
 */

import * as fs from 'fs';
import * as path from 'path';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TranslationServiceClient } from '@google-cloud/translate';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { VertexAI } from '@google-cloud/vertexai';
import { apiKeyManager, ServiceCategory } from './apiKeyManager';

// API keys by service group - keeping this for backwards compatibility
export const API_KEYS = {
  // Group 1: Maps and location services
  MAPS_API_KEY: 'AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U',
  
  // Group 2: AI and language services 
  GEMINI_API_KEY: 'AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08',
  VERTEX_API_KEY: 'AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08',
  
  // Group 3: Firebase (Note: This key is not working for Gemini but may work for Firebase)
  FIREBASE_API_KEY: 'AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0',
  
  // Universal API key (Use as fallback only as it's currently not working for Gemini)
  UNIVERSAL_API_KEY: 'AIzaSyDnmNNHrQ-xpnOozOZgVv4F9qQpiU-GfdA'
};

// Service account clients
let visionClient: ImageAnnotatorClient | null = null;
let translateClient: TranslationServiceClient | null = null;
let ttsClient: TextToSpeechClient | null = null;
let videoClient: VideoIntelligenceServiceClient | null = null;
let mapsClient: MapsClient | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;
let genAI: GoogleGenerativeAI | null = null;
let vertexAI: VertexAI | null = null;

// Service initialization status
export const serviceStatus = {
  vision: false,
  translate: false,
  tts: false,
  maps: false,
  video: false,
  secretManager: false,
  genAI: false,
  vertexAI: false
};

/**
 * Initialize all Google Cloud API clients using the API Key Manager
 * for dynamic API key assignment
 */
export function initializeGoogleCloudApis() {
  console.log('Initializing Google Cloud APIs with specific API keys...');
  
  try {
    // Vision API with dynamic API key assignment
    visionClient = new ImageAnnotatorClient({ 
      key: apiKeyManager.getApiKeyForService(ServiceCategory.VISION) 
    });
    serviceStatus.vision = true;
    console.log('✅ Google Cloud Vision client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud Vision client:', error);
  }
  
  try {
    // Translate API with dynamic API key assignment
    translateClient = new TranslationServiceClient({ 
      key: apiKeyManager.getApiKeyForService(ServiceCategory.TRANSLATE) 
    });
    serviceStatus.translate = true;
    console.log('✅ Google Cloud Translate client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud Translate client:', error);
  }
  
  try {
    // Text-to-Speech API with dynamic API key assignment
    ttsClient = new TextToSpeechClient({ 
      key: apiKeyManager.getApiKeyForService(ServiceCategory.TTS) 
    });
    serviceStatus.tts = true;
    console.log('✅ Google Cloud Text-to-Speech client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud Text-to-Speech client:', error);
  }
  
  try {
    // Maps API - using API Key Manager for initialization 
    mapsClient = apiKeyManager.initializeMaps();
    if (mapsClient) {
      serviceStatus.maps = true;
      console.log('✅ Google Maps client initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Google Maps client:', error);
  }
  
  try {
    // Video Intelligence API with dynamic API key assignment
    videoClient = new VideoIntelligenceServiceClient({ 
      key: apiKeyManager.getApiKeyForService(ServiceCategory.VIDEO) 
    });
    serviceStatus.video = true;
    console.log('✅ Google Cloud Video Intelligence client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud Video Intelligence client:', error);
  }
  
  try {
    // Secret Manager API with dynamic API key assignment
    secretManagerClient = new SecretManagerServiceClient({ 
      key: apiKeyManager.getApiKeyForService(ServiceCategory.SECRETMANAGER) 
    });
    serviceStatus.secretManager = true;
    console.log('✅ Secret Manager client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Secret Manager client:', error);
  }
  
  try {
    // Vertex AI - using API Key Manager for initialization
    vertexAI = apiKeyManager.initializeVertexAI();
    if (vertexAI) {
      serviceStatus.vertexAI = true;
      console.log('✅ Google Vertex AI client initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Google Vertex AI client:', error);
  }
  
  try {
    // Gemini API - using API Key Manager for initialization
    genAI = apiKeyManager.initializeGemini();
    if (genAI) {
      serviceStatus.genAI = true;
      console.log('✅ Google Generative AI (Gemini) client initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Google Generative AI (Gemini) client:', error);
  }
  
  // Log API assignment summary
  console.log(apiKeyManager.getApiAssignmentSummary());
  
  console.log('🚀 API initialization completed!');
}

/**
 * Get Google Cloud Vision client
 */
export function getVisionClient(): ImageAnnotatorClient {
  if (!visionClient) {
    throw new Error('Vision client not initialized');
  }
  return visionClient;
}

/**
 * Get Google Cloud Translate client
 */
export function getTranslateClient(): TranslationServiceClient {
  if (!translateClient) {
    throw new Error('Translate client not initialized');
  }
  return translateClient;
}

/**
 * Get Google Cloud Text-to-Speech client
 */
export function getTTSClient(): TextToSpeechClient {
  if (!ttsClient) {
    throw new Error('Text-to-Speech client not initialized');
  }
  return ttsClient;
}

/**
 * Get Google Maps client
 */
export function getMapsClient(): MapsClient {
  if (!mapsClient) {
    mapsClient = new MapsClient({});
  }
  return mapsClient;
}

/**
 * Get Google Generative AI (Gemini) client
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    // Use the API Key Manager to get the appropriate key for Gemini
    genAI = apiKeyManager.initializeGemini();
    if (!genAI) {
      // Fallback to the static GROUP2 key which is known to work
      genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
      console.log('⚠️ Using fallback GEMINI_API_KEY as API Key Manager failed to initialize Gemini');
    }
  }
  return genAI;
}

/**
 * Get Google Vertex AI client
 */
export function getVertexAIClient(): VertexAI {
  if (!vertexAI) {
    // Use the API Key Manager to get the appropriate configuration for Vertex AI
    vertexAI = apiKeyManager.initializeVertexAI();
    if (!vertexAI) {
      // Fallback to directly initializing Vertex AI
      vertexAI = new VertexAI({
        project: 'jetai-travel-companion',
        location: 'us-central1',
      });
      console.log('⚠️ Using fallback VertexAI initialization as API Key Manager failed');
    }
  }
  return vertexAI;
}

/**
 * Get Google Video Intelligence client
 */
export function getVideoIntelligenceClient(): VideoIntelligenceServiceClient {
  if (!videoClient) {
    throw new Error('Video Intelligence client not initialized');
  }
  return videoClient;
}

// Alias for backward compatibility
export const getVideoClient = getVideoIntelligenceClient;

/**
 * Get Secret Manager client
 */
export function getSecretManagerClient(): SecretManagerServiceClient {
  if (!secretManagerClient) {
    throw new Error('Secret Manager client not initialized');
  }
  return secretManagerClient;
}

/**
 * Configure Google Maps API request with the correct API key
 */
export function configureGoogleMapsRequest(params: any = {}): any {
  return {
    ...params,
    params: {
      ...params.params,
      key: apiKeyManager.getMapsApiKey() // Use dynamic API key assignment
    }
  };
}

/**
 * Initialize Google API configuration
 */
export function initializeGoogleApiConfig() {
  // Create credentials file if it doesn't exist
  try {
    const credentialsPath = path.resolve(process.cwd(), 'google-credentials-global.json');
    
    // Check if credentials file already exists
    if (!fs.existsSync(credentialsPath)) {
      // Create a basic credentials file for application to use
      const credentials = {
        type: 'service_account',
        project_id: 'jetai-travel-companion',
        private_key_id: 'private-key-id',
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCdH7+3GP1hxjFj\n-----END PRIVATE KEY-----\n',
        client_email: 'jetai-service-account@jetai-travel-companion.iam.gserviceaccount.com',
        client_id: 'client-id',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/jetai-service-account%40jetai-travel-companion.iam.gserviceaccount.com',
        universe_domain: 'googleapis.com'
      };
      
      fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
      console.log(`Google Cloud credentials file configured successfully: ${credentialsPath}`);
    } else {
      console.log(`Using existing Google Cloud credentials file: ${credentialsPath}`);
    }
    
    // Set environment variable for credentials file
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    
    // Initialize all API clients
    initializeGoogleCloudApis();
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Google API configuration:', error);
    return false;
  }
}

export default {
  API_KEYS,
  initializeGoogleApiConfig,
  getVisionClient,
  getTranslateClient,
  getTTSClient,
  getMapsClient,
  getGeminiClient,
  getVertexAIClient,
  getVideoClient,
  getSecretManagerClient,
  configureGoogleMapsRequest
};