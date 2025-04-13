import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [location] = useLocation();
  
  // Check if user is logged in
  useEffect(() => {
    // In a real app, we would use a proper auth check
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setUsername(userData.username || userData.fullName || 'User');
        } else {
          setIsLoggedIn(false);
          setUsername('');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, [location]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Destinations', path: '/destinations' },
    { title: 'Travel Blog', path: '/blog' },
    { title: 'Features', path: '/features' }
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm py-3 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-[#4a89dc] text-2xl sm:text-3xl mr-2">
                <i className="fas fa-plane"></i>
              </span>
              <span className="font-display font-bold text-xl sm:text-2xl text-marni-dark">
                JET <span className="text-[#4a89dc]">AI</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                href={link.path} 
                className={`font-serif font-medium ${
                  location === link.path ? 'text-[#4a89dc]' : 'text-marni-dark hover:text-[#4a89dc]'
                } transition-colors duration-300`}
              >
                {link.title}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center font-accent font-medium text-dark px-2 py-1 rounded-full border-2 border-primary/20 hover:border-primary/40 transition">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <i className="fas fa-user text-primary"></i>
                  </span>
                  <span className="mr-1">{username}</span>
                  <i className="fas fa-chevron-down text-xs text-primary"></i>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                  <div className="py-2">
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-sm text-dark hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <i className="fas fa-columns mr-2 text-primary/80"></i>
                      Dashboard
                    </Link>
                    <Link 
                      href="/membership" 
                      className="block px-4 py-2 text-sm text-dark hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <i className="fas fa-crown mr-2 text-primary/80"></i>
                      Membership
                    </Link>
                    <Link 
                      href="/itineraries" 
                      className="block px-4 py-2 text-sm text-dark hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <i className="fas fa-map-marked-alt mr-2 text-primary/80"></i>
                      My Itineraries
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={async () => {
                        try {
                          await fetch('/api/auth/logout', {
                            method: 'POST',
                            credentials: 'include',
                          });
                          setIsLoggedIn(false);
                          window.location.href = '/';
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="font-serif font-medium text-white bg-[#4a89dc] hover:bg-[#3a79cc] px-5 py-2 rounded transition-colors duration-300 shadow-sm"
              >
                Log In
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? 
                <i className="fas fa-times text-lg"></i> : 
                <i className="fas fa-bars text-lg"></i>
              }
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-4 animate-fade-in`}>
          <div className="divide-y">
            <div className="py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block py-3 font-serif font-medium ${
                    location === link.path ? 'text-[#4a89dc]' : 'text-marni-dark hover:text-[#4a89dc]'
                  } transition-colors duration-300`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>
            
            {isLoggedIn ? (
              <div className="py-2">
                <Link 
                  href="/dashboard" 
                  className="block py-3 font-medium text-dark hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-columns mr-2 text-primary/80"></i>
                  Dashboard
                </Link>
                <Link 
                  href="/membership" 
                  className="block py-3 font-medium text-dark hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-crown mr-2 text-primary/80"></i>
                  Membership
                </Link>
                <Link 
                  href="/itineraries" 
                  className="block py-3 font-medium text-dark hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-map-marked-alt mr-2 text-primary/80"></i>
                  My Itineraries
                </Link>
                <button 
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include',
                      });
                      setIsLoggedIn(false);
                      setIsMobileMenuOpen(false);
                      window.location.href = '/';
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }}
                  className="block w-full text-left py-3 font-medium text-red-600"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="py-4">
                <Link
                  href="/login"
                  className="block py-3 text-center font-serif font-medium text-white bg-[#4a89dc] hover:bg-[#3a79cc] rounded transition-colors duration-300 shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
