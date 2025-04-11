/**
 * Google Cloud Services Integration
 * 
 * Este archivo centraliza todas las integraciones con servicios de Google Cloud
 * para mejorar las capacidades de JetAI como asistente de viaje.
 */

import { ImageAnnotatorClient } from '@google-cloud/vision';
import { TranslationServiceClient } from '@google-cloud/translate';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configuración de clientes para los servicios
const visionClient = new ImageAnnotatorClient();
const translateClient = new TranslationServiceClient();
const textToSpeechClient = new TextToSpeechClient();
const storage = new Storage();
const mapsClient = new MapsClient({});

// Nombre del bucket para almacenamiento
const BUCKET_NAME = 'jetai-travel-memories';

// Configurar proyecto ID (para APIs que lo requieren)
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'jetai-travel-companion';

/**
 * Analiza una imagen y extrae información útil como:
 * - Etiquetas (objetos, escenas)
 * - Texto (OCR)
 * - Puntos de referencia
 * - Ubicaciones
 * - Análisis de sentimiento de la escena
 */
export async function analyzeImage(imageBuffer: Buffer) {
  try {
    // Realizar múltiples tipos de detección en una sola imagen
    const [result] = await visionClient.annotateImage({
      image: {
        content: imageBuffer.toString('base64')
      },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'LANDMARK_DETECTION', maxResults: 5 },
        { type: 'TEXT_DETECTION' },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'SAFE_SEARCH_DETECTION' }
      ]
    });

    return {
      labels: result.labelAnnotations?.map(label => ({
        description: label.description,
        score: label.score
      })) || [],
      landmarks: result.landmarkAnnotations?.map(landmark => ({
        description: landmark.description,
        score: landmark.score,
        location: landmark.locations?.[0]?.latLng
      })) || [],
      text: result.textAnnotations?.[0]?.description || '',
      colors: result.imagePropertiesAnnotation?.dominantColors?.colors?.map(color => ({
        color: {
          red: color.color?.red,
          green: color.color?.green,
          blue: color.color?.blue
        },
        score: color.score,
        pixelFraction: color.pixelFraction
      })) || [],
      safeSearch: result.safeSearchAnnotation || {}
    };
  } catch (error) {
    console.error('Error al analizar imagen con Vision API:', error);
    throw error;
  }
}

/**
 * Traduce texto a un idioma destino
 */
export async function translateText(text: string, targetLanguage: string) {
  try {
    const [response] = await translateClient.translateText({
      parent: `projects/${projectId}/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage,
    });

    return {
      translatedText: response.translations?.[0]?.translatedText || text,
      detectedLanguage: response.translations?.[0]?.detectedLanguageCode || 'en'
    };
  } catch (error) {
    console.error('Error al traducir texto:', error);
    throw error;
  }
}

/**
 * Convierte texto a voz (para narraciones de viaje)
 */
export async function textToSpeech(
  text: string, 
  languageCode: string = 'es-ES',
  voiceName: string = 'es-ES-Standard-A',
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL' = 'FEMALE'
) {
  try {
    const [response] = await textToSpeechClient.synthesizeSpeech({
      input: { text },
      voice: { 
        languageCode,
        name: voiceName,
        ssmlGender: gender as any
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    const audioContent = response.audioContent as Uint8Array;
    
    // Generar un nombre único para el archivo
    const fileName = `speech-${uuidv4()}.mp3`;
    
    // Subir a Storage
    const uploadResult = await uploadBuffer(
      Buffer.from(audioContent), 
      fileName, 
      'audio/mpeg'
    );
    
    return {
      audioUrl: uploadResult.publicUrl,
      fileName,
      duration: audioContent.length / 1024 / 24, // Estimación aproximada en segundos
    };
  } catch (error) {
    console.error('Error al convertir texto a voz:', error);
    throw error;
  }
}

/**
 * Obtiene información sobre una ubicación (geocodificación)
 */
export async function getLocationInfo(query: string) {
  try {
    const response = await mapsClient.geocode({
      params: {
        address: query,
        key: process.env.GOOGLE_CLOUD_API_KEY || ''
      }
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      return null;
    }

    const location = results[0];
    return {
      formattedAddress: location.formatted_address,
      placeId: location.place_id,
      location: {
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng
      },
      types: location.types,
      components: location.address_components
    };
  } catch (error) {
    console.error('Error al obtener información de ubicación:', error);
    throw error;
  }
}

/**
 * Sube un archivo a Google Cloud Storage
 */
export async function uploadFile(filePath: string, destination?: string) {
  try {
    await ensureBucketExists();

    const fileName = destination || path.basename(filePath);
    const file = storage.bucket(BUCKET_NAME).file(fileName);

    await storage.bucket(BUCKET_NAME).upload(filePath, {
      destination: fileName,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    await file.makePublic();

    return {
      fileName,
      publicUrl: `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`
    };
  } catch (error) {
    console.error('Error al subir archivo a Cloud Storage:', error);
    throw error;
  }
}

/**
 * Sube un buffer a Google Cloud Storage
 */
export async function uploadBuffer(
  buffer: Buffer, 
  destination: string, 
  contentType: string = 'application/octet-stream'
) {
  try {
    await ensureBucketExists();

    const file = storage.bucket(BUCKET_NAME).file(destination);
    
    await file.save(buffer, {
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    
    await file.makePublic();
    
    return {
      fileName: destination,
      publicUrl: `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`
    };
  } catch (error) {
    console.error('Error al subir buffer a Cloud Storage:', error);
    throw error;
  }
}

/**
 * Asegura que el bucket existe, lo crea si no
 */
async function ensureBucketExists() {
  try {
    const [buckets] = await storage.getBuckets();
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await storage.createBucket(BUCKET_NAME, {
        location: 'us-central1',
        storageClass: 'STANDARD',
      });
    }
  } catch (error) {
    console.error('Error al verificar/crear bucket:', error);
    throw error;
  }
}

/**
 * Obtiene información sobre atracciones turísticas cercanas a una ubicación
 */
export async function getNearbyAttractions(latitude: number, longitude: number, radius: number = 5000) {
  try {
    const response = await mapsClient.placesNearby({
      params: {
        location: { lat: latitude, lng: longitude },
        radius,
        type: 'tourist_attraction',
        key: process.env.GOOGLE_CLOUD_API_KEY || ''
      }
    });

    return response.data.results.map(place => ({
      name: place.name,
      location: place.geometry?.location,
      placeId: place.place_id,
      rating: place.rating,
      types: place.types,
      vicinity: place.vicinity,
      photos: place.photos?.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
      }))
    }));
  } catch (error) {
    console.error('Error al obtener atracciones cercanas:', error);
    throw error;
  }
}

/**
 * Obtiene una URL de mapa estático para una ubicación
 */
export function getStaticMapUrl(
  latitude: number, 
  longitude: number, 
  zoom: number = 14,
  width: number = 600,
  height: number = 300,
  scale: number = 2
) {
  const params = new URLSearchParams({
    center: `${latitude},${longitude}`,
    zoom: zoom.toString(),
    size: `${width}x${height}`,
    scale: scale.toString(),
    maptype: 'roadmap',
    markers: `color:red|${latitude},${longitude}`,
    key: process.env.GOOGLE_CLOUD_API_KEY || ''
  });

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

/**
 * Detección de entidades y análisis de sentimiento para un destino
 * Útil para analizar reseñas o descripciones de destinos
 */
export async function analyzeDestinationText(text: string) {
  try {
    // Esta función depende de la API de Natural Language, 
    // que no instalamos aún, pero podríamos integrarla en el futuro
    // Por ahora, usamos un análisis simple basado en palabras clave
    
    const sentiment = calculateSimpleSentiment(text);
    const entities = extractBasicEntities(text);
    
    return {
      sentiment: {
        score: sentiment.score,
        magnitude: sentiment.magnitude,
        overall: sentiment.overall
      },
      entities
    };
  } catch (error) {
    console.error('Error al analizar texto de destino:', error);
    throw error;
  }
}

// Función auxiliar para extraer entidades básicas
function extractBasicEntities(text: string) {
  const words = text.toLowerCase().split(/\s+/);
  
  // Categorías de entidades para turismo
  const categories = {
    attractions: ['museo', 'museo', 'castillo', 'palacio', 'monumento', 'catedral', 'iglesia', 'plaza', 'parque', 'torre', 'puente', 'estadio', 'montaña', 'lago', 'río', 'playa', 'calle', 'templo'],
    activities: ['visitar', 'explorar', 'caminar', 'nadar', 'bucear', 'escalar', 'pasear', 'degustar', 'probar', 'comer', 'beber', 'comprar', 'fotografiar', 'admirar', 'relajarse', 'descansar'],
    accommodation: ['hotel', 'hostel', 'apartamento', 'resort', 'camping', 'cabaña', 'alojamiento', 'habitación', 'suite', 'posada'],
    food: ['restaurante', 'café', 'bar', 'comida', 'plato', 'menú', 'desayuno', 'almuerzo', 'cena', 'postre', 'bebida'],
    transportation: ['avión', 'tren', 'autobús', 'metro', 'taxi', 'barco', 'ferry', 'coche', 'bicicleta', 'transporte']
  };
  
  const entities: Record<string, string[]> = {};
  
  // Buscar palabras clave por categoría
  for (const [category, keywords] of Object.entries(categories)) {
    entities[category] = [];
    
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches) {
        entities[category].push(...matches);
      }
    }
    
    // Eliminar duplicados
    entities[category] = [...new Set(entities[category])];
  }
  
  return entities;
}

// Función auxiliar para calcular un sentimiento simple
function calculateSimpleSentiment(text: string) {
  const positiveWords = ['hermoso', 'increíble', 'excelente', 'maravilloso', 'fantástico', 'espectacular', 'impresionante', 'recomendable', 'genial', 'agradable', 'divertido', 'relajante', 'acogedor', 'amable', 'limpio', 'seguro', 'bueno', 'recomendado', 'inolvidable', 'encantador'];
  
  const negativeWords = ['horrible', 'terrible', 'malo', 'desagradable', 'sucio', 'peligroso', 'caro', 'decepcionante', 'aburrido', 'estresante', 'incómodo', 'desorganizado', 'ruidoso', 'evitar', 'sobrevalorado', 'problemático', 'complicado', 'difícil', 'abarrotado', 'conflictivo'];
  
  const words = text.toLowerCase().split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(positive => word.includes(positive))) {
      positiveCount++;
    }
    if (negativeWords.some(negative => word.includes(negative))) {
      negativeCount++;
    }
  });
  
  const score = (positiveCount - negativeCount) / Math.max(1, words.length);
  const magnitude = (positiveCount + negativeCount) / Math.max(1, words.length);
  
  let overall = 'neutral';
  if (score > 0.05) overall = 'positive';
  if (score < -0.05) overall = 'negative';
  
  return {
    score,
    magnitude,
    overall,
    details: {
      positiveCount,
      negativeCount,
      wordCount: words.length
    }
  };
}