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
  Building as Hotel,
  User,
  ChevronRight,
  ChevronLeft,
  X,
  Image,
  Plane,
  CalendarDays
} from 'lucide-react';
import HotelSearchResults from './HotelSearchResults';
import FlightSearchResults from './FlightSearchResults';
import { HotelResult } from '../lib/hotels';
import { FlightResult } from '../lib/flights';
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
    { role: 'assistant', content: 'Welcome aboard JetAI! I\'ll be your personal travel concierge today. To get started, I\'d love to know — where are you dreaming of going?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Paris, France',
    'Bali, Indonesia',
    'Tokyo, Japan',
    'New York City, USA'
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
  const [avatarVisible, setAvatarVisible] = useState(true); // Controls visibility of the avatar panel
  
  // Travel memory system - stores user's trip preferences
  const [travelMemory, setTravelMemory] = useState<{
    destination: string | null;
    origin: string | null;
    budget: string | null;
    dates: {
      checkIn: string | null;
      checkOut: string | null;
    } | null;
    travelers: string | null;
    interests: string[];
    preferences: {
      flightClass?: string;
      hotelClass?: string;
      mealPreferences?: string[];
      activities?: string[];
    } | null;
    currentQuestion: 'destination' | 'budget' | 'dates' | 'travelers' | 'interests' | 'summary';
    conversationStarted: boolean;
  }>({
    destination: null,
    origin: null,
    budget: null,
    dates: null,
    travelers: null,
    interests: [],
    preferences: null,
    currentQuestion: 'destination',
    conversationStarted: false
  });
  
  // Mocked membership data - in a real app, this would come from the authenticated user
  const [membershipData, setMembershipData] = useState<MembershipData | null>({
    id: 1,
    membershipTier: 'freemium',
    aiCreditsRemaining: 10
  });
  
  // Hotel search state
  const [isHotelSearchVisible, setIsHotelSearchVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelResult | null>(null);

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

  // Check if we need to restart the conversation
  const shouldRestartConversation = (input: string): boolean => {
    // Detect restart phrases
    const restartPhrases = [
      'new trip', 'start over', 'different destination', 'new destination', 
      'another trip', 'different trip', 'restart', 'reset', 'new journey',
      'new vacation', 'plan another'
    ];
    
    // Detectar saludos comunes para NO reiniciar cuando son solo saludos
    const greetings = ['hola', 'hello', 'hi', 'hey', 'buenos días', 'buenas', 'saludos'];
    const isOnlyGreeting = input.trim().split(/\s+/).length <= 2 && 
                       greetings.some(greeting => input.toLowerCase().includes(greeting));
    
    // Si es SOLO un saludo, no reiniciamos la conversación
    if (isOnlyGreeting) {
      console.log("Detectado saludo simple, manteniendo contexto de conversación");
      return false;
    }
    
    const inputLower = input.toLowerCase();
    const shouldRestart = restartPhrases.some(phrase => inputLower.includes(phrase));
    
    if (shouldRestart) {
      console.log("Detectada frase de reinicio, reseteando conversación");
    }
    
    return shouldRestart;
  };
  
  // Reset the conversation flow to start a new trip
  const resetConversation = () => {
    setTravelMemory({
      destination: null,
      origin: null,
      budget: null,
      dates: null,
      travelers: null,
      interests: [],
      preferences: null,
      currentQuestion: 'destination',
      conversationStarted: true
    });
    
    // Clear old messages except for the welcome message
    setMessages([
      { 
        role: 'assistant', 
        content: "Welcome aboard JetAI! I'll be your personal travel concierge today. To get started, I'd love to know — where are you dreaming of going?" 
      }
    ]);
    
    // Reset suggestions
    setSuggestions([
      "Paris, France",
      "Bali, Indonesia",
      "Tokyo, Japan",
      "New York City, USA"
    ]);
  };
  
  // Process the user's response in the memory system
  const processUserResponse = (userInput: string) => {
    const input = userInput.trim().toLowerCase();
    
    // Check if we should restart the conversation
    if (shouldRestartConversation(input)) {
      resetConversation();
      return 'destination';
    }
    
    // Mark the conversation as started
    if (!travelMemory.conversationStarted) {
      setTravelMemory(prev => ({...prev, conversationStarted: true}));
    }
    
    const { currentQuestion } = travelMemory;
    
    // Update memory based on current question
    let nextQuestion: 'destination' | 'budget' | 'dates' | 'travelers' | 'interests' | 'summary' = 'budget';
    let updatedMemory = { ...travelMemory };
    
    // Check if user is trying to change a previous answer
    if (input.includes('actually') || input.includes('instead') || input.includes('change')) {
      if (input.includes('destination') || input.includes('going to') || input.includes('travel to')) {
        updatedMemory.destination = extractDestination(input);
        nextQuestion = currentQuestion; // Stay on current question after correction
      } else if (input.includes('budget') || input.includes('spend') || input.includes('cost')) {
        updatedMemory.budget = extractBudget(input);
        nextQuestion = currentQuestion; // Stay on current question after correction
      } else if (input.includes('date') || input.includes('when') || input.includes('month')) {
        updatedMemory.dates = extractDates(input);
        nextQuestion = currentQuestion; // Stay on current question after correction
      } else if (input.includes('traveler') || input.includes('people') || input.includes('family') || 
                 input.includes('alone') || input.includes('solo') || input.includes('with me')) {
        updatedMemory.travelers = extractTravelers(input);
        nextQuestion = currentQuestion; // Stay on current question after correction
      } else if (input.includes('interest') || input.includes('activities') || input.includes('like to')) {
        updatedMemory.interests = extractInterests(input);
        nextQuestion = currentQuestion; // Stay on current question after correction
      }
    } else {
      // Normal flow: process current question and determine next question
      switch (currentQuestion) {
        case 'destination':
          const extractedDestination = extractDestination(input);
          
          // Si el extractDestination devuelve vacío, podría ser un saludo
          // No cambiamos la pregunta, seguimos en 'destination'
          if (!extractedDestination || extractedDestination === '') {
            console.log("Detectado posible saludo en lugar de destino, manteniendo en 'destination'");
            nextQuestion = 'destination';
          } else {
            // Solo si tenemos un destino válido, avanzamos a la siguiente pregunta
            updatedMemory.destination = extractedDestination;
            nextQuestion = 'budget';
          }
          break;
        case 'budget':
          updatedMemory.budget = extractBudget(input);
          nextQuestion = 'dates';
          break;
        case 'dates':
          updatedMemory.dates = extractDates(input);
          nextQuestion = 'travelers';
          break;
        case 'travelers':
          updatedMemory.travelers = extractTravelers(input);
          nextQuestion = 'interests';
          break;
        case 'interests':
          updatedMemory.interests = extractInterests(input);
          nextQuestion = 'summary';
          break;
        case 'summary':
          // In summary state, we can start a new conversation or refine existing answers
          nextQuestion = 'summary'; // Stay in summary state unless explicitly changed
          break;
      }
    }
    
    // Update the memory with new data
    updatedMemory.currentQuestion = nextQuestion;
    setTravelMemory(updatedMemory);
    
    return nextQuestion;
  };
  
  // Helper functions to extract specific information from user input
  const extractDestination = (input: string): string => {
    // Primero, verificar si es un saludo común que NO debería ser interpretado como destino
    const commonGreetings = ['hi', 'hello', 'hey', 'hola', 'buenos días', 'buenas', 'saludos'];
    const lowercaseInput = input.trim().toLowerCase();
    
    // Si es solo un saludo común, no lo tratamos como destino
    if (commonGreetings.some(greeting => lowercaseInput === greeting || 
                                       lowercaseInput === `${greeting}!` || 
                                       lowercaseInput === `${greeting}.`)) {
      console.log("Detectado saludo que no debe ser interpretado como destino:", input);
      return ""; // Devolver cadena vacía para indicar que no es un destino válido
    }
    
    // Just return the input directly for simple responses
    // This will preserve the full destination name including commas
    if (input.includes(',')) {
      return input.trim();
    }
    
    // Remove common phrases that might precede the destination
    const cleanedInput = input
      .replace(/i want to go to/i, '')
      .replace(/i'm thinking about/i, '')
      .replace(/maybe/i, '')
      .replace(/i'd like to visit/i, '')
      .replace(/i plan to visit/i, '')
      .replace(/i'm traveling to/i, '')
      .replace(/i'm going to/i, '')
      .replace(/i would like to go to/i, '')
      .trim();
      
    // Si el input es solo un saludo como "hey", no debemos tratarlo como destino
    if (cleanedInput.length < 5 && commonGreetings.some(greeting => cleanedInput.toLowerCase().includes(greeting))) {
      console.log("Detectado posible saludo corto como destino:", cleanedInput);
      return ""; // Indicar que no es un destino real
    }
      
    // If it's just a destination name, return it
    if (cleanedInput.length < 30) {
      return cleanedInput.charAt(0).toUpperCase() + cleanedInput.slice(1);
    }
    
    // Use a more robust approach for longer text
    // This could be enhanced with a proper NLP service in production
    const locationMatches = cleanedInput.match(/\b[A-Z][a-z]+(?:,\s+[A-Z][a-z]+)*\b/);
    if (locationMatches && locationMatches[0]) {
      return locationMatches[0];
    }
    
    // Fallback
    return cleanedInput;
  };
  
  const extractBudget = (input: string): string => {
    if (input.includes('luxury') || input.includes('expensive') || input.includes('high-end')) {
      return 'Luxury';
    } else if (input.includes('budget') || input.includes('cheap') || input.includes('affordable')) {
      return 'Budget';
    } else if (input.includes('mid') || input.includes('moderate') || input.includes('middle')) {
      return 'Mid-range';
    }
    
    // Try to extract dollar amounts
    const amountMatch = input.match(/\$(\d+)/);
    if (amountMatch && amountMatch[1]) {
      const amount = parseInt(amountMatch[1]);
      if (amount < 1000) {
        return 'Budget';
      } else if (amount < 5000) {
        return 'Mid-range';
      } else {
        return 'Luxury';
      }
    }
    
    // Default to mid-range if we can't determine
    return 'Mid-range';
  };
  
  const extractDates = (input: string): { checkIn: string | null; checkOut: string | null; } | null => {
    // Try to identify month names
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    
    // Parse the input for dates
    let dateInfo = null;
    
    for (const month of months) {
      if (input.toLowerCase().includes(month)) {
        const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        return { 
          checkIn: formattedMonth, 
          checkOut: null 
        };
      }
    }
    
    // Try to identify seasons
    if (input.toLowerCase().includes('summer')) 
      return { checkIn: 'Summer', checkOut: null };
    if (input.toLowerCase().includes('fall') || input.toLowerCase().includes('autumn')) 
      return { checkIn: 'Fall', checkOut: null };
    if (input.toLowerCase().includes('winter')) 
      return { checkIn: 'Winter', checkOut: null };
    if (input.toLowerCase().includes('spring')) 
      return { checkIn: 'Spring', checkOut: null };
    
    // Try to identify relative timeframes
    if (input.toLowerCase().includes('next week')) 
      return { checkIn: 'Next week', checkOut: null };
    if (input.toLowerCase().includes('next month')) 
      return { checkIn: 'Next month', checkOut: null };
    if (input.toLowerCase().includes('next year')) 
      return { checkIn: 'Next year', checkOut: null };
    
    // Return a default structure if we can't parse any specific dates
    return { 
      checkIn: input, // Store the raw input as checkIn
      checkOut: null 
    };
  };
  
  const extractTravelers = (input: string): string => {
    if (input.includes('solo') || input.includes('alone') || input.includes('by myself')) {
      return 'Solo traveler';
    }
    
    if (input.includes('couple') || input.includes('with my partner') || 
        input.includes('with my spouse') || input.includes('with my girlfriend') || 
        input.includes('with my boyfriend') || input.includes('with my wife') || 
        input.includes('with my husband')) {
      return 'Couple';
    }
    
    if (input.includes('family') || input.includes('kids') || input.includes('children')) {
      return 'Family trip';
    }
    
    if (input.includes('friends') || input.includes('group')) {
      return 'Group of friends';
    }
    
    // Try to extract numbers
    const numMatch = input.match(/(\d+)/);
    if (numMatch && numMatch[1]) {
      const num = parseInt(numMatch[1]);
      return `${num} travelers`;
    }
    
    return input; // Return the whole input if we can't parse it
  };
  
  const extractInterests = (input: string): string[] => {
    const interests: string[] = [];
    
    // Common travel interests
    const interestKeywords = [
      'beach', 'sun', 'ocean', 'swimming', 
      'mountains', 'hiking', 'trekking', 'climbing', 
      'culture', 'history', 'museums', 'art', 
      'food', 'cuisine', 'dining', 'restaurants', 
      'adventure', 'sports', 'activities', 
      'relaxation', 'spa', 'wellness', 
      'shopping', 'luxury', 'photography', 
      'wildlife', 'nature', 'parks',
      'city', 'urban', 'nightlife'
    ];
    
    for (const interest of interestKeywords) {
      if (input.includes(interest)) {
        interests.push(interest);
      }
    }
    
    return interests.length > 0 ? interests : ['general travel'];
  };
  
  // Generate the next question based on the current state
  const getNextQuestion = (): string => {
    switch (travelMemory.currentQuestion) {
      case 'destination':
        return "Welcome aboard JetAI! I'll be your personal travel concierge today. To get started, I'd love to know — where are you dreaming of going?";
      case 'budget':
        return `${travelMemory.destination} is an excellent choice! To help personalize your experience, could you share your approximate budget for this trip? (Luxury, Mid-range, Budget)`;
      case 'dates':
        return `Perfect! And when are you planning to visit ${travelMemory.destination}? (Month, season, or specific dates)`;
      case 'travelers':
        return `Great timing! Will you be traveling solo, as a couple, or with family/friends?`;
      case 'interests':
        return `Wonderful! To curate the perfect ${travelMemory.destination} experience, what activities or experiences interest you most? (Beach, culture, food, adventure, etc.)`;
      case 'summary':
        return `Thank you for all the details! Here's what I have for your trip:\n\n` +
               `🌍 Destination: ${travelMemory.destination}\n` +
               `💰 Budget: ${travelMemory.budget}\n` +
               `📅 Dates: ${travelMemory.dates ? 
                  (typeof travelMemory.dates === 'string' ? 
                    travelMemory.dates : 
                    travelMemory.dates.checkIn ?
                      travelMemory.dates.checkIn + 
                      (travelMemory.dates.checkOut ? ` - ${travelMemory.dates.checkOut}` : '') :
                      'Not specified'
                  ) : 'Not specified'}\n` +
               `👥 Travelers: ${travelMemory.travelers}\n` +
               `🎯 Interests: ${travelMemory.interests.join(', ')}\n\n` +
               `Would you like me to create a personalized itinerary based on this information, or is there anything you'd like to adjust?`;
      default:
        return "What would you like to know about your upcoming trip?";
    }
  };
  
  // Enhanced message sending with error handling and memory system
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
      // Check if the message is just a greeting
      const lowercaseInput = inputMessage.trim().toLowerCase();
      const greetings = ['hola', 'hello', 'hi', 'hey', 'buenos días', 'buenas', 'saludos'];
      
      // Verificación estricta: es EXACTAMENTE un saludo o un saludo con puntuación
      const exactGreeting = greetings.some(greeting => 
        lowercaseInput === greeting || 
        lowercaseInput === `${greeting}!` || 
        lowercaseInput === `${greeting}.` ||
        lowercaseInput === `${greeting}?`);
      
      // Verificación más flexible: incluye un saludo pero es corto (2 palabras máximo)
      const hasGreeting = lowercaseInput.split(/\s+/).length <= 2 && 
                          greetings.some(greeting => lowercaseInput.includes(greeting));
      
      console.log("Verificando saludo:", {inputMessage, exactGreeting, hasGreeting});
                          
      // Si es un saludo exacto o contiene un saludo, y ya comenzó la conversación
      if ((exactGreeting || hasGreeting) && messages.length > 1) {
        console.log("Detectado saludo en mensaje:", inputMessage);
        
        // Para saludos simples cuando la conversación ya comenzó, responder con un saludo amigable
        let greetingResponse = `¡Hola de nuevo!`;
        
        if (travelMemory.destination && travelMemory.destination !== "") {
          greetingResponse += ` Seguimos trabajando en tu viaje a ${travelMemory.destination}`;
        } else {
          // Si no hay destino aún, mantener el flujo original
          greetingResponse = "¡Hola! Para comenzar tu aventura, necesito saber - ¿a dónde te gustaría viajar?";
        }
        
        greetingResponse += `. ¿En qué puedo ayudarte?`;
        
        // No procesamos el mensaje como parte del flujo, solo respondemos al saludo
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: greetingResponse
        }]);
        
        setIsLoading(false);
        return;
      }
      
      // Process the user response in the memory system (para mensajes que no son solo saludos)
      processUserResponse(inputMessage);
      
      // Generate the next AI response based on the conversational state
      let aiResponse = '';
      
      // In summary state, we can generate a more complex response using AI
      if (travelMemory.currentQuestion === 'summary' && inputMessage.toLowerCase().includes('itinerary')) {
        // This is where you would call the AI to generate an itinerary
        const contextEnhancedMessages: ChatMessage[] = [
          { 
            role: 'system', 
            content: `You are a travel concierge planning a trip to ${travelMemory.destination} for ${travelMemory.travelers} with a ${travelMemory.budget} budget in ${travelMemory.dates}. Their interests include: ${travelMemory.interests.join(', ')}.` 
          },
          ...messages
        ];
        
        const response = await sendChatMessage(
          `Create a detailed 3-day itinerary for ${travelMemory.destination}`,
          contextEnhancedMessages
        );
        
        // Format the response by adding emojis based on content
        aiResponse = enhanceResponseWithEmojis(response.message);
        
        // Set suggestions for after the itinerary
        setSuggestions([
          "Show me hotels",
          "Find flights",
          "Local experiences",
          "Adjust my itinerary"
        ]);
      } else {
        // For normal flow, just get the next question
        aiResponse = getNextQuestion();
        
        // Set appropriate suggestions based on the current question
        switch (travelMemory.currentQuestion) {
          case 'destination':
            setSuggestions([
              "Paris, France",
              "Bali, Indonesia",
              "Tokyo, Japan",
              "New York City, USA"
            ]);
            break;
          case 'budget':
            setSuggestions([
              "Luxury",
              "Mid-range",
              "Budget-friendly",
              "No specific budget"
            ]);
            break;
          case 'dates':
            setSuggestions([
              "Next month",
              "Summer",
              "Winter holidays",
              "Flexible dates"
            ]);
            break;
          case 'travelers':
            setSuggestions([
              "Solo trip",
              "Couple",
              "Family vacation",
              "Group of friends"
            ]);
            break;
          case 'interests':
            setSuggestions([
              "Beach & relaxation",
              "Culture & history",
              "Food & dining",
              "Adventure activities"
            ]);
            break;
          case 'summary':
            setSuggestions([
              "Create my itinerary",
              "Change destination",
              "Adjust dates",
              "Add more interests"
            ]);
            break;
        }
      }
      
      // Add the AI response to the messages
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse 
      }]);
      
      // Reset error count on successful response
      setErrorCount(0);
      
      // Extract and save any preferences mentioned in the user's message
      extractPreferences(inputMessage);
      
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
      case 'hotels': return <Hotel className="w-5 h-5" />;
      case 'flights': return <Plane className="w-5 h-5" />;
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
    hotels: 'Hotels',
    flights: 'Flights',
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
      {/* Left side panel with tabs/avatar */}
      <div className={`${isMobile ? 'w-full h-12 flex justify-between px-2' : 'flex flex-col'} ${
        avatarVisible ? 'w-1/4 lg:w-1/5' : 'w-16'
      } bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
        {isMobile && (
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
        )}
        
        {!isMobile && avatarVisible && (
          // Avatar Panel
          <div className="flex flex-col h-full">
            {/* Avatar Image */}
            <div className="flex justify-center my-6">
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                <svg viewBox="0 0 200 200" className="w-24 h-24 text-primary">
                  <circle cx="100" cy="70" r="40" fill="currentColor" opacity="0.7" />
                  <circle cx="100" cy="230" r="100" fill="currentColor" opacity="0.5" />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary/30 animate-pulse"></div>
              </div>
            </div>
            
            {/* AI Assistant Name & Status */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">JetAI Assistant</h3>
              <div className="flex items-center justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isListening ? 'Listening...' : isLoading ? 'Processing...' : 'Ready'}
                </span>
              </div>
            </div>
            
            {/* Assistant Personality */}
            <div className="px-4 mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Personality</h4>
              <div className="p-3 rounded-lg bg-gray-200/70 dark:bg-gray-700/60">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium capitalize">{personality}</span>
                  <span className="ml-auto text-xs text-primary">Active</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {personality === 'concierge' ? (
                    'A luxury travel expert with sophisticated recommendations and an elegant tone.'
                  ) : personality === 'guide' ? (
                    'A friendly local with insider knowledge and authentic travel tips.'
                  ) : (
                    'An enthusiastic adventurer focused on exciting and off-the-beaten-path experiences.'
                  )}
                </p>
              </div>
            </div>
            
            {/* Conversation Memory */}
            <div className="px-4 flex-1 overflow-y-auto hide-scrollbar">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trip Memory</h4>
              <div className="space-y-3">
                {travelMemory.destination && (
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Destination</span>
                    <p className="text-sm font-medium">{travelMemory.destination}</p>
                  </div>
                )}
                
                {travelMemory.budget && (
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Budget</span>
                    <p className="text-sm font-medium">{travelMemory.budget}</p>
                  </div>
                )}
                
                {travelMemory.dates && (
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Travel Dates</span>
                    <p className="text-sm font-medium">
                      {typeof travelMemory.dates === 'string' ? 
                        travelMemory.dates : 
                        travelMemory.dates.checkIn && travelMemory.dates.checkOut ? 
                          `${travelMemory.dates.checkIn} - ${travelMemory.dates.checkOut}` : 
                          'Dates not specified'}
                    </p>
                  </div>
                )}
                
                {travelMemory.travelers && (
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Travelers</span>
                    <p className="text-sm font-medium">{travelMemory.travelers}</p>
                  </div>
                )}
                
                {travelMemory.interests.length > 0 && (
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Interests</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {travelMemory.interests.map((interest, i) => (
                        <span key={i} className="text-xs py-1 px-2 bg-primary/10 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Hide Avatar button */}
            <div className="mt-auto mb-4 px-4">
              <button
                onClick={() => setAvatarVisible(false)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span>Hide Avatar</span>
              </button>
            </div>
          </div>
        )}
        
        {!isMobile && !avatarVisible && (
          // Desktop side navigation
          <div className="flex flex-col items-center space-y-6 pt-6">
            {/* Show Avatar Panel Button */}
            <button
              onClick={() => setAvatarVisible(true)}
              className="p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Show Avatar Panel"
            >
              <User className="w-5 h-5" />
            </button>
          
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
          
          {activeTab === 'flights' && (
            <div className="h-full flex flex-col p-4">
              <FlightSearchResults 
                origin={travelMemory.origin || null}
                destination={travelMemory.destination}
                departureDate={travelMemory.dates?.checkIn || null}
                returnDate={travelMemory.dates?.checkOut || null}
                travelers={travelMemory.travelers}
                cabinClass={travelMemory.preferences?.flightClass || "economy"}
                onBookFlight={(flight) => {
                  console.log('Selected flight:', flight);
                  // Add booking logic here
                  setMessages(prev => [
                    ...prev,
                    {
                      role: 'assistant',
                      content: `I've selected this flight for you:\n\n**${flight.airline}** (${flight.flightNumber})\n${flight.origin} → ${flight.destination}\nDeparture: ${flight.departureTime}\nArrival: ${flight.arrivalTime}\nPrice: $${flight.price}`
                    }
                  ]);
                }}
              />
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
          
          {activeTab === 'hotels' && (
            <div className="h-full flex flex-col p-4">
              <HotelSearchResults 
                destination={travelMemory.destination}
                dates={travelMemory.dates}
                travelers={travelMemory.travelers}
                budget={travelMemory.budget}
                onBookHotel={(hotel) => {
                  setSelectedHotel(hotel);
                  // Add booking logic here
                  setMessages(prev => [
                    ...prev,
                    { 
                      role: 'user', 
                      content: `I'd like to book ${hotel.name} in ${hotel.city}` 
                    },
                    { 
                      role: 'assistant', 
                      content: `I've added ${hotel.name} to your booking list. Would you like to see more hotels or continue with the booking process?` 
                    }
                  ]);
                  setActiveTab('explore');
                }}
              />
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