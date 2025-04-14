import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal' | 'icon-only';
  className?: string;
}

export default function LanguageSelector({ 
  variant = 'default',
  className = ''
}: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const { toast } = useToast();
  
  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('jetai_language');
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);
  
  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('jetai_language', langCode);
    document.documentElement.lang = langCode;
    
    // Notify user
    const language = languages.find(lang => lang.code === langCode);
    toast({
      title: `Language: ${language?.name}`,
      description: `The application language has been changed to ${language?.name}.`,
    });
    
    // In a real app, this would trigger a translation load or API call
    const event = new CustomEvent('languageChange', { detail: { language: langCode } });
    window.dispatchEvent(event);
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