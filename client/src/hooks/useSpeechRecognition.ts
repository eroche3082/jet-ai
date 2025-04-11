import { useState, useRef, useEffect, useCallback } from 'react';

// Interfaces para SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  autoStart?: boolean;
}

interface SpeechRecognitionState {
  isListening: boolean;
  isBrowserSupported: boolean;
  transcript: string;
  interimTranscript: string;
  errorMessage: string | null;
}

// Hook principal
const useSpeechRecognition = (options?: SpeechRecognitionOptions) => {
  // Valores por defecto
  const opts = {
    language: options?.language || 'en-US',
    continuous: options?.continuous || false,
    interimResults: options?.interimResults || true,
    maxAlternatives: options?.maxAlternatives || 1,
    autoStart: options?.autoStart || false,
  };

  // Referencia al objeto de reconocimiento
  const recognitionRef = useRef<any>(null);

  // Estado
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isBrowserSupported: false,
    transcript: '',
    interimTranscript: '',
    errorMessage: null,
  });

  // Configurar el reconocimiento de voz
  useEffect(() => {
    // Detectar soporte del navegador
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isSupportedBrowser = !!SpeechRecognition;

    setState(prev => ({ ...prev, isBrowserSupported: isSupportedBrowser }));

    // Si no hay soporte, salir
    if (!isSupportedBrowser) {
      console.warn('El navegador no soporta reconocimiento de voz');
      return;
    }

    // Crear instancia
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      
      // Configurar
      recognitionRef.current.lang = opts.language;
      recognitionRef.current.continuous = opts.continuous;
      recognitionRef.current.interimResults = opts.interimResults;
      recognitionRef.current.maxAlternatives = opts.maxAlternatives;
    }

    // Limpiar al desmontar
    return () => {
      if (recognitionRef.current && state.isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error al detener reconocimiento:', e);
        }
      }
    };
  }, [
    opts.continuous,
    opts.interimResults,
    opts.language,
    opts.maxAlternatives,
    state.isListening
  ]);

  // Iniciar reconocimiento automáticamente si se solicita
  useEffect(() => {
    if (opts.autoStart && state.isBrowserSupported && !state.isListening) {
      startListening();
    }
  }, [opts.autoStart, state.isBrowserSupported, state.isListening]);

  // Establecer manejadores de eventos
  const setupEventListeners = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Si tenemos resultados finales, actualizar la transcripción
      if (finalTranscript) {
        setState(prev => ({ 
          ...prev, 
          transcript: prev.transcript ? `${prev.transcript} ${finalTranscript}` : finalTranscript,
          interimTranscript: interimTranscript
        }));
      } 
      // Si solo tenemos resultados provisionales
      else if (interimTranscript) {
        setState(prev => ({ ...prev, interimTranscript }));
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
      setState(prev => ({ 
        ...prev, 
        errorMessage: `Error: ${event.error}, ${event.message || 'No hay detalles adicionales'}` 
      }));
    };

    recognitionRef.current.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current.onstart = () => {
      setState(prev => ({ 
        ...prev, 
        isListening: true,
        errorMessage: null 
      }));
    };
  }, []);

  // Iniciar escucha
  const startListening = useCallback(() => {
    if (!state.isBrowserSupported || state.isListening) return;

    try {
      // Asegurarse de que los eventos estén configurados
      setupEventListeners();
      
      // Configurar el idioma cada vez que iniciamos (puede cambiar)
      if (recognitionRef.current) {
        recognitionRef.current.lang = opts.language;
        
        // Reiniciar la transcripción a menos que sea continuo
        if (!opts.continuous) {
          setState(prev => ({ ...prev, transcript: '', interimTranscript: '' }));
        }
        
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error al iniciar reconocimiento:', error);
      setState(prev => ({ 
        ...prev, 
        isListening: false,
        errorMessage: error instanceof Error ? error.message : 'Error desconocido al iniciar reconocimiento'
      }));
    }
  }, [opts.continuous, opts.language, setupEventListeners, state.isBrowserSupported, state.isListening]);

  // Detener escucha
  const stopListening = useCallback(() => {
    if (!state.isBrowserSupported || !state.isListening) return;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (error) {
      console.error('Error al detener reconocimiento:', error);
    }
  }, [state.isBrowserSupported, state.isListening]);

  // Reiniciar transcripción
  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '' }));
  }, []);

  // Objeto de retorno
  return {
    transcript: state.transcript,
    interimTranscript: state.interimTranscript,
    finalTranscript: state.transcript,
    isListening: state.isListening,
    isBrowserSupported: state.isBrowserSupported,
    errorMessage: state.errorMessage,
    startListening,
    stopListening,
    resetTranscript
  };
};

export default useSpeechRecognition;