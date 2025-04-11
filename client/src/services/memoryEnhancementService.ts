/**
 * Servicio para comunicarse con las APIs de mejora de memorias
 * 
 * Este servicio proporciona funciones para analizar imágenes, generar audio,
 * traducir textos y obtener información sobre ubicaciones utilizando
 * los servicios de Google Cloud.
 */

export const API_BASE_URL = '/api/memories';

/**
 * Códigos de idioma para selección en la interfaz
 */
export const LANGUAGE_OPTIONS = [
  { code: 'es-ES', name: 'Español' },
  { code: 'en-US', name: 'Inglés' },
  { code: 'fr-FR', name: 'Francés' },
  { code: 'de-DE', name: 'Alemán' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-PT', name: 'Portugués' },
  { code: 'ja-JP', name: 'Japonés' },
  { code: 'zh-CN', name: 'Chino' },
  { code: 'ko-KR', name: 'Coreano' },
  { code: 'ru-RU', name: 'Ruso' },
  { code: 'ar-SA', name: 'Árabe' },
  { code: 'nl-NL', name: 'Holandés' },
  { code: 'sv-SE', name: 'Sueco' },
  { code: 'no-NO', name: 'Noruego' },
  { code: 'da-DK', name: 'Danés' },
  { code: 'pl-PL', name: 'Polaco' },
  { code: 'cs-CZ', name: 'Checo' },
  { code: 'tr-TR', name: 'Turco' },
  { code: 'hu-HU', name: 'Húngaro' },
  { code: 'th-TH', name: 'Tailandés' },
];

/**
 * Analiza una imagen para extraer información
 * 
 * @param imageFile El archivo de imagen a analizar
 * @returns Información extraída de la imagen, incluyendo etiquetas, texto, puntos de referencia, etc.
 */
export async function analyzeImage(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al analizar la imagen');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de análisis de imagen:', error);
    throw error;
  }
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
  languageCode: string = 'es-ES',
  voiceName?: string,
  gender: string = 'FEMALE'
) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        languageCode,
        voiceName,
        ssmlGender: gender,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al generar el audio');
    }
    
    const data = await response.json();
    return {
      audioUrl: data.audioUrl,
      audioContent: data.audioContent,
    };
  } catch (error) {
    console.error('Error en el servicio de generación de audio:', error);
    throw error;
  }
}

/**
 * Traduce texto a otro idioma
 * 
 * @param text Texto a traducir
 * @param targetLanguage Código del idioma de destino (ej: 'en', 'fr', 'ja')
 * @returns Texto traducido y el idioma detectado
 */
export async function translateText(text: string, targetLanguage: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al traducir el texto');
    }
    
    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Error en el servicio de traducción:', error);
    throw error;
  }
}

/**
 * Obtiene información detallada sobre una ubicación
 * 
 * @param query Texto de búsqueda de la ubicación (ej: "Torre Eiffel, París")
 * @returns Información detallada sobre la ubicación, incluyendo coordenadas, puntos de interés cercanos, etc.
 */
export async function getLocationInfo(query: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/location-info?query=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener información de la ubicación');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de información de ubicación:', error);
    throw error;
  }
}

/**
 * Sube un archivo al servidor de almacenamiento
 * 
 * @param file Archivo a subir
 * @returns URL y datos del archivo almacenado
 */
export async function storeFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/store-file`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al almacenar el archivo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de almacenamiento de archivos:', error);
    throw error;
  }
}

/**
 * Analiza texto para extraer entidades y sentimiento
 * 
 * @param text Texto a analizar
 * @returns Información sobre entidades mencionadas y análisis de sentimiento
 */
export async function analyzeDestinationText(text: string) {
  // Esta función podría implementarse en el futuro para añadir análisis de texto
  // usando Google Natural Language API u otro servicio similar
  return {
    entities: [],
    sentiment: { score: 0, magnitude: 0 },
  };
}

export default {
  analyzeImage,
  generateAudio,
  translateText,
  getLocationInfo,
  storeFile,
  analyzeDestinationText,
  LANGUAGE_OPTIONS,
};