import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Destinations from "@/pages/Destinations";
import Itineraries from "@/pages/Itineraries";
import ItineraryView from "@/pages/ItineraryView";
import About from "@/pages/About";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import Membership from "@/pages/Membership";
import PricingPlans from "@/pages/PricingPlans";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import { useState, useEffect } from 'react';
import ChatBubble from "@/components/ChatBubble";
import AIChat from "@/components/AIChat";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getAffiliateId } from "@/lib/utils";
import PartnerDashboard from "@/pages/partner/Dashboard";
import PartnerSignup from "@/pages/partner/Signup";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Initialize session tracking
  useEffect(() => {
    // Create or retrieve session ID for tracking
    const existingSessionId = localStorage.getItem('jetai_session_id');
    const newSessionId = existingSessionId || crypto.randomUUID();
    
    if (!existingSessionId) {
      localStorage.setItem('jetai_session_id', newSessionId);
    }
    
    setSessionId(newSessionId);
    
    // Track page visit and affiliate
    const referrer = document.referrer;
    const affiliateId = getAffiliateId();
    
    console.log(`Session ${newSessionId} started. Referrer: ${referrer || 'direct'}`);
    if (affiliateId) {
      console.log(`Affiliate tracking: ${affiliateId}`);
      // In a real app, we would make an API call to record this
    }
    
    // Close chat on route change
    const handleRouteChange = () => {
      if (isChatOpen) setIsChatOpen(false);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [isChatOpen]);

  return (
    <ThemeProvider>
      <Switch>
        {/* Main application routes */}
        <Route path="/" component={Home} />
        <Route path="/destinations" component={Destinations} />
        <Route path="/itineraries" component={Itineraries} />
        <Route path="/itineraries/:id">
          {(params) => <ItineraryView params={params} />}
        </Route>
        <Route path="/membership" component={Membership} />
        <Route path="/pricing" component={PricingPlans} />
        <Route path="/about" component={About} />
        <Route path="/signin" component={SignIn} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/checkout" component={Checkout} />
        
        {/* Partner/Affiliate routes */}
        <Route path="/partner/dashboard" component={PartnerDashboard} />
        <Route path="/partner/signup" component={PartnerSignup} />
        <Route path="/partner/settings">
          {() => <PartnerDashboard />}
        </Route>
        
        {/* Partner route redirect */}
        <Route path="/partner">
          {() => {
            // Check if user is logged in and is a partner
            const isPartner = localStorage.getItem('partnerCode');
            
            if (isPartner) {
              window.location.href = '/partner/dashboard';
              return null;
            } else {
              window.location.href = '/partner/signup';
              return null;
            }
          }}
        </Route>
        
        {/* Fallback route */}
        <Route component={NotFound} />
      </Switch>

      {/* Floating chat bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <AIChat 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)}
          />
        ) : (
          <ChatBubble onClick={toggleChat} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
