import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Infinity, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatBubbleProps {
  onClick: () => void;
}

interface MembershipData {
  id: number;
  membershipTier: 'basic' | 'freemium' | 'premium';
  aiCreditsRemaining: number;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  const [showBadge, setShowBadge] = useState(false);
  
  // Fetch membership data to show credits
  const { data: membership } = useQuery({
    queryKey: ['/api/user/membership'],
    retry: false,
    // Don't show error if not logged in
    onError: () => {},
  });

  useEffect(() => {
    // Show the badge after a small delay for a better UI experience
    const timer = setTimeout(() => {
      setShowBadge(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const membershipData = membership as MembershipData | undefined;
  const isPremium = membershipData?.membershipTier === 'premium';
  const creditsRemaining = membershipData?.aiCreditsRemaining || 0;
  
  return (
    <div className="relative">
      <button 
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center transition animate-pulse-soft"
        aria-label="Open chat assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
      
      {showBadge && membershipData && (
        <Badge 
          className={`absolute -top-2 -right-2 ${
            isPremium 
              ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' 
              : creditsRemaining > 0 
                ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200' 
                : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
          }`}
        >
          {isPremium ? (
            <div className="flex items-center">
              <Infinity className="w-3 h-3 mr-1" />
              <span>Unlimited</span>
            </div>
          ) : (
            `${creditsRemaining} credits`
          )}
        </Badge>
      )}
    </div>
  );
}
