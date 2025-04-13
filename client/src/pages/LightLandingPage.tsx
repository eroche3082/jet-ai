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

export default function LightLandingPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-marni-dark text-white shadow-sm border-b border-marni-gray">
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
            
            <div className="hidden md:flex space-x-2">
              <Link href="/" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-sans">Home</Link>
              <Link href="/destinations" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-sans">Destinations</Link>
              <Link href="/blog" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-sans">Travel Blog</Link>
              <Link href="/about" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-sans">About Us</Link>
              <Link href="/chat" className="px-4 py-2 text-white/90 hover:text-white transition-colors font-sans">AI Assistant</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-marni-lightgray text-white hover:bg-marni-accent hover:text-white hover:border-marni-accent transition-all duration-300 font-sans">
                  Sign In
                </Button>
              </Link>
              <button className="md:hidden text-white hover:bg-marni-gray p-2 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[650px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-marni-black/80 via-marni-dark/50 to-transparent"></div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-2xl">
            <div className="bg-marni-darkgray/30 backdrop-blur-sm px-4 py-1 inline-flex items-center mb-6 border-l-2 border-marni-accent">
              <span className="text-white/90 text-sm font-serif tracking-wide">INTELLIGENT TRAVEL PLANNING</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display text-white mb-6 leading-tight drop-shadow-md">
              Journey Beyond <span className="text-marni-accent">Boundaries</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-xl leading-relaxed drop-shadow-sm font-serif">
              JET AI harmonizes sophisticated artificial intelligence with refined travel expertise to curate your ideal journey.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-marni-accent text-white hover:bg-marni-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl px-8 font-medium">
                <Link href="/destinations" className="flex items-center">
                  <Compass className="mr-2 h-5 w-5" /> Explore Destinations
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/chat" className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" /> Consult AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="container mx-auto px-6">
            <div className="bg-white/95 backdrop-blur-lg shadow-md border border-gray-100 p-6 md:p-8">
              <div className="md:max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display text-marni-dark flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-marni-dark/5 text-marni-accent">
                      <Plane className="h-5 w-5" />
                    </div>
                    Plan Your Journey
                  </h3>
                  <div className="hidden md:block">
                    <span className="text-gray-500 text-sm font-serif">
                      <span className="text-marni-accent font-medium">Tip:</span> Try searching by experience like "cultural" or "relaxation"
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
                      <label className="block text-sm font-medium text-marni-dark mb-2 flex items-center font-serif">
                        <Globe className="h-4 w-4 mr-1.5 text-marni-accent" />
                        Destination
                      </label>
                      <div className="relative group">
                        <Input 
                          name="destination" 
                          placeholder="Where do you want to go?" 
                          className="pl-11 py-5 border-gray-200 focus:border-marni-accent focus:ring-marni-accent/10 shadow-sm group-hover:border-marni-accent/50 transition-all font-sans" 
                          required 
                        />
                        <Map className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-marni-accent transition-colors" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-marni-dark mb-2 flex items-center font-serif">
                        <Calendar className="h-4 w-4 mr-1.5 text-marni-accent" />
                        Travel Date
                      </label>
                      <div className="relative group">
                        <Input 
                          name="date" 
                          type="date" 
                          className="pl-11 py-5 border-gray-200 focus:border-marni-accent focus:ring-marni-accent/10 shadow-sm group-hover:border-marni-accent/50 transition-all font-sans" 
                          required 
                        />
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-marni-accent transition-colors" />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <Button 
                        type="submit" 
                        className="w-full py-5 bg-marni-dark hover:bg-marni-accent text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Search className="mr-2 h-5 w-5" /> Find Journeys
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500 font-serif">
                      Powered by <span className="font-semibold">JET AI</span> technology for personalized travel recommendations
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
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-3">
                <Star className="h-3.5 w-3.5 mr-1.5 text-marni-accent" /> 
                CURATED DESTINATIONS
              </div>
              <h2 className="text-4xl mb-3 font-display text-marni-dark">Exceptional Journeys</h2>
              <p className="text-gray-600 max-w-xl font-serif">Discover carefully selected destinations that promise transformative experiences, curated by our AI technology and endorsed by discerning travelers</p>
            </div>
            <Link href="/destinations" className="flex items-center text-marni-accent font-medium mt-6 md:mt-0 px-5 py-2.5 border-b border-marni-accent/30 hover:border-marni-accent transition-all duration-200">
              View all destinations <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Destination Card 1 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542259009477-d625272157b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Bali, Indonesia" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-marni-dark/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border-l border-marni-accent">
                    TRENDING
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-marni-accent">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-sans">(256 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-display">Bali, Indonesia</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Beach</span>
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Culture</span>
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Nature</span>
                  </div>
                  <p className="text-marni-accent font-medium text-lg">$1,200</p>
                </div>
                <p className="text-gray-600 mb-5 font-serif">Experience the perfect blend of tranquil beaches, lush rice terraces, and vibrant cultural rituals on this magical island.</p>
                <Button className="w-full bg-marni-dark hover:bg-marni-accent text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <Link href="/destinations/bali" className="flex items-center justify-center">
                    <Compass className="mr-2 h-4 w-4" /> Explore Bali
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Destination Card 2 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300">
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
                        <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-marni-accent">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-sans">(189 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-display">Venice, Italy</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Historic</span>
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Romantic</span>
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">City</span>
                  </div>
                  <p className="text-marni-accent font-medium text-lg">$950</p>
                </div>
                <p className="text-gray-600 mb-5 font-serif">Navigate through the romantic canals of this unique city built on water, with its architectural marvels and timeless charm.</p>
                <Button className="w-full bg-marni-dark hover:bg-marni-accent text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <Link href="/destinations/venice" className="flex items-center justify-center">
                    <Map className="mr-2 h-4 w-4" /> Explore Venice
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Destination Card 3 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532236204992-f5e85c024202?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1822&q=80" 
                  alt="Kyoto, Japan" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-marni-dark/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border-l border-marni-accent">
                    BEST VALUE
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-marni-accent">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-sans">(221 reviews)</span>
                  </div>
                  <h3 className="text-white text-xl font-display">Kyoto, Japan</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Cultural</span>
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Historic</span>
                    <span className="px-2 py-1 bg-marni-dark/5 text-marni-accent text-xs font-serif">Temples</span>
                  </div>
                  <p className="text-marni-accent font-medium text-lg">$1,450</p>
                </div>
                <p className="text-gray-600 mb-5 font-serif">Step back in time in Japan's former capital with its thousands of classical Buddhist temples, gardens, and traditional wooden houses.</p>
                <Button className="w-full bg-marni-dark hover:bg-marni-accent text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <Link href="/destinations/kyoto" className="flex items-center justify-center">
                    <Globe className="mr-2 h-4 w-4" /> Explore Kyoto
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Features */}
      <section className="py-24 relative overflow-hidden bg-marni-dark/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-marni-accent" /> 
              ARTIFICIAL INTELLIGENCE
            </div>
            <h2 className="text-4xl mb-5 font-display text-marni-dark">Intelligent Travel Technology</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg font-serif">JET AI artfully combines sophisticated artificial intelligence with refined travel expertise to design personalized journeys that align with your distinctive preferences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-marni-accent/20 hover:border-marni-accent group">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-marni-dark/5 text-marni-accent transform transition-transform group-hover:scale-105 duration-300">
                <Brain className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-marni-accent transition-colors">Curated Recommendations</h3>
              <p className="text-gray-600 font-serif">Personalized destination selections tailored to your distinctive tastes, financial parameters, and travel preferences.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-marni-accent/20 hover:border-marni-accent group">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-marni-dark/5 text-marni-accent transform transition-transform group-hover:scale-105 duration-300">
                <MapIcon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-marni-accent transition-colors">Elegant Itineraries</h3>
              <p className="text-gray-600 font-serif">Meticulously crafted travel plans that gracefully adapt to your interests, time constraints, and unexpected discoveries.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-marni-accent/20 hover:border-marni-accent group">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-marni-dark/5 text-marni-accent transform transition-transform group-hover:scale-105 duration-300">
                <Languages className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-marni-accent transition-colors">Language Intelligence</h3>
              <p className="text-gray-600 font-serif">Dissolve communication barriers with precise translation in over 100 languages for seamless cultural engagement.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 text-center shadow-sm hover:shadow transition-all duration-300 border-b border-marni-accent/20 hover:border-marni-accent group">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-marni-dark/5 text-marni-accent transform transition-transform group-hover:scale-105 duration-300">
                <DollarSign className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-display mb-3 group-hover:text-marni-accent transition-colors">Value Optimization</h3>
              <p className="text-gray-600 font-serif">Our intelligent system continually evaluates flight, accommodation, and experience options to optimize the value of your investment.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button className="bg-marni-dark hover:bg-marni-accent text-white font-medium py-3 px-8 shadow-sm hover:shadow transition-all duration-300">
              <Link href="/chat" className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" /> Experience JET AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Travel Blog Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-3">
                <BookOpen className="h-3.5 w-3.5 mr-1.5 text-marni-accent" /> 
                TRAVEL JOURNAL
              </div>
              <h2 className="text-4xl mb-3 font-display text-marni-dark">From Our Travel Journal</h2>
              <p className="text-gray-600 font-serif">Curated insights, reflections, and narratives from seasoned travelers</p>
            </div>
            <Link href="/blog" className="flex items-center text-marni-accent font-medium mt-6 md:mt-0 border-b border-marni-accent/30 hover:border-marni-accent transition-all duration-200">
              Explore all journal entries <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Hidden Gems in Paris" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-0 bg-marni-dark/80 text-white text-xs font-serif uppercase px-3 py-1">
                  City Guide
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <Calendar className="h-4 w-4 mr-2 text-marni-accent" />
                  April 10, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-marni-dark">10 Hidden Gems in Paris You Need to Visit</h3>
                <p className="text-gray-600 mb-4 font-serif">Discover the lesser-known spots in Paris that most tourists miss but locals cherish.</p>
                <Link href="/blog/1" className="text-marni-accent font-medium hover:text-marni-dark transition-colors duration-200 font-serif">Read More</Link>
              </div>
            </div>
            
            {/* Blog Post 2 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Food Adventures in Thailand" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-0 bg-marni-dark/80 text-white text-xs font-serif uppercase px-3 py-1">
                  Culinary Journey
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <Calendar className="h-4 w-4 mr-2 text-marni-accent" />
                  April 5, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-marni-dark">Thailand's Street Markets: A Culinary Exploration</h3>
                <p className="text-gray-600 mb-4 font-serif">From aromatic curries to delicate mango with sticky rice, a journey through Thailand's vibrant street food culture.</p>
                <Link href="/blog/2" className="text-marni-accent font-medium hover:text-marni-dark transition-colors duration-200 font-serif">Read More</Link>
              </div>
            </div>
            
            {/* Blog Post 3 */}
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Solo Travel" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-0 bg-marni-dark/80 text-white text-xs font-serif uppercase px-3 py-1">
                  Travel Philosophy
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                  <Calendar className="h-4 w-4 mr-2 text-marni-accent" />
                  March 29, 2025
                </div>
                <h3 className="text-xl font-display mb-3 text-marni-dark">The Art of Solo Travel: Embracing Solitude</h3>
                <p className="text-gray-600 mb-4 font-serif">Insightful reflections on planning, personal safety, and creating meaningful connections while traveling alone.</p>
                <Link href="/blog/3" className="text-marni-accent font-medium hover:text-marni-dark transition-colors duration-200 font-serif">Read More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-marni-dark/5 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80')] bg-cover bg-center opacity-3"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-3">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-marni-accent" /> 
              TRAVELER EXPERIENCES
            </div>
            <h2 className="text-4xl mb-3 font-display text-marni-dark">Distinguished Perspectives</h2>
            <p className="text-gray-600 max-w-3xl mx-auto font-serif">Authentic reflections from discerning travelers who entrusted their journey planning to JET AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border-t border-marni-accent/20">
              <div className="flex items-center text-marni-accent mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 font-serif">"JET AI transformed my approach to vacation planning. The personalized itinerary eliminated hours of research and revealed hidden destinations I would never have discovered through conventional means."</p>
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden mr-4 border border-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" 
                    alt="Sarah Johnson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-marni-dark">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 font-serif">Travel Journalist</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border-t border-marni-accent/20">
              <div className="flex items-center text-marni-accent mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 font-serif">"For the discerning business traveler, JET AI is indispensable. The sophisticated flight comparison system generated substantial savings, while the AI assistant elegantly resolved language complexities."</p>
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden mr-4 border border-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                    alt="Michael Chen" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-marni-dark">Michael Chen</h4>
                  <p className="text-sm text-gray-600 font-serif">Executive Traveler</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 border-t border-marni-accent/20">
              <div className="flex items-center text-marni-accent mb-6">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 font-serif">"Coordinating multi-generational family travel once presented significant challenges. JET AI has transformed this into a refined experience. Their curated recommendations for family-appropriate activities proved impeccable."</p>
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden mr-4 border border-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" 
                    alt="Emma Rodriguez" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-marni-dark">Emma Rodriguez</h4>
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
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-3">
              <DollarSign className="h-3.5 w-3.5 mr-1.5 text-marni-accent" /> 
              MEMBERSHIP OPTIONS
            </div>
            <h2 className="text-4xl mb-3 font-display text-marni-dark">Select Your Travel Experience</h2>
            <p className="text-gray-600 max-w-3xl mx-auto font-serif">Choose the optimal tier to elevate your journey planning with JET AI's sophisticated features</p>
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