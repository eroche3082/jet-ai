import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Edit, Trash2, Download, Eye, MessageSquare, BarChart4, UserPlus, Users, CreditCard, Clock, Mail } from 'lucide-react';

// Mock data for the client database
const clients = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    membershipTier: 'Pro',
    joinDate: '2025-01-15',
    lastActive: '2025-04-14',
    totalSpent: '$349.97',
    status: 'active',
    location: 'New York, USA',
    journeysPlanned: 8,
    aiCreditsRemaining: 125
  },
  {
    id: 2,
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    membershipTier: 'Free',
    joinDate: '2025-02-03',
    lastActive: '2025-04-12',
    totalSpent: '$0.00',
    status: 'active',
    location: 'London, UK',
    journeysPlanned: 2,
    aiCreditsRemaining: 0
  },
  {
    id: 3,
    name: 'Michael Wilson',
    email: 'michael.w@example.com',
    membershipTier: 'Business',
    joinDate: '2025-01-08',
    lastActive: '2025-04-15',
    totalSpent: '$1,199.99',
    status: 'active',
    location: 'Sydney, Australia',
    journeysPlanned: 15,
    aiCreditsRemaining: 458
  },
  {
    id: 4,
    name: 'Sofia Garcia',
    email: 'sofia.g@example.com',
    membershipTier: 'Pro',
    joinDate: '2025-03-21',
    lastActive: '2025-04-10',
    totalSpent: '$79.99',
    status: 'active',
    location: 'Madrid, Spain',
    journeysPlanned: 3,
    aiCreditsRemaining: 87
  },
  {
    id: 5,
    name: 'David Chen',
    email: 'david.c@example.com',
    membershipTier: 'Business',
    joinDate: '2025-01-12',
    lastActive: '2025-04-08',
    totalSpent: '$899.97',
    status: 'inactive',
    location: 'Singapore',
    journeysPlanned: 12,
    aiCreditsRemaining: 320
  },
  {
    id: 6,
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    membershipTier: 'Free',
    joinDate: '2025-03-05',
    lastActive: '2025-03-28',
    totalSpent: '$0.00',
    status: 'inactive',
    location: 'Toronto, Canada',
    journeysPlanned: 1,
    aiCreditsRemaining: 0
  },
  {
    id: 7,
    name: 'James Taylor',
    email: 'james.t@example.com',
    membershipTier: 'Pro',
    joinDate: '2025-02-14',
    lastActive: '2025-04-15',
    totalSpent: '$139.98',
    status: 'active',
    location: 'Chicago, USA',
    journeysPlanned: 5,
    aiCreditsRemaining: 62
  },
  {
    id: 8,
    name: 'Amara Khan',
    email: 'amara.k@example.com',
    membershipTier: 'Pro',
    joinDate: '2025-02-25',
    lastActive: '2025-04-13',
    totalSpent: '$159.99',
    status: 'active',
    location: 'Mumbai, India',
    journeysPlanned: 4,
    aiCreditsRemaining: 78
  }
];

// Mock data for user activities
const userActivities = [
  { 
    id: 1, 
    userId: 3, 
    type: 'journey_planned', 
    date: '2025-04-15', 
    details: 'Created an itinerary for Barcelona trip (7 days)'
  },
  { 
    id: 2, 
    userId: 3, 
    type: 'flight_booked', 
    date: '2025-04-15', 
    details: 'Booked flight SYD → BCN for Jun 15, 2025'
  },
  { 
    id: 3, 
    userId: 3, 
    type: 'hotel_booked', 
    date: '2025-04-14', 
    details: 'Reserved Hotel Catalonia Barcelona (5 nights)'
  },
  { 
    id: 4, 
    userId: 3, 
    type: 'ai_assistant', 
    date: '2025-04-14', 
    details: 'Used AI Assistant for local cuisine recommendations'
  },
  { 
    id: 5, 
    userId: 3, 
    type: 'travel_guide', 
    date: '2025-04-12', 
    details: 'Downloaded Barcelona Travel Guide PDF'
  },
  { 
    id: 6, 
    userId: 3, 
    type: 'payment', 
    date: '2025-04-12', 
    details: 'Made payment of $289.99 for premium services'
  },
  { 
    id: 7, 
    userId: 3, 
    type: 'journey_planned', 
    date: '2025-04-08', 
    details: 'Created an itinerary for Tokyo trip (10 days)'
  }
];

// Mock data for user membership
const membershipDetails = {
  id: 3,
  name: 'Michael Wilson',
  email: 'michael.w@example.com',
  phone: '+61 2 8765 4321',
  membershipTier: 'Business',
  subscriptionPlan: 'Annual',
  subscriptionRenews: '2026-01-08',
  paymentMethod: 'Visa **** 1234',
  billingAddress: '42 Harbor View, Sydney NSW 2000, Australia',
  signupDate: '2025-01-08',
  referralCode: 'MWILSON25',
  aiCreditsTotal: 500,
  aiCreditsUsed: 42,
  aiCreditsRemaining: 458,
  featureAccess: [
    'Unlimited Itineraries',
    'Priority AI Assistant',
    'Offline Maps',
    'VIP Support',
    'Real-time Alerts',
    'Exclusive Deals'
  ],
  accountStatus: 'active',
  verificationStatus: 'verified',
  lastLogin: '2025-04-15 09:23 AM',
  loginDevices: [
    'iPhone 16 Pro (Sydney)',
    'MacBook Pro (Sydney)',
    'iPad Mini (Last used: 2025-03-28)'
  ]
};

const ClientDatabase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedClientData = clients.find(client => client.id === selectedClient);
  
  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Client Database</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8 bg-[#050b17] border-[#4a89dc]/20 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-[#050b17] border-[#4a89dc]/20">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="pro">Pro Members</SelectItem>
                <SelectItem value="business">Business Members</SelectItem>
                <SelectItem value="free">Free Members</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  <UserPlus className="h-4 w-4 mr-2" /> Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new client account in the JET AI platform
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right font-medium">
                      Full Name
                    </label>
                    <Input id="name" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="location" className="text-right font-medium">
                      Location
                    </label>
                    <Input id="location" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="membershipTier" className="text-right font-medium">
                      Membership
                    </label>
                    <Select>
                      <SelectTrigger id="membershipTier" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Add Client</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableHead className="text-[#4a89dc]">Client</TableHead>
                  <TableHead className="text-[#4a89dc]">Membership</TableHead>
                  <TableHead className="text-[#4a89dc]">Status</TableHead>
                  <TableHead className="text-[#4a89dc]">Location</TableHead>
                  <TableHead className="text-[#4a89dc]">Joined</TableHead>
                  <TableHead className="text-[#4a89dc]">Total Spent</TableHead>
                  <TableHead className="text-[#4a89dc] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className={`hover:bg-[#0f1e36] border-b-[#4a89dc]/20 ${selectedClient === client.id ? 'bg-[#0f1e36]' : ''}`}>
                    <TableCell className="font-medium">
                      <div>{client.name}</div>
                      <div className="text-xs text-gray-400">{client.email}</div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          client.membershipTier === 'Pro' ? 'bg-blue-500/20 text-blue-400' : 
                          client.membershipTier === 'Business' ? 'bg-purple-500/20 text-purple-400' : 
                          'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {client.membershipTier}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${client.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{client.location}</TableCell>
                    <TableCell>{client.joinDate}</TableCell>
                    <TableCell>{client.totalSpent}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedClient(client.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {selectedClient && selectedClientData && (
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedClientData.name} Profile</CardTitle>
                <CardDescription className="text-gray-400">
                  Member since {selectedClientData.joinDate} • Last active {selectedClientData.lastActive}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedClient(null)}>Close</Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="bg-[#050b17]">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="membership">Membership</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 space-y-4">
                        <div className="aspect-square bg-[#0a1328] rounded-full flex items-center justify-center max-w-40 mx-auto">
                          <div className="text-3xl font-bold text-[#4a89dc]">
                            {selectedClientData.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="font-bold text-lg">{selectedClientData.name}</h3>
                          <p className="text-gray-400">{selectedClientData.location}</p>
                        </div>
                        
                        <div className="space-y-2 pt-4 border-t border-[#4a89dc]/20">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Email:</span>
                            <span>{selectedClientData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Member Since:</span>
                            <span>{selectedClientData.joinDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={selectedClientData.status === 'active' ? 'text-green-500' : 'text-gray-400'}>
                              {selectedClientData.status.charAt(0).toUpperCase() + selectedClientData.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex gap-2 justify-center">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Mail className="h-4 w-4" /> Email
                          </Button>
                          <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white gap-1" size="sm">
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-[#4a89dc]" />
                            <span className="text-gray-400">Membership</span>
                          </div>
                          <div className="text-xl font-bold">{selectedClientData.membershipTier}</div>
                        </div>
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-5 w-5 text-[#4a89dc]" />
                            <span className="text-gray-400">Total Spent</span>
                          </div>
                          <div className="text-xl font-bold">{selectedClientData.totalSpent}</div>
                        </div>
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-[#4a89dc]" />
                            <span className="text-gray-400">Last Active</span>
                          </div>
                          <div className="text-xl font-bold">{selectedClientData.lastActive}</div>
                        </div>
                      </div>
                      
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <h3 className="font-medium mb-3">Travel Statistics</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Journeys Planned</div>
                            <div className="text-2xl font-bold">{selectedClientData.journeysPlanned}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">AI Credits</div>
                            <div className="text-2xl font-bold">{selectedClientData.aiCreditsRemaining}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Completed Trips</div>
                            <div className="text-2xl font-bold">{Math.floor(selectedClientData.journeysPlanned * 0.75)}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Recent Activity</h3>
                          <Button variant="link" className="text-[#4a89dc] p-0 h-auto">View All</Button>
                        </div>
                        
                        <div className="space-y-3">
                          {userActivities.slice(0, 3).map((activity) => (
                            <div key={activity.id} className="border-b border-[#4a89dc]/10 pb-2 last:border-0">
                              <div className="flex justify-between">
                                <span>{activity.details}</span>
                                <span className="text-gray-400 text-sm">{activity.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-lg">Activity History</h3>
                      <div className="flex gap-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[140px] bg-[#050b17] border-[#4a89dc]/20">
                            <SelectValue placeholder="Filter by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Activity</SelectItem>
                            <SelectItem value="journeys">Journeys</SelectItem>
                            <SelectItem value="bookings">Bookings</SelectItem>
                            <SelectItem value="payments">Payments</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" className="gap-1">
                          <Download className="h-4 w-4" /> Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {userActivities.map((activity) => (
                        <div key={activity.id} className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20 flex justify-between">
                          <div>
                            <div className="font-medium">{activity.details}</div>
                            <div className="text-sm text-gray-400">
                              Activity Type: {activity.type.replace('_', ' ').split(' ').map(
                                word => word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div>{activity.date}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="membership" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                        <h3 className="font-medium mb-3">Membership Details</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="text-gray-400 text-sm">Current Tier</div>
                            <div className="text-xl font-bold">{membershipDetails.membershipTier}</div>
                          </div>
                          
                          <div>
                            <div className="text-gray-400 text-sm">Subscription</div>
                            <div className="text-lg">{membershipDetails.subscriptionPlan}</div>
                            <div className="text-xs text-gray-400">Renews: {membershipDetails.subscriptionRenews}</div>
                          </div>
                          
                          <div>
                            <div className="text-gray-400 text-sm">Payment Method</div>
                            <div className="text-lg">{membershipDetails.paymentMethod}</div>
                          </div>
                          
                          <div>
                            <div className="text-gray-400 text-sm">Billing Address</div>
                            <div className="text-sm">{membershipDetails.billingAddress}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white w-full" size="sm">
                            Manage Subscription
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-6">
                      <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                        <h3 className="font-medium mb-3">AI Credits</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-gray-400 text-sm">Total Credits</div>
                              <div className="text-2xl font-bold">{membershipDetails.aiCreditsTotal}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Used</div>
                              <div className="text-2xl font-bold">{membershipDetails.aiCreditsUsed}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Remaining</div>
                              <div className="text-2xl font-bold">{membershipDetails.aiCreditsRemaining}</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-gray-400 text-sm mb-1">Credit Usage</div>
                            <div className="h-2 bg-gray-700 rounded-full">
                              <div 
                                className="h-full bg-[#4a89dc] rounded-full" 
                                style={{ 
                                  width: `${(membershipDetails.aiCreditsUsed / membershipDetails.aiCreditsTotal) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>Used: {Math.round((membershipDetails.aiCreditsUsed / membershipDetails.aiCreditsTotal) * 100)}%</span>
                              <span>Renews monthly</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" className="w-full" size="sm">
                            Usage History
                          </Button>
                          <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white w-full" size="sm">
                            Add Credits
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                        <h3 className="font-medium mb-3">Feature Access</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {membershipDetails.featureAccess.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-[#4a89dc]"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                        <h3 className="font-medium mb-3">Account Security</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Account Status</div>
                            <div className="text-lg font-medium">
                              <span className={membershipDetails.accountStatus === 'active' ? 'text-green-500' : 'text-red-500'}>
                                {membershipDetails.accountStatus.charAt(0).toUpperCase() + membershipDetails.accountStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Verification Status</div>
                            <div className="text-lg font-medium">
                              <span className={membershipDetails.verificationStatus === 'verified' ? 'text-green-500' : 'text-yellow-500'}>
                                {membershipDetails.verificationStatus.charAt(0).toUpperCase() + membershipDetails.verificationStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Last Login</div>
                            <div className="text-lg">{membershipDetails.lastLogin}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Login Devices</div>
                            <div className="text-sm">{membershipDetails.loginDevices.length} active devices</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-400 text-sm">Activity Score</div>
                          <BarChart4 className="h-4 w-4 text-[#4a89dc]" />
                        </div>
                        <div className="text-3xl font-bold">87/100</div>
                        <div className="text-xs text-green-500 mt-1">+12 from last month</div>
                      </div>
                      
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-400 text-sm">Engagement Rate</div>
                          <BarChart4 className="h-4 w-4 text-[#4a89dc]" />
                        </div>
                        <div className="text-3xl font-bold">94%</div>
                        <div className="text-xs text-green-500 mt-1">High engagement</div>
                      </div>
                      
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-400 text-sm">Customer Value</div>
                          <BarChart4 className="h-4 w-4 text-[#4a89dc]" />
                        </div>
                        <div className="text-3xl font-bold">$1,199.99</div>
                        <div className="text-xs text-green-500 mt-1">Premium client</div>
                      </div>
                    </div>
                    
                    <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                      <h3 className="font-medium mb-4">Activity Timeline</h3>
                      <div className="h-60 bg-[#0a1328] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                        <p className="text-gray-400">Activity timeline chart would be rendered here</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <h3 className="font-medium mb-4">Feature Usage</h3>
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
                              <span>Itinerary Builder</span>
                              <span className="text-gray-400">92%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full">
                              <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Flight Search</span>
                              <span className="text-gray-400">78%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full">
                              <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '78%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Hotel Booking</span>
                              <span className="text-gray-400">65%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full">
                              <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <h3 className="font-medium mb-4">Browsing Behavior</h3>
                        <div className="h-48 bg-[#0a1328] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                          <p className="text-gray-400">Behavior chart would be rendered here</p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg. Session:</span>
                            <span>12m 48s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Sessions/Week:</span>
                            <span>8.2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Message Client</Button>
              <Button variant="outline">Export Client Data</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
};

export default ClientDatabase;