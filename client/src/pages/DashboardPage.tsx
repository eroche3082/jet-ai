import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Calendar, Clock, TrendingUp, BarChart3, 
  Plane, CreditCard, Sun, CloudRain, Hotel 
} from 'lucide-react';

export default function DashboardPage() {
  const username = localStorage.getItem('username') || 'Admin';
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {username}</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your travel plans.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold ml-3">2</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saved Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold ml-3">7</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Travel Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold ml-3">$2,450</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Travel</TabsTrigger>
          <TabsTrigger value="stats">Travel Stats</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Next Trip: Paris, France</CardTitle>
                <CardDescription>May 15 - May 22, 2025</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Departure</div>
                    <div className="text-sm text-gray-600">May 15, 2025 - 10:25 AM</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-sm text-gray-600">7 days, 6 nights</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Hotel className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Accommodation</div>
                    <div className="text-sm text-gray-600">Hotel Monmarte, Paris</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center mt-1">
                    <Sun className="h-5 w-5 text-amber-500 mr-1" />
                    <span className="text-sm">68°F</span>
                  </div>
                  <div className="ml-4 text-xs text-gray-600">
                    Forecast for arrival date
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trip to Tokyo, Japan</CardTitle>
                <CardDescription>June 10 - June 20, 2025</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Departure</div>
                    <div className="text-sm text-gray-600">June 10, 2025 - 8:15 PM</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-sm text-gray-600">10 days, 9 nights</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Hotel className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Accommodation</div>
                    <div className="text-sm text-gray-600">Shinjuku Grand Hotel, Tokyo</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center mt-1">
                    <CloudRain className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="text-sm">75°F</span>
                  </div>
                  <div className="ml-4 text-xs text-gray-600">
                    Rainy season expected
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" /> Travel Trends
                </CardTitle>
                <CardDescription>Your travel patterns and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Most Visited Region</div>
                    <div className="text-lg">Europe (3 trips)</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Average Trip Duration</div>
                    <div className="text-lg">7.5 days</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Preferred Season</div>
                    <div className="text-lg">Summer (Jun-Aug)</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Frequently Used Airlines</div>
                    <div className="text-lg">Air France, JAL</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" /> Spending Analysis
                </CardTitle>
                <CardDescription>Your travel budget utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Average Trip Cost</div>
                    <div className="text-lg">$1,850</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Biggest Expense Category</div>
                    <div className="text-lg">Accommodation (42%)</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Most Economical Trip</div>
                    <div className="text-lg">Barcelona, 2024 ($1,100)</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Annual Travel Budget</div>
                    <div className="text-lg">$5,000 (48% used)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1580935891785-438a673a8182?q=80&w=1000&auto=format&fit=crop" 
                alt="Bali beaches" 
                className="h-40 w-full object-cover"
              />
              <CardHeader>
                <CardTitle>Bali, Indonesia</CardTitle>
                <CardDescription>Based on your beach preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Pristine beaches, vibrant culture, and luxurious resorts.
                  Perfect for your next summer getaway.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560806925-c2de27820a0e?q=80&w=1000&auto=format&fit=crop" 
                alt="Kyoto temples" 
                className="h-40 w-full object-cover"
              />
              <CardHeader>
                <CardTitle>Kyoto, Japan</CardTitle>
                <CardDescription>Similar to your Tokyo trip</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Ancient temples, traditional gardens, and authentic cultural experiences.
                  A perfect complement to your Tokyo journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1572903784439-c178ee402a8d?q=80&w=1000&auto=format&fit=crop" 
                alt="Barcelona architecture" 
                className="h-40 w-full object-cover"
              />
              <CardHeader>
                <CardTitle>Barcelona, Spain</CardTitle>
                <CardDescription>Based on budget & interests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Stunning architecture, Mediterranean cuisine, and vibrant nightlife.
                  Aligns with your budget and cultural interests.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}