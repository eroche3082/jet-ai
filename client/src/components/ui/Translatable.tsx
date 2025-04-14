import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { translate } from '@/lib/i18n';

interface TranslatableProps {
  text: string;
  params?: Record<string, string | number>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * A component that translates text based on the current language setting.
 * 
 * Usage examples:
 * <Translatable text="home" /> - Translates the key "home"
 * <Translatable text="welcome_back" as="h1" className="text-2xl" /> - Renders as h1 with classes
 */
const Translatable: React.FC<TranslatableProps> = ({ 
  text, 
  params = {}, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { language } = useLanguage();
  
  let translatedText = translate(text, language);
  
  // Replace any parameters in the translated text (format: {paramName})
  Object.entries(params).forEach(([key, value]) => {
    translatedText = translatedText.replace(`{${key}}`, String(value));
  });
  
  return <Component className={className}>{translatedText}</Component>;
};

export default Translatable;