import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NewLandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-black" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
            <span className="ml-2 text-xl font-bold">JetAI</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="font-medium text-gray-900 hover:text-primary">Home</Link>
            <Link href="/destinations" className="font-medium text-gray-900 hover:text-primary">Destinations</Link>
            <Link href="/chat" className="font-medium text-gray-900 hover:text-primary">Chat</Link>
            <Link href="/portfolio" className="font-medium text-gray-900 hover:text-primary">Travel Memories</Link>
            <Link href="/about" className="font-medium text-gray-900 hover:text-primary">About</Link>
          </nav>
          
          <div className="hidden md:block">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="flex items-center p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div 
        className="relative flex-1 flex items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1536669038623-a25133061709?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Perfect Journey with AI
            </h1>
            <p className="text-xl text-white mb-8">
              Let our intelligent travel assistant create personalized itineraries based on your preferences and travel style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/chat">Chat with AI Assistant</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Smart Features for Smart Travelers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Itineraries</h3>
              <p className="text-gray-600">Personalized travel plans based on your preferences and budget</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accommodation Finder</h3>
              <p className="text-gray-600">Find the perfect place to stay that matches your style and budget</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Assistance</h3>
              <p className="text-gray-600">Get instant help and recommendations during your journey</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Travel Memory Keeper</h3>
              <p className="text-gray-600">Organize and share your travel experiences with friends and family</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild size="lg">
              <Link href="/features">Explore All Features</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-primary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Smarter Travel?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of travelers who have discovered the power of AI-assisted travel planning.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Get Started Now</Link>
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">JetAI</h3>
              <p className="text-gray-400">
                Revolutionizing travel planning with artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/destinations" className="text-gray-400 hover:text-white">Destinations</Link></li>
                <li><Link href="/chat" className="text-gray-400 hover:text-white">AI Assistant</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Travel Blog</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 JetAI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.012 10.012 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}