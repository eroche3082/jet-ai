import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Removing Helmet temporarily due to error
// import { Helmet } from 'react-helmet-async';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, PlaneTakeoff, Globe, Utensils, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CulturalImmersionPlanner from '@/components/CulturalImmersionPlanner';

export default function PreTripPlannerPage() {
  const [activeTab, setActiveTab] = useState('cultural');
  
  // Mock user trip details
  const userTripDetails = {
    destination: 'Tokyo, Japan',
    departureDate: new Date(new Date().setDate(new Date().getDate() + 45)), // 45 days from now
    returnDate: new Date(new Date().setDate(new Date().getDate() + 52)), // 52 days from now
    userPreferences: ['Food', 'History', 'Photography', 'Technology']
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Title would normally go here using document.title */}
      {/* We've removed Helmet due to configuration issues */}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Pre-Trip Planner</h1>
        <p className="text-gray-400">
          Prepare for your upcoming journey with personalized cultural insights and automated planning tools
        </p>
      </div>
      
      <Alert className="mb-6 bg-[#0a1021] border-[#4a89dc]/30">
        <AlertCircle className="h-4 w-4 text-[#4a89dc]" />
        <AlertTitle>Plan ahead for the best experience</AlertTitle>
        <AlertDescription>
          Your trip to Tokyo is 45 days away. We've created a personalized cultural immersion timeline to help you prepare.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#0a1021] border border-gray-800">
          <TabsTrigger value="cultural" className="data-[state=active]:bg-[#4a89dc]">
            <Globe className="h-4 w-4 mr-2" />
            Cultural Immersion
          </TabsTrigger>
          <TabsTrigger value="visa" className="data-[state=active]:bg-[#4a89dc]">
            <Calendar className="h-4 w-4 mr-2" />
            Visa & Documents
          </TabsTrigger>
          <TabsTrigger value="cuisine" className="data-[state=active]:bg-[#4a89dc]">
            <Utensils className="h-4 w-4 mr-2" />
            Cuisine Guide
          </TabsTrigger>
          <TabsTrigger value="logistics" className="data-[state=active]:bg-[#4a89dc]">
            <PlaneTakeoff className="h-4 w-4 mr-2" />
            Travel Logistics
          </TabsTrigger>
        </TabsList>
        
        {/* Cultural Immersion Tab */}
        <TabsContent value="cultural">
          <CulturalImmersionPlanner tripDetails={userTripDetails} />
        </TabsContent>
        
        {/* Other tabs - will be implemented in future iterations */}
        <TabsContent value="visa">
          <Card className="bg-[#0a1021] border-[#4a89dc]/30">
            <CardHeader>
              <CardTitle>Visa & Travel Documents</CardTitle>
              <CardDescription className="text-gray-400">
                Prepare your required travel documents for Japan
              </CardDescription>
            </CardHeader>
            <div className="p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-[#050b17] rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-[#4a89dc]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Visa Requirements Coming Soon</h3>
                <p className="text-gray-400 max-w-md">
                  We're working on adding detailed visa and document information for your trip to Japan. Check back soon!
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="cuisine">
          <Card className="bg-[#0a1021] border-[#4a89dc]/30">
            <CardHeader>
              <CardTitle>Japanese Cuisine Guide</CardTitle>
              <CardDescription className="text-gray-400">
                Explore the culinary traditions of Japan
              </CardDescription>
            </CardHeader>
            <div className="p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-[#050b17] rounded-full flex items-center justify-center">
                  <Utensils className="h-8 w-8 text-[#4a89dc]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Cuisine Guide Coming Soon</h3>
                <p className="text-gray-400 max-w-md">
                  We're preparing a comprehensive guide to Japanese cuisine for your upcoming trip. Check back soon!
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="logistics">
          <Card className="bg-[#0a1021] border-[#4a89dc]/30">
            <CardHeader>
              <CardTitle>Travel Logistics</CardTitle>
              <CardDescription className="text-gray-400">
                Plan transportation, accommodation, and daily logistics
              </CardDescription>
            </CardHeader>
            <div className="p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-[#050b17] rounded-full flex items-center justify-center">
                  <PlaneTakeoff className="h-8 w-8 text-[#4a89dc]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Logistics Planner Coming Soon</h3>
                <p className="text-gray-400 max-w-md">
                  We're developing detailed transportation and daily logistics planning tools for your Japan trip. Check back soon!
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}