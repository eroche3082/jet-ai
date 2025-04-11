import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, SendHorizontal, ChevronUp } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// Widget configuration interface
interface WidgetConfig {
  primaryColor: string;
  position: 'left' | 'right';
  greeting: string;
  placeholder: string;
  brandText: string;
}

export default function EmbedWidgetDemo() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Demo configuration
  const config: WidgetConfig = {
    primaryColor: theme.primaryColor || '#3182CE',
    position: 'right',
    greeting: "Hi there! I'm your JetAI Travel Assistant. How can I help you plan your next trip?",
    placeholder: "Ask me about destinations, itineraries...",
    brandText: "Powered by JetAI"
  };
  
  // Sample responses for demo
  const sampleResponses = [
    "I'd be happy to help you plan a trip to Bali! It's a beautiful destination known for its stunning beaches, lush rice terraces, and vibrant culture. When are you thinking of traveling?",
    "Paris is a wonderful choice! The best time to visit is during spring (April to June) or fall (September to November) when the weather is pleasant and crowds are smaller. Would you like recommendations for top attractions?",
    "For a 7-day Japan itinerary, I'd recommend spending 3 days in Tokyo, 2 days in Kyoto, and 2 days in Osaka. This gives you a good mix of modern city experiences and traditional Japanese culture. Would you like me to create a detailed day-by-day plan?",
    "Costa Rica is perfect for adventure travel! You can go zip-lining through cloud forests, hike to waterfalls, surf on beautiful beaches, and see incredible wildlife. The best areas to visit would be Arenal for the volcano, Monteverde for cloud forests, and Manuel Antonio for beaches and wildlife."
  ];
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Add welcome message on initial open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: config.greeting, isUser: false }]);
    }
  }, [isOpen, messages.length, config.greeting]);
  
  // Handle message send
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    // Clear input
    setMessage('');
    
    // Simulate response after delay
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * sampleResponses.length);
      setMessages(prev => [...prev, { text: sampleResponses[responseIndex], isUser: false }]);
    }, 1000);
  };
  
  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="relative h-full">
      {/* Chat toggle button */}
      {!isOpen && (
        <div 
          className={`absolute cursor-pointer ${config.position === 'right' ? 'right-4' : 'left-4'} bottom-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-10`}
          style={{ backgroundColor: config.primaryColor }}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="text-white h-6 w-6" />
        </div>
      )}
      
      {/* Chat widget */}
      <div 
        className={`absolute ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity ${config.position === 'right' ? 'right-4' : 'left-4'} bottom-4 w-80 sm:w-96 h-[480px] bg-background rounded-md shadow-xl flex flex-col overflow-hidden border z-10`}
      >
        {/* Header */}
        <div 
          className="px-4 py-3 flex justify-between items-center"
          style={{ backgroundColor: config.primaryColor }}
        >
          <div className="text-white font-medium">Travel Assistant</div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
              onClick={() => setIsOpen(false)}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
              onClick={() => {
                setIsOpen(false);
                setMessages([]);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 max-w-[85%] ${msg.isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              <div 
                className={`p-3 rounded-lg ${
                  msg.isUser 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-3 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={config.placeholder}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
              style={{ backgroundColor: config.primaryColor }}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center mt-2 text-xs text-muted-foreground">
            {config.brandText}
          </div>
        </div>
      </div>
      
      {/* Background dimming overlay */}
      <div 
        className={`absolute inset-0 bg-black/10 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity z-0`}
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
}