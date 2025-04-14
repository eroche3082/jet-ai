import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, getDefaultLanguage, LANGUAGES } from './i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languages: typeof LANGUAGES;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  languages: LANGUAGES
});

// Export hook for easy consumption
export const useLanguageContext = () => useContext(LanguageContext);

// Language Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getDefaultLanguage());
  
  // Handle language change
  const setLanguage = (newLanguage: SupportedLanguage) => {
    // Make sure it's supported
    if (!LANGUAGES.some(lang => lang.code === newLanguage)) {
      console.warn(`Language ${newLanguage} is not supported`);
      return;
    }
    
    // Update state and document property
    setLanguageState(newLanguage);
    localStorage.setItem('jetai_language', newLanguage);
    document.documentElement.lang = newLanguage;
    
    // Dispatch event for components that need to react to language changes
    window.dispatchEvent(new CustomEvent('languageChange', { 
      detail: { language: newLanguage } 
    }));
  };
  
  // Set up language on mount
  useEffect(() => {
    const savedLanguage = getDefaultLanguage();
    if (savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
    
    // Listen for language changes from other components
    const handleLanguageChange = (e: any) => {
      if (e.detail?.language && e.detail.language !== language) {
        setLanguageState(e.detail.language);
      }
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
  
  // Create the context value
  const contextValue = {
    language,
    setLanguage,
    languages: LANGUAGES
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;