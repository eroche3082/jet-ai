import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plane, Globe, Languages, HeartHandshake, Wallet, FileCheck,
  BrainCircuit, PackageCheck, Cloud, Mountain, Stethoscope, 
  Bus, User, ShieldCheck, Leaf, Hotel, CalendarCheck, Clock,
  BadgeDollarSign, PanelTopOpen
} from 'lucide-react';

const features = [
  {
    title: "Generative Smart Itinerary",
    description: "Personalized itineraries based on preferences, time, and budget.",
    icon: <Plane className="h-8 w-8 text-primary" />
  },
  {
    title: "Real-Time Flight Comparator",
    description: "Find flights with the best value for your money.",
    icon: <Globe className="h-8 w-8 text-primary" />
  },
  {
    title: "Integrated Multilingual Translator",
    description: "Translate conversations and phrases across 30+ languages.",
    icon: <Languages className="h-8 w-8 text-primary" />
  },
  {
    title: "Predictive Cultural Advisor",
    description: "Information about customs and etiquette at your destination.",
    icon: <HeartHandshake className="h-8 w-8 text-primary" />
  },
  {
    title: "Automatic Budget Manager",
    description: "Monitor and suggest adjustments to your travel budget.",
    icon: <Wallet className="h-8 w-8 text-primary" />
  },
  {
    title: "Travel Document Scanner",
    description: "Verify passports, visas, and travel documents.",
    icon: <FileCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "Cross-Session Memory",
    description: "Remember previous conversations and preferences for consistent recommendations.",
    icon: <BrainCircuit className="h-8 w-8 text-primary" />
  },
  {
    title: "Personalized Packing List Generator",
    description: "Luggage lists tailored to your destination and activities.",
    icon: <PackageCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "Predictive Weather Alerts",
    description: "Anticipate and notify about adverse weather conditions.",
    icon: <Cloud className="h-8 w-8 text-primary" />
  },
  {
    title: "Visual Attraction Identifier",
    description: "Upload images to receive detailed information about landmarks.",
    icon: <Mountain className="h-8 w-8 text-primary" />
  },
  {
    title: "Medical Emergency Assistant",
    description: "Medical translations and location of nearby hospitals.",
    icon: <Stethoscope className="h-8 w-8 text-primary" />
  },
  {
    title: "Transport Connection Optimizer",
    description: "Optimal transportation combinations for efficiency and savings.",
    icon: <Bus className="h-8 w-8 text-primary" />
  },
  {
    title: "Interest-Based Experience Filter",
    description: "Activities and experiences that match your interests.",
    icon: <User className="h-8 w-8 text-primary" />
  },
  {
    title: "Area Safety Verifier",
    description: "Safety assessment of different areas at your destination.",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "CO2 Compensation Calculator",
    description: "Estimate and offset the carbon footprint of your trip.",
    icon: <Leaf className="h-8 w-8 text-primary" />
  },
  {
    title: "Accommodation Options Comparator",
    description: "Analyze hotels, Airbnb, and more based on your preferences.",
    icon: <Hotel className="h-8 w-8 text-primary" />
  },
  {
    title: "Booking Assistant with Confirmation",
    description: "Make reservations directly with automatic confirmation.",
    icon: <CalendarCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "Layover Itinerary Generator",
    description: "Mini-itineraries to make the most of long airport layovers.",
    icon: <Clock className="h-8 w-8 text-primary" />
  },
  {
    title: "Flash Deals Detector",
    description: "Alerts about temporary deals that match your preferences.",
    icon: <BadgeDollarSign className="h-8 w-8 text-primary" />
  },
  {
    title: "Multi-Criteria Destination Evaluator",
    description: "Compare destinations based on budget, weather, attractions, and safety.",
    icon: <PanelTopOpen className="h-8 w-8 text-primary" />
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2029&auto=format&fit=crop')" }}
        ></div>
        
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Journey with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            JetAI combines cutting-edge artificial intelligence with expert travel insights to create
            personalized travel experiences tailored just for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Smart Features for Smart Travelers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border hover:shadow-md transition duration-300 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* About / Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-8">
            JetAI is designed to revolutionize how you plan, experience, and remember your travels. 
            We leverage the latest in artificial intelligence to eliminate the stress of travel planning,
            provide real-time assistance during your journey, and help you create lasting memories.
            Our platform combines predictive analytics, personalization, and multi-language support
            to ensure every traveler, regardless of experience level, can enjoy seamless journeys.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Travel Experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of travelers who have discovered the power of AI-assisted travel planning.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white" asChild>
              <Link href="/chat">Chat with Assistant</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-primary text-2xl mr-2">
                  <i className="fas fa-paper-plane"></i>
                </span>
                <span className="font-bold text-xl">
                  Jet<span className="text-primary">AI</span>
                </span>
              </Link>
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            © 2025 JetAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}