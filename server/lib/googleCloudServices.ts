/**
 * Google Cloud Services
 * 
 * This module provides functions to interact with various Google Cloud services,
 * including:
 * - Google Cloud Vision for image analysis
 * - Google Cloud Translate for text translation
 * - Google Cloud Text-to-Speech for audio generation
 * - Google Cloud Storage for file storage
 * - Google Maps for location information
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

// Initialize Google Cloud clients
// Explicitly set the path to the credentials file
const credentialsPath = path.resolve(process.cwd(), 'google-credentials-global.json');
if (fs.existsSync(credentialsPath)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  console.log('Google Cloud credentials file configured successfully:', credentialsPath);
} else {
  console.warn('Google Cloud credentials file not found at:', credentialsPath);
  console.warn('If you want to use Google Cloud services, you must provide this file.');
}

// Authentication options
const isKeyAvailable = (key: string) => {
  return process.env[key] !== undefined;
};

// Initialize clients based on available keys
let visionClient: ImageAnnotatorClient | null = null;
let translationClient: TranslationServiceClient | null = null;
let textToSpeechClient: TextToSpeechClient | null = null;
let storageClient: Storage | null = null;
let mapsClient: Client | null = null;

// Initialize Vision API if credentials or API key are available
if (process.env.GOOGLE_APPLICATION_CREDENTIALS || isKeyAvailable('GOOGLE_CLOUD_VISION_API_KEY')) {
  try {
    visionClient = new ImageAnnotatorClient();
    console.log('Google Cloud Vision client initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Cloud Vision client:', error);
  }
}

// Initialize Translation API if credentials or API key are available
if (process.env.GOOGLE_APPLICATION_CREDENTIALS || isKeyAvailable('GOOGLE_TRANSLATE_API_KEY')) {
  try {
    translationClient = new TranslationServiceClient();
    console.log('Google Cloud Translate client initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Cloud Translate client:', error);
  }
}

// Initialize Text-to-Speech API if credentials or API key are available
if (process.env.GOOGLE_APPLICATION_CREDENTIALS || isKeyAvailable('GOOGLE_TTS_API_KEY')) {
  try {
    textToSpeechClient = new TextToSpeechClient();
    console.log('Google Cloud Text-to-Speech client initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Cloud Text-to-Speech client:', error);
  }
}

// Initialize Storage
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    storageClient = new Storage();
    console.log('Google Cloud Storage client initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Cloud Storage client:', error);
  }
}

// Initialize Google Maps
if (isKeyAvailable('GOOGLE_CLOUD_API_KEY')) {
  try {
    mapsClient = new Client({});
    console.log('Google Maps client initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Maps client:', error);
  }
}

// Default bucket name for storing files
const DEFAULT_BUCKET_NAME = 'jetai-travel-memories';

// Functions to verify service availability
export const isVisionAvailable = () => visionClient !== null;
export const isTranslationAvailable = () => translationClient !== null;
export const isTextToSpeechAvailable = () => textToSpeechClient !== null;
export const isStorageAvailable = () => storageClient !== null;
export const isMapsAvailable = () => mapsClient !== null && isKeyAvailable('GOOGLE_CLOUD_API_KEY');

// Function to analyze an image with Google Cloud Vision
export async function analyzeImage(imageBuffer: Buffer) {
  if (!visionClient) {
    throw new Error('Google Cloud Vision is not available');
  }

  try {
    // Analyze with multiple Vision API functions
    const [labelResponse] = await visionClient.labelDetection(imageBuffer);
    const [textResponse] = await visionClient.textDetection(imageBuffer);
    const [landmarkResponse] = await visionClient.landmarkDetection(imageBuffer);
    const [faceResponse] = await visionClient.faceDetection(imageBuffer);
    const [localizationResponse] = await visionClient.imageProperties(imageBuffer);

    // Process labels
    const labels = labelResponse.labelAnnotations || [];

    // Process text
    const fullText = textResponse.fullTextAnnotation?.text || '';

    // Process landmarks
    const landmarks = landmarkResponse.landmarkAnnotations || [];

    // Process faces
    const faces = faceResponse.faceAnnotations || [];

    // Process image properties (dominant colors)
    const imageProperties = localizationResponse.imagePropertiesAnnotation;
    const dominantColors = imageProperties?.dominantColors?.colors || [];

    // Organize response
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
    console.error('Error analyzing the image:', error);
    throw new Error(`Error analyzing the image: ${error}`);
  }
}

// Function to translate text with Google Cloud Translate
export async function translateText(text: string, targetLanguage: string, sourceLang = 'en') {
  if (!translationClient) {
    throw new Error('Google Cloud Translate is not available');
  }

  try {
    // The project ID should be replaced with the real Google Cloud project ID
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'jetai-travel-assistant';
    
    const request = {
      parent: `projects/${projectId}/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLang,
      targetLanguageCode: targetLanguage,
    };

    // Execute translation
    const [response] = await translationClient.translateText(request);
    
    // Process response
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
    console.error('Error translating text:', error);
    throw new Error(`Error translating text: ${error}`);
  }
}

// Function to generate audio with Google Cloud Text-to-Speech
export async function generateAudio(
  text: string,
  languageCode = 'en-US',
  voiceName = 'en-US-Standard-A',
  ssmlGender = 'FEMALE'
) {
  if (!textToSpeechClient) {
    throw new Error('Google Cloud Text-to-Speech is not available');
  }

  try {
    // Request configuration
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender,
      },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    // Generate audio
    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    // If Storage is available, we save the file
    if (storageClient) {
      const bucket = storageClient.bucket(DEFAULT_BUCKET_NAME);
      
      // Check if the bucket exists, if not, create it
      const [exists] = await bucket.exists();
      if (!exists) {
        await bucket.create();
      }
      
      // Create a temporary file
      const fileName = `audio-${uuidv4()}.mp3`;
      const tempLocalFile = path.join(os.tmpdir(), fileName);
      
      // Save the audio to a temporary file
      fs.writeFileSync(tempLocalFile, audioContent as Buffer);
      
      // Upload the file to Google Cloud Storage
      await bucket.upload(tempLocalFile, {
        destination: `audio/${fileName}`,
        metadata: {
          contentType: 'audio/mp3',
        },
      });
      
      // Get public URL
      const file = bucket.file(`audio/${fileName}`);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 1 week
      });
      
      // Delete temporary file
      fs.unlinkSync(tempLocalFile);
      
      return {
        audioUrl: url,
        audioContent: audioContent?.toString('base64'),
      };
    } else {
      // If there's no Storage, we return the content in base64
      return {
        audioContent: audioContent?.toString('base64'),
        audioUrl: null,
      };
    }
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error(`Error generating audio: ${error}`);
  }
}

// Function to get information about a location with Google Maps
export async function getLocationInfo(query: string) {
  if (!mapsClient || !isKeyAvailable('GOOGLE_CLOUD_API_KEY')) {
    throw new Error('Google Maps API is not available');
  }

  try {
    // Geocode the location
    const geocodeResponse = await mapsClient.geocode({
      params: {
        address: query,
        key: process.env.GOOGLE_CLOUD_API_KEY as string,
      },
    });
    
    const location = geocodeResponse.data.results[0]?.geometry.location;
    const formattedAddress = geocodeResponse.data.results[0]?.formatted_address;
    
    if (!location) {
      throw new Error('Could not find the location');
    }
    
    // Get nearby places
    const placesResponse = await mapsClient.placesNearby({
      params: {
        location,
        radius: 1000, // 1km
        type: 'tourist_attraction',
        key: process.env.GOOGLE_CLOUD_API_KEY as string,
      },
    });
    
    // Generate static map URL
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${location.lat},${location.lng}&key=${process.env.GOOGLE_CLOUD_API_KEY}`;
    
    // Extract and process nearby attractions
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
    console.error('Error getting location information:', error);
    throw new Error(`Error getting location information: ${error}`);
  }
}

// Function to store a file in Google Cloud Storage
export async function storeFile(fileBuffer: Buffer, fileName: string, contentType: string) {
  if (!storageClient) {
    throw new Error('Google Cloud Storage is not available');
  }

  try {
    const bucket = storageClient.bucket(DEFAULT_BUCKET_NAME);
    
    // Check if the bucket exists, if not, create it
    const [exists] = await bucket.exists();
    if (!exists) {
      await bucket.create();
    }
    
    // Create a temporary file
    const tempLocalFile = path.join(os.tmpdir(), fileName);
    
    // Save the buffer to a temporary file
    fs.writeFileSync(tempLocalFile, fileBuffer);
    
    // Upload the file to Google Cloud Storage
    await bucket.upload(tempLocalFile, {
      destination: `files/${fileName}`,
      metadata: {
        contentType,
      },
    });
    
    // Get public URL
    const file = bucket.file(`files/${fileName}`);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 1 week
    });
    
    // Delete temporary file
    fs.unlinkSync(tempLocalFile);
    
    return {
      url,
      fileName: `files/${fileName}`,
      bucket: DEFAULT_BUCKET_NAME,
    };
  } catch (error) {
    console.error('Error storing file:', error);
    throw new Error(`Error storing file: ${error}`);
  }
}

// Public module interface
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