/**
 * Memory Enhancement Service
 * 
 * Este servicio proporciona endpoints API para mejorar los recuerdos de viaje
 * utilizando las APIs de Google Cloud (Vision, Speech, Translation, etc.)
 */

import { Router } from 'express';
import multer from 'multer';
import * as googleCloudServices from '../lib/googleCloudServices';
import { v4 as uuidv4 } from 'uuid';

// Configuración de multer para manejo de archivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite por archivo
  }
});

const router = Router();

/**
 * Analiza una imagen y extrae información útil como etiquetas, ubicaciones, etc.
 * POST /api/memory-enhancement/analyze-image
 */
router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Analizar la imagen con Vision API
    const analysisResult = await googleCloudServices.analyzeImage(req.file.buffer);
    
    // Subir la imagen a Cloud Storage
    const fileName = `travel-memory-${uuidv4()}.${req.file.originalname.split('.').pop()}`;
    const uploadResult = await googleCloudServices.uploadBuffer(
      req.file.buffer, 
      fileName, 
      req.file.mimetype
    );

    // Detectar ubicación de puntos de referencia si están disponibles
    let locationInfo = null;
    if (analysisResult.landmarks && analysisResult.landmarks.length > 0) {
      const landmarkName = analysisResult.landmarks[0].description;
      locationInfo = await googleCloudServices.getLocationInfo(landmarkName || '');
    }

    return res.json({
      analysis: analysisResult,
      uploadedImage: uploadResult,
      locationInfo,
    });
  } catch (error) {
    console.error('Error al procesar imagen:', error);
    return res.status(500).json({ error: 'Error processing image', details: error.message });
  }
});

/**
 * Genera una narración de audio para un recuerdo
 * POST /api/memory-enhancement/generate-audio
 */
router.post('/generate-audio', async (req, res) => {
  try {
    const { text, languageCode, voiceName, gender } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    
    const audioResult = await googleCloudServices.textToSpeech(
      text,
      languageCode || 'es-ES',
      voiceName || 'es-ES-Standard-A',
      gender || 'FEMALE'
    );
    
    return res.json(audioResult);
  } catch (error) {
    console.error('Error al generar audio:', error);
    return res.status(500).json({ error: 'Error generating audio', details: error.message });
  }
});

/**
 * Traduce texto a otro idioma
 * POST /api/memory-enhancement/translate
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }
    
    const translationResult = await googleCloudServices.translateText(text, targetLanguage);
    
    return res.json(translationResult);
  } catch (error) {
    console.error('Error al traducir texto:', error);
    return res.status(500).json({ error: 'Error translating text', details: error.message });
  }
});

/**
 * Obtiene información detallada sobre una ubicación
 * POST /api/memory-enhancement/location-info
 */
router.post('/location-info', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Location query is required' });
    }
    
    const locationInfo = await googleCloudServices.getLocationInfo(query);
    
    if (!locationInfo) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    // Obtener atracciones cercanas si hay coordenadas disponibles
    let nearbyAttractions = [];
    if (locationInfo.location) {
      nearbyAttractions = await googleCloudServices.getNearbyAttractions(
        locationInfo.location.lat,
        locationInfo.location.lng
      );
    }
    
    // Generar URL de mapa estático
    const staticMapUrl = googleCloudServices.getStaticMapUrl(
      locationInfo.location.lat,
      locationInfo.location.lng
    );
    
    return res.json({
      locationInfo,
      nearbyAttractions,
      staticMapUrl,
    });
  } catch (error) {
    console.error('Error al obtener información de ubicación:', error);
    return res.status(500).json({ error: 'Error getting location information', details: error.message });
  }
});

/**
 * Analiza texto de un destino para extraer información relevante
 * POST /api/memory-enhancement/analyze-destination-text
 */
router.post('/analyze-destination-text', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const analysisResult = await googleCloudServices.analyzeDestinationText(text);
    
    return res.json(analysisResult);
  } catch (error) {
    console.error('Error al analizar texto de destino:', error);
    return res.status(500).json({ error: 'Error analyzing destination text', details: error.message });
  }
});

export default router;