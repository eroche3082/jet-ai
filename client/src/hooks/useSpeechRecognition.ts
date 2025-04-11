import { useState, useRef, useEffect } from 'react';
import { activeChatConfig } from '@/lib/chatConfig';

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    item(index: number): any;
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onnomatch: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

// Extend Window interface
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

type UseSpeechRecognitionReturn = {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasSupport: boolean;
};

/**
 * Hook para manejar el reconocimiento de voz
 */
export default function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [hasSupport, setHasSupport] = useState(false);
  
  // Verificar soporte de reconocimiento de voz
  useEffect(() => {
    const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    setHasSupport(hasSpeechRecognition);
  }, []);
  
  // Iniciar reconocimiento de voz
  const startListening = () => {
    if (!hasSupport || isListening) return;
    
    try {
      // Browser compatibility
      const SpeechRecognitionAPI = window.SpeechRecognition || 
        window.webkitSpeechRecognition;
        
      if (!SpeechRecognitionAPI) {
        console.error('Speech recognition not supported in this browser');
        return;
      }
      
      recognitionRef.current = new SpeechRecognitionAPI();
      
      // Use configuration from chatConfig
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Determinar idioma basado en la configuración o usar inglés por defecto
      const defaultLanguage = 'en-US';
      let recognitionLanguage = defaultLanguage;
      
      // Si la configuración especifica un idioma, usarlo
      if (activeChatConfig.languageSupport.includes('Español')) {
        recognitionLanguage = 'es-ES';
      } else if (activeChatConfig.languageSupport.includes('Français')) {
        recognitionLanguage = 'fr-FR';
      } else if (activeChatConfig.languageSupport.includes('Português')) {
        recognitionLanguage = 'pt-BR';
      } else if (activeChatConfig.languageSupport.includes('Italiano')) {
        recognitionLanguage = 'it-IT';
      } else if (activeChatConfig.languageSupport.includes('Deutsch')) {
        recognitionLanguage = 'de-DE';
      }
      
      recognitionRef.current.lang = recognitionLanguage;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Speech recognition setup failed:', error);
      setIsListening(false);
    }
  };
  
  // Detener reconocimiento de voz
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasSupport
  };
}