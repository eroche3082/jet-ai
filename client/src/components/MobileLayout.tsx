import { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Search, Map, User, Menu, X, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatBubble from './ChatBubble';
import AIChat from './AIChat';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Detect if the app is running as a PWA
  useEffect(() => {
    // Check if the display mode is standalone (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFromHomeScreen = window.navigator.standalone; // iOS Safari
    
    // Also check URL params in case we want to test PWA mode
    const urlParams = new URLSearchParams(window.location.search);
    const forcePWA = urlParams.get('pwa') === 'true';
    
    setIsPWA(isStandalone || isFromHomeScreen || forcePWA);
  }, []);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const NAVIGATION_ITEMS = [
    { label: 'Home', icon: <Home className="h-5 w-5" />, href: '/' },
    { label: 'Explore', icon: <Search className="h-5 w-5" />, href: '/destinations' },
    { label: 'Itineraries', icon: <Map className="h-5 w-5" />, href: '/itineraries' },
    { label: 'Profile', icon: <User className="h-5 w-5" />, href: '/profile' },
  ];
  
  const MENU_ITEMS = [
    { label: 'Membership', href: '/membership' },
    { label: 'Saved Places', href: '/saved' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Settings', href: '/settings' },
    { label: 'About', href: '/about' },
    { label: 'Partner Program', href: '/partner/signup' },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header - Conditional for PWA */}
      {(!isPWA || isMenuOpen) && (
        <header className={cn(
          "sticky top-0 z-40 bg-white shadow-sm py-3 px-4",
          isPWA && "pt-safe-top"
        )}>
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary text-2xl mr-2">
                <i className="fas fa-paper-plane"></i>
              </span>
              <span className="font-display font-bold text-xl text-dark">
                Jet<span className="text-primary">AI</span>
              </span>
            </Link>
            
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>
      )}
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-16">
          <div className="px-6 py-4 h-full overflow-y-auto pb-safe-bottom">
            <div className="divide-y">
              <div className="py-2">
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="py-4">
                <Link 
                  href="/signin" 
                  className="block py-3 text-center font-medium text-white bg-primary hover:bg-primary/90 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In / Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content with Safe Area padding for PWA */}
      <main className={cn(
        "flex-grow",
        isPWA && "pb-16 pt-safe-top" // Bottom padding for navigation bar
      )}>
        {children}
      </main>
      
      {/* AI Chat */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Floating Chat Button (only in non-PWA mode) */}
      {!isPWA && !isChatOpen && (
        <div className="fixed bottom-6 right-6 z-20">
          <ChatBubble onClick={toggleChat} />
        </div>
      )}
      
      {/* Mobile Tab Bar Navigation for PWA */}
      {isPWA && !isChatOpen && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t pb-safe-bottom">
          <div className="grid grid-cols-5 h-16">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = item.href === location;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1",
                    isActive ? "text-primary" : "text-gray-500"
                  )}
                >
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Chat Button in the center */}
            <button
              onClick={toggleChat}
              className="flex flex-col items-center justify-center space-y-1"
              aria-label="Open AI Assistant"
            >
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="text-xs">Assistant</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}