import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Brain, Globe, Calendar, MapPin, Home, Plane, Car, ShieldCheck, Clock, MessageSquare, Cloud, Zap, Image, MessageCircle, PieChart, Navigation, Headphones, CreditCard, BookOpen, BarChart2, Wifi, Triangle, Anchor, Compass, Briefcase, Umbrella, Search, BookMarked, Map } from 'lucide-react';

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const allFeatures = [
    {
      id: 'ai-planning',
      title: 'Intelligent Trip Planning',
      description: 'Our AI analyzes thousands of travel data points to create personalized itineraries based on your preferences, budget, and time constraints.',
      category: 'core',
      icon: <Brain className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'destination-recommendation',
      title: 'Smart Destination Recommendation',
      description: 'Receive tailored destination suggestions based on your travel history, preferences, and current global travel trends.',
      category: 'core',
      icon: <Globe className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'budget-optimization',
      title: 'Budget Optimization',
      description: 'Our algorithm finds the perfect balance between cost and quality, ensuring you get the most value from your travel budget.',
      category: 'core',
      icon: <CreditCard className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'itinerary-builder',
      title: 'Dynamic Itinerary Builder',
      description: 'Build day-by-day travel plans that intelligently account for travel time, opening hours, and optimal visiting sequences.',
      category: 'planning',
      icon: <Calendar className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'local-insights',
      title: 'Local Cultural Insights',
      description: 'Gain authentic understanding of local customs, etiquette, and hidden gems through our culturally-aware AI system.',
      category: 'cultural',
      icon: <MapPin className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'hotel-matching',
      title: 'Personalized Accommodation Matching',
      description: 'Find accommodations that perfectly match your personal preferences from luxury hotels to unique homestays.',
      category: 'booking',
      icon: <Home className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'flight-search',
      title: 'Intelligent Flight Search',
      description: 'Our AI goes beyond standard flight searches to find optimal combinations of price, duration, comfort, and carbon footprint.',
      category: 'booking',
      icon: <Plane className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'ground-transport',
      title: 'Ground Transportation Coordinator',
      description: 'Seamlessly organize airport transfers, car rentals, train tickets, and local transportation options in one interface.',
      category: 'booking',
      icon: <Car className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'safety-monitoring',
      title: 'Real-time Safety Monitoring',
      description: 'Receive timely alerts about changing safety conditions, weather emergencies, or health concerns at your destination.',
      category: 'safety',
      icon: <ShieldCheck className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'jetlag-assistant',
      title: 'Jet Lag Minimizer',
      description: 'Personalized recommendations to reduce jet lag based on your itinerary, sleep patterns, and chronotype.',
      category: 'wellness',
      icon: <Clock className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'multilingual-assistant',
      title: 'Multilingual Travel Assistant',
      description: 'Break language barriers with real-time translation, cultural context interpretation, and local phrase suggestions.',
      category: 'communication',
      icon: <MessageSquare className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'weather-prediction',
      title: 'Advanced Weather Forecasting',
      description: 'AI-enhanced weather predictions specifically tailored to impact your planned activities with alternative suggestions.',
      category: 'planning',
      icon: <Cloud className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'real-time-updates',
      title: 'Real-time Travel Adjustment',
      description: 'Instantly adapt your itinerary when unexpected changes occur with smart alternatives and solutions.',
      category: 'planning',
      icon: <Zap className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'photo-enhancement',
      title: 'AI Photo Enhancement',
      description: 'Automatically enhance your travel photos with destination-specific filters and smart editing features.',
      category: 'media',
      icon: <Image className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'voice-narration',
      title: 'Interactive Voice Narration',
      description: 'Audio guides that adapt to your location, interests, and pace with rich historical and cultural context.',
      category: 'media',
      icon: <MessageCircle className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'sustainability-metrics',
      title: 'Sustainability Impact Metrics',
      description: 'Track and minimize your carbon footprint with eco-friendly alternatives and offset recommendations.',
      category: 'sustainability',
      icon: <PieChart className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'navigation-assistant',
      title: 'Augmented Reality Navigation',
      description: 'Navigate unfamiliar destinations with AR-enhanced directions and contextual information overlays.',
      category: 'technology',
      icon: <Navigation className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'audio-memories',
      title: 'Immersive Audio Memories',
      description: 'Capture the sounds of your journey with AI-enhanced audio recording and atmospheric sound preservation.',
      category: 'media',
      icon: <Headphones className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'expense-tracking',
      title: 'Smart Expense Tracking',
      description: 'Effortlessly monitor your travel spending with automated categorization and budget alerts.',
      category: 'finance',
      icon: <BarChart2 className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'connectivity-finder',
      title: 'Connectivity Finder',
      description: 'Locate reliable WiFi and mobile networks wherever you travel with offline access to essential information.',
      category: 'technology',
      icon: <Wifi className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'experience-curator',
      title: 'Experience Curator',
      description: 'Discover and book unique experiences from local guides and exclusive access to cultural events.',
      category: 'cultural',
      icon: <Triangle className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'cruise-analyzer',
      title: 'Cruise Itinerary Analyzer',
      description: 'Compare cruise options with AI analysis of routes, amenities, excursions, and value propositions.',
      category: 'booking',
      icon: <Anchor className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'adventure-matching',
      title: 'Adventure Activity Matching',
      description: 'Find adventure experiences perfectly matched to your skill level, interests, and risk tolerance.',
      category: 'activities',
      icon: <Compass className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'business-travel',
      title: 'Business Travel Optimizer',
      description: 'Maximize productivity during business trips with intelligent scheduling around meetings and commitments.',
      category: 'business',
      icon: <Briefcase className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'seasonal-planner',
      title: 'Seasonal Travel Planner',
      description: 'Identify the perfect time to visit any destination based on weather patterns, crowds, and special events.',
      category: 'planning',
      icon: <Umbrella className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'dining-recommendations',
      title: 'Culinary Experience Finder',
      description: 'Discover dining experiences tailored to your taste preferences, dietary requirements, and desired atmosphere.',
      category: 'dining',
      icon: <Search className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'memory-journal',
      title: 'AI-Enhanced Travel Journal',
      description: 'Automatically compile and enhance your travel memories with smart tagging, organization, and narrative creation.',
      category: 'media',
      icon: <BookMarked className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'visa-requirements',
      title: 'Visa & Documentation Assistant',
      description: 'Stay ahead of entry requirements with personalized checklist and timely updates on regulation changes.',
      category: 'planning',
      icon: <BookOpen className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'group-coordination',
      title: 'Group Travel Coordination',
      description: 'Simplify planning for multiple travelers with preference matching, consensus building, and synchronized itineraries.',
      category: 'social',
      icon: <Map className="w-8 h-8 text-[#4a89dc]" />
    },
    {
      id: 'ai-travel-coach',
      title: 'AI Travel Coach',
      description: 'Receive personalized guidance to improve your travel skills, cultural adaptability, and journey planning expertise.',
      category: 'learning',
      icon: <Sparkles className="w-8 h-8 text-[#4a89dc]" />
    }
  ];
  
  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'core', label: 'Core Capabilities' },
    { id: 'planning', label: 'Trip Planning' },
    { id: 'booking', label: 'Booking Tools' },
    { id: 'cultural', label: 'Cultural Insights' },
    { id: 'technology', label: 'Tech Features' },
    { id: 'media', label: 'Media & Memories' }
  ];
  
  const filteredFeatures = allFeatures.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#050b17] py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050b17] to-[#4a89dc]/40 mix-blend-multiply"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-white/5 text-white text-sm font-serif mb-6">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" />
              POWERED BY ADVANCED AI
            </div>
            <h1 className="text-5xl font-bold text-white font-display mb-6">
              JET AI <span className="text-[#4a89dc]">Features</span>
            </h1>
            <p className="text-xl text-white/90 font-serif mb-8">
              Discover our comprehensive suite of intelligent travel tools designed to transform 
              every aspect of your journey from planning to return.
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-lg px-5 py-4 pl-14 focus:outline-none focus:ring-2 focus:ring-[#4a89dc]/50 focus:border-transparent"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Content */}
      <div className="container mx-auto px-6 py-16">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-[#050b17]/5 p-1 rounded-lg">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="px-4 py-2 data-[state=active]:bg-[#4a89dc] data-[state=active]:text-white font-serif"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFeatures
                  .filter(feature => category.id === 'all' || feature.category === category.id)
                  .map(feature => (
                    <div 
                      key={feature.id} 
                      className="bg-white border border-[#4a89dc]/10 rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:border-[#4a89dc]/30"
                    >
                      <div className="flex items-center mb-6">
                        <div className="bg-[#4a89dc]/10 p-4 rounded-lg mr-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-[#050b17] font-display">{feature.title}</h3>
                      </div>
                      <p className="text-gray-700 font-serif leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
              </div>
              
              {filteredFeatures.filter(feature => 
                category.id === 'all' || feature.category === category.id
              ).length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto bg-[#4a89dc]/10 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-[#4a89dc]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#050b17] mb-2">No features found</h3>
                  <p className="text-gray-600 font-serif">
                    Try adjusting your search query or selecting a different category.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Call to Action */}
      <div className="bg-[#050b17] py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6 font-display">
              Ready to Experience JET AI?
            </h2>
            <p className="text-white/80 mb-8 font-serif">
              Join thousands of travelers who have transformed their journeys with our intelligent travel companion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/signup" 
                className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white font-medium px-8 py-3 rounded-md transition-all duration-300 font-serif"
              >
                Create Free Account
              </a>
              <a 
                href="/chat" 
                className="bg-transparent border border-white/30 hover:border-white/60 text-white font-medium px-8 py-3 rounded-md transition-all duration-300 font-serif"
              >
                Try JET AI Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}