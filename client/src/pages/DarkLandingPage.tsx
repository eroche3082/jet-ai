import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  Globe, 
  Languages, 
  HeartHandshake, 
  Wallet, 
  FileCheck,
  BrainCircuit, 
  PackageCheck, 
  Cloud, 
  Mountain, 
  Stethoscope,
  User, 
  ShieldCheck, 
  Leaf, 
  Hotel, 
  CalendarCheck, 
  Clock,
  BadgeDollarSign, 
  PanelTopOpen,
  Send as SendIcon,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

export default function DarkLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Header Navigation */}
      <header className="bg-gray-900 border-b border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-primary" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
            <span className="ml-2 text-xl font-bold">JET AI</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="font-medium text-white hover:text-primary">Home</Link>
            <Link href="/destinations" className="font-medium text-gray-300 hover:text-primary">Destinations</Link>
            <Link href="/chat" className="font-medium text-gray-300 hover:text-primary">
              <div className="flex items-center gap-1">
                <MessageSquare size={16} />
                <span>Chat</span>
              </div>
            </Link>
            <Link href="/portfolio" className="font-medium text-gray-300 hover:text-primary">Travel Memories</Link>
            <Link href="/about" className="font-medium text-gray-300 hover:text-primary">About</Link>
          </nav>
          
          <div className="hidden md:block">
            <Link href="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Login</Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="flex items-center p-2 rounded-md text-white hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? 
                <X className="h-6 w-6" /> :
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-800 mt-4">
            <nav className="flex flex-col space-y-3 px-6">
              <Link href="/" className="py-2 text-white hover:text-primary">Home</Link>
              <Link href="/destinations" className="py-2 text-gray-300 hover:text-primary">Destinations</Link>
              <Link href="/chat" className="py-2 text-gray-300 hover:text-primary flex items-center gap-1">
                <MessageSquare size={16} />
                <span>Chat</span>
              </Link>
              <Link href="/portfolio" className="py-2 text-gray-300 hover:text-primary">Travel Memories</Link>
              <Link href="/about" className="py-2 text-gray-300 hover:text-primary">About</Link>
              <div className="pt-4 border-t border-gray-800">
                <Link href="/login">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    Login
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center min-h-[80vh] bg-gray-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1540395425275-77278ce9e0df?q=80&w=2069&auto=format&fit=crop')",
            backgroundPosition: "center"
          }}
        ></div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Perfect Journey with AI
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Let our intelligent travel assistant create personalized itineraries based on your preferences and travel style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/chat">
                  <div className="flex items-center gap-2">
                    <SendIcon size={18} />
                    <span>Chat with AI Assistant</span>
                  </div>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Title */}
      <div className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">20 Smart Features for Intelligent Travel</h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Our AI-powered platform combines cutting-edge technology with expert travel knowledge
            to revolutionize how you plan, experience, and remember your journeys.
          </p>
        </div>
      </div>
      
      {/* 20 Features Grid */}
      <div className="py-12 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Generative Smart Itinerary</h3>
              <p className="text-gray-400 flex-grow">Personalized itineraries based on preferences, time, and budget.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Real-Time Flight Comparator</h3>
              <p className="text-gray-400 flex-grow">Find flights with the best value for your money.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Languages className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Multilingual Translator</h3>
              <p className="text-gray-400 flex-grow">Translate conversations and phrases across 30+ languages.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Predictive Cultural Advisor</h3>
              <p className="text-gray-400 flex-grow">Information about customs and etiquette at your destination.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Automatic Budget Manager</h3>
              <p className="text-gray-400 flex-grow">Monitor and suggest adjustments to your travel budget.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Travel Document Scanner</h3>
              <p className="text-gray-400 flex-grow">Verify passports, visas, and travel documents.</p>
            </div>
            
            {/* Feature 7 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Cross-Session Memory</h3>
              <p className="text-gray-400 flex-grow">Remember previous conversations and preferences for consistent recommendations.</p>
            </div>
            
            {/* Feature 8 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <PackageCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Packing List Generator</h3>
              <p className="text-gray-400 flex-grow">Luggage lists tailored to your destination and activities.</p>
            </div>
            
            {/* Feature 9 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Predictive Weather Alerts</h3>
              <p className="text-gray-400 flex-grow">Anticipate and notify about adverse weather conditions.</p>
            </div>
            
            {/* Feature 10 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Mountain className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Visual Attraction Identifier</h3>
              <p className="text-gray-400 flex-grow">Upload images to receive detailed information about landmarks.</p>
            </div>
            
            {/* Feature 11 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Medical Emergency Assistant</h3>
              <p className="text-gray-400 flex-grow">Medical translations and location of nearby hospitals.</p>
            </div>
            
            {/* Feature 12 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Transport Connection Optimizer</h3>
              <p className="text-gray-400 flex-grow">Optimal transportation combinations for efficiency and savings.</p>
            </div>
            
            {/* Feature 13 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Interest-Based Experience Filter</h3>
              <p className="text-gray-400 flex-grow">Activities and experiences that match your interests.</p>
            </div>
            
            {/* Feature 14 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Area Safety Verifier</h3>
              <p className="text-gray-400 flex-grow">Safety assessment of different areas at your destination.</p>
            </div>
            
            {/* Feature 15 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">CO2 Compensation Calculator</h3>
              <p className="text-gray-400 flex-grow">Estimate and offset the carbon footprint of your trip.</p>
            </div>
            
            {/* Feature 16 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Hotel className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Accommodation Comparator</h3>
              <p className="text-gray-400 flex-grow">Analyze hotels, Airbnb, and more based on your preferences.</p>
            </div>
            
            {/* Feature 17 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Booking Assistant</h3>
              <p className="text-gray-400 flex-grow">Make reservations directly with automatic confirmation.</p>
            </div>
            
            {/* Feature 18 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Layover Itinerary Generator</h3>
              <p className="text-gray-400 flex-grow">Mini-itineraries to make the most of long airport layovers.</p>
            </div>
            
            {/* Feature 19 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <BadgeDollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Flash Deals Detector</h3>
              <p className="text-gray-400 flex-grow">Alerts about temporary deals that match your preferences.</p>
            </div>
            
            {/* Feature 20 */}
            <div className="bg-gray-800 p-6 rounded-md flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center">
                  <PanelTopOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Destination Evaluator</h3>
              <p className="text-gray-400 flex-grow">Compare destinations based on budget, weather, attractions, and safety.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Experience the World Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Experience the World with JET AI</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/ixIzimI35SE?autoplay=0&rel=0&showinfo=0&controls=1" 
                  title="Top 100 Places To Visit In Europe"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4 text-white">
                <h3 className="text-xl font-semibold mb-2">Discover breathtaking destinations</h3>
                <p className="text-gray-400">Let JET AI guide you through unforgettable journeys to the world's most spectacular places.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1974&auto=format&fit=crop"
                  alt="Santorini, Greece" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-gray-800">
                  <h3 className="font-semibold text-lg text-white">Greece Getaways</h3>
                  <p className="text-sm text-gray-400">Explore crystal-clear waters and ancient history</p>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2633&auto=format&fit=crop"
                  alt="Tropical beaches" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-gray-800">
                  <h3 className="font-semibold text-lg text-white">Tropical Escapes</h3>
                  <p className="text-sm text-gray-400">Find your paradise on secluded beaches</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/destinations">
                    <span>Explore All Destinations</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Video thumbnail carousel (optional) */}
          <div className="mt-12 hidden md:block">
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-md overflow-hidden border border-gray-700 hover:border-primary transition-all duration-300 cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=2070&auto=format&fit=crop" 
                  alt="The Alps" 
                  className="w-full h-24 object-cover"
                />
                <div className="p-3 bg-gray-800">
                  <p className="text-sm font-medium text-center">The Alps</p>
                </div>
              </div>
              
              <div className="rounded-md overflow-hidden border border-gray-700 hover:border-primary transition-all duration-300 cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" 
                  alt="Paris" 
                  className="w-full h-24 object-cover"
                />
                <div className="p-3 bg-gray-800">
                  <p className="text-sm font-medium text-center">Paris</p>
                </div>
              </div>
              
              <div className="rounded-md overflow-hidden border border-gray-700 hover:border-primary transition-all duration-300 cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Cities Top 100" 
                  className="w-full h-24 object-cover"
                />
                <div className="p-3 bg-gray-800">
                  <p className="text-sm font-medium text-center">Cities Top 100</p>
                </div>
              </div>
              
              <div className="rounded-md overflow-hidden border border-gray-700 hover:border-primary transition-all duration-300 cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=1994&auto=format&fit=crop" 
                  alt="World Tour" 
                  className="w-full h-24 object-cover"
                />
                <div className="p-3 bg-gray-800">
                  <p className="text-sm font-medium text-center">World Tour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Photo Gallery Grid */}
      <div className="py-12 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="overflow-hidden rounded-lg shadow-lg group">
              <div className="relative h-60">
                <img 
                  src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2070&auto=format&fit=crop" 
                  alt="Travel Planning" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Trip Planning</h3>
                  <p className="text-sm text-gray-300">Personalized itineraries</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg shadow-lg group">
              <div className="relative h-60">
                <img 
                  src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Cultural Experiences" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Cultural Experiences</h3>
                  <p className="text-sm text-gray-300">Authentic local traditions</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg shadow-lg group">
              <div className="relative h-60">
                <img 
                  src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Hidden Gems" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Hidden Gems</h3>
                  <p className="text-sm text-gray-300">Off-the-beaten-path locations</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg shadow-lg group">
              <div className="relative h-60">
                <img 
                  src="https://images.unsplash.com/photo-1541184563-6e97de10c80c?q=80&w=2070&auto=format&fit=crop" 
                  alt="Adventure Seekers" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Adventure Seekers</h3>
                  <p className="text-sm text-gray-300">Thrilling outdoor activities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-900 shadow-lg p-8 rounded-lg">
              <div className="flex items-center justify-center mb-8">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-xl mb-2 text-white">Sarah Johnson</h4>
                <p className="text-primary font-medium mb-6">Travel Blogger</p>
                <p className="text-gray-400 leading-relaxed">"JET AI transformed how I plan my trips. The AI assistant understood exactly what I wanted and created the perfect itinerary."</p>
              </div>
            </div>
            
            <div className="bg-gray-900 shadow-lg p-8 rounded-lg">
              <div className="flex items-center justify-center mb-8">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                    alt="Michael Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-xl mb-2 text-white">Michael Chen</h4>
                <p className="text-primary font-medium mb-6">Business Traveler</p>
                <p className="text-gray-400 leading-relaxed">"The real-time flight comparator saved me hundreds of dollars. I also love how it suggests activities based on my interests."</p>
              </div>
            </div>
            
            <div className="bg-gray-900 shadow-lg p-8 rounded-lg">
              <div className="flex items-center justify-center mb-8">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" 
                    alt="Emma Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-xl mb-2 text-white">Emma Rodriguez</h4>
                <p className="text-primary font-medium mb-6">Family Vacationer</p>
                <p className="text-gray-400 leading-relaxed">"Planning trips for the whole family used to be stressful. Now with JET AI, it's actually enjoyable! The personalized suggestions are spot on."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Smarter Travel?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of travelers who have discovered the power of AI-assisted travel planning.
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="bg-white text-primary border-white hover:bg-white/90 hover:text-primary"
          >
            <Link href="/login">
              <span className="text-lg px-6">Get Started Now</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-primary" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <h3 className="font-bold text-xl ml-2">JET AI</h3>
              </div>
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
            <p className="text-gray-400 text-sm">© 2025 JET AI. All rights reserved.</p>
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