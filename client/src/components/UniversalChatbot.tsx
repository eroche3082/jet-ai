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
  User
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
import { useAuth } from '@/hooks/useAuth';
import { sendVertexAIChatMessage } from '@/lib/vertexai';
import { ChatMessage, saveChatMessage } from '@/lib/firebase';
import { DEFAULT_SYSTEM_INSTRUCTIONS } from '@/lib/vertexai';

interface UniversalChatbotProps {
  className?: string;
  defaultOpen?: boolean;
  defaultMaximized?: boolean;
}

const UniversalChatbot: React.FC<UniversalChatbotProps> = ({ 
  className,
  defaultOpen = false,
  defaultMaximized = false 
}) => {
  // Auth state
  const { currentUser, userProfile, hasCompletedOnboarding, completeOnboarding, isLoading, isProfileLoading } = useAuth();
  
  // UI state
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximized, setIsMaximized] = useState(defaultMaximized);
  const [activeTab, setActiveTab] = useState('chat');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [location] = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'pt', name: 'Portuguese' }
  ];
  
  // Prevent scrolling when chat is open in maximized mode
  useEffect(() => {
    if (isOpen && isMaximized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMaximized]);

  // Handle chat state based on location
  useEffect(() => {
    // Auto-open chat on /chat page
    if (location === '/chat') {
      setIsOpen(true);
      setIsMaximized(true);
    } else if (isMaximized) {
      // Close fullscreen on other page changes
      setIsMaximized(false);
    }
  }, [location]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMaximized(false);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsOpen(false);
    
    // If we're on the dedicated chat page, redirect back to home
    if (location === '/chat') {
      window.location.href = '/';
    }
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
    // Normally, we would start/stop voice recognition here
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    // Normally, we would enable/disable text-to-speech here
  };

  // Handle camera functionality
  const handleCameraClick = () => {
    // Redirect to camera page
    window.location.href = '/camera';
  };

  // Handle QR scanning
  const handleQrScanClick = () => {
    // Redirect to QR scanner page
    window.location.href = '/qr-scanner';
  };
  
  // Handle QR code generation
  const handleQrGenerateClick = async () => {
    try {
      // Generate QR code for the current page
      const qrCodeUrl = await generateQRCode(window.location.href);
      setQrCodeData(qrCodeUrl);
      setQrCodeModalOpen(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  // Handle AR mode
  const handleARClick = () => {
    // Redirect to AR page
    window.location.href = '/ar';
  };

  // Handle VR mode
  const handleVRClick = () => {
    alert('VR Mode will be enabled soon!');
  };

  // Handle image upload
  const handleImageClick = () => {
    // Typically this would open a file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Here you would typically upload the image and process it
        console.log('Image selected:', file.name);
      }
    };
    input.click();
  };

  // Handle settings
  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  // Handle share
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'JetAI Travel Assistant',
        text: 'Check out this amazing AI-powered travel assistant!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Share this page: ' + window.location.href);
    }
  };
  
  // Function to handle sending a message to the AI
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    if (!currentUser) {
      // Show auth modal or redirect to login
      alert('Please log in to chat with JetAI');
      return;
    }
    
    // Create user message
    const userMessage: Omit<ChatMessage, 'id'> = {
      uid: currentUser.uid,
      content: messageText,
      role: 'user',
      timestamp: new Date()
    };
    
    // Add user message to UI immediately
    const userMessageWithTempId = { ...userMessage, id: `temp-${Date.now()}` };
    setMessages([...messages, userMessageWithTempId]);
    
    // Save user message to Firebase
    const messageId = await saveChatMessage(userMessage);
    
    // Update messages array with actual ID
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === userMessageWithTempId.id ? { ...msg, id: messageId } : msg
      )
    );
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Prepare message history for AI, including system message if needed
      const messageHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
        id: msg.id,
        uid: msg.uid,
        timestamp: msg.timestamp
      }));
      
      // Add a system message to the context if not already there
      if (!messageHistory.some(msg => msg.role === 'system')) {
        // Create a personalized system message if user profile exists
        let systemInstruction = DEFAULT_SYSTEM_INSTRUCTIONS;
        
        if (userProfile) {
          // Add user preferences to the system instructions
          if (userProfile.travelPreferences) {
            const prefs = userProfile.travelPreferences;
            systemInstruction += `\n\nUser Profile Information:`;
            
            if (prefs.upcomingDestinations?.length) {
              systemInstruction += `\n- Upcoming Destinations: ${prefs.upcomingDestinations.join(', ')}`;
            }
            
            if (prefs.travelerType) {
              systemInstruction += `\n- Traveler Type: ${prefs.travelerType}`;
            }
            
            if (prefs.interests?.length) {
              systemInstruction += `\n- Travel Interests: ${prefs.interests.join(', ')}`;
            }
            
            if (prefs.budget) {
              systemInstruction += `\n- Budget Level: ${prefs.budget}`;
            }
            
            if (prefs.preferredAccommodation) {
              systemInstruction += `\n- Preferred Accommodation: ${prefs.preferredAccommodation}`;
            }
          }
          
          systemInstruction += `\n\nUser Name: ${userProfile.name || 'Customer'}`;
          systemInstruction += `\nMembership Level: ${userProfile.membership || 'basic'}`;
        }
        
        // Add system message to history
        messageHistory.unshift({
          role: 'system',
          content: systemInstruction,
          id: 'system-context',
          uid: '',
          timestamp: null
        });
      }
      
      // Add the user's new message
      messageHistory.push({
        role: 'user',
        content: messageText,
        id: messageId || 'temp-user-message',
        uid: currentUser.uid,
        timestamp: new Date()
      });
      
      // Get the AI response
      const aiResponse = await sendVertexAIChatMessage(messageHistory);
      
      // Create assistant message
      const assistantMessage: Omit<ChatMessage, 'id'> = {
        uid: currentUser.uid,
        content: aiResponse.text,
        role: 'assistant',
        timestamp: new Date(),
        emotion: aiResponse.emotion || 'neutral'
      };
      
      // Save assistant message to Firebase
      const assistantMessageId = await saveChatMessage(assistantMessage);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add assistant message to UI
      setMessages(prevMessages => [
        ...prevMessages, 
        { ...assistantMessage, id: assistantMessageId }
      ]);
      
      // Speak response if voice is enabled
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse.text);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Omit<ChatMessage, 'id'> = {
        uid: currentUser.uid,
        content: "I'm sorry, I encountered an error processing your message. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
        emotion: 'confused'
      };
      
      // Save error message to Firebase
      const errorMessageId = await saveChatMessage(errorMessage);
      
      // Add error message to UI
      setMessages(prevMessages => [
        ...prevMessages, 
        { ...errorMessage, id: errorMessageId }
      ]);
    }
  };

  return (
    <>
      {/* QR Code Modal */}
      <Dialog open={qrCodeModalOpen} onOpenChange={setQrCodeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share via QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {qrCodeData ? (
              <div className="p-2 bg-white rounded-lg">
                <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Generating QR code...</span>
              </div>
            )}
            <p className="text-sm text-center text-muted-foreground mt-4">
              Scan this QR code to access the current page on another device
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              className="sm:w-auto w-full"
              onClick={() => {
                if (qrCodeData) {
                  // Import dynamically to avoid SSR issues
                  import('@/lib/qrCode').then(({ downloadQRCode }) => {
                    downloadQRCode(qrCodeData, 'jetai-qrcode.png');
                  });
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button 
              type="button" 
              className="sm:w-auto w-full"
              onClick={() => setQrCodeModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating chat button when chat is closed */}
      {!isOpen && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`fixed bottom-6 right-6 z-50 shadow-lg rounded-full ${className}`}
        >
          <Button 
            onClick={toggleChat}
            size="lg" 
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 relative"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 2 }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
            
            <Badge className="absolute -top-1 -right-1 bg-green-500 border-none">
              AI
            </Badge>
          </Button>
        </motion.div>
      )}
      
      {/* Chat panel when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${isMaximized ? 'inset-0 z-50' : 'bottom-6 right-6 z-50'} flex flex-col`}
          >
            <Card className={`flex flex-col overflow-hidden shadow-xl ${
              isMaximized ? 'w-full h-full rounded-none' : 'w-[400px] h-[600px] rounded-xl'
            }`}>
              {/* Chat header */}
              <div className="flex items-center justify-between bg-primary p-3">
                <div className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
                    <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="font-semibold text-primary-foreground text-lg">JetAI Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/90" onClick={toggleMaximize}>
                    {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/90" onClick={handleClose}>
                    <X size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Action bar */}
              <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
                <div className="flex items-center gap-1">
                  <Button 
                    variant={isMicActive ? "secondary" : "ghost"} 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={toggleMic}
                  >
                    <Mic size={16} className={isMicActive ? "text-primary" : ""} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleImageClick}
                  >
                    <Image size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleCameraClick}
                  >
                    <Camera size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleQrScanClick}
                  >
                    <ScanLine size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleQrGenerateClick}
                  >
                    <QrCode size={16} />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleARClick}
                  >
                    <Glasses size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleVRClick}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 12.5V16.5C3 17.0523 3.44772 17.5 4 17.5H20C20.5523 17.5 21 17.0523 21 16.5V12.5M3 12.5V8.5C3 7.94772 3.44772 7.5 4 7.5H20C20.5523 7.5 21 7.94772 21 8.5V12.5M3 12.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 7.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.5 10.75C7.5 10.1977 7.94772 9.75 8.5 9.75H8.51C9.06228 9.75 9.51 10.1977 9.51 10.75V10.76C9.51 11.3123 9.06228 11.76 8.51 11.76H8.5C7.94772 11.76 7.5 11.3123 7.5 10.76V10.75Z" fill="currentColor"/>
                      <path d="M14.5 14.25C14.5 13.6977 14.9477 13.25 15.5 13.25H15.51C16.0623 13.25 16.51 13.6977 16.51 14.25V14.26C16.51 14.8123 16.0623 15.26 15.51 15.26H15.5C14.9477 15.26 14.5 14.8123 14.5 14.26V14.25Z" fill="currentColor"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleShareClick}
                  >
                    <Share2 size={16} />
                  </Button>
                  <Button 
                    variant={isVoiceEnabled ? "ghost" : "secondary"} 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={toggleVoice}
                  >
                    {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 relative group"
                  >
                    <Languages size={16} />
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                      <div className="py-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              currentLanguage === lang.code 
                                ? 'bg-primary/10 text-primary' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setCurrentLanguage(lang.code)}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleSettingsClick}
                  >
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Main content area */}
              <div className="flex-1 overflow-hidden">
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="h-full flex flex-col"
                >
                  {/* Tab bar */}
                  <TabsList className="px-2 pt-2 bg-transparent justify-start border-b rounded-none gap-4">
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Chat
                    </TabsTrigger>

                    {!hasCompletedOnboarding && currentUser && (
                      <TabsTrigger value="onboarding" className="flex items-center gap-2">
                        <UserCircle2 size={16} />
                        Profile Setup
                      </TabsTrigger>
                    )}
                    
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                      <Settings size={16} />
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  {/* Chat content */}
                  <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0 data-[state=active]:flex flex-col">
                    {/* Show welcome message for new users */}
                    {!isLoading && currentUser && !hasCompletedOnboarding ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <Plane className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium">Welcome to JetAI!</h3>
                        <p className="text-muted-foreground max-w-md">
                          Let's set up your travel preferences to personalize your experience.
                        </p>
                        <Button onClick={() => setActiveTab('onboarding')}>
                          Set Up Your Profile
                        </Button>
                      </div>
                    ) : (
                      // Regular chat interface
                      <div className="flex-1 flex flex-col">
                        {/* Messages container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {/* System welcome message */}
                          {messages.length === 0 && (
                            <div className="flex gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
                                  <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                  <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                  <path d="M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </div>
                              <div className="flex-1 bg-muted p-3 rounded-lg rounded-tl-none">
                                <p className="text-sm">
                                  {userProfile?.name ? `Hello ${userProfile.name}! ` : "Hello! "}
                                  I'm JetAI, your personal luxury travel assistant. I can help you find flights, hotels, and plan your perfect trip.
                                </p>
                                <p className="text-sm mt-2">
                                  How can I assist you today?
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Message list */}
                          {messages.map((message, index) => (
                            <div key={message.id || index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                              {message.role !== 'user' && (
                                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
                                    <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                </div>
                              )}
                              <div 
                                className={`flex-1 p-3 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none ml-12'
                                    : 'bg-muted rounded-tl-none mr-12'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                              {message.role === 'user' && (
                                <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0">
                                  <User size={18} className="text-zinc-600" />
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Typing indicator */}
                          {isTyping && (
                            <div className="flex gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
                                </svg>
                              </div>
                              <div className="flex-1 bg-muted p-3 rounded-lg rounded-tl-none">
                                <div className="flex gap-1">
                                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Input area */}
                        <div className="p-3 border-t">
                          <form 
                            className="flex gap-2"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                              const message = input.value.trim();
                              
                              if (message) {
                                handleSendMessage(message);
                                input.value = '';
                              }
                            }}
                          >
                            <input
                              type="text"
                              name="message"
                              className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Ask me anything about travel..."
                            />
                            <Button type="submit" size="icon">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Button>
                          </form>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Onboarding content */}
                  {!isLoading && currentUser && !hasCompletedOnboarding && (
                    <TabsContent value="onboarding" className="flex-1 overflow-auto m-0 p-4 data-[state=active]:flex flex-col">
                      <OnboardingFlow 
                        onComplete={(preferences) => {
                          completeOnboarding(preferences);
                          setActiveTab('chat');
                          
                          // Add welcome message
                          const welcomeMsg: Omit<ChatMessage, 'id'> = {
                            uid: currentUser.uid,
                            content: `Thanks, ${preferences.upcomingDestinations && preferences.upcomingDestinations.length > 0 
                              ? `I see you're interested in traveling to ${preferences.upcomingDestinations.join(', ')}. ` 
                              : ''}I'll keep your preferences in mind when suggesting travel options. What can I help you with today?`,
                            role: 'assistant',
                            timestamp: new Date(),
                            emotion: 'happy'
                          };
                          
                          // Save message to Firebase
                          saveChatMessage(welcomeMsg)
                            .then(id => {
                              if (id) {
                                setMessages([
                                  ...messages,
                                  { ...welcomeMsg, id }
                                ]);
                              }
                            });
                        }}
                      />
                    </TabsContent>
                  )}
                  
                  <TabsContent value="settings" className="flex-1 overflow-auto m-0 p-4">
                    <h3 className="font-semibold text-lg mb-4">Assistant Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Voice Options</h4>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span>Voice Input</span>
                            <Button 
                              variant={isMicActive ? "default" : "outline"} 
                              size="sm"
                              onClick={toggleMic}
                            >
                              {isMicActive ? "Enabled" : "Disabled"}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Voice Output</span>
                            <Button 
                              variant={isVoiceEnabled ? "default" : "outline"} 
                              size="sm"
                              onClick={toggleVoice}
                            >
                              {isVoiceEnabled ? "Enabled" : "Disabled"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Display Options</h4>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span>Fullscreen Mode</span>
                            <Button 
                              variant={isMaximized ? "default" : "outline"} 
                              size="sm"
                              onClick={toggleMaximize}
                            >
                              {isMaximized ? "Enabled" : "Disabled"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Language Settings</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {languages.map((lang) => (
                            <Button
                              key={lang.code}
                              variant={currentLanguage === lang.code ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentLanguage(lang.code)}
                              className="flex items-center justify-center gap-1"
                            >
                              {lang.name}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select your preferred language for the chat interface
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Advanced Features</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2 justify-start"
                            onClick={handleARClick}
                          >
                            <Glasses size={16} />
                            <span>AR Mode</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2 justify-start"
                            onClick={handleVRClick}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 12.5V16.5C3 17.0523 3.44772 17.5 4 17.5H20C20.5523 17.5 21 17.0523 21 16.5V12.5M3 12.5V8.5C3 7.94772 3.44772 7.5 4 7.5H20C20.5523 7.5 21 7.94772 21 8.5V12.5M3 12.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 7.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7.5 10.75C7.5 10.1977 7.94772 9.75 8.5 9.75H8.51C9.06228 9.75 9.51 10.1977 9.51 10.75V10.76C9.51 11.3123 9.06228 11.76 8.51 11.76H8.5C7.94772 11.76 7.5 11.3123 7.5 10.76V10.75Z" fill="currentColor"/>
                              <path d="M14.5 14.25C14.5 13.6977 14.9477 13.25 15.5 13.25H15.51C16.0623 13.25 16.51 13.6977 16.51 14.25V14.26C16.51 14.8123 16.0623 15.26 15.51 15.26H15.5C14.9477 15.26 14.5 14.8123 14.5 14.26V14.25Z" fill="currentColor"/>
                            </svg>
                            <span>VR Mode</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2 justify-start"
                            onClick={handleQrScanClick}
                          >
                            <ScanLine size={16} />
                            <span>QR Scanner</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2 justify-start"
                            onClick={handleCameraClick}
                          >
                            <Camera size={16} />
                            <span>Camera</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2 justify-start"
                            onClick={handleQrGenerateClick}
                          >
                            <QrCode size={16} />
                            <span>Generate QR</span>
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        variant="default" 
                        onClick={() => setActiveTab('chat')}
                        className="w-full"
                      >
                        Back to Chat
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UniversalChatbot;