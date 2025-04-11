/**
 * Servicio de APIs para JetAI
 * Este archivo maneja la integración con diferentes APIs para proporcionar
 * información turística, hoteles, vuelos, etc.
 */

import { FormData } from './itineraryGenerator';

export type APICategory = 
  | 'beachHotels'
  | 'localExperiences'
  | 'restaurantSuggestions'
  | 'flightOptions'
  | 'weatherForecast'
  | 'currencyRates'
  | 'localNews'
  | 'safetyInfo';

interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Llama a una API externa basada en la categoría
 */
export async function callAPI(category: APICategory, data?: FormData): Promise<APIResponse> {
  try {
    console.log(`Calling API for category: ${category}`);
    
    // Implementación real: aquí se llamaría a las APIs correspondientes
    // basadas en la categoría y los datos del formulario
    
    // Ejemplo de respuesta
    return {
      success: true,
      data: {
        category,
        message: `API called successfully for ${category}`,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error(`Error calling API for ${category}:`, error);
    return {
      success: false,
      error: `Failed to call API for ${category}`
    };
  }
}

/**
 * Analiza el sentimiento de los datos proporcionados
 */
export async function analyzeSentiment(data: FormData): Promise<{
  score: number;
  magnitude: number;
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited';
}> {
  try {
    console.log('Analyzing sentiment of form data');
    
    // En una implementación real, aquí se llamaría a la API de Google Natural Language
    // para analizar el sentimiento de los datos ingresados por el usuario
    
    // Por ahora, devolvemos un sentimiento neutral
    return {
      score: 0.1,
      magnitude: 0.5,
      emotion: 'neutral'
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    // En caso de error, devolvemos un sentimiento neutral
    return {
      score: 0,
      magnitude: 0,
      emotion: 'neutral'
    };
  }
}

/**
 * Activa múltiples APIs basadas en los intereses del usuario
 */
export async function triggerAPIs(data: FormData): Promise<APIResponse[]> {
  const responses: APIResponse[] = [];
  
  try {
    // Determinar qué APIs llamar basado en los intereses del usuario
    if (data.interests) {
      const interests = data.interests.toLowerCase();
      
      if (interests.includes('beach')) {
        responses.push(await callAPI('beachHotels', data));
      }
      
      if (interests.includes('culture') || interests.includes('history')) {
        responses.push(await callAPI('localExperiences', data));
      }
      
      if (interests.includes('food') || interests.includes('culinary')) {
        responses.push(await callAPI('restaurantSuggestions', data));
      }
      
      // Añadir más condiciones para diferentes intereses
    }
    
    // Estas APIs se llaman independientemente de los intereses
    responses.push(await callAPI('weatherForecast', data));
    responses.push(await callAPI('safetyInfo', data));
    
    return responses;
  } catch (error) {
    console.error('Error triggering APIs:', error);
    return [{
      success: false,
      error: 'Failed to trigger APIs'
    }];
  }
}