/**
 * Augmented Reality Travel Companion Navigation
 * 
 * This module provides AR-powered navigation and location services for travelers.
 * Features include:
 * - Real-time landmark recognition
 * - AR navigation overlays
 * - Multilingual speech instructions
 * - Local point-of-interest discovery
 * - Immersive travel experiences
 */

import { VertexAI } from '@google-cloud/vertexai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TranslationServiceClient } from '@google-cloud/translate';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { apiKeyManager, ServiceCategory } from '../lib/apiKeyManager';
import { 
  getVisionClient, 
  getTranslateClient, 
  getTTSClient, 
  getMapsClient,
  getGeminiClient,
  configureGoogleMapsRequest 
} from '../lib/googleApiConfig';

// Set up file storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create an express router
const router = Router();

/**
 * Recognize landmarks in an uploaded image
 * 
 * POST /api/ar-navigation/landmark-recognition
 * Content-Type: multipart/form-data
 * Body: { image: File }
 */
router.post('/landmark-recognition', upload.single('image'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    // Get the path to the uploaded file
    const imagePath = req.file.path;
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Initialize the Vision API client
    const visionClient = getVisionClient();
    
    // Send the image to the Vision API for landmark detection
    const [result] = await visionClient.landmarkDetection({
      image: { content: imageBuffer }
    });
    
    const landmarks = result.landmarkAnnotations || [];
    
    // Format the results
    const formattedResults = landmarks.map(landmark => ({
      name: landmark.description,
      confidence: landmark.score,
      locations: landmark.locations?.map(location => ({
        latitude: location.latLng?.latitude,
        longitude: location.latLng?.longitude
      })),
      boundingPoly: landmark.boundingPoly?.vertices?.map(vertex => ({
        x: vertex.x,
        y: vertex.y
      }))
    }));
    
    // Clean up - delete the uploaded file
    fs.unlinkSync(imagePath);
    
    // Return the results
    res.json({
      landmarks: formattedResults,
      count: formattedResults.length
    });
    
  } catch (error: any) {
    console.error('Error in landmark recognition:', error);
    res.status(500).json({ error: error.message || 'An error occurred during landmark recognition' });
  }
});

/**
 * Get navigation instructions between two points
 * 
 * POST /api/ar-navigation/directions
 * Content-Type: application/json
 * Body: { 
 *   origin: { lat: number, lng: number } | string,
 *   destination: { lat: number, lng: number } | string,
 *   mode: 'driving' | 'walking' | 'bicycling' | 'transit',
 *   language: string (e.g. 'en', 'fr', 'es')
 * }
 */
router.post('/directions', async (req, res) => {
  try {
    const { origin, destination, mode = 'walking', language = 'en' } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }
    
    // Initialize the Maps client
    const mapsClient = getMapsClient();
    
    // Get directions from the Maps API
    const response = await mapsClient.directions(configureGoogleMapsRequest({
      params: {
        origin: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
        destination: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
        mode: mode,
        language: language
      }
    }));
    
    // Format the results
    const routes = response.data.routes;
    if (!routes || routes.length === 0) {
      return res.status(404).json({ error: 'No routes found' });
    }
    
    const route = routes[0];
    const legs = route.legs[0];
    
    // Get steps with text instructions and polylines for AR rendering
    const steps = legs.steps.map(step => ({
      instruction: step.html_instructions,
      distance: step.distance.text,
      duration: step.duration.text,
      startLocation: step.start_location,
      endLocation: step.end_location,
      polyline: step.polyline?.points
    }));
    
    // Return the results
    res.json({
      summary: route.summary,
      distance: legs.distance.text,
      duration: legs.duration.text,
      startAddress: legs.start_address,
      endAddress: legs.end_address,
      steps: steps,
      overviewPolyline: route.overview_polyline?.points
    });
    
  } catch (error: any) {
    console.error('Error in directions:', error);
    res.status(500).json({ error: error.message || 'An error occurred while getting directions' });
  }
});

/**
 * Get spoken directions in the requested language
 * 
 * POST /api/ar-navigation/spoken-directions
 * Content-Type: application/json
 * Body: { 
 *   instruction: string,
 *   language: string (e.g. 'en-US', 'fr-FR', 'es-ES')
 * }
 */
router.post('/spoken-directions', async (req, res) => {
  try {
    const { instruction, language = 'en-US' } = req.body;
    
    if (!instruction) {
      return res.status(400).json({ error: 'Instruction is required' });
    }
    
    // Initialize the TTS client
    const ttsClient = getTTSClient();
    
    // First translate the instruction if necessary
    let translatedText = instruction;
    
    if (language.substring(0, 2) !== 'en') {
      const translateClient = getTranslateClient();
      const targetLanguage = language.substring(0, 2);
      
      // Translate the instruction
      const [translation] = await translateClient.translate({
        content: [instruction],
        mimeType: 'text/plain',
        targetLanguageCode: targetLanguage
      });
      translatedText = translation.translations[0].translatedText;
    }
    
    // Configure TTS request
    const request = {
      input: { text: translatedText },
      voice: { languageCode: language, ssmlGender: 'NEUTRAL' as const },
      audioConfig: { audioEncoding: 'MP3' as const },
    };
    
    // Generate speech
    const [response] = await ttsClient.synthesizeSpeech(request);
    
    // Convert audio content to base64
    const audioContent = Buffer.from(response.audioContent as Buffer).toString('base64');
    
    // Return the results
    res.json({
      originalText: instruction,
      translatedText: translatedText,
      audioContent: audioContent
    });
    
  } catch (error: any) {
    console.error('Error in spoken directions:', error);
    res.status(500).json({ error: error.message || 'An error occurred while generating spoken directions' });
  }
});

/**
 * Get nearby points of interest
 * 
 * GET /api/ar-navigation/nearby
 * Query: { 
 *   lat: number,
 *   lng: number,
 *   radius: number (meters),
 *   types: string (comma-separated list of place types)
 * }
 */
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 500, types = 'tourist_attraction,museum,restaurant' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Initialize the Maps client
    const mapsClient = getMapsClient();
    
    // Get nearby places from the Maps API
    const response = await mapsClient.placesNearby(configureGoogleMapsRequest({
      params: {
        location: `${lat},${lng}`,
        radius: Number(radius),
        type: types.toString().split(',')[0], // Maps API only accepts one type at a time
        language: 'en'
      }
    }));
    
    // Format the results
    const places = response.data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      location: place.geometry?.location,
      address: place.vicinity,
      types: place.types,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      icon: place.icon,
      openNow: place.opening_hours?.open_now,
      photos: place.photos?.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
        attributions: photo.html_attributions
      }))
    }));
    
    // Return the results
    res.json({
      places: places,
      count: places.length
    });
    
  } catch (error: any) {
    console.error('Error in nearby places:', error);
    res.status(500).json({ error: error.message || 'An error occurred while getting nearby places' });
  }
});

/**
 * Get immersive description of a location
 * 
 * POST /api/ar-navigation/immersive-description
 * Content-Type: application/json
 * Body: { 
 *   locationName: string,
 *   language: string (e.g. 'en', 'fr', 'es')
 * }
 */
router.post('/immersive-description', async (req, res) => {
  try {
    const { locationName, language = 'en' } = req.body;
    
    if (!locationName) {
      return res.status(400).json({ error: 'Location name is required' });
    }
    
    // Use Gemini to generate an immersive description
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Create an immersive, engaging 2-paragraph description of ${locationName} for a travel app.
      Focus on sensory details, history, and unique experiences. 
      Keep it informative yet exciting, highlighting what makes this place special.
      Make the reader feel like they're actually there.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text();
    
    // Translate if necessary
    let translatedDescription = description;
    
    if (language !== 'en') {
      const translateClient = getTranslateClient();
      
      // Translate the description
      const [translation] = await translateClient.translate({
        content: [description],
        mimeType: 'text/plain',
        targetLanguageCode: language
      });
      translatedDescription = translation.translations[0].translatedText;
    }
    
    // Return the results
    res.json({
      locationName: locationName,
      originalDescription: description,
      translatedDescription: translatedDescription,
      language: language
    });
    
  } catch (error: any) {
    console.error('Error in immersive description:', error);
    res.status(500).json({ error: error.message || 'An error occurred while generating the description' });
  }
});

/**
 * Test all AR navigation services
 * 
 * GET /api/ar-navigation/test
 */
router.get('/test', async (req, res) => {
  try {
    // Import the comprehensive test suite
    const {
      runAllTests,
      testVisionAPI,
      testTranslationAPI,
      testTextToSpeechAPI,
      testSpeechToTextAPI,
      testNaturalLanguageAPI,
      testGeminiAI,
      testMapsAPI,
      testVideoIntelligenceAPI
    } = require('../test/google-services-test');
    
    // Run all tests
    const results = await Promise.all([
      testVisionAPI(),
      testTranslationAPI(),
      testTextToSpeechAPI(),
      testSpeechToTextAPI(),
      testNaturalLanguageAPI(),
      testGeminiAI(),
      testMapsAPI(),
      testVideoIntelligenceAPI(),
    ]);
    
    // Calculate success rate
    const serviceNames = [
      'Vision API',
      'Translation API',
      'Text-to-Speech API',
      'Speech-to-Text API',
      'Natural Language API',
      'Gemini AI',
      'Maps API',
      'Video Intelligence API'
    ];
    
    const testResults = serviceNames.map((name, index) => ({
      service: name,
      status: results[index] ? 'SUCCESS' : 'FAILURE'
    }));
    
    const successCount = results.filter(result => result).length;
    const totalTests = results.length;
    const successRate = (successCount / totalTests) * 100;
    
    // Return the results
    res.json({
      testResults: testResults,
      summary: {
        successCount,
        totalTests,
        successRate: successRate.toFixed(1) + '%'
      },
      apiKeyGroups: Object.keys(apiKeyManager['apiKeys']).length
    });
    
  } catch (error: any) {
    console.error('Error in services test:', error);
    res.status(500).json({ error: error.message || 'An error occurred while testing services' });
  }
});

export default router;