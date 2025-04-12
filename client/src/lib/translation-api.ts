import axios from 'axios';
import { translateText } from '@/lib/google-translate';

// Interfaces for translation service
export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  provider: 'google' | 'rapid' | 'fallback';
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName?: string;
}

// Cache to store recent translations
interface TranslationCache {
  [key: string]: TranslationResult;
}

const translationCache: TranslationCache = {};
const CACHE_SIZE_LIMIT = 100;

// Common languages for the app
export const commonLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
];

/**
 * Translate text using available translation services
 */
export async function translate(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<TranslationResult> {
  // Generate cache key
  const cacheKey = `${text}|${sourceLanguage}|${targetLanguage}`;
  
  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  try {
    // Try Google Translate first if the API key is available
    if (import.meta.env.GOOGLE_TRANSLATE_API_KEY) {
      try {
        const result = await translateWithGoogle(text, targetLanguage, sourceLanguage);
        
        // Cache the result
        cacheTranslation(cacheKey, result);
        
        return result;
      } catch (error) {
        console.error('Google Translate error:', error);
        // Fall through to next translation method
      }
    }
    
    // Try RapidAPI as fallback
    if (import.meta.env.RAPIDAPI_KEY) {
      try {
        const result = await translateWithRapidAPI(text, targetLanguage, sourceLanguage);
        
        // Cache the result
        cacheTranslation(cacheKey, result);
        
        return result;
      } catch (error) {
        console.error('RapidAPI translation error:', error);
        // Fall through to fallback
      }
    }
    
    // Use fallback translation for basic phrases
    const fallbackResult = getFallbackTranslation(text, targetLanguage, sourceLanguage);
    
    // Cache the fallback result
    cacheTranslation(cacheKey, fallbackResult);
    
    return fallbackResult;
  } catch (error) {
    console.error('Translation error:', error);
    
    // Return error as fallback
    return {
      translatedText: 'Translation unavailable. Please try again later.',
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      sourceText: text,
      provider: 'fallback'
    };
  }
}

/**
 * Get all available languages for translation
 */
export async function getAvailableLanguages(): Promise<LanguageOption[]> {
  try {
    // Try to get the full list of languages from Google Translate
    if (import.meta.env.GOOGLE_TRANSLATE_API_KEY) {
      try {
        const languages = await getLanguagesFromGoogle();
        return languages;
      } catch (error) {
        console.error('Error fetching languages from Google:', error);
      }
    }
    
    // Fallback to RapidAPI
    if (import.meta.env.RAPIDAPI_KEY) {
      try {
        const languages = await getLanguagesFromRapidAPI();
        return languages;
      } catch (error) {
        console.error('Error fetching languages from RapidAPI:', error);
      }
    }
    
    // Fallback to common languages
    return commonLanguages;
  } catch (error) {
    console.error('Error fetching available languages:', error);
    return commonLanguages;
  }
}

/**
 * Translate text using Google Cloud Translation API
 */
async function translateWithGoogle(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<TranslationResult> {
  try {
    const result = await translateText(text, targetLanguage, sourceLanguage === 'auto' ? undefined : sourceLanguage);
    
    return {
      translatedText: result.translatedText,
      sourceLanguage: result.detectedSourceLanguage || sourceLanguage,
      targetLanguage,
      sourceText: text,
      provider: 'google'
    };
  } catch (error) {
    console.error('Google Translate API error:', error);
    throw error;
  }
}

/**
 * Translate text using RapidAPI
 */
async function translateWithRapidAPI(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<TranslationResult> {
  try {
    const options = {
      method: 'POST',
      url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
      params: {
        'to[0]': targetLanguage,
        'api-version': '3.0',
        profanityAction: 'NoAction',
        textType: 'plain'
      },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
      },
      data: [
        {
          Text: text
        }
      ]
    };
    
    // Add source language if specified
    if (sourceLanguage !== 'auto') {
      options.params['from'] = sourceLanguage;
    }
    
    const response = await axios.request(options);
    const result = response.data[0];
    
    return {
      translatedText: result.translations[0].text,
      sourceLanguage: result.detectedLanguage?.language || sourceLanguage,
      targetLanguage,
      sourceText: text,
      provider: 'rapid'
    };
  } catch (error) {
    console.error('RapidAPI translation error:', error);
    throw error;
  }
}

/**
 * Get languages from Google Cloud Translation API
 */
async function getLanguagesFromGoogle(): Promise<LanguageOption[]> {
  // In a real implementation, this would call the Google Translate API
  // For now, just return common languages
  return commonLanguages;
}

/**
 * Get languages from RapidAPI
 */
async function getLanguagesFromRapidAPI(): Promise<LanguageOption[]> {
  try {
    const options = {
      method: 'GET',
      url: 'https://microsoft-translator-text.p.rapidapi.com/languages',
      params: {
        'api-version': '3.0'
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
      }
    };
    
    const response = await axios.request(options);
    const languagesData = response.data.translation;
    
    return Object.entries(languagesData).map(([code, data]: [string, any]) => ({
      code,
      name: data.name,
      nativeName: data.nativeName
    }));
  } catch (error) {
    console.error('Error fetching languages from RapidAPI:', error);
    throw error;
  }
}

/**
 * Fallback translation for common phrases
 */
function getFallbackTranslation(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): TranslationResult {
  // Simple dictionary of common phrases in different languages
  const commonPhrases: Record<string, Record<string, string>> = {
    'Hello': {
      'es': 'Hola',
      'fr': 'Bonjour',
      'de': 'Hallo',
      'it': 'Ciao',
      'pt': 'Olá',
      'ja': 'こんにちは',
      'ko': '안녕하세요',
      'zh': '你好',
      'ru': 'Привет',
      'ar': 'مرحبا',
    },
    'Thank you': {
      'es': 'Gracias',
      'fr': 'Merci',
      'de': 'Danke',
      'it': 'Grazie',
      'pt': 'Obrigado',
      'ja': 'ありがとう',
      'ko': '감사합니다',
      'zh': '谢谢',
      'ru': 'Спасибо',
      'ar': 'شكرا',
    },
    'Good morning': {
      'es': 'Buenos días',
      'fr': 'Bonjour',
      'de': 'Guten Morgen',
      'it': 'Buongiorno',
      'pt': 'Bom dia',
      'ja': 'おはようございます',
      'ko': '좋은 아침',
      'zh': '早上好',
      'ru': 'Доброе утро',
      'ar': 'صباح الخير',
    },
    // Add more common phrases as needed
  };
  
  // Check if this is a common phrase we know
  const lowercaseText = text.toLowerCase();
  const matchedPhrase = Object.keys(commonPhrases).find(phrase => 
    phrase.toLowerCase() === lowercaseText
  );
  
  if (matchedPhrase && commonPhrases[matchedPhrase][targetLanguage]) {
    return {
      translatedText: commonPhrases[matchedPhrase][targetLanguage],
      sourceLanguage: 'en', // Assume source is English for these phrases
      targetLanguage,
      sourceText: text,
      provider: 'fallback'
    };
  }
  
  // If we don't have a translation, return the original text
  return {
    translatedText: text,
    sourceLanguage: sourceLanguage,
    targetLanguage,
    sourceText: text,
    provider: 'fallback'
  };
}

/**
 * Cache a translation result
 */
function cacheTranslation(cacheKey: string, result: TranslationResult): void {
  translationCache[cacheKey] = result;
  
  // Limit the cache size
  const cacheKeys = Object.keys(translationCache);
  if (cacheKeys.length > CACHE_SIZE_LIMIT) {
    // Remove oldest entries
    const keysToRemove = cacheKeys.slice(0, cacheKeys.length - CACHE_SIZE_LIMIT);
    keysToRemove.forEach(key => {
      delete translationCache[key];
    });
  }
}