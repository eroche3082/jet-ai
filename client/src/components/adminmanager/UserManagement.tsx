import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Search, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Filter, 
  MessageSquare, 
  Mail, 
  Save, 
  Shield, 
  CheckCircle, 
  X, 
  AlertCircle
} from 'lucide-react';

// Mock data for users
const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    membershipTier: 'Pro',
    joinDate: '2025-01-15',
    lastActive: '2025-04-14',
    status: 'active',
    location: 'New York, USA',
    journeysPlanned: 8,
    ticketsOpen: 0
  },
  {
    id: 2,
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    membershipTier: 'Free',
    joinDate: '2025-02-03',
    lastActive: '2025-04-12',
    status: 'active',
    location: 'London, UK',
    journeysPlanned: 2,
    ticketsOpen: 1
  },
  {
    id: 3,
    name: 'Michael Wilson',
    email: 'michael.w@example.com',
    membershipTier: 'Business',
    joinDate: '2025-01-08',
    lastActive: '2025-04-15',
    status: 'active',
    location: 'Sydney, Australia',
    journeysPlanned: 15,
    ticketsOpen: 0
  },
  {
    id: 4,
    name: 'Sofia Garcia',
    email: 'sofia.g@example.com',
    membershipTier: 'Pro',
    joinDate: '2025-03-21',
    lastActive: '2025-04-10',
    status: 'active',
    location: 'Madrid, Spain',
    journeysPlanned: 3,
    ticketsOpen: 0
  },
  {
    id: 5,
    name: 'David Chen',
    email: 'david.c@example.com',
    membershipTier: 'Business',
    joinDate: '2025-01-12',
    lastActive: '2025-04-08',
    status: 'inactive',
    location: 'Singapore',
    journeysPlanned: 12,
    ticketsOpen: 2
  },
  {
    id: 6,
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    membershipTier: 'Free',
    joinDate: '2025-03-05',
    lastActive: '2025-03-28',
    status: 'pending',
    location: 'Toronto, Canada',
    journeysPlanned: 1,
    ticketsOpen: 0
  },
  {
    id: 7,
    name: 'James Taylor',
    email: 'james.t@example.com',
    membershipTier: 'Pro',
    joinDate: '2025-02-14',
    lastActive: '2025-04-15',
    status: 'active',
    location: 'Chicago, USA',
    journeysPlanned: 5,
    ticketsOpen: 1
  }
];

// Mock data for support tickets
const supportTickets = [
  {
    id: 'T-1001',
    userId: 2,
    userName: 'Emily Johnson',
    subject: 'Unable to find my saved itinerary',
    status: 'open',
    priority: 'medium',
    createdAt: '2025-04-12 09:32 AM',
    lastUpdated: '2025-04-13 11:45 AM',
    assignedTo: null
  },
  {
    id: 'T-1002',
    userId: 5,
    userName: 'David Chen',
    subject: 'Flight recommendations not showing correctly',
    status: 'open',
    priority: 'high',
    createdAt: '2025-04-10 03:18 PM',
    lastUpdated: '2025-04-14 10:22 AM',
    assignedTo: 'Support Team'
  },
  {
    id: 'T-1003',
    userId: 5,
    userName: 'David Chen',
    subject: 'Issue with payment processing',
    status: 'open',
    priority: 'high',
    createdAt: '2025-04-09 05:47 PM',
    lastUpdated: '2025-04-13 08:20 AM',
    assignedTo: 'Finance Team'
  },
  {
    id: 'T-1004',
    userId: 7,
    userName: 'James Taylor',
    subject: 'App crashes when accessing travel history',
    status: 'open',
    priority: 'medium',
    createdAt: '2025-04-15 07:55 AM',
    lastUpdated: '2025-04-15 07:55 AM',
    assignedTo: null
  },
  {
    id: 'T-1005',
    userId: 3,
    userName: 'Michael Wilson',
    subject: 'Need to cancel my subscription',
    status: 'closed',
    priority: 'low',
    createdAt: '2025-04-05 11:30 AM',
    lastUpdated: '2025-04-07 09:15 AM',
    assignedTo: 'Account Team'
  }
];

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesMembership = membershipFilter === 'all' || user.membershipTier === membershipFilter;
    
    return matchesSearch && matchesStatus && matchesMembership;
  });
  
  const selectedUserData = users.find(user => user.id === selectedUser);
  const selectedTicketData = supportTickets.find(ticket => ticket.id === selectedTicket);
  
  // Get counts for different statuses
  const activeUsers = users.filter(user => user.status === 'active').length;
  const pendingUsers = users.filter(user => user.status === 'pending').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  
  // Get open tickets count
  const openTickets = supportTickets.filter(ticket => ticket.status === 'open').length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
          <UserPlus className="h-4 w-4 mr-2" /> Add New User
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="h-10 w-10 bg-[#4a89dc]/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-[#4a89dc]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-white">{activeUsers}</p>
              </div>
              <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Pending Approval</p>
                <p className="text-2xl font-bold text-white">{pendingUsers}</p>
              </div>
              <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Support Tickets</p>
                <p className="text-2xl font-bold text-white">{openTickets}</p>
              </div>
              <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-[#0a1328]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> All Users
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Support Tickets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 bg-[#050b17] border-[#4a89dc]/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] bg-[#050b17] border-[#4a89dc]/20">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                    <SelectTrigger className="w-[130px] bg-[#050b17] border-[#4a89dc]/20">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Membership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#4a89dc]/20">
                      <th className="text-left py-3 text-[#4a89dc]">User</th>
                      <th className="text-left py-3 text-[#4a89dc]">Membership</th>
                      <th className="text-left py-3 text-[#4a89dc]">Status</th>
                      <th className="text-left py-3 text-[#4a89dc]">Location</th>
                      <th className="text-left py-3 text-[#4a89dc]">Joined</th>
                      <th className="text-left py-3 text-[#4a89dc]">Last Active</th>
                      <th className="text-right py-3 text-[#4a89dc]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-[#4a89dc]/20 hover:bg-[#0f1e36]">
                        <td className="py-3">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.membershipTier === 'Pro' ? 'bg-blue-500/20 text-blue-400' : 
                              user.membershipTier === 'Business' ? 'bg-purple-500/20 text-purple-400' : 
                              'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {user.membershipTier}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                            user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3">{user.location}</td>
                        <td className="py-3">{user.joinDate}</td>
                        <td className="py-3">{user.lastActive}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user.id)}
                            >
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {selectedUser && selectedUserData && (
            <Card className="bg-[#0a1328] border-[#4a89dc]/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedUserData.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      User details and account management
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                    <X className="h-4 w-4 mr-2" /> Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 space-y-4">
                      <div className="aspect-square bg-[#0a1328] rounded-full flex items-center justify-center max-w-32 mx-auto">
                        <div className="text-3xl font-bold text-[#4a89dc]">
                          {selectedUserData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="font-bold text-lg">{selectedUserData.name}</h3>
                        <p className="text-gray-400">{selectedUserData.location}</p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            selectedUserData.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                            selectedUserData.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {selectedUserData.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-4 border-t border-[#4a89dc]/20">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span>{selectedUserData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Member Since:</span>
                          <span>{selectedUserData.joinDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Active:</span>
                          <span>{selectedUserData.lastActive}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Membership:</span>
                          <span>{selectedUserData.membershipTier}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex gap-2 justify-center">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Mail className="h-4 w-4" /> Email
                        </Button>
                        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white gap-1" size="sm">
                          <MessageSquare className="h-4 w-4" /> Support
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="text-gray-400 text-sm">Membership</div>
                        <div className="text-xl font-bold mt-1">{selectedUserData.membershipTier}</div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">Change Plan</Button>
                        </div>
                      </div>
                      
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="text-gray-400 text-sm">Account Status</div>
                        <div className="text-xl font-bold mt-1 capitalize">
                          {selectedUserData.status}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          {selectedUserData.status === 'pending' ? (
                            <>
                              <Button variant="outline" size="sm" className="text-green-500">Approve</Button>
                              <Button variant="outline" size="sm" className="text-red-500">Reject</Button>
                            </>
                          ) : selectedUserData.status === 'active' ? (
                            <Button variant="outline" size="sm" className="text-red-500">Deactivate</Button>
                          ) : (
                            <Button variant="outline" size="sm" className="text-green-500">Activate</Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">User Activity</h3>
                      
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Journeys Planned</div>
                            <div className="text-xl font-bold mt-1">{selectedUserData.journeysPlanned}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Support Tickets</div>
                            <div className="text-xl font-bold mt-1">{selectedUserData.ticketsOpen}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Last Login</div>
                            <div className="text-xl font-bold mt-1">{selectedUserData.lastActive.split(' ')[0]}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                      <h3 className="font-medium mb-3">Admin Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start">
                          <Shield className="h-4 w-4 mr-2" /> Reset Password
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Mail className="h-4 w-4 mr-2" /> Send Welcome Email
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-500" /> Verify Email
                        </Button>
                        <Button variant="outline" className="justify-start text-red-500">
                          <UserX className="h-4 w-4 mr-2" /> Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="support" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription className="text-gray-400">
                Manage user support requests and inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#4a89dc]/20">
                      <th className="text-left py-3 text-[#4a89dc]">Ticket ID</th>
                      <th className="text-left py-3 text-[#4a89dc]">User</th>
                      <th className="text-left py-3 text-[#4a89dc]">Subject</th>
                      <th className="text-left py-3 text-[#4a89dc]">Status</th>
                      <th className="text-left py-3 text-[#4a89dc]">Priority</th>
                      <th className="text-left py-3 text-[#4a89dc]">Created</th>
                      <th className="text-right py-3 text-[#4a89dc]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-[#4a89dc]/20 hover:bg-[#0f1e36]">
                        <td className="py-3 font-mono">{ticket.id}</td>
                        <td className="py-3">{ticket.userName}</td>
                        <td className="py-3">{ticket.subject}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.priority === 'high' ? 'bg-red-500/20 text-red-500' : 
                            ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-3">{ticket.createdAt}</td>
                        <td className="py-3 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {selectedTicket && selectedTicketData && (
            <Card className="bg-[#0a1328] border-[#4a89dc]/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Ticket {selectedTicketData.id}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {selectedTicketData.subject}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedTicketData.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' : 
                      'bg-green-500/20 text-green-500'
                    }`}>
                      {selectedTicketData.status}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
                      <X className="h-4 w-4 mr-2" /> Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>From</Label>
                      <div className="bg-[#050b17] p-3 rounded-md mt-1 border border-[#4a89dc]/20">
                        <div className="font-medium">{selectedTicketData.userName}</div>
                        <div className="text-sm text-gray-400">User ID: {selectedTicketData.userId}</div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Priority</Label>
                      <Select defaultValue={selectedTicketData.priority}>
                        <SelectTrigger className="mt-1 bg-[#050b17] border-[#4a89dc]/20">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Status</Label>
                      <Select defaultValue={selectedTicketData.status}>
                        <SelectTrigger className="mt-1 bg-[#050b17] border-[#4a89dc]/20">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Created</Label>
                      <div className="bg-[#050b17] p-3 rounded-md mt-1 border border-[#4a89dc]/20">
                        {selectedTicketData.createdAt}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Last Updated</Label>
                      <div className="bg-[#050b17] p-3 rounded-md mt-1 border border-[#4a89dc]/20">
                        {selectedTicketData.lastUpdated}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Assigned To</Label>
                      <Select defaultValue={selectedTicketData.assignedTo || ""}>
                        <SelectTrigger className="mt-1 bg-[#050b17] border-[#4a89dc]/20">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          <SelectItem value="Support Team">Support Team</SelectItem>
                          <SelectItem value="Technical Team">Technical Team</SelectItem>
                          <SelectItem value="Account Team">Account Team</SelectItem>
                          <SelectItem value="Finance Team">Finance Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Message History</Label>
                    <div className="space-y-4">
                      <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                        <div className="flex justify-between">
                          <div className="font-medium">{selectedTicketData.userName}</div>
                          <div className="text-sm text-gray-400">{selectedTicketData.createdAt}</div>
                        </div>
                        <div className="mt-2">
                          <p>{selectedTicketData.subject}</p>
                          <p className="mt-3 text-gray-400">
                            I'm having trouble with this feature. Can you please help me resolve this issue as soon as possible?
                            This is causing problems with my travel planning.
                          </p>
                        </div>
                      </div>
                      
                      {selectedTicketData.status !== 'closed' && selectedTicketData.assignedTo && (
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="flex justify-between">
                            <div className="font-medium">{selectedTicketData.assignedTo}</div>
                            <div className="text-sm text-gray-400">{selectedTicketData.lastUpdated}</div>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-400">
                              We're looking into this issue and will get back to you as soon as possible. 
                              Could you please provide more details about the problem you're experiencing?
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Reply</Label>
                    <textarea
                      className="w-full min-h-32 p-3 rounded-md bg-[#050b17] border border-[#4a89dc]/20 focus:border-[#4a89dc] focus:outline-none"
                      placeholder="Type your response here..."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  <Save className="h-4 w-4 mr-2" /> Send Reply
                </Button>
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" /> Mark as Resolved
                </Button>
                <Button variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" /> Escalate
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;