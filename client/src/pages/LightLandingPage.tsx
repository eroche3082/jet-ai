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
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-[#4e6af9]" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <h1 className="font-bold text-xl ml-2">JET AI</h1>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link href="/destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</Link>
              <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Travel Blog</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">AI Assistant</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-[#3a55e7] text-white hover:bg-[#3a55e7] hover:text-white">
                  Sign In
                </Button>
              </Link>
              <button className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[600px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528543606781-2f6e6857f318?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2001&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4">Discover Your Next Adventure with AI</h1>
            <p className="text-xl text-white mb-8">Let JET AI be your personal travel companion. Find destinations, plan itineraries, and experience the world like never before.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-[#3a55e7] hover:bg-[#2b3fbb] text-white">
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#4e6af9]">
                <Link href="/chat">Talk to AI Assistant</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <div className="relative">
                      <Input name="destination" placeholder="Where do you want to go?" className="pl-10" required />
                      <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                    <div className="relative">
                      <Input name="date" type="date" className="pl-10" required />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full bg-[#3a55e7] hover:bg-[#2b3fbb]">
                      <Search className="mr-2 h-5 w-5" /> Search
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Destinations</h2>
              <p className="text-gray-600">Explore our AI-recommended destinations based on traveler reviews</p>
            </div>
            <Link href="/destinations" className="flex items-center text-[#4e6af9] font-medium mt-4 md:mt-0 hover:underline">
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
                  <p className="text-[#4e6af9] font-semibold">Beach, Culture, Nature</p>
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
                  <p className="text-[#4e6af9] font-semibold">Historic, Romantic, City</p>
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
                  <p className="text-[#4e6af9] font-semibold">Cultural, Historic, Temples</p>
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
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#4e6af9]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
              <p className="text-gray-600">Get personalized destination suggestions based on your preferences, budget, and travel style.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#4e6af9]">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Itinerary Generation</h3>
              <p className="text-gray-600">Let our AI create the perfect day-by-day travel plan optimized for your interests and time.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#4e6af9]">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Language Translation</h3>
              <p className="text-gray-600">Break down language barriers with our real-time translation features powered by advanced AI.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#ebeffe] rounded-full text-[#4e6af9]">
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
            <Link href="/blog" className="flex items-center text-[#4e6af9] font-medium mt-4 md:mt-0 hover:underline">
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
                <div className="absolute top-4 left-4 bg-[#4e6af9] text-white text-xs font-bold uppercase px-3 py-1 rounded">
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
                <Link href="/blog/1" className="text-[#4e6af9] font-medium hover:underline">Read More</Link>
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
                <div className="absolute top-4 left-4 bg-[#4e6af9] text-white text-xs font-bold uppercase px-3 py-1 rounded">
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
                <Link href="/blog/2" className="text-[#4e6af9] font-medium hover:underline">Read More</Link>
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
                <div className="absolute top-4 left-4 bg-[#4e6af9] text-white text-xs font-bold uppercase px-3 py-1 rounded">
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
                <Link href="/blog/3" className="text-[#4e6af9] font-medium hover:underline">Read More</Link>
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
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Basic destination search</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>5 AI assistant queries per day</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Standard itinerary builder</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <Button className="w-full bg-[#4e6af9] hover:bg-[#3a55e7]">Get Started</Button>
                </div>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-xl transform scale-105 border-2 border-[#4e6af9]">
              <div className="p-1 bg-[#4e6af9]">
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
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Everything in Free plan</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited AI assistant queries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Advanced flight & hotel comparisons</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Real-time language translation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <Button className="w-full bg-[#4e6af9] hover:bg-[#3a55e7]">Subscribe Now</Button>
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
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Everything in Premium plan</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Multi-user accounts (up to 5)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Group itinerary coordination</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Business expense tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[#4e6af9] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>API access for customizations</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button className="w-full bg-[#4e6af9] hover:bg-[#3a55e7]">Contact Sales</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-12 bg-[#4e6af9] text-white">
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
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-[#4e6af9]" stroke="currentColor" strokeWidth="2">
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
          <Button className="w-14 h-14 rounded-full flex items-center justify-center bg-[#4e6af9] hover:bg-[#3a55e7] shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        </Link>
      </div>
    </div>
  );
}