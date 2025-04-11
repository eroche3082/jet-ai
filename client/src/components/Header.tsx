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
    { title: 'Itineraries', path: '/itineraries' },
    { title: 'Vertex AI', path: '/vertex-ai' },
    { title: 'About', path: '/about' }
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm py-3 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-primary text-2xl sm:text-3xl mr-2">
                <i className="fas fa-paper-plane"></i>
              </span>
              <span className="font-display font-bold text-xl sm:text-2xl text-dark">
                Jet<span className="text-primary">AI</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                href={link.path} 
                className={`font-accent font-medium ${
                  location === link.path ? 'text-primary' : 'text-dark hover:text-primary'
                } transition`}
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
                href="/signin" 
                className="font-accent font-medium text-white bg-primary hover:bg-primary/90 px-5 py-2 rounded-full transition"
              >
                Sign In
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
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block py-2 font-accent font-medium ${
                location === link.path ? 'text-primary' : 'text-dark hover:text-primary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="py-2">
                <Link 
                  href="/dashboard" 
                  className="block py-2 font-accent font-medium text-dark hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-columns mr-2 text-primary/80"></i>
                  Dashboard
                </Link>
                <Link 
                  href="/membership" 
                  className="block py-2 font-accent font-medium text-dark hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-crown mr-2 text-primary/80"></i>
                  Membership
                </Link>
                <Link 
                  href="/itineraries" 
                  className="block py-2 font-accent font-medium text-dark hover:text-primary"
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
                  className="block w-full text-left py-2 font-accent font-medium text-red-600"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/signin"
              className="block py-2 mt-2 text-center font-accent font-medium text-white bg-primary hover:bg-primary/90 px-5 py-2 rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
