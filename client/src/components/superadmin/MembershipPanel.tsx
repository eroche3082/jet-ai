import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, CreditCard } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const membershipPlans = [
  { 
    id: 1, 
    name: 'JET AI Free', 
    price: '$0', 
    type: 'Free',
    features: ['Basic AI Chat', 'Limited Destinations', 'Standard Support'],
    active: true,
    qrCode: 'jetai-free-plan',
    usersCount: 4582
  },
  { 
    id: 2, 
    name: 'JET AI Pro', 
    price: '$19.99/month', 
    type: 'Monthly',
    features: ['Advanced AI Chat', 'All Destinations', 'Priority Support', 'Trip Planning'],
    active: true,
    qrCode: 'jetai-pro-plan',
    usersCount: 1245
  },
  { 
    id: 3, 
    name: 'JET AI Business', 
    price: '$199.99/year', 
    type: 'Annual',
    features: ['Advanced AI Chat', 'All Destinations', 'Premium Support', 'Trip Planning', 'Business Reporting'],
    active: true,
    qrCode: 'jetai-business-plan',
    usersCount: 328
  },
  { 
    id: 4, 
    name: 'JET AI Enterprise', 
    price: 'Custom', 
    type: 'Custom',
    features: ['All Features', 'Dedicated Support', 'Custom Integrations', 'White Labeling'],
    active: false,
    qrCode: 'jetai-enterprise-plan',
    usersCount: 12
  }
];

const MembershipPanel: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Membership Plans</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
            <DialogHeader>
              <DialogTitle>Create New Membership Plan</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new membership plan to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Plan Name
                </Label>
                <Input id="name" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="JET AI Premium" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input id="price" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="$29.99" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Billing Type
                </Label>
                <Input id="type" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="Monthly" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="features" className="text-right">
                  Features
                </Label>
                <textarea 
                  id="features" 
                  className="col-span-3 bg-[#050b17] border-[#4a89dc]/20 rounded-md p-2" 
                  placeholder="One feature per line"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Create Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">Total Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4a89dc]">{membershipPlans.reduce((sum, plan) => sum + plan.usersCount, 0)}</div>
            <p className="text-sm text-gray-400">Across all plans</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4a89dc]">{membershipPlans.filter(plan => plan.active).length}</div>
            <p className="text-sm text-gray-400">Out of {membershipPlans.length} total plans</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">Paid Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4a89dc]">
              {membershipPlans.filter(plan => plan.price !== '$0').reduce((sum, plan) => sum + plan.usersCount, 0)}
            </div>
            <p className="text-sm text-gray-400">{Math.round((membershipPlans.filter(plan => plan.price !== '$0').reduce((sum, plan) => sum + plan.usersCount, 0) / membershipPlans.reduce((sum, plan) => sum + plan.usersCount, 0)) * 100)}% conversion rate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">QR Unlocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4a89dc]">845</div>
            <p className="text-sm text-gray-400">Last 30 days</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-[#0a1328] border-[#4a89dc]/20">
        <CardHeader>
          <CardTitle>All Membership Plans</CardTitle>
          <CardDescription className="text-gray-400">
            Manage all membership plans and their QR unlock codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                <TableHead className="text-[#4a89dc]">Name</TableHead>
                <TableHead className="text-[#4a89dc]">Price</TableHead>
                <TableHead className="text-[#4a89dc]">Type</TableHead>
                <TableHead className="text-[#4a89dc]">Users</TableHead>
                <TableHead className="text-[#4a89dc]">Status</TableHead>
                <TableHead className="text-[#4a89dc]">QR Code</TableHead>
                <TableHead className="text-[#4a89dc]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membershipPlans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableCell className="font-medium text-white">
                    {plan.name}
                    <div className="text-xs text-gray-400 mt-1">
                      {plan.features.slice(0, 2).join(', ')}
                      {plan.features.length > 2 && '...'}
                    </div>
                  </TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>{plan.type}</TableCell>
                  <TableCell>{plan.usersCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${plan.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <CreditCard className="h-4 w-4 mr-1" /> View QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
                        <DialogHeader>
                          <DialogTitle>QR Code for {plan.name}</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Scan this QR code to unlock the {plan.name} membership.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center py-6 bg-white rounded-md">
                          <QRCodeSVG value={plan.qrCode} size={200} />
                        </div>
                        <div className="text-center text-sm mt-4 text-gray-400">
                          QR Code ID: {plan.qrCode}
                        </div>
                        <DialogFooter className="mt-4">
                          <Button className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                            Regenerate QR Code
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default MembershipPanel;