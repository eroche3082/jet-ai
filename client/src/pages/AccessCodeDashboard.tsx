import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, QrCode, Share2, LockOpen, Users } from 'lucide-react';
import AccessCodeQRGenerator from '@/components/AccessCodeQRGenerator';
import UnlockableLevels from '@/components/UnlockableLevels';
import { validateAccessCode, generateAccessCode, saveAccessCode, CodeType, UserCategory } from '@/lib/accessCodeSystem';
import { handleStripeRedirect } from '@/lib/stripeSession';

// Define a sample access code and unlocked levels for demonstration
// In a real implementation, these would come from the user's profile in Firebase
const SAMPLE_ACCESS_CODE = 'TRAVEL-LUX-ES-1099';
const SAMPLE_UNLOCKED_LEVELS = ['Level 1', 'Level 2', 'Level 3'];

export default function AccessCodeDashboard() {
  const [accessCode, setAccessCode] = useState<string>('');
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);
  const [stripeSuccess, setStripeSuccess] = useState<boolean>(false);
  const [unlockedLevel, setUnlockedLevel] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for Stripe redirect first
    const checkStripeRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasStripeParams = urlParams.has('session_id') || urlParams.has('success');
      
      if (hasStripeParams) {
        const result = await handleStripeRedirect();
        
        if (result.success) {
          setStripeSuccess(true);
          setUnlockedLevel(result.level);
          
          // If there's a new level unlocked, add it to our state
          if (result.level && !unlockedLevels.includes(result.level)) {
            setUnlockedLevels(prev => [...prev, result.level]);
          }
          
          // Clean up URL
          window.history.replaceState({}, document.title, '/access-dashboard');
        }
      }
    };
    
    // Load or create access code
    const loadAccessCode = async () => {
      setIsLoading(true);
      
      try {
        // Check URL for access code
        const urlParams = new URLSearchParams(window.location.search);
        const codeFromUrl = urlParams.get('code');
        
        // For demo purposes, we'll use the sample code
        // In a real app, you'd check if the user has a code in their profile
        
        if (codeFromUrl) {
          // Validate code from URL
          const validatedCode = await validateAccessCode(codeFromUrl);
          
          if (validatedCode) {
            setAccessCode(codeFromUrl);
            setUnlockedLevels(validatedCode.unlockedLevels || SAMPLE_UNLOCKED_LEVELS);
            setIsCodeValid(true);
            
            // Clean up URL if not from Stripe
            if (!urlParams.has('session_id')) {
              window.history.replaceState({}, document.title, '/access-dashboard');
            }
          } else {
            // Invalid code, use sample
            setAccessCode(SAMPLE_ACCESS_CODE);
            setUnlockedLevels(SAMPLE_UNLOCKED_LEVELS);
            setIsCodeValid(true);
            
            toast({
              title: 'Invalid Access Code',
              description: 'The provided access code is invalid. Using a sample code instead.',
              variant: 'destructive'
            });
          }
        } else {
          // No code in URL, use sample
          setAccessCode(SAMPLE_ACCESS_CODE);
          setUnlockedLevels(SAMPLE_UNLOCKED_LEVELS);
          setIsCodeValid(true);
        }
        
        await checkStripeRedirect();
      } catch (error) {
        console.error('Error loading access code:', error);
        toast({
          title: 'Error',
          description: 'Could not load or validate your access code.',
          variant: 'destructive'
        });
        
        // Fallback to sample
        setAccessCode(SAMPLE_ACCESS_CODE);
        setUnlockedLevels(SAMPLE_UNLOCKED_LEVELS);
        setIsCodeValid(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccessCode();
  }, []);

  // Generate a new access code (for demonstration)
  const handleGenerateNewCode = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to generate a new access code.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const newCode = generateAccessCode(
        CodeType.TRAVEL,
        UserCategory.LUXURY,
        'ES' // Example country code
      );
      
      // Save to database
      const success = await saveAccessCode(
        user.id.toString(),
        newCode,
        CodeType.TRAVEL,
        UserCategory.LUXURY,
        'ES'
      );
      
      if (success) {
        setAccessCode(newCode);
        toast({
          title: 'New Code Generated',
          description: 'Your new access code has been created successfully.',
        });
      } else {
        throw new Error('Failed to save access code');
      }
    } catch (error) {
      console.error('Error generating new code:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate a new access code. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle referral system
  const handleCreateReferral = () => {
    // Generate a referral link with the user's access code
    const referralLink = `${window.location.origin}/auth?referral=${accessCode}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(referralLink);
    
    toast({
      title: 'Referral Link Copied',
      description: 'Your personal referral link has been copied to the clipboard.',
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#4a89dc] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#050b17] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">JET AI Access Dashboard</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {/* Success alert from Stripe payment */}
        {stripeSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-500" />
            <AlertTitle>Payment Successful!</AlertTitle>
            <AlertDescription>
              {unlockedLevel 
                ? `You've successfully unlocked ${unlockedLevel}. Enjoy your new premium features.`
                : 'Your payment was processed successfully.'}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Access code validation status */}
        {!isCodeValid ? (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertTitle>Invalid Access Code</AlertTitle>
            <AlertDescription>
              The access code could not be validated. Please make sure you have a valid code.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Access Code Info */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Access Code</CardTitle>
                <CardDescription>
                  Your personal code for the JET AI platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user && (
                  <AccessCodeQRGenerator 
                    accessCode={accessCode}
                    userName={user.username || 'Traveler'}
                    email={user.email || 'user@example.com'}
                  />
                )}
                
                <div className="mt-6 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGenerateNewCode}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate New Code
                  </Button>
                  
                  <Button 
                    className="w-full bg-[#4a89dc] hover:bg-[#3a79cc]" 
                    onClick={handleCreateReferral}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Referral Link
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>
                  Your progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Access Level</span>
                    <span className="font-medium">Premium Traveler</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Unlocked Features</span>
                    <span className="font-medium">{unlockedLevels.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Referrals</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">JetPoints</span>
                    <span className="font-medium">750</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="levels">
              <TabsList className="mb-6">
                <TabsTrigger value="levels" className="flex gap-2">
                  <LockOpen className="h-4 w-4" />
                  Unlockable Levels
                </TabsTrigger>
                <TabsTrigger value="referrals" className="flex gap-2">
                  <Users className="h-4 w-4" />
                  Referral System
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="levels">
                <UnlockableLevels 
                  userAccessCode={accessCode}
                  unlockedLevels={unlockedLevels}
                />
              </TabsContent>
              
              <TabsContent value="referrals">
                <Card>
                  <CardHeader>
                    <CardTitle>Referral Program</CardTitle>
                    <CardDescription>
                      Invite friends and earn rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-[#4a89dc]/10 rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-2">How it works</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Share your personal referral link with friends</li>
                          <li>When they sign up using your link, they'll get a free upgrade to Level 4</li>
                          <li>You'll earn 300 JetPoints for each successful referral</li>
                          <li>Accumulate points to redeem for travel discounts and premium features</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-3">Your Referral Link</h3>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-100 rounded-l-md p-3 font-mono text-sm truncate">
                            {`${window.location.origin}/auth?referral=${accessCode}`}
                          </div>
                          <Button
                            onClick={handleCreateReferral}
                            className="rounded-l-none bg-[#4a89dc] hover:bg-[#3a79cc]"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-3">Your Referral Stats</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <Card className="p-4">
                            <h4 className="text-2xl font-bold text-[#4a89dc]">3</h4>
                            <p className="text-sm text-gray-600">Total Referrals</p>
                          </Card>
                          <Card className="p-4">
                            <h4 className="text-2xl font-bold text-[#4a89dc]">900</h4>
                            <p className="text-sm text-gray-600">Points Earned</p>
                          </Card>
                          <Card className="p-4">
                            <h4 className="text-2xl font-bold text-[#4a89dc]">2</h4>
                            <p className="text-sm text-gray-600">Active Users</p>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}