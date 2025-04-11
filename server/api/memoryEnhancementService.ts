/**
 * Servicio de API para mejora de memorias de viaje
 * 
 * Este módulo proporciona endpoints de API para mejorar las memorias de viaje usando servicios de Google Cloud:
 * - Análisis de imágenes
 * - Traducción de texto
 * - Generación de audio
 * - Información de ubicaciones
 */

import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as googleCloudServices from '../lib/googleCloudServices';

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limitar a 10MB
});

// Middleware para manejar errores de multer
const handleMulterError = (err: any, req: Request, res: Response, next: Function) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.'
      });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// Handlers para los endpoints de la API

// Analizar imagen
export const analyzeImageHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const imageBuffer = req.file.buffer;
    
    // Verificar si Google Cloud Vision está disponible
    if (!googleCloudServices.isVisionAvailable()) {
      return res.status(503).json({ 
        error: 'El servicio de análisis de imágenes no está disponible',
        message: 'La API de Google Cloud Vision no está configurada correctamente.'
      });
    }
    
    // Analizar la imagen
    const analysis = await googleCloudServices.analyzeImage(imageBuffer);
    
    // Devolver resultados
    return res.status(200).json({
      analysis,
      message: 'Imagen analizada con éxito'
    });
  } catch (error) {
    console.error('Error analizando imagen:', error);
    return res.status(500).json({ 
      error: 'Error al procesar la imagen',
      message: error.message || 'Ocurrió un error al analizar la imagen'
    });
  }
};

// Traducir texto
export const translateTextHandler = async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Parámetros incompletos',
        message: 'Se requiere el texto a traducir y el idioma de destino'
      });
    }
    
    // Verificar si Google Cloud Translate está disponible
    if (!googleCloudServices.isTranslationAvailable()) {
      return res.status(503).json({ 
        error: 'El servicio de traducción no está disponible',
        message: 'La API de Google Cloud Translate no está configurada correctamente.'
      });
    }
    
    // Traducir el texto
    const translation = await googleCloudServices.translateText(
      text, 
      targetLanguage,
      sourceLanguage || 'es'
    );
    
    return res.status(200).json({
      translation,
      message: 'Texto traducido con éxito'
    });
  } catch (error) {
    console.error('Error traduciendo texto:', error);
    return res.status(500).json({ 
      error: 'Error al traducir el texto',
      message: error.message || 'Ocurrió un error al traducir el texto'
    });
  }
};

// Generar audio
export const generateAudioHandler = async (req: Request, res: Response) => {
  try {
    const { text, languageCode, voiceName, ssmlGender } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Parámetros incompletos',
        message: 'Se requiere el texto para generar el audio'
      });
    }
    
    // Verificar si Google Cloud Text-to-Speech está disponible
    if (!googleCloudServices.isTextToSpeechAvailable()) {
      return res.status(503).json({ 
        error: 'El servicio de generación de audio no está disponible',
        message: 'La API de Google Cloud Text-to-Speech no está configurada correctamente.'
      });
    }
    
    // Generar el audio
    const audioData = await googleCloudServices.generateAudio(
      text,
      languageCode || 'es-ES',
      voiceName || 'es-ES-Standard-A',
      ssmlGender || 'FEMALE'
    );
    
    return res.status(200).json({
      audioUrl: audioData.audioUrl,
      audioContent: audioData.audioContent,
      message: 'Audio generado con éxito'
    });
  } catch (error) {
    console.error('Error generando audio:', error);
    return res.status(500).json({ 
      error: 'Error al generar el audio',
      message: error.message || 'Ocurrió un error al generar el audio'
    });
  }
};

// Obtener información de ubicación
export const getLocationInfoHandler = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Parámetros incompletos',
        message: 'Se requiere la consulta de ubicación'
      });
    }
    
    // Verificar si Google Maps está disponible
    if (!googleCloudServices.isMapsAvailable()) {
      return res.status(503).json({ 
        error: 'El servicio de geolocalización no está disponible',
        message: 'La API de Google Maps no está configurada correctamente.'
      });
    }
    
    // Obtener información de la ubicación
    const locationInfo = await googleCloudServices.getLocationInfo(query as string);
    
    // Procesar atracciones cercanas si existen
    let nearbyAttractions = [];
    if (locationInfo.nearbyAttractions && locationInfo.nearbyAttractions.length > 0) {
      nearbyAttractions = locationInfo.nearbyAttractions.map(attraction => ({
        name: attraction.name,
        vicinity: attraction.vicinity,
        rating: attraction.rating
      }));
    }
    
    return res.status(200).json({
      locationInfo: locationInfo.locationInfo,
      nearbyAttractions,
      staticMapUrl: locationInfo.staticMapUrl,
      message: 'Información de ubicación obtenida con éxito'
    });
  } catch (error) {
    console.error('Error obteniendo información de ubicación:', error);
    return res.status(500).json({ 
      error: 'Error al obtener información de ubicación',
      message: error.message || 'Ocurrió un error al obtener información de la ubicación'
    });
  }
};

// Almacenar archivo (imagen, audio, etc.)
export const storeFileHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }
    
    // Verificar si Google Cloud Storage está disponible
    if (!googleCloudServices.isStorageAvailable()) {
      return res.status(503).json({ 
        error: 'El servicio de almacenamiento no está disponible',
        message: 'La API de Google Cloud Storage no está configurada correctamente.'
      });
    }
    
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const fileName = `${uuidv4()}${fileExtension}`;
    const contentType = req.file.mimetype;
    
    // Almacenar el archivo
    const fileData = await googleCloudServices.storeFile(fileBuffer, fileName, contentType);
    
    return res.status(200).json({
      url: fileData.url,
      fileName: fileData.fileName,
      bucket: fileData.bucket,
      message: 'Archivo almacenado con éxito'
    });
  } catch (error) {
    console.error('Error almacenando archivo:', error);
    return res.status(500).json({ 
      error: 'Error al almacenar el archivo',
      message: error.message || 'Ocurrió un error al almacenar el archivo'
    });
  }
};

// Configuración de middlewares para los endpoints
export const configureRoutes = (app: any) => {
  // Endpoint para analizar imagen
  app.post('/api/memories/analyze-image', upload.single('image'), handleMulterError, analyzeImageHandler);
  
  // Endpoint para traducir texto
  app.post('/api/memories/translate', translateTextHandler);
  
  // Endpoint para generar audio
  app.post('/api/memories/generate-audio', generateAudioHandler);
  
  // Endpoint para obtener información de ubicación
  app.get('/api/memories/location-info', getLocationInfoHandler);
  
  // Endpoint para almacenar archivos
  app.post('/api/memories/store-file', upload.single('file'), handleMulterError, storeFileHandler);

  console.log('Rutas de mejora de memorias configuradas correctamente');
};

export default {
  configureRoutes,
  analyzeImageHandler,
  translateTextHandler,
  generateAudioHandler,
  getLocationInfoHandler,
  storeFileHandler
};