import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Compass, 
  MessageSquare, 
  FileText, 
  BarChart4,
  ChevronRight,
  Search,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleOnboardingChat from '@/components/SimpleOnboardingChat';

export default function DarkDashboardPage() {
  const [showChat, setShowChat] = useState(true);
  const [userData, setUserData] = useState<{ name: string; email: string }>();
  
  useEffect(() => {
    // Check if we have user data from localStorage
    const savedUserData = localStorage.getItem('jetai_user');
    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);
  
  const features = [
    {
      title: 'Personalized Travel Recommendations',
      description: 'Get tailored suggestions based on your preferences and travel style',
      icon: <Compass className="h-5 w-5 text-[#4a89dc]" />
    },
    {
      title: 'Destination Research',
      description: 'Access detailed information about any location in the world',
      icon: <Search className="h-5 w-5 text-[#4a89dc]" />
    },
    {
      title: 'AI Travel Assistant',
      description: 'Chat with our AI to plan trips, find deals, and solve travel challenges',
      icon: <MessageSquare className="h-5 w-5 text-[#4a89dc]" />
    },
    {
      title: 'Interactive Itineraries',
      description: 'Create and manage detailed travel plans with our smart tools',
      icon: <FileText className="h-5 w-5 text-[#4a89dc]" />
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#050b17] text-white">
      {/* Top navigation */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <div className="ml-2">
                <div className="font-display text-xl tracking-tight">JET AI</div>
                <div className="text-xs text-white/70 -mt-1 font-serif">TRAVEL COMPANION</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="px-3 py-2 text-[#4a89dc] border-b-2 border-[#4a89dc]">Dashboard</Link>
              <Link href="/trips" className="px-3 py-2 text-gray-400 hover:text-white">My Trips</Link>
              <Link href="/explore" className="px-3 py-2 text-gray-400 hover:text-white">Explore</Link>
              <Link href="/features" className="px-3 py-2 text-gray-400 hover:text-white">AI Features</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-400 hover:text-white p-2">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white p-2">
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white p-2"
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('jetai_user');
                window.location.href = '/';
              }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-10">
          {/* Left column */}
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl font-display mb-2">Welcome to JET AI</h1>
            <p className="text-gray-400 mb-8">Your intelligent travel companion powered by advanced AI</p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-[#0a1021] border border-gray-800 rounded-lg p-4 hover:border-[#4a89dc]/50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#4a89dc]/10 flex items-center justify-center mr-3">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex space-x-4">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                Start Planning
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                Browse Destinations
              </Button>
            </div>
            
            {/* Analytics preview */}
            <div className="mt-10 bg-[#0a1021] border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5 text-[#4a89dc]" />
                  Travel Insights
                </h3>
                <Button variant="ghost" className="text-sm text-[#4a89dc] hover:text-[#3a79cc]">
                  View All
                </Button>
              </div>
              <div className="h-32 flex items-center justify-center border-t border-gray-800 pt-4">
                <p className="text-gray-500 text-sm">Complete your profile to unlock personalized travel analytics</p>
              </div>
            </div>
          </div>
          
          {/* Right column - Chat interface */}
          <div className="lg:w-1/2">
            {showChat ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-[#050b17] text-white p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-[#050b17]" />
                    </div>
                    <div>
                      <div className="font-medium">JET AI Onboarding</div>
                      <div className="text-xs text-white/70 -mt-0.5">Personalizing your travel experience</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowChat(false)} 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4 h-[350px] overflow-y-auto bg-gray-50">
                  <div className="flex items-start mb-4">
                    <div className="mr-2 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-medium text-sm">AI</span>
                    </div>
                    <div>
                      <div className="bg-white text-[#050b17] border border-gray-200 rounded-lg px-4 py-3 inline-block">
                        Hi there! Welcome to JET AI. I'm your travel AI Assistant.
                        Let's personalize your experience.
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">vertex-flash-ai</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="mr-2 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-medium text-sm">AI</span>
                    </div>
                    <div>
                      <div className="bg-white text-[#050b17] border border-gray-200 rounded-lg px-4 py-3 inline-block">
                        What's your name?
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">vertex-flash-ai</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter your name..."
                      className="flex-1 border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a89dc]/30 focus:border-[#4a89dc]"
                    />
                    <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white rounded-full h-10 w-10 p-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                    </Button>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-2">
                    Your responses help us personalize your travel experience
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0a1021] border border-gray-800 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-[#4a89dc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-[#4a89dc]" />
                </div>
                <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
                <p className="text-gray-400 mb-6">Chat with JET AI to plan your next adventure</p>
                <Button 
                  onClick={() => setShowChat(true)}
                  className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white mx-auto"
                >
                  Open Chat
                </Button>
              </div>
            )}
            
            {/* Optional additional card */}
            <div className="mt-6 bg-[#0a1021] border border-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Travel Recommendations</h3>
              <p className="text-sm text-gray-400">Complete the onboarding chat to get personalized destinations and experiences tailored just for you.</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0a1021] border-t border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 JET AI Travel Companion. All rights reserved.</p>
            <p className="mt-2">Powered by advanced AI models from Google, OpenAI, and Anthropic</p>
          </div>
        </div>
      </footer>
      
      {/* Real interactive chat component */}
      {false && (
        <SimpleOnboardingChat
          onClose={() => {}}
          onComplete={(userData) => {
            console.log('Onboarding complete:', userData);
            localStorage.setItem('jetai_user', JSON.stringify(userData));
          }}
        />
      )}
    </div>
  );
}
