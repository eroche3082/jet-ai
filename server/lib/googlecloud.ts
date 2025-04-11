/**
 * Google Cloud API Server Implementation for JetAI
 * 
 * This module provides server-side implementation of Google Cloud APIs:
 * - Text-to-Speech: Convert text to audio for voice responses
 * - Natural Language: Analyze sentiment and entities for emotional intelligence
 * - Translate: Enable multilingual capabilities
 * - Vision: Analyze travel images and landmarks
 * - Calendar: Sync travel itineraries
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Make sure public/audio directory exists
const audioDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Ensure we have Google API keys
if (!process.env.GOOGLE_CLOUD_API_KEY) {
  console.warn('Warning: GOOGLE_CLOUD_API_KEY is not set. Some Google Cloud APIs may not work.');
}

const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_API_KEY || '';
const TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY || GOOGLE_API_KEY;
const TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || GOOGLE_API_KEY;
const NL_API_KEY = process.env.GOOGLE_NATURAL_LANGUAGE_API_KEY || GOOGLE_API_KEY;
const VISION_API_KEY = process.env.GOOGLE_CLOUD_VISION_API_KEY || GOOGLE_API_KEY;
const CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY || GOOGLE_API_KEY;

// Base URLs for Google Cloud APIs
const TTS_BASE_URL = 'https://texttospeech.googleapis.com/v1';
const NL_BASE_URL = 'https://language.googleapis.com/v1';
const TRANSLATE_BASE_URL = 'https://translation.googleapis.com/language/translate/v2';
const VISION_BASE_URL = 'https://vision.googleapis.com/v1';
const CALENDAR_BASE_URL = 'https://www.googleapis.com/calendar/v3';

/**
 * Text-to-Speech API functions
 */
export const textToSpeech = {
  /**
   * Convert text to speech using Google Cloud TTS
   */
  async synthesize(
    text: string,
    options: {
      language?: string;
      voice?: string;
      gender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
      pitch?: number;
      speakingRate?: number;
    } = {}
  ): Promise<{ audioUrl: string }> {
    try {
      // Construct TTS request payload
      const payload = {
        input: { text },
        voice: {
          languageCode: options.language || 'en-US',
          name: options.voice || 'en-US-Wavenet-F',
          ssmlGender: options.gender || 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: options.pitch || 0,
          speakingRate: options.speakingRate || 1
        }
      };

      // Make API request
      const response = await axios({
        method: 'post',
        url: `${TTS_BASE_URL}/text:synthesize?key=${TTS_API_KEY}`,
        data: payload,
        headers: { 'Content-Type': 'application/json' }
      });

      // Save the audio file
      const audioContent = response.data.audioContent;
      const fileName = `speech-${Date.now()}.mp3`;
      const filePath = path.join(audioDir, fileName);
      
      // Buffer conversion and file writing
      const buffer = Buffer.from(audioContent, 'base64');
      await util.promisify(fs.writeFile)(filePath, buffer);

      // Return public URL to the audio file
      return { audioUrl: `/audio/${fileName}` };
    } catch (error) {
      console.error('Error in TTS API:', error);
      throw new Error('Failed to convert text to speech');
    }
  },

  /**
   * Get available voices from Google Cloud TTS
   */
  async getVoices(language?: string): Promise<{ voices: any[] }> {
    try {
      const url = `${TTS_BASE_URL}/voices?key=${TTS_API_KEY}`;
      const response = await axios.get(url);
      
      let voices = response.data.voices || [];
      
      // Filter by language if specified
      if (language) {
        voices = voices.filter((voice: any) => voice.languageCodes.includes(language));
      }
      
      return { voices };
    } catch (error) {
      console.error('Error getting TTS voices:', error);
      return { voices: [] };
    }
  }
};

/**
 * Natural Language API functions for sentiment analysis
 */
export const naturalLanguage = {
  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<{
    score: number;
    magnitude: number;
    emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
  }> {
    try {
      const url = `${NL_BASE_URL}/documents:analyzeSentiment?key=${NL_API_KEY}`;
      const payload = {
        document: {
          type: 'PLAIN_TEXT',
          content: text
        }
      };
      
      const response = await axios.post(url, payload);
      const { score, magnitude } = response.data.documentSentiment;
      
      // Map sentiment score to emotion
      let emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' = 'neutral';
      
      if (score > 0.7 && magnitude > 0.8) emotion = 'excited';
      else if (score > 0.3) emotion = 'happy';
      else if (score < -0.7 && magnitude > 0.6) emotion = 'angry';
      else if (score < -0.3) emotion = 'sad';
      else if (magnitude < 0.2) emotion = 'neutral';
      else if (magnitude > 0.9 && Math.abs(score) < 0.3) emotion = 'confused';
      
      return { score, magnitude, emotion };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Return neutral sentiment as fallback
      return { score: 0, magnitude: 0, emotion: 'neutral' };
    }
  },
  
  /**
   * Analyze entities in text
   */
  async analyzeEntities(text: string): Promise<{ entities: any[] }> {
    try {
      const url = `${NL_BASE_URL}/documents:analyzeEntities?key=${NL_API_KEY}`;
      const payload = {
        document: {
          type: 'PLAIN_TEXT',
          content: text
        }
      };
      
      const response = await axios.post(url, payload);
      return { entities: response.data.entities || [] };
    } catch (error) {
      console.error('Error analyzing entities:', error);
      return { entities: [] };
    }
  }
};

/**
 * Translate API functions
 */
export const translate = {
  /**
   * Translate text to target language
   */
  async translateText(
    text: string,
    target: string,
    source?: string
  ): Promise<{ translatedText: string, detectedSourceLanguage?: string }> {
    try {
      let url = `${TRANSLATE_BASE_URL}?key=${TRANSLATE_API_KEY}&q=${encodeURIComponent(text)}&target=${target}`;
      
      if (source) {
        url += `&source=${source}`;
      }
      
      const response = await axios.get(url);
      const translation = response.data.data.translations[0];
      
      return {
        translatedText: translation.translatedText,
        detectedSourceLanguage: source ? undefined : translation.detectedSourceLanguage
      };
    } catch (error) {
      console.error('Error in translation:', error);
      // Return original text as fallback
      return { translatedText: text };
    }
  },
  
  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<{ language: string, confidence?: number }> {
    try {
      const url = `${TRANSLATE_BASE_URL}/detect?key=${TRANSLATE_API_KEY}&q=${encodeURIComponent(text)}`;
      const response = await axios.get(url);
      
      const detection = response.data.data.detections[0][0];
      return {
        language: detection.language,
        confidence: detection.confidence
      };
    } catch (error) {
      console.error('Error detecting language:', error);
      // Return English as fallback
      return { language: 'en' };
    }
  }
};

/**
 * Vision API functions
 */
export const vision = {
  /**
   * Analyze image
   */
  async analyzeImage(imageUrl: string): Promise<{
    labels: string[];
    landmarks?: string[];
    text?: string;
    safeSearch?: any;
    faces?: any[];
    webEntities?: string[];
  }> {
    try {
      const url = `${VISION_BASE_URL}/images:annotate?key=${VISION_API_KEY}`;
      
      // Handle base64 data URIs and regular URLs
      let image;
      if (imageUrl.startsWith('data:image')) {
        const base64Data = imageUrl.split(',')[1];
        image = { content: base64Data };
      } else {
        image = { source: { imageUri: imageUrl } };
      }
      
      const payload = {
        requests: [{
          image,
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'LANDMARK_DETECTION', maxResults: 5 },
            { type: 'TEXT_DETECTION' },
            { type: 'SAFE_SEARCH_DETECTION' },
            { type: 'FACE_DETECTION' },
            { type: 'WEB_DETECTION', maxResults: 10 }
          ]
        }]
      };
      
      const response = await axios.post(url, payload);
      const result = response.data.responses[0];
      
      return {
        labels: (result.labelAnnotations || []).map((label: any) => label.description),
        landmarks: (result.landmarkAnnotations || []).map((landmark: any) => landmark.description),
        text: result.textAnnotations ? result.textAnnotations[0].description : '',
        safeSearch: result.safeSearchAnnotation,
        faces: result.faceAnnotations || [],
        webEntities: (result.webDetection?.webEntities || [])
          .map((entity: any) => entity.description)
          .filter(Boolean)
      };
    } catch (error) {
      console.error('Error in image analysis:', error);
      return { labels: [] };
    }
  },
  
  /**
   * Detect landmarks in image
   */
  async detectLandmarks(imageUrl: string): Promise<{
    landmarks: Array<{name: string; confidence: number; locations: any[]}>;
  }> {
    try {
      const url = `${VISION_BASE_URL}/images:annotate?key=${VISION_API_KEY}`;
      
      // Handle base64 data URIs and regular URLs
      let image;
      if (imageUrl.startsWith('data:image')) {
        const base64Data = imageUrl.split(',')[1];
        image = { content: base64Data };
      } else {
        image = { source: { imageUri: imageUrl } };
      }
      
      const payload = {
        requests: [{
          image,
          features: [{ type: 'LANDMARK_DETECTION', maxResults: 5 }]
        }]
      };
      
      const response = await axios.post(url, payload);
      const landmarks = response.data.responses[0].landmarkAnnotations || [];
      
      return {
        landmarks: landmarks.map((landmark: any) => ({
          name: landmark.description,
          confidence: landmark.score,
          locations: landmark.locations
        }))
      };
    } catch (error) {
      console.error('Error detecting landmarks:', error);
      return { landmarks: [] };
    }
  }
};

/**
 * Calendar API functions
 */
export const calendar = {
  /**
   * Add event to Google Calendar
   */
  async addEvent(calendarId: string, event: {
    summary: string;
    location?: string;
    description?: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    reminders?: { useDefault: boolean };
  }): Promise<{ id: string }> {
    try {
      const url = `${CALENDAR_BASE_URL}/calendars/${calendarId}/events?key=${CALENDAR_API_KEY}`;
      const response = await axios.post(url, event);
      return { id: response.data.id };
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw new Error('Failed to add event to calendar');
    }
  },
  
  /**
   * Get calendar events
   */
  async getEvents(
    calendarId: string,
    timeMin: string,
    timeMax: string
  ): Promise<{ events: any[] }> {
    try {
      const url = `${CALENDAR_BASE_URL}/calendars/${calendarId}/events?key=${CALENDAR_API_KEY}&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;
      const response = await axios.get(url);
      return { events: response.data.items || [] };
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return { events: [] };
    }
  }
};

/**
 * Main Google Cloud API exports
 */
export const googleCloud = {
  tts: textToSpeech,
  naturalLanguage,
  translate,
  vision,
  calendar
};

export default googleCloud;