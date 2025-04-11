import { useState, useEffect } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Interface for subscription plans
interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

// Plans data
const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Personalized travel recommendations',
      'Limited destination guides',
      'Basic itinerary planning',
      'Email support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    features: [
      'All Basic features',
      'Unlimited destination guides',
      'Advanced AI itinerary planning',
      'Priority customer support',
      'Exclusive deals and discounts',
      'Ad-free experience'
    ],
    popular: true
  },
  {
    id: 'family',
    name: 'Family',
    price: 29.99,
    interval: 'month',
    features: [
      'All Premium features',
      'Up to 5 family members',
      'Group itinerary planning',
      'Family discounts',
      'Dedicated travel concierge',
      '24/7 premium support'
    ]
  }
];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [_, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard',
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your subscription!",
      });
      setLocation('/dashboard');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-display text-lg font-bold text-dark mb-4">Payment Details</h3>
        <PaymentElement />
      </div>
      
      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-dark/70">
          I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
        </label>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full bg-primary hover:bg-primary/90 text-white font-accent font-semibold px-6 py-3 rounded-full transition ${
          (!stripe || isProcessing) ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
          </span>
        ) : (
          'Complete Payment'
        )}
      </button>
      
      <p className="text-center text-sm text-dark/50">
        Your subscription will renew automatically. You can cancel anytime.
      </p>
    </form>
  );
};

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');
  const { toast } = useToast();
  
  // Get user data to check if already subscribed
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    retry: 1,
  });
  
  useEffect(() => {
    // Set default selected plan to Premium
    setSelectedPlan(plans.find(plan => plan.id === 'premium') || plans[0]);
  }, []);
  
  // Toggle billing cycle between monthly and yearly
  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === 'month' ? 'year' : 'month');
  };
  
  // Calculate price based on billing cycle (20% discount for yearly)
  const calculatePrice = (basePrice: number) => {
    if (billingCycle === 'year') {
      return (basePrice * 12 * 0.8).toFixed(2); // 20% discount for yearly billing
    }
    return basePrice.toFixed(2);
  };

  // Create subscription
  const createSubscription = async () => {
    if (!selectedPlan) return;
    
    try {
      const response = await apiRequest("POST", "/api/get-or-create-subscription", {
        planId: selectedPlan.id,
        interval: billingCycle
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    if (selectedPlan) {
      createSubscription();
    }
  }, [selectedPlan, billingCycle]);

  if (userLoading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-dark/70">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-[calc(100vh-160px)] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-dark text-center mb-3">Upgrade Your Travel Experience</h1>
          <p className="text-center text-lg text-dark/70 mb-10 max-w-2xl mx-auto">
            Choose the plan that's right for you and unlock premium features for a better travel planning experience.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center items-center mb-10">
            <span className={`text-sm font-medium ${billingCycle === 'month' ? 'text-primary' : 'text-dark/50'}`}>Monthly</span>
            <button 
              onClick={toggleBillingCycle}
              className="relative inline-flex h-6 w-11 mx-3 items-center rounded-full bg-gray-200"
              aria-pressed={billingCycle === 'year'}
              aria-labelledby="billing-cycle-label"
            >
              <span className="sr-only">Toggle billing cycle</span>
              <span
                className={`${
                  billingCycle === 'year' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'year' ? 'text-primary' : 'text-dark/50'}`}>
              Yearly <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full ml-1">Save 20%</span>
            </span>
          </div>
          
          {/* Plans Grid */}
          {!clientSecret && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                    selectedPlan?.id === plan.id ? 'border-primary shadow-md scale-[1.02]' : 'border-gray-200'
                  } ${plan.popular ? 'relative' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 uppercase">
                      Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-dark mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${calculatePrice(plan.price)}</span>
                      <span className="text-dark/50">/{billingCycle}</span>
                    </div>
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full py-2 px-4 rounded-full font-accent font-medium transition mb-6 ${
                        selectedPlan?.id === plan.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-dark hover:bg-primary/10'
                      }`}
                    >
                      {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                    </button>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                          <span className="text-sm text-dark/70">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Payment Form */}
          {clientSecret ? (
            <div className="max-w-md mx-auto">
              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-display font-bold text-dark">Order Summary</h3>
                  <button 
                    onClick={() => setClientSecret('')}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Change Plan
                  </button>
                </div>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-dark/70">{selectedPlan?.name} Plan ({billingCycle}ly)</span>
                    <span className="font-medium">${calculatePrice(selectedPlan?.price || 0)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${calculatePrice(selectedPlan?.price || 0)}</span>
                </div>
              </div>
              
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={createSubscription}
                className="bg-primary hover:bg-primary/90 text-white font-accent font-semibold px-8 py-3 rounded-full transition"
              >
                Continue to Payment
              </button>
            </div>
          )}
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-dark text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-accent font-semibold text-dark mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-dark/70">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-accent font-semibold text-dark mb-2">What payment methods do you accept?</h3>
                <p className="text-dark/70">We accept all major credit cards including Visa, Mastercard, American Express, and Discover.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-accent font-semibold text-dark mb-2">How do I change my plan?</h3>
                <p className="text-dark/70">You can upgrade or downgrade your plan at any time from your account settings. Changes will be applied to your next billing cycle.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-accent font-semibold text-dark mb-2">Is there a free trial available?</h3>
                <p className="text-dark/70">We offer a 7-day free trial for new users on any plan. You won't be charged until your trial period ends.</p>
              </div>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="mt-12 text-center">
            <p className="text-dark/70 mb-2">Have questions? Our customer support team is here to help.</p>
            <Link href="/about" className="text-primary hover:text-primary/80 font-medium">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
