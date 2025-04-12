import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Mic, Image, MapPin, Calendar, Upload, Globe, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export default function AIChat() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI travel assistant. How can I help you plan your next adventure?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Generate a sample response based on keywords in the user message
      let responseText = '';
      const userInput = input.toLowerCase();
      
      if (userInput.includes('paris') || userInput.includes('france')) {
        responseText = 'Paris is a wonderful destination! Known as the City of Light, it offers iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. The best time to visit is during spring (April-June) or fall (September-October) when the weather is pleasant and there are fewer tourists.';
      } else if (userInput.includes('budget') || userInput.includes('cheap')) {
        responseText = 'For budget travel, consider destinations like Southeast Asia (Thailand, Vietnam), Eastern Europe (Poland, Hungary), or South America (Colombia, Peru). These offer great value for money with affordable accommodations, food, and activities.';
      } else if (userInput.includes('flight') || userInput.includes('booking')) {
        responseText = 'I can help you find flights! Generally, booking 1-3 months in advance often yields the best prices. Try to be flexible with your dates and consider mid-week departures for better deals. Would you like me to check specific routes for you?';
      } else if (userInput.includes('itinerary') || userInput.includes('plan')) {
        responseText = 'I\'d be happy to help create an itinerary! Please let me know your destination, travel dates, interests (e.g., history, food, nature), and any must-see attractions. I\'ll craft a personalized day-by-day plan for your trip.';
      } else {
        responseText = 'Thank you for your message! I can help with destination recommendations, flight and hotel bookings, itinerary planning, budget tips, and local insights. Could you provide more details about what you\'re looking for?';
      }
      
      const aiResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h2 className="text-xl font-semibold">AI Travel Assistant</h2>
        <p className="text-sm text-gray-500">Ask me anything about your travel plans</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[80%]`}>
                <Avatar className={message.role === 'user' ? 'bg-primary/10' : 'bg-blue-100'}>
                  <AvatarFallback>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                  {message.role === 'assistant' && (
                    <AvatarImage src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Jet+AI" />
                  )}
                </Avatar>
                <Card className={`p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row gap-3 max-w-[80%]">
                <Avatar className="bg-blue-100">
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Jet+AI" />
                </Avatar>
                <Card className="p-3 flex items-center bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <Button size="icon" variant="outline">
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline">
            <Image className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline">
            <MapPin className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline">
            <Upload className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline">
            <Globe className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Input
            placeholder="Ask anything about travel planning..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button disabled={isLoading} onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}