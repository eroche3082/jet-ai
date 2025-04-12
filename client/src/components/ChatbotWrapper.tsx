import { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Image, 
  Send, 
  Maximize2, 
  Minimize2, 
  X, 
  Settings,
  GalleryVerticalEnd,
  VolumeX,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function ChatbotWrapper() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'gpt' | 'claude'>('gemini');
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-message',
          role: 'assistant',
          content: 'Hello! I am CryptoBot, your AI assistant for cryptocurrency information. How can I help you today?',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (isMaximized && !isOpen) {
      setIsMaximized(false);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMaximized(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: getAIResponse(inputValue, selectedModel),
        timestamp: new Date()
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple function to generate mock AI responses based on input
  const getAIResponse = (input: string, model: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('bitcoin') || lowerInput.includes('btc')) {
      return "Bitcoin (BTC) is currently trading at approximately $84,391, up 2.06% in the last 24 hours. It remains the largest cryptocurrency by market capitalization.";
    } else if (lowerInput.includes('ethereum') || lowerInput.includes('eth')) {
      return "Ethereum (ETH) is currently trading at approximately $1,638.36, up 4.48% in the last 24 hours. It's the second-largest cryptocurrency by market cap and the primary platform for decentralized applications and smart contracts.";
    } else if (lowerInput.includes('portfolio') || lowerInput.includes('invest')) {
      return "I can help you analyze your crypto portfolio. For detailed portfolio management, please check our Portfolio Simulator tool in the sidebar that lets you create and test investment strategies without risking real money.";
    } else if (lowerInput.includes('price') || lowerInput.includes('market')) {
      return "The overall cryptocurrency market is showing positive momentum today. Major coins like Bitcoin, Ethereum, and Solana are up, while stablecoins like USDT and USDC maintain their pegs. Would you like detailed information about a specific cryptocurrency?";
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm CryptoBot, your AI assistant for cryptocurrency information. I can help with market data, portfolio analysis, tax information, and more. What can I help you with today?";
    } else {
      return "I'm here to help with cryptocurrency information and analysis. You can ask me about current prices, market trends, specific coins, or trading strategies. How can I assist you with your crypto journey today?";
    }
  };

  return (
    <>
      {/* Floating chat button when chat is closed */}
      {!isOpen && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <button 
            onClick={toggleChatbot}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full p-3 text-white shadow-lg flex items-center justify-center h-14 w-14"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </motion.div>
      )}

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 bg-slate-900 text-white shadow-xl rounded-xl overflow-hidden ${
              isMaximized ? 'inset-0 rounded-none' : 'bottom-5 right-5 w-96 h-[560px]'
            }`}
          >
            {/* Header */}
            <div className="bg-indigo-600 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
                    <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-medium">CryptoBot Universal Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                {!isMaximized ? (
                  <button onClick={toggleMaximize} className="p-1 hover:bg-white/20 rounded">
                    <Maximize2 className="h-5 w-5" />
                  </button>
                ) : (
                  <button onClick={toggleMaximize} className="p-1 hover:bg-white/20 rounded">
                    <Minimize2 className="h-5 w-5" />
                  </button>
                )}
                <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-indigo-600/50 px-3 py-2 flex items-center justify-between border-b border-indigo-700/50">
              <div className="flex items-center gap-2">
                <button className={`px-3 py-1 rounded-md text-sm font-medium ${selectedModel === 'gemini' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`} onClick={() => setSelectedModel('gemini')}>
                  Gemini
                </button>
                <button className={`px-3 py-1 rounded-md text-sm font-medium ${selectedModel === 'gpt' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`} onClick={() => setSelectedModel('gpt')}>
                  GPT
                </button>
                <button className={`px-3 py-1 rounded-md text-sm font-medium ${selectedModel === 'claude' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`} onClick={() => setSelectedModel('claude')}>
                  Claude
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-indigo-700/50 rounded" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button className="p-1 hover:bg-indigo-700/50 rounded">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ height: isMaximized ? 'calc(100vh - 160px)' : '400px' }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 rounded-lg px-4 py-2 ${
                        message.role === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-3/4 rounded-lg px-4 py-2 bg-slate-800 text-gray-100">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-slate-700 p-3 bg-slate-800">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-slate-700">
                  <Mic className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-slate-700">
                  <Image className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    className="w-full py-2 px-4 pr-10 bg-slate-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}