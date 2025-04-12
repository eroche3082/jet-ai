/**
 * JetAI Initializer
 * Este archivo maneja la inicialización global del sistema JetAI
 * con diferentes modos y personalidades.
 */

import { AssistantPersonality } from './ai';
import { Message } from './conversationFlow';

// Type definitions
export type JetAIMode = 'concierge' | 'explorer' | 'planner' | 'advisor' | 'zen' | 'companion';
export type JetAIPersonality = 'luxury_travel_expert' | 'adventure_guide' | 'family_planner' | 'budget_expert' | 'cultural_specialist';
export type JetAILanguage = 'en' | 'es' | 'fr' | 'it' | 'de' | 'pt';

export interface JetAIFeatureVoice {
  recognition: any;
  synthesis: any;
  autoSpeakResponses: boolean;
}

export interface JetAIFeatureFallback {
  weather: string[];
  geocoding: string[];
  routing: string[];
  places: string[];
}

export interface JetAIFeatureItinerary {
  generator: any;
  autoGenerateAfterProfile: boolean;
}

export interface JetAIProfileExtraction {
  extractor: any;
  memory: boolean;
}

export interface JetAIFeatureAI {
  provider: 'VertexAI' | 'OpenAI' | 'Anthropic';
  model: string;
  chatEndpoint: string;
  stream: boolean;
  emotionalTone: boolean;
  sentimentAnalysis: boolean;
}

export interface JetAIFeatures {
  voice: JetAIFeatureVoice;
  fallback: JetAIFeatureFallback;
  itinerary: JetAIFeatureItinerary;
  apiStatus: any;
  profileExtraction: JetAIProfileExtraction;
  ai: JetAIFeatureAI;
}

export interface JetAIAvatar {
  enabled: boolean;
  panel: 'left' | 'right';
  style: string;
  memoryDisplay: boolean;
}

export interface JetAIChat {
  layout: '1-column' | '2-column';
  suggestionButtons: boolean;
  delayPerStage: number;
  colorTheme: string;
}

export interface JetAIFloatingBubble {
  enabled: boolean;
  triggersFullScreen: boolean;
}

export interface JetAIInterface {
  avatar: JetAIAvatar;
  chat: JetAIChat;
  floatingBubble: JetAIFloatingBubble;
}

export interface JetAIValidations {
  GOOGLE_APPLICATION_CREDENTIALS: 'REQUIRED' | 'OPTIONAL';
  fallbackServicesWorking: boolean;
  chatFlowConnected: boolean;
  voiceModulesLoaded: boolean;
  GeminiAPIResponding: boolean;
}

export interface GreetingOptions {
  enabled: boolean;
  message: string;
}

export interface AssistantProfileOptions {
  name: string;
  role: string;
  avatar: string;
  languages: JetAILanguage[];
  tone: string;
  personality: string;
  greeting: GreetingOptions;
  fallbackStyle: string;
}

export interface ConversationFlowOptions {
  mode: string;
  sequence: string[];
  sentimentDetection: boolean;
  memoryEnabled: boolean;
  voiceEnabled: boolean;
  autoGenerateItinerary: boolean;
  errorHandling: string;
  multilingualSupport: boolean;
}

export interface IntegrationsOptions {
  flights: string;
  hotels: string;
  weather: string;
  geocoding: string;
  routing: string;
  voice: string;
  translations: string;
  recommendations: string;
  emotionalSupport: string;
  payments: string;
  storage: string;
  avatars: string;
  media: string;
}

export interface SystemModulesOptions {
  aiMemory: boolean;
  zenMode: boolean;
  travelWallet: boolean;
  itineraryEngine: boolean;
  bookingFlow: boolean;
  exploreFeed: boolean;
  QRScanner: boolean;
  offlineTips: boolean;
  emergencyAlerts: boolean;
  travelGamification: boolean;
  multilingualPrompts: boolean;
  avatarPanel: boolean;
}

export interface UIOptions {
  avatarOnLeft: boolean;
  fullScreenChat: boolean;
  tabSyncEnabled: boolean;
  emotionalFeedback: boolean;
  showStatusBadges: boolean;
  allowUserToAdjustFlow: boolean;
  floatingButtonEnabled: boolean;
  mobileFirstLayout: boolean;
  PWA: boolean;
  darkMode: string;
}

export interface MetricsOptions {
  enabled: boolean;
  trackAPIs: boolean;
  conversations: boolean;
  languagesUsed: boolean;
}

export interface DeveloperModeOptions {
  logAPIs: boolean;
  recordFallbacks: boolean;
  debugPromptFlow: boolean;
  endpointStatusCheck: string;
  notifyIfOffline: boolean;
  metrics: MetricsOptions;
}

export interface JetAIInitializeOptions {
  assistantProfile: AssistantProfileOptions;
  conversationFlow: ConversationFlowOptions;
  integrations: IntegrationsOptions;
  systemModules: SystemModulesOptions;
  UIOptions: UIOptions;
  developerMode: DeveloperModeOptions;
}

// Load content from a file (mock implementation)
function loadFrom(path: string): any {
  // In a real implementation, this would load and parse content from a file
  console.log(`Loading content from ${path}`);
  return { path, loaded: true };
}

// Use a specific component or module
function use(path: string): any {
  // In a real implementation, this would import and return a module
  console.log(`Using module ${path}`);
  return { path, used: true };
}

// Use a React hook
function useHook(path: string): any {
  // In a real implementation, this would return the hook function
  console.log(`Using hook ${path}`);
  return { path, hooked: true };
}

// Monitor a specific endpoint
function monitor(path: string): any {
  // In a real implementation, this would set up monitoring for an endpoint
  console.log(`Monitoring ${path}`);
  return { path, monitored: true };
}

// Global state for JetAI
export interface JetAIState {
  initialized: boolean;
  mode: JetAIMode;
  personality: JetAIPersonality;
  languages: JetAILanguage[];
  currentLanguage: JetAILanguage;
  aiProvider: string;
  aiModel: string;
  startMessage: string;
  voiceEnabled: boolean;
  voiceAutoplay: boolean;
  features: Partial<JetAIFeatures>;
  interface: Partial<JetAIInterface>;
  selectedPersonality?: AssistantPersonality;
  systemMessages: Message[];
}

// Global JetAI state
let jetAIState: JetAIState = {
  initialized: false,
  mode: 'concierge',
  personality: 'luxury_travel_expert',
  languages: ['en'],
  currentLanguage: 'en',
  aiProvider: 'VertexAI',
  aiModel: 'gemini-1.5-flash',
  startMessage: '',
  voiceEnabled: true,
  voiceAutoplay: false,
  features: {},
  interface: {},
  systemMessages: []
};

// Main initialization function
export function initializeJetAI(options: JetAIInitializeOptions): JetAIState {
  console.log('Initializing JetAI with options:', options);

  // Set basic properties
  jetAIState.initialized = true;
  jetAIState.mode = 'concierge'; // Default mode
  
  // Extract personality from assistant profile
  if (options.assistantProfile && options.assistantProfile.personality) {
    jetAIState.personality = 'luxury_travel_expert' as JetAIPersonality; // Default to luxury
  }
  
  // Set languages from assistant profile
  if (options.assistantProfile && options.assistantProfile.languages) {
    jetAIState.languages = options.assistantProfile.languages;
    jetAIState.currentLanguage = options.assistantProfile.languages[0];
  }
  
  // Set welcome message from greeting
  if (options.assistantProfile && 
      options.assistantProfile.greeting && 
      options.assistantProfile.greeting.enabled) {
    jetAIState.startMessage = options.assistantProfile.greeting.message;
  } else if (options.conversationFlow && 
            options.conversationFlow.sequence && 
            options.conversationFlow.sequence.length > 0) {
    // Use first item in conversation sequence as fallback greeting
    jetAIState.startMessage = options.conversationFlow.sequence[0];
  }
  
  // Set voice settings from conversation flow
  if (options.conversationFlow) {
    jetAIState.voiceEnabled = options.conversationFlow.voiceEnabled;
    jetAIState.voiceAutoplay = options.conversationFlow.voiceEnabled; // Match autoplay with voice enabled
  }

  // Parse AI providers from integrations
  if (options.integrations) {
    // Extract AI provider from recommendations setting
    if (options.integrations.recommendations && options.integrations.recommendations.includes('Gemini')) {
      jetAIState.aiProvider = 'VertexAI';
      jetAIState.aiModel = 'gemini-1.5-flash';
    }
    
    // Process conversation flow settings
    const features: Partial<JetAIFeatures> = {
      profileExtraction: {
        extractor: null,
        memory: options.conversationFlow.memoryEnabled
      },
      ai: {
        provider: 'VertexAI',
        model: 'gemini-1.5-flash',
        chatEndpoint: '/api/chat/vertex',
        stream: true,
        emotionalTone: options.conversationFlow.sentimentDetection,
        sentimentAnalysis: options.conversationFlow.sentimentDetection
      }
    };
    
    // Parse weather services
    if (options.integrations.weather) {
      const weatherServices = options.integrations.weather.split('|').map(s => s.trim());
      features.fallback = {
        weather: weatherServices.map(s => s.replace(' fallback', '')),
        geocoding: [],
        routing: [],
        places: []
      };
    }
    
    // Parse geocoding services
    if (options.integrations.geocoding) {
      const geocodingServices = options.integrations.geocoding.split('|').map(s => s.trim());
      if (features.fallback) {
        features.fallback.geocoding = geocodingServices.map(s => s.replace(' fallback', ''));
      }
    }
    
    // Parse routing services
    if (options.integrations.routing) {
      const routingServices = options.integrations.routing.split('|').map(s => s.trim());
      if (features.fallback) {
        features.fallback.routing = routingServices.map(s => s.replace(' fallback', ''));
      }
    }
    
    // Set up voice integration based on voice setting
    if (options.integrations.voice) {
      const voiceServices = options.integrations.voice.split('|').map(s => s.trim());
      
      features.voice = {
        recognition: null, // This will be replaced with actual implementation
        synthesis: null,   // This will be replaced with actual implementation
        autoSpeakResponses: options.conversationFlow.voiceEnabled
      };
    }
    
    // Set itinerary generator if enabled
    if (options.systemModules && options.systemModules.itineraryEngine) {
      features.itinerary = {
        generator: null,
        autoGenerateAfterProfile: options.conversationFlow.autoGenerateItinerary
      };
    }
    
    jetAIState.features = features;
  }

  // Set up interface based on UI options
  if (options.UIOptions) {
    const interfaceSettings: Partial<JetAIInterface> = {
      avatar: {
        enabled: options.systemModules.avatarPanel,
        panel: options.UIOptions.avatarOnLeft ? 'left' : 'right',
        style: 'Concierge AI',
        memoryDisplay: options.UIOptions.emotionalFeedback
      },
      chat: {
        layout: options.UIOptions.fullScreenChat ? '1-column' : '2-column',
        suggestionButtons: true,
        delayPerStage: 300,
        colorTheme: 'luxury'
      },
      floatingBubble: {
        enabled: options.UIOptions.floatingButtonEnabled,
        triggersFullScreen: true
      }
    };
    
    jetAIState.interface = interfaceSettings;
  }
  
  // Create initial system message with enhanced description
  const systemContent = options.assistantProfile 
    ? `You are ${options.assistantProfile.name}, a ${options.assistantProfile.role}. ${options.assistantProfile.personality}. Your tone is ${options.assistantProfile.tone}. Start the conversation with a friendly greeting and introduce yourself.`
    : `You are JetAI in concierge mode with luxury_travel_expert personality. You are a travel assistant that helps users plan and enjoy their trips. Start the conversation with a friendly greeting and introduce yourself.`;
  
  jetAIState.systemMessages = [{
    id: 'system-1',
    role: 'system',
    content: systemContent,
    timestamp: new Date(),
  }];

  // Setup monitoring if requested in developer mode
  if (options.developerMode && options.developerMode.endpointStatusCheck) {
    console.log(`Setting up monitoring for ${options.developerMode.endpointStatusCheck}`);
    monitor(options.developerMode.endpointStatusCheck);
  }

  console.log('JetAI initialized successfully!');
  return jetAIState;
}

// Get current JetAI state
export function getJetAIState(): JetAIState {
  return jetAIState;
}

// Update JetAI state
export function updateJetAIState(updates: Partial<JetAIState>): JetAIState {
  jetAIState = { ...jetAIState, ...updates };
  return jetAIState;
}

// Check if JetAI is initialized
export function isJetAIInitialized(): boolean {
  return jetAIState.initialized;
}

// Get JetAI system messages
export function getJetAISystemMessages(): Message[] {
  return jetAIState.systemMessages;
}