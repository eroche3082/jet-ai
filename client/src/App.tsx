import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Destinations from "@/pages/Destinations";
import Itineraries from "@/pages/Itineraries";
import About from "@/pages/About";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/destinations" component={Destinations} />
        <Route path="/itineraries" component={Itineraries} />
        <Route path="/about" component={About} />
        <Route path="/signin" component={SignIn} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/checkout" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
