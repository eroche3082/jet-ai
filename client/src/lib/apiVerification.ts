/**
 * API Verification System for JetAI
 * 
 * This module provides functionality to check the status and connectivity
 * of various APIs used in the JetAI application.
 */

import axios from 'axios';

// Define API status types
export type ApiStatusType = 'connected' | 'disconnected' | 'limited' | 'unknown';

export interface ApiStatus {
  name: string;
  status: ApiStatusType;
  message?: string;
}

// Map of API endpoints for verification
const API_ENDPOINTS: Record<string, string> = {
  'Gemini AI': '/api/gemini/status',
  'Claude AI': '/api/anthropic/status',
  'OpenAI': '/api/openai/status',
  'Google Maps': '/api/google/maps/status',
  'Google Vision': '/api/google/vision/status',
  'Google Translate': '/api/google/translate/status',
  'Google TTS': '/api/google/tts/status',
  'Firebase': '/api/firebase/status',
  'Amadeus': '/api/amadeus/status',
  'RapidAPI': '/api/rapidapi/status',
  'Stripe': '/api/stripe/status',
  'TripAdvisor': '/api/tripadvisor/status'
};

/**
 * Check the status of a specific API
 */
export async function checkApiStatus(apiName: string): Promise<ApiStatus> {
  console.log(`Checking status for API: ${apiName}`);
  
  // If we don't have an endpoint for this API, return unknown status
  if (!API_ENDPOINTS[apiName]) {
    return {
      name: apiName,
      status: 'unknown',
      message: 'No verification endpoint defined for this API'
    };
  }
  
  try {
    // Call the API status endpoint
    const response = await axios.get(API_ENDPOINTS[apiName], {
      timeout: 5000 // 5 second timeout
    });
    
    // Check response status
    if (response.status === 200 && response.data.status === 'ok') {
      return {
        name: apiName,
        status: 'connected',
        message: response.data.message || 'API is connected and functional'
      };
    } else if (response.status === 200 && response.data.status === 'limited') {
      return {
        name: apiName,
        status: 'limited',
        message: response.data.message || 'API is connected but with limitations'
      };
    } else {
      return {
        name: apiName,
        status: 'disconnected',
        message: response.data.message || 'API responded but indicated disconnected status'
      };
    }
  } catch (error) {
    console.error(`Error checking status for API ${apiName}:`, error);
    
    // Fallback to check if the API is available via other methods
    const fallbackStatus = await checkAlternativeApiStatus(apiName);
    if (fallbackStatus.status !== 'unknown') {
      return fallbackStatus;
    }
    
    return {
      name: apiName,
      status: 'disconnected',
      message: error.message || 'Failed to connect to API'
    };
  }
}

/**
 * Alternative method to check API status without dedicated endpoints
 */
async function checkAlternativeApiStatus(apiName: string): Promise<ApiStatus> {
  // This is a fallback method that tries to infer API status from application behavior
  // In a real app, this would be more sophisticated
  
  try {
    switch (apiName) {
      case 'Firebase':
        // Check if Firebase Auth is initialized
        const isFirebaseAvailable = window.localStorage.getItem('firebase_initialized') === 'true';
        return {
          name: apiName,
          status: isFirebaseAvailable ? 'connected' : 'disconnected',
          message: isFirebaseAvailable ? 'Firebase detected in local storage' : 'Firebase not initialized'
        };
        
      case 'Gemini AI':
      case 'Claude AI':
      case 'OpenAI':
        // Check if we have recent AI responses cached
        const hasAiResponses = window.localStorage.getItem('recent_ai_responses');
        return {
          name: apiName,
          status: hasAiResponses ? 'connected' : 'unknown',
          message: hasAiResponses ? 'Recent AI activity detected' : 'No recent AI activity detected'
        };
        
      default:
        return {
          name: apiName,
          status: 'unknown',
          message: 'No alternative verification method available'
        };
    }
  } catch (error) {
    console.error(`Error in alternative status check for ${apiName}:`, error);
    return {
      name: apiName,
      status: 'unknown',
      message: 'Error during alternative verification'
    };
  }
}

/**
 * Check multiple APIs at once
 */
export async function checkMultipleApiStatus(apiNames: string[]): Promise<Record<string, ApiStatus>> {
  const results: Record<string, ApiStatus> = {};
  
  await Promise.all(
    apiNames.map(async (apiName) => {
      try {
        results[apiName] = await checkApiStatus(apiName);
      } catch (error) {
        console.error(`Error checking API status for ${apiName}:`, error);
        results[apiName] = {
          name: apiName,
          status: 'unknown',
          message: 'Error during verification'
        };
      }
    })
  );
  
  return results;
}

/**
 * Get a summary of all API statuses
 */
export async function getApiStatusSummary(): Promise<{
  connected: string[];
  limited: string[];
  disconnected: string[];
  unknown: string[];
}> {
  const allApis = Object.keys(API_ENDPOINTS);
  const statuses = await checkMultipleApiStatus(allApis);
  
  return {
    connected: Object.values(statuses)
      .filter(status => status.status === 'connected')
      .map(status => status.name),
    limited: Object.values(statuses)
      .filter(status => status.status === 'limited')
      .map(status => status.name),
    disconnected: Object.values(statuses)
      .filter(status => status.status === 'disconnected')
      .map(status => status.name),
    unknown: Object.values(statuses)
      .filter(status => status.status === 'unknown')
      .map(status => status.name)
  };
}