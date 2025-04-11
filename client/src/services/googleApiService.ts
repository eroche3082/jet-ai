/**
 * Servicio para interactuar con las APIs de Google desde el cliente
 * 
 * Este servicio proporciona funciones para utilizar diversas APIs de Google
 * configuradas para la aplicación JetAI, incluyendo mapas, clima, rutas, etc.
 */

// API Key (configurada en entorno)
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

// URLs base de las APIs
const API_URLS = {
  mapsJavascript: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places,geometry,visualization`,
  mapsEmbed: `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=`,
  weatherApi: `/api/weather`,
  geocodingApi: `/api/geocode`,
  placesApi: `/api/places`,
  routesApi: `/api/routes`,
  timeZoneApi: `/api/timezone`,
  streetViewApi: `/api/streetview`,
  mapsStaticApi: `/api/static-map`,
  videoIntelligenceApi: `/api/video-intelligence`,
};

/**
 * Obtiene información del clima para una ubicación
 * 
 * @param latitude Latitud de la ubicación
 * @param longitude Longitud de la ubicación
 * @returns Datos del clima
 */
export async function getWeather(latitude: number, longitude: number) {
  try {
    const response = await fetch(`${API_URLS.weatherApi}?lat=${latitude}&lon=${longitude}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el clima');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de clima:', error);
    throw error;
  }
}

/**
 * Geocodifica una dirección para obtener sus coordenadas
 * 
 * @param address Dirección o nombre del lugar
 * @returns Datos de geocodificación, incluyendo coordenadas
 */
export async function geocodeAddress(address: string) {
  try {
    const response = await fetch(`${API_URLS.geocodingApi}?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al geocodificar la dirección');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de geocodificación:', error);
    throw error;
  }
}

/**
 * Obtiene la zona horaria para una ubicación
 * 
 * @param latitude Latitud de la ubicación
 * @param longitude Longitud de la ubicación
 * @param timestamp Timestamp para el cual obtener la zona horaria (opcional)
 * @returns Información de zona horaria
 */
export async function getTimeZone(latitude: number, longitude: number, timestamp?: number) {
  try {
    const time = timestamp || Math.floor(Date.now() / 1000);
    const response = await fetch(`${API_URLS.timeZoneApi}?location=${latitude},${longitude}&timestamp=${time}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener la zona horaria');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de zona horaria:', error);
    throw error;
  }
}

/**
 * Obtiene rutas entre dos ubicaciones
 * 
 * @param origin Coordenadas o dirección de origen
 * @param destination Coordenadas o dirección de destino
 * @param mode Modo de transporte (driving, walking, bicycling, transit)
 * @param waypoints Puntos intermedios (opcional)
 * @returns Datos de rutas, incluyendo distancia, duración y pasos
 */
export async function getRoutes(
  origin: string,
  destination: string,
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving',
  waypoints?: string[]
) {
  try {
    let url = `${API_URLS.routesApi}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}`;
    
    if (waypoints && waypoints.length > 0) {
      url += `&waypoints=${waypoints.map(wp => encodeURIComponent(wp)).join('|')}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener rutas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de rutas:', error);
    throw error;
  }
}

/**
 * Obtiene una URL de imagen de Street View
 * 
 * @param location Ubicación (coordenadas o dirección)
 * @param size Tamaño de la imagen (ej: '600x400')
 * @param heading Dirección de la cámara en grados (0-360)
 * @param pitch Ángulo vertical en grados (90 a -90)
 * @returns URL completa de la imagen de Street View
 */
export function getStreetViewImageUrl(
  location: string,
  size: string = '600x400',
  heading: number = 0,
  pitch: number = 0
) {
  return `${API_URLS.streetViewApi}?location=${encodeURIComponent(location)}&size=${size}&heading=${heading}&pitch=${pitch}`;
}

/**
 * Obtiene una URL de mapa estático
 * 
 * @param center Centro del mapa (coordenadas o dirección)
 * @param zoom Nivel de zoom (0-21)
 * @param size Tamaño del mapa (ej: '600x400')
 * @param markers Marcadores a mostrar en el mapa
 * @returns URL completa del mapa estático
 */
export function getStaticMapUrl(
  center: string,
  zoom: number = 13,
  size: string = '600x400',
  markers: Array<{location: string, color?: string, label?: string}> = []
) {
  let url = `${API_URLS.mapsStaticApi}?center=${encodeURIComponent(center)}&zoom=${zoom}&size=${size}`;
  
  // Añadir marcadores si existen
  markers.forEach(marker => {
    const color = marker.color || 'red';
    const label = marker.label || '';
    url += `&markers=color:${color}|label:${label}|${encodeURIComponent(marker.location)}`;
  });
  
  return url;
}

/**
 * Obtiene URL para incrustar un mapa en un iframe
 * 
 * @param query Búsqueda o dirección para el mapa
 * @param zoom Nivel de zoom (0-21)
 * @returns URL completa para iframe de Maps Embed API
 */
export function getMapsEmbedUrl(query: string, zoom: number = 14) {
  return `${API_URLS.mapsEmbed}${encodeURIComponent(query)}&zoom=${zoom}`;
}

/**
 * Analiza un video para detectar escenas, objetos, texto, etc.
 * 
 * @param videoFile Archivo de video a analizar
 * @param features Características a analizar
 * @returns Resultados del análisis de video
 */
export async function analyzeVideo(
  videoFile: File,
  features: Array<'LABEL_DETECTION' | 'SHOT_CHANGE_DETECTION' | 'EXPLICIT_CONTENT_DETECTION' | 'SPEECH_TRANSCRIPTION' | 'TEXT_DETECTION' | 'OBJECT_TRACKING' | 'LOGO_RECOGNITION' | 'FACE_DETECTION' | 'PERSON_DETECTION' | 'LANDMARK_DETECTION'> = ['LABEL_DETECTION']
) {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('features', JSON.stringify(features));
    
    const response = await fetch(API_URLS.videoIntelligenceApi, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al analizar el video');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de inteligencia de video:', error);
    throw error;
  }
}

/**
 * Carga el script de Maps JavaScript API
 * 
 * @returns Promesa que se resuelve cuando el script está cargado
 */
export function loadMapsJavaScriptApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verificar si el script ya está cargado
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Crear script
    const script = document.createElement('script');
    script.src = API_URLS.mapsJavascript;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Maps JavaScript API'));
    
    document.head.appendChild(script);
  });
}

export default {
  getWeather,
  geocodeAddress,
  getTimeZone,
  getRoutes,
  getStreetViewImageUrl,
  getStaticMapUrl,
  getMapsEmbedUrl,
  analyzeVideo,
  loadMapsJavaScriptApi,
  API_URLS
};