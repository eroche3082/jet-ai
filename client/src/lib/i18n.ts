// Defining core language types and constants
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pt' | 'de' | 'it';

export interface Language {
  code: SupportedLanguage;
  name: string;
  flag: string;
  native: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
];

export const LOCAL_STORAGE_KEY = 'jetai_language';

// Get default language from localStorage or browser
export function getDefaultLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }
  
  const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY) as SupportedLanguage;
  
  if (savedLanguage && LANGUAGES.some(lang => lang.code === savedLanguage)) {
    return savedLanguage;
  }
  
  // Try to detect browser language
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (LANGUAGES.some(lang => lang.code === browserLang)) {
    return browserLang;
  }
  
  return 'en';
}

// Import the translation utility
import { t } from './translations';

// Utility for translating text using our translation files
export function translate(key: string, language: SupportedLanguage = 'en'): string {
  return t(key, language);
}