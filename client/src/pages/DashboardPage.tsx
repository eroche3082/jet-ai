import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Plane, Luggage, MapPin, Calendar, Hotel, Utensils, 
  CreditCard, User, Settings, LogOut, Menu, X, MessageSquare,
  Check, Info, Share2, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import AIChat from '@/components/AIChat';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { onboardingSteps } from '@/lib/onboardingFlow';

export default function DashboardPage() {
  const { userProfile, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // This would normally come from user preferences saved in database
  // For now we're using sample data
  const [recommendations, setRecommendations] = useState<any[]>([
    {
      id: '1',
      title: 'Tokyo Cultural Tour',
      description: 'Explore the vibrant culture of Tokyo with this 5-day guided tour',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
      tags: ['culture', 'city', 'food']
    },
    {
      id: '2',
      title: 'Paris Romance Package',
      description: 'Experience the city of love with luxury accommodations and dining',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      tags: ['luxury', 'romance', 'city']
    },
    {
      id: '3',
      title: 'Bali Relaxation Retreat',
      description: 'Unwind and rejuvenate with spa treatments and beach access',
      image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
      tags: ['relaxation', 'beach', 'nature']
    }
  ]);
  
  // Simulate checking if user came from onboarding
  const [isNewUser, setIsNewUser] = useState(true);
  
  useEffect(() => {
    // This would check if the user just completed onboarding
    const timer = setTimeout(() => {
      setIsNewUser(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    setShowChat(prev => !prev);
  };

  return (
    <div className="px-4 py-6">
      {/* Main Content */}
      <div className="container mx-auto">
        {/* Welcome Banner */}
        {isNewUser && (
          <Card className="mb-6 bg-[#4a89dc]/10 border-[#4a89dc]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-[#4a89dc]">
                  <AvatarFallback className="bg-[#4a89dc] text-white">
                    {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">Welcome to JET AI, {userProfile?.name || 'Traveler'}!</h2>
                  <p className="text-gray-600">Your personalized travel dashboard is ready. Explore your custom recommendations below.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Travel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Destinations Visited</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <MapPin className="h-8 w-8 text-[#4a89dc]" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming Trips</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Plane className="h-8 w-8 text-[#4a89dc]" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Budget Status</p>
                <p className="text-2xl font-bold">$2,450</p>
              </div>
              <CreditCard className="h-8 w-8 text-[#4a89dc]" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Travel Points</p>
                <p className="text-2xl font-bold">3,280</p>
              </div>
              <Award className="h-8 w-8 text-[#4a89dc]" />
            </CardContent>
          </Card>
        </div>
        
        {/* Personalized Recommendations */}
        <h2 className="text-2xl font-bold mb-4">Your Personalized Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle>{rec.title}</CardTitle>
                <CardDescription>{rec.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  {rec.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#4a89dc]/10 text-[#4a89dc] text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* AI Dashboard Panel */}
        <Card className="mb-8">
          <CardHeader className="bg-[#050b17] text-white">
            <div className="flex items-center gap-3">
              <div className="bg-[#4a89dc]/20 p-2 rounded-full">
                <MessageSquare className="h-6 w-6 text-[#4a89dc]" />
              </div>
              <div>
                <CardTitle>AI Assistant Dashboard</CardTitle>
                <CardDescription className="text-gray-300">Your personalized preferences from onboarding</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="preferences" className="w-full">
              <TabsList className="w-full rounded-none border-b bg-muted/50 p-0 h-auto">
                <TabsTrigger value="preferences" className="rounded-none flex-1 py-3 data-[state=active]:bg-white">
                  Travel Preferences
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="rounded-none flex-1 py-3 data-[state=active]:bg-white">
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="insights" className="rounded-none flex-1 py-3 data-[state=active]:bg-white">
                  AI Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preferences" className="p-4">
                <Alert className="mb-4 bg-[#4a89dc]/10 border-[#4a89dc]">
                  <Check className="h-4 w-4 text-[#4a89dc]" />
                  <AlertTitle>Onboarding Complete</AlertTitle>
                  <AlertDescription>
                    Your preferences have been saved and are being used to personalize your experience.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Travel Preferences Summary */}
                  {onboardingSteps.map((step, index) => {
                    // Here we'd use actual user data, but for demo purposes we'll show sample responses
                    const sampleSelections = step.options && 
                      step.options.filter((_, i) => i % 3 === 0).map(opt => opt.label);
                    
                    return (
                      <div key={step.id} className="border rounded-md p-3 bg-white">
                        <h3 className="font-medium text-sm text-gray-500">{step.title}</h3>
                        <div className="mt-1">
                          {sampleSelections && sampleSelections.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {sampleSelections.map((selection, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#4a89dc]/10 text-[#4a89dc]"
                                >
                                  {selection}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-600 text-sm italic">Not specified</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="p-4">
                <div className="space-y-4">
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Personalized Recommendations</AlertTitle>
                    <AlertDescription>
                      Based on your preferences, we recommend these experiences.
                    </AlertDescription>
                  </Alert>
                  
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="flex border rounded-lg overflow-hidden">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={rec.image} 
                          alt={rec.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rec.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 bg-[#4a89dc]/10 text-[#4a89dc] text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="p-4">
                <Alert className="mb-4 bg-[#050b17]/5 border-[#050b17]">
                  <MessageSquare className="h-4 w-4 text-[#050b17]" />
                  <AlertTitle>AI Travel Insights</AlertTitle>
                  <AlertDescription>
                    JET AI has analyzed your preferences to provide these personalized insights.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Best Time to Visit Japan</h3>
                    <p className="text-gray-600">Spring (March to May) and fall (September to November) are considered the best times to visit Japan when the weather is mild and the landscape is painted in vibrant colors.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Paris Local Transport Tips</h3>
                    <p className="text-gray-600">Purchase a Paris Visite travel pass for unlimited travel on the metro, RER, buses, and trams. It's cost-effective if you plan to use public transport frequently.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Budget Optimization</h3>
                    <p className="text-gray-600">Based on your preferences for moderate accommodations and cultural experiences, we recommend allocating 40% of your budget to accommodations, 20% to transportation, 25% to activities, and 15% to dining.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Travel Calendar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Travel</CardTitle>
            <CardDescription>Your scheduled trips for the next 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-lg">
                <div className="p-3 bg-[#4a89dc]/10 rounded-md mr-4">
                  <Calendar className="h-6 w-6 text-[#4a89dc]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Weekend in Paris</h3>
                  <p className="text-gray-500 text-sm">May 15 - May 18, 2025</p>
                </div>
                <Button variant="outline" className="ml-auto">View</Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg">
                <div className="p-3 bg-[#4a89dc]/10 rounded-md mr-4">
                  <Calendar className="h-6 w-6 text-[#4a89dc]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Tokyo Adventure</h3>
                  <p className="text-gray-500 text-sm">June 10 - June 20, 2025</p>
                </div>
                <Button variant="outline" className="ml-auto">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chat Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-[#4a89dc] hover:bg-[#3a79cc] text-white shadow-lg"
        onClick={toggleChat}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl rounded-lg overflow-hidden z-50">
          <AIChat />
        </div>
      )}
    </div>
  );
}

// Award component is now imported from lucide-react