import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, CreditCard, Users, DollarSign, Star, Sparkles, PieChart, ChevronUp, ChevronDown, Edit, Trash2, CheckCircle, Clock, Upload, TrendingUp, Lock, QrCode, UserCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Mock data for membership plans
const membershipPlans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    interval: 'month',
    features: [
      'Basic Travel Chat',
      'City Information',
      'Limited Daily Queries (10)',
      'Basic Itinerary Planning'
    ],
    recommended: false,
    active: true,
    userCount: 3750,
    color: 'bg-gray-500'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 19.99,
    interval: 'month',
    features: [
      'Advanced AI Travel Assistant',
      'Unlimited Travel Queries',
      'Personalized Recommendations',
      'Flight & Hotel Search',
      'Offline Trip Access',
      'Travel Insurance Discounts',
      '24/7 Customer Support'
    ],
    recommended: true,
    active: true,
    userCount: 2450,
    color: 'bg-[#4a89dc]'
  },
  {
    id: 'business',
    name: 'Business Plan',
    price: 199.99,
    interval: 'month',
    features: [
      'Everything in Pro Plan',
      'Travel Management for Teams',
      'Expense Tracking & Reports',
      'Priority Support',
      'Custom Travel Policies',
      'API Access',
      'Trip Approval Workflows',
      'Dedicated Account Manager'
    ],
    recommended: false,
    active: true,
    userCount: 380,
    color: 'bg-purple-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999.99,
    interval: 'month',
    features: [
      'Everything in Business Plan',
      'Custom AI Training',
      'White-Label Solution',
      'Advanced Analytics & Reporting',
      'Custom Integrations',
      'SLA Guarantees',
      'On-Premise Deployment Options',
      'Enterprise SSO'
    ],
    recommended: false,
    active: true,
    userCount: 12,
    color: 'bg-yellow-600'
  }
];

// Mock data for subscription analytics
const subscriptionAnalytics = {
  totalRevenue: '$54,824.50',
  monthlyRecurring: '$48,237.25',
  averageLifetime: '$842.30',
  conversionRate: '8.4%',
  retentionRate: '94.2%',
  monthlyGrowth: '+12.8%',
  mostPopularPlan: 'Pro Plan',
  averageUpgradeTime: '45 days',
  cancelRate: '2.3%',
  activeCoupons: 3
};

// Mock data for access code users
const accessCodeUsers = [
  {
    id: 1,
    name: 'Robert Williams',
    email: 'robert.w@example.com',
    accessCode: 'JETAI-ADM-01',
    role: 'Super Admin',
    lastLogin: '2025-04-15 08:45 AM',
    status: 'active',
    biometric: true
  },
  {
    id: 2,
    name: 'Jennifer Chen',
    email: 'jennifer.c@example.com',
    accessCode: 'JETAI-ADM-02',
    role: 'Admin',
    lastLogin: '2025-04-14 03:22 PM',
    status: 'active',
    biometric: true
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    accessCode: 'JETAI-FIN-01',
    role: 'Finance Manager',
    lastLogin: '2025-04-10 11:15 AM',
    status: 'inactive',
    biometric: false
  },
  {
    id: 4,
    name: 'Sophia Garcia',
    email: 'sophia.g@example.com',
    accessCode: 'JETAI-SUP-01',
    role: 'Support Lead',
    lastLogin: '2025-04-15 09:32 AM',
    status: 'active',
    biometric: true
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david.k@example.com',
    accessCode: 'JETAI-DEV-01',
    role: 'Developer',
    lastLogin: '2025-04-14 05:18 PM',
    status: 'active',
    biometric: false
  }
];

const MembershipPanel: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAccessUser, setSelectedAccessUser] = useState<number | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<string[]>([]);
  
  // Toggle plan expansion
  const togglePlanExpansion = (planId: string) => {
    if (expandedPlans.includes(planId)) {
      setExpandedPlans(expandedPlans.filter(id => id !== planId));
    } else {
      setExpandedPlans([...expandedPlans, planId]);
    }
  };
  
  // Calculate total users
  const totalUsers = membershipPlans.reduce((sum, plan) => sum + plan.userCount, 0);
  
  // Calculate revenue percentage for each plan
  const calculateRevenuePercentage = (plan: typeof membershipPlans[0]) => {
    if (plan.price === 0) return 0;
    
    const planRevenue = plan.price * plan.userCount;
    const totalRevenue = membershipPlans.reduce((sum, p) => sum + (p.price * p.userCount), 0);
    
    return (planRevenue / totalRevenue) * 100;
  };
  
  const selectedPlanData = membershipPlans.find(plan => plan.id === selectedPlan);
  const selectedAccessUserData = accessCodeUsers.find(user => user.id === selectedAccessUser);
  
  return (
    <Tabs defaultValue="plans" className="space-y-4">
      <TabsList className="bg-[#050b17]">
        <TabsTrigger value="plans" className="flex items-center gap-2">
          <Star className="h-4 w-4" /> Membership Plans
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" /> Subscription Analytics
        </TabsTrigger>
        <TabsTrigger value="access" className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Access Codes
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="plans" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Membership Plans</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
              <DialogHeader>
                <DialogTitle>Create New Membership Plan</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Configure the details for a new membership plan
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="planId" className="text-right font-medium">
                    Plan ID
                  </label>
                  <Input id="planId" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="unique-plan-id" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="planName" className="text-right font-medium">
                    Plan Name
                  </label>
                  <Input id="planName" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="Premium Plan" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="planPrice" className="text-right font-medium">
                    Price
                  </label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input id="planPrice" type="number" step="0.01" className="bg-[#050b17] border-[#4a89dc]/20" placeholder="29.99" />
                    <Select defaultValue="month">
                      <SelectTrigger className="w-[100px] bg-[#050b17] border-[#4a89dc]/20">
                        <SelectValue placeholder="Interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="planFeatures" className="text-right font-medium pt-2">
                    Features
                  </label>
                  <textarea 
                    id="planFeatures" 
                    className="col-span-3 bg-[#050b17] border-[#4a89dc]/20 rounded-md p-2 h-32" 
                    placeholder="Enter features (one per line)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">
                    Recommended
                  </label>
                  <div className="col-span-3 flex items-center">
                    <input type="checkbox" id="recommended" className="mr-2" />
                    <label htmlFor="recommended">Mark as recommended plan</label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Create Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</p>
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
                  <p className="text-sm text-gray-400">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">{subscriptionAnalytics.monthlyRecurring}</p>
                </div>
                <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Popular Plan</p>
                  <p className="text-2xl font-bold text-white">{subscriptionAnalytics.mostPopularPlan}</p>
                </div>
                <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Retention Rate</p>
                  <p className="text-2xl font-bold text-white">{subscriptionAnalytics.retentionRate}</p>
                </div>
                <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableHead className="text-[#4a89dc]">Plan</TableHead>
                  <TableHead className="text-[#4a89dc]">Price</TableHead>
                  <TableHead className="text-[#4a89dc]">Users</TableHead>
                  <TableHead className="text-[#4a89dc]">Revenue</TableHead>
                  <TableHead className="text-[#4a89dc]">Status</TableHead>
                  <TableHead className="text-[#4a89dc] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membershipPlans.map((plan) => (
                  <React.Fragment key={plan.id}>
                    <TableRow className={`hover:bg-[#0f1e36] border-b-[#4a89dc]/20 ${expandedPlans.includes(plan.id) ? 'bg-[#0f1e36]' : ''}`}>
                      <TableCell>
                        <div 
                          className="flex items-center cursor-pointer" 
                          onClick={() => togglePlanExpansion(plan.id)}
                        >
                          {expandedPlans.includes(plan.id) ? (
                            <ChevronUp className="h-4 w-4 mr-2 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium flex items-center">
                              <div className={`w-2 h-2 rounded-full ${plan.color} mr-2`}></div>
                              {plan.name}
                              {plan.recommended && (
                                <span className="ml-2 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-sm">
                                  Recommended
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.price === 0 ? (
                          <span>Free</span>
                        ) : (
                          <span>${plan.price.toFixed(2)} / {plan.interval}</span>
                        )}
                      </TableCell>
                      <TableCell>{plan.userCount.toLocaleString()}</TableCell>
                      <TableCell>
                        {plan.price === 0 ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <div>
                            <div>${(plan.price * plan.userCount).toLocaleString()}</div>
                            <div className="text-xs text-gray-400">{calculateRevenuePercentage(plan).toFixed(1)}% of total</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${plan.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                          {plan.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {expandedPlans.includes(plan.id) && (
                      <TableRow className="bg-[#0f1e36] border-b-[#4a89dc]/20">
                        <TableCell colSpan={6}>
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-3">Plan Features</h4>
                              <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-start">
                                    <div className="mt-1 mr-2 text-green-500">✓</div>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">User Demographics</h4>
                              <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 h-48 flex items-center justify-center">
                                <p className="text-gray-400">User demographics chart would be rendered here</p>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                                  <div className="text-gray-400 text-sm">Conversion Rate</div>
                                  <div className="text-xl font-bold text-white mt-1">12.8%</div>
                                </div>
                                <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                                  <div className="text-gray-400 text-sm">Retention Rate</div>
                                  <div className="text-xl font-bold text-white mt-1">92.5%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {selectedPlan && selectedPlanData && (
          <Dialog open={Boolean(selectedPlan)} onOpenChange={(open) => !open && setSelectedPlan(null)}>
            <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit Membership Plan: {selectedPlanData.name}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Make changes to the membership plan configuration
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-planName" className="text-right font-medium">
                    Plan Name
                  </label>
                  <Input id="edit-planName" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" defaultValue={selectedPlanData.name} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-planPrice" className="text-right font-medium">
                    Price
                  </label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input id="edit-planPrice" type="number" step="0.01" className="bg-[#050b17] border-[#4a89dc]/20" defaultValue={selectedPlanData.price} />
                    <Select defaultValue={selectedPlanData.interval}>
                      <SelectTrigger className="w-[100px] bg-[#050b17] border-[#4a89dc]/20">
                        <SelectValue placeholder="Interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="edit-planFeatures" className="text-right font-medium pt-2">
                    Features
                  </label>
                  <textarea 
                    id="edit-planFeatures" 
                    className="col-span-3 bg-[#050b17] border-[#4a89dc]/20 rounded-md p-2 h-32" 
                    defaultValue={selectedPlanData.features.join('\n')}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">
                    Status
                  </label>
                  <div className="col-span-3 flex items-center">
                    <input type="checkbox" id="edit-active" className="mr-2" defaultChecked={selectedPlanData.active} />
                    <label htmlFor="edit-active">Active</label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">
                    Recommended
                  </label>
                  <div className="col-span-3 flex items-center">
                    <input type="checkbox" id="edit-recommended" className="mr-2" defaultChecked={selectedPlanData.recommended} />
                    <label htmlFor="edit-recommended">Mark as recommended plan</label>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedPlan(null)}>Cancel</Button>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Subscription Analytics</h2>
          <div className="flex gap-2">
            <Select defaultValue="last30days">
              <SelectTrigger className="w-[180px] bg-[#050b17] border-[#4a89dc]/20">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last90days">Last 90 Days</SelectItem>
                <SelectItem value="lastYear">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-[#4a89dc]" />
                Monthly Recurring Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{subscriptionAnalytics.monthlyRecurring}</div>
              <div className="flex items-center text-sm text-green-500 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{subscriptionAnalytics.monthlyGrowth} from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#4a89dc]" />
                User Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{subscriptionAnalytics.conversionRate}</div>
              <div className="flex items-center text-sm text-green-500 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+1.2% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-[#4a89dc]" />
                Retention Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{subscriptionAnalytics.retentionRate}</div>
              <div className="flex items-center text-sm text-green-500 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+0.8% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#4a89dc]" />
                Avg. Customer Lifetime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{subscriptionAnalytics.averageLifetime}</div>
              <div className="flex items-center text-sm text-green-500 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+$52.40 from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Subscription Growth</CardTitle>
              <CardDescription className="text-gray-400">
                Monthly subscription trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                <p className="text-gray-400">Growth chart would be rendered here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Breakdown of active subscriptions by plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex flex-col justify-center">
                <div className="space-y-4">
                  {membershipPlans.map((plan) => (
                    <div key={plan.id}>
                      <div className="flex justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${plan.color}`}></div>
                          {plan.name}
                        </span>
                        <span className="text-gray-400">{plan.userCount} users</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${plan.color} rounded-full`} 
                          style={{ width: `${(plan.userCount / totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 text-right mt-1">
                        {((plan.userCount / totalUsers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Cancellation Reasons</CardTitle>
              <CardDescription className="text-gray-400">
                Primary reasons for subscription cancellations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                <p className="text-gray-400">Cancellation chart would be rendered here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Upgrade Path</CardTitle>
              <CardDescription className="text-gray-400">
                Common plan upgrade patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                <p className="text-gray-400">Upgrade flow chart would be rendered here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Subscription distribution by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                <p className="text-gray-400">Map visualization would be rendered here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="access" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Access Code Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <PlusCircle className="h-4 w-4 mr-2" /> Generate Access Code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
              <DialogHeader>
                <DialogTitle>Generate New Access Code</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create secure access code and assign permissions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="userName" className="text-right font-medium">
                    User Name
                  </label>
                  <Input id="userName" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="Full Name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="userEmail" className="text-right font-medium">
                    Email
                  </label>
                  <Input id="userEmail" type="email" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="email@example.com" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="userRole" className="text-right font-medium">
                    Role
                  </label>
                  <Select>
                    <SelectTrigger id="userRole" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="finance">Finance Manager</SelectItem>
                      <SelectItem value="support">Support Lead</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">
                    Biometric Security
                  </label>
                  <div className="col-span-3 flex items-center">
                    <input type="checkbox" id="biometric" className="mr-2" defaultChecked />
                    <label htmlFor="biometric">Enable biometric verification</label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">
                    Expiration
                  </label>
                  <div className="col-span-3 flex items-center gap-2">
                    <input type="checkbox" id="hasExpiration" className="mr-2" />
                    <label htmlFor="hasExpiration">Set expiration date</label>
                    <Input type="date" className="bg-[#050b17] border-[#4a89dc]/20" disabled />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="accessNotes" className="text-right font-medium pt-2">
                    Notes
                  </label>
                  <textarea 
                    id="accessNotes" 
                    className="col-span-3 bg-[#050b17] border-[#4a89dc]/20 rounded-md p-2 h-20" 
                    placeholder="Access notes (optional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Generate Access Code</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            <Card className="bg-[#0a1328] border-[#4a89dc]/20 h-full">
              <CardHeader>
                <CardTitle>Access Code Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage users with special system access privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                      <TableHead className="text-[#4a89dc]">Name</TableHead>
                      <TableHead className="text-[#4a89dc]">Role</TableHead>
                      <TableHead className="text-[#4a89dc]">Access Code</TableHead>
                      <TableHead className="text-[#4a89dc]">Status</TableHead>
                      <TableHead className="text-[#4a89dc]">Biometric</TableHead>
                      <TableHead className="text-[#4a89dc] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessCodeUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'Super Admin' ? 'bg-purple-500/20 text-purple-500' : 
                            user.role === 'Admin' ? 'bg-blue-500/20 text-blue-500' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{user.accessCode}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.biometric ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 p-0 px-2"
                              onClick={() => setSelectedAccessUser(user.id)}
                            >
                              <QrCode className="h-4 w-4 mr-1" />
                              <span>QR</span>
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
          </div>
          
          <div className="col-span-1">
            <Card className="bg-[#0a1328] border-[#4a89dc]/20 h-full">
              <CardHeader>
                <CardTitle>Biometric Security</CardTitle>
                <CardDescription className="text-gray-400">
                  Enhanced security for admin access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col items-center">
                <div className="p-4 bg-white rounded-md w-48 h-48 flex items-center justify-center">
                  <QRCodeSVG
                    value="JETAI-BIOMETRIC-VERIFICATION-CODE-123456789"
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="font-medium mb-1">Scan to Setup</h4>
                  <p className="text-sm text-gray-400">
                    Use the JET AI Admin app to scan this QR code and configure biometric verification
                  </p>
                </div>
                
                <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-[#4a89dc]/20 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-[#4a89dc]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Face ID Verification</h4>
                      <p className="text-xs text-gray-400">For admin and super admin users</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Enrolled Users:</span>
                    <span>3 / 5</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white" size="sm">
                  <Upload className="h-4 w-4 mr-2" /> Update Biometric DB
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {selectedAccessUser && selectedAccessUserData && (
          <Dialog open={Boolean(selectedAccessUser)} onOpenChange={(open) => !open && setSelectedAccessUser(null)}>
            <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
              <DialogHeader>
                <DialogTitle>Access QR Code</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Secure access QR code for {selectedAccessUserData.name}
                </DialogDescription>
              </DialogHeader>
              <div className="pt-4 flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-md">
                  <QRCodeSVG
                    value={`JETAI-ACCESS-${selectedAccessUserData.accessCode}-${Date.now()}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <div className="text-center">
                  <div className="font-medium">{selectedAccessUserData.accessCode}</div>
                  <div className="text-sm text-gray-400">Valid for 5 minutes</div>
                </div>
                
                <div className="bg-yellow-500/10 text-yellow-500 p-3 rounded-md w-full text-sm">
                  <Sparkles className="h-4 w-4 mb-1" />
                  <p>
                    This QR code provides Super Admin access. Treat it with extreme confidentiality
                    and ensure it's only shared through secure channels.
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedAccessUser(null)}>Close</Button>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Download QR</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MembershipPanel;