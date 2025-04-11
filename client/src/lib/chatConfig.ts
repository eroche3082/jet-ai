/**
 * Configuración del sistema de chat JetAI
 */

// Interfaz para la configuración del chat
export interface ChatConfig {
  system: {
    name: string;
    description: string;
    version: string;
    goal: string;
  };
  audio: {
    textToSpeech: 'Browser API' | 'Google TTS';
    voice: 'elegant-female-concierge' | 'adventurous-guide' | 'knowledgeable-cultural-expert' | 'friendly-latino-companion' | 'luxury-specialist';
    volume: number;
    autoplay: boolean;
  };
  intelligence: {
    model: 'gemini-1.5-pro' | 'claude-3-sonnet' | 'gpt-4o';
    personality: 'concierge' | 'explorer' | 'cultural' | 'exclusivo' | 'amigo' | 'gourmet' | 'vecino';
    knowledgeCutoff: string;
    context: number;
  };
  engagement: {
    conversationFlow: 'guided' | 'natural' | 'hybrid';
    responseStyle: 'concise' | 'detailed' | 'adaptive';
    emojiUsage: 'none' | 'minimal' | 'moderate' | 'expressive';
  };
  behavior: {
    voiceReplyIfVoiceEnabled: boolean;
    continueConversationAfterItinerary: boolean;
    autoSuggestNearbyAttractions: boolean;
    rememberUserPreferences: boolean;
    detectGreetings: boolean;
  };
  languageSupport: string[];
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    fontFamily: string;
    messageStyle: 'bubble' | 'flat' | 'card';
  };
}

// Configuración por defecto
const defaultChatConfig: ChatConfig = {
  system: {
    name: "JetAI Smart Travel Assistant",
    description: "Asistente de viaje avanzado con inteligencia artificial",
    version: "1.5.0",
    goal: "Proporcionar asistencia personalizada para planificación de viajes"
  },
  audio: {
    textToSpeech: "Browser API",
    voice: "elegant-female-concierge",
    volume: 0.8,
    autoplay: false,
  },
  intelligence: {
    model: "gemini-1.5-pro",
    personality: "concierge",
    knowledgeCutoff: "Abril 2025",
    context: 10,
  },
  engagement: {
    conversationFlow: "guided",
    responseStyle: "adaptive",
    emojiUsage: "minimal",
  },
  behavior: {
    voiceReplyIfVoiceEnabled: true,
    continueConversationAfterItinerary: true,
    autoSuggestNearbyAttractions: true,
    rememberUserPreferences: true,
    detectGreetings: true,
  },
  languageSupport: [
    "es-ES", "en-US", "fr-FR", "de-DE", "it-IT", "pt-BR", "ja-JP", "ko-KR", "zh-CN"
  ],
  appearance: {
    theme: "system",
    accentColor: "#4F46E5",
    fontFamily: "Inter, sans-serif",
    messageStyle: "bubble",
  }
};

// Cargar la configuración desde localStorage o usar la configuración por defecto
function loadChatConfig(): ChatConfig {
  try {
    const savedConfig = localStorage.getItem('jetai_chat_config');
    if (savedConfig) {
      // Combinar la configuración guardada con la predeterminada para asegurar 
      // que todas las propiedades existan incluso si se añaden nuevas en futuras versiones
      return { ...defaultChatConfig, ...JSON.parse(savedConfig) };
    }
  } catch (error) {
    console.error('Error cargando la configuración del chat:', error);
  }
  
  return defaultChatConfig;
}

// Guardar la configuración actual en localStorage
export function saveChatConfig(config: Partial<ChatConfig>): void {
  try {
    // Actualizar la configuración activa
    Object.assign(activeChatConfig, config);
    
    // Guardar en localStorage
    localStorage.setItem('jetai_chat_config', JSON.stringify(activeChatConfig));
  } catch (error) {
    console.error('Error guardando la configuración del chat:', error);
  }
}

// Exportar la configuración activa
export const activeChatConfig = loadChatConfig();

// Resetear a la configuración por defecto
export function resetChatConfig(): void {
  localStorage.removeItem('jetai_chat_config');
  Object.assign(activeChatConfig, defaultChatConfig);
}