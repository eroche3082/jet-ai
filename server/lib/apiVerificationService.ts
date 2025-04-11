/**
 * Servicio de verificación de APIs
 * 
 * Este módulo proporciona funciones para verificar la disponibilidad y estado
 * de todas las APIs de Google Cloud utilizadas en JetAI.
 */

import fetch from 'node-fetch';
import { validateApiAvailability, GOOGLE_API_KEY } from './googleApiConfig';

/**
 * Verifica la respuesta de la API Places para confirmar si está activa
 */
export async function verifyPlacesApi(): Promise<boolean> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Tokyo%20Tower&inputtype=textquery&fields=name&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json() as any;
    
    // Si status no es REQUEST_DENIED, la API está activa
    return data.status !== 'REQUEST_DENIED';
  } catch (error) {
    console.error('Error verificando Places API:', error);
    return false;
  }
}

/**
 * Verifica la respuesta de la API Geocoding para confirmar si está activa
 */
export async function verifyGeocodingApi(): Promise<boolean> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Tokyo&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json() as any;
    
    // Si status no es REQUEST_DENIED, la API está activa
    return data.status !== 'REQUEST_DENIED';
  } catch (error) {
    console.error('Error verificando Geocoding API:', error);
    return false;
  }
}

/**
 * Verifica la respuesta de la API Weather para confirmar si está activa
 */
export async function verifyWeatherApi(): Promise<boolean> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/weather/json?lat=35.6895&lng=139.6917&key=${GOOGLE_API_KEY}`
    );
    
    // Si la respuesta es OK, la API está activa
    return response.ok;
  } catch (error) {
    // La Weather API podría no estar disponible o tener otro endpoint
    return false;
  }
}

/**
 * Verifica la respuesta de la API Routes para confirmar si está activa
 */
export async function verifyRoutesApi(): Promise<boolean> {
  try {
    const response = await fetch(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: 37.419734,
                longitude: -122.0827784
              }
            }
          },
          destination: {
            location: {
              latLng: {
                latitude: 37.417670,
                longitude: -122.079595
              }
            }
          },
          travelMode: "DRIVE",
        })
      }
    );
    
    const data = await response.json() as any;
    
    // Si no hay error de autorización, la API está activa
    return !data.error || data.error.status !== 'PERMISSION_DENIED';
  } catch (error) {
    console.error('Error verificando Routes API:', error);
    return false;
  }
}

/**
 * Verifica el estado de todas las APIs configuradas
 */
export async function verifyAllApis(): Promise<{
  configured: string[];
  active: string[];
  inactive: string[];
}> {
  // Obtener APIs configuradas según las variables de entorno
  const { available, unavailable } = validateApiAvailability();
  
  // Verificar APIs que requieren comprobación adicional
  const activeApis: string[] = [];
  const inactiveApis: string[] = [];
  
  // Verificar APIs de Maps
  const placesActive = await verifyPlacesApi();
  if (placesActive) {
    activeApis.push('Places API');
  } else if (available.includes('Places API')) {
    inactiveApis.push('Places API');
  }
  
  const geocodingActive = await verifyGeocodingApi();
  if (geocodingActive) {
    activeApis.push('Geocoding API');
  } else if (available.includes('Geocoding API')) {
    inactiveApis.push('Geocoding API');
  }
  
  const routesActive = await verifyRoutesApi();
  if (routesActive) {
    activeApis.push('Routes API');
  } else if (available.includes('Routes API')) {
    inactiveApis.push('Routes API');
  }
  
  const weatherActive = await verifyWeatherApi();
  if (weatherActive) {
    activeApis.push('Weather API');
  } else if (available.includes('Weather API')) {
    inactiveApis.push('Weather API');
  }
  
  // Agregar las demás APIs a inactivas si no están en activas y están configuradas
  available.forEach(api => {
    if (!activeApis.includes(api) && 
        api !== 'Places API' && 
        api !== 'Geocoding API' &&
        api !== 'Routes API' &&
        api !== 'Weather API') {
      inactiveApis.push(api);
    }
  });
  
  return {
    configured: available,
    active: activeApis,
    inactive: inactiveApis.concat(unavailable)
  };
}

/**
 * Genera instrucciones para activar las APIs faltantes
 */
export function generateApiActivationInstructions(inactiveApis: string[]): string {
  return `
Para activar las siguientes APIs en Google Cloud Console:

${inactiveApis.map((api, index) => `${index + 1}. ${api}`).join('\n')}

Sigue estos pasos:

1. Ve a la consola de Google Cloud: https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Asegúrate de que la facturación esté habilitada para el proyecto
4. Ve a "APIs y Servicios" > "Biblioteca"
5. Busca y activa cada una de las APIs listadas
6. Verifica que la API key tenga los permisos necesarios para cada API en "APIs y Servicios" > "Credenciales"

Nota: Algunas APIs como Vision AI, Vertex AI y Video Intelligence pueden requerir 
configuración adicional o archivos de credenciales.
  `;
}