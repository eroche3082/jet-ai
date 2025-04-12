import { useState, useEffect, useRef, MouseEvent } from 'react';
import { ChatMessage, sendChatMessage, ChatResponse, useAssistantPersonalities, AssistantPersonality } from '@/lib/ai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import { 
  Infinity, AlertCircle, CreditCard, Mic, Volume2, Volume, VolumeX, 
  Globe, Lightbulb, Image, Calendar, Coffee, User, UserCheck,
  Settings, Sparkles, Camera, PanelRightOpen, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import googleCloud from '@/lib/googlecloud';
import { 
  ConversationStage, 
  STAGE_QUESTIONS, 
  UserProfile,
  isGreeting,
  createUserMessage,
  createAssistantMessage,
  createInitialSystemMessage,
  processMessage,
  requestItinerary,
  detectLanguage,
  extractCommand,
  executeCommand
} from '@/lib/conversationFlow';
import { activeChatConfig } from '@/lib/chatConfig';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import useTextToSpeech from '@/hooks/useTextToSpeech';
import { initializeJetAI, getJetAIState, JetAIState, isJetAIInitialized } from '@/lib/jetAI';

// SpeechRecognition types for TypeScript
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

// Extended ChatMessage type to include system messages
interface ExtendedChatMessage extends Omit<ChatMessage, 'role'> {
  role: 'user' | 'assistant' | 'system';
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MembershipData {
  id: number;
  membershipTier: 'basic' | 'freemium' | 'premium';
  aiCreditsRemaining: number;
}

// Enhanced welcome message with emoji and formatting
const WELCOME_MESSAGE = "👋 Hi there! I'm your **JetAI** travel assistant.\n\nI can help you:\n* Plan personalized trips\n* Recommend amazing destinations\n* Create detailed itineraries\n* Find accommodations and activities\n\nWhat kind of travel experience are you looking for today?";

export default function AIChat({ isOpen, onClose }: AIChatProps) {
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      role: 'assistant',
      content: WELCOME_MESSAGE
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userPreferences, setUserPreferences] = useState<Record<string, string>>({});
  
  // Conversation flow states using server-defined flow
  const [conversationStep, setConversationStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { speak, stop: stopSpeaking } = useTextToSpeech();
  const { transcript, startListening: startListeningHook, stopListening: stopListeningHook } = useSpeechRecognition();
  const [currentStage, setCurrentStage] = useState<ConversationStage>(ConversationStage.GREETING);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    currentStage: ConversationStage.GREETING,
    conversationHistory: []
  });
  
  // Personality selection state
  const [selectedPersonality, setSelectedPersonality] = useState<string>('concierge');
  const { data: personalities, isLoading: isLoadingPersonalities } = useAssistantPersonalities();
  
  // Speech and audio related states
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.7);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Multi-language and sentiment analysis states
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [detectedEmotions, setDetectedEmotions] = useState<{
    score: number;
    magnitude: number;
    emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused';
  }>({ score: 0, magnitude: 0, emotion: 'neutral' });
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('en-US-Wavenet-F');
  const [imageUploaded, setImageUploaded] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch membership data for credit information
  const { data: membership, isLoading: isMembershipLoading } = useQuery({
    queryKey: ['/api/user/membership'],
    retry: false,
    staleTime: 60000,
    enabled: true,
    // Don't fail if user isn't authenticated yet
    throwOnError: false,
  });
  
  // Mutation for decrementing credits after successful AI response
  const decrementCredit = useMutation({
    mutationFn: async () => {
      // This is handled on the server side in the chat API
      // This is just for refreshing membership data after a chat
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/membership'] });
    }
  });
  
  // Get membership information
  const membershipData = membership as MembershipData | undefined;
  const isPremium = membershipData?.membershipTier === 'premium';
  const creditsRemaining = membershipData?.aiCreditsRemaining || 0;
  const hasCredits = isPremium || creditsRemaining > 0;

  // Enhanced quick actions with emojis
  const quickActions = [
    '✈️ Plan a trip',
    '🌍 Find destinations',
    '✨ Travel inspiration'
  ];

  // Initialize JetAI system
  useEffect(() => {
    // Only initialize once
    if (!isJetAIInitialized()) {
      console.log("Initializing JetAI Concierge...");
      
      // Initialize with full luxury configuration
      initializeJetAI({
        assistantProfile: {
          name: "JetAI",
          role: "Luxury Travel Concierge",
          avatar: "🛩️",
          languages: ["en", "es", "fr", "pt", "it", "de"],
          tone: "elegant, efficient, empathetic",
          personality: "A luxury AI concierge with a deep knowledge of world travel, emotional intelligence, and real-time planning abilities. Speaks in clear, elegant language. Reacts to user mood. Calms, recommends, surprises. Think: a fusion between a personal butler, a nomad expert, and a travel therapist.",
          greeting: {
            enabled: true,
            message: "🌍 Welcome aboard JetAI — your personal travel concierge. What's your name and email to begin crafting your perfect journey?"
          },
          fallbackStyle: "graceful & informative",
        },

        conversationFlow: {
          mode: "one-question-at-a-time",
          sequence: [
            "What's your name?",
            "Can I get your email to send confirmations?",
            "Where would you like to go?",
            "What's your travel budget? (Luxury, Mid-range, Budget)",
            "When are you planning to go?",
            "Who are you traveling with? (Solo, Couple, Family, Friends)",
            "What kind of experiences do you enjoy? (Beach, Culture, Adventure, Food, Nature)",
          ],
          sentimentDetection: true,
          memoryEnabled: true,
          voiceEnabled: true,
          autoGenerateItinerary: true,
          errorHandling: "explain + fallback",
          multilingualSupport: true,
        },

        integrations: {
          flights: "Amadeus | Skyscanner | fallback mock",
          hotels: "Booking.com | Expedia | fallback mock",
          weather: "Google Weather | OpenMeteo fallback",
          geocoding: "Google Maps | Nominatim fallback",
          routing: "Google Routes | OSRM fallback",
          voice: "Google STT / TTS | ElevenLabs",
          translations: "Google Translate",
          recommendations: "Custom ML + Gemini",
          emotionalSupport: "Gemini + Spotify + YouTube",
          payments: "Stripe",
          storage: "Firebase",
          avatars: "DALL·E | Ready Player Me",
          media: "Pixabay | Unsplash | Pexels",
        },

        systemModules: {
          aiMemory: true,
          zenMode: true,
          travelWallet: true,
          itineraryEngine: true,
          bookingFlow: true,
          exploreFeed: true,
          QRScanner: true,
          offlineTips: true,
          emergencyAlerts: true,
          travelGamification: true,
          multilingualPrompts: true,
          avatarPanel: true,
        },

        UIOptions: {
          avatarOnLeft: true,
          fullScreenChat: true,
          tabSyncEnabled: true,
          emotionalFeedback: true,
          showStatusBadges: true,
          allowUserToAdjustFlow: true,
          floatingButtonEnabled: true,
          mobileFirstLayout: true,
          PWA: true,
          darkMode: "auto",
        },

        developerMode: {
          logAPIs: true,
          recordFallbacks: true,
          debugPromptFlow: false,
          endpointStatusCheck: "/api/system/status",
          notifyIfOffline: true,
          metrics: {
            enabled: true,
            trackAPIs: true,
            conversations: true,
            languagesUsed: true,
          },
        }
      });
      
      // Update personality from JetAI config
      const jetAIState = getJetAIState();
      if (jetAIState.personality) {
        setSelectedPersonality(jetAIState.personality);
      }
      
      // Update initial welcome message
      if (jetAIState.startMessage) {
        setMessages([{
          role: 'assistant',
          content: jetAIState.startMessage
        }]);
      }
      
      // Update audio settings
      setAudioEnabled(jetAIState.voiceAutoplay);
    }
  }, []);
  
  // Load available voice options from Google TTS
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voicesData = await googleCloud.tts.getVoices();
        // Manejo seguro de datos de voces según la estructura devuelta por la API
        let voicesArray: any[] = [];
        
        if (voicesData) {
          if (Array.isArray(voicesData)) {
            voicesArray = voicesData;
          } else if (typeof voicesData === 'object') {
            // Si no es un array pero tiene una propiedad 'voices' que es un array, úsalo
            if ('voices' in voicesData && Array.isArray(voicesData.voices)) {
              voicesArray = voicesData.voices;
            } else {
              // Si es un objeto pero no tiene la estructura esperada, intentamos extraer valores
              const possibleVoices = Object.values(voicesData).find(v => Array.isArray(v));
              if (possibleVoices) {
                voicesArray = possibleVoices;
              }
            }
          }
        }
        
        setAvailableVoices(voicesArray);
      } catch (error) {
        console.error("Error loading TTS voices:", error);
      }
    };

    if (isPremium || membershipData?.membershipTier === 'freemium') {
      loadVoices();
    }
  }, [membershipData]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom();
    
    // Load user preferences from localStorage if available
    const savedPreferences = localStorage.getItem('userTravelPreferences');
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error('Error loading saved preferences:', e);
      }
    }
    
    // Handle text-to-speech for new AI responses
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant' && audioEnabled) {
      const lastMessage = messages[messages.length - 1];
      speakMessage(lastMessage.content);
    }
  }, [isOpen, messages, audioEnabled]);
  
  // Detect language and analyze sentiment of new user messages
  useEffect(() => {
    const analyzeLatestUserMessage = async () => {
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        const lastMessage = messages[messages.length - 1].content;
        
        try {
          // Detect language for better voice synthesis and multilingual support
          const languageResult = await googleCloud.translate.detectLanguage(lastMessage);
          if (languageResult && typeof languageResult === 'object' && 'language' in languageResult) {
            // Map detected language code to voice language code (e.g., 'en' to 'en-US')
            const languageMapping: Record<string, string> = {
              'en': 'en-US',
              'es': 'es-ES',
              'fr': 'fr-FR',
              'de': 'de-DE',
              'it': 'it-IT',
              'pt': 'pt-BR',
              'ja': 'ja-JP',
              'zh': 'zh-CN',
              'ru': 'ru-RU',
              'ar': 'ar-XA',
              'hi': 'hi-IN'
            };
            
            const langCode = String(languageResult.language || 'en');
            const detectedLanguage = langCode.split('-')[0];
            const voiceLanguage = languageMapping[detectedLanguage] || 'en-US';
            
            if (currentLanguage !== voiceLanguage) {
              setCurrentLanguage(voiceLanguage);
              
              // Update voice selection based on language
              if (availableVoices.length > 0) {
                const languageVoices = availableVoices.filter(v => 
                  v.languageCodes && v.languageCodes.includes(voiceLanguage)
                );
                
                if (languageVoices.length > 0) {
                  // Prefer female voices with WaveNet or Neural2 quality
                  const bestVoice = languageVoices.find(v => 
                    (v.name.includes('WaveNet') || v.name.includes('Neural2')) && 
                    v.ssmlGender === 'FEMALE'
                  ) || languageVoices[0];
                  
                  setSelectedVoice(bestVoice.name);
                }
              }
            }
          }
          
          // Analyze sentiment for emotion-adjusted responses
          const sentimentResult = await googleCloud.naturalLanguage.analyzeSentiment(lastMessage);
          if (sentimentResult) {
            // Determine emotion from sentiment score and magnitude
            // score: -1 (negative) to 1 (positive), magnitude: 0 (neutral) to infinity (strong)
            const { score, magnitude } = sentimentResult;
            
            let emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confused' = 'neutral';
            
            if (magnitude < 0.3) {
              emotion = 'neutral';
            } else if (score > 0.5 && magnitude > 1.0) {
              emotion = 'excited';
            } else if (score > 0.2) {
              emotion = 'happy';
            } else if (score < -0.5 && magnitude > 0.8) {
              emotion = 'angry';
            } else if (score < -0.2) {
              emotion = 'sad';
            } else {
              emotion = 'confused';
            }
            
            setDetectedEmotions({ score, magnitude, emotion });
          }
        } catch (error) {
          console.error("Error analyzing message:", error);
        }
      }
    };
    
    // Only run sentiment analysis for premium users to save API credits
    if ((isPremium || membershipData?.membershipTier === 'freemium') && messages.length > 0) {
      analyzeLatestUserMessage();
    }
  }, [messages, availableVoices, currentLanguage, isPremium, membershipData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save detected preferences to localStorage
  const savePreferences = (newPreferences: Record<string, string>) => {
    const updatedPreferences = { ...userPreferences, ...newPreferences };
    setUserPreferences(updatedPreferences);
    localStorage.setItem('userTravelPreferences', JSON.stringify(updatedPreferences));
  };

  // Enhanced message sending with server-side guided conversation flow
  const handleSendMessage = async (event?: React.MouseEvent, retry = false) => {
    if ((!inputMessage.trim() && !retry) || isLoading) return;
    
    const userInput = inputMessage.trim();
    
    // Create user message
    const userMessageObj = createUserMessage(userInput);
    
    // Add to UI messages
    const userMessage: ExtendedChatMessage = { 
      role: 'user', 
      content: userInput 
    };
    
    if (!retry) {
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
    }
    
    setIsLoading(true);
    
    try {
      // Check for command (e.g. /help, /restart)
      const commandData = extractCommand(userInput);
      if (commandData) {
        const commandResponse = executeCommand(commandData.command, commandData.args);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: enhanceResponseWithEmojis(commandResponse)
        }]);
        setIsLoading(false);
        return;
      }
      
      // Check if user is greeting (like "hola", "hi")
      if (isGreeting(userInput) && userProfile.currentStage !== ConversationStage.GREETING) {
        // Reset profile to greeting stage
        const resetProfile: UserProfile = {
          ...userProfile,
          currentStage: ConversationStage.GREETING
        };
        
        setUserProfile(resetProfile);
        setCurrentStage(ConversationStage.GREETING);
        
        // Show greeting message
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: enhanceResponseWithEmojis(STAGE_QUESTIONS[ConversationStage.GREETING])
        }]);
        
        setIsLoading(false);
        return;
      }
      
      // Process message through server-side conversation flow
      try {
        const result = await processMessage(userInput, userProfile);
        
        if (result.updatedProfile) {
          // Update profile state with server response
          setUserProfile(result.updatedProfile);
          setCurrentStage(result.updatedProfile.currentStage);
          
          // Update language if detected
          if (result.updatedProfile.language) {
            setCurrentLanguage(result.updatedProfile.language);
          }
          
          // Update emotion if detected
          if (result.updatedProfile.emotion) {
            setDetectedEmotions(prev => ({ 
              ...prev, 
              emotion: result.updatedProfile.emotion || 'neutral' 
            }));
          }
        }
        
        // Reset error count on successful response
        setErrorCount(0);

        // Format the response by adding emojis based on content
        const enhancedResponse = enhanceResponseWithEmojis(result.response);
        
        // Add assistant message to UI
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: enhancedResponse 
        }]);
        
        // If in itinerary request stage and we have required info, 
        // generate itinerary
        if (result.updatedProfile.currentStage === ConversationStage.ITINERARY_REQUEST &&
            result.updatedProfile.destination && 
            result.updatedProfile.dates) {
          
          // Let the user know we're generating an itinerary
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "⏳ I'm generating your personalized itinerary, this may take a moment..."
          }]);
          
          try {
            const itinerary = await requestItinerary(result.updatedProfile);
            
            // Add the itinerary to messages
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: itinerary
            }]);
          } catch (error) {
            console.error("Error generating itinerary:", error);
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: "I apologize, but I'm having trouble generating your itinerary right now. Let's continue our conversation and try again later."
            }]);
          }
        }
        
        // Extract and save any preferences mentioned in the user's message
        extractPreferences(userInput);
        
      } catch (error) {
        console.error("Process message error:", error);
        throw error;
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorCount(prev => prev + 1);
      
      // Different error messages based on error count
      let errorMessage = "I'm sorry, I'm having trouble processing your request right now.";
      
      if (errorCount >= 2) {
        errorMessage = "I seem to be having persistent trouble connecting. Please check your internet connection or try again later.";
      } else if (errorCount === 1) {
        errorMessage = "I apologize for the difficulty. Let me try a simpler approach. Could you rephrase your question?";
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
      
      // Provide appropriate suggestions based on error
      setSuggestions([
        "Ask a different question",
        "Try again later",
        "Use simpler language"
      ]);
      
    } finally {
      setIsLoading(false);
      
      // Scroll to the bottom after updating messages
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  // Detect emojis and add them to responses based on content themes
  const enhanceResponseWithEmojis = (text: string): string => {
    // Only add emojis if the text doesn't already have them
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/;
    if (emojiRegex.test(text)) {
      return text;
    }
    
    // Add relevant emojis based on content
    if (/beach|ocean|sea|sand|swim/i.test(text)) {
      text = `🏖️ ${text}`;
    } else if (/mountain|hiking|trek|climb/i.test(text)) {
      text = `⛰️ ${text}`;
    } else if (/food|restaurant|cuisine|eat|dining/i.test(text)) {
      text = `🍽️ ${text}`;
    } else if (/hotel|stay|accommodation|resort/i.test(text)) {
      text = `🏨 ${text}`;
    } else if (/flight|airport|plane/i.test(text)) {
      text = `✈️ ${text}`;
    } else if (/cost|price|budget|money|expensive/i.test(text)) {
      text = `💰 ${text}`;
    } else if (/itinerary|plan|schedule/i.test(text)) {
      text = `📝 ${text}`;
    } else {
      // Default travel emoji for other responses
      text = `🧳 ${text}`;
    }
    
    return text;
  };

  // Extract user preferences from messages
  const extractPreferences = (message: string) => {
    const preferences: Record<string, string> = {};
    
    // Budget preferences
    if (/budget|cheap|affordable/i.test(message)) {
      preferences.budget = 'budget';
    } else if (/luxury|expensive|high-end/i.test(message)) {
      preferences.budget = 'luxury';
    }
    
    // Environment preferences
    if (/beach|ocean|sea|island/i.test(message)) {
      preferences.environment = 'beach';
    } else if (/mountain|hiking|nature|outdoor/i.test(message)) {
      preferences.environment = 'nature';
    } else if (/city|urban|metropolitan/i.test(message)) {
      preferences.environment = 'urban';
    }
    
    // Activity preferences
    if (/adventure|exciting|thrill/i.test(message)) {
      preferences.activityType = 'adventure';
    } else if (/relax|peaceful|quiet|calm/i.test(message)) {
      preferences.activityType = 'relaxation';
    } else if (/culture|museum|history|art/i.test(message)) {
      preferences.activityType = 'cultural';
    }
    
    // Save detected preferences
    if (Object.keys(preferences).length > 0) {
      savePreferences(preferences);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    // Remove the emoji prefix if present
    const cleanAction = action.replace(/^[^\w]+ /, '');
    setInputMessage(cleanAction);
    handleSendMessage();
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };
  
  // Speech recognition implementation using chat config
  const startListening = () => {
    if (!isListening && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      try {
        // Browser compatibility
        const SpeechRecognitionAPI = window.SpeechRecognition || 
          window.webkitSpeechRecognition || 
          null;
          
        if (!SpeechRecognitionAPI) {
          console.error('Speech recognition not supported in this browser');
          return;
        }
        
        recognitionRef.current = new SpeechRecognitionAPI();
        
        // Use configuration from chatConfig
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        // Use detected language or default to currentLanguage
        recognitionRef.current.lang = currentLanguage;
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          // Auto-send after speech recognition completes
          setTimeout(() => {
            handleSendMessage();
          }, 500);
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
        console.error('Speech recognition not supported:', error);
        setIsListening(false);
      }
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  // Enhanced Text-to-speech using Chat Config settings
  const speakMessage = async (message: string) => {
    // Only speak if audio is enabled or if we should enable voice based on config
    if (!audioEnabled) {
      if (activeChatConfig.behavior.voiceReplyIfVoiceEnabled) {
        setAudioEnabled(true);
      } else {
        return; // Skip if audio not enabled and config doesn't want auto-enable
      }
    }
    
    try {
      // Clean the message content (remove markdown, emojis, etc.)
      const cleanMessage = message
        .replace(/[*_#~`]/g, '')         // Remove markdown
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image links
        .replace(/\[.*?\]\(.*?\)/g, '$1') // Replace links with just the text
        .trim();
      
      // Use Google Cloud TTS if available (per chat config settings)
      const isPremiumUser = isPremium || membershipData?.membershipTier === 'freemium';
      const useGoogleTTS = activeChatConfig.audio.textToSpeech === 'Google TTS' && isPremiumUser;
      
      if (useGoogleTTS) {
        try {
          // Map voice profile from config to actual voice
          let voiceProfile = selectedVoice;
          if (activeChatConfig.audio.voice === 'elegant-female-concierge') {
            // Use a more elegant, professional female voice
            const langPrefix = currentLanguage.split('-')[0];
            voiceProfile = `${langPrefix === 'en' ? 'en-US' : currentLanguage}-Wavenet-F`;
          }
          
          // Use Google Cloud TTS for premium quality
          const audioUrl = await googleCloud.tts.synthesize(
            cleanMessage, 
            {
              language: currentLanguage,
              voice: voiceProfile,
              // Adjust pitch and rate based on emotion for more natural speech
              pitch: detectedEmotions.emotion === 'excited' ? 0.2 : 
                    detectedEmotions.emotion === 'sad' ? -0.2 : 0,
              speakingRate: detectedEmotions.emotion === 'excited' ? 1.1 : 
                           detectedEmotions.emotion === 'sad' ? 0.9 : 1.0
            }
          );
          
          // Play the audio
          const audio = new Audio(audioUrl);
          audio.volume = audioVolume;
          audio.play();
          return;
        } catch (error) {
          console.error('Error with Google Cloud TTS, falling back to browser TTS:', error);
          // Fall back to browser TTS if Google Cloud TTS fails
        }
      }
      
      // Fallback to browser TTS
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(cleanMessage);
        utterance.volume = audioVolume;
        utterance.rate = detectedEmotions.emotion === 'excited' ? 1.1 : 
                        detectedEmotions.emotion === 'sad' ? 0.9 : 1.0;
        utterance.pitch = detectedEmotions.emotion === 'excited' ? 1.2 : 
                         detectedEmotions.emotion === 'sad' ? 0.8 : 1.0;
        utterance.lang = currentLanguage;
        
        // Try to find a more natural voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Samantha') || 
          voice.name.includes('Female') || 
          voice.name.includes('Google')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        setSpeechSynthesis(utterance);
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };
  
  const cancelSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };
  
  const toggleAudioEnabled = () => {
    if (audioEnabled) {
      cancelSpeech();
    }
    setAudioEnabled(!audioEnabled);
  };
  
  const adjustVolume = (newVolume: number) => {
    setAudioVolume(newVolume);
    if (speechSynthesis && window.speechSynthesis) {
      speechSynthesis.volume = newVolume;
    }
  };
  
  // Handle image upload and analysis
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !isPremium) {
      return;
    }
    
    const file = event.target.files[0];
    const reader = new FileReader();
    
    setIsLoading(true);
    setInputMessage("Analyzing this travel image...");
    
    reader.onloadend = async () => {
      try {
        const base64Image = (reader.result as string).split(',')[1];
        
        // Add the image to messages
        setMessages(prev => [...prev, { 
          role: 'user', 
          content: `<Uploaded a travel image for analysis>` 
        }]);
        
        // Save image URL to state
        setImageUploaded(reader.result as string);
        
        // Analyze the image with Vision API
        const analysisResult = await googleCloud.vision.analyzeImage(base64Image);
        
        if (analysisResult) {
          // Check for landmarks
          const landmarkResult = await googleCloud.vision.detectLandmarks(base64Image);
          
          // Create a rich response based on the image analysis
          let analysisMessage = '';
          
          if (landmarkResult && landmarkResult.landmarks && landmarkResult.landmarks.length > 0) {
            const landmark = landmarkResult.landmarks[0];
            // Location puede venir como un objeto locations, por lo que adaptamos el código
            const locationText = typeof landmark.locations === 'object' && landmark.locations && landmark.locations.length > 0 
              ? landmark.locations[0].toString() 
              : 'a beautiful location';
            analysisMessage = `I can see that you've shared an image of ${landmark.name}! This is located in ${locationText}. \n\nWould you like me to tell you more about this destination or help you plan a trip there?`;
          } else if (analysisResult.labels && analysisResult.labels.length > 0) {
            // Extract travel-relevant labels
            const travelLabels = analysisResult.labels.filter(label => {
              // Asegurémonos de que label y su propiedad description sea válida
              if (!label || typeof label !== 'object') return false;
              
              const description = typeof label.description === 'string' 
                ? label.description.toLowerCase() 
                : '';
                
              return ['beach', 'mountain', 'landscape', 'architecture', 'city', 'building', 'resort', 'hotel', 
               'restaurant', 'food', 'museum', 'adventure', 'nature', 'ocean', 'lake', 'river', 
               'forest', 'park', 'hiking', 'camping', 'road trip', 'vacation'].some(keyword => 
                 description.includes(keyword)
               );
            });
            
            if (travelLabels.length > 0) {
              // Extraer y formatear las etiquetas principales
              const topLabels = travelLabels.slice(0, 3)
                .map(l => {
                  if (!l) return 'travel destination';
                  if (typeof l === 'string') return l;
                  return typeof l.description === 'string' ? l.description : 'destination';
                })
                .join(', ');
              analysisMessage = `I see that you've shared a travel image featuring ${topLabels}! This looks like a beautiful destination. \n\nWould you like me to suggest similar places to visit or help you plan a trip to a place like this?`;
            } else {
              analysisMessage = "Thanks for sharing this image! While I can see it, I'm not detecting specific travel landmarks. \n\nIs there a particular destination or type of travel you're interested in exploring?";
            }
          } else {
            analysisMessage = "Thanks for sharing this image! I can see it, but I don't have specific details about the location. \n\nCan you tell me more about where this is or what type of travel experience you're looking for?";
          }
          
          // Add the analysis as an assistant message
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: analysisMessage 
          }]);
          
          // Clear the input field
          setInputMessage('');
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm sorry, but I couldn't analyze this image. Could you try uploading a different image or just tell me what destination you're interested in?" 
        }]);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I had trouble reading that image. Could you try uploading a different one or just describe the destination you're interested in?" 
      }]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div 
      className={`chat-window bg-white rounded-2xl shadow-xl overflow-hidden mb-4 fixed z-50 
        ${isOpen ? 'open' : 'hidden'} 
        transition-all duration-300 ease-in-out
        ${window.innerWidth < 640 
          ? 'inset-0 m-0 max-h-[100vh] rounded-none' // Mobile: full screen
          : 'bottom-6 right-6 w-96 max-h-[500px]'    // Desktop: floating window
        }`}
    >
      {/* Chat Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div className="ml-3">
              <h3 className="font-accent font-semibold">JetAI Assistant</h3>
              <p className="text-xs text-white/80">Your personal travel planner</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white"
            aria-label="Close chat"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Personality Selector */}
        {!isLoadingPersonalities && personalities && personalities.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="bg-white/10 hover:bg-white/20 text-white text-xs py-1 h-auto w-full justify-between"
                >
                  <div className="flex items-center">
                    <UserCheck className="w-4 h-4 mr-2" />
                    {personalities && personalities.find(p => p.id === selectedPersonality)?.name || 'Assistant Personality'}
                  </div>
                  <i className="fas fa-chevron-down text-xs"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
                {personalities && personalities.map((personality) => (
                  <DropdownMenuItem 
                    key={personality.id}
                    onClick={() => setSelectedPersonality(personality.id)}
                    className={`cursor-pointer hover:bg-gray-100 ${
                      personality.id === selectedPersonality ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex flex-col py-1">
                      <span className="font-semibold">{personality.name}</span>
                      <span className="text-xs text-gray-500">{personality.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      {/* Chat Messages */}
      <div className={`p-4 overflow-y-auto custom-scrollbar ${
        window.innerWidth < 640 
          ? 'h-[calc(100vh-160px)]' // Mobile: full height minus header and input
          : 'h-96'                  // Desktop: fixed height
      }`}>
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                <i className="fas fa-robot text-primary text-sm"></i>
              </div>
            )}
            
            <div 
              className={`${
                message.role === 'user' 
                  ? 'bg-primary/10 rounded-lg rounded-tr-none' 
                  : 'bg-gray-100 rounded-lg rounded-tl-none'
              } p-3 max-w-[80%]`}
            >
              {message.role === 'assistant' ? (
                <div className="text-sm markdown-content">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0">
                <i className="fas fa-user text-gray-500 text-sm"></i>
              </div>
            )}
          </div>
        ))}
        
        {/* Quick Actions after first bot message */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4 ml-11">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                onClick={() => handleQuickAction(action)}
                className="bg-primary/10 hover:bg-primary/20 text-primary text-sm px-3 py-1.5 rounded-full transition"
              >
                {action}
              </button>
            ))}
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-4 flex">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
              <i className="fas fa-robot text-primary text-sm"></i>
            </div>
            <div className="bg-gray-100 rounded-lg rounded-tl-none p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Credit information */}
      {membershipData && (
        <div className="px-4 pt-2">
          {isPremium ? (
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center">
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                  <div className="flex items-center">
                    <Infinity className="w-3 h-3 mr-1" />
                    <span>Premium</span>
                  </div>
                </Badge>
              </div>
              <span className="text-amber-700">Unlimited credits</span>
            </div>
          ) : creditsRemaining > 0 ? (
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {membershipData.membershipTier === 'freemium' ? 'Freemium' : 'Basic'}
                </Badge>
              </div>
              <span className={`${creditsRemaining <= 3 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                {creditsRemaining} AI credits remaining
              </span>
            </div>
          ) : (
            <Alert variant="destructive" className="mb-2 py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Out of AI Credits</AlertTitle>
              <AlertDescription>
                <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Link href="/membership">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Tools Bar */}
      <div className="p-2 border-t border-gray-200 flex justify-center">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          <Link href="/memories">
            <Button variant="ghost" size="sm" className="rounded-full flex items-center text-xs">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Travel Memories</span>
            </Button>
          </Link>
          <Link href="/camera">
            <Button variant="ghost" size="sm" className="rounded-full flex items-center text-xs">
              <Camera className="h-4 w-4 mr-1" />
              <span>Camera</span>
            </Button>
          </Link>
          <Link href="/hotels">
            <Button variant="ghost" size="sm" className="rounded-full flex items-center text-xs">
              <Globe className="h-4 w-4 mr-1" />
              <span>Explore</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input 
            ref={inputRef}
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your travel question..." 
            className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none"
            disabled={membershipData && !hasCredits || isListening}
          />
          
          {/* Voice input button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={(membershipData && !hasCredits) || isLoading}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : (membershipData && !hasCredits) || isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 text-primary'
            }`}
            title={isListening ? "Stop recording" : "Speak your question"}
            aria-label={isListening ? "Stop recording" : "Speak your question"}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
          </button>
          
          {/* Image upload button */}
          <label 
            htmlFor="imageUpload" 
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
              (membershipData && !hasCredits) || isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-primary'
            }`}
            title="Upload a travel image for analysis"
          >
            <Image className="w-5 h-5" />
            <input
              type="file"
              id="imageUpload"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={(membershipData && !hasCredits) || isLoading}
            />
          </label>
          
          {/* Audio toggle button */}
          <button
            onClick={toggleAudioEnabled}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${
              audioEnabled 
                ? 'bg-gray-200 hover:bg-gray-300 text-primary' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
            }`}
            title={audioEnabled ? "Disable voice responses" : "Enable voice responses"}
            aria-label={audioEnabled ? "Disable voice responses" : "Enable voice responses"}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          {/* Send button */}
          <button 
            onClick={(e) => handleSendMessage(e)}
            disabled={!inputMessage.trim() || isLoading || (membershipData && !hasCredits) || isListening}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center text-white transition ${
              !inputMessage.trim() || isLoading || (membershipData && !hasCredits) || isListening
                ? 'bg-primary/50 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90'
            }`}
            title={membershipData && !hasCredits ? "You're out of AI credits" : "Send message"}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        {/* Audio progress bar */}
        {audioEnabled && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">Voice volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={audioVolume}
              onChange={(e) => adjustVolume(parseFloat(e.target.value))}
              className="flex-1 mx-3 h-1.5 appearance-none bg-gray-200 rounded-lg"
            />
            <Volume className="w-4 h-4 text-gray-500" />
          </div>
        )}

        {membershipData && creditsRemaining <= 3 && creditsRemaining > 0 && (
          <div className="mt-2 text-xs text-amber-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            <span>You're running low on AI credits. <Link href="/membership" className="underline">Upgrade your plan</Link></span>
          </div>
        )}
        
        {isListening && (
          <div className="mt-2 text-xs text-blue-600 flex items-center">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
              Listening... Speak your travel question
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
