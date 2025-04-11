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

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Close chat on route change
  useEffect(() => {
    if (isChatOpen) setIsChatOpen(false);
  }, [window.location.pathname]);

  return (
    <>
      <Layout>
        <Switch>
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
          <Route component={NotFound} />
        </Switch>
      </Layout>

      {/* Floating chat bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        ) : (
          <ChatBubble onClick={toggleChat} />
        )}
      </div>
    </>
  );
}

export default App;
