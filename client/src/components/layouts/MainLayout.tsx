import React, { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { 
  Home, 
  Map, 
  Book, 
  Cpu, 
  Users, 
  LogIn,
  Menu,
  X,
  Bell,
  User,
  Search,
  MessageSquare,
  Plane,
  QrCode
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AIAssistantButton from '@/components/AIAssistantButton';
import { isPWAInstalled } from '@/lib/pwa';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  
  useEffect(() => {
    // Check login status from local storage
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
    
    // Check if the app is installed as PWA
    setIsInstalled(isPWAInstalled());
    
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
  }, []);
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Destinations', href: '/destinations', icon: Map },
    { name: 'Travel Blog', href: '/blog', icon: Book },
    { name: 'AI Features', href: '/features', icon: Cpu },
    { name: 'Travel Community', href: '/travel-community', icon: Users },
    { name: 'Access Codes', href: '/access-dashboard', icon: QrCode },
  ];
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background",
      isInstalled && "pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right"
    )}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 border-b bg-background",
        isInstalled && "top-safe pt-safe-top"
      )}>
        <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="lg:hidden mr-2">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Plane className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-primary">JET AI</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Bell className="h-5 w-5" />
            </Button>
            
            {isLoggedIn ? (
              <Link href="/dashboard">
                <a className="flex items-center space-x-1">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="hidden sm:flex">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            <AIAssistantButton />
          </div>
        </div>
      </header>
      
      {/* Mobile navigation menu - Fullscreen in app mode */}
      {mobileMenuOpen && (
        <div className={cn(
          "lg:hidden fixed inset-0 z-30 bg-background",
          !isInstalled && "top-16",
          isInstalled && "pt-safe-top pb-safe-bottom"
        )}>
          <nav className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Plane className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">JET AI</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Close menu">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <ul className="space-y-6">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a 
                      className={cn(
                        "flex items-center text-base font-medium transition-colors hover:text-primary",
                        isActive(item.href) 
                          ? "text-primary" 
                          : "text-muted-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
              
              {isLoggedIn ? (
                <li>
                  <a 
                    className="flex items-center text-base font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem('isLoggedIn');
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </a>
                </li>
              ) : (
                <li>
                  <Link href="/login">
                    <a 
                      className="flex items-center text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="h-5 w-5 mr-3" />
                      Sign In
                    </a>
                  </Link>
                </li>
              )}
            </ul>
            
            {/* Additional menu sections can be added here */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/membership">
                    <a 
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Membership Plans
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/help">
                    <a 
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Help & Support
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/settings">
                    <a 
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      App Settings
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      )}
      
      {/* Main content with safe area padding for PWA */}
      <main className={cn(
        "flex-1",
        isInstalled && "pt-safe-top pb-safe-bottom"
      )}>
        {children}
      </main>
      
      {/* Footer - Hidden in PWA installed mode */}
      {!isInstalled && (
        <footer className="border-t py-6 md:py-8">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <Plane className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold text-primary">JET AI</span>
                <span className="text-muted-foreground">© {new Date().getFullYear()}</span>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-muted-foreground">
                  Your AI-powered travel companion for intelligent, personalized travel experiences.
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
      
      {/* Mobile PWA Navigation - Only shown when installed as PWA */}
      {isInstalled && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-background shadow-up border-t pb-safe-bottom">
          <nav className="flex justify-around items-center h-16">
            {navigation.slice(0, 5).map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.name}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MainLayout;