import { useState } from 'react';
import { useLocation } from 'wouter';
import { MessageSquare, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OnboardingChat from '@/components/OnboardingChat';
import { 
  createUserProfile, 
  registerWithEmail,
  auth,
  updateUserProfile
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleChatOpen = () => {
    setIsOpen(true);
  };

  // Handle onboarding completion with Firebase integration
  const handleOnboardingComplete = async (userData: any) => {
    console.log('Onboarding complete with user data:', userData);
    setIsOpen(false);
    
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
        
        // Set logged in state
        localStorage.setItem('isLoggedIn', 'true');
        
        // Inform user of successful registration
        toast({
          title: "Registration Successful",
          description: `Welcome ${userData.name}! Your personalized dashboard is ready.`,
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
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
          
          localStorage.setItem('isLoggedIn', 'true');
          setLocation('/dashboard');
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
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={handleChatOpen}
          className="w-14 h-14 rounded-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white shadow-lg flex items-center justify-center transition-all duration-300 animate-pulse-soft"
          aria-label="Open chat assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] h-[600px] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="bg-[#050b17] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#4a89dc]/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-[#4a89dc]" />
                </div>
                <span className="font-medium">JET AI Onboarding</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-hidden">
              <OnboardingChat onComplete={handleOnboardingComplete} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}