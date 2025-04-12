/**
 * DashboardRenderer.tsx
 * Renders a personalized dashboard based on user preferences
 */
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { GiftIcon, Plane as FlightIcon, MapPinIcon, Activity as ActivityIcon, Hotel as HotelIcon, Heart as HeartIcon, UserIcon } from 'lucide-react';

interface DashboardRendererProps {
  onStartOnboarding?: () => void;
}

const DashboardRenderer: React.FC<DashboardRendererProps> = ({ onStartOnboarding }) => {
  const { currentUser, userProfile, hasCompletedOnboarding, isProfileLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get travel preferences if available
  const preferences = userProfile?.travelPreferences;
  
  // Generate AI suggestion based on user preferences
  const generateAiSuggestion = (): string => {
    if (!preferences) {
      return 'Complete your travel profile to get personalized recommendations!';
    }
    
    const destinations = preferences.upcomingDestinations || [];
    const travelerType = preferences.travelerType || '';
    const interests = preferences.interests || [];
    
    if (destinations.length > 0) {
      const destination = destinations[0];
      return `Based on your interest in ${destination}, I can help you find the best ${travelerType.toLowerCase()} experiences there. Ask me for recommendations!`;
    } else if (interests.length > 0) {
      const interest = interests[0];
      return `I see you are interested in ${interest}. I can suggest destinations that are perfect for ${interest.toLowerCase()} enthusiasts!`;
    } else {
      return 'Ask me about your next travel destination and I will provide personalized recommendations!';
    }
  };
  
  // Render loading state
  if (isProfileLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      </div>
    );
  }
  
  // Render empty state if user hasn't completed onboarding
  if (!hasCompletedOnboarding) {
    return (
      <Card className="p-6 flex flex-col items-center text-center">
        <UserIcon className="h-12 w-12 text-primary opacity-70 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Set up your travel preferences to get personalized recommendations and a customized dashboard.
        </p>
        <Button onClick={onStartOnboarding}>
          Start Profile Setup
        </Button>
      </Card>
    );
  }
  
  // Get membership level
  const membership = userProfile?.membership || 'basic';
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold">
              Welcome back, {userProfile?.name || 'Traveler'}!
            </h2>
            <p className="text-muted-foreground">
              Your personal travel assistant is ready to help.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {membership.charAt(0).toUpperCase() + membership.slice(1)} Membership
            </span>
            <div className={`h-6 px-2 rounded-full text-xs font-medium flex items-center ${
              membership === 'premium' 
                ? 'bg-amber-200 text-amber-700' 
                : membership === 'freemium' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
            }`}>
              {membership === 'premium' ? 'PREMIUM' : membership === 'freemium' ? 'FREEMIUM' : 'BASIC'}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* AI Suggestion Card */}
          <Card className="p-6 border-primary/20 border-2">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">JetAI Suggestion</h3>
                <p className="text-muted-foreground">{generateAiSuggestion()}</p>
              </div>
            </div>
          </Card>
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <FlightIcon size={18} />
                </div>
                <h4 className="font-medium">Find Flights</h4>
                <p className="text-xs text-muted-foreground">Search for the best deals</p>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                  <HotelIcon size={18} />
                </div>
                <h4 className="font-medium">Book Hotels</h4>
                <p className="text-xs text-muted-foreground">Find your perfect stay</p>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                  <ActivityIcon size={18} />
                </div>
                <h4 className="font-medium">Experiences</h4>
                <p className="text-xs text-muted-foreground">Discover activities</p>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                  <GiftIcon size={18} />
                </div>
                <h4 className="font-medium">Upgrade</h4>
                <p className="text-xs text-muted-foreground">Get premium features</p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          {!preferences?.upcomingDestinations?.length ? (
            <Card className="p-6 flex flex-col items-center text-center">
              <MapPinIcon className="h-12 w-12 text-primary opacity-70 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Destinations Set</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Add your upcoming destinations to get personalized recommendations.
              </p>
              <Button onClick={onStartOnboarding}>
                Update Travel Plans
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Upcoming Destinations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preferences.upcomingDestinations.map((destination, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-32 bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <MapPinIcon className="h-8 w-8 opacity-50" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-lg">{destination}</h4>
                      <p className="text-sm text-muted-foreground">
                        Ask JetAI for recommendations
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Explore
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Travel Profile</h3>
            
            <div className="space-y-4">
              {preferences?.travelerType && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Traveler Type</h4>
                  <p>{preferences.travelerType}</p>
                </div>
              )}
              
              {preferences?.interests?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Interests</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {preferences.interests.map((interest, index) => (
                      <div key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {preferences?.budget && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Budget</h4>
                  <p>{preferences.budget}</p>
                </div>
              )}
              
              {preferences?.preferredAccommodation && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Preferred Accommodation</h4>
                  <p>{preferences.preferredAccommodation}</p>
                </div>
              )}
              
              {preferences?.dietaryRestrictions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Dietary Restrictions</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {preferences.dietaryRestrictions.map((restriction, index) => (
                      <div key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {restriction}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {preferences?.languages?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Languages</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {preferences.languages.map((language, index) => (
                      <div key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {language}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={onStartOnboarding}
              className="mt-6"
            >
              Update Preferences
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardRenderer;