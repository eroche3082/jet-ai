import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AIAssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <Button 
        onClick={toggleChat}
        variant="default" 
        size="icon"
        className="rounded-full bg-primary"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-primary-foreground" />
        ) : (
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        )}
      </Button>

      {/* Chat window - shown when isOpen is true */}
      <div 
        className={cn(
          "fixed bottom-20 right-4 w-[350px] h-[500px] bg-card shadow-lg rounded-lg border z-50 overflow-hidden transition-all duration-300 flex flex-col",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="p-3 border-b bg-muted flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-medium">JET AI Assistant</span>
          </div>
          <Button 
            onClick={toggleChat} 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
            <p className="text-sm">Hello! I'm your JET AI Travel Assistant. How can I help you plan your next adventure?</p>
          </div>
          
          {/* Example responses - in a real app, these would be dynamically generated */}
          <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
            <p className="text-sm">I'm looking for destinations in Europe.</p>
          </div>
          
          <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
            <p className="text-sm">Great choice! Europe offers incredible cultural experiences. Would you like recommendations for cities known for history, natural beauty, or culinary experiences?</p>
          </div>
        </div>
        
        <div className="p-3 border-t">
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="sm">Send</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistantButton;