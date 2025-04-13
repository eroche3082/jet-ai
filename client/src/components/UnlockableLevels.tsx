import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Award, CreditCard, Gift, Check, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '@/lib/stripeSession';
import { unlockLevel, validateAccessCode } from '@/lib/accessCodeSystem';

interface Level {
  id: string;
  name: string;
  description: string;
  features: string[];
  isUnlocked: boolean;
  price?: number;
}

interface UnlockableLevelsProps {
  userAccessCode: string;
  unlockedLevels: string[];
}

export default function UnlockableLevels({ userAccessCode, unlockedLevels }: UnlockableLevelsProps) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  // Populate levels data
  useEffect(() => {
    const levelsData: Level[] = [
      {
        id: 'level1',
        name: 'Level 1: Basic Travel',
        description: 'Get started with basic JET AI travel planning tools',
        features: [
          'Simple itinerary creation',
          'Basic travel recommendations',
          'Limited AI assistant interactions'
        ],
        isUnlocked: true // Always unlocked by default
      },
      {
        id: 'level2',
        name: 'Level 2: Enhanced Planning',
        description: 'Unlock enhanced travel planning capabilities',
        features: [
          'Advanced itinerary builder',
          'Personalized recommendations',
          'Basic flight and hotel search'
        ],
        isUnlocked: unlockedLevels.includes('Level 2')
      },
      {
        id: 'level3',
        name: 'Level 3: Travel Insights',
        description: 'Access deeper travel insights and analytics',
        features: [
          'Travel trend analysis',
          'Destination deep dives',
          'Budget optimization tools'
        ],
        isUnlocked: unlockedLevels.includes('Level 3')
      },
      {
        id: 'level4',
        name: 'Level 4: Premium Assistant',
        description: 'Unlock premium AI assistant features',
        features: [
          '24/7 AI travel concierge',
          'Real-time flight alerts',
          'Customized travel guides'
        ],
        isUnlocked: unlockedLevels.includes('Level 4 (paid)'),
        price: 9.99
      },
      {
        id: 'level5',
        name: 'Level 5: Luxury Services',
        description: 'Access exclusive luxury travel services',
        features: [
          'VIP booking service',
          'Exclusive hotel partnerships',
          'Priority customer support'
        ],
        isUnlocked: unlockedLevels.includes('Level 5 (paid)'),
        price: 19.99
      },
      {
        id: 'level6',
        name: 'Level 6: Ultimate Explorer',
        description: 'Become an ultimate explorer with top-tier benefits',
        features: [
          'Access to invitation-only events',
          'Custom travel planning with experts',
          'Exclusive partner discounts'
        ],
        isUnlocked: unlockedLevels.includes('Level 6 (paid)'),
        price: 29.99
      }
    ];

    setLevels(levelsData);
  }, [unlockedLevels]);

  // Handle referral code redemption
  const handleRedeemReferral = async () => {
    if (!referralCode) {
      toast({
        title: 'Empty Code',
        description: 'Please enter a referral or promo code.',
        variant: 'destructive'
      });
      return;
    }

    setIsRedeeming(true);
    
    try {
      // Simulate API call to validate the code
      const isValid = await validateAccessCode(referralCode);
      
      if (isValid) {
        // Simulate unlocking Level 4
        const levelToUnlock = 'Level 4 (paid)';
        await unlockLevel(userAccessCode, levelToUnlock);
        
        // Update the UI
        setLevels(levels.map(level => 
          level.id === 'level4' ? { ...level, isUnlocked: true } : level
        ));
        
        toast({
          title: 'Success!',
          description: 'Referral code redeemed successfully. Level 4 unlocked!',
        });
        
        setShowReferralDialog(false);
      } else {
        toast({
          title: 'Invalid Code',
          description: 'The referral code you entered is invalid or expired.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error redeeming referral code:', error);
      toast({
        title: 'Redemption Failed',
        description: 'Could not redeem the referral code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  // Handle unlock with payment
  const handleUnlockWithPayment = async (level: Level) => {
    setSelectedLevel(level);
    setIsCheckingOut(true);
    
    try {
      // Create Stripe checkout session
      const levelName = `Level ${level.id.replace('level', '')} (paid)`;
      const session = await createCheckoutSession({
        accessCode: userAccessCode,
        levelToUnlock: levelName
      });
      
      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout Failed',
        description: 'Could not initiate the payment process. Please try again.',
        variant: 'destructive'
      });
      setIsCheckingOut(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Travel Mastery Levels</h2>
        <p className="text-gray-600">
          Unlock premium features and content with your access code: <span className="font-mono font-bold">{userAccessCode}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((level) => (
          <Card 
            key={level.id} 
            className={`transition-all ${level.isUnlocked 
              ? 'border-[#4a89dc]' 
              : 'border-gray-200 bg-gray-50'}`}
          >
            <CardHeader className={level.isUnlocked ? 'bg-[#4a89dc]/10' : ''}>
              <CardTitle className="flex items-center gap-2">
                {level.isUnlocked ? (
                  <Unlock className="h-5 w-5 text-[#4a89dc]" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
                {level.name}
              </CardTitle>
              <CardDescription>
                {level.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {level.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`h-5 w-5 mt-0.5 ${level.isUnlocked ? 'text-[#4a89dc]' : 'text-gray-400'}`} />
                    <span className={level.isUnlocked ? '' : 'text-gray-500'}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {level.price && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-lg">${level.price.toFixed(2)}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {level.isUnlocked ? (
                <Button variant="outline" className="w-full" disabled>
                  <Award className="mr-2 h-4 w-4" />
                  Unlocked
                </Button>
              ) : (
                <div className="w-full space-y-2">
                  <Button 
                    className="w-full bg-[#4a89dc] hover:bg-[#3a79cc]"
                    onClick={() => handleUnlockWithPayment(level)}
                    disabled={isCheckingOut && selectedLevel?.id === level.id}
                  >
                    {isCheckingOut && selectedLevel?.id === level.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    {level.price ? `Unlock for $${level.price.toFixed(2)}` : 'Unlock Now'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowReferralDialog(true)}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Use Referral Code
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Referral Code Dialog */}
      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem a Referral Code</DialogTitle>
            <DialogDescription>
              Enter a valid referral or promo code to unlock premium features without payment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input 
                id="referralCode" 
                placeholder="e.g., TRAVEL-REF-1234" 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowReferralDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRedeemReferral}
              disabled={isRedeeming}
            >
              {isRedeeming ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Gift className="mr-2 h-4 w-4" />
              )}
              Redeem Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}