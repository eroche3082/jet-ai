import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { MessageSquare, X, Volume2, Mic } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OnboardingChat from '@/components/OnboardingChat';
import AIChat from '@/components/AIChat';
import { 
  createUserProfile, 
  registerWithEmail,
  auth,
  updateUserProfile
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Type for the different chat modes
type ChatMode = 'onboarding' | 'assistant';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('assistant');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
    
    // If user is not logged in, show onboarding
    if (!loggedInStatus) {
      setChatMode('onboarding');
    }
    
    // Check voice preference
    const voicePreference = localStorage.getItem('jetai_voice_enabled') === 'true';
    setVoiceEnabled(voicePreference);
  }, []);

  const handleChatOpen = () => {
    setIsOpen(true);
  };

  const toggleVoice = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    localStorage.setItem('jetai_voice_enabled', newValue.toString());
    
    toast({
      title: newValue ? "Voice Mode Enabled" : "Voice Mode Disabled",
      description: newValue 
        ? "You can now speak to JET AI and hear responses."
        : "Voice interaction has been turned off.",
    });
  };

  // Handle onboarding completion with Firebase integration
  const handleOnboardingComplete = async (userData: any) => {
    console.log('Onboarding complete with user data:', userData);
    setChatMode('assistant');
    
    try {
      // Generate a password from email (temporary for demo)
      const password = `${userData.email.split('@')[0]}123456`;
      
      // Register with Firebase
      const user = await registerWithEmail(userData.email, password);
      
      if (user) {
        // Create user profile with preferences
        await createUserProfile(user, {
          name: userData.name,
          email: userData.email,
          completedOnboarding: true,
          travelPreferences: userData.preferences
        });
        
        // Store basic info in localStorage for persistence
        localStorage.setItem('jetai_user', JSON.stringify({
          name: userData.name,
          email: userData.email,
          uid: user.uid
        }));
        
        // Store user code if available (essential for journey tracking)
        if (userData.code) {
          localStorage.setItem('jetai_user_code', userData.code);
        }
        
        // Store user preferences for category determination
        if (userData.preferences) {
          localStorage.setItem('jetai_user_preferences', JSON.stringify(userData.preferences));
        }
        
        // Set logged in state
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        
        // Inform user of successful registration
        toast({
          title: "Registration Successful",
          description: `Welcome ${userData.name}! Your personalized dashboard is ready.`,
        });
      } else {
        throw new Error('Failed to create user account');
      }
    } catch (error: any) {
      console.error('Error during onboarding completion:', error);
      
      // If user already exists, try to update profile
      if (error.code === 'auth/email-already-in-use') {
        try {
          // Try to log in the user (not implemented here)
          toast({
            title: "Welcome Back!",
            description: "Your profile has been updated with new preferences.",
          });
          
          // Store basic info for now
          localStorage.setItem('jetai_user', JSON.stringify({
            name: userData.name,
            email: userData.email
          }));
          
          // Store user code if available (essential for journey tracking)
          if (userData.code) {
            localStorage.setItem('jetai_user_code', userData.code);
          }
          
          // Store user preferences for category determination
          if (userData.preferences) {
            localStorage.setItem('jetai_user_preferences', JSON.stringify(userData.preferences));
          }
          
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
        } catch (loginError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not complete registration. Please try again.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not complete registration. Please try again.",
        });
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button - Standardized position: bottom-right on all pages */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Voice toggle button (only for logged in users) */}
        {isLoggedIn && isOpen && (
          <button
            onClick={toggleVoice}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              voiceEnabled 
                ? "bg-[#4a89dc] text-white" 
                : "bg-white text-[#4a89dc] border border-[#4a89dc]/30"
            }`}
            aria-label={voiceEnabled ? "Disable voice interaction" : "Enable voice interaction"}
            title={voiceEnabled ? "Disable voice" : "Enable voice"}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}
        
        {/* Main chat button */}
        <button 
          onClick={handleChatOpen}
          className="w-14 h-14 rounded-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white shadow-lg flex items-center justify-center transition-all duration-300 animate-pulse-soft"
          aria-label="Open chat assistant"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 animate-pulse"></span>
        </button>
      </div>

      {/* Chat Dialog - Standardized UI */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] h-[600px] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="bg-[#050b17] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#4a89dc]/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-[#4a89dc]" />
                </div>
                <span className="font-medium">
                  {chatMode === 'onboarding' ? 'JET AI Onboarding' : 'JET AI Assistant'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <button
                    onClick={toggleVoice}
                    className="text-white/70 hover:text-white"
                    aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
                    title={voiceEnabled ? "Disable voice" : "Enable voice"}
                  >
                    {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow overflow-hidden">
              {chatMode === 'onboarding' ? (
                <OnboardingChat onComplete={handleOnboardingComplete} />
              ) : (
                <AIChat voiceEnabled={voiceEnabled} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}