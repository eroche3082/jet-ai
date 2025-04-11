/**
 * Servicios de Google Cloud
 * 
 * Este módulo proporciona funciones para interactuar con varios servicios de Google Cloud,
 * incluyendo:
 * - Google Cloud Vision para análisis de imágenes
 * - Google Cloud Translate para traducción de texto
 * - Google Cloud Text-to-Speech para generación de audio
 * - Google Cloud Storage para almacenamiento de archivos
 * - Google Maps para información de ubicaciones
 */

import { ImageAnnotatorClient } from '@google-cloud/vision';
import { TranslationServiceClient } from '@google-cloud/translate';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@googlemaps/google-maps-services-js';

// Inicializar clientes de Google Cloud
// Establecer explícitamente la ruta del archivo de credenciales
const credentialsPath = path.resolve(process.cwd(), 'google-credentials-global.json');
if (fs.existsSync(credentialsPath)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  console.log('Archivo de credenciales de Google Cloud configurado correctamente:', credentialsPath);
} else {
  console.warn('Archivo de credenciales de Google Cloud no encontrado en:', credentialsPath);
  console.warn('Si quieres utilizar los servicios de Google Cloud, debes proporcionar este archivo.');
}

// Opciones de autenticación
const isKeyAvailable = (key: string) => {
  return process.env[key] !== undefined;
};

// Inicializar clientes según las claves disponibles
let visionClient: ImageAnnotatorClient | null = null;
let translationClient: TranslationServiceClient | null = null;
let textToSpeechClient: TextToSpeechClient | null = null;
let storageClient: Storage | null = null;
let mapsClient: Client | null = null;

// Inicializar Vision API si hay credenciales o clave API
if (process.env.GOOGLE_APPLICATION_CREDENTIALS || isKeyAvailable('GOOGLE_CLOUD_VISION_API_KEY')) {
  try {
    visionClient = new ImageAnnotatorClient();
    console.log('Cliente de Google Cloud Vision inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando el cliente de Google Cloud Vision:', error);
  }
}

// Inicializar Translation API si hay credenciales o clave API
if (process.env.GOOGLE_APPLICATION_CREDENTIALS || isKeyAvailable('GOOGLE_TRANSLATE_API_KEY')) {
  try {
    translationClient = new TranslationServiceClient();
    console.log('Cliente de Google Cloud Translate inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando el cliente de Google Cloud Translate:', error);
  }
}

// Inicializar Text-to-Speech API si hay credenciales o clave API
if (process.env.GOOGLE_APPLICATION_CREDENTIALS || isKeyAvailable('GOOGLE_TTS_API_KEY')) {
  try {
    textToSpeechClient = new TextToSpeechClient();
    console.log('Cliente de Google Cloud Text-to-Speech inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando el cliente de Google Cloud Text-to-Speech:', error);
  }
}

// Inicializar Storage
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    storageClient = new Storage();
    console.log('Cliente de Google Cloud Storage inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando el cliente de Google Cloud Storage:', error);
  }
}

// Inicializar Google Maps
if (isKeyAvailable('GOOGLE_CLOUD_API_KEY')) {
  try {
    mapsClient = new Client({});
    console.log('Cliente de Google Maps inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando el cliente de Google Maps:', error);
  }
}

// Nombre del bucket predeterminado para almacenar archivos
const DEFAULT_BUCKET_NAME = 'jetai-travel-memories';

// Funciones para verificar disponibilidad de servicios
export const isVisionAvailable = () => visionClient !== null;
export const isTranslationAvailable = () => translationClient !== null;
export const isTextToSpeechAvailable = () => textToSpeechClient !== null;
export const isStorageAvailable = () => storageClient !== null;
export const isMapsAvailable = () => mapsClient !== null && isKeyAvailable('GOOGLE_CLOUD_API_KEY');

// Función para analizar una imagen con Google Cloud Vision
export async function analyzeImage(imageBuffer: Buffer) {
  if (!visionClient) {
    throw new Error('Google Cloud Vision no está disponible');
  }

  try {
    // Analizar con múltiples funciones de Vision API
    const [labelResponse] = await visionClient.labelDetection(imageBuffer);
    const [textResponse] = await visionClient.textDetection(imageBuffer);
    const [landmarkResponse] = await visionClient.landmarkDetection(imageBuffer);
    const [faceResponse] = await visionClient.faceDetection(imageBuffer);
    const [localizationResponse] = await visionClient.imageProperties(imageBuffer);

    // Procesamiento de etiquetas
    const labels = labelResponse.labelAnnotations || [];

    // Procesamiento de texto
    const fullText = textResponse.fullTextAnnotation?.text || '';

    // Procesamiento de landmarks
    const landmarks = landmarkResponse.landmarkAnnotations || [];

    // Procesamiento de rostros
    const faces = faceResponse.faceAnnotations || [];

    // Procesamiento de propiedades de imagen (colores dominantes)
    const imageProperties = localizationResponse.imagePropertiesAnnotation;
    const dominantColors = imageProperties?.dominantColors?.colors || [];

    // Organizar respuesta
    return {
      labels: labels.map(label => ({
        description: label.description,
        score: label.score,
      })),
      text: fullText,
      landmarks: landmarks.map(landmark => ({
        description: landmark.description,
        score: landmark.score,
        location: landmark.locations && landmark.locations[0]?.latLng ? {
          lat: landmark.locations[0].latLng.latitude,
          lng: landmark.locations[0].latLng.longitude,
        } : undefined,
      })),
      faces: faces.length,
      dominantColors: dominantColors.map(color => ({
        color: {
          red: color.color?.red || 0,
          green: color.color?.green || 0,
          blue: color.color?.blue || 0,
        },
        score: color.score,
        pixelFraction: color.pixelFraction,
      })),
    };
  } catch (error) {
    console.error('Error al analizar la imagen:', error);
    throw new Error(`Error al analizar la imagen: ${error}`);
  }
}

// Función para traducir texto con Google Cloud Translate
export async function translateText(text: string, targetLanguage: string, sourceLang = 'es') {
  if (!translationClient) {
    throw new Error('Google Cloud Translate no está disponible');
  }

  try {
    // El ID del proyecto debe ser reemplazado con el ID real del proyecto de Google Cloud
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'jetai-travel-assistant';
    
    const request = {
      parent: `projects/${projectId}/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLang,
      targetLanguageCode: targetLanguage,
    };

    // Ejecutar traducción
    const [response] = await translationClient.translateText(request);
    
    // Procesar respuesta
    const translatedText = response.translations && response.translations[0]?.translatedText 
      ? response.translations[0].translatedText
      : '';
    
    const detectedLanguage = response.translations && response.translations[0]?.detectedLanguageCode 
      ? response.translations[0].detectedLanguageCode
      : sourceLang;
    
    return {
      translatedText,
      detectedLanguage,
    };
  } catch (error) {
    console.error('Error al traducir texto:', error);
    throw new Error(`Error al traducir texto: ${error}`);
  }
}

// Función para generar audio con Google Cloud Text-to-Speech
export async function generateAudio(
  text: string,
  languageCode = 'es-ES',
  voiceName = 'es-ES-Standard-A',
  ssmlGender = 'FEMALE'
) {
  if (!textToSpeechClient) {
    throw new Error('Google Cloud Text-to-Speech no está disponible');
  }

  try {
    // Configuración de la solicitud
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender,
      },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    // Generar audio
    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    // Si está disponible Storage, guardamos el archivo
    if (storageClient) {
      const bucket = storageClient.bucket(DEFAULT_BUCKET_NAME);
      
      // Verificar si el bucket existe, si no, crearlo
      const [exists] = await bucket.exists();
      if (!exists) {
        await bucket.create();
      }
      
      // Crear un archivo temporal
      const fileName = `audio-${uuidv4()}.mp3`;
      const tempLocalFile = path.join(os.tmpdir(), fileName);
      
      // Guardar el audio en un archivo temporal
      fs.writeFileSync(tempLocalFile, audioContent as Buffer);
      
      // Subir el archivo a Google Cloud Storage
      await bucket.upload(tempLocalFile, {
        destination: `audio/${fileName}`,
        metadata: {
          contentType: 'audio/mp3',
        },
      });
      
      // Obtener URL pública
      const file = bucket.file(`audio/${fileName}`);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expira en 1 semana
      });
      
      // Eliminar archivo temporal
      fs.unlinkSync(tempLocalFile);
      
      return {
        audioUrl: url,
        audioContent: audioContent?.toString('base64'),
      };
    } else {
      // Si no hay Storage, devolvemos el contenido en base64
      return {
        audioContent: audioContent?.toString('base64'),
        audioUrl: null,
      };
    }
  } catch (error) {
    console.error('Error al generar audio:', error);
    throw new Error(`Error al generar audio: ${error}`);
  }
}

// Función para obtener información de una ubicación con Google Maps
export async function getLocationInfo(query: string) {
  if (!mapsClient || !isKeyAvailable('GOOGLE_CLOUD_API_KEY')) {
    throw new Error('Google Maps API no está disponible');
  }

  try {
    // Geocodificar la ubicación
    const geocodeResponse = await mapsClient.geocode({
      params: {
        address: query,
        key: process.env.GOOGLE_CLOUD_API_KEY as string,
      },
    });
    
    const location = geocodeResponse.data.results[0]?.geometry.location;
    const formattedAddress = geocodeResponse.data.results[0]?.formatted_address;
    
    if (!location) {
      throw new Error('No se pudo encontrar la ubicación');
    }
    
    // Obtener lugares cercanos
    const placesResponse = await mapsClient.placesNearby({
      params: {
        location,
        radius: 1000, // 1km
        type: 'tourist_attraction',
        key: process.env.GOOGLE_CLOUD_API_KEY as string,
      },
    });
    
    // Generar URL de mapa estático
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${location.lat},${location.lng}&key=${process.env.GOOGLE_CLOUD_API_KEY}`;
    
    // Extraer y procesar atracciones cercanas
    const nearbyAttractions = placesResponse.data.results.map(place => ({
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      photos: place.photos?.[0].photo_reference,
    }));
    
    return {
      locationInfo: {
        location,
        formattedAddress,
      },
      nearbyAttractions,
      staticMapUrl,
    };
  } catch (error) {
    console.error('Error al obtener información de ubicación:', error);
    throw new Error(`Error al obtener información de ubicación: ${error}`);
  }
}

// Función para almacenar un archivo en Google Cloud Storage
export async function storeFile(fileBuffer: Buffer, fileName: string, contentType: string) {
  if (!storageClient) {
    throw new Error('Google Cloud Storage no está disponible');
  }

  try {
    const bucket = storageClient.bucket(DEFAULT_BUCKET_NAME);
    
    // Verificar si el bucket existe, si no, crearlo
    const [exists] = await bucket.exists();
    if (!exists) {
      await bucket.create();
    }
    
    // Crear un archivo temporal
    const tempLocalFile = path.join(os.tmpdir(), fileName);
    
    // Guardar el buffer en un archivo temporal
    fs.writeFileSync(tempLocalFile, fileBuffer);
    
    // Subir el archivo a Google Cloud Storage
    await bucket.upload(tempLocalFile, {
      destination: `files/${fileName}`,
      metadata: {
        contentType,
      },
    });
    
    // Obtener URL pública
    const file = bucket.file(`files/${fileName}`);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expira en 1 semana
    });
    
    // Eliminar archivo temporal
    fs.unlinkSync(tempLocalFile);
    
    return {
      url,
      fileName: `files/${fileName}`,
      bucket: DEFAULT_BUCKET_NAME,
    };
  } catch (error) {
    console.error('Error al almacenar archivo:', error);
    throw new Error(`Error al almacenar archivo: ${error}`);
  }
}

// Interfaz pública del módulo
export default {
  isVisionAvailable,
  isTranslationAvailable,
  isTextToSpeechAvailable,
  isStorageAvailable,
  isMapsAvailable,
  analyzeImage,
  translateText,
  generateAudio,
  getLocationInfo,
  storeFile,
};