import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import ChatbotWrapper from './ChatbotWrapper';

interface LayoutProps {
  children: ReactNode;
}

export default function CryptoLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Fixed sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 ml-64">
        {/* Fixed top navigation */}
        <TopNav />
        
        {/* Page content with appropriate padding */}
        <main className="p-6 pt-20">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="p-4 text-center text-xs text-gray-500">
          <p>© 2025 CryptoBot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </footer>
      </div>
      
      {/* Universal chatbot */}
      <ChatbotWrapper />
    </div>
  );
}