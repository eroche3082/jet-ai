/**
 * Google Cloud API integration for JetAI
 * Provides centralized access to Google Cloud services:
 * - Text-to-Speech for voice output
 * - Natural Language for sentiment analysis
 * - Translate for dynamic language switching
 * - Vision for image analysis
 * - Calendar for trip syncing
 */

import axios from 'axios';

// API base URL for server-side Google Cloud API calls
const API_BASE_URL = '/api/google';

/**
 * Text-to-Speech API wrapper
 */
export const textToSpeech = {
  /**
   * Convert text to speech using Google Cloud TTS
   * @param text Text to convert to speech
   * @param options Configuration options
   * @returns URL to audio file
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
  ): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/tts`, {
        text,
        language: options.language || 'en-US',
        voice: options.voice || 'en-US-Wavenet-F',
        gender: options.gender || 'FEMALE',
        pitch: options.pitch || 0,
        speakingRate: options.speakingRate || 1
      });
      
      return response.data.audioUrl;
    } catch (error) {
      console.error('Error with Text-to-Speech API:', error);
      throw new Error('Failed to convert text to speech');
    }
  },
  
  /**
   * Get available voices from Google Cloud TTS
   * @param language Optional language filter
   * @returns List of available voices
   */
  async getVoices(language?: string): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tts/voices`, {
        params: { language }
      });
      
      return response.data.voices;
    } catch (error) {
      console.error('Error getting TTS voices:', error);
      return [];
    }
  }
};

/**
 * Natural Language API wrapper for sentiment analysis
 */
export const naturalLanguage = {
  /**
   * Analyze sentiment of text
   * @param text Text to analyze
   * @returns Sentiment analysis results
   */
  async analyzeSentiment(text: string): Promise<{
    score: number;
    magnitude: number;
    emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
  }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/nl/sentiment`, { text });
      return response.data;
    } catch (error) {
      console.error('Error with Natural Language API:', error);
      // Return neutral sentiment as fallback
      return { score: 0, magnitude: 0, emotion: 'neutral' };
    }
  },
  
  /**
   * Analyze entities in text
   * @param text Text to analyze
   * @returns Entity analysis results
   */
  async analyzeEntities(text: string): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/nl/entities`, { text });
      return response.data;
    } catch (error) {
      console.error('Error analyzing entities:', error);
      return { entities: [] };
    }
  }
};

/**
 * Translate API wrapper
 */
export const translate = {
  /**
   * Translate text to target language
   * @param text Text to translate
   * @param target Target language code
   * @param source Optional source language code
   * @returns Translated text
   */
  async translateText(
    text: string,
    target: string,
    source?: string
  ): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text,
        target,
        source
      });
      
      return response.data.translatedText;
    } catch (error) {
      console.error('Error with Translate API:', error);
      // Return original text as fallback
      return text;
    }
  },
  
  /**
   * Detect language of text
   * @param text Text to detect language of
   * @returns Detected language code
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/translate/detect`, { text });
      return response.data.language;
    } catch (error) {
      console.error('Error detecting language:', error);
      // Return English as fallback
      return 'en';
    }
  }
};

/**
 * Vision API wrapper
 */
export const vision = {
  /**
   * Analyze image
   * @param imageUrl URL or base64 data of image
   * @returns Analysis results
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
      const response = await axios.post(`${API_BASE_URL}/vision/analyze`, { imageUrl });
      return response.data;
    } catch (error) {
      console.error('Error with Vision API:', error);
      return { labels: [] };
    }
  },
  
  /**
   * Check if image contains landmarks
   * @param imageUrl URL or base64 data of image
   * @returns Landmark information
   */
  async detectLandmarks(imageUrl: string): Promise<{
    landmarks: Array<{name: string; confidence: number; locations: any[]}>;
  }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vision/landmarks`, { imageUrl });
      return response.data;
    } catch (error) {
      console.error('Error detecting landmarks:', error);
      return { landmarks: [] };
    }
  }
};

/**
 * Calendar API wrapper
 */
export const calendar = {
  /**
   * Add trip to Google Calendar
   * @param event Calendar event details
   * @returns Event ID
   */
  async addEvent(event: {
    summary: string;
    location?: string;
    description?: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    reminders?: { useDefault: boolean };
  }): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/calendar/events`, event);
      return response.data.id;
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw new Error('Failed to add event to calendar');
    }
  },
  
  /**
   * Get calendar events
   * @param timeMin Minimum time for events
   * @param timeMax Maximum time for events
   * @returns List of events
   */
  async getEvents(timeMin: string, timeMax: string): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/calendar/events`, {
        params: { timeMin, timeMax }
      });
      return response.data.events;
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return [];
    }
  }
};

/**
 * Main Google Cloud API client
 */
export const googleCloud = {
  tts: textToSpeech,
  naturalLanguage,
  translate,
  vision,
  calendar
};

export default googleCloud;