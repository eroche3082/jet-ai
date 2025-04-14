import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowRight,
  BookOpen,
  Brain,
  Calendar, 
  ChevronRight,
  Compass, 
  DollarSign,
  Facebook,
  Globe, 
  Heart, 
  Instagram,
  Languages,
  Mail,
  Map, 
  MapIcon,
  Menu,
  MessageCircle,
  MessageSquare,
  Plane, 
  Search,
  Sparkles,
  Star,
  Twitter,
  Upload, 
  User,
  X,
  Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SimpleOnboardingChat from "@/components/SimpleOnboardingChat";
import AIChat from "@/components/AIChat";

export default function LightLandingPage() {
  const [showChat, setShowChat] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-[#050b17] text-white shadow-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-0 group">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <div className="ml-2">
                <h1 className="font-display text-2xl tracking-tight">JET AI</h1>
                <div className="text-xs text-white/70 -mt-1 font-serif">TRAVEL COMPANION</div>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-serif">Home</Link>
              <Link href="/features" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-serif">
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Features</span>
                </div>
              </Link>
              <Link href="/planner" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-serif">
                Flow Builder
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-serif">
                Pricing
              </Link>
              <button 
                onClick={() => setShowChat(true)} 
                className="px-4 py-2 text-white/90 hover:text-white transition-colors font-serif flex items-center space-x-1"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>AI Assistant</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="bg-white text-[#050b17] hover:bg-[#4a89dc] hover:text-white border-none transition-all duration-300 font-serif rounded">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white border-none transition-all duration-300 font-serif rounded">
                  Sign Up
                </Button>
              </Link>
              <button className="md:hidden text-white hover:bg-gray-800 p-2 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[650px]" 
        style={{ 
          backgroundImage: "url('/img/jet_hero.jpg')",
          backgroundPosition: 'center',
          backgroundColor: '#050b17',
        }}
      >
        <div className="absolute inset-0 bg-[#050b17]/80"></div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-2xl">
            <div className="border-l-2 border-[#4a89dc] bg-white/5 px-4 py-1 inline-flex items-center mb-6">
              <span className="text-white/90 text-sm font-serif tracking-wide">INTELLIGENT TRAVEL PLANNING</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display text-white mb-6 leading-tight">
              The Intelligent AI Copilot for <span className="text-[#4a89dc]">Decisions, Data & Life.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-xl leading-relaxed font-serif">
              JET AI helps you navigate travel, business, and daily life with smart flows, emotional insights, and instant recommendations.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
              <Link href="/onboarding" className="inline-flex items-center bg-[#4a89dc] hover:bg-[#3a79cc] text-white font-serif font-medium px-6 py-3 rounded-md transition shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Create My Profile
              </Link>
              <Link href="/destinations" className="inline-flex items-center bg-transparent border border-white/30 hover:border-white/50 text-white font-serif font-medium px-6 py-3 rounded-md transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Explore Destinations
              </Link>
              <Link href="/chat" className="hidden sm:inline-flex items-center bg-transparent border border-white/30 hover:border-white/50 text-white font-serif font-medium px-6 py-3 rounded-md transition">
                Start Planning
              </Link>
            </div>
            
            <div className="flex justify-start items-center space-x-10 text-white/90 font-serif mt-10">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#4a89dc]">
                    <path d="M12 2v20M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-serif">AI-Powered Precision</h3>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#4a89dc]">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-serif">Bespoke Experiences</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="container mx-auto px-6">
            <div className="bg-white/95 backdrop-blur-lg shadow-md border border-gray-100 p-6 md:p-8 rounded-sm">
              <div className="md:max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif text-marni-dark flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-[#4a89dc]/10 text-[#4a89dc]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                    Plan Your Journey
                  </h3>
                  <div className="hidden md:block">
                    <span className="text-gray-500 text-sm font-serif">
                      <span className="text-[#4a89dc] font-medium">Tip:</span> Try searching by experience like "cultural" or "relaxation"
                    </span>
                  </div>
                </div>
                <form onSubmit={(e) => { 
                  e.preventDefault();
                  const destination = (e.currentTarget.elements.namedItem('destination') as HTMLInputElement).value;
                  const date = (e.currentTarget.elements.namedItem('date') as HTMLInputElement).value;
                  
                  // API integration - making search request to server endpoints
                  fetch('/api/search/destinations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      destination, 
                      date,
                      useGemini: true,
                      useRapidAPI: true
                    })
                  })
                  .then(res => {
                    if (res.ok) {
                      window.location.href = `/destinations?q=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`;
                    } else {
                      console.error('Search error:', res.statusText);
                    }
                  })
                  .catch(err => {
                    console.error('API error:', err);
                  });
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-6">
                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center font-serif">
                        <Globe className="h-4 w-4 mr-1.5 text-[#4a89dc]" />
                        Destination
                      </label>
                      <div className="relative group">
                        <Input 
                          name="destination" 
                          placeholder="Where do you want to go?" 
                          className="pl-11 py-5 border-gray-200 focus:border-[#4a89dc] focus:ring-[#4a89dc]/10 shadow-sm group-hover:border-[#4a89dc]/50 transition-all font-serif" 
                          required 
                        />
                        <Map className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#4a89dc] transition-colors" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center font-serif">
                        <Calendar className="h-4 w-4 mr-1.5 text-[#4a89dc]" />
                        Travel Date
                      </label>
                      <div className="relative group">
                        <Input 
                          name="date" 
                          type="date" 
                          className="pl-11 py-5 border-gray-200 focus:border-[#4a89dc] focus:ring-[#4a89dc]/10 shadow-sm group-hover:border-[#4a89dc]/50 transition-all font-serif" 
                          required 
                        />
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#4a89dc] transition-colors" />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button 
                        type="submit" 
                        className="w-full py-5 bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center rounded"
                      >
                        <Search className="mr-2 h-5 w-5" /> Find Journeys
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500 font-serif">
                      Powered by <span className="font-semibold text-[#050b17]">JET AI</span> technology for personalized travel recommendations
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JetFlow Interactive Module */}
      <section className="py-24 bg-[#050b17]/5 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/10 text-[#050b17] text-sm font-serif mb-3">
              <Brain className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              INTERACTIVE DEMONSTRATION
            </div>
            <h2 className="text-4xl mb-3 font-display text-[#050b17]">Try JetFlow</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-serif">
              Experience the power of JET AI's decision optimization system with this simple demonstration. 
              Answer three questions to see a visual flow diagram tailored to your preferences.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 bg-gradient-to-br from-[#050b17] to-[#1a2b47]">
                <h3 className="text-white text-2xl font-display mb-4">Smart Flow Builder</h3>
                <p className="text-white/80 mb-6 font-serif">
                  Our AI analyzes your responses to create a personalized decision flow optimized for your 
                  preferences, schedule, and budget constraints.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#4a89dc] flex items-center justify-center mr-4 shrink-0">
                      <span className="text-white font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Answer Simple Questions</h4>
                      <p className="text-white/70 text-sm font-serif">Share your preferences, constraints, and goals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#4a89dc] flex items-center justify-center mr-4 shrink-0">
                      <span className="text-white font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">AI Processes Inputs</h4>
                      <p className="text-white/70 text-sm font-serif">Our AI evaluates numerous possibilities in seconds</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#4a89dc] flex items-center justify-center mr-4 shrink-0">
                      <span className="text-white font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">View Optimized Flow</h4>
                      <p className="text-white/70 text-sm font-serif">Receive a visual representation of your optimal path</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-white/50 text-sm font-serif">3 free tries without login</span>
                  <Link href="/planner" className="text-[#4a89dc] hover:text-white text-sm font-medium transition-colors">
                    Full Builder →
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-serif">What's your primary travel goal?</label>
                    <select className="w-full p-3 border border-gray-200 rounded-md focus:border-[#4a89dc] focus:ring-[#4a89dc]/10 font-serif">
                      <option value="">Select an option...</option>
                      <option value="relaxation">Relaxation & Leisure</option>
                      <option value="adventure">Adventure & Exploration</option>
                      <option value="culture">Cultural Immersion</option>
                      <option value="luxury">Luxury Experience</option>
                      <option value="budget">Budget Travel</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-serif">Your preferred trip duration?</label>
                    <select className="w-full p-3 border border-gray-200 rounded-md focus:border-[#4a89dc] focus:ring-[#4a89dc]/10 font-serif">
                      <option value="">Select an option...</option>
                      <option value="weekend">Weekend (2-3 days)</option>
                      <option value="short">Short trip (4-6 days)</option>
                      <option value="week">One week (7 days)</option>
                      <option value="extended">Extended (8-14 days)</option>
                      <option value="long">Long journey (15+ days)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-serif">What's your approximate budget?</label>
                    <select className="w-full p-3 border border-gray-200 rounded-md focus:border-[#4a89dc] focus:ring-[#4a89dc]/10 font-serif">
                      <option value="">Select an option...</option>
                      <option value="budget">Budget ($500-$1,000)</option>
                      <option value="moderate">Moderate ($1,000-$3,000)</option>
                      <option value="premium">Premium ($3,000-$5,000)</option>
                      <option value="luxury">Luxury ($5,000-$10,000)</option>
                      <option value="ultra">Ultra-luxury ($10,000+)</option>
                    </select>
                  </div>
                  
                  <button className="w-full bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center">
                    <Brain className="mr-2 h-5 w-5" /> Generate Flow
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-serif">
                      Full access to JetFlow available with <Link href="/login" className="text-[#4a89dc] hover:underline">login</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-14">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
                <Star className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
                CURATED DESTINATIONS
              </div>
              <h2 className="text-4xl mb-3 font-display text-[#050b17]">Exceptional Journeys</h2>
              <p className="text-gray-600 max-w-xl font-serif">Discover carefully selected destinations that promise transformative experiences, curated by our AI technology and endorsed by discerning travelers</p>
            </div>
            <Link href="/destinations" className="flex items-center text-[#4a89dc] font-medium mt-6 md:mt-0 px-5 py-2.5 border-b border-[#4a89dc]/30 hover:border-[#4a89dc] transition-all duration-200">
              View all destinations <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {/* Rest of the featured destinations section would continue */}
        </div>
      </section>
      
      {/* Additional sections would continue */}
      
      {/* Footer section would be at the end */}
      
      {/* AI Assistant Button (Fixed position) - Positioned at bottom right */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute inset-0 rounded-full bg-[#4a89dc] animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <button 
          onClick={() => setShowChat(true)}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#4a89dc] hover:bg-[#050b17] text-white shadow-lg border border-white/10 transition-all duration-300"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
      
      {/* AI Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-4xl p-0 h-[80vh] overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="bg-[#050b17] text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-[#4a89dc] rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl">JET AI Assistant</h3>
                  <p className="text-xs text-white/70 font-serif">Your intelligent travel companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <AIChat personality="travel-expert" voiceEnabled={false} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Onboarding Dialog */}
      {showOnboarding && (
        <SimpleOnboardingChat 
          onClose={() => setShowOnboarding(false)}
          onComplete={(userData) => {
            console.log('Onboarding complete:', userData);
            setShowOnboarding(false);
            // Save user data
            localStorage.setItem('jetai_user', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
          }}
        />
      )}
    </div>
  );
}