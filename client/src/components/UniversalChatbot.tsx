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
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import AIChat from '@/components/AIChat';
import TravelCockpit from '@/components/TravelCockpit';
import { Link, useLocation } from 'wouter';

interface UniversalChatbotProps {
  className?: string;
}

const UniversalChatbot: React.FC<UniversalChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [location] = useLocation();
  
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

  // Close chat on location change
  useEffect(() => {
    if (isMaximized) {
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

  return (
    <>
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
                  <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0 data-[state=active]:flex flex-col">
                    <TravelCockpit 
                      isOpen={true}
                      onClose={() => setIsOpen(false)}
                    />
                  </TabsContent>
                  
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