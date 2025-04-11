import React, { useState } from 'react';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { formatCurrency } from "@/lib/utils";
import { Check, CreditCard, Zap, Infinity, Star, User, Users } from "lucide-react";

// Plans data
const MEMBERSHIP_PLANS = {
  basic: {
    id: 'plan_basic',
    name: 'Basic',
    description: 'Start your journey with essential travel planning',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      'Up to 5 AI chats per month',
      'Basic itinerary creation',
      '10 destination searches per month',
      'Email support'
    ],
    limitations: [
      'No custom itineraries',
      'No premium destination content',
      'No one-click booking'
    ],
    cta: 'Start Free',
    color: 'bg-blue-50',
    icon: User
  },
  freemium: {
    id: 'plan_freemium',
    name: 'Freemium',
    description: 'Perfect for casual travelers with expanded capabilities',
    price: {
      monthly: 9.99,
      yearly: 99.99
    },
    features: [
      'Up to 20 AI chats per month',
      'Custom itinerary creation',
      '30 destination searches per month',
      'Export itineraries as PDF',
      'Priority email support'
    ],
    limitations: [
      'Limited premium content',
      'Standard booking options'
    ],
    cta: 'Upgrade Now',
    color: 'bg-purple-50',
    icon: Star
  },
  premium: {
    id: 'plan_premium',
    name: 'Premium',
    description: 'For serious travelers who demand the best experience',
    price: {
      monthly: 19.99,
      yearly: 199.99
    },
    features: [
      'Unlimited AI chats',
      'Full access to premium content',
      'Unlimited destination searches',
      'Advanced itinerary customization',
      'Priority booking and discounts',
      'Phone support',
      'Offline access'
    ],
    limitations: [],
    cta: 'Go Premium',
    color: 'bg-amber-50',
    icon: Infinity
  }
};

// Credit packs data
const CREDIT_PACKS = [
  {
    id: 'credit_10',
    name: '10 Credits',
    description: 'Basic pack for occasional use',
    price: 4.99,
    credits: 10,
    cta: 'Buy Now',
    color: 'bg-blue-50'
  },
  {
    id: 'credit_50',
    name: '50 Credits',
    description: 'Most popular for active travelers',
    price: 19.99,
    credits: 50,
    popular: true,
    cta: 'Buy Now',
    color: 'bg-amber-50'
  },
  {
    id: 'credit_100',
    name: '100 Credits',
    description: 'Best value for frequent planners',
    price: 34.99,
    credits: 100,
    cta: 'Buy Now',
    color: 'bg-green-50'
  }
];

export default function PricingPlans() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mutation for handling subscription checkout
  const checkoutMutation = useMutation({
    mutationFn: async ({ planId, billingCycle }: { planId: string, billingCycle: 'monthly' | 'yearly' }) => {
      setIsProcessing(true);
      const response = await apiRequest('POST', '/api/create-subscription', {
        planId,
        billingCycle,
        promoCode: promoCode || undefined
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Redirect to checkout page with session ID
      window.location.href = `/checkout?session=${data.sessionId}`;
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: 'Checkout Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Mutation for handling credit pack purchase
  const buyPackMutation = useMutation({
    mutationFn: async (packId: string) => {
      setIsProcessing(true);
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        packId,
        promoCode: promoCode || undefined
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process payment');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Redirect to checkout page with client secret
      window.location.href = `/checkout?payment=${data.clientSecret}`;
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: 'Payment Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Handler for subscription checkout
  const handleSubscribe = (planId: string) => {
    checkoutMutation.mutate({ planId, billingCycle });
  };
  
  // Handler for credit pack purchase
  const handleBuyPack = (packId: string) => {
    buyPackMutation.mutate(packId);
  };
  
  // Calculate savings percentage
  const calculateSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const monthlyCost = monthly * 12;
    const savings = ((monthlyCost - yearly) / monthlyCost) * 100;
    return Math.round(savings);
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Choose the perfect plan for your travel needs, with flexible options for every journey
        </p>
        
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="credit-packs">Credit Packs</TabsTrigger>
          </TabsList>
          
          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="mt-8">
            <div className="flex justify-center items-center mb-8 gap-2">
              <span className={billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>Monthly</span>
              <Switch 
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <span className={billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
                Yearly
                <span className="ml-1 text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded-full">
                  Save up to 20%
                </span>
              </span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(MEMBERSHIP_PLANS).map(([key, plan]) => {
                const Icon = plan.icon;
                const isPopular = key === 'premium';
                const savingsPercentage = calculateSavings(plan.price.monthly, plan.price.yearly);
                
                return (
                  <Card 
                    key={key}
                    className={`relative ${
                      isPopular ? 'border-primary shadow-lg' : ''
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                        <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className={`${plan.color} rounded-t-lg`}>
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                      <div className="mb-6">
                        <span className="text-3xl font-bold">
                          {formatCurrency(plan.price[billingCycle])}
                        </span>
                        {plan.price[billingCycle] > 0 && (
                          <span className="text-muted-foreground">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        )}
                        
                        {billingCycle === 'yearly' && savingsPercentage > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            Save {savingsPercentage}% with annual billing
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-center">
                              <Check className="text-green-500 h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {plan.limitations.length > 0 && (
                          <div className="space-y-2 pt-2 border-t">
                            {plan.limitations.map((limitation, i) => (
                              <div key={i} className="flex items-center text-muted-foreground">
                                <div className="h-4 w-4 mr-2 flex-shrink-0">×</div>
                                <span className="text-sm">{limitation}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full"
                        variant={isPopular ? 'default' : 'outline'}
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isProcessing || plan.price[billingCycle] === 0}
                      >
                        {plan.price[billingCycle] === 0 ? (
                          <Link href="/signin">Sign Up Free</Link>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {plan.cta}
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Credit Packs Tab */}
          <TabsContent value="credit-packs" className="mt-8">
            <div className="mb-8 text-center max-w-lg mx-auto">
              <h3 className="text-lg font-medium mb-2">Pay Only For What You Need</h3>
              <p className="text-muted-foreground text-sm">
                Credit packs are perfect if you don't need a subscription. 
                Each credit lets you make one AI request for trip planning.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {CREDIT_PACKS.map((pack) => (
                <Card 
                  key={pack.id}
                  className={`relative ${
                    pack.popular ? 'border-primary shadow-lg' : ''
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                      <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Best Value
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className={`${pack.color} rounded-t-lg`}>
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{pack.name}</CardTitle>
                    <CardDescription>{pack.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <span className="text-3xl font-bold">
                        {formatCurrency(pack.price)}
                      </span>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(pack.price / pack.credits, 'USD', 'en-US', 2)} per credit
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Check className="text-green-500 h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{pack.credits} AI chat credits</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-green-500 h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">No expiration date</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-green-500 h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Full itinerary creation</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-green-500 h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Save itineraries</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
                      variant={pack.popular ? 'default' : 'outline'}
                      onClick={() => handleBuyPack(pack.id)}
                      disabled={isProcessing}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {pack.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Promo code input */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="flex space-x-2">
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="promoCode">Promo Code</Label>
              <Input
                id="promoCode"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="mb-1.5"
                onClick={() => {
                  toast({
                    title: promoCode ? "Promo code applied" : "No promo code entered",
                    description: promoCode ? `Code "${promoCode}" has been applied to your purchase` : "Please enter a promo code first",
                    variant: promoCode ? "default" : "destructive"
                  });
                }}
                disabled={!promoCode}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mt-16 text-left max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">What's the difference between plans?</h3>
              <p className="text-muted-foreground">
                Basic is free but has limited features. Freemium offers more AI interactions and better itineraries. 
                Premium gives you unlimited access to all features with priority support.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade, downgrade or cancel your subscription at any time. Changes will take effect at the end of your billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Do credit packs expire?</h3>
              <p className="text-muted-foreground">
                No, your purchased credits never expire. Use them at your own pace whenever you need to plan a trip.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Is there a refund policy?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee for subscription plans. Credit packs are non-refundable once purchased.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}