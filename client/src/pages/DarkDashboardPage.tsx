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
  Settings,
  Languages,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SimpleOnboardingChat from '@/components/SimpleOnboardingChat';
import { generateQRCode } from '@/lib/chatCodeGenerator';

export default function DarkDashboardPage() {
  const [showChat, setShowChat] = useState(true);
  const [userData, setUserData] = useState<{ 
    name: string; 
    email: string;
  }>();
  const [userCode, setUserCode] = useState<string>('');
  const [userCategory, setUserCategory] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'journey' | 'insights' | 'activity'>('journey');
  const { toast } = useToast();
  
  useEffect(() => {
    // Debug localStorage contents for troubleshooting
    console.log('localStorage contents:', {
      user: localStorage.getItem('jetai_user'),
      code: localStorage.getItem('jetai_user_code'),
      preferences: localStorage.getItem('jetai_user_preferences'),
      category: localStorage.getItem('jetai_user_category')
    });
    
    // Check if we have user data from localStorage
    const savedUserData = localStorage.getItem('jetai_user');
    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Get user code if available
    const savedCode = localStorage.getItem('jetai_user_code');
    if (savedCode) {
      console.log('Found user code:', savedCode);
      setUserCode(savedCode);
      
      // Generate QR code for the user code
      const generateCode = async () => {
        try {
          console.log('Generating QR code for:', savedCode);
          const qrCode = await generateQRCode(savedCode);
          if (qrCode) {
            console.log('QR code generated successfully');
            setQrCodeUrl(qrCode);
          } else {
            console.warn('QR code generation returned null');
          }
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      };
      
      generateCode();
    } else {
      // If no code found, generate a temporary one for testing
      console.log('No user code found, using fallback');
      const tempCode = 'JET-ADV-1234';
      setUserCode(tempCode);
      localStorage.setItem('jetai_user_code', tempCode);
      
      const generateCode = async () => {
        try {
          const qrCode = await generateQRCode(tempCode);
          if (qrCode) {
            setQrCodeUrl(qrCode);
          }
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      };
      
      generateCode();
    }
    
    // Check for user category from preferences analysis
    const savedPreferences = localStorage.getItem('jetai_user_preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        console.log('Found user preferences:', preferences);
        
        if (preferences.travelTypes && preferences.travelTypes.length > 0) {
          // Map travel type to category
          const typeToCategory: Record<string, string> = {
            'Luxury Travel': 'Luxury Traveler',
            'Adventure Travel': 'Adventure Seeker',
            'Business Travel': 'Business Traveler',
            'Family Travel': 'Family Explorer',
            'Solo Travel': 'Solo Explorer',
            'Budget Travel': 'Value Seeker',
            'Cultural Travel': 'Cultural Enthusiast',
            'Eco Travel': 'Eco-Conscious Traveler',
            'Adventure & Outdoors': 'Adventure Seeker'
          };
          
          const primaryType = preferences.travelTypes[0];
          const category = typeToCategory[primaryType] || 'Traveler';
          console.log('Setting user category to:', category);
          setUserCategory(category);
        }
      } catch (e) {
        console.error('Error parsing user preferences:', e);
      }
    } else {
      // Default category if no preferences found
      setUserCategory('Explorer');
    }
    
    // Check for saved user category directly
    const savedCategory = localStorage.getItem('jetai_user_category');
    if (savedCategory) {
      console.log('Found directly saved category:', savedCategory);
      setUserCategory(savedCategory);
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
    },
    {
      title: 'Language Learning for Travel',
      description: 'Learn essential travel phrases in the language of your destination',
      icon: <Languages className="h-5 w-5 text-[#4a89dc]" />,
      path: '/language-learning'
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
        {/* User code card - prominently displayed at the top */}
        {userCode && (
          <div className="mb-10 bg-gradient-to-r from-[#050b17] to-[#0a1021] border border-[#4a89dc]/30 rounded-lg p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <div className="text-sm text-[#4a89dc] mb-1">YOUR PERSONAL JET AI CODE</div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-mono font-bold">{userCode}</h2>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(userCode);
                      toast({ title: "Code copied to clipboard" });
                    }}
                    className="p-1.5 rounded-md bg-[#4a89dc]/10 hover:bg-[#4a89dc]/20 text-[#4a89dc]"
                    aria-label="Copy code"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  {userCategory ? `Category: ${userCategory}` : 'Standard Traveler'}
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-col items-center">
                <div className="text-sm text-gray-400 mb-2">Scan or share your unique code</div>
                <div className="h-24 w-24 bg-white rounded-lg p-1.5 flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
                  ) : (
                    <div className="text-xs text-gray-400 text-center">
                      Generating<br/>QR Code...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-10">
          {/* Left column */}
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl font-display mb-2">Welcome to JET AI</h1>
            <p className="text-gray-400 mb-8">Your intelligent travel companion powered by advanced AI</p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Link 
                  key={index} 
                  href={feature.path || "#"} 
                  className="block bg-[#0a1021] border border-gray-800 rounded-lg p-4 hover:border-[#4a89dc]/50 transition-colors"
                >
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
                </Link>
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
            
            {/* User Journey Tabs */}
            <div className="mt-6 bg-[#0a1021] border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setActiveTab('journey')}
                    className={`font-medium text-lg pb-1 border-b-2 ${activeTab === 'journey' ? 'text-[#4a89dc] border-[#4a89dc]' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                    Your Journey
                  </button>
                  <button 
                    onClick={() => setActiveTab('insights')}
                    className={`font-medium text-lg pb-1 border-b-2 ${activeTab === 'insights' ? 'text-[#4a89dc] border-[#4a89dc]' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                    Insights
                  </button>
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className={`font-medium text-lg pb-1 border-b-2 ${activeTab === 'activity' ? 'text-[#4a89dc] border-[#4a89dc]' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                    Activity
                  </button>
                </div>
                <Button variant="ghost" className="text-sm text-[#4a89dc] hover:text-[#3a79cc]">
                  View All
                </Button>
              </div>
              
              {activeTab === 'journey' && (
                <div className="space-y-4">
                  {/* Level 1 - Always unlocked */}
                  <div className="p-3 border border-[#4a89dc]/30 rounded-lg bg-[#050b17]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#4a89dc] flex items-center justify-center mr-3">
                          <span className="font-bold text-white">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Explorer</h4>
                          <p className="text-xs text-gray-400">Basic travel features</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Unlocked
                      </div>
                    </div>
                  </div>
                  
                  {/* Level 2 - Always unlocked */}
                  <div className="p-3 border border-[#4a89dc]/30 rounded-lg bg-[#050b17]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#4a89dc] flex items-center justify-center mr-3">
                          <span className="font-bold text-white">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Globetrotter</h4>
                          <p className="text-xs text-gray-400">Personalized recommendations</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Unlocked
                      </div>
                    </div>
                  </div>
                  
                  {/* Level 3 - Always unlocked */}
                  <div className="p-3 border border-[#4a89dc]/30 rounded-lg bg-[#050b17]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#4a89dc] flex items-center justify-center mr-3">
                          <span className="font-bold text-white">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Voyager</h4>
                          <p className="text-xs text-gray-400">AI travel planning</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Unlocked
                      </div>
                    </div>
                  </div>
                  
                  {/* Level 4 - Locked, requires upgrade */}
                  <div className="p-3 border border-gray-800 rounded-lg bg-[#050b17]/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                          <span className="font-bold text-gray-400">4</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-400">Pioneer</h4>
                          <p className="text-xs text-gray-500">Premium content access</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-xs h-8 border-[#4a89dc] text-[#4a89dc] hover:bg-[#4a89dc]/10">
                        Upgrade
                      </Button>
                    </div>
                  </div>
                  
                  {/* Level 5 - Locked, requires upgrade */}
                  <div className="p-3 border border-gray-800 rounded-lg bg-[#050b17]/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                          <span className="font-bold text-gray-400">5</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-400">Connoisseur</h4>
                          <p className="text-xs text-gray-500">Exclusive concierge services</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-xs h-8 border-[#4a89dc] text-[#4a89dc] hover:bg-[#4a89dc]/10">
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'insights' && (
                <div className="py-8 text-center">
                  <div className="mb-4">
                    <BarChart4 className="h-12 w-12 mx-auto text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Travel Insights Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Complete your profile and make a few searches to unlock personalized travel analytics and insights.
                  </p>
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div className="py-8 text-center">
                  <div className="mb-4">
                    <FileText className="h-12 w-12 mx-auto text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Your recent searches, bookings, and interactions will appear here. Start exploring to see your activity.
                  </p>
                </div>
              )}
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
