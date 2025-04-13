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
      
      {/* Advanced Technology Section */}
      <div className="py-24 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-[#4a89dc]/5 text-[#050b17] text-sm font-serif mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              CUTTING-EDGE TECHNOLOGY
            </div>
            <h2 className="text-4xl mb-5 font-display text-[#050b17]">Powered By Advanced AI Models</h2>
            <p className="text-gray-600 mx-auto text-lg font-serif">
              JET AI leverages state-of-the-art language and vision models from Google Gemini, OpenAI, and Anthropic Claude to provide intelligent travel assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg border border-[#4a89dc]/10 shadow-sm hover:shadow transition-all duration-300">
              <div className="h-14 mb-6 flex items-center">
                <svg width="135" height="32" viewBox="0 0 135 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8">
                  <path d="M45.2089 24.5H48.8979V14.548H60.8059V11.188H48.8979V7.676H61.8179V4.316H45.2089V24.5ZM64.1756 24.5H67.8646V4.316H64.1756V24.5ZM80.1116 24.92C84.5836 24.92 87.8096 21.904 87.8096 17.18C87.8096 12.452 84.5836 9.432 80.1116 9.432C75.6396 9.432 72.4136 12.452 72.4136 17.18C72.4136 21.904 75.6396 24.92 80.1116 24.92ZM80.1116 21.684C77.6176 21.684 76.1936 19.844 76.1936 17.18C76.1936 14.516 77.6176 12.676 80.1116 12.676C82.6056 12.676 84.0296 14.516 84.0296 17.18C84.0296 19.844 82.6056 21.684 80.1116 21.684ZM94.1732 24.5H97.8622V16.412C97.8622 14.228 99.2862 12.724 101.402 12.724C103.546 12.724 104.574 14.036 104.574 16.316V24.5H108.263V15.596C108.263 11.732 106.03 9.432 102.278 9.432C100.294 9.432 98.6622 10.22 97.7702 11.576V4.316H94.1732V24.5ZM119.298 24.92C123.77 24.92 126.996 21.904 126.996 17.18C126.996 12.452 123.77 9.432 119.298 9.432C114.826 9.432 111.6 12.452 111.6 17.18C111.6 21.904 114.826 24.92 119.298 24.92ZM119.298 21.684C116.804 21.684 115.38 19.844 115.38 17.18C115.38 14.516 116.804 12.676 119.298 12.676C121.792 12.676 123.216 14.516 123.216 17.18C123.216 19.844 121.792 21.684 119.298 21.684ZM129.236 24.5H132.925V4.316H129.236V24.5Z" fill="#4a89dc"/>
                  <path d="M5.88477 11.3258L16.4414 5.40039L26.998 11.3258V23.1766L16.4414 29.102L5.88477 23.1766V11.3258Z" fill="#fbbc04"/>
                  <path d="M26.998 11.3262L16.4414 17.2516L5.88477 11.3262L16.4414 5.40039L26.998 11.3262Z" fill="#4a89dc"/>
                  <path d="M16.4414 29.102L26.998 23.1766L16.4414 17.2512V29.102Z" fill="#0d61fc"/>
                  <path d="M16.4414 29.102L5.88477 23.1766L16.4414 17.2512V29.102Z" fill="#1a73e8"/>
                  <path d="M35.5 24.5H39.189V4.316H35.5V24.5Z" fill="#4a89dc"/>
                </svg>
              </div>
              <h3 className="text-lg font-display mb-3 text-[#050b17]">Google Gemini</h3>
              <p className="text-gray-600 font-serif text-sm mb-4">Powering real-time travel insights, context-aware recommendations, and smart image analysis for destinations.</p>
              <div className="flex items-center text-sm text-[#4a89dc] font-serif">
                <Globe className="h-4 w-4 mr-1.5" />
                <span>Multimodal capabilities</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-[#4a89dc]/10 shadow-sm hover:shadow transition-all duration-300">
              <div className="h-14 mb-6 flex items-center">
                <svg width="118" height="32" viewBox="0 0 118 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8">
                  <path d="M21.8579 11.4035C22.2877 10.7797 22.9243 10.9509 23.2474 11.4831C23.9773 12.6492 25.4934 15.0289 25.4934 15.0289C25.4934 15.0289 27.0298 12.661 27.7699 11.4831C28.093 10.9628 28.7178 10.7915 29.1357 11.4035C29.5658 12.0392 30.7788 13.9564 31.3327 14.875C31.6558 15.4511 31.5132 16.1573 31.0004 16.5741C29.5133 17.894 26.9548 19.9825 26.9548 19.9825V26.3962C26.9548 27.1143 26.3643 27.694 25.6344 27.694H25.3945C24.6762 27.694 24.0857 27.1143 24.0857 26.3962V19.9825C24.0857 19.9825 21.5272 17.894 20.0282 16.5741C19.5273 16.1573 19.3728 15.4392 19.708 14.875C20.25 13.9564 21.4399 12.0392 21.8579 11.4035ZM80.7974 8.71554C80.7974 8.00926 81.3997 7.42432 82.1295 7.42432H82.3576C83.0875 7.42432 83.678 8.00926 83.678 8.71554V26.3962C83.678 27.1143 83.0875 27.6993 82.3576 27.6993H82.1295C81.3997 27.6993 80.7974 27.1143 80.7974 26.3962V8.71554ZM76.6969 16.5597C76.6969 12.1732 73.0704 8.60549 68.6133 8.60549C64.168 8.60549 60.5416 12.1732 60.5416 16.5597C60.5416 20.9579 64.168 24.514 68.6133 24.514C73.0704 24.514 76.6969 20.9462 76.6969 16.5597ZM73.7883 16.5597C73.7883 19.3611 71.467 21.6411 68.6133 21.6411C65.7714 21.6411 63.4502 19.3611 63.4502 16.5597C63.4502 13.7583 65.7714 11.4784 68.6133 11.4784C71.467 11.4784 73.7883 13.7583 73.7883 16.5597ZM113.987 12.4305C112.63 9.96159 110.047 8.60549 107.296 8.60549C102.851 8.60549 99.2243 12.1732 99.2243 16.5597C99.2243 20.9579 102.851 24.5258 107.296 24.5258C110.059 24.5258 112.642 23.158 113.999 20.7008C114.298 20.125 114.18 19.4189 113.655 19.002C113.166 18.6088 112.523 18.6088 112.034 19.002C111.156 19.7319 109.293 20.6623 107.296 20.6623C105.025 20.6623 103.047 19.2589 102.32 17.2658H115.16C115.878 17.2658 116.457 16.6929 116.469 15.9984C116.469 15.9866 116.469 15.9866 116.469 15.9748C116.469 15.963 116.469 15.963 116.469 15.9512C116.469 15.9276 116.469 15.9158 116.457 15.8922C116.457 15.8804 116.457 15.8686 116.457 15.845C116.457 15.8332 116.457 15.8096 116.445 15.7978C116.445 15.786 116.445 15.7742 116.445 15.7506C116.445 15.7388 116.433 15.7152 116.433 15.7034C116.433 15.6916 116.433 15.668 116.422 15.6562C116.422 15.6444 116.422 15.6208 116.41 15.609C116.41 15.5972 116.398 15.5854 116.398 15.5618C116.398 15.55 116.386 15.5382 116.386 15.5146C116.386 15.5028 116.374 15.491 116.374 15.4674C116.374 15.4556 116.362 15.4438 116.362 15.4202C116.362 15.4084 116.351 15.3966 116.351 15.3848C116.339 15.373 116.339 15.3612 116.327 15.3376C116.327 15.3259 116.315 15.3141 116.315 15.3023C116.304 15.2905 116.304 15.2787 116.292 15.2669C116.28 15.2433 116.28 15.2315 116.268 15.2197C116.268 15.2079 116.256 15.1961 116.256 15.1843C116.244 15.1607 116.244 15.1489 116.233 15.1371C116.233 15.1253 116.221 15.1135 116.221 15.1017C116.209 15.0899 116.209 15.0781 116.197 15.0663C116.197 15.0545 116.185 15.0427 116.185 15.0309C116.174 15.0191 116.174 15.0073 116.162 14.9955C116.162 14.9837 116.15 14.9719 116.15 14.9601C116.138 14.9483 116.138 14.9365 116.127 14.9247C116.127 14.9129 116.115 14.9011 116.115 14.8893C116.103 14.8775 116.103 14.8657 116.091 14.8539C116.091 14.8421 116.079 14.8303 116.079 14.8185C116.068 14.8067 116.068 14.7949 116.056 14.7832C116.056 14.7714 116.044 14.7596 116.044 14.7478C116.032 14.736 116.032 14.7242 116.02 14.7124C116.02 14.7006 116.009 14.6888 116.009 14.677C115.997 14.6652 115.997 14.6534 115.985 14.6416C115.985 14.6298 115.973 14.618 115.973 14.6062C115.961 14.5944 115.961 14.5826 115.95 14.5708C115.95 14.559 115.938 14.5472 115.938 14.5472C115.926 14.5354 115.926 14.5236 115.914 14.5118C115.914 14.5001 115.902 14.4883 115.902 14.4882C115.891 14.4765 115.891 14.4647 115.879 14.4529C115.879 14.4411 115.867 14.4293 115.867 14.4293C115.855 14.4175 115.855 14.4057 115.844 14.3939C115.844 14.3821 115.832 14.3703 115.832 14.3703C115.82 14.3585 115.82 14.3467 115.808 14.3349C115.808 14.3231 115.796 14.3113 115.796 14.3113C115.785 14.2995 115.785 14.2877 115.773 14.2759C115.773 14.2641 115.761 14.2523 115.761 14.2523C115.749 14.2405 115.749 14.2287 115.737 14.2169C115.737 14.2051 115.726 14.1933 115.726 14.1933C115.714 14.1815 115.714 14.1698 115.702 14.158C115.702 14.1462 115.69 14.1344 115.69 14.1226C115.678 14.1108 115.678 14.099 115.667 14.0872C115.667 14.0754 115.655 14.0636 115.655 14.0636C115.643 14.0518 115.643 14.04 115.631 14.0282C115.631 14.0164 115.619 14.0046 115.619 14.0046C115.608 13.9929 115.608 13.9811 115.596 13.9693C115.596 13.9575 115.584 13.9457 115.584 13.9339C115.572 13.9221 115.572 13.9103 115.561 13.8985C115.561 13.8867 115.549 13.8749 115.549 13.8631C115.537 13.8513 115.537 13.8395 115.525 13.8277C115.525 13.8159 115.513 13.8041 115.513 13.7923C115.502 13.7805 115.502 13.7687 115.49 13.757C115.49 13.7452 115.478 13.7334 115.478 13.7216C115.466 13.7098 115.466 13.698 115.454 13.6862C115.454 13.6744 115.443 13.6626 115.443 13.6508C115.431 13.639 115.431 13.6272 115.419 13.6154C115.419 13.6036 115.407 13.5918 115.407 13.58C115.395 13.5682 115.395 13.5564 115.384 13.5446C115.384 13.5328 115.372 13.521 115.372 13.5093C115.36 13.4975 115.36 13.4857 115.348 13.4739C115.348 13.4621 115.336 13.4503 115.336 13.4385C115.325 13.4267 115.325 13.4149 115.313 13.4031C115.313 13.3913 115.301 13.3795 115.301 13.3677C115.289 13.3559 115.289 13.3441 115.277 13.3323C115.218 13.2261 115.16 13.1199 115.09 13.0137C113.987 15.1253 111.347 16.6338 109.099 17.2776H102.379C102.983 13.8395 105.704 11.4784 107.284 11.4784C109.316 11.4784 111.18 12.4087 112.058 13.1404C112.535 13.5336 113.178 13.5336 113.655 13.1376C114.18 12.7208 114.298 12.0147 113.999 11.4388L113.987 12.4305V11.4388V12.4305ZM44.9341 8.71554C44.9341 8.00926 45.5364 7.42432 46.2662 7.42432H46.4944C47.2242 7.42432 47.8147 8.00926 47.8147 8.71554V21.0887L56.9031 8.91977C57.1785 8.535 57.604 8.30373 58.0529 8.30373H58.5538C59.2718 8.30373 59.8505 8.87686 59.8505 9.59495V26.3962C59.8505 27.1143 59.26 27.694 58.5301 27.694H58.302C57.5722 27.694 56.9818 27.1143 56.9818 26.3962V14.023L47.8935 26.1885C47.6181 26.5732 47.1925 26.8045 46.7437 26.8045H46.2428C45.5246 26.8045 44.946 26.2313 44.946 25.5133V8.71554H44.9341ZM95.0053 8.71554C95.0053 8.00926 95.6077 7.42432 96.3375 7.42432H96.5656C97.2954 7.42432 97.886 8.00926 97.886 8.71554V26.3962C97.886 27.1143 97.2954 27.694 96.5656 27.694H96.3375C95.6077 27.694 95.0053 27.1143 95.0053 26.3962V8.71554ZM90.9048 26.3962C90.9048 27.1143 90.3143 27.694 89.5845 27.694H89.3564C88.6266 27.694 88.0242 27.1143 88.0242 26.3962V8.71554C88.0242 8.00926 88.6266 7.42432 89.3564 7.42432H89.5845C90.3143 7.42432 90.9048 8.00926 90.9048 8.71554V26.3962ZM35.8538 16.5597C35.8538 12.1732 32.2273 8.60549 27.782 8.60549C23.3368 8.60549 19.7103 12.1732 19.7103 16.5597C19.7103 20.9579 23.3368 24.514 27.782 24.514C32.2273 24.514 35.8538 20.9462 35.8538 16.5597ZM32.9452 16.5597C32.9452 19.3611 30.6239 21.6411 27.782 21.6411C24.9283 21.6411 22.6071 19.3611 22.6071 16.5597C22.6071 13.7583 24.9283 11.4784 27.782 11.4784C30.6239 11.4784 32.9452 13.7583 32.9452 16.5597ZM56.9031 8.91977L47.8935 26.1885V14.023L56.9818 26.3962V9.59495C56.9818 8.87686 56.4031 8.30373 55.6851 8.30373H55.1842C54.7354 8.30373 54.3098 8.535 54.0344 8.91977L56.9031 8.91977Z" fill="#4a89dc"/>
                </svg>
              </div>
              <h3 className="text-lg font-display mb-3 text-[#050b17]">Claude</h3>
              <p className="text-gray-600 font-serif text-sm mb-4">Handling complex trip planning scenarios and providing nuanced cultural insights for travelers.</p>
              <div className="flex items-center text-sm text-[#4a89dc] font-serif">
                <BookOpen className="h-4 w-4 mr-1.5" />
                <span>Long context understanding</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-[#4a89dc]/10 shadow-sm hover:shadow transition-all duration-300">
              <div className="h-14 mb-6 flex items-center">
                <svg width="118" height="32" viewBox="0 0 118 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8">
                  <path d="M83.9934 4.86253C86.7054 4.86253 89.0514 7.17744 89.0514 10.0246C89.0514 12.8358 86.7054 15.1508 83.9934 15.1508C81.2814 15.1508 78.9354 12.8358 78.9354 10.0246C78.9354 7.17744 81.2814 4.86253 83.9934 4.86253ZM18.7335 8.35359C21.4454 8.35359 23.7915 10.6685 23.7915 13.5156C23.7915 16.3268 21.4454 18.6418 18.7335 18.6418C16.0215 18.6418 13.6394 16.3268 13.6394 13.5156C13.6394 10.6685 16.0215 8.35359 18.7335 8.35359ZM36.4515 8.35359C39.1635 8.35359 41.5095 10.6685 41.5095 13.5156C41.5095 16.3268 39.1635 18.6418 36.4515 18.6418C33.7395 18.6418 31.3935 16.3268 31.3935 13.5156C31.3935 10.6685 33.7395 8.35359 36.4515 8.35359ZM54.1695 8.35359C56.8815 8.35359 59.2275 10.6685 59.2275 13.5156C59.2275 16.3268 56.8815 18.6418 54.1695 18.6418C51.4575 18.6418 49.1115 16.3268 49.1115 13.5156C49.1115 10.6685 51.4575 8.35359 54.1695 8.35359ZM71.8875 8.35359C74.5995 8.35359 76.9455 10.6685 76.9455 13.5156C76.9455 16.3268 74.5995 18.6418 71.8875 18.6418C69.1755 18.6418 66.8295 16.3268 66.8295 13.5156C66.8295 10.6685 69.1755 8.35359 71.8875 8.35359ZM101.675 8.35359C104.387 8.35359 106.733 10.6685 106.733 13.5156C106.733 16.3268 104.387 18.6418 101.675 18.6418C98.9633 18.6418 96.6172 16.3268 96.6172 13.5156C96.6172 10.6685 98.9633 8.35359 101.675 8.35359ZM11.1433 23.9751C13.8552 23.9751 16.2013 26.29 16.2013 29.1372C16.2013 31.9483 13.8552 34.2633 11.1433 34.2633C8.43128 34.2633 6.08524 31.9483 6.08524 29.1372C6.08524 26.29 8.43128 23.9751 11.1433 23.9751ZM28.8614 23.9751C31.5734 23.9751 33.9194 26.29 33.9194 29.1372C33.9194 31.9483 31.5734 34.2633 28.8614 34.2633C26.1494 34.2633 23.8033 31.9483 23.8033 29.1372C23.8033 26.29 26.1494 23.9751 28.8614 23.9751ZM46.5794 23.9751C49.2914 23.9751 51.6374 26.29 51.6374 29.1372C51.6374 31.9483 49.2914 34.2633 46.5794 34.2633C43.8674 34.2633 41.5213 31.9483 41.5213 29.1372C41.5213 26.29 43.8674 23.9751 46.5794 23.9751ZM64.2974 23.9751C67.0094 23.9751 69.3554 26.29 69.3554 29.1372C69.3554 31.9483 67.0094 34.2633 64.2974 34.2633C61.5854 34.2633 59.2394 31.9483 59.2394 29.1372C59.2394 26.29 61.5854 23.9751 64.2974 23.9751ZM82.0154 23.9751C84.7274 23.9751 87.0734 26.29 87.0734 29.1372C87.0734 31.9483 84.7274 34.2633 82.0154 34.2633C79.3034 34.2633 76.9574 31.9483 76.9574 29.1372C76.9574 26.29 79.3034 23.9751 82.0154 23.9751ZM99.7334 23.9751C102.445 23.9751 104.791 26.29 104.791 29.1372C104.791 31.9483 102.445 34.2633 99.7334 34.2633C97.0214 34.2633 94.6753 31.9483 94.6753 29.1372C94.6753 26.29 97.0214 23.9751 99.7334 23.9751Z" fill="#4a89dc"/>
                </svg>
              </div>
              <h3 className="text-lg font-display mb-3 text-[#050b17]">OpenAI</h3>
              <p className="text-gray-600 font-serif text-sm mb-4">Delivering fast, reliable responses for itinerary generation and travel recommendations.</p>
              <div className="flex items-center text-sm text-[#4a89dc] font-serif">
                <Zap className="h-4 w-4 mr-1.5" />
                <span>High-performance processing</span>
              </div>
            </div>
          </div>
        </div>
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
                href="/onboarding" 
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