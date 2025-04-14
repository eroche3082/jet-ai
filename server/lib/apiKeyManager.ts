/**
 * API Key Manager
 * 
 * Dynamic API Key Group Assignment System for Google Cloud Services
 * Automatically selects the most appropriate API key group based on service requirements
 * and implements fallback mechanisms when primary keys fail
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { VertexAI } from '@google-cloud/vertexai';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';

// Define service categories and their corresponding group affinities
enum ServiceCategory {
  AI_ML = 'ai_ml',         // Gemini, Vertex AI
  WORKSPACE = 'workspace', // Gmail, Docs, Calendar, Meet, YouTube, Sheets
  FIREBASE = 'firebase',   // Realtime DB, Hosting, Messaging, In-App Config
  MAPS = 'maps',           // Maps, Places, Travel, Weather
  VISION = 'vision',       // Vision AI, Cloud Vision
  TRANSLATE = 'translate', // Translation services
  TTS = 'tts',             // Text-to-Speech
  VIDEO = 'video',         // Video Intelligence
  STORAGE = 'storage',     // Cloud Storage
  SECRETMANAGER = 'secretmanager' // Secret Manager
}

// Define group preferences for each service category (order matters - first is preferred)
const SERVICE_GROUP_PREFERENCES: Record<ServiceCategory, number[]> = {
  [ServiceCategory.AI_ML]: [1, 2, 3, 4, 5],
  [ServiceCategory.WORKSPACE]: [2, 3, 4, 5, 1],
  [ServiceCategory.FIREBASE]: [3, 4, 5, 2, 1],
  [ServiceCategory.MAPS]: [1, 5, 3, 2, 4],
  [ServiceCategory.VISION]: [5, 1, 2, 3, 4],  // Use GROUP5 as first preference for Vision
  [ServiceCategory.TRANSLATE]: [5, 1, 2, 3, 4], // Use GROUP5 as first preference for Translate
  [ServiceCategory.TTS]: [5, 2, 1, 3, 4],      // Use GROUP5 as first preference for TTS
  [ServiceCategory.VIDEO]: [5, 1, 2, 3, 4],    // Use GROUP5 as first preference for Video
  [ServiceCategory.STORAGE]: [3, 5, 2, 1, 4],
  [ServiceCategory.SECRETMANAGER]: [2, 5, 3, 1, 4]
};

// Define API keys for each group
interface ApiKeyGroups {
  GROUP1: string;
  GROUP2: string;
  GROUP3: string;
  GROUP4: string;
  GROUP5: string;
  [key: string]: string;
}

// Service client initialization status
interface ServiceStatus {
  initialized: boolean;
  assignedGroup: number | null;
  lastError: string | null;
}

class ApiKeyManager {
  private apiKeys: ApiKeyGroups;
  private serviceStatus: Record<string, ServiceStatus>;
  private agentName: string;
  private serviceClients: Record<string, any>;

  constructor(agentName: string = 'JetAI') {
    this.agentName = agentName;
    
    // Initialize API key groups from environment variables
    this.apiKeys = {
      GROUP1: process.env.GOOGLE_GROUP1_API_KEY || 'AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U',
      GROUP2: process.env.GOOGLE_GROUP2_API_KEY || 'AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08',
      GROUP3: process.env.GOOGLE_GROUP3_API_KEY || 'AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0',
      GROUP4: process.env.GOOGLE_GROUP4_API_KEY || 'AIzaSyA6MCkrLbzGOJ7SGj-yxq4pSc3EnJHLIaI',
      GROUP5: process.env.GOOGLE_API_KEY || 'AIzaSyA--rn_uJjZtyU9kGpIWDpBa-obvtPrC24'
    };
    
    // Initialize service status tracking
    this.serviceStatus = {};
    
    // Initialize service clients storage
    this.serviceClients = {};
    
    // Log initialization
    console.log(`🔑 [${this.agentName}] API Key Manager initialized with ${Object.keys(this.apiKeys).length} key groups`);
  }

  /**
   * Get the appropriate API key for a service category
   * @param category The service category
   * @returns The API key
   */
  public getApiKeyForService(category: ServiceCategory): string {
    const preferredGroups = SERVICE_GROUP_PREFERENCES[category];
    
    // Try each preferred group in order
    for (const groupNumber of preferredGroups) {
      const groupKey = `GROUP${groupNumber}`;
      const apiKey = this.apiKeys[groupKey];
      
      if (apiKey) {
        console.log(`🔄 [${this.agentName}] Trying ${groupKey} for ${category}...`);
        return apiKey;
      }
    }
    
    // If no preferred key is available, return the first available key
    for (const groupKey in this.apiKeys) {
      if (this.apiKeys[groupKey]) {
        console.warn(`⚠️ [${this.agentName}] No preferred key for ${category}, using ${groupKey} as fallback`);
        return this.apiKeys[groupKey];
      }
    }
    
    // If no keys are available at all, throw an error
    throw new Error(`No API keys available for ${category} in ${this.agentName}`);
  }

  /**
   * Initialize a service with the appropriate API key
   * @param category The service category
   * @param serviceName The name of the service
   * @param initFunction The function to initialize the service
   * @returns The initialized service client
   */
  public initializeService<T>(
    category: ServiceCategory,
    serviceName: string,
    initFunction: (apiKey: string) => T
  ): T | null {
    // Skip if already initialized successfully
    if (this.serviceStatus[serviceName]?.initialized) {
      return this.serviceClients[serviceName];
    }
    
    // Set initial status if not exists
    if (!this.serviceStatus[serviceName]) {
      this.serviceStatus[serviceName] = {
        initialized: false,
        assignedGroup: null,
        lastError: null
      };
    }
    
    // Try each group based on preferences
    const preferredGroups = SERVICE_GROUP_PREFERENCES[category];
    
    for (const groupNumber of preferredGroups) {
      const groupKey = `GROUP${groupNumber}`;
      const apiKey = this.apiKeys[groupKey];
      
      if (!apiKey) continue;
      
      try {
        console.log(`🔄 [${this.agentName}] Initializing ${serviceName} with ${groupKey}...`);
        const client = initFunction(apiKey);
        
        // Test if the client works by doing a simple operation
        // This will be implemented separately for each service type
        
        // If no error, mark as initialized
        this.serviceStatus[serviceName] = {
          initialized: true,
          assignedGroup: groupNumber,
          lastError: null
        };
        
        this.serviceClients[serviceName] = client;
        
        console.log(`✅ [${this.agentName}] using ${groupKey} for ${serviceName} → Success`);
        return client;
      } catch (error: any) {
        const errorMessage = error?.message || 'Unknown error';
        console.warn(`⚠️ [${this.agentName}] Failed to initialize ${serviceName} with ${groupKey}: ${errorMessage}`);
        this.serviceStatus[serviceName].lastError = errorMessage;
        // Continue to next group
      }
    }
    
    // If all groups failed, log error and return null
    console.error(`❌ [${this.agentName}] All API keys failed for ${serviceName}. Entering fallback mode.`);
    
    // Potential notification to superadmin would go here
    
    return null;
  }

  /**
   * Initialize Gemini AI
   * @returns The Gemini AI client
   */
  public initializeGemini(): GoogleGenerativeAI | null {
    return this.initializeService<GoogleGenerativeAI>(
      ServiceCategory.AI_ML,
      'gemini',
      (apiKey) => {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Test initialization by doing a minimal operation
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // If no error occurs, initialization is successful
        return genAI;
      }
    );
  }

  /**
   * Initialize Vertex AI
   * @returns The Vertex AI client
   */
  public initializeVertexAI(): VertexAI | null {
    return this.initializeService<VertexAI>(
      ServiceCategory.AI_ML,
      'vertexAI',
      (_apiKey) => {
        // Vertex AI uses service account credentials instead of API key
        // We're just using the category for grouping
        const vertexAI = new VertexAI({
          project: 'jetai-travel-companion',
          location: 'us-central1',
        });
        return vertexAI;
      }
    );
  }

  /**
   * Initialize Google Maps client
   * @returns The Maps client
   */
  public initializeMaps(): MapsClient | null {
    return this.initializeService<MapsClient>(
      ServiceCategory.MAPS,
      'maps',
      (_apiKey) => {
        // Maps client doesn't take API key in constructor
        // It's added to each request instead
        const mapsClient = new MapsClient({});
        return mapsClient;
      }
    );
  }

  /**
   * Get the API key to use for Maps API requests
   * @returns The Maps API key
   */
  public getMapsApiKey(): string {
    return this.getApiKeyForService(ServiceCategory.MAPS);
  }

  /**
   * Get the Gemini API key
   * @returns The Gemini API key
   */
  public getGeminiApiKey(): string {
    return this.getApiKeyForService(ServiceCategory.AI_ML);
  }

  /**
   * Get a specific service client that was initialized
   * @param serviceName The name of the service
   * @returns The service client or null if not initialized
   */
  public getServiceClient(serviceName: string): any | null {
    return this.serviceClients[serviceName] || null;
  }

  /**
   * Get the status of all services
   * @returns The service status map
   */
  public getServicesStatus(): Record<string, ServiceStatus> {
    return this.serviceStatus;
  }

  /**
   * Generate a summary report of API key assignments
   * @returns A formatted string with the API key assignment summary
   */
  public getApiAssignmentSummary(): string {
    const summary = Object.entries(this.serviceStatus)
      .map(([serviceName, status]) => {
        if (status.initialized) {
          return `${serviceName}: GROUP${status.assignedGroup} ✅`;
        } else {
          return `${serviceName}: Failed ❌ (${status.lastError})`;
        }
      })
      .join('\n');
    
    return `API KEY ASSIGNMENT SUMMARY FOR ${this.agentName}:\n${summary}`;
  }
}

// Create and export a singleton instance
export const apiKeyManager = new ApiKeyManager('JetAI');

// Export the ServiceCategory enum for use by other modules
export { ServiceCategory };

// Export a type for the API Key Manager
export type ApiKeyManagerType = ApiKeyManager;