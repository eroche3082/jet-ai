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
  MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AIAssistantButton from '@/components/AIAssistantButton';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check login status from local storage
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Destinations', href: '/destinations', icon: Map },
    { name: 'Travel Blog', href: '/blog', icon: Book },
    { name: 'AI Features', href: '/features', icon: Cpu },
    { name: 'Travel Community', href: '/travel-community', icon: Users },
  ];
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
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
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
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
      
      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm">
          <nav className="p-6">
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
              
              {!isLoggedIn && (
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
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
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
    </div>
  );
};

export default MainLayout;