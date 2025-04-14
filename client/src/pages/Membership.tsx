import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle, Infinity, ChevronRight, CreditCard, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MembershipData {
  id: number;
  membershipTier: 'basic' | 'freemium' | 'premium';
  isSubscribed: boolean;
  subscriptionPlan?: string;
  subscriptionEndDate?: Date;
  aiCreditsRemaining: number;
  monthlySearches: number;
  maxMonthlySearches: number;
}

interface PlanFeature {
  name: string;
  basic: string | boolean;
  freemium: string | boolean;
  premium: string | boolean;
}

// Pricing and feature comparison data
const membershipPlans = [
  {
    tier: 'basic',
    name: 'Basic',
    price: 'Free',
    description: 'Get started with essential travel planning tools',
    color: 'bg-gray-200',
    textColor: 'text-gray-700',
    buttonText: 'Current Plan',
    disabled: true
  },
  {
    tier: 'freemium',
    name: 'Freemium',
    price: 'Free',
    description: 'Enhanced features for casual travelers',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    buttonText: 'Upgrade',
    disabled: false
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: '$9.99/month',
    description: 'Unlimited access to all premium features',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
    buttonText: 'Upgrade',
    disabled: false
  }
];

const planFeatures: PlanFeature[] = [
  { name: 'AI Chat Responses', basic: '5 per month', freemium: '20 per month', premium: 'Unlimited' },
  { name: 'Travel Searches', basic: '10 per month', freemium: '30 per month', premium: 'Unlimited' },
  { name: 'Itinerary Creation', basic: true, freemium: true, premium: true },
  { name: 'Public Itineraries', basic: false, freemium: true, premium: true },
  { name: 'Custom Trip Planning', basic: false, freemium: false, premium: true },
  { name: 'Priority Support', basic: false, freemium: false, premium: true },
];

export default function Membership() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [purchaseCredits, setPurchaseCredits] = useState(10);

  // Fetch membership data
  const { data: membership, isLoading } = useQuery({
    queryKey: ['/api/user/membership'],
    retry: false,
  });

  // Mutations for upgrading membership
  const upgradeToFreemium = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/user/membership/freemium');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/membership'] });
      toast({
        title: 'Success!',
        description: 'You have been upgraded to Freemium tier',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upgrade. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const upgradeToPremium = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/user/membership/premium');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/membership'] });
      toast({
        title: 'Success!',
        description: 'You have been upgraded to Premium tier',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upgrade. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const purchaseMoreCredits = useMutation({
    mutationFn: async (credits: number) => {
      const response = await apiRequest('POST', '/api/user/membership/purchase-credits', { credits });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/membership'] });
      toast({
        title: 'Credits Purchased!',
        description: data.message || `You've successfully purchased more AI credits.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to purchase credits. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleUpgrade = (tier: string) => {
    if (tier === 'freemium') {
      upgradeToFreemium.mutate();
    } else if (tier === 'premium') {
      upgradeToPremium.mutate();
    }
  };

  const handleBuyCredits = () => {
    if (purchaseCredits > 0) {
      purchaseMoreCredits.mutate(purchaseCredits);
    }
  };

  // Helper function to get badge component based on tier
  const getMembershipBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300">Premium</Badge>;
      case 'freemium':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300">Freemium</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300">Basic</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 max-w-5xl">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </Layout>
    );
  }

  const membershipData = membership as MembershipData || {
    membershipTier: 'basic',
    aiCreditsRemaining: 0,
    monthlySearches: 0,
    maxMonthlySearches: 10,
    isSubscribed: false
  };
  
  const isBasic = membershipData.membershipTier === 'basic';
  const isFreemium = membershipData.membershipTier === 'freemium';
  const isPremium = membershipData.membershipTier === 'premium';
  
  // Calculate percentages for progress bars
  const creditPercentage = isPremium ? 100 : Math.min(100, (membershipData.aiCreditsRemaining / (isFreemium ? 20 : 5)) * 100);
  const searchPercentage = isPremium ? 100 : Math.min(100, (membershipData.monthlySearches / membershipData.maxMonthlySearches) * 100);

  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">My Membership</h1>
        
        {/* Current Membership Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Current Membership</CardTitle>
              {getMembershipBadge(membershipData.membershipTier)}
            </div>
            <CardDescription>
              {isPremium ? 'You have access to all premium features' : 
               isFreemium ? 'Enhanced travel planning features' : 
               'Basic travel planning features'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">AI Credits Remaining</h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-bold">
                    {isPremium ? (
                      <div className="flex items-center">
                        <Infinity className="w-6 h-6 mr-2 text-amber-600" />
                        <span>Unlimited</span>
                      </div>
                    ) : (
                      `${membershipData.aiCreditsRemaining}`
                    )}
                  </span>
                  <span className="text-sm text-gray-500">
                    {isPremium ? '' : `of ${isFreemium ? '20' : '5'} per month`}
                  </span>
                </div>
                <Progress value={creditPercentage} className="h-2 mb-4" />

                {!isPremium && (
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <div>
                        <label htmlFor="creditAmount" className="block text-sm font-medium mb-1">
                          Purchase Additional Credits:
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            id="creditAmount"
                            min="5"
                            max="100"
                            value={purchaseCredits}
                            onChange={(e) => setPurchaseCredits(parseInt(e.target.value))}
                            className="w-20 rounded-md border border-gray-300 p-2 mr-2"
                          />
                          <Button 
                            onClick={handleBuyCredits}
                            disabled={purchaseMoreCredits.isPending}
                            size="sm"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Monthly Searches Used</h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-bold">
                    {isPremium ? (
                      <div className="flex items-center">
                        <Infinity className="w-6 h-6 mr-2 text-amber-600" />
                        <span>Unlimited</span>
                      </div>
                    ) : (
                      `${membershipData.monthlySearches}`
                    )}
                  </span>
                  <span className="text-sm text-gray-500">
                    {isPremium ? '' : `of ${membershipData.maxMonthlySearches} per month`}
                  </span>
                </div>
                <Progress value={searchPercentage} className="h-2" />
              </div>
            </div>

            {membershipData.subscriptionEndDate && (
              <div className="mt-6 p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
                <p className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Premium benefits will renew on {new Date(membershipData.subscriptionEndDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Membership Tiers */}
        <h2 className="text-2xl font-bold mb-4">Membership Options</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {membershipPlans.map((plan) => (
            <Card key={plan.tier} className={`relative ${membershipData.membershipTier === plan.tier ? 'ring-2 ring-primary' : ''}`}>
              {membershipData.membershipTier === plan.tier && (
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                  Current Plan
                </div>
              )}
              <CardHeader className={`${plan.color} ${plan.textColor}`}>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-2xl font-bold">{plan.price}</div>
                <CardDescription className={plan.textColor}>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature[plan.tier as keyof PlanFeature] === true ? (
                        <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                      ) : feature[plan.tier as keyof PlanFeature] === false ? (
                        <span className="w-5 h-5 mr-2 flex-shrink-0">—</span>
                      ) : (
                        <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                      )}
                      <span>
                        {feature.name}
                        {typeof feature[plan.tier as keyof PlanFeature] === 'string' && 
                          `: ${feature[plan.tier as keyof PlanFeature]}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {plan.tier === 'premium' ? (
                  <>
                    <Button 
                      className="w-full"
                      disabled={membershipData.membershipTier === plan.tier || 
                        upgradeToFreemium.isPending || upgradeToPremium.isPending}
                      onClick={() => handleUpgrade(plan.tier)}
                      variant={membershipData.membershipTier === plan.tier ? "outline" : "default"}
                    >
                      {membershipData.membershipTier === plan.tier ? 'Current Plan' : 'Upgrade (Free Trial)'}
                    </Button>
                    
                    {membershipData.membershipTier !== 'premium' && (
                      <Link href="/checkout-page">
                        <Button variant="secondary" className="w-full flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay for Annual Plan ($99.99)
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <Button 
                    className="w-full"
                    disabled={plan.disabled || membershipData.membershipTier === plan.tier || 
                      (plan.tier === 'freemium' && membershipData.membershipTier === 'premium') ||
                      upgradeToFreemium.isPending || upgradeToPremium.isPending}
                    onClick={() => handleUpgrade(plan.tier)}
                    variant={membershipData.membershipTier === plan.tier ? "outline" : "default"}
                  >
                    {membershipData.membershipTier === plan.tier ? 'Current Plan' : 
                     (plan.tier === 'freemium' && membershipData.membershipTier === 'premium') ? 'Premium Plan Active' :
                     plan.buttonText}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Additional information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Premium Benefits</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" />
              <span>Unlimited AI-powered travel recommendations</span>
            </li>
            <li className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" />
              <span>Exclusive access to premium destinations</span>
            </li>
            <li className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" />
              <span>Priority customer support</span>
            </li>
            <li className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" />
              <span>Early access to new features</span>
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium mb-2 text-amber-800">Annual Premium Plan Benefits</h4>
            <p className="text-amber-700 text-sm mb-2">
              Pay once and enjoy premium benefits for a full year at a 16% discount compared to monthly billing.
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>✓ Save $19.90 compared to monthly payments</li>
              <li>✓ All premium features included</li>
              <li>✓ Priority support for the entire year</li>
              <li>✓ Price locked for 12 months</li>
            </ul>
            <div className="mt-3">
              <Link href="/checkout-page">
                <Button variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Get Annual Plan - $99.99
                </Button>
              </Link>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Need help with your membership?</h4>
              <p className="text-sm text-gray-500">Contact our support team</p>
            </div>
            <Button variant="outline">
              Contact Support
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Link to manage itineraries */}
        <div className="mt-8">
          <Link href="/itineraries">
            <Button variant="outline" className="w-full">
              Manage Your Travel Itineraries
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}