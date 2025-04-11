/**
 * Configuración del sistema de chat JetAI
 * Este archivo define el comportamiento, integraciones y opciones del asistente
 */

export type AIModel = 'gemini-1.5-flash' | 'anthropic-claude-3' | 'openai-gpt4o';
export type Language = 'English' | 'Español' | 'Français' | 'Português' | 'Italiano' | 'Deutsch';
export type ConversationFlow = 'una-pregunta-a-la-vez' | 'open-ended';
export type SpeechEngine = 'Google STT' | 'Browser STT';
export type TextToSpeechEngine = 'Google TTS' | 'Browser TTS';
export type VoiceProfile = 'elegant-female-concierge' | 'adventurous-guide' | 'knowledgeable-cultural-expert' | 'friendly-latino-companion' | 'luxury-specialist';
export type Avatar = 'JetAI Concierge' | 'JetAI Explorer' | 'JetAI Cultural Guide' | 'JetAI Luxury Expert';
export type DataStore = 'Firestore' | 'LocalStorage' | 'IndexedDB';

export interface AudioConfig {
  speechToText: SpeechEngine;
  textToSpeech: TextToSpeechEngine;
  voice: VoiceProfile;
  languageDetection: boolean;
}

export interface VisualConfig {
  avatar: Avatar;
  videoReady: boolean;
  ARSupport: boolean;
  cameraIntegration: boolean;
}

export interface DataMemoryConfig {
  store: DataStore;
  session: DataStore;
  userPreferences: boolean;
  itineraryCache: boolean;
}

export interface ChatUXConfig {
  fullScreenMode: boolean;
  tabNavigationLinked: boolean;
  iconColorOnClick: boolean;
  markdownSupport: boolean;
  emojiRendering: boolean;
  cameraUpload: boolean;
  documentDropZone: boolean;
  liveButtonHints: string[];
  interactiveCards: boolean;
}

export interface BehaviorConfig {
  detectGreetings: boolean;
  correctMisunderstoodInputs: boolean;
  routeToTabsBasedOnContext: boolean;
  voiceReplyIfVoiceEnabled: boolean;
  fallbackToMockData: boolean;
  timezoneAware: boolean;
}

export interface ChatConfig {
  aiModel: AIModel;
  languageSupport: Language[];
  flow: ConversationFlow;
  sentimentAnalysis: boolean;
  audio: AudioConfig;
  visual: VisualConfig;
  dataMemory: DataMemoryConfig;
  integratedServices: string[];
  chatUX: ChatUXConfig;
  behavior: BehaviorConfig;
}

/**
 * Configuración predeterminada del sistema de chat
 */
export const defaultChatConfig: ChatConfig = {
  aiModel: "gemini-1.5-flash",
  languageSupport: ["English", "Español", "Français", "Português", "Italiano"],
  flow: "una-pregunta-a-la-vez",
  sentimentAnalysis: true,
  audio: {
    speechToText: "Google STT",
    textToSpeech: "Google TTS",
    voice: "elegant-female-concierge",
    languageDetection: true
  },
  visual: {
    avatar: "JetAI Concierge",
    videoReady: true,
    ARSupport: true,
    cameraIntegration: true
  },
  dataMemory: {
    store: "LocalStorage",
    session: "IndexedDB",
    userPreferences: true,
    itineraryCache: true
  },
  integratedServices: [
    "Google Translate",
    "Google Cloud Vision",
    "Google Natural Language",
    "Google Calendar",
    "Firebase Auth & Firestore",
    "Stripe Payments"
  ],
  chatUX: {
    fullScreenMode: true,
    tabNavigationLinked: true,
    iconColorOnClick: true,
    markdownSupport: true,
    emojiRendering: true,
    cameraUpload: true,
    documentDropZone: true,
    liveButtonHints: ["Book Now", "Generate QR", "Join Group", "Voice Search"],
    interactiveCards: true
  },
  behavior: {
    detectGreetings: true,
    correctMisunderstoodInputs: true,
    routeToTabsBasedOnContext: true,
    voiceReplyIfVoiceEnabled: true,
    fallbackToMockData: false, // Desactivado por defecto para cumplir política de datos
    timezoneAware: true
  }
};

/**
 * Inicializa y activa el flujo de chat con la configuración especificada
 * @param config Configuración personalizada
 * @returns El objeto de configuración activado
 */
export function activateChatFlow(config: Partial<ChatConfig> = {}): ChatConfig {
  // Combinar la configuración predeterminada con la personalizada
  const activeConfig: ChatConfig = {
    ...defaultChatConfig,
    ...config,
    audio: {
      ...defaultChatConfig.audio,
      ...(config.audio || {})
    },
    visual: {
      ...defaultChatConfig.visual,
      ...(config.visual || {})
    },
    dataMemory: {
      ...defaultChatConfig.dataMemory,
      ...(config.dataMemory || {})
    },
    chatUX: {
      ...defaultChatConfig.chatUX,
      ...(config.chatUX || {})
    },
    behavior: {
      ...defaultChatConfig.behavior,
      ...(config.behavior || {})
    }
  };

  // Comprobar que siempre está habilitada la detección de saludos si estamos en modo pregunta a la vez
  if (activeConfig.flow === 'una-pregunta-a-la-vez') {
    activeConfig.behavior.detectGreetings = true;
  }

  console.log('JetAI ChatOS inicializado con configuración:', activeConfig);
  return activeConfig;
}

// Exportar la configuración activa
export const activeChatConfig = activateChatFlow();