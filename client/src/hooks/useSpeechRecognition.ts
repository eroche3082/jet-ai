/**
 * Hook para manejar el reconocimiento de voz
 * Proporciona funciones para convertir voz a texto usando Web Speech API
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { activeChatConfig } from '@/lib/chatConfig';

type UseSpeechRecognitionReturn = {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasPermission: boolean;
  error: string | null;
};

// Definir tipos para SpeechRecognition
interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResult;
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

// Extender interface de Window
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

/**
 * Hook para manejar el reconocimiento de voz
 */
export default function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Verificar disponibilidad de la API al cargar
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('El reconocimiento de voz no está soportado en este navegador.');
      setHasPermission(false);
    }
  }, []);

  // Reiniciar reconocimiento si se detiene inesperadamente
  const handleRecognitionEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  // Manejar errores de reconocimiento
  const handleRecognitionError = useCallback((event: any) => {
    if (event.error === 'not-allowed') {
      setHasPermission(false);
      setError('El acceso al micrófono fue denegado.');
    } else if (event.error === 'no-speech') {
      setError('No se detectó ninguna voz.');
    } else {
      setError(`Error de reconocimiento: ${event.error}`);
    }
    setIsListening(false);
  }, []);

  // Manejar resultados del reconocimiento
  const handleRecognitionResult = useCallback((event: SpeechRecognitionEvent) => {
    const current = event.results[event.results.length - 1];
    const transcriptResult = current[0].transcript;
    
    setTranscript(transcriptResult);
  }, []);

  // Iniciar reconocimiento de voz
  const startListening = useCallback(() => {
    setError(null);
    
    if (!hasPermission) {
      setError('El acceso al micrófono fue denegado. Verifica los permisos.');
      return;
    }
    
    // Detener cualquier reconocimiento en curso
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        setError('El reconocimiento de voz no está soportado en este navegador.');
        return;
      }
      
      recognitionRef.current = new SpeechRecognitionAPI();
      
      // Configurar opciones
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Determinar el idioma basado en la configuración
      let recognitionLang = 'es-ES'; // Español por defecto
      
      // Cuando se implemente una selección de idioma, usaríamos eso:
      // const userLanguage = activeChatConfig.language || 'es-ES';
      // recognitionRef.current.lang = userLanguage;
      recognitionRef.current.lang = recognitionLang;
      
      // Configurar eventos
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = handleRecognitionEnd;
      recognitionRef.current.onerror = handleRecognitionError;
      recognitionRef.current.onresult = handleRecognitionResult as any;
      
      // Limpiar transcripción anterior
      setTranscript('');
      
      // Iniciar reconocimiento
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error iniciando reconocimiento de voz:', err);
      setError('Error iniciando reconocimiento de voz.');
      setIsListening(false);
    }
  }, [hasPermission, handleRecognitionEnd, handleRecognitionError, handleRecognitionResult]);

  // Detener reconocimiento de voz
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasPermission,
    error
  };
}