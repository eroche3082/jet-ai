import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Search, Download, Filter, Eye, Mail, Trash2, UserPlus } from 'lucide-react';

const clientData = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john.doe@example.com',
    platform: 'JET AI',
    plan: 'Pro',
    status: 'Active',
    joined: '2024-12-15',
    lastActive: '2025-04-14',
    location: 'New York, USA',
    activity: 'Travel research for Europe trip',
    device: 'iPhone 15 Pro',
    spentTotal: '$249.95'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com',
    platform: 'JET AI',
    plan: 'Business',
    status: 'Active',
    joined: '2025-01-10',
    lastActive: '2025-04-13',
    location: 'London, UK',
    activity: 'Booked flight to Tokyo',
    device: 'MacBook Pro',
    spentTotal: '$499.99'
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    email: 'robert.j@example.com',
    platform: 'CryptoBot',
    plan: 'Free',
    status: 'Active',
    joined: '2025-02-18',
    lastActive: '2025-04-10',
    location: 'Toronto, Canada',
    activity: 'Market analysis for BTC',
    device: 'Windows PC',
    spentTotal: '$0.00'
  },
  { 
    id: 4, 
    name: 'Emily Wilson', 
    email: 'emily.w@example.com',
    platform: 'FitnessAI',
    plan: 'Pro',
    status: 'Inactive',
    joined: '2025-01-05',
    lastActive: '2025-03-20',
    location: 'Sydney, Australia',
    activity: 'Created new workout plan',
    device: 'Android Phone',
    spentTotal: '$149.99'
  },
  { 
    id: 5, 
    name: 'Michael Brown', 
    email: 'michael.b@example.com',
    platform: 'JET AI',
    plan: 'Business',
    status: 'Active',
    joined: '2024-11-22',
    lastActive: '2025-04-15',
    location: 'Berlin, Germany',
    activity: 'Travel planning for business trip',
    device: 'iPad Pro',
    spentTotal: '$799.50'
  },
  { 
    id: 6, 
    name: 'Sarah Lee', 
    email: 'sarah.lee@example.com',
    platform: 'ShopAI',
    plan: 'Pro',
    status: 'Active',
    joined: '2025-03-01',
    lastActive: '2025-04-14',
    location: 'Seoul, South Korea',
    activity: 'Product price tracking',
    device: 'iPhone 14',
    spentTotal: '$99.99'
  },
  { 
    id: 7, 
    name: 'David Chen', 
    email: 'david.c@example.com',
    platform: 'SportsAI',
    plan: 'Free',
    status: 'Active',
    joined: '2025-02-10',
    lastActive: '2025-04-12',
    location: 'Singapore',
    activity: 'Checking NBA stats',
    device: 'Android Tablet',
    spentTotal: '$0.00'
  },
  { 
    id: 8, 
    name: 'Maria Garcia', 
    email: 'maria.g@example.com',
    platform: 'JET AI',
    plan: 'Pro',
    status: 'Active',
    joined: '2025-01-30',
    lastActive: '2025-04-15',
    location: 'Madrid, Spain',
    activity: 'Searching for beach destinations',
    device: 'MacBook Air',
    spentTotal: '$249.95'
  }
];

const ClientDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const filteredClients = clientData.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = selectedPlatform === 'all' || client.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });
  
  return (
    <>
      <Card className="bg-[#0a1328] border-[#4a89dc]/20 mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Client Database</CardTitle>
              <CardDescription className="text-gray-400">
                View and manage user accounts across all platforms
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white flex items-center gap-1">
                    <UserPlus className="h-4 w-4" /> Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Create a new client account in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name">Full Name</label>
                        <Input id="name" placeholder="John Doe" className="bg-[#050b17] border-[#4a89dc]/20" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email">Email</label>
                        <Input id="email" placeholder="john.doe@example.com" className="bg-[#050b17] border-[#4a89dc]/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="platform">Platform</label>
                        <Select>
                          <SelectTrigger className="bg-[#050b17] border-[#4a89dc]/20">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JET AI">JET AI</SelectItem>
                            <SelectItem value="CryptoBot">CryptoBot</SelectItem>
                            <SelectItem value="FitnessAI">FitnessAI</SelectItem>
                            <SelectItem value="SportsAI">SportsAI</SelectItem>
                            <SelectItem value="ShopAI">ShopAI</SelectItem>
                            <SelectItem value="EduAI">EduAI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="plan">Membership Plan</label>
                        <Select>
                          <SelectTrigger className="bg-[#050b17] border-[#4a89dc]/20">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Pro">Pro</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location">Location</label>
                      <Input id="location" placeholder="New York, USA" className="bg-[#050b17] border-[#4a89dc]/20" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Create Account</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search clients..." 
                className="pl-10 bg-[#050b17] border-[#4a89dc]/20"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="min-w-[150px] bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="JET AI">JET AI</SelectItem>
                    <SelectItem value="CryptoBot">CryptoBot</SelectItem>
                    <SelectItem value="FitnessAI">FitnessAI</SelectItem>
                    <SelectItem value="SportsAI">SportsAI</SelectItem>
                    <SelectItem value="ShopAI">ShopAI</SelectItem>
                    <SelectItem value="EduAI">EduAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="min-w-[120px] bg-[#050b17] border-[#4a89dc]/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border border-[#4a89dc]/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#0a1328]">
                <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableHead className="text-[#4a89dc]">Client</TableHead>
                  <TableHead className="text-[#4a89dc]">Platform</TableHead>
                  <TableHead className="text-[#4a89dc]">Membership</TableHead>
                  <TableHead className="text-[#4a89dc]">Last Active</TableHead>
                  <TableHead className="text-[#4a89dc]">Status</TableHead>
                  <TableHead className="text-[#4a89dc]">Total Spent</TableHead>
                  <TableHead className="text-[#4a89dc] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow className="hover:bg-[#0f1e36]">
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      No clients found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#4a89dc]/20 flex items-center justify-center text-[#4a89dc]">
                            <UserCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{client.name}</div>
                            <div className="text-xs text-gray-400">{client.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{client.platform}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            client.plan === 'Business' ? 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30' :
                            client.plan === 'Pro' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30' :
                            client.plan === 'Enterprise' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' :
                            'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                          }
                        >
                          {client.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{client.lastActive}</span>
                          <span className="text-xs text-gray-400">{client.device}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            client.status === 'Active' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' :
                            'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                          }
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.spentTotal}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Client Profile: {client.name}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Detailed information and activity for this client.
                                </DialogDescription>
                              </DialogHeader>
                              <Tabs defaultValue="profile" className="mt-4">
                                <TabsList className="bg-[#050b17] border-[#4a89dc]/20 border">
                                  <TabsTrigger value="profile">Profile</TabsTrigger>
                                  <TabsTrigger value="activity">Activity</TabsTrigger>
                                  <TabsTrigger value="billing">Billing</TabsTrigger>
                                </TabsList>
                                <TabsContent value="profile" className="mt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                      <div className="space-y-3">
                                        <div>
                                          <div className="text-sm text-gray-400">Full Name</div>
                                          <div>{client.name}</div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-400">Email</div>
                                          <div>{client.email}</div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-400">Location</div>
                                          <div>{client.location}</div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-400">Joined Date</div>
                                          <div>{client.joined}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold mb-4">Usage Information</h3>
                                      <div className="space-y-3">
                                        <div>
                                          <div className="text-sm text-gray-400">Primary Platform</div>
                                          <div>{client.platform}</div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-400">Membership Plan</div>
                                          <div>{client.plan}</div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-400">Last Activity</div>
                                          <div>{client.activity}</div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-400">Last Device</div>
                                          <div>{client.device}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="activity" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="p-3 rounded-md bg-[#050b17] border border-[#4a89dc]/20">
                                      <div className="flex justify-between mb-1">
                                        <div className="font-medium">Travel research for Europe trip</div>
                                        <div className="text-xs text-gray-400">Today at 10:45 AM</div>
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        Browsed destinations in France, Italy and Spain. Viewed 12 hotels.
                                      </div>
                                    </div>
                                    <div className="p-3 rounded-md bg-[#050b17] border border-[#4a89dc]/20">
                                      <div className="flex justify-between mb-1">
                                        <div className="font-medium">Flight booking</div>
                                        <div className="text-xs text-gray-400">Yesterday at 3:22 PM</div>
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        Booked round-trip flight from JFK to CDG for June 12-26, 2025.
                                      </div>
                                    </div>
                                    <div className="p-3 rounded-md bg-[#050b17] border border-[#4a89dc]/20">
                                      <div className="flex justify-between mb-1">
                                        <div className="font-medium">Hotel search</div>
                                        <div className="text-xs text-gray-400">April 12, 2025</div>
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        Compared 8 hotels in Paris, France near Eiffel Tower.
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="billing" className="mt-4">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="text-lg font-semibold mb-4">Subscription</h3>
                                      <div className="p-4 rounded-md bg-[#050b17] border border-[#4a89dc]/20">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <div className="font-medium">{client.platform} {client.plan}</div>
                                            <div className="text-sm text-gray-400">
                                              {client.plan === 'Pro' ? '$19.99/month' : 
                                               client.plan === 'Business' ? '$199.99/year' : 
                                               client.plan === 'Free' ? 'Free tier' : 'Custom pricing'}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-2">
                                              Next billing date: May 10, 2025
                                            </div>
                                          </div>
                                          <Button variant="outline" size="sm">Change Plan</Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                                      <Table>
                                        <TableHeader className="bg-[#050b17]">
                                          <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                                            <TableHead className="text-[#4a89dc]">Date</TableHead>
                                            <TableHead className="text-[#4a89dc]">Amount</TableHead>
                                            <TableHead className="text-[#4a89dc]">Status</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                                            <TableCell>Apr 10, 2025</TableCell>
                                            <TableCell>$19.99</TableCell>
                                            <TableCell>
                                              <Badge className="bg-green-500/20 text-green-500">Paid</Badge>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                                            <TableCell>Mar 10, 2025</TableCell>
                                            <TableCell>$19.99</TableCell>
                                            <TableCell>
                                              <Badge className="bg-green-500/20 text-green-500">Paid</Badge>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                                            <TableCell>Feb 10, 2025</TableCell>
                                            <TableCell>$19.99</TableCell>
                                            <TableCell>
                                              <Badge className="bg-green-500/20 text-green-500">Paid</Badge>
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredClients.length} out of {clientData.length} clients
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ClientDatabase;