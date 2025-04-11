import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import { 
  AlertCircle, 
  CreditCard, 
  Mic, 
  VolumeX, 
  Volume2, 
  Volume,
  Send,
  Globe,
  Map,
  Briefcase,
  Headphones,
  Camera,
  FileText,
  QrCode,
  Glasses,
  Briefcase as Portfolio,
  Brain,
  Sun,
  Moon,
  Settings,
  User,
  ChevronRight,
  X,
  Image
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { sendChatMessage } from '../lib/ai';

// Speech recognition interface
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

// Chat interfaces
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface TravelCockpitProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MembershipData {
  id: number;
  membershipTier: 'basic' | 'freemium' | 'premium';
  aiCreditsRemaining: number;
}

// Component implementation
export default function TravelCockpit({ isOpen, onClose }: TravelCockpitProps) {
  // States
  const [activeTab, setActiveTab] = useState('explore');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Welcome to your JetAI Travel Cockpit! How can I assist with your travel plans today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Plan a trip to Italy',
    'Find hotels near the Eiffel Tower',
    'Show beach destinations under $1,000',
    'Create a QR with my itinerary'
  ]);
  const [errorCount, setErrorCount] = useState(0);
  const [userPreferences, setUserPreferences] = useState<Record<string, string>>({});
  const [darkMode, setDarkMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.8);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [aiModel, setAiModel] = useState('flash'); // 'flash' or 'pro'
  const [language, setLanguage] = useState('en'); // 'en', 'es', 'fr'
  const [personality, setPersonality] = useState('concierge'); // 'concierge', 'guide', 'adventurer'
  
  // Mocked membership data - in a real app, this would come from the authenticated user
  const [membershipData, setMembershipData] = useState<MembershipData | null>({
    id: 1,
    membershipTier: 'freemium',
    aiCreditsRemaining: 10
  });

  // Computed values
  const isPremium = membershipData?.membershipTier === 'premium';
  const creditsRemaining = membershipData?.aiCreditsRemaining || 0;
  const hasCredits = isPremium || creditsRemaining > 0;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Effects
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
    
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, messages, audioEnabled, darkMode]);

  // Utility functions
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
    
    const userMessage: ChatMessage = { 
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

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };
  
  // Speech recognition implementation
  const startListening = () => {
    if (!isListening && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      try {
        // Browser compatibility
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
          
        if (!SpeechRecognitionAPI) {
          console.error('Speech recognition not supported in this browser');
          return;
        }
        
        recognitionRef.current = new SpeechRecognitionAPI();
        
        if (recognitionRef.current) {
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR';
          
          recognitionRef.current.onstart = () => {
            setIsListening(true);
          };
          
          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInputMessage(transcript);
            // Auto-send after speech recognition completes
            setTimeout(() => {
              handleSendMessage();
            }, 500);
          };
          
          recognitionRef.current.onerror = (event: Event) => {
            console.error('Speech recognition error:', event);
            setIsListening(false);
          };
          
          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
          
          recognitionRef.current.start();
        }
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
      return;
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
      utterance.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR';
      
      // Try to find a more natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        (language === 'en' && (voice.name.includes('Samantha') || voice.name.includes('Female') || voice.name.includes('Google'))) ||
        (language === 'es' && (voice.name.includes('Monica') || voice.name.includes('Spanish') || voice.name.includes('Español'))) ||
        (language === 'fr' && (voice.name.includes('Audrey') || voice.name.includes('French') || voice.name.includes('Français')))
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

  // Get icon for each tab
  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case 'explore': return <Globe className="w-5 h-5" />;
      case 'itineraries': return <Map className="w-5 h-5" />;
      case 'planner': return <Briefcase className="w-5 h-5" />;
      case 'audio': return <Headphones className="w-5 h-5" />;
      case 'camera': return <Camera className="w-5 h-5" />;
      case 'bookings': return <FileText className="w-5 h-5" />;
      case 'qr': return <QrCode className="w-5 h-5" />;
      case 'ar': return <Glasses className="w-5 h-5" />;
      case 'portfolio': return <Portfolio className="w-5 h-5" />;
      case 'suggestions': return <Brain className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  // Tab title mapping
  const tabTitles: Record<string, string> = {
    explore: 'Explore',
    itineraries: 'Itineraries',
    planner: 'Planner',
    audio: 'Audio',
    camera: 'Camera',
    bookings: 'Bookings',
    qr: 'QR',
    ar: 'AR',
    portfolio: 'Portfolio',
    suggestions: 'Suggestions',
  };

  // Get the right CSS class for the main container based on screen size and state
  const getContainerClasses = () => {
    const baseClasses = 'travel-cockpit transition-all duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white z-50';
    
    if (!isOpen) return `${baseClasses} hidden`;
    
    if (isMobile) {
      return `${baseClasses} fixed inset-0 flex flex-col`;
    }
    
    return `${baseClasses} fixed inset-0 flex`;
  };

  return (
    <div className={getContainerClasses()}>
      {/* Left side panel with tabs */}
      <div className={`${isMobile ? 'w-full h-12 flex justify-between px-2' : 'w-16 h-full flex flex-col'} bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        {isMobile ? (
          // Mobile top navigation
          <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-2">
            {Object.keys(tabTitles).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 rounded-full ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                title={tabTitles[tab]}
              >
                {getTabIcon(tab)}
              </button>
            ))}
          </div>
        ) : (
          // Desktop side navigation
          <div className="flex flex-col items-center space-y-6 pt-6">
            {Object.keys(tabTitles).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-3 rounded-lg ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                title={tabTitles[tab]}
              >
                {getTabIcon(tab)}
              </button>
            ))}
            
            <div className="mt-auto mb-6">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={onClose}
                className="p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 mt-4"
                title="Close Cockpit"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with tab title and controls */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">{tabTitles[activeTab]}</h1>
            {activeTab === 'explore' && (
              <div className="ml-4 flex items-center space-x-2">
                <select 
                  value={aiModel} 
                  onChange={(e) => setAiModel(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                >
                  <option value="flash">Gemini Flash</option>
                  <option value="pro">Gemini Pro</option>
                </select>
                
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
                
                <select 
                  value={personality} 
                  onChange={(e) => setPersonality(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                >
                  <option value="concierge">Concierge</option>
                  <option value="guide">Local Guide</option>
                  <option value="adventurer">Adventurer</option>
                </select>
              </div>
            )}
          </div>
          
          {isMobile && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'explore' && (
            <div className="h-full flex flex-col">
              {/* Chat messages area */}
              <ScrollArea className="flex-1 p-4 pb-0">
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
                          : 'bg-gray-100 dark:bg-gray-800 rounded-lg rounded-tl-none'
                      } p-3 max-w-[80%]`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="text-sm prose prose-sm dark:prose-invert">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-3 flex-shrink-0">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Suggestion chips after responses */}
                {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                  <div className="flex flex-wrap gap-2 mb-4 ml-11">
                    {suggestions.map((suggestion, index) => (
                      <button 
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary text-sm px-3 py-1.5 rounded-full transition"
                      >
                        {suggestion}
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
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg rounded-tl-none p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {/* Membership credit info */}
              {membershipData && (
                <div className="px-4 pt-2">
                  {isPremium ? (
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-100">
                          Premium
                        </Badge>
                      </div>
                      <span className="text-amber-700 dark:text-amber-400">Unlimited credits</span>
                    </div>
                  ) : creditsRemaining > 0 ? (
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100">
                          {membershipData.membershipTier === 'freemium' ? 'Freemium' : 'Basic'}
                        </Badge>
                      </div>
                      <span className={`${creditsRemaining <= 3 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
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
              
              {/* Chat input area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your travel question..." 
                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-l-full py-3 px-4 text-sm focus:outline-none border-0"
                    disabled={membershipData && !hasCredits || isListening}
                  />
                  
                  {/* Attach image button */}
                  <button
                    disabled={(membershipData && !hasCredits) || isLoading}
                    className={`px-3 h-10 ${
                      (membershipData && !hasCredits) || isLoading 
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    title="Attach image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  
                  {/* Voice input button */}
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={(membershipData && !hasCredits) || isLoading}
                    className={`px-3 h-10 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : (membershipData && !hasCredits) || isLoading 
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    title={isListening ? "Stop recording" : "Speak your question"}
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                  </button>
                  
                  {/* Audio toggle button */}
                  <button
                    onClick={toggleAudioEnabled}
                    className={`px-3 h-10 ${
                      audioEnabled 
                        ? 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-primary' 
                        : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                    title={audioEnabled ? "Disable voice responses" : "Enable voice responses"}
                  >
                    {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  
                  {/* Send button */}
                  <button 
                    onClick={(e) => handleSendMessage(e)}
                    disabled={!inputMessage.trim() || isLoading || (membershipData && !hasCredits) || isListening}
                    className={`px-4 h-10 rounded-r-full flex items-center justify-center text-white transition ${
                      !inputMessage.trim() || isLoading || (membershipData && !hasCredits) || isListening
                        ? 'bg-primary/50 cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    title={membershipData && !hasCredits ? "You're out of AI credits" : "Send message"}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Audio volume control */}
                {audioEnabled && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Voice volume:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={audioVolume}
                      onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                      className="flex-1 mx-3 h-1.5 appearance-none bg-gray-200 dark:bg-gray-700 rounded-lg"
                    />
                    <Volume className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                
                {/* Status messages */}
                {membershipData && creditsRemaining <= 3 && creditsRemaining > 0 && (
                  <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    <span>You're running low on AI credits. <Link href="/membership" className="underline">Upgrade your plan</Link></span>
                  </div>
                )}
                
                {isListening && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
                      Listening... Speak your travel question
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'itineraries' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Your Travel Itineraries</h2>
              <p className="text-gray-500 dark:text-gray-400">Create and manage your travel plans.</p>
              <div className="mt-6 grid gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium">European Summer Tour</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">June 15 - July 10, 2025</p>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium">Weekend in NYC</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">May 5 - May 7, 2025</p>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'planner' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Trip Planner</h2>
              <p className="text-gray-500 dark:text-gray-400">Plan your next adventure.</p>
              <div className="mt-6">
                <Button size="lg" className="w-full">Start Planning New Trip</Button>
              </div>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Your Bookings</h2>
              <p className="text-gray-500 dark:text-gray-400">Manage your travel reservations.</p>
              <div className="mt-6 grid gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Hotel Belvedere</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Paris, France</p>
                      <p className="text-sm mt-2">Check-in: June 15, 2025</p>
                      <p className="text-sm">Check-out: June 20, 2025</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full h-fit">
                      Confirmed
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Air France Flight AF1234</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">New York to Paris</p>
                      <p className="text-sm mt-2">Departure: June 14, 2025, 9:45 PM</p>
                      <p className="text-sm">Arrival: June 15, 2025, 11:20 AM</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full h-fit">
                      Confirmed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {(activeTab === 'audio' || activeTab === 'camera' || activeTab === 'qr' || activeTab === 'ar' || activeTab === 'portfolio' || activeTab === 'suggestions') && (
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">{tabTitles[activeTab]} Feature</h2>
                <p className="text-gray-500 dark:text-gray-400">This feature is coming soon.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('explore')}>
                  Return to Explore
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}