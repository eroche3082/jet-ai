import { useState, useEffect } from 'react';
import UniversalChatbot from '@/components/UniversalChatbot';

export default function ChatPage() {
  const [isFullscreen, setIsFullscreen] = useState(true);
  
  // Set page title
  useEffect(() => {
    document.title = 'JetAI - Chat';
    
    // Force chatbot to open in fullscreen on this page
    setIsFullscreen(true);
    
    return () => {
      document.title = 'JetAI';
    };
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">JetAI Chat</h1>
        <p className="text-gray-600 mb-8">
          Your personal travel assistant is ready to help you plan your next adventure.
        </p>
        {/* UniversalChatbot is rendered via App.tsx but will be opened automatically on this page */}
      </div>
    </div>
  );
}