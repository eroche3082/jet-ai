import { ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AIChat from './AIChat';
import ChatBubble from './ChatBubble';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        <ChatBubble onClick={toggleChat} />
      </div>
    </div>
  );
}
