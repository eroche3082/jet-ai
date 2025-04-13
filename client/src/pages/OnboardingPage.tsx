import { useState } from 'react';
import { useLocation } from 'wouter';
import OnboardingChat from '@/components/OnboardingChat';
import { Button } from '@/components/ui/button';
import { Plane, Globe, CircleUser, Map } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function OnboardingPage() {
  const { saveUserPreferences } = useAuth();
  const [, setLocation] = useLocation();
  const [isComplete, setIsComplete] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleOnboardingComplete = async (data: any) => {
    setIsComplete(true);
    setUserData(data);

    try {
      // In a real implementation, this would create a user account
      // and store the preferences in the database
      await saveUserPreferences(data.preferences);
      
      // Navigate to dashboard after completion
      setTimeout(() => {
        setLocation('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050b17] to-[#101a2c]">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="JET AI" className="h-16" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-4xl font-bold">Welcome to JET AI</h1>
            <p className="text-xl">Your intelligent travel companion powered by advanced AI</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#4a89dc] rounded-lg">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Personalized Travel Recommendations</h3>
                  <p className="text-gray-300">Get tailored suggestions based on your preferences and travel style</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#4a89dc] rounded-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Destination Research</h3>
                  <p className="text-gray-300">Access detailed information about any location in the world</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#4a89dc] rounded-lg">
                  <CircleUser className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Travel Assistant</h3>
                  <p className="text-gray-300">Chat with our AI to plan trips, find deals, and solve travel challenges</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#4a89dc] rounded-lg">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Interactive Itineraries</h3>
                  <p className="text-gray-300">Create and manage detailed travel plans with our smart tools</p>
                </div>
              </div>
            </div>

            {isComplete && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> Your personalized dashboard is ready.</span>
                <Button 
                  className="mt-3 bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                  onClick={() => setLocation('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg shadow-xl">
            <OnboardingChat onComplete={handleOnboardingComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}