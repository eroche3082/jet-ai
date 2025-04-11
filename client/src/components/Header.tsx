import { useState } from 'react';
import { Link, useLocation } from 'wouter';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Destinations', path: '/destinations' },
    { title: 'Itineraries', path: '/itineraries' },
    { title: 'About', path: '/about' }
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-primary text-3xl mr-2">
                <i className="fas fa-paper-plane"></i>
              </span>
              <span className="font-display font-bold text-2xl text-dark">
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
            <Link 
              href="/signin" 
              className="font-accent font-medium text-white bg-primary hover:bg-primary/90 px-5 py-2 rounded-full transition"
            >
              Sign In
            </Link>
          </nav>
          
          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-dark text-2xl"
              aria-label="Toggle mobile menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
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
          <Link
            href="/signin"
            className="block py-2 mt-2 text-center font-accent font-medium text-white bg-primary hover:bg-primary/90 px-5 py-2 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
