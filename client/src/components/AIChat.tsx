import { useState, useEffect, useRef, MouseEvent } from 'react';
import { ChatMessage, sendChatMessage, ChatResponse } from '@/lib/ai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import { Infinity, AlertCircle, CreditCard, Mic, Volume2, Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  
  // Speech and audio related states
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.7);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save detected preferences to localStorage
  const savePreferences = (newPreferences: Record<string, string>) => {
    const updatedPreferences = { ...userPreferences, ...newPreferences };
    setUserPreferences(updatedPreferences);
    localStorage.setItem('userTravelPreferences', JSON.stringify(updatedPreferences));
  };

  // Enhanced message sending with error handling and retry logic
  const handleSendMessage = async (event?: React.MouseEvent, retry = false) => {
    if ((!inputMessage.trim() && !retry) || isLoading) return;
    
    const userMessage: ExtendedChatMessage = { 
      role: 'user', 
      content: inputMessage 
    };
    
    if (!retry) {
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
    }
    
    setIsLoading(true);
    
    try {
      // Add user preferences to context if available
      const contextEnhancedMessages: ChatMessage[] = [...messages];
      if (Object.keys(userPreferences).length > 0 && contextEnhancedMessages.length <= 3) {
        // Only inject preferences early in the conversation to help with personalization
        const preferencesMessage: ChatMessage = {
          role: 'system',
          content: `User preferences: ${JSON.stringify(userPreferences)}`
        };
        // Add as first message without mutating original messages array
        const enhancedMessages = [preferencesMessage, ...messages.filter(m => m.role !== 'system')];
        
        const response = await sendChatMessage(
          retry ? 'Can you try again? I didn\'t understand your last response.' : inputMessage,
          enhancedMessages
        );
        
        // Reset error count on successful response
        setErrorCount(0);
        
        // Set suggestions from response
        if (response.suggestions && response.suggestions.length > 0) {
          setSuggestions(response.suggestions);
        }
        
        // Format the response by adding emojis based on content
        const enhancedResponse = enhanceResponseWithEmojis(response.message);
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: enhancedResponse 
        }]);
        
        // Extract and save any preferences mentioned in the user's message
        extractPreferences(inputMessage);
      } else {
        // Normal flow without preferences
        const response = await sendChatMessage(
          retry ? 'Can you try again? I didn\'t understand your last response.' : inputMessage,
          contextEnhancedMessages
        );
        
        // Reset error count on successful response
        setErrorCount(0);
        
        // Set suggestions from response
        if (response.suggestions && response.suggestions.length > 0) {
          setSuggestions(response.suggestions);
        }
        
        // Format the response by adding emojis based on content
        const enhancedResponse = enhanceResponseWithEmojis(response.message);
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: enhancedResponse 
        }]);
        
        // Extract and save any preferences mentioned in the user's message
        extractPreferences(inputMessage);
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
  
  // Speech recognition implementation
  const startListening = () => {
    if (!isListening && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      try {
        // Browser compatibility
        const SpeechRecognitionAPI: typeof SpeechRecognition = window.SpeechRecognition || 
          window.webkitSpeechRecognition || 
          null as unknown as typeof SpeechRecognition;
          
        if (!SpeechRecognitionAPI) {
          console.error('Speech recognition not supported in this browser');
          return;
        }
        
        recognitionRef.current = new SpeechRecognitionAPI();
        
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
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
  
  // Text-to-speech functionality
  const speakMessage = (message: string) => {
    if (!audioEnabled) {
      setAudioEnabled(true);
    }
    
    // Stop any current speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      // Clean the message content (remove markdown, emojis, etc.)
      const cleanMessage = message
        .replace(/[*_#~`]/g, '')         // Remove markdown
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image links
        .replace(/\[.*?\]\(.*?\)/g, '$1') // Replace links with just the text
        .trim();
      
      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      utterance.volume = audioVolume;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      
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
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };
  
  const toggleAudioEnabled = () => {
    if (audioEnabled) {
      stopSpeaking();
    }
    setAudioEnabled(!audioEnabled);
  };
  
  const adjustVolume = (newVolume: number) => {
    setAudioVolume(newVolume);
    if (speechSynthesis && window.speechSynthesis) {
      speechSynthesis.volume = newVolume;
    }
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
