import { useState, useRef, useEffect } from 'react';
import { activeChatConfig } from '@/lib/chatConfig';
import googleCloud from '@/lib/googlecloud';

type UseTextToSpeechReturn = {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isPremiumVoice: boolean;
  isSpeaking: boolean;
  setVolume: (volume: number) => void;
  volume: number;
};

/**
 * Hook para manejar la síntesis de voz
 */
export default function useTextToSpeech(): UseTextToSpeechReturn {
  const [volume, setVolume] = useState(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPremiumVoice, setIsPremiumVoice] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);
  
  /**
   * Limpia el texto para la síntesis de voz
   */
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/[*_#~`]/g, '')         // Remove markdown
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image links
      .replace(/\[.*?\]\(.*?\)/g, '$1') // Replace links with just the text
      .replace(/(\n+)/g, '. ')          // Replace newlines with pauses
      .replace(/(\s{2,})/g, ' ')        // Remove extra whitespace
      .trim();
  };
  
  /**
   * Habla un texto utilizando la síntesis de voz
   */
  const speak = async (text: string): Promise<void> => {
    // Detener cualquier síntesis de voz en curso
    stop();
    
    if (!text) return;
    
    setIsSpeaking(true);
    const cleanMessage = cleanTextForSpeech(text);
    
    try {
      // Determinar si usar Google TTS (premium) o la API del navegador
      const useGoogleTTS = activeChatConfig.audio.textToSpeech === 'Google TTS';
      
      if (useGoogleTTS) {
        try {
          setIsPremiumVoice(true);
          
          // Seleccionar voz basada en la configuración
          let voiceProfile = 'en-US-Neural2-F';
          
          if (activeChatConfig.audio.voice === 'elegant-female-concierge') {
            voiceProfile = 'en-US-Neural2-F';
          } else if (activeChatConfig.audio.voice === 'adventurous-guide') {
            voiceProfile = 'en-US-Neural2-D';
          } else if (activeChatConfig.audio.voice === 'knowledgeable-cultural-expert') {
            voiceProfile = 'en-US-Neural2-C';
          } else if (activeChatConfig.audio.voice === 'friendly-latino-companion') {
            voiceProfile = 'es-US-Neural2-A';
          }
          
          // Obtener idioma basado en la configuración
          let languageCode = 'en-US';
          const firstLanguage = activeChatConfig.languageSupport[0];
          
          if (firstLanguage === 'Español') {
            languageCode = 'es-ES';
          } else if (firstLanguage === 'Français') {
            languageCode = 'fr-FR';
          } else if (firstLanguage === 'Português') {
            languageCode = 'pt-BR';
          } else if (firstLanguage === 'Italiano') {
            languageCode = 'it-IT';
          } else if (firstLanguage === 'Deutsch') {
            languageCode = 'de-DE';
          }
          
          // Llamar a la API de Google TTS
          const audioUrl = await googleCloud.tts.synthesize(
            cleanMessage, 
            {
              language: languageCode,
              voice: voiceProfile,
              pitch: 0,
              speakingRate: 1.0
            }
          );
          
          if (audioUrl) {
            // Reproducir el audio
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            audio.volume = volume;
            
            audio.onended = () => {
              setIsSpeaking(false);
              audioRef.current = null;
            };
            
            audio.onerror = () => {
              console.error('Error playing audio');
              setIsSpeaking(false);
              audioRef.current = null;
              // Fallback a la API del navegador
              useBrowserTTS(cleanMessage);
            };
            
            await audio.play();
            return;
          } else {
            throw new Error('No audio URL returned');
          }
        } catch (error) {
          console.error('Google TTS failed, falling back to browser TTS:', error);
          setIsPremiumVoice(false);
          // Fallback a la API del navegador
          useBrowserTTS(cleanMessage);
        }
      } else {
        setIsPremiumVoice(false);
        // Usar la API del navegador
        useBrowserTTS(cleanMessage);
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
    }
  };
  
  /**
   * Utiliza la API de síntesis de voz del navegador
   */
  const useBrowserTTS = (text: string): void => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported in this browser');
      setIsSpeaking(false);
      return;
    }
    
    // Cancelar cualquier síntesis activa
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configurar volumen
    utterance.volume = volume;
    
    // Configurar velocidad y tono para voz natural
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Configurar idioma
    let lang = 'en-US';
    const firstLanguage = activeChatConfig.languageSupport[0];
    
    if (firstLanguage === 'Español') {
      lang = 'es-ES';
    } else if (firstLanguage === 'Français') {
      lang = 'fr-FR';
    } else if (firstLanguage === 'Português') {
      lang = 'pt-BR';
    } else if (firstLanguage === 'Italiano') {
      lang = 'it-IT';
    } else if (firstLanguage === 'Deutsch') {
      lang = 'de-DE';
    }
    
    utterance.lang = lang;
    
    // Buscar una voz de calidad
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Seleccionar voz preferida basada en configuración
      let voicePreference = 'female';
      
      if (activeChatConfig.audio.voice === 'elegant-female-concierge') {
        voicePreference = 'female';
      } else if (activeChatConfig.audio.voice === 'adventurous-guide') {
        voicePreference = 'male';
      } else if (activeChatConfig.audio.voice === 'knowledgeable-cultural-expert') {
        voicePreference = 'male';
      } else if (activeChatConfig.audio.voice === 'friendly-latino-companion') {
        voicePreference = 'female';
      }
      
      // Buscar voces que coincidan con el idioma y género
      const matchingVoices = voices.filter(voice => 
        voice.lang.startsWith(lang.split('-')[0]) && 
        (voicePreference === 'female' ? 
          voice.name.includes('Female') || voice.name.includes('Samantha') : 
          voice.name.includes('Male') || voice.name.includes('Daniel'))
      );
      
      if (matchingVoices.length > 0) {
        // Priorizar voces "natural" o "neural"
        const premiumVoice = matchingVoices.find(v => 
          v.name.includes('Natural') || 
          v.name.includes('Neural') || 
          v.name.includes('Enhanced') ||
          v.name.includes('Premium')
        );
        
        utterance.voice = premiumVoice || matchingVoices[0];
      }
    };
    
    // Manejar eventos de síntesis
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    // Iniciar síntesis
    window.speechSynthesis.speak(utterance);
  };
  
  /**
   * Detiene la síntesis de voz
   */
  const stop = (): void => {
    // Detener audio de Google TTS
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Detener síntesis del navegador
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
  };
  
  /**
   * Actualiza el volumen
   */
  const updateVolume = (newVolume: number): void => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    // Actualizar volumen de audio en curso
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    if (utteranceRef.current) {
      utteranceRef.current.volume = clampedVolume;
    }
  };
  
  return {
    speak,
    stop,
    isPremiumVoice,
    isSpeaking,
    setVolume: updateVolume,
    volume
  };
}