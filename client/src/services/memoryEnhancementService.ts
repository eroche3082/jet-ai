/**
 * Servicio para comunicarse con las APIs de mejora de memorias
 * 
 * Este servicio proporciona funciones para analizar imágenes, generar audio,
 * traducir textos y obtener información sobre ubicaciones utilizando
 * los servicios de Google Cloud.
 */

import { apiRequest } from '@/lib/queryClient';

/**
 * Analiza una imagen para extraer información
 * 
 * @param imageFile El archivo de imagen a analizar
 * @returns Información extraída de la imagen, incluyendo etiquetas, texto, puntos de referencia, etc.
 */
export async function analyzeImage(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/memory-enhancement/analyze-image', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al analizar imagen');
  }
  
  return response.json();
}

/**
 * Genera audio a partir de texto (narración)
 * 
 * @param text Texto a convertir en audio
 * @param languageCode Código de idioma (ej: 'es-ES')
 * @param voiceName Nombre de la voz a utilizar
 * @param gender Género de la voz (MALE, FEMALE, NEUTRAL)
 * @returns URL del audio generado
 */
export async function generateAudio(
  text: string, 
  languageCode?: string, 
  voiceName?: string, 
  gender?: 'MALE' | 'FEMALE' | 'NEUTRAL'
) {
  const response = await apiRequest('POST', '/api/memory-enhancement/generate-audio', {
    text,
    languageCode,
    voiceName,
    gender
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al generar audio');
  }
  
  return response.json();
}

/**
 * Traduce texto a otro idioma
 * 
 * @param text Texto a traducir
 * @param targetLanguage Código del idioma de destino (ej: 'en', 'fr', 'ja')
 * @returns Texto traducido y el idioma detectado
 */
export async function translateText(text: string, targetLanguage: string) {
  const response = await apiRequest('POST', '/api/memory-enhancement/translate', {
    text,
    targetLanguage
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al traducir texto');
  }
  
  return response.json();
}

/**
 * Obtiene información detallada sobre una ubicación
 * 
 * @param query Texto de búsqueda de la ubicación (ej: "Torre Eiffel, París")
 * @returns Información detallada sobre la ubicación, incluyendo coordenadas, puntos de interés cercanos, etc.
 */
export async function getLocationInfo(query: string) {
  const response = await apiRequest('POST', '/api/memory-enhancement/location-info', {
    query
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener información de ubicación');
  }
  
  return response.json();
}

/**
 * Analiza texto para extraer entidades y sentimiento
 * 
 * @param text Texto a analizar
 * @returns Información sobre entidades mencionadas y análisis de sentimiento
 */
export async function analyzeDestinationText(text: string) {
  const response = await apiRequest('POST', '/api/memory-enhancement/analyze-destination-text', {
    text
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al analizar texto');
  }
  
  return response.json();
}

/**
 * Códigos de idioma para selección en la interfaz
 */
export const LANGUAGE_OPTIONS = [
  { code: 'es-ES', name: 'Español' },
  { code: 'en-US', name: 'Inglés (US)' },
  { code: 'en-GB', name: 'Inglés (UK)' },
  { code: 'fr-FR', name: 'Francés' },
  { code: 'de-DE', name: 'Alemán' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-PT', name: 'Portugués' },
  { code: 'zh-CN', name: 'Chino (Mandarín)' },
  { code: 'ja-JP', name: 'Japonés' },
  { code: 'ko-KR', name: 'Coreano' },
  { code: 'ru-RU', name: 'Ruso' },
  { code: 'ar-XA', name: 'Árabe' },
  { code: 'hi-IN', name: 'Hindi' },
];