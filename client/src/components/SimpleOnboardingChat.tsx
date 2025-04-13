import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRightCircle, X, MessageSquare } from 'lucide-react';
import { onboardingSteps } from '@/lib/onboardingFlow';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'ai';
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
      content: "Hi there! Welcome to JET AI. I'll help you personalize your travel experience with a few questions.",
      role: 'ai',
    },
    {
      id: '2',
      content: "What's your name?",
      role: 'ai',
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
      
      // Final message and completion
      setTimeout(() => {
        const thankYouMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: `Thanks for sharing that with me! I'll personalize your JET AI experience based on your preferences.`,
          role: 'ai',
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-md transition-all duration-300 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="bg-[#050b17] text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#4a89dc]/20 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-[#4a89dc]" />
            </div>
            <div>
              <div className="font-display text-lg">JET AI</div>
              <div className="text-xs text-white/70 -mt-1 font-serif">PERSONALIZATION</div>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 ${message.role === 'user' ? 'text-right' : ''}`}
            >
              <div
                className={`inline-block rounded-lg px-4 py-2 max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-[#4a89dc] text-white'
                    : 'bg-[#f0f4f9] text-[#050b17]'
                }`}
              >
                {message.content}
              </div>
              
              {/* Display time for user messages */}
              {message.role === 'user' && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              
              {/* Options for multiple choice questions */}
              {message.options && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {message.options.map((option) => (
                    <button
                      key={option.id}
                      className="text-left px-3 py-2 border border-[#4a89dc]/30 rounded-md hover:bg-[#4a89dc]/10 hover:border-[#4a89dc] transition-colors"
                      onClick={() => handleOptionSelect(option.id, option.label)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center mb-3">
              <div className="bg-[#f0f4f9] text-[#050b17] rounded-lg px-4 py-2 inline-block">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        {currentQuestion < 2 && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
                placeholder={currentQuestion === 0 ? "Enter your name..." : "Enter your email..."}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleUserInput}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
              >
                <ArrowRightCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="p-3 text-center text-xs text-gray-500 border-t">
          Your responses help us personalize your travel experience
        </div>
      </div>
    </div>
  );
}