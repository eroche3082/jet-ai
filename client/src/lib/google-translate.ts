import axios from 'axios';

interface TranslationResponse {
  data: {
    translations: {
      translatedText: string;
      detectedSourceLanguage?: string;
    }[];
  };
}

/**
 * Translate text using Google Translate API
 * @param text Text to translate
 * @param targetLanguage Target language code (e.g., 'es' for Spanish)
 * @param sourceLanguage Source language code (optional)
 * @returns Translation result
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<{
  translatedText: string;
  detectedSourceLanguage?: string;
}> {
  try {
    const apiKey = import.meta.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Translate API key is not configured');
    }
    
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const data: {
      q: string;
      target: string;
      source?: string;
      format?: string;
    } = {
      q: text,
      target: targetLanguage,
      format: 'text'
    };
    
    // Add source language if provided
    if (sourceLanguage) {
      data.source = sourceLanguage;
    }
    
    const response = await axios.post<TranslationResponse>(url, data);
    
    if (
      !response.data ||
      !response.data.data ||
      !response.data.data.translations ||
      response.data.data.translations.length === 0
    ) {
      throw new Error('Invalid response from Google Translate API');
    }
    
    const result = response.data.data.translations[0];
    
    return {
      translatedText: result.translatedText,
      detectedSourceLanguage: result.detectedSourceLanguage
    };
  } catch (error) {
    console.error('Error translating text with Google Translate:', error);
    throw error;
  }
}

/**
 * Detect language of text using Google Translate API
 * @param text Text to detect language for
 * @returns Detected language code
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const apiKey = import.meta.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Translate API key is not configured');
    }
    
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`;
    
    const response = await axios.post(url, {
      q: text
    });
    
    if (
      !response.data ||
      !response.data.data ||
      !response.data.data.detections ||
      response.data.data.detections.length === 0 ||
      response.data.data.detections[0].length === 0
    ) {
      throw new Error('Invalid response from Google Translate API language detection');
    }
    
    return response.data.data.detections[0][0].language;
  } catch (error) {
    console.error('Error detecting language with Google Translate:', error);
    throw error;
  }
}

/**
 * Get supported languages from Google Translate API
 * @returns List of supported languages
 */
export async function getSupportedLanguages(
  targetLanguage: string = 'en'
): Promise<Array<{ language: string; name: string }>> {
  try {
    const apiKey = import.meta.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Translate API key is not configured');
    }
    
    const url = `https://translation.googleapis.com/language/translate/v2/languages?key=${apiKey}&target=${targetLanguage}`;
    
    const response = await axios.get(url);
    
    if (
      !response.data ||
      !response.data.data ||
      !response.data.data.languages
    ) {
      throw new Error('Invalid response from Google Translate API languages');
    }
    
    return response.data.data.languages;
  } catch (error) {
    console.error('Error getting supported languages from Google Translate:', error);
    throw error;
  }
}