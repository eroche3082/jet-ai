import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRightCircle, X, MessageSquare, Check } from 'lucide-react';
import { onboardingSteps } from '@/lib/onboardingFlow';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp?: string;
  options?: Array<{
    id: string;
    label: string;
  }>;
};

type UserData = {
  name: string;
  email: string;
  preferences: Record<string, any>;
  currentStep: number;
};

interface SimpleOnboardingChatProps {
  onClose: () => void;
  onComplete: (userData: UserData) => void;
}

export default function SimpleOnboardingChat({ onClose, onComplete }: SimpleOnboardingChatProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: "Hi there! Welcome to JET AI. I'm your travel AI Assistant. Let's personalize your experience.",
      role: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    preferences: {},
    currentStep: 0,
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleUserInput = () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process based on current question
    if (currentQuestion === 0) {
      // Name question
      setUserData(prev => ({
        ...prev,
        name: inputValue,
        currentStep: prev.currentStep + 1,
      }));
      
      // Clear input and show typing indicator
      setInputValue('');
      setIsTyping(true);
      
      // Show next question after delay
      setTimeout(() => {
        const nextQuestion: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "Great to meet you! What's your email address?",
          role: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, nextQuestion]);
        setIsTyping(false);
        setCurrentQuestion(1);
      }, 800);
      
    } else if (currentQuestion === 1) {
      // Email question - simple validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
        // Invalid email
        setTimeout(() => {
          const errorMessage: MessageType = {
            id: (Date.now() + 1).toString(),
            content: "That doesn't look like a valid email. Please try again.",
            role: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prev => [...prev, errorMessage]);
          setIsTyping(false);
          setInputValue('');
        }, 800);
        return;
      }
      
      // Valid email
      setUserData(prev => ({
        ...prev,
        email: inputValue,
        currentStep: prev.currentStep + 1,
      }));
      
      // Clear input and show typing indicator
      setInputValue('');
      setIsTyping(true);
      
      // Show travel preference question
      setTimeout(() => {
        const preferenceQuestion: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "What type of travel experiences do you prefer?",
          role: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { id: 'adventure', label: 'Adventure & Outdoors' },
            { id: 'cultural', label: 'Cultural & Historical' },
            { id: 'relaxation', label: 'Relaxation & Wellness' },
            { id: 'culinary', label: 'Culinary & Food Tours' },
            { id: 'urban', label: 'Urban Exploration' },
            { id: 'luxury', label: 'Luxury Travel' }
          ]
        };
        
        setMessages(prev => [...prev, preferenceQuestion]);
        setIsTyping(false);
        setCurrentQuestion(2);
      }, 800);
      
    } else if (currentQuestion === 2) {
      // Travel preferences
      setUserData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          travelTypes: [inputValue]
        },
        currentStep: prev.currentStep + 1,
      }));
      
      // Clear input and show typing indicator
      setInputValue('');
      setIsTyping(true);
      
      // Show budget preference question
      setTimeout(() => {
        const budgetQuestion: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "What's your typical travel budget per day?",
          role: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { id: 'budget', label: 'Budget (under $100/day)' },
            { id: 'moderate', label: 'Moderate ($100-$300/day)' },
            { id: 'premium', label: 'Premium ($300-$500/day)' },
            { id: 'luxury', label: 'Luxury (over $500/day)' }
          ]
        };
        
        setMessages(prev => [...prev, budgetQuestion]);
        setIsTyping(false);
        setCurrentQuestion(3);
      }, 800);
      
    } else if (currentQuestion === 3) {
      // Budget preferences
      setUserData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          budget: inputValue
        },
        currentStep: prev.currentStep + 1,
      }));
      
      // Clear input and show typing indicator
      setInputValue('');
      setIsTyping(true);
      
      // Show travel companions question
      setTimeout(() => {
        const companionsQuestion: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "Who do you typically travel with?",
          role: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { id: 'solo', label: 'Solo Travel' },
            { id: 'partner', label: 'With Partner' },
            { id: 'family', label: 'With Family' },
            { id: 'friends', label: 'With Friends' },
            { id: 'group', label: 'Group Tours' }
          ]
        };
        
        setMessages(prev => [...prev, companionsQuestion]);
        setIsTyping(false);
        setCurrentQuestion(4);
      }, 800);
      
    } else if (currentQuestion === 4) {
      // Travel companions preferences
      setUserData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          travelCompanions: inputValue
        },
        currentStep: prev.currentStep + 1,
      }));
      
      // Clear input and show typing indicator
      setInputValue('');
      setIsTyping(true);
      
      // Show accommodation preferences question
      setTimeout(() => {
        const accommodationQuestion: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "What types of accommodations do you prefer?",
          role: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { id: 'luxury', label: 'Luxury Hotels & Resorts' },
            { id: 'boutique', label: 'Boutique Hotels' },
            { id: 'midrange', label: 'Mid-range Hotels' },
            { id: 'vacation-rental', label: 'Vacation Rentals/Airbnb' },
            { id: 'hostel', label: 'Hostels' },
            { id: 'unique', label: 'Unique Stays (Treehouses, etc.)' }
          ]
        };
        
        setMessages(prev => [...prev, accommodationQuestion]);
        setIsTyping(false);
        setCurrentQuestion(5);
      }, 800);
      
    } else if (currentQuestion === 5) {
      // Accommodation preferences
      setUserData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          accommodation: inputValue
        },
        currentStep: prev.currentStep + 1,
      }));
      
      // Clear input and show typing indicator
      setInputValue('');
      setIsTyping(true);
      
      // Final message and completion
      setTimeout(() => {
        const thankYouMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: `Thanks for sharing that with me! I'll personalize your JET AI experience based on your preferences.`,
          role: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, thankYouMessage]);
        setIsTyping(false);
        
        // Complete onboarding after a short delay
        setTimeout(() => {
          onComplete(userData);
        }, 1500);
      }, 800);
    }
  };
  
  const handleOptionSelect = (optionId: string, optionLabel: string) => {
    // Set input value to selected option
    setInputValue(optionLabel);
    
    // Submit after a short delay
    setTimeout(() => {
      handleUserInput();
    }, 300);
  };
  
  // Close the chat
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-lg transition-all duration-300 transform overflow-hidden ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Header */}
        <div className="bg-[#050b17] text-white p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-[#050b17]" />
            </div>
            <div>
              <div className="font-medium">JET AI Onboarding</div>
              <div className="text-xs text-white/70 -mt-0.5">Personalizing your travel experience</div>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 h-[350px] overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className="mb-4"
            >
              <div className="flex items-start">
                {message.role === 'ai' && (
                  <div className="mr-2 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-medium text-sm">AI</span>
                  </div>
                )}
                <div className={`flex-1 ${message.role === 'user' ? 'pl-10' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-3 inline-block ${
                      message.role === 'user'
                        ? 'bg-[#4a89dc] text-white ml-auto'
                        : 'bg-white text-[#050b17] border border-gray-200'
                    } ${message.role === 'user' ? 'float-right' : ''}`}
                  >
                    {message.content}
                  </div>
                  
                  {/* Display time and model for messages */}
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-between'} items-center text-xs text-gray-500 mt-1 clear-both`}>
                    {message.role === 'ai' && <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">vertex-flash-ai</span>}
                    <span>{message.timestamp}</span>
                  </div>
                  
                  {/* Options for multiple choice questions */}
                  {message.options && (
                    <div className="mt-3 grid grid-cols-2 gap-2 clear-both">
                      {message.options.map((option) => (
                        <button
                          key={option.id}
                          className="text-left px-3 py-2 bg-white border border-gray-200 rounded hover:bg-[#4a89dc]/5 hover:border-[#4a89dc] transition-colors"
                          onClick={() => handleOptionSelect(option.id, option.label)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start mb-4">
              <div className="mr-2 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-medium text-sm">AI</span>
              </div>
              <div className="bg-white text-[#050b17] border border-gray-200 rounded-lg px-4 py-2 inline-block">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
              placeholder={currentQuestion === 0 ? "Enter your name..." : currentQuestion === 1 ? "Enter your email..." : "Type your message..."}
              className="flex-1 border-gray-200 focus:border-[#4a89dc] focus:ring-[#4a89dc]/10"
              disabled={isTyping}
            />
            <Button
              onClick={handleUserInput}
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white rounded-full h-10 w-10 p-0 flex items-center justify-center"
            >
              <ArrowRightCircle className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            Your responses help us personalize your travel experience
          </div>
        </div>
      </div>
    </div>
  );
}