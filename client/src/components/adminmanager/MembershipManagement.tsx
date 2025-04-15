import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Star, 
  Users, 
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Sparkles
} from 'lucide-react';

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

const MembershipManagement: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<string[]>([]);
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  
  // Toggle plan expansion
  const togglePlanExpansion = (planId: string) => {
    if (expandedPlans.includes(planId)) {
      setExpandedPlans(expandedPlans.filter(id => id !== planId));
    } else {
      setExpandedPlans([...expandedPlans, planId]);
    }
  };
  
  const selectedPlanData = membershipPlans.find(plan => plan.id === selectedPlan);
  
  // Calculate total users and revenue percentage
  const totalUsers = membershipPlans.reduce((sum, plan) => sum + plan.userCount, 0);
  
  const calculateRevenuePercentage = (plan: typeof membershipPlans[0]) => {
    if (plan.price === 0) return 0;
    
    const planRevenue = plan.price * plan.userCount;
    const totalRevenue = membershipPlans.reduce((sum, p) => sum + (p.price * p.userCount), 0);
    
    return (planRevenue / totalRevenue) * 100;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Membership Plan Management</h2>
        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white" onClick={() => setShowNewPlanDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Plan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Active Plans</p>
                <p className="text-2xl font-bold text-white">{membershipPlans.filter(p => p.active).length}</p>
              </div>
              <div className="h-10 w-10 bg-[#4a89dc]/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-[#4a89dc]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Popular Plan</p>
                <p className="text-2xl font-bold text-white">Pro Plan</p>
              </div>
              <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-[#0a1328] border-[#4a89dc]/20">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription className="text-gray-400">
            Manage subscription plans and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#4a89dc]/20">
                  <th className="text-left py-3 text-[#4a89dc]">Plan</th>
                  <th className="text-left py-3 text-[#4a89dc]">Price</th>
                  <th className="text-left py-3 text-[#4a89dc]">Members</th>
                  <th className="text-left py-3 text-[#4a89dc]">Status</th>
                  <th className="text-right py-3 text-[#4a89dc]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {membershipPlans.map((plan) => (
                  <React.Fragment key={plan.id}>
                    <tr className={`border-b border-[#4a89dc]/20 hover:bg-[#0f1e36] ${expandedPlans.includes(plan.id) ? 'bg-[#0f1e36]' : ''}`}>
                      <td className="py-3">
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
                      </td>
                      <td className="py-3">
                        {plan.price === 0 ? (
                          <span>Free</span>
                        ) : (
                          <span>${plan.price.toFixed(2)} / {plan.interval}</span>
                        )}
                      </td>
                      <td className="py-3">{plan.userCount.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${plan.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                          {plan.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </td>
                    </tr>
                    
                    {expandedPlans.includes(plan.id) && (
                      <tr className="bg-[#0f1e36] border-b border-[#4a89dc]/20">
                        <td colSpan={5} className="py-3 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Plan Features</h4>
                              <ul className="space-y-1">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-start text-sm">
                                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Plan Statistics</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#050b17] p-3 rounded-md">
                                  <div className="text-sm text-gray-400">Members</div>
                                  <div className="text-lg font-bold">{plan.userCount.toLocaleString()}</div>
                                  <div className="text-xs text-gray-400">{((plan.userCount / totalUsers) * 100).toFixed(1)}% of total</div>
                                </div>
                                
                                <div className="bg-[#050b17] p-3 rounded-md">
                                  <div className="text-sm text-gray-400">Revenue Share</div>
                                  <div className="text-lg font-bold">{calculateRevenuePercentage(plan).toFixed(1)}%</div>
                                  <div className="text-xs text-gray-400">
                                    {plan.price > 0 ? `$${(plan.price * plan.userCount).toLocaleString()} monthly` : '-'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {selectedPlan && selectedPlanData && (
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Edit {selectedPlanData.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  Update plan details and features
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedPlan(null)}>
                <X className="h-4 w-4 mr-2" /> Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="planName">Plan Name</Label>
                  <Input 
                    id="planName" 
                    className="bg-[#050b17] border-[#4a89dc]/20" 
                    defaultValue={selectedPlanData.name} 
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="planId">Plan ID</Label>
                  <Input 
                    id="planId" 
                    className="bg-[#050b17] border-[#4a89dc]/20" 
                    defaultValue={selectedPlanData.id}
                    disabled 
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="planPrice">Price</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="planPrice" 
                      type="number" 
                      step="0.01" 
                      className="bg-[#050b17] border-[#4a89dc]/20" 
                      defaultValue={selectedPlanData.price} 
                    />
                    
                    <Select defaultValue={selectedPlanData.interval}>
                      <SelectTrigger className="bg-[#050b17] border-[#4a89dc]/20 w-32">
                        <SelectValue placeholder="Billing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Plan Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="planActive" 
                      className="rounded bg-[#0a1328]" 
                      defaultChecked={selectedPlanData.active} 
                    />
                    <Label htmlFor="planActive" className="font-normal cursor-pointer">Active</Label>
                    
                    <div className="ml-6 flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="planRecommended" 
                        className="rounded bg-[#0a1328]" 
                        defaultChecked={selectedPlanData.recommended} 
                      />
                      <Label htmlFor="planRecommended" className="font-normal cursor-pointer">Recommended</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="planFeatures">Features (one per line)</Label>
                <textarea
                  id="planFeatures"
                  className="w-full min-h-32 p-2 rounded-md bg-[#050b17] border border-[#4a89dc]/20 focus:border-[#4a89dc] focus:outline-none"
                  defaultValue={selectedPlanData.features.join('\n')}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="accessLevel" className="bg-[#050b17] border-[#4a89dc]/20">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="standard">Pro</SelectItem>
                      <SelectItem value="premium">Elite</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="trialDays">Trial Period (days)</Label>
                  <Input 
                    id="trialDays" 
                    type="number" 
                    className="bg-[#050b17] border-[#4a89dc]/20" 
                    defaultValue="14" 
                  />
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
      
      {/* New Plan Dialog */}
      <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
        <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Membership Plan</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure the details for a new membership plan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPlanName">Plan Name</Label>
                <Input id="newPlanName" className="bg-[#050b17] border-[#4a89dc]/20" placeholder="Premium Plan" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPlanId">Plan ID</Label>
                <Input id="newPlanId" className="bg-[#050b17] border-[#4a89dc]/20" placeholder="premium" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPlanPrice">Price</Label>
                <div className="flex gap-2">
                  <Input id="newPlanPrice" type="number" step="0.01" className="bg-[#050b17] border-[#4a89dc]/20" placeholder="29.99" />
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
              
              <div className="space-y-2">
                <Label htmlFor="newPlanAccess">Access Level</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="newPlanAccess" className="bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="standard">Pro</SelectItem>
                    <SelectItem value="premium">Elite</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPlanFeatures">Features (one per line)</Label>
              <textarea 
                id="newPlanFeatures" 
                className="w-full min-h-32 p-2 rounded-md bg-[#050b17] border border-[#4a89dc]/20 focus:border-[#4a89dc] focus:outline-none" 
                placeholder="Enter features (one per line)"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="newPlanActive" className="rounded bg-[#0a1328]" defaultChecked />
              <Label htmlFor="newPlanActive" className="font-normal cursor-pointer">Active</Label>
              
              <div className="ml-6 flex items-center space-x-2">
                <input type="checkbox" id="newPlanRecommended" className="rounded bg-[#0a1328]" />
                <Label htmlFor="newPlanRecommended" className="font-normal cursor-pointer">Recommended</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowNewPlanDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
              <Sparkles className="h-4 w-4 mr-2" /> Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembershipManagement;