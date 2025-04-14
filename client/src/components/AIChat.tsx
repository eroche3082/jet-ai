import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { SendIcon, PaperclipIcon, Image as ImageIcon, Mic, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

interface AIChatProps {
  voiceEnabled?: boolean;
  personality?: string;
}

export default function AIChat({ voiceEnabled = false, personality = 'concierge' }: AIChatProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Hello! I\'m your JET AI travel assistant. How can I help you plan your next adventure?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // If voice is enabled and we have a new assistant message, read it aloud
    if (voiceEnabled && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isSpeaking) {
      speakText(messages[messages.length - 1].content);
    }
  }, [messages, voiceEnabled]);
  
  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      
      // Check if the browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          title: "Speech Recognition Unavailable",
          description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
          variant: "destructive"
        });
        setIsListening(false);
        return;
      }
      
      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        toast({
          title: "Listening...",
          description: "Speak clearly into your microphone",
        });
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        
        // Automatically send message after voice input
        setTimeout(() => {
          setIsListening(false);
          handleSendMessage(transcript);
        }, 500);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        });
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Voice Recognition Error",
        description: "Failed to start voice recognition. Please check microphone permissions.",
        variant: "destructive"
      });
      setIsListening(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      // For privacy reasons, strip markdown before speaking
      const plainText = text.replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
                           .replace(/\*(.*?)\*/g, '$1')       // Remove italic
                           .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
                           .replace(/#{1,6}\s(.*?)(\n|$)/g, '$1$2') // Remove headings
                           .replace(/\n\n/g, '. ')            // Replace double newlines with period+space
                           .replace(/\n/g, '. ');            // Replace single newlines with period+space
      
      setIsSpeaking(true);
      
      // Try to use the Google TTS API first (higher quality)
      try {
        const response = await axios.post('/api/tts', { 
          text: plainText,
          voice: 'en-US-Neural2-F'  // Female voice
        });
        
        if (response.data && response.data.audioUrl) {
          const audio = new Audio(response.data.audioUrl);
          audio.onended = () => {
            setIsSpeaking(false);
          };
          audio.play();
          return;
        }
      } catch (error) {
        console.error('Error using Google TTS, falling back to browser TTS', error);
        // Fall back to browser TTS
      }
      
      // Browser TTS fallback
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(plainText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Try to use a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.includes('female') || 
          voice.name.includes('Female') || 
          voice.name.includes('Google UK English Female') ||
          voice.name.includes('Samantha')
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: textToSend,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // If speaking, stop it as the user has sent a new message
    if (isSpeaking) {
      stopSpeaking();
    }

    // Call the server API instead of simulating
    fetchAIResponse(textToSend);
  };

  const fetchAIResponse = async (userInput: string) => {
    try {
      const response = await axios.post('/api/chat', {
        message: userInput,
        history: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        personality
      });
      
      if (response.data && response.data.message) {
        const assistantMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: response.data.message,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      // Fallback to client-side response
      generateFallbackResponse(userInput);
      
      toast({
        title: "Connection Issue",
        description: "Could not reach our AI servers. Using fallback mode.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const generateFallbackResponse = (userInput: string) => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const resetChat = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    setMessages([{
      id: '1',
      content: 'Hello! I\'m your JET AI travel assistant. How can I help you plan your next adventure?',
      role: 'assistant',
      timestamp: new Date(),
    }]);
    
    toast({
      title: "Chat Reset",
      description: "Your conversation has been cleared."
    });
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
                <div className="flex justify-between items-center">
                  <div className={`text-xs ${
                    message.role === 'user' 
                      ? 'text-white/70' 
                      : 'text-[#050b17]/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  {/* Voice controls for assistant messages */}
                  {voiceEnabled && message.role === 'assistant' && (
                    <div className="flex space-x-1">
                      {!isSpeaking ? (
                        <button 
                          onClick={() => speakText(message.content)}
                          className="text-[#4a89dc] hover:text-[#3a79cc] p-1 rounded-full"
                          aria-label="Read message aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      ) : (
                        <button 
                          onClick={stopSpeaking}
                          className="text-red-500 hover:text-red-600 p-1 rounded-full"
                          aria-label="Stop reading"
                        >
                          <VolumeX className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
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
            disabled={isListening || isTyping}
          />
          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              variant="ghost"
              type="button"
              disabled={isTyping || isListening}
              className="text-[#4a89dc]"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              type="button"
              disabled={isTyping || isListening}
              className="text-[#4a89dc]"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            {voiceEnabled && (
              <Button
                size="icon"
                variant={isListening ? "default" : "ghost"}
                type="button"
                disabled={isTyping}
                onClick={startListening}
                className={isListening ? "bg-red-500 hover:bg-red-600 text-white" : "text-[#4a89dc]"}
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              type="submit"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping || isListening}
              className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <div className="text-[#4a89dc]">Powered by Gemini AI with GPT-4o and Claude fallback</div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-0 text-[#4a89dc] hover:text-[#3a79cc]"
            onClick={resetChat}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            <span>Reset Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}