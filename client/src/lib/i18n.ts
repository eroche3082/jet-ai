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

// Get default language from localStorage or browser - ENGLISH ONLY VERSION
export function getDefaultLanguage(): SupportedLanguage {
  // English only version
  return 'en';
}

// Import the translation utility
import { t } from './translations';

// Utility for translating text using our translation files
export function translate(key: string, language: SupportedLanguage = 'en'): string {
  return t(key, language);
}