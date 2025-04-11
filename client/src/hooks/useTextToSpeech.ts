/**
 * Hook para manejar la síntesis de voz
 * Proporciona funciones para convertir texto a voz usando Web Speech API
 * y Google Cloud Text-to-Speech API para voces premium.
 */

import { useState, useEffect, useCallback } from 'react';
import { activeChatConfig } from '@/lib/chatConfig';

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
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(activeChatConfig.audio.volume);
  const [isPremiumVoice, setIsPremiumVoice] = useState(activeChatConfig.audio.textToSpeech === 'Google TTS');

  useEffect(() => {
    // Configurar eventos para la síntesis de voz
    if (utterance) {
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('TTS error:', event);
        setIsSpeaking(false);
      };
      utterance.volume = volume;
    }

    return () => {
      if (utterance) {
        utterance.onstart = null;
        utterance.onend = null;
        utterance.onerror = null;
      }
    };
  }, [utterance, volume]);

  /**
   * Limpia el texto para la síntesis de voz
   */
  const cleanTextForSpeech = useCallback((text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Quitar negritas
      .replace(/\*(.*?)\*/g, '$1')     // Quitar cursivas
      .replace(/```.*?```/gs, '')      // Quitar bloques de código
      .replace(/`(.*?)`/g, '$1')       // Quitar código inline
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Quitar links
      .replace(/!\[.*?\]\(.*?\)/g, '')    // Quitar imágenes
      .replace(/#{1,6}\s+/g, '')          // Quitar encabezados
      .replace(/\n\s*[-*+]\s+/g, '. ')    // Convertir listas en oraciones
      .replace(/\n{2,}/g, '. ')           // Convertir párrafos en oraciones
      .replace(/\s{2,}/g, ' ')            // Eliminar espacios múltiples
      .replace(/[📍🏨🏖️⛰️🌳✈️🚆🚗🚢🧭🏛️🍽️🌟🎉🥾🏊🌤️☀️❄️🌧️💰📅📋📝😄😌😮💡🏺👨‍🍳🗣️👨‍👩‍👧‍👦👥🏝️🏞️🏜️☀️⛄🌷🍂]/g, '') // Quitar emojis
      .trim();
  }, []);

  /**
   * Habla un texto utilizando la síntesis de voz
   */
  const speak = useCallback(async (text: string): Promise<void> => {
    if (!text) return;
    
    // Detener cualquier síntesis de voz activa
    stop();
    
    const cleanedText = cleanTextForSpeech(text);
    
    try {
      // Verificar si usar Google TTS Premium o Web Speech API
      if (activeChatConfig.audio.textToSpeech === 'Google TTS') {
        return await speakWithGoogleTTS(cleanedText);
      } else {
        return await speakWithBrowserTTS(cleanedText);
      }
    } catch (error) {
      console.error('Error en la síntesis de voz:', error);
      // Fallback al TTS del navegador si falla Google TTS
      return await speakWithBrowserTTS(cleanedText);
    }
  }, [cleanTextForSpeech]);

  /**
   * Utiliza la API de síntesis de voz del navegador
   */
  const speakWithBrowserTTS = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        console.error('Web Speech API no está soportada en este navegador');
        reject(new Error('Web Speech API no soportada'));
        return;
      }
      
      try {
        const newUtterance = new SpeechSynthesisUtterance(text);
        newUtterance.volume = volume;
        newUtterance.rate = 1.0;
        newUtterance.pitch = 1.0;
        
        // Buscar una voz apropiada
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Preferir voces de alta calidad
          const preferredVoice = voices.find(
            voice => voice.name.includes('Google') || 
                    voice.name.includes('Premium') || 
                    voice.name.includes('Female')
          );
          
          if (preferredVoice) {
            newUtterance.voice = preferredVoice;
          }
        }
        
        // Configurar eventos
        newUtterance.onstart = () => setIsSpeaking(true);
        newUtterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        newUtterance.onerror = (event) => {
          console.error('TTS error:', event);
          setIsSpeaking(false);
          reject(event);
        };
        
        // Guardar la utterance para poder detenerla
        setUtterance(newUtterance);
        
        // Iniciar la síntesis
        window.speechSynthesis.speak(newUtterance);
        setIsPremiumVoice(false);
      } catch (error) {
        console.error('Error en Web Speech API:', error);
        reject(error);
      }
    });
  }, [volume]);

  /**
   * Utiliza Google Cloud TTS para una voz premium
   */
  const speakWithGoogleTTS = useCallback(async (text: string): Promise<void> => {
    try {
      // Llamar a nuestra API que encapsula Google Cloud TTS
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: activeChatConfig.audio.voice,
          volume
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error en Google TTS API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.audioUrl) {
        throw new Error('No se recibió URL de audio');
      }
      
      // Reproducir el audio recibido
      const audio = new Audio(data.audioUrl);
      audio.volume = volume;
      
      // Configurar eventos
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = (e) => {
        console.error('Error reproduciendo audio TTS:', e);
        setIsSpeaking(false);
      };
      
      // Reproducir
      await audio.play();
      setIsPremiumVoice(true);
      
      return new Promise((resolve) => {
        audio.onended = () => {
          setIsSpeaking(false);
          resolve();
        };
      });
    } catch (error) {
      console.error('Error en Google Cloud TTS:', error);
      // Si falla, recurrir al TTS del navegador
      return speakWithBrowserTTS(text);
    }
  }, [volume, speakWithBrowserTTS]);

  /**
   * Detiene la síntesis de voz
   */
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Detener cualquier elemento de audio en reproducción (para Google TTS)
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isPremiumVoice,
    isSpeaking,
    setVolume,
    volume
  };
}