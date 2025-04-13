import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { SendIcon, ArrowRightCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { onboardingSteps } from '@/lib/onboardingFlow';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  expectsResponse?: boolean;
  responseType?: 'text' | 'email' | 'multiselect' | 'destination';
  options?: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
  userSelections?: string[];
};

type UserData = {
  name: string;
  email: string;
  preferences: Record<string, any>;
  currentStep: number;
};

export default function OnboardingChat({ onComplete }: { onComplete: (userData: UserData) => void }) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: "Hi there! Welcome to JET AI. I'm your travel AI Assistant. Let's personalize your experience.",
      role: 'assistant',
      timestamp: new Date(),
      expectsResponse: true,
      responseType: 'text',
    },
  ]);
  
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    preferences: {},
    currentStep: 0,
  });
  
  const [progress, setProgress] = useState(0);
  const totalSteps = onboardingSteps.length + 2; // +2 for name and email steps

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle name submission
  const handleNameSubmit = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Update user data
    setUserData((prev) => ({
      ...prev,
      name: inputValue,
      currentStep: prev.currentStep + 1,
    }));
    
    setInputValue('');
    setIsTyping(true);
    setProgress((userData.currentStep + 1) / totalSteps * 100);

    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: `Nice to meet you, ${inputValue}! What's your email address so we can create your account?`,
        role: 'assistant',
        timestamp: new Date(),
        expectsResponse: true,
        responseType: 'email',
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle email submission
  const handleEmailSubmit = () => {
    if (!emailValue.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: emailValue,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Update user data
    setUserData((prev) => ({
      ...prev,
      email: emailValue,
      currentStep: prev.currentStep + 1,
    }));
    
    setEmailValue('');
    setIsTyping(true);
    setProgress((userData.currentStep + 1) / totalSteps * 100);

    // Simulate AI response after a delay
    setTimeout(() => {
      const currentOnboardingStep = onboardingSteps[0];
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: currentOnboardingStep.title,
        role: 'assistant',
        timestamp: new Date(),
        expectsResponse: true,
        responseType: 'multiselect',
        options: currentOnboardingStep.options,
        userSelections: [],
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle multiselect option selection
  const toggleSelection = (messageId: string, optionId: string) => {
    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (message.id === messageId) {
          const currentSelections = message.userSelections || [];
          const newSelections = currentSelections.includes(optionId)
            ? currentSelections.filter((id) => id !== optionId)
            : [...currentSelections, optionId];
          
          return {
            ...message,
            userSelections: newSelections,
          };
        }
        return message;
      });
    });
  };

  // Submit multiselect selections
  const submitSelections = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || !message.userSelections || message.userSelections.length === 0) return;

    // Current step in the onboarding flow
    const currentStepIndex = userData.currentStep - 2; // Adjust for name and email steps
    if (currentStepIndex < 0 || currentStepIndex >= onboardingSteps.length) return;
    
    const currentStep = onboardingSteps[currentStepIndex];
    
    // Add user selections as a message
    const selectedLabels = message.options
      ?.filter((option) => message.userSelections?.includes(option.id))
      .map((option) => option.label)
      .join(', ');
    
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: selectedLabels || 'My selections',
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Update user data with preferences
    setUserData((prev) => {
      // Save current progress to local storage for persistence
      const updatedUserData = {
        ...prev,
        preferences: {
          ...prev.preferences,
          [currentStep.id]: message.userSelections,
        },
        currentStep: prev.currentStep + 1,
      };
      
      localStorage.setItem('jetai_onboarding_progress', JSON.stringify(updatedUserData));
      return updatedUserData;
    });
    
    setIsTyping(true);
    setProgress((userData.currentStep + 1) / totalSteps * 100);
    
    // Check if we've reached the end of onboarding (use a safer comparison)
    if (currentStepIndex + 1 >= onboardingSteps.length) {
      // Final message
      setTimeout(() => {
        const finalMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: `Thanks ${userData.name}! Your custom travel dashboard is now being prepared with your preferences for ${Object.keys(userData.preferences).length} categories.`,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, finalMessage]);
        setIsTyping(false);
        
        // Complete onboarding after showing final message
        setTimeout(() => {
          // Log completion for debugging
          console.log("Onboarding complete with user data:", userData);
          
          // Save final preferences before completion
          localStorage.setItem('jetai_user_preferences', JSON.stringify(userData.preferences));
          
          // Call the completion handler
          onComplete(userData);
        }, 2000);
      }, 1000);
    } else {
      // Move to next question
      setTimeout(() => {
        const nextStep = onboardingSteps[currentStepIndex + 1];
        console.log(`Moving to step ${currentStepIndex + 1}: ${nextStep.title}`);
        
        // Determine the proper response type based on the step type
        const responseType = nextStep.type === 'destination-input' 
          ? 'text' 
          : (nextStep.type === 'radio' || nextStep.type === 'multiselect' ? 'multiselect' : 'text');
        
        const assistantMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: nextStep.title,
          role: 'assistant',
          timestamp: new Date(),
          expectsResponse: true,
          responseType: responseType,
          options: nextStep.options,
          userSelections: [],
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Handle destination input
  const handleDestinationSubmit = () => {
    if (!inputValue.trim()) return;
    
    // Current step in the onboarding flow
    const currentStepIndex = userData.currentStep - 2; // Adjust for name and email steps
    const currentStep = onboardingSteps[currentStepIndex];
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Update user data
    setUserData((prev) => {
      const destinations = inputValue.split(',').map(d => d.trim());
      const updatedUserData = {
        ...prev,
        preferences: {
          ...prev.preferences,
          [currentStep.id]: destinations,
        },
        currentStep: prev.currentStep + 1,
      };
      
      localStorage.setItem('jetai_onboarding_progress', JSON.stringify(updatedUserData));
      return updatedUserData;
    });
    
    setInputValue('');
    setIsTyping(true);
    setProgress((userData.currentStep + 1) / totalSteps * 100);
    
    // Check if we've reached the end of onboarding (use a safer comparison)
    if (currentStepIndex + 1 >= onboardingSteps.length) {
      handleFinalStep();
    } else {
      moveToNextStep(currentStepIndex);
    }
  };
  
  const handleFinalStep = () => {
    setTimeout(() => {
      const finalMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: `Thanks ${userData.name}! Your custom travel dashboard is now being prepared with your preferences for ${Object.keys(userData.preferences).length} categories.`,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, finalMessage]);
      setIsTyping(false);
      
      // Complete onboarding after showing final message
      setTimeout(() => {
        console.log("Onboarding complete with user data:", userData);
        localStorage.setItem('jetai_user_preferences', JSON.stringify(userData.preferences));
        onComplete(userData);
      }, 2000);
    }, 1000);
  };
  
  const moveToNextStep = (currentStepIndex: number) => {
    setTimeout(() => {
      const nextStep = onboardingSteps[currentStepIndex + 1];
      console.log(`Moving to step ${currentStepIndex + 1}: ${nextStep.title}`);
      
      // Determine the proper response type based on the step type
      const responseType = nextStep.type === 'destination-input' 
        ? 'destination' 
        : (nextStep.type === 'radio' || nextStep.type === 'multiselect' ? 'multiselect' : 'text');
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: nextStep.title + (nextStep.description ? `\n\n${nextStep.description}` : ''),
        role: 'assistant',
        timestamp: new Date(),
        expectsResponse: true,
        responseType: responseType,
        options: nextStep.options,
        userSelections: [],
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const renderInputArea = () => {
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage.expectsResponse) return null;
    
    switch (lastMessage.responseType) {
      case 'text':
        return (
          <div className="flex items-end gap-2">
            <Input
              placeholder="Enter your name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              className="flex-1"
            />
            <Button
              className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
              onClick={handleNameSubmit}
              disabled={!inputValue.trim() || isTyping}
            >
              Continue
              <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
        
      case 'destination':
        return (
          <div className="flex items-end gap-2">
            <Input
              placeholder="Enter destinations (separate with commas)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDestinationSubmit()}
              className="flex-1"
            />
            <Button
              className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
              onClick={handleDestinationSubmit}
              disabled={!inputValue.trim() || isTyping}
            >
              Continue
              <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
        
      case 'email':
        return (
          <div className="flex items-end gap-2">
            <Input
              type="email"
              placeholder="youremail@example.com"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
              className="flex-1"
            />
            <Button
              className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
              onClick={handleEmailSubmit}
              disabled={!emailValue.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) || isTyping}
            >
              Continue
              <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
        
      case 'multiselect':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lastMessage.options?.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center p-3 rounded-md cursor-pointer border-2 ${
                    lastMessage.userSelections?.includes(option.id)
                      ? 'border-[#4a89dc] bg-[#4a89dc]/10 text-[#050b17] font-medium'
                      : 'border-gray-300 hover:border-[#4a89dc]/50 text-gray-700'
                  }`}
                  onClick={() => toggleSelection(lastMessage.id, option.id)}
                >
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
              onClick={() => submitSelections(lastMessage.id)}
              disabled={(lastMessage.userSelections?.length || 0) === 0 || isTyping}
            >
              Continue
              <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] border rounded-lg shadow-lg bg-white">
      <div className="p-4 border-b bg-[#050b17] text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/logo.png" alt="JET AI" />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">JET AI Onboarding</h3>
          </div>
        </div>
        <div className="text-sm">Personalizing your travel experience</div>
      </div>
      
      <Progress value={progress} className="rounded-none h-1" />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className={message.role === 'user' ? 'bg-[#050b17] text-white' : 'bg-[#4a89dc]/10'}>
                <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                {message.role === 'assistant' && (
                  <AvatarImage src="/logo.png" alt="JET AI" />
                )}
              </Avatar>
              <div className={`rounded-lg px-4 py-2 ${
                message.role === 'user' 
                  ? 'bg-[#050b17] text-white'
                  : 'bg-[#4a89dc]/10 text-[#050b17]'
              }`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {message.content}
                </div>
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-between'} items-center text-xs mt-1 ${
                  message.role === 'user' 
                    ? 'text-white/70' 
                    : 'text-[#050b17]/70'
                }`}>
                  {message.role === 'assistant' && <span className="bg-[#4a89dc]/10 px-2 py-0.5 rounded text-[#050b17]/80 text-xs">vertex-flash-ai</span>}
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="bg-[#4a89dc]/10">
                <AvatarFallback>AI</AvatarFallback>
                <AvatarImage src="/logo.png" alt="JET AI" />
              </Avatar>
              <div className="rounded-lg px-4 py-3 bg-[#4a89dc]/10">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-[#4a89dc] animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-[#4a89dc] animate-bounce delay-200"></div>
                  <div className="h-2 w-2 rounded-full bg-[#4a89dc] animate-bounce delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        {renderInputArea()}
        
        <div className="mt-2 text-xs text-center text-[#4a89dc]">
          Your responses help us personalize your travel experience
        </div>
      </div>
    </div>
  );
}