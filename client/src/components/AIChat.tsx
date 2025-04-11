import { useState, useEffect, useRef } from 'react';
import { ChatMessage, sendChatMessage } from '@/lib/ai';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChat({ isOpen, onClose }: AIChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm your JetAI travel assistant. I can help you plan trips, find destinations, create itineraries, and more. What can I help you with today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    'Plan a trip',
    'Find destinations',
    'Travel inspiration'
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(inputMessage, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  return (
    <div 
      className={`chat-window bg-white rounded-2xl shadow-xl overflow-hidden mb-4 w-full sm:w-96 ${isOpen ? 'open' : ''}`}
    >
      {/* Chat Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div className="ml-3">
              <h3 className="font-accent font-semibold">JetAI Assistant</h3>
              <p className="text-xs text-white/80">Your personal travel planner</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white"
            aria-label="Close chat"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="p-4 h-96 overflow-y-auto custom-scrollbar">
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
                  : 'bg-gray-100 rounded-lg rounded-tl-none'
              } p-3 max-w-[80%]`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0">
                <i className="fas fa-user text-gray-500 text-sm"></i>
              </div>
            )}
          </div>
        ))}
        
        {/* Quick Actions after first bot message */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4 ml-11">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                onClick={() => handleQuickAction(action)}
                className="bg-primary/10 hover:bg-primary/20 text-primary text-sm px-3 py-1.5 rounded-full transition"
              >
                {action}
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
            <div className="bg-gray-100 rounded-lg rounded-tl-none p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input 
            ref={inputRef}
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your travel question..." 
            className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center text-white transition ${
              !inputMessage.trim() || isLoading ? 'bg-primary/50' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
