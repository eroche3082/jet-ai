import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { SendIcon, PaperclipIcon, Image as ImageIcon, Mic, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export default function AIChat() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI travel assistant. How can I help you plan your next adventure?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      generateAIResponse(inputValue);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    let aiResponse = '';

    // Simple pattern matching for demo
    if (userInput.toLowerCase().includes('paris')) {
      aiResponse = "Paris is a wonderful destination! Here are some key attractions:\n\n* **Eiffel Tower** - The iconic symbol of Paris\n* **Louvre Museum** - Home to thousands of works of art including the Mona Lisa\n* **Notre-Dame Cathedral** - A medieval Catholic cathedral\n* **Montmartre** - A hill in Paris's 18th arrondissement, known for its artistic history\n\nThe best time to visit Paris is from April to June or October to early November when the weather is mild and crowds are smaller. Would you like me to suggest an itinerary for Paris?";
    } else if (userInput.toLowerCase().includes('tokyo')) {
      aiResponse = "Tokyo is an amazing blend of traditional and ultramodern! Some highlights:\n\n* **Tokyo Skytree** - A broadcasting and observation tower\n* **Meiji Shrine** - A Shinto shrine dedicated to Emperor Meiji\n* **Shibuya Crossing** - The famous pedestrian crossing\n* **Senso-ji Temple** - An ancient Buddhist temple\n\nThe best time to visit is March-April for cherry blossoms or October-November for autumn colors. Would you like recommendations for Japanese cuisine to try?";
    } else if (userInput.toLowerCase().includes('budget') || userInput.toLowerCase().includes('cheap')) {
      aiResponse = "Here are some budget-friendly travel tips:\n\n1. **Book flights in advance** - Aim for 1-3 months ahead for best prices\n2. **Travel during off-peak seasons** - You'll find lower rates and fewer crowds\n3. **Stay in hostels or use home-sharing services** - Save significantly on accommodation\n4. **Use public transportation** - Often much cheaper than taxis or car rentals\n5. **Eat like a local** - Street food and local markets offer authentic experiences at lower prices\n\nWould you like me to suggest some affordable destinations based on your current season?";
    } else if (userInput.toLowerCase().includes('itinerary') || userInput.toLowerCase().includes('plan')) {
      aiResponse = "I'd be happy to help you create an itinerary! To provide the most personalized plan, I'll need some information:\n\n1. What is your destination?\n2. How many days will you be traveling?\n3. What are your main interests? (e.g., history, food, outdoor activities, art)\n4. Are you traveling solo, as a couple, family, or group?\n5. Do you have a budget range in mind?\n\nOnce you provide these details, I can craft a day-by-day itinerary tailored to your preferences!";
    } else {
      aiResponse = "I'd be happy to help you plan your trip! To get started, I can suggest destinations based on your interests, create custom itineraries, find flights and accommodations, or recommend activities at your destination. What specific aspect of travel planning can I assist you with today?";
    }

    const assistantMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[500px]">
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
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className={`text-xs mt-1 ${
                  message.role === 'user' 
                    ? 'text-white/70' 
                    : 'text-[#050b17]/70'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Ask me anything about your travel plans..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
          />
          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              variant="ghost"
              type="button"
              disabled={isTyping}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              type="button"
              disabled={isTyping}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              type="button"
              disabled={isTyping}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              type="submit"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <div className="text-[#4a89dc]">Powered by Gemini AI with GPT-4o and Claude fallback</div>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-[#4a89dc] hover:text-[#3a79cc]">
            <RefreshCw className="h-3 w-3 mr-1" />
            <span>Reset Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}