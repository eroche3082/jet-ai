import { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { 
  Home, 
  Search, 
  Map, 
  User, 
  Menu, 
  X, 
  MessageSquare, 
  Plane,
  Book,
  Cpu,
  Users,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from './Layout';
import Footer from './Footer';
import FloatingChatButton from './FloatingChatButton';
import { isPWAInstalled } from '@/lib/pwa';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ 
  children
}: MobileLayoutProps) {
  const [location] = useLocation();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNetworkOffline, setIsNetworkOffline] = useState(!navigator.onLine);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  
  // Detect if the app is running as a PWA and handle network status
  useEffect(() => {
    // Check if the app is installed as PWA
    setIsInstalled(isPWAInstalled());
    
    // Network status monitoring
    const handleOnline = () => setIsNetworkOffline(false);
    const handleOffline = () => setIsNetworkOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Get safe area insets for notched devices
    if (typeof window !== 'undefined' && 'CSS' in window && CSS.supports('padding-top: env(safe-area-inset-top)')) {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0', 10),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0', 10),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0', 10),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0', 10)
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const NAVIGATION_ITEMS = [
    { label: 'Home', icon: <Home className="h-5 w-5" />, href: '/' },
    { label: 'Destinations', icon: <Map className="h-5 w-5" />, href: '/destinations' },
    { label: 'Travel Blog', icon: <Book className="h-5 w-5" />, href: '/blog' },
    { label: 'AI Features', icon: <Cpu className="h-5 w-5" />, href: '/features' },
    { label: 'Community', icon: <Users className="h-5 w-5" />, href: '/travel-community' },
  ];
  
  const SECONDARY_NAV_ITEMS = [
    { label: 'Access Codes', icon: <QrCode className="h-5 w-5" />, href: '/access-dashboard' },
    { label: 'Membership', href: '/membership' },
    { label: 'Saved Places', href: '/saved' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Settings', href: '/settings' },
    { label: 'Help', href: '/help' },
  ];
  
  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background",
      isInstalled && "pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right"
    )}>
      {/* Offline status indicator */}
      {isNetworkOffline && (
        <div className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center text-xs py-1",
          isInstalled && "pt-safe-top"
        )}>
          You are currently offline. Some features may be limited.
        </div>
      )}
      
      {/* Mobile Header - Always visible but styled according to PWA status */}
      <header className={cn(
        "sticky top-0 z-40 border-b bg-background",
        isInstalled && "top-safe pt-safe-top",
        isNetworkOffline && "top-6"
      )}>
        <div className="container px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100/20"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Plane className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-primary">JET AI</span>
              </div>
            </Link>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center">
            <Link
              href="/search"
              className="flex items-center justify-center w-10 h-10 rounded-full"
            >
              <Search className="h-5 w-5" />
            </Link>
            
            <Link href="/login" className="ml-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay - Full-screen, app-like in PWA mode */}
      {isMenuOpen && (
        <div className={cn(
          "fixed inset-0 z-30 bg-background",
          !isInstalled && "top-16",
          isInstalled && "pt-safe-top pb-safe-bottom"
        )}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Plane className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">JET AI</span>
              </div>
              <button
                onClick={toggleMenu}
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100/20"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Main Navigation */}
            <div className="mt-6">
              <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">Navigation</h3>
              <ul className="space-y-4">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a 
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md transition-colors",
                          isActive(location, item.href) 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-foreground hover:bg-muted"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Secondary Navigation Items */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">More</h3>
              <ul className="space-y-3">
                {SECONDARY_NAV_ITEMS.map((item) => (
                  <li key={typeof item.href === 'string' ? item.href : 'item'}>
                    <Link href={item.href}>
                      <a 
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md transition-colors",
                          isActive(location, item.href) 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-foreground hover:bg-muted"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <span className="mr-3">{item.icon}</span>}
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Sign In/Up Section */}
            <div className="mt-8 pt-6 border-t">
              <Link 
                href="/login" 
                className="inline-flex w-full justify-center py-3 px-5 font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In / Sign Up
              </Link>
            </div>
            
            {/* Footer in Menu */}
            <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} JET AI</p>
              <p className="mt-1">Your intelligent travel companion</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content with Safe Area padding for PWA */}
      <main className={cn(
        "flex-grow",
        isInstalled && "pb-20",
        isNetworkOffline && "offline-mode"
      )}>
        {children}
      </main>
      
      {/* Mobile Tab Bar Navigation for all mobile views */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-30 bg-background shadow-up border-t",
        isInstalled && "pb-safe-bottom"
      )}>
        <div className="grid grid-cols-5 h-16">
          {NAVIGATION_ITEMS.slice(0, 2).map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "flex flex-col items-center justify-center space-y-1",
                isActive(location, item.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
          
          {/* Travel Cockpit Button in the center */}
          <Link
            href="/chat"
            className="flex flex-col items-center justify-center"
            aria-label="Open Travel Cockpit"
          >
            <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white shadow-md">
              <MessageSquare className="h-6 w-6" />
            </div>
          </Link>
          
          {NAVIGATION_ITEMS.slice(2, 4).map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "flex flex-col items-center justify-center space-y-1",
                isActive(location, item.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Footer is hidden in all mobile views since we have the tab bar */}
    </div>
  );
}

// Helper function to check if a path is active (also handles subpaths)
function isActive(location: string, path: string): boolean {
  if (path === '/') {
    return location === '/';
  }
  return location === path || location.startsWith(`${path}/`);
}