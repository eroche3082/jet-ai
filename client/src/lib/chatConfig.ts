/**
 * Configuración del sistema de chat JetAI
 */

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
  languageSupport: string[];
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    fontFamily: string;
    messageStyle: 'bubble' | 'flat' | 'card';
  };
}

// Configuración predeterminada del chat
const defaultChatConfig: ChatConfig = {
  system: {
    name: 'JetAI Travel Concierge',
    description: 'AI-powered luxury travel assistant',
    version: '2.0.0',
    goal: 'Provide personalized travel recommendations and planning assistance through a step-by-step conversational flow'
  },
  audio: {
    textToSpeech: 'Google TTS',
    voice: 'elegant-female-concierge',
    volume: 0.8,
    autoplay: true
  },
  intelligence: {
    model: 'gemini-1.5-pro',
    personality: 'concierge',
    knowledgeCutoff: 'April 2025',
    context: 8192
  },
  engagement: {
    conversationFlow: 'hybrid',
    responseStyle: 'adaptive',
    emojiUsage: 'moderate'
  },
  languageSupport: [
    'English',
    'Español',
    'Français',
    'Deutsch',
    'Italiano',
    'Português'
  ],
  appearance: {
    theme: 'dark',
    accentColor: '#6d28d9',
    fontFamily: 'Inter, sans-serif',
    messageStyle: 'bubble'
  }
};

// Obtener configuración personalizada o usar predeterminada
function loadChatConfig(): ChatConfig {
  try {
    const savedConfig = localStorage.getItem('jetai-chat-config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      // Combinar con configuración predeterminada para asegurar estructura completa
      return { ...defaultChatConfig, ...parsedConfig };
    }
  } catch (error) {
    console.error('Error loading chat configuration:', error);
    // Si hay un error, eliminar la configuración guardada
    localStorage.removeItem('jetai-chat-config');
  }
  
  return defaultChatConfig;
}

// Guardar configuración personalizada
export function saveChatConfig(config: Partial<ChatConfig>): void {
  try {
    const currentConfig = loadChatConfig();
    const updatedConfig = { ...currentConfig, ...config };
    localStorage.setItem('jetai-chat-config', JSON.stringify(updatedConfig));
    // Actualizar la configuración activa
    Object.assign(activeChatConfig, updatedConfig);
  } catch (error) {
    console.error('Error saving chat configuration:', error);
  }
}

// Configuración activa del chat
export const activeChatConfig = loadChatConfig();

// Reiniciar a configuración predeterminada
export function resetChatConfig(): void {
  localStorage.removeItem('jetai-chat-config');
  Object.assign(activeChatConfig, defaultChatConfig);
}