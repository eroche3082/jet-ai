import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Check, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function PaymentSuccessPage() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [membershipDetails, setMembershipDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const redirectStatus = urlParams.get('redirect_status');

    // Check if this is a redirect from a successful payment
    if (redirectStatus !== 'succeeded') {
      toast({
        title: "Invalid Payment Status",
        description: "Unable to verify payment status. Please contact support if your account is not updated.",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation('/dashboard');
      }, 3000);
      return;
    }

    // Fetch the latest membership status to confirm the payment was applied
    const fetchMembershipStatus = async () => {
      try {
        setIsLoading(true);
        // This endpoint should return updated membership details after payment
        const response = await apiRequest("GET", "/api/user/membership");
        
        if (response.ok) {
          const data = await response.json();
          setMembershipDetails(data);
          toast({
            title: "Premium Membership Activated",
            description: "Your account has been upgraded to premium status. Enjoy all premium features!",
          });
        } else {
          throw new Error("Could not verify membership status");
        }
      } catch (error: any) {
        console.error("Error verifying membership:", error);
        toast({
          title: "Verification Issue",
          description: "Your payment was successful, but we couldn't verify your membership status. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipStatus();
  }, [location, setLocation, toast]);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <Card className="p-8 md:p-12 bg-white rounded-2xl shadow-lg text-center">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for upgrading to JET AI Premium. Your account has been updated with premium benefits.
        </p>
        
        {!isLoading && membershipDetails && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Membership Level</p>
                <p className="font-medium text-gray-900">{membershipDetails.membershipTier || 'Premium'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
              {membershipDetails.subscriptionEndDate && (
                <div>
                  <p className="text-sm text-gray-500">Renewal Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(membershipDetails.subscriptionEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {membershipDetails.aiCreditsRemaining !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">AI Credits</p>
                  <p className="font-medium text-gray-900">
                    {membershipDetails.aiCreditsRemaining === -1 
                      ? 'Unlimited' 
                      : membershipDetails.aiCreditsRemaining}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/dashboard')}
            variant="default" 
            className="flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => setLocation('/travel/planner')}
            variant="outline" 
            className="flex items-center"
          >
            Plan Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}