import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, DollarSign, TrendingUp, TrendingDown, Users, CreditCard, Calendar } from 'lucide-react';

// Mock data for recent transactions
const recentTransactions = [
  { 
    id: 'INV-2025-0423', 
    customer: 'John Doe', 
    email: 'john.doe@example.com',
    plan: 'JET AI Pro', 
    amount: '$19.99', 
    date: '2025-04-15', 
    status: 'completed' 
  },
  { 
    id: 'INV-2025-0422', 
    customer: 'Sarah Smith', 
    email: 'sarah.smith@example.com',
    plan: 'JET AI Business', 
    amount: '$199.99', 
    date: '2025-04-14', 
    status: 'completed' 
  },
  { 
    id: 'INV-2025-0421', 
    customer: 'Michael Johnson', 
    email: 'michael.j@example.com',
    plan: 'JET AI Pro', 
    amount: '$19.99', 
    date: '2025-04-14', 
    status: 'completed' 
  },
  { 
    id: 'INV-2025-0420', 
    customer: 'Emily Davis', 
    email: 'emily.davis@example.com',
    plan: 'JET AI Pro', 
    amount: '$19.99', 
    date: '2025-04-13', 
    status: 'failed' 
  },
  { 
    id: 'INV-2025-0419', 
    customer: 'David Wilson', 
    email: 'david.w@example.com',
    plan: 'JET AI Business', 
    amount: '$199.99', 
    date: '2025-04-12', 
    status: 'completed' 
  },
  { 
    id: 'INV-2025-0418', 
    customer: 'Laura Martinez', 
    email: 'laura.m@example.com',
    plan: 'JET AI Pro', 
    amount: '$19.99', 
    date: '2025-04-12', 
    status: 'pending' 
  }
];

// Mock data for revenue breakdown
const revenueBreakdown = [
  { plan: 'JET AI Pro', revenue: 184500, percentage: 72.5, color: 'bg-blue-500' },
  { plan: 'JET AI Business', revenue: 58250, percentage: 22.9, color: 'bg-purple-500' },
  { plan: 'JET AI Enterprise', revenue: 11750, percentage: 4.6, color: 'bg-green-500' }
];

const FinancialOverview: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-[#4a89dc]" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$254,500</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12.4% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-[#4a89dc]" />
              Paying Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,585</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+8.7% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-[#4a89dc]" />
              Avg. Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$37.85</div>
            <div className="flex items-center text-sm text-red-500 mt-1">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>-2.1% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#4a89dc]" />
              Monthly Recurring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$187,420</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+15.3% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="revenue" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="bg-[#050b17]">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Select defaultValue="april">
              <SelectTrigger className="w-[140px] bg-[#050b17] border-[#4a89dc]/20">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January 2025</SelectItem>
                <SelectItem value="february">February 2025</SelectItem>
                <SelectItem value="march">March 2025</SelectItem>
                <SelectItem value="april">April 2025</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="bg-[#0a1328] border-[#4a89dc]/20">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly revenue breakdown by plan type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Revenue chart would be rendered here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-[#0a1328] border-[#4a89dc]/20">
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                  <CardDescription className="text-gray-400">
                    Breakdown by membership level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueBreakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{item.plan}</span>
                          <span>${(item.revenue).toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full">
                          <div 
                            className={`h-full ${item.color} rounded-full`} 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 text-right mt-1">
                          {item.percentage}% of total
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-[#4a89dc]/20">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Total Revenue</span>
                      <span className="font-bold">$254,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment Processing Fees</span>
                      <span className="font-medium">-$8,908</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Most recent payment transactions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableHead className="text-[#4a89dc]">Invoice</TableHead>
                    <TableHead className="text-[#4a89dc]">Customer</TableHead>
                    <TableHead className="text-[#4a89dc]">Plan</TableHead>
                    <TableHead className="text-[#4a89dc]">Amount</TableHead>
                    <TableHead className="text-[#4a89dc]">Date</TableHead>
                    <TableHead className="text-[#4a89dc]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction, i) => (
                    <TableRow key={i} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          {transaction.customer}
                          <div className="text-xs text-gray-400">{transaction.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.plan}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                            transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription className="text-gray-400">
                Complete transaction history and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-12">
                Transaction analytics content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription className="text-gray-400">
                Invoice generation and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-12">
                Invoice management content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Expense Tracking</CardTitle>
              <CardDescription className="text-gray-400">
                Platform operation expense overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-12">
                Expense tracking content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FinancialOverview;