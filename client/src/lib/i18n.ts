import { useState, useEffect } from 'react';

// Define supported languages
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

const LOCAL_STORAGE_KEY = 'jetai_language';

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

// Hook for using language throughout the app
export function useLanguage() {
  const [language, setLanguageState] = useState<SupportedLanguage>(getDefaultLanguage());
  
  const setLanguage = (newLanguage: SupportedLanguage) => {
    if (!LANGUAGES.some(lang => lang.code === newLanguage)) {
      console.warn(`Language ${newLanguage} is not supported`);
      return;
    }
    
    setLanguageState(newLanguage);
    localStorage.setItem(LOCAL_STORAGE_KEY, newLanguage);
    document.documentElement.lang = newLanguage;
    
    // Dispatch event for components that need to react to language changes
    window.dispatchEvent(new CustomEvent('languageChange', { 
      detail: { language: newLanguage } 
    }));
  };
  
  // Initialize language on mount
  useEffect(() => {
    const savedLanguage = getDefaultLanguage();
    if (savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
    
    // Listen for language changes from other components (like LanguageSelector)
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail?.language && e.detail.language !== language) {
        setLanguageState(e.detail.language);
      }
    };
    
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);
  
  return {
    language,
    setLanguage,
    languages: LANGUAGES,
    currentLanguageInfo: LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0]
  };
}

// Utility for translating text - in a real app, this would use proper i18n libraries
export function translate(key: string, language: SupportedLanguage = 'en'): string {
  if (language === 'en') {
    return key; // For demo purposes, we're just returning the key for English
  }
  
  // In a real implementation, this would look up translations from files or API
  console.log(`Translating ${key} to ${language}`);
  return key; // Return key as fallback
}