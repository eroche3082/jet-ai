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
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Cultural</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Historic</span>
                    <span className="px-2 py-1 bg-[#050b17]/5 text-[#4a89dc] text-xs font-serif">Temples</span>
                  </div>
                  <p className="text-[#4a89dc] font-medium text-lg">$1,450</p>
                </div>
                <p className="text-gray-600 mb-5 font-serif">Step back in time in Japan's former capital with its thousands of classical Buddhist temples, gardens, and traditional wooden houses.</p>
                <Link href="/destinations/kyoto" className="block w-full bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-300 rounded text-center">
                  <div className="flex items-center justify-center">
                    <Globe className="mr-2 h-4 w-4" /> Explore Kyoto
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Features */}
      <section className="py-24 relative overflow-hidden bg-[#050b17]/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              ARTIFICIAL INTELLIGENCE
            </div>
            <h2 className="text-4xl mb-5 font-display text-[#050b17]">Intelligent Travel Technology</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg font-serif">JET AI artfully combines sophisticated artificial intelligence with refined travel expertise to design personalized journeys that align with your distinctive preferences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-[#4a89dc]/20 hover:border-[#4a89dc] group rounded">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#4a89dc]/10 text-[#4a89dc] transform transition-transform group-hover:scale-105 duration-300 rounded-full">
                <Brain className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-[#4a89dc] transition-colors">Curated Recommendations</h3>
              <p className="text-gray-600 font-serif">Personalized destination selections tailored to your distinctive tastes, financial parameters, and travel preferences.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-[#4a89dc]/20 hover:border-[#4a89dc] group rounded">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#4a89dc]/10 text-[#4a89dc] transform transition-transform group-hover:scale-105 duration-300 rounded-full">
                <MapIcon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-[#4a89dc] transition-colors">Elegant Itineraries</h3>
              <p className="text-gray-600 font-serif">Meticulously crafted travel plans that gracefully adapt to your interests, time constraints, and unexpected discoveries.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-[#4a89dc]/20 hover:border-[#4a89dc] group rounded">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#4a89dc]/10 text-[#4a89dc] transform transition-transform group-hover:scale-105 duration-300 rounded-full">
                <Languages className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-[#4a89dc] transition-colors">Language Intelligence</h3>
              <p className="text-gray-600 font-serif">Dissolve communication barriers with precise translation in over 100 languages for seamless cultural engagement.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-[#4a89dc]/20 hover:border-[#4a89dc] group rounded">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#4a89dc]/10 text-[#4a89dc] transform transition-transform group-hover:scale-105 duration-300 rounded-full">
                <DollarSign className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-[#4a89dc] transition-colors">Value Optimization</h3>
              <p className="text-gray-600 font-serif">Our intelligent system continually evaluates flight, accommodation, and experience options to optimize the value of your investment.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/chat" className="inline-flex items-center bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-3 px-8 shadow-sm hover:shadow transition-all duration-300 rounded">
              <MessageCircle className="mr-2 h-5 w-5" /> Experience JET AI Assistant
            </Link>
          </div>
        </div>
      </section>
      
      {/* Travel Blog Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
                <BookOpen className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
                TRAVEL JOURNAL
              </div>
              <h2 className="text-4xl mb-3 font-display text-[#050b17]">From Our Travel Journal</h2>
              <p className="text-gray-600 font-serif">Curated insights, reflections, and narratives from seasoned travelers</p>
            </div>
            <Link href="/blog" className="flex items-center text-[#4a89dc] font-medium mt-6 md:mt-0 border-b border-[#4a89dc]/30 hover:border-[#4a89dc] transition-all duration-200">
              Explore all journal entries <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Hidden Gems in Paris" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-0 bg-[#050b17]/80 text-white text-xs font-serif uppercase px-3 py-1">
                  City Guide
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <Calendar className="h-4 w-4 mr-2 text-[#4a89dc]" />
                  April 10, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-[#050b17]">10 Hidden Gems in Paris You Need to Visit</h3>
                <p className="text-gray-600 mb-4 font-serif">Discover the lesser-known spots in Paris that most tourists miss but locals cherish.</p>
                <Link href="/blog/1" className="text-[#4a89dc] font-medium hover:text-[#050b17] transition-colors duration-200 font-serif">Read More</Link>
              </div>
            </div>
            
            {/* Blog Post 2 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Food Adventures in Thailand" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-0 bg-[#050b17]/80 text-white text-xs font-serif uppercase px-3 py-1">
                  Culinary Journey
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <Calendar className="h-4 w-4 mr-2 text-[#4a89dc]" />
                  April 5, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-[#050b17]">Thailand's Street Markets: A Culinary Exploration</h3>
                <p className="text-gray-600 mb-4 font-serif">From aromatic curries to delicate mango with sticky rice, a journey through Thailand's vibrant street food culture.</p>
                <Link href="/blog/2" className="text-[#4a89dc] font-medium hover:text-[#050b17] transition-colors duration-200 font-serif">Read More</Link>
              </div>
            </div>
            
            {/* Blog Post 3 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Solo Travel" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-0 bg-[#050b17]/80 text-white text-xs font-serif uppercase px-3 py-1">
                  Travel Philosophy
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <Calendar className="h-4 w-4 mr-2 text-[#4a89dc]" />
                  March 29, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-[#050b17]">The Art of Solo Travel: Embracing Solitude</h3>
                <p className="text-gray-600 mb-4 font-serif">Insightful reflections on planning, personal safety, and creating meaningful connections while traveling alone.</p>
                <Link href="/blog/3" className="text-[#4a89dc] font-medium hover:text-[#050b17] transition-colors duration-200 font-serif">Read More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-[#050b17]/5 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80')] bg-cover bg-center opacity-3"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              TRAVELER EXPERIENCES
            </div>
            <h2 className="text-4xl mb-3 font-display text-[#050b17]">Distinguished Perspectives</h2>
            <p className="text-gray-600 max-w-3xl mx-auto font-serif">Authentic reflections from discerning travelers who entrusted their journey planning to JET AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border-t border-[#4a89dc]/20 rounded">
              <div className="flex items-center text-[#4a89dc] mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 font-serif">"JET AI transformed my approach to vacation planning. The personalized itinerary eliminated hours of research and revealed hidden destinations I would never have discovered through conventional means."</p>
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden mr-4 border border-gray-100 rounded-full">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" 
                    alt="Sarah Johnson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-[#050b17]">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 font-serif">Travel Journalist</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border-t border-[#4a89dc]/20 rounded">
              <div className="flex items-center text-[#4a89dc] mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 font-serif">"For the discerning business traveler, JET AI is indispensable. The sophisticated flight comparison system generated substantial savings, while the AI assistant elegantly resolved language complexities."</p>
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden mr-4 border border-gray-100 rounded-full">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                    alt="Michael Chen" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-[#050b17]">Michael Chen</h4>
                  <p className="text-sm text-gray-600 font-serif">Executive Traveler</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border-t border-[#4a89dc]/20 rounded">
              <div className="flex items-center text-[#4a89dc] mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 font-serif">"Coordinating multi-generational family travel once presented significant challenges. JET AI has transformed this into a refined experience. Their curated recommendations for family-appropriate activities proved impeccable."</p>
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden mr-4 border border-gray-100 rounded-full">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" 
                    alt="Emma Rodriguez" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-[#050b17]">Emma Rodriguez</h4>
                  <p className="text-sm text-gray-600 font-serif">Family Travel Coordinator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Plans */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
              <DollarSign className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              MEMBERSHIP OPTIONS
            </div>
            <h2 className="text-4xl mb-3 font-display text-[#050b17]">Select Your Travel Experience</h2>
            <p className="text-gray-600 max-w-3xl mx-auto font-serif">Choose the optimal tier to elevate your journey planning with JET AI's sophisticated features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative rounded">
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-2xl font-display text-center mb-2 text-[#050b17]">Voyager</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-display text-[#050b17]">$0</span>
                  <span className="text-gray-600 font-serif">/month</span>
                </div>
                <p className="text-gray-600 text-center font-serif">For casual exploration</p>
              </div>
              <div className="p-8">
                <ul className="space-y-5 font-serif text-[#050b17]/90">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Essential destination search</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>5 AI assistant queries per day</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Standard itinerary framework</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Traveler community access</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-5 w-5 text-gray-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Advanced flight comparisons</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-5 w-5 text-gray-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Real-time language translation</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/pricing/voyager" className="block w-full bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-2.5 shadow-sm hover:shadow transition-colors duration-300 rounded text-center">
                    Begin Your Journey
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-t border-[#4a89dc] relative rounded">
              <div className="absolute top-0 right-0 bg-[#4a89dc] text-white text-xs py-1 px-3 font-medium">
                <span>DISTINGUISHED CHOICE</span>
              </div>
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-2xl font-display text-center mb-2 text-[#050b17]">Connoisseur</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-display text-[#050b17]">$9.99</span>
                  <span className="text-gray-600 font-serif">/month</span>
                </div>
                <p className="text-gray-600 text-center font-serif">For discerning travelers</p>
              </div>
              <div className="p-8">
                <ul className="space-y-5 font-serif text-[#050b17]/90">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>All Voyager tier features</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited AI assistant queries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Enhanced flight & accommodation analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Real-time language translation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Bespoke itinerary curation</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-5 w-5 text-gray-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Dedicated concierge assistance</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/pricing/connoisseur" className="block w-full bg-[#4a89dc] hover:bg-[#050b17] text-white font-medium py-2.5 shadow-sm hover:shadow transition-colors duration-300 rounded text-center">
                    Elevate Your Experience
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative rounded">
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-2xl font-display text-center mb-2 text-[#050b17]">Luminary</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-display text-[#050b17]">$29.99</span>
                  <span className="text-gray-600 font-serif">/month</span>
                </div>
                <p className="text-gray-600 text-center font-serif">For distinguished groups & executives</p>
              </div>
              <div className="p-8">
                <ul className="space-y-5 font-serif text-[#050b17]/90">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>All Connoisseur tier privileges</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Multi-member access (up to 5 profiles)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Collective itinerary orchestration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Sophisticated expense management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority concierge assistance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4a89dc] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Personal account consultant</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/pricing/luminary" className="block w-full bg-[#050b17] hover:bg-[#4a89dc] text-white font-medium py-2.5 shadow-sm hover:shadow transition-colors duration-300 rounded text-center">
                    Request Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter & Onboarding CTA */}
      <section className="py-16 bg-[#050b17] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#050b17]/50 backdrop-blur-sm text-white text-sm font-serif mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              PERSONALIZED TRAVEL
            </div>
            <h2 className="text-3xl mb-3 font-display text-white">Unlock Your Personalized Travel Experience</h2>
            <p className="mb-8 font-serif text-white/80">
              Create your profile for AI-tailored journeys designed exclusively for your preferences, or subscribe to receive our curated travel insights
            </p>
            
            {/* Two options: Create profile or subscribe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-[#050b17]/40 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#4a89dc]/30 transition-all">
                <div className="mb-4 w-16 h-16 bg-[#4a89dc]/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-[#4a89dc]" />
                </div>
                <h3 className="text-xl font-display mb-3">Create Your Travel Profile</h3>
                <p className="text-white/70 mb-6 font-serif text-sm">
                  Complete a brief personalization process to receive AI recommendations tailored to your unique travel preferences
                </p>
                <Link href="/onboarding">
                  <Button className="w-full bg-[#4a89dc] hover:bg-white hover:text-[#050b17] text-white font-medium transition-colors duration-300 rounded">
                    Start Personalization
                  </Button>
                </Link>
              </div>
              
              <div className="bg-[#050b17]/40 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#4a89dc]/30 transition-all">
                <div className="mb-4 w-16 h-16 bg-[#4a89dc]/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-[#4a89dc]" />
                </div>
                <h3 className="text-xl font-display mb-3">Subscribe to Updates</h3>
                <p className="text-white/70 mb-4 font-serif text-sm">
                  Receive refined travel commentary, exclusive destination insights, and AI recommendations for the discerning traveler
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 border border-white/20 focus:border-[#4a89dc] focus:ring-[#4a89dc]/20 font-serif rounded"
                  />
                  <Button className="bg-[#4a89dc] hover:bg-white hover:text-[#050b17] text-white font-medium transition-colors duration-300 rounded">
                    Subscribe
                  </Button>
                </div>
                <p className="mt-3 text-xs font-serif text-white/50 text-left">
                  By subscribing, you'll receive our weekly digest of exceptional journeys. You may unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      
      {/* Footer */}
      <footer className="bg-[#050b17] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-6 group">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-[#4a89dc] transition-transform duration-300 group-hover:scale-110" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <div className="ml-2">
                  <h3 className="font-display text-2xl tracking-tight">JET AI</h3>
                  <div className="text-xs text-white/70 -mt-1 font-serif">TRAVEL COMPANION</div>
                </div>
              </div>
              <p className="text-white/70 font-serif leading-relaxed">
                Your distinguished AI-powered travel companion. Discover exceptional destinations, curate bespoke itineraries, and experience the world with unparalleled sophistication.
              </p>
              <div className="flex space-x-4 mt-6">
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
              <h4 className="font-display text-lg mb-5 text-white">Navigation</h4>
              <ul className="space-y-3 font-serif">
                <li><Link href="/" className="text-white/70 hover:text-[#4a89dc] transition-colors">Home</Link></li>
                <li><Link href="/destinations" className="text-white/70 hover:text-[#4a89dc] transition-colors">Destinations</Link></li>
                <li><Link href="/blog" className="text-white/70 hover:text-[#4a89dc] transition-colors">Travel Journal</Link></li>
                <li><Link href="/about" className="text-white/70 hover:text-[#4a89dc] transition-colors">About JET AI</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-[#4a89dc] transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display text-lg mb-5 text-white">Services</h4>
              <ul className="space-y-3 font-serif">
                <li><Link href="/chat" className="text-white/70 hover:text-[#4a89dc] transition-colors">AI Concierge</Link></li>
                <li><Link href="/itinerary" className="text-white/70 hover:text-[#4a89dc] transition-colors">Itinerary Curator</Link></li>
                <li><Link href="/translator" className="text-white/70 hover:text-[#4a89dc] transition-colors">Language Translation</Link></li>
                <li><Link href="/pricing" className="text-white/70 hover:text-[#4a89dc] transition-colors">Membership Options</Link></li>
                <li><Link href="/faq" className="text-white/70 hover:text-[#4a89dc] transition-colors">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display text-lg mb-5 text-white">Connect</h4>
              <ul className="space-y-4 text-white/70 font-serif">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 mt-0.5 text-[#4a89dc]" />
                  <span>concierge@jetai.travel</span>
                </li>
                <li className="flex items-start">
                  <MessageSquare className="h-5 w-5 mr-3 mt-0.5 text-[#4a89dc]" />
                  <span>Live assistance available</span>
                </li>
                <li className="mt-6">
                  <Button variant="outline" className="border-white/20 hover:border-[#4a89dc] text-white hover:bg-[#4a89dc]/10 hover:text-[#4a89dc] transition-all duration-300 font-serif rounded">
                    <Link href="/contact" className="flex items-center">
                      Request Information
                    </Link>
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
          <div className="absolute inset-0 rounded-full bg-[#4a89dc] animate-pulse opacity-30"></div>
          <MessageSquare className="h-6 w-6 text-white" />
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