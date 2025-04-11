import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card } from "@/components/ui/card";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Check, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

// Initialize Stripe outside of the component to avoid re-initialization
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Helper to parse URL parameters
const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    payment: searchParams.get('payment'),
    session: searchParams.get('session'),
    status: searchParams.get('status'),
  };
};

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const [checkoutStatus, setCheckoutStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
  const [paymentType, setPaymentType] = useState<'one-time' | 'subscription'>('one-time');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const params = getQueryParams();
    
    // If we have a status query param, it's likely a redirect from Stripe
    if (params.status === 'success') {
      setCheckoutStatus('success');
      toast({
        title: "Payment successful!",
        description: "Thank you for your purchase.",
        variant: "default",
      });
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        setLocation('/dashboard');
      }, 3000);
      return;
    }
    
    if (params.status === 'cancel') {
      setCheckoutStatus('error');
      toast({
        title: "Payment canceled",
        description: "Your payment was canceled. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Handle direct client secret (one-time payment)
    if (params.payment) {
      setPaymentType('one-time');
      setClientSecret(params.payment);
      setCheckoutStatus('ready');
      return;
    }
    
    // Handle Stripe session (subscription)
    if (params.session) {
      setPaymentType('subscription');
      // In a real app, we might fetch details about the session
      setCheckoutStatus('ready');
      // For now, just use the session ID as the client secret
      setClientSecret(params.session);
      return;
    }
    
    // If no payment or session parameter, redirect to pricing page
    if (!params.payment && !params.session) {
      toast({
        title: "No payment information",
        description: "Please select a plan or credit pack to purchase.",
        variant: "destructive",
      });
      setLocation('/pricing');
    }
  }, [location, setLocation, toast]);
  
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase to access premium JetAI features</p>
      </div>
      
      {checkoutStatus === 'loading' && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Preparing your checkout...</p>
          </div>
        </div>
      )}
      
      {checkoutStatus === 'ready' && clientSecret && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Enter your payment details to complete your purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    paymentType={paymentType} 
                    onSuccess={() => setCheckoutStatus('success')}
                    onError={() => setCheckoutStatus('error')}
                  />
                </Elements>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentType === 'one-time' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>50 AI Credits</span>
                      <span>$19.99</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>$19.99</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Premium Monthly</span>
                      <span>$19.99</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Renews automatically. Cancel anytime.
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>$19.99/mo</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  <span>Secure checkout with Stripe</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      
      {checkoutStatus === 'success' && (
        <Card>
          <CardContent className="pt-6 pb-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-center mb-4">
              Thank you for your purchase. Your account has been updated with your new benefits.
            </p>
            <Button onClick={() => setLocation('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
      
      {checkoutStatus === 'error' && (
        <Card>
          <CardContent className="pt-6 pb-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-center mb-4">
              There was an issue processing your payment. Please try again or contact support.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setLocation('/pricing')}>
                Return to Pricing
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// CheckoutForm component to handle the Stripe Payment Element
function CheckoutForm({ 
  paymentType,
  onSuccess,
  onError
}: {
  paymentType: 'one-time' | 'subscription',
  onSuccess: () => void,
  onError: () => void
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      let result;
      
      if (paymentType === 'one-time') {
        // For one-time payments, use confirmPayment
        result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout?status=success`,
          },
          redirect: 'if_required',
        });
      } else {
        // For subscriptions, in a real app, use the appropriate method
        // For demo purposes, we'll just simulate success
        result = { error: undefined };
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
      
      if (result.error) {
        setErrorMessage(result.error.message);
        onError();
        toast({
          title: "Payment failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        onSuccess();
        toast({
          title: "Payment successful",
          description: "Thank you for your purchase!",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      onError();
      toast({
        title: "Payment processing error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      
      <Button 
        disabled={!stripe || isProcessing} 
        className="w-full"
        type="submit"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>
      
      <div className="text-center text-xs text-muted-foreground">
        By completing this purchase, you agree to our{" "}
        <a href="/terms" className="underline">Terms of Service</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </div>
    </form>
  );
}