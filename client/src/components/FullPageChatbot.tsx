import { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Image, 
  QrCode, 
  ScanLine, 
  Glasses, 
  Share2, 
  Settings, 
  Maximize2, 
  Minimize2, 
  X, 
  Volume2, 
  VolumeX, 
  Camera,
  Globe,
  Languages,
  Download,
  UserCircle2,
  User,
  Plane,
  Send,
  PaintBucket
} from 'lucide-react';
import { generateQRCode } from '@/lib/qrCode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import AIChat from '@/components/AIChat';
import TravelCockpit from '@/components/TravelCockpit';
import OnboardingFlow from '@/components/OnboardingFlow';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { sendVertexAIChatMessage } from '@/lib/vertexai';
import { ChatMessage, saveChatMessage } from '@/lib/firebase';
import { DEFAULT_SYSTEM_INSTRUCTIONS } from '@/lib/vertexai';
import CanvaVisualEngine from '@/components/CanvaVisualEngine';

/**
 * FullPageChatbot - A full-page version of the chatbot interface
 * with direct access to the Visual Itinerary Creator
 */
const FullPageChatbot: React.FC = () => {
  // State for chatbot and UI
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('visualitinerary');
  const [isCockpitOpen, setIsCockpitOpen] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isMicActive, setIsMicActive] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // We'll implement guest-only mode since authentication is not required
  const guestId = localStorage.getItem('jetai_guest_id') || crypto.randomUUID();
  localStorage.setItem('jetai_guest_id', guestId);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation();

  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  ];

  // Add welcome message when component mounts
  useEffect(() => {
    // Get or create a guest user ID
    const guestId = localStorage.getItem('jetai_guest_id') || crypto.randomUUID();
    localStorage.setItem('jetai_guest_id', guestId);
    
    const systemMessage: ChatMessage = {
      id: crypto.randomUUID(),
      uid: guestId,
      role: 'system',
      content: DEFAULT_SYSTEM_INSTRUCTIONS,
      timestamp: new Date().toISOString(),
    };
    
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      uid: guestId,
      role: 'assistant',
      content: "Welcome to JetAI, your personal luxury travel concierge. I'm here to help you create personalized travel experiences. Try our Visual Itinerary Creator to design beautiful travel plans!",
      timestamp: new Date().toISOString(),
    };
    
    setMessages([systemMessage, welcomeMessage]);
    
    // Automatically open Travel Cockpit and select visualitinerary tab
    setIsCockpitOpen(true);
    setActiveTab('visualitinerary');
    
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle input submission
  const handleSubmit = async (message: string, options?: { isVoice?: boolean }) => {
    if (!message.trim()) return;
    
    // Get or create a guest user ID
    const guestId = localStorage.getItem('jetai_guest_id') || crypto.randomUUID();
    localStorage.setItem('jetai_guest_id', guestId);
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      uid: guestId,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Save the message to history if needed
      // For guest users, we're just keeping the messages in state for now
      
      // Get AI response (simplified for now - just echo back)
      setTimeout(() => {
        const responseText = `I understand you're interested in "${message}". How can I help with your travel plans?`;
        
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          uid: guestId,
          role: 'assistant',
          content: responseText,
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        uid: guestId,
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
    
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Share chat as QR code
  const handleShareChat = async () => {
    try {
      // Generate a URL to the current chat
      const shareUrl = `${window.location.origin}/chat?shared=true`;
      const qrCode = await generateQRCode(shareUrl);
      setQrCodeData(qrCode);
      setQrCodeModalOpen(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Plane className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold">JetAI</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            title={isVoiceEnabled ? "Mute voice" : "Enable voice"}
          >
            {isVoiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleShareChat}
            title="Share as QR code"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex">
        {/* Left sidebar - Chat */}
        <div className={`${isCockpitOpen ? 'w-1/3 border-r' : 'w-full'} flex flex-col h-full transition-all duration-300`}>
          <div className="p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            {messages.filter(m => m.role !== 'system').map((msg) => (
              <div 
                key={msg.id}
                className={`mb-4 p-3 rounded-lg max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'ml-auto bg-primary text-white' 
                    : 'mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                {msg.content}
              </div>
            ))}
            
            {isTyping && (
              <div className="mb-4 p-3 rounded-lg max-w-[85%] mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t">
            <form 
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (inputRef.current) {
                  handleSubmit(inputRef.current.value);
                }
              }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsMicActive(!isMicActive)}
                className={isMicActive ? 'text-red-500' : ''}
              >
                <Mic className="h-5 w-5" />
              </Button>
              
              <input
                type="text"
                ref={inputRef}
                placeholder="Ask about travel, or try the Visual Itinerary Creator..."
                className="flex-1 rounded-full border border-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              <Button type="submit" variant="ghost" size="icon">
                <Send className="h-5 w-5" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsCockpitOpen(!isCockpitOpen)}
                title={isCockpitOpen ? "Hide Travel Cockpit" : "Show Travel Cockpit"}
              >
                {isCockpitOpen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Right panel - TravelCockpit */}
        {isCockpitOpen && (
          <div className="w-2/3 h-full flex flex-col">
            <div className="p-3 border-b flex items-center">
              <h2 className="text-lg font-semibold">Travel Tools</h2>
              <div className="ml-auto flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('visualitinerary')}
                  className={activeTab === 'visualitinerary' ? 'bg-primary/10' : ''}
                >
                  <PaintBucket className="h-4 w-4 mr-2" />
                  Visual Itinerary
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('explore')}
                  className={activeTab === 'explore' ? 'bg-primary/10' : ''}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Explore
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('flights')}
                  className={activeTab === 'flights' ? 'bg-primary/10' : ''}
                >
                  <Plane className="h-4 w-4 mr-2" />
                  Flights
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'visualitinerary' && (
                <CanvaVisualEngine />
              )}
              {activeTab === 'explore' && (
                <div className="h-full flex flex-col items-center justify-center">
                  <Globe className="h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-medium">Explore Destinations</h3>
                  <p className="text-center text-muted-foreground max-w-md mt-2">
                    Discover exciting destinations and travel experiences around the world.
                  </p>
                </div>
              )}
              {activeTab === 'flights' && (
                <div className="h-full flex flex-col items-center justify-center">
                  <Plane className="h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-medium">Find Flights</h3>
                  <p className="text-center text-muted-foreground max-w-md mt-2">
                    Search for the best flight deals to your dream destinations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* QR Code Dialog */}
      <Dialog open={qrCodeModalOpen} onOpenChange={setQrCodeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share This Chat</DialogTitle>
          </DialogHeader>
          
          {qrCodeData && (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Scan this QR code to share this chat session with others.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setQrCodeModalOpen(false)}>Close</Button>
            {qrCodeData && (
              <Button 
                variant="outline"
                onClick={() => {
                  // Download QR code
                  const link = document.createElement('a');
                  link.href = qrCodeData;
                  link.download = 'jetai-chat-qr.png';
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Language</h3>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLanguage === lang.code ? "default" : "outline"}
                    className="flex items-center justify-center"
                    onClick={() => setCurrentLanguage(lang.code)}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Preferences</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                >
                  {isVoiceEnabled 
                    ? <Volume2 className="h-4 w-4 mr-2" /> 
                    : <VolumeX className="h-4 w-4 mr-2" />
                  }
                  Voice Responses: {isVoiceEnabled ? 'On' : 'Off'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowOnboarding(true)}
                >
                  <UserCircle2 className="h-4 w-4 mr-2" />
                  Personalize Your Experience
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullPageChatbot;