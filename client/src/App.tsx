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
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import { useState, useEffect } from 'react';
import ChatBubble from "@/components/ChatBubble";
import AIChat from "@/components/AIChat";
import { ThemeProvider } from "@/components/ThemeProvider";
import { generateSessionId } from "@/lib/utils";

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
    const newSessionId = existingSessionId || generateSessionId();
    
    if (!existingSessionId) {
      localStorage.setItem('jetai_session_id', newSessionId);
    }
    
    setSessionId(newSessionId);
    
    // Track page visit
    const referrer = document.referrer;
    console.log(`Session ${newSessionId} started. Referrer: ${referrer || 'direct'}`);
    
    // Close chat on route change
    const handleRouteChange = () => {
      if (isChatOpen) setIsChatOpen(false);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [isChatOpen]);

  return (
    <ThemeProvider>
      <Layout>
        <Switch>
          {/* Main application routes */}
          <Route path="/" component={Home} />
          <Route path="/destinations" component={Destinations} />
          <Route path="/itineraries" component={Itineraries} />
          <Route path="/itineraries/:id">
            {(params) => <ItineraryView params={params} />}
          </Route>
          <Route path="/membership" component={Membership} />
          <Route path="/about" component={About} />
          <Route path="/signin" component={SignIn} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/checkout" component={Checkout} />
          
          {/* Partner/Affiliate dashboard routes - To be implemented */}
          <Route path="/partner">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Partner Dashboard</h2>
              <p className="text-gray-600">Coming soon</p>
            </div>
          </Route>
          
          {/* Fallback route */}
          <Route component={NotFound} />
        </Switch>
      </Layout>

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
