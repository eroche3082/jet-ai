import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechOptions {
  language?: string;
  voiceName?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

interface TextToSpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isVoiceSupported: boolean;
  availableVoices: SpeechSynthesisVoice[];
  errorMessage: string | null;
  currentUtterance: SpeechSynthesisUtterance | null;
}

const defaultOptions: TextToSpeechOptions = {
  language: 'en-US',
  pitch: 1,
  rate: 1,
  volume: 1
};

const useTextToSpeech = (options?: TextToSpeechOptions) => {
  const opts = { ...defaultOptions, ...options };
  
  const [state, setState] = useState<TextToSpeechState>({
    isSpeaking: false,
    isPaused: false,
    isMuted: false,
    isVoiceSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    availableVoices: [],
    errorMessage: null,
    currentUtterance: null
  });

  // Actualizar las voces disponibles
  useEffect(() => {
    if (!state.isVoiceSupported) return;

    const handleVoicesChanged = () => {
      const voices = speechSynthesis.getVoices();
      setState(prev => ({ ...prev, availableVoices: voices }));
    };

    // Algunas versiones de Chrome necesitan usar el evento
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      // Intentar obtener las voces inmediatamente
      handleVoicesChanged();
    }

    return () => {
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, [state.isVoiceSupported]);

  // Seleccionar la voz correcta
  const getVoice = useCallback(() => {
    if (!state.isVoiceSupported || state.availableVoices.length === 0) return null;

    // Buscar por nombre si está especificado
    if (opts.voiceName) {
      const namedVoice = state.availableVoices.find(voice => 
        voice.name.toLowerCase().includes(opts.voiceName!.toLowerCase())
      );
      if (namedVoice) return namedVoice;
    }

    // Buscar por idioma
    const langVoice = state.availableVoices.find(voice => 
      voice.lang.toLowerCase().includes(opts.language!.toLowerCase())
    );
    
    // Fallback a la primera voz o a una voz en español/inglés
    return langVoice || 
      state.availableVoices.find(voice => /^es/.test(voice.lang)) || 
      state.availableVoices.find(voice => /^en/.test(voice.lang)) || 
      state.availableVoices[0];
  }, [opts.language, opts.voiceName, state.availableVoices, state.isVoiceSupported]);

  // Función para hablar
  const speak = useCallback((text: string) => {
    if (!state.isVoiceSupported || state.isMuted) return;
    
    try {
      // Detener cualquier síntesis actual
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getVoice();
      
      if (voice) utterance.voice = voice;
      
      utterance.lang = opts.language || 'en-US';
      utterance.pitch = opts.pitch || 1;
      utterance.rate = opts.rate || 1;
      utterance.volume = opts.volume || 1;
      
      // Eventos
      utterance.onstart = () => {
        setState(prev => ({ ...prev, isSpeaking: true, isPaused: false }));
      };
      
      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false, isPaused: false, currentUtterance: null }));
      };
      
      utterance.onerror = (event) => {
        setState(prev => ({ 
          ...prev, 
          isSpeaking: false, 
          isPaused: false, 
          errorMessage: event.error,
          currentUtterance: null 
        }));
      };
      
      setState(prev => ({ ...prev, currentUtterance: utterance }));
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error en síntesis de voz:', error);
      setState(prev => ({ 
        ...prev, 
        errorMessage: error instanceof Error ? error.message : 'Error desconocido',
        isSpeaking: false
      }));
    }
  }, [getVoice, opts.language, opts.pitch, opts.rate, opts.volume, state.isMuted, state.isVoiceSupported]);

  // Pausar
  const pause = useCallback(() => {
    if (!state.isVoiceSupported || !state.isSpeaking) return;
    speechSynthesis.pause();
    setState(prev => ({ ...prev, isPaused: true }));
  }, [state.isSpeaking, state.isVoiceSupported]);

  // Reanudar
  const resume = useCallback(() => {
    if (!state.isVoiceSupported || !state.isPaused) return;
    speechSynthesis.resume();
    setState(prev => ({ ...prev, isPaused: false }));
  }, [state.isPaused, state.isVoiceSupported]);

  // Cancelar
  const cancel = useCallback(() => {
    if (!state.isVoiceSupported) return;
    speechSynthesis.cancel();
    setState(prev => ({ 
      ...prev, 
      isSpeaking: false, 
      isPaused: false,
      currentUtterance: null
    }));
  }, [state.isVoiceSupported]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    
    // Si está hablando y activamos mute, cancelar
    if (!state.isMuted && state.isSpeaking) {
      cancel();
    }
  }, [cancel, state.isMuted, state.isSpeaking]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (state.isVoiceSupported && state.isSpeaking) {
        speechSynthesis.cancel();
      }
    };
  }, [state.isSpeaking, state.isVoiceSupported]);

  return {
    speak,
    pause,
    resume,
    cancel,
    toggleMute,
    isSpeaking: state.isSpeaking,
    isPaused: state.isPaused,
    isMuted: state.isMuted,
    isVoiceSupported: state.isVoiceSupported,
    availableVoices: state.availableVoices,
    errorMessage: state.errorMessage,
    currentUtterance: state.currentUtterance
  };
};

export default useTextToSpeech;