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
  Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SimpleOnboardingChat from "@/components/SimpleOnboardingChat";

export default function LightLandingPage() {
  const [showChat, setShowChat] = useState(false);
  
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
      
      {/* Hero Section - Bridge Inspired */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Destination Card 1 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 rounded">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542259009477-d625272157b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Bali, Indonesia" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-[#050b17]/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border-l border-[#4a89dc]">
                    TRENDING
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#4a89dc]">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-serif">(256 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-display">Bali, Indonesia</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Beach</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Culture</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Nature</span>
                  </div>
                  <p className="text-[#4a89dc] font-medium text-lg">$1,200</p>
                </div>
                <p className="text-gray-600 mb-5 font-serif">Experience the perfect blend of tranquil beaches, lush rice terraces, and vibrant cultural rituals on this magical island.</p>
                <Link href="/destinations/bali" className="block w-full bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-300 rounded text-center">
                  <div className="flex items-center justify-center">
                    <Compass className="mr-2 h-4 w-4" /> Explore Bali
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Destination Card 2 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 rounded">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1830&q=80" 
                  alt="Venice, Italy" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#4a89dc]">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-serif">(189 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-display">Venice, Italy</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Historic</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Romantic</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">City</span>
                  </div>
                  <p className="text-[#4a89dc] font-medium text-lg">$950</p>
                </div>
                <p className="text-gray-600 mb-5 font-serif">Navigate through the romantic canals of this unique city built on water, with its architectural marvels and timeless charm.</p>
                <Link href="/destinations/venice" className="block w-full bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-300 rounded text-center">
                  <div className="flex items-center justify-center">
                    <Map className="mr-2 h-4 w-4" /> Explore Venice
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Destination Card 3 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 rounded">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1822&q=80" 
                  alt="Kyoto, Japan" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-[#050b17]/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border-l border-[#4a89dc]">
                    BEST VALUE
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#4a89dc]">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-serif">(221 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-display">Kyoto, Japan</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Traditional</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Temples</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Cherry Blossoms</span>
                  </div>
                  <p className="text-[#4a89dc] font-medium text-lg">$1,450</p>
                </div>
                <p className="text-gray-600 mb-5 font-serif">Step back in time in Japan's former imperial capital, with its stunning temples, gardens, geisha districts, and cultural treasures.</p>
                <Link href="/destinations/kyoto" className="block w-full bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-300 rounded text-center">
                  <div className="flex items-center justify-center">
                    <MapIcon className="mr-2 h-4 w-4" /> Explore Kyoto
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI-Powered Travel Planning */}
      <section className="py-24 relative overflow-hidden bg-[#050b17]/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="relative">
                <div className="w-full h-[450px] rounded-md overflow-hidden border border-gray-200 shadow-lg bg-white">
                  <div className="bg-[#050b17] text-white p-3 flex items-center">
                    <div className="bg-[#4a89dc] rounded-full h-8 w-8 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white">
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.75 2.25"></path>
                        <path d="M15.75 7.5 21 12l-2.25 2.25"></path>
                        <path d="M12 3v6"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold">JET AI Travel Planner</span>
                      <div className="text-xs text-white/70 -mt-0.5">Powered by Google Vertex AI</div>
                    </div>
                  </div>
                  
                  <div className="p-4 h-[350px] overflow-auto bg-white">
                    <div className="flex items-start mb-4">
                      <div className="mr-2 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#050b17]">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none">
                        <p className="text-gray-800">Hi there! I'm JET AI, your travel assistant. Where are you planning to go?</p>
                        <p className="text-gray-500 text-xs mt-1">11:03 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-end mb-4">
                      <div className="bg-[#4a89dc] p-3 rounded-lg rounded-tr-none text-white">
                        <p>I want to visit Japan for 10 days in cherry blossom season</p>
                        <p className="text-white/70 text-xs mt-1">11:04 AM</p>
                      </div>
                      <div className="ml-2 bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#050b17]">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="mr-2 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#050b17]">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none">
                        <p className="text-gray-800">Great choice! Cherry blossom season in Japan is typically from late March to early April. Here's a 10-day itinerary I've optimized based on your interests and seasonal factors:</p>
                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                          <h4 className="font-medium text-[#050b17]">Tokyo (4 days)</h4>
                          <ul className="mt-1 text-sm text-gray-600 space-y-1">
                            <li>• Shinjuku Gyoen National Garden (prime cherry blossom viewing)</li>
                            <li>• Ueno Park Festival</li>
                            <li>• Meguro River cherry tree walk</li>
                            <li>• Day trip to Kamakura/Nikko</li>
                          </ul>
                        </div>
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <h4 className="font-medium text-[#050b17]">Kyoto (4 days)</h4>
                          <ul className="mt-1 text-sm text-gray-600 space-y-1">
                            <li>• Philosopher's Path when trees are in full bloom</li>
                            <li>• Maruyama Park evening illuminations</li>
                            <li>• Arashiyama bamboo grove & cherry trees</li>
                            <li>• Day trip to Nara Park</li>
                          </ul>
                        </div>
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <h4 className="font-medium text-[#050b17]">Osaka (2 days)</h4>
                          <ul className="mt-1 text-sm text-gray-600 space-y-1">
                            <li>• Osaka Castle Park blossoms</li>
                            <li>• Expo '70 Commemorative Park</li>
                            <li>• Food tour in Dotonbori</li>
                          </ul>
                        </div>
                        <p className="text-gray-500 text-xs mt-3">11:05 AM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border-t border-gray-200 flex items-center">
                    <Input 
                      type="text" 
                      placeholder="Type your travel question..." 
                      className="flex-1 border-gray-200 focus:border-[#4a89dc] focus:ring-[#4a89dc]/10"
                    />
                    <button className="ml-2 p-2 rounded-full bg-[#4a89dc] text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                        <path d="M22 2 11 13"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-[#050b17]/5 z-[-1]"></div>
                <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-[#4a89dc]/10 z-[-1]"></div>
              </div>
            </div>
            
            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/10 text-[#050b17] text-sm font-serif mb-3">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
                AI-POWERED ITINERARIES
              </div>
              <h2 className="text-4xl mb-6 font-display text-[#050b17]">Smart Travel Planning at Your Fingertips</h2>
              <p className="text-gray-600 mb-8 font-serif text-lg">Our AI technology analyzes thousands of data points to create personalized travel plans that consider your preferences, current weather conditions, seasonal events, and local insights.</p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#4a89dc]/10 flex-shrink-0 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4a89dc] h-5 w-5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a10 10 0 0 1 10 10"></path>
                      <path d="M12 12 7 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 font-medium text-[#050b17]">Real-Time Optimizations</h3>
                    <p className="text-gray-600 font-serif">
                      Optimize your daily activities with AI-powered scheduling that considers opening hours, 
                      travel time, and crowd levels.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#4a89dc]/10 flex-shrink-0 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4a89dc] h-5 w-5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 font-medium text-[#050b17]">Personalized Safety</h3>
                    <p className="text-gray-600 font-serif">
                      Receive personalized safety recommendations and real-time alerts based on your location 
                      and current conditions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#4a89dc]/10 flex-shrink-0 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4a89dc] h-5 w-5">
                      <path d="M5.8 11.3 2 22l10.7-3.79"></path>
                      <path d="M4 3h.01"></path>
                      <path d="M22 8h.01"></path>
                      <path d="M15 2h.01"></path>
                      <path d="M22 20h.01"></path>
                      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path>
                      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path>
                      <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path>
                      <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 font-medium text-[#050b17]">Cultural Intelligence</h3>
                    <p className="text-gray-600 font-serif">
                      Gain insights into local customs, traditions, and hidden gems that only locals know about.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Button className="bg-[#050b17] hover:bg-[#4a89dc] text-white shadow-lg transition-all duration-300 px-6 py-5 font-serif">
                  <MessageCircle className="h-5 w-5 mr-2" /> 
                  Start Planning with AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travel Techniques */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/10 text-[#050b17] text-sm font-serif mb-3">
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              SMART TRAVEL TECHNIQUES
            </div>
            <h2 className="text-4xl mb-4 font-display text-[#050b17]">Reimagine How You Travel</h2>
            <p className="text-gray-600 max-w-3xl mx-auto font-serif">
              Our AI-powered platform doesn't just find destinations; it transforms how you experience them with cutting-edge technologies and personalized insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#4a89dc] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-[#4a89dc]/10 flex items-center justify-center mb-5">
                <Languages className="h-6 w-6 text-[#4a89dc]" />
              </div>
              <h3 className="text-xl font-display mb-3 text-[#050b17]">Multilingual Support</h3>
              <p className="text-gray-600 font-serif">
                Break through language barriers with real-time translation and cultural context. Our AI assistant speaks 38 languages and understands regional dialects.
              </p>
              <div className="mt-5 pt-5 border-t border-gray-100">
                <span className="text-[#4a89dc] text-sm font-medium flex items-center">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#4a89dc] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-[#4a89dc]/10 flex items-center justify-center mb-5">
                <DollarSign className="h-6 w-6 text-[#4a89dc]" />
              </div>
              <h3 className="text-xl font-display mb-3 text-[#050b17]">Budget Optimization</h3>
              <p className="text-gray-600 font-serif">
                Our AI tracks pricing trends and predicts the best times to book flights, accommodations, and activities to save you up to 35% on travel costs.
              </p>
              <div className="mt-5 pt-5 border-t border-gray-100">
                <span className="text-[#4a89dc] text-sm font-medium flex items-center">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#4a89dc] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-[#4a89dc]/10 flex items-center justify-center mb-5">
                <Heart className="h-6 w-6 text-[#4a89dc]" />
              </div>
              <h3 className="text-xl font-display mb-3 text-[#050b17]">Emotional Intelligence</h3>
              <p className="text-gray-600 font-serif">
                Experience a travel companion that understands and responds to your emotions, helping you navigate the psychological aspects of travel.
              </p>
              <div className="mt-5 pt-5 border-t border-gray-100">
                <span className="text-[#4a89dc] text-sm font-medium flex items-center">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/features" className="inline-flex items-center text-[#4a89dc] hover:text-[#3a79cc] font-medium border-b border-[#4a89dc]/30 hover:border-[#4a89dc] pb-1 transition-all">
              Explore all smart travel features <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-[#050b17]/5 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/10 text-[#050b17] text-sm font-serif mb-3">
              <User className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              TRAVELER TESTIMONIALS
            </div>
            <h2 className="text-4xl mb-4 font-display text-[#050b17]">Experiences from JET AI Travelers</h2>
            <p className="text-gray-600 max-w-3xl mx-auto font-serif">
              Discover how fellow travelers are transforming their journeys with our AI-powered platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#4a89dc]">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm font-serif">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 font-serif">
                "JET AI transformed my trip to Japan. The AI suggested a hidden cherry blossom viewing spot in Kyoto that wasn't in any guidebook, and it became the highlight of my journey."
              </p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Sarah J." className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="text-[#050b17] font-medium">Sarah J.</h4>
                  <p className="text-gray-500 text-sm font-serif">Tokyo & Kyoto Explorer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#4a89dc]">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm font-serif">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 font-serif">
                "As someone with dietary restrictions, traveling abroad was always stressful. JET AI not only found restaurants that could accommodate my needs but even translated my requirements into perfect Italian!"
              </p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Marco T." className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="text-[#050b17] font-medium">Marco T.</h4>
                  <p className="text-gray-500 text-sm font-serif">Italian Food Explorer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#4a89dc]">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm font-serif">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 font-serif">
                "I was skeptical about an AI travel companion, but JET AI felt like traveling with a knowledgeable friend. It adjusted our itinerary when unexpected rain hit Bali and saved our beach vacation."
              </p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Priya M." className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="text-[#050b17] font-medium">Priya M.</h4>
                  <p className="text-gray-500 text-sm font-serif">Adventure Traveler</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#050b17] via-[#4a89dc] to-[#050b17]"></div>
            <h3 className="text-2xl font-display mb-6 text-[#050b17]">Join Thousands of Satisfied Travelers</h3>
            <p className="text-gray-600 mb-8 font-serif">
              Experience the future of travel with JET AI. Create your free account today and begin your journey with intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-[#050b17] hover:bg-[#4a89dc] text-white px-8 py-3 font-serif">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-[#4a89dc] text-[#4a89dc] hover:bg-[#4a89dc]/5 px-8 py-3 font-serif">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog & Resources */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-14">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
                <BookOpen className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
                TRAVEL INSIGHTS
              </div>
              <h2 className="text-4xl mb-3 font-display text-[#050b17]">Latest From Our Blog</h2>
              <p className="text-gray-600 max-w-xl font-serif">Discover travel tips, destination insights, and the latest in AI travel technology</p>
            </div>
            <Link href="/blog" className="flex items-center text-[#4a89dc] font-medium px-5 py-2.5 border-b border-[#4a89dc]/30 hover:border-[#4a89dc] transition-all duration-200">
              View all articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Card 1 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border border-gray-100 group">
              <div className="relative h-52 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="AI in Travel Planning" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-[#050b17]/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border-l border-[#4a89dc]">
                    TRAVEL TECH
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  April 10, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-[#050b17] group-hover:text-[#4a89dc] transition-colors">
                  <Link href="/blog/ai-travel-planning">How AI is Revolutionizing Travel Planning in 2025</Link>
                </h3>
                <p className="text-gray-600 mb-5 font-serif">Discover how artificial intelligence is transforming the way we plan, experience, and remember our journeys around the world.</p>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Elena Watson" className="w-8 h-8 rounded-full mr-3" />
                  <div className="text-sm">
                    <p className="text-[#050b17] font-medium">Elena Watson</p>
                    <p className="text-gray-500 text-xs font-serif">Travel Tech Editor</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Blog Card 2 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border border-gray-100 group">
              <div className="relative h-52 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Hidden Gems in Japan" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-[#050b17]/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border-l border-[#4a89dc]">
                    DESTINATIONS
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  April 5, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-[#050b17] group-hover:text-[#4a89dc] transition-colors">
                  <Link href="/blog/hidden-gems-japan">10 Hidden Gems in Japan Only Locals Know About</Link>
                </h3>
                <p className="text-gray-600 mb-5 font-serif">Venture beyond Tokyo and Kyoto to discover these authentic Japanese experiences curated with our AI's cultural intelligence system.</p>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Takeshi Yamada" className="w-8 h-8 rounded-full mr-3" />
                  <div className="text-sm">
                    <p className="text-[#050b17] font-medium">Takeshi Yamada</p>
                    <p className="text-gray-500 text-xs font-serif">Japan Specialist</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Blog Card 3 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border border-gray-100 group">
              <div className="relative h-52 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80" 
                  alt="Budget Travel" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-[#050b17]/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border-l border-[#4a89dc]">
                    TRAVEL TIPS
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  March 28, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-[#050b17] group-hover:text-[#4a89dc] transition-colors">
                  <Link href="/blog/budget-travel-ai">How to Travel Europe on $50 a Day with AI Assistance</Link>
                </h3>
                <p className="text-gray-600 mb-5 font-serif">Learn how our budget optimization algorithms can help you find incredible deals, time your bookings perfectly, and experience Europe affordably.</p>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Sophia Martinez" className="w-8 h-8 rounded-full mr-3" />
                  <div className="text-sm">
                    <p className="text-[#050b17] font-medium">Sophia Martinez</p>
                    <p className="text-gray-500 text-xs font-serif">Budget Travel Expert</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-[#050b17] text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-white/5 text-white text-sm font-serif mb-3">
                <Mail className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
                STAY CONNECTED
              </div>
              <h2 className="text-4xl mb-6 font-display text-white">Get Travel Intelligence in Your Inbox</h2>
              <p className="text-white/80 mb-6 max-w-xl lg:mx-0 mx-auto font-serif">
                Subscribe to our newsletter for AI-powered travel insights, destination guides, and exclusive offers.
              </p>
              <div className="flex space-x-6 justify-center lg:justify-start">
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full max-w-md">
              <form className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <div className="mb-4">
                  <label className="block text-white/80 text-sm font-serif mb-2">Your Name</label>
                  <Input 
                    placeholder="Enter your name" 
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#4a89dc] focus:ring-[#4a89dc]/20"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-white/80 text-sm font-serif mb-2">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#4a89dc] focus:ring-[#4a89dc]/20"
                  />
                </div>
                <div className="flex flex-col">
                  <Button className="bg-[#4a89dc] hover:bg-white hover:text-[#050b17] text-white transition-colors duration-300 shadow-lg font-serif">
                    Subscribe to Newsletter
                  </Button>
                  <div className="text-center mt-3">
                    <span className="text-xs text-white/50 font-serif">We respect your privacy. Unsubscribe anytime.</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4a89dc]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#4a89dc]/10 rounded-full blur-3xl"></div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#050b17] text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
            <div>
              <div className="flex items-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <h3 className="ml-2 font-display text-xl">JET AI</h3>
              </div>
              <p className="text-white/70 mb-6 font-serif">Transforming travel with cutting-edge AI technology for personalized, intelligent journeys around the globe.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-[#4a89dc] transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-display mb-6">Company</h3>
              <ul className="space-y-4 font-serif">
                <li>
                  <Link href="/about" className="text-white/70 hover:text-[#4a89dc] transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/mission" className="text-white/70 hover:text-[#4a89dc] transition-colors">Our Mission</Link>
                </li>
                <li>
                  <Link href="/team" className="text-white/70 hover:text-[#4a89dc] transition-colors">Meet the Team</Link>
                </li>
                <li>
                  <Link href="/careers" className="text-white/70 hover:text-[#4a89dc] transition-colors">Careers</Link>
                </li>
                <li>
                  <Link href="/press" className="text-white/70 hover:text-[#4a89dc] transition-colors">Press & Media</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-display mb-6">Features</h3>
              <ul className="space-y-4 font-serif">
                <li>
                  <Link href="/features/ai-planning" className="text-white/70 hover:text-[#4a89dc] transition-colors">AI Travel Planning</Link>
                </li>
                <li>
                  <Link href="/features/translation" className="text-white/70 hover:text-[#4a89dc] transition-colors">Real-time Translation</Link>
                </li>
                <li>
                  <Link href="/features/budget" className="text-white/70 hover:text-[#4a89dc] transition-colors">Budget Optimization</Link>
                </li>
                <li>
                  <Link href="/features/safety" className="text-white/70 hover:text-[#4a89dc] transition-colors">Personalized Safety</Link>
                </li>
                <li>
                  <Link href="/features" className="text-white/70 hover:text-[#4a89dc] transition-colors">All Features</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-display mb-6">Support</h3>
              <ul className="space-y-4 font-serif">
                <li>
                  <Link href="/help" className="text-white/70 hover:text-[#4a89dc] transition-colors">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-[#4a89dc] transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-white/70 hover:text-[#4a89dc] transition-colors">FAQs</Link>
                </li>
                <li>
                  <Link href="/community" className="text-white/70 hover:text-[#4a89dc] transition-colors">Community</Link>
                </li>
                <li>
                  <Button variant="outline" className="text-[#4a89dc] border-[#4a89dc] hover:bg-[#4a89dc] hover:text-white">
                    Get Support
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-white/50 font-serif">© 2025 JET AI. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0 font-serif">
              <Link href="/terms" className="text-white/50 hover:text-[#4a89dc] transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-white/50 hover:text-[#4a89dc] transition-colors">Privacy Policy</Link>
              <Link href="/cookies" className="text-white/50 hover:text-[#4a89dc] transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
      
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
      
      {/* Simple Onboarding Chat Dialog */}
      {showChat && (
        <SimpleOnboardingChat 
          onClose={() => setShowChat(false)}
          onComplete={(userData: any) => {
            console.log("Onboarding complete with user data:", userData);
            setShowChat(false);
            // Store user data and redirect to the chat demo page
            localStorage.setItem('jetai_user', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = '/chat-demo';
          }}
        />
      )}
    </div>
  );
}