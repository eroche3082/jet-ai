import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/Home";
import Destinations from "@/pages/Destinations";
import DestinationDetail from "@/pages/DestinationDetail";
import Itineraries from "@/pages/Itineraries";
import ItineraryView from "@/pages/ItineraryView";
import About from "@/pages/About";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import Membership from "@/pages/Membership";
import PricingPlans from "@/pages/PricingPlans";
import NotFound from "@/pages/not-found";
import VertexAIPage from "@/pages/VertexAIPage";
import Layout from "@/components/Layout";
import MobileLayout from "@/components/MobileLayout";
import { useState, useEffect } from 'react';
import ChatBubble from "@/components/ChatBubble";
import AIChat from "@/components/AIChat";
import TravelCockpit from "@/components/TravelCockpit";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getAffiliateId } from "@/lib/utils";
import PartnerDashboard from "@/pages/partner/Dashboard";
import PartnerSignup from "@/pages/partner/Signup";
import { initializePWA } from '@/lib/pwa';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [location] = useLocation();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Detect mobile devices and PWA mode
  useEffect(() => {
    // Mobile detection using user agent and screen size
    const checkMobile = () => {
      const userAgent = 
        typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobileRegex = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    // PWA detection
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFromHomeScreen = window.navigator.standalone; // iOS Safari
      const urlParams = new URLSearchParams(window.location.search);
      const forcePWA = urlParams.get('pwa') === 'true';
      
      setIsPWA(isStandalone || !!isFromHomeScreen || forcePWA);
    };
    
    // Initialize PWA features
    initializePWA();
    
    // Run checks
    checkMobile();
    checkPWA();
    
    // Listen for resize events to update mobile status
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Render application routes
  const renderRoutes = () => (
    <Switch>
      {/* Main application routes */}
      <Route path="/" component={Home} />
      <Route path="/destinations" component={Destinations} />
      <Route path="/destinations/:id/:slug" component={DestinationDetail} />
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
      
      {/* AI Assistant routes */}
      <Route path="/vertex-ai" component={VertexAIPage} />
      
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
  );

  return (
    <ThemeProvider>
      {isMobile ? (
        <MobileLayout
          isChatOpen={isChatOpen}
          onChatToggle={setIsChatOpen}
        >
          {renderRoutes()}
        </MobileLayout>
      ) : (
        <Layout>
          {renderRoutes()}
          {/* Floating chat bubble (desktop only) */}
          <div className="fixed bottom-6 right-6 z-50">
            {isChatOpen ? (
              <TravelCockpit 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)}
              />
            ) : (
              <ChatBubble onClick={toggleChat} />
            )}
          </div>
        </Layout>
      )}
    </ThemeProvider>
  );
}

export default App;
