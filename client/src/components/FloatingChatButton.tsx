import { useState } from 'react';
import { useLocation } from 'wouter';
import { MessageSquare, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AIChat from '@/components/AIChat';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleChatOpen = () => {
    setIsOpen(true);
  };

  const handleStartOnboarding = () => {
    setIsOpen(false);
    setLocation('/onboarding');
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
                <span className="font-medium">JET AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-hidden">
              <AIChat />
            </div>
            
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Need more personalized recommendations?</span>
                <button 
                  onClick={handleStartOnboarding}
                  className="text-xs text-[#4a89dc] hover:text-[#3a79cc] font-medium"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}