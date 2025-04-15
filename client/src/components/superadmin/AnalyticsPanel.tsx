import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, ArrowUpRight, ArrowDownRight, Globe, MessageSquare, Map, CreditCard } from 'lucide-react';

// Mock data for charts - in a real app, this would come from an API
const performanceData = [
  { month: 'Jan', users: 4200, conversations: 12500, bookings: 850 },
  { month: 'Feb', users: 4800, conversations: 14200, bookings: 920 },
  { month: 'Mar', users: 5100, conversations: 15800, bookings: 1050 },
  { month: 'Apr', users: 5600, conversations: 17500, bookings: 1120 },
  { month: 'May', users: 6200, conversations: 19200, bookings: 1350 },
  { month: 'Jun', users: 6800, conversations: 21500, bookings: 1480 },
  { month: 'Jul', users: 7200, conversations: 23800, bookings: 1620 },
  { month: 'Aug', users: 7900, conversations: 25400, bookings: 1780 },
  { month: 'Sep', users: 8400, conversations: 27100, bookings: 1920 },
  { month: 'Oct', users: 9100, conversations: 29800, bookings: 2150 },
  { month: 'Nov', users: 9800, conversations: 32500, bookings: 2340 },
  { month: 'Dec', users: 10500, conversations: 35200, bookings: 2580 }
];

const geographicData = [
  { country: 'United States', users: 3850, percentage: 38.5 },
  { country: 'United Kingdom', users: 1240, percentage: 12.4 },
  { country: 'Canada', users: 980, percentage: 9.8 },
  { country: 'Australia', users: 720, percentage: 7.2 },
  { country: 'Germany', users: 650, percentage: 6.5 },
  { country: 'France', users: 580, percentage: 5.8 },
  { country: 'Spain', users: 480, percentage: 4.8 },
  { country: 'Italy', users: 420, percentage: 4.2 },
  { country: 'Japan', users: 380, percentage: 3.8 },
  { country: 'Other', users: 700, percentage: 7.0 }
];

const AnalyticsPanel: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#4a89dc]" />
                <span>Active Users</span>
              </div>
              <span className="text-green-500 bg-green-500/10 text-xs py-1 px-2 rounded-full flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                18.3%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">10,582</div>
            <p className="text-sm text-gray-400">Daily active users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-[#4a89dc]" />
                <span>Conversations</span>
              </div>
              <span className="text-green-500 bg-green-500/10 text-xs py-1 px-2 rounded-full flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12.5%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">35,842</div>
            <p className="text-sm text-gray-400">Total conversations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Map className="mr-2 h-5 w-5 text-[#4a89dc]" />
                <span>Destinations</span>
              </div>
              <span className="text-red-500 bg-red-500/10 text-xs py-1 px-2 rounded-full flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                2.1%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,250</div>
            <p className="text-sm text-gray-400">Destinations explored</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-[#4a89dc]" />
                <span>Revenue</span>
              </div>
              <span className="text-green-500 bg-green-500/10 text-xs py-1 px-2 rounded-full flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                24.8%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$245,821</div>
            <p className="text-sm text-gray-400">Monthly revenue</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="bg-[#050b17]">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[120px] bg-[#050b17] border-[#4a89dc]/20">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="h-10">Export</Button>
          </div>
        </div>
        
        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription className="text-gray-400">
                Track the key performance indicators over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">Performance chart would be rendered here</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                  <div className="text-sm text-gray-400">Total Users</div>
                  <div className="text-2xl font-bold mt-2 text-white">10,582</div>
                  <div className="flex items-center mt-2 text-green-500 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>18.3% vs last period</span>
                  </div>
                </div>
                
                <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                  <div className="text-sm text-gray-400">User Retention</div>
                  <div className="text-2xl font-bold mt-2 text-white">68.2%</div>
                  <div className="flex items-center mt-2 text-green-500 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>3.5% vs last period</span>
                  </div>
                </div>
                
                <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                  <div className="text-sm text-gray-400">Avg. Session Time</div>
                  <div className="text-2xl font-bold mt-2 text-white">12m 24s</div>
                  <div className="flex items-center mt-2 text-green-500 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>2.1% vs last period</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="geographic" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Analyze user distribution by geographic regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <div className="h-80 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 mb-4">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-[#4a89dc] mx-auto mb-4" />
                        <p className="text-gray-400">World map visualization would be rendered here</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-80">
                  <h3 className="text-lg font-medium mb-3">Top Countries</h3>
                  <div className="space-y-3">
                    {geographicData.slice(0, 5).map((item, index) => (
                      <div key={index} className="bg-[#050b17] rounded-md p-3 border border-[#4a89dc]/20">
                        <div className="flex justify-between items-center">
                          <span>{item.country}</span>
                          <span className="text-gray-400">{item.users.toLocaleString()} users</span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#4a89dc]" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 text-right">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Breakdown of user devices and platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Device Types</h3>
                  <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Device type chart would be rendered here</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-[#050b17] p-3 rounded-md border border-[#4a89dc]/20">
                      <div className="text-sm text-gray-400">Mobile</div>
                      <div className="text-xl font-bold text-white mt-1">68.4%</div>
                    </div>
                    <div className="bg-[#050b17] p-3 rounded-md border border-[#4a89dc]/20">
                      <div className="text-sm text-gray-400">Desktop</div>
                      <div className="text-xl font-bold text-white mt-1">24.7%</div>
                    </div>
                    <div className="bg-[#050b17] p-3 rounded-md border border-[#4a89dc]/20">
                      <div className="text-sm text-gray-400">Tablet</div>
                      <div className="text-xl font-bold text-white mt-1">6.9%</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Operating Systems</h3>
                  <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">OS chart would be rendered here</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-[#050b17] p-3 rounded-md border border-[#4a89dc]/20">
                      <div className="text-sm text-gray-400">iOS</div>
                      <div className="text-xl font-bold text-white mt-1">48.2%</div>
                    </div>
                    <div className="bg-[#050b17] p-3 rounded-md border border-[#4a89dc]/20">
                      <div className="text-sm text-gray-400">Android</div>
                      <div className="text-xl font-bold text-white mt-1">42.1%</div>
                    </div>
                    <div className="bg-[#050b17] p-3 rounded-md border border-[#4a89dc]/20">
                      <div className="text-sm text-gray-400">Other</div>
                      <div className="text-xl font-bold text-white mt-1">9.7%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription className="text-gray-400">
                Analysis of user activity and feature engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Feature Usage</h3>
                  <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>AI Travel Assistant</span>
                          <span className="text-gray-400">85%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full">
                          <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Destination Search</span>
                          <span className="text-gray-400">78%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full">
                          <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Itinerary Building</span>
                          <span className="text-gray-400">62%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full">
                          <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Trip Booking</span>
                          <span className="text-gray-400">45%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full">
                          <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Community Features</span>
                          <span className="text-gray-400">38%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full">
                          <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '38%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Session Details</h3>
                  <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Avg. Time per Session</div>
                        <div className="text-xl font-bold text-white mt-1">12m 24s</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400">Sessions per User</div>
                        <div className="text-xl font-bold text-white mt-1">3.8</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400">Bounce Rate</div>
                        <div className="text-xl font-bold text-white mt-1">28.4%</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400">Pages per Session</div>
                        <div className="text-xl font-bold text-white mt-1">4.2</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Peak Usage Hours</div>
                      <div className="h-24 bg-[#0a1328] rounded-md border border-[#4a89dc]/20 flex items-center justify-center">
                        <p className="text-xs text-gray-400">Hourly usage chart would be rendered here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AnalyticsPanel;