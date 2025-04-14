import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LANGUAGES, useLanguage, SupportedLanguage } from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal' | 'icon-only';
  className?: string;
}

export default function LanguageSelector({ 
  variant = 'default',
  className = ''
}: LanguageSelectorProps) {
  const { language: currentLanguage, setLanguage, languages } = useLanguage();
  const { toast } = useToast();
  
  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as SupportedLanguage);
    
    // Notify user
    const language = languages.find(lang => lang.code === langCode);
    toast({
      title: `Language: ${language?.name}`,
      description: `The application language has been changed to ${language?.name}.`,
    });
  };
  
  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`}>
        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-10 !px-2.5">
            <Globe className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex items-center">
                  <span className="mr-2">{language.flag}</span>
                  <span>{language.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-20">
            <span>{currentLanguage.toUpperCase()}</span>
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex items-center">
                  <span className="mr-2">{language.flag}</span>
                  <span>{language.code.toUpperCase()}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`relative ${className}`}>
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[150px]">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span>
              {languages.find(lang => lang.code === currentLanguage)?.name || 'English'}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}