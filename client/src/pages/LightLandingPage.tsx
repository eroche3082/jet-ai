import { Link } from "wouter";
import { 
  Compass, 
  Map, 
  Calendar, 
  Plane, 
  Globe, 
  Heart, 
  Upload, 
  Sparkles,
  ArrowRight,
  Search,
  Star,
  User,
  Mail,
  MessageSquare,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LightLandingPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#ff6b35]/95 to-orange-600/95 backdrop-blur-sm text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-0 group">
              <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <div className="ml-2">
                <h1 className="font-bold text-2xl tracking-tight">JET AI</h1>
                <div className="text-xs text-white/70 -mt-1 font-medium">TRAVEL COMPANION</div>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <Link href="/" className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors">Home</Link>
              <Link href="/destinations" className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors">Destinations</Link>
              <Link href="/blog" className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors">Travel Blog</Link>
              <Link href="/about" className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors">About Us</Link>
              <Link href="/chat" className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors">AI Assistant</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#ff6b35] transition-all duration-300 font-medium">
                  Sign In
                </Button>
              </Link>
              <button className="md:hidden text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[650px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517400508447-f8dd518b86db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/80 via-[#ff6b35]/30 to-transparent"></div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm px-5 py-1 rounded-full inline-flex items-center mb-6 border border-white/20">
              <div className="h-2.5 w-2.5 rounded-full bg-white/80 mr-2 animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium tracking-wide">AI-POWERED ADVENTURE PLANNING</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
              Discover the World <span className="text-yellow-400">Your Way</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-xl leading-relaxed drop-shadow-sm">
              JET AI combines cutting-edge artificial intelligence with seasoned travel expertise to craft your perfect adventure.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-white text-[#ff6b35] hover:bg-yellow-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 rounded-full px-8 font-bold">
                <Link href="/destinations" className="flex items-center">
                  <Compass className="mr-2 h-5 w-5" /> Explore Destinations
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 rounded-full px-8">
                <Link href="/chat" className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" /> Talk to AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="container mx-auto px-6">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
              <div className="md:max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-[#ff6b35]/10 text-[#ff6b35]">
                      <Plane className="h-5 w-5" />
                    </div>
                    Plan Your Dream Trip
                  </h3>
                  <div className="hidden md:block">
                    <span className="text-gray-500 text-sm">
                      <span className="text-[#ff6b35] font-semibold">Tip:</span> Try searching by activity type like "beaches" or "hiking"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Globe className="h-4 w-4 mr-1.5 text-[#ff6b35]" />
                        Destination
                      </label>
                      <div className="relative group">
                        <Input 
                          name="destination" 
                          placeholder="Where do you want to go?" 
                          className="pl-11 py-6 rounded-xl border-gray-200 focus:border-[#ff6b35] focus:ring-[#ff6b35]/10 shadow-sm group-hover:border-[#ff6b35]/50 transition-all" 
                          required 
                        />
                        <Map className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#ff6b35] transition-colors" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-[#ff6b35]" />
                        Travel Date
                      </label>
                      <div className="relative group">
                        <Input 
                          name="date" 
                          type="date" 
                          className="pl-11 py-6 rounded-xl border-gray-200 focus:border-[#ff6b35] focus:ring-[#ff6b35]/10 shadow-sm group-hover:border-[#ff6b35]/50 transition-all" 
                          required 
                        />
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#ff6b35] transition-colors" />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <Button 
                        type="submit" 
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-[#ff6b35] to-orange-500 hover:from-orange-500 hover:to-[#ff6b35] text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] duration-300"
                      >
                        <Search className="mr-2 h-5 w-5" /> Find Adventures
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500">
                      Powered by <span className="font-semibold">JET AI</span> technology for the best travel recommendations
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50/80">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-14">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center px-4 py-1 bg-[#ff6b35]/10 text-[#ff6b35] rounded-full text-sm font-semibold mb-3">
                <Star className="h-3.5 w-3.5 mr-1.5 fill-[#ff6b35]" /> 
                TOP-RATED DESTINATIONS
              </div>
              <h2 className="text-4xl font-bold mb-3 font-display">Trending Adventures</h2>
              <p className="text-gray-600 max-w-xl">Discover destinations that are captivating travelers worldwide, curated by our AI technology and verified by traveler experiences</p>
            </div>
            <Link href="/destinations" className="flex items-center text-[#ff6b35] font-bold mt-6 md:mt-0 px-5 py-2.5 rounded-full border-2 border-[#ff6b35]/20 hover:bg-[#ff6b35]/5 hover:border-[#ff6b35]/30 transition-all duration-300">
              View all destinations <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Destination Card 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542259009477-d625272157b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Bali, Indonesia" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span className="ml-1 text-sm">(256 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-bold">Bali, Indonesia</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#3a55e7] font-semibold">Beach, Culture, Nature</p>
                  <p className="text-green-600 font-semibold">$1,200</p>
                </div>
                <p className="text-gray-600 mb-4">Experience the perfect blend of tranquil beaches, lush rice terraces, and vibrant cultural rituals on this magical island.</p>
                <Button className="w-full bg-[#3a55e7] hover:bg-[#2b3fbb]">View Details</Button>
              </div>
            </div>
            
            {/* Destination Card 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1830&q=80" 
                  alt="Venice, Italy" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span className="ml-1 text-sm">(189 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-bold">Venice, Italy</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#3a55e7] font-semibold">Historic, Romantic, City</p>
                  <p className="text-green-600 font-semibold">$950</p>
                </div>
                <p className="text-gray-600 mb-4">Navigate through the romantic canals of this unique city built on water, with its architectural marvels and timeless charm.</p>
                <Button className="w-full bg-[#3a55e7] hover:bg-[#2b3fbb]">View Details</Button>
              </div>
            </div>
            
            {/* Destination Card 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1822&q=80" 
                  alt="Kyoto, Japan" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span className="ml-1 text-sm">(221 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-bold">Kyoto, Japan</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#3a55e7] font-semibold">Cultural, Historic, Temples</p>
                  <p className="text-green-600 font-semibold">$1,450</p>
                </div>
                <p className="text-gray-600 mb-4">Step back in time in Japan's former capital with its thousands of classical Buddhist temples, gardens, and traditional wooden houses.</p>
                <Button className="w-full bg-[#3a55e7] hover:bg-[#2b3fbb]">View Details</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How JET AI Makes Travel Better</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Our artificial intelligence technology analyzes millions of data points to create personalized travel experiences just for you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#3a55e7]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
              <p className="text-gray-600">Get personalized destination suggestions based on your preferences, budget, and travel style.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#3a55e7]">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Itinerary Generation</h3>
              <p className="text-gray-600">Let our AI create the perfect day-by-day travel plan optimized for your interests and time.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#3a55e7]">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Language Translation</h3>
              <p className="text-gray-600">Break down language barriers with our real-time translation features powered by advanced AI.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#3a55e7]">
                <Plane className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flight & Hotel Deals</h3>
              <p className="text-gray-600">Our AI constantly scans for the best travel deals to save you money on your next adventure.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travel Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest from Our Travel Blog</h2>
              <p className="text-gray-600">Insights, tips, and stories from around the world</p>
            </div>
            <Link href="/blog" className="flex items-center text-[#3a55e7] font-medium mt-4 md:mt-0 hover:underline">
              Read all articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Hidden Gems in Paris" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#3a55e7] text-white text-xs font-bold uppercase px-3 py-1 rounded">
                  City Guide
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  April 10, 2025
                </div>
                <h3 className="text-xl font-bold mb-3">10 Hidden Gems in Paris You Need to Visit</h3>
                <p className="text-gray-600 mb-4">Discover the lesser-known spots in Paris that most tourists miss but locals love.</p>
                <Link href="/blog/1" className="text-[#3a55e7] font-medium hover:underline">Read More</Link>
              </div>
            </div>
            
            {/* Blog Post 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Food Adventures in Thailand" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#3a55e7] text-white text-xs font-bold uppercase px-3 py-1 rounded">
                  Food
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  April 5, 2025
                </div>
                <h3 className="text-xl font-bold mb-3">Ultimate Food Adventures in Thailand's Street Markets</h3>
                <p className="text-gray-600 mb-4">From spicy curries to sweet mango sticky rice, these Thai street foods are a must-try.</p>
                <Link href="/blog/2" className="text-[#3a55e7] font-medium hover:underline">Read More</Link>
              </div>
            </div>
            
            {/* Blog Post 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Solo Travel" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#3a55e7] text-white text-xs font-bold uppercase px-3 py-1 rounded">
                  Tips
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  March 29, 2025
                </div>
                <h3 className="text-xl font-bold mb-3">Solo Travel: How to Make the Most of Your Adventure</h3>
                <p className="text-gray-600 mb-4">Expert advice on planning, staying safe, and creating meaningful experiences while traveling alone.</p>
                <Link href="/blog/3" className="text-[#3a55e7] font-medium hover:underline">Read More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Travelers Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Real experiences from travelers who planned their trips with JET AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex items-center text-yellow-400 mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 italic">"JET AI completely transformed my vacation planning. The personalized itinerary saved me hours of research and helped me discover places I would never have found on my own!"</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" 
                    alt="Sarah Johnson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Travel Blogger</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex items-center text-yellow-400 mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 italic">"As a business traveler, JET AI has been invaluable. The real-time flight comparator saved me hundreds of dollars, and the AI assistant helped me navigate language barriers effortlessly."</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                    alt="Michael Chen" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Business Traveler</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex items-center text-yellow-400 mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 italic">"Planning trips for the whole family used to be stressful. Now with JET AI, it's actually enjoyable! The personalized suggestions for kid-friendly activities were spot on. We had our best vacation ever!"</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" 
                    alt="Emma Rodriguez" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Emma Rodriguez</h4>
                  <p className="text-sm text-gray-600">Family Vacationer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Travel Plan</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Select the perfect plan to enhance your travel experience with JET AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-center mb-2">Free</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 text-center">Perfect for casual travelers</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Basic destination search</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>5 AI assistant queries per day</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Standard itinerary builder</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Community forum access</span>
                  </li>
                  <li className="flex items-start text-gray-500">
                    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Advanced flight comparisons</span>
                  </li>
                  <li className="flex items-start text-gray-500">
                    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Real-time language translation</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button className="w-full bg-[#3a55e7] hover:bg-[#2b3fbb]">Get Started</Button>
                </div>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-xl transform scale-105 border-2 border-[#3a55e7]">
              <div className="p-1 bg-[#3a55e7]">
                <p className="text-white text-center text-sm font-semibold uppercase">Most Popular</p>
              </div>
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-center mb-2">Premium</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 text-center">For frequent travelers</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Everything in Free plan</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited AI assistant queries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Advanced flight & hotel comparisons</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Real-time language translation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Custom itinerary creation</span>
                  </li>
                  <li className="flex items-start text-gray-500">
                    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Priority customer support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button className="w-full bg-[#3a55e7] hover:bg-[#2b3fbb]">Subscribe Now</Button>
                </div>
              </div>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-center mb-2">Business</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">$29.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 text-center">For business travelers & groups</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Everything in Premium plan</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Multi-user accounts (up to 5)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Group itinerary coordination</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Business expense tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#3a55e7] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>API access for customizations</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button className="w-full bg-[#3a55e7] hover:bg-[#2b3fbb]">Contact Sales</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-12 bg-[#3a55e7] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p className="mb-6">Get travel tips, destination insights, and exclusive AI-powered recommendations</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow bg-white text-gray-800 placeholder:text-gray-500 border-0"
              />
              <Button className="bg-gray-800 hover:bg-gray-900 text-white border-0">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
      

      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-[#3a55e7]" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <h3 className="font-bold text-xl ml-2">JET AI</h3>
              </div>
              <p className="text-gray-400">
                Your AI-powered travel companion. Discover destinations, plan itineraries, and experience the world like never before.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/destinations" className="text-gray-400 hover:text-white">Destinations</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Travel Blog</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link href="/chat" className="text-gray-400 hover:text-white">AI Assistant</Link></li>
                <li><Link href="/itinerary" className="text-gray-400 hover:text-white">Itinerary Creator</Link></li>
                <li><Link href="/translator" className="text-gray-400 hover:text-white">Language Translator</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 mt-0.5" />
                  <span>support@jetai.travel</span>
                </li>
                <li className="flex items-start">
                  <MessageSquare className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Live chat on our website</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-gray-500">© 2025 JET AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-500 hover:text-white">Terms of Service</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white">Privacy Policy</Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* AI Assistant Button (Fixed position) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/chat">
          <Button className="w-14 h-14 rounded-full flex items-center justify-center bg-[#3a55e7] hover:bg-[#2b3fbb] shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        </Link>
      </div>
    </div>
  );
}