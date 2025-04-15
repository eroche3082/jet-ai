import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, CreditCard, PiggyBank, ArrowUpRight } from 'lucide-react';

const revenueData = [
  { name: 'Jan', stripe: 4000, paypal: 2400, total: 6400 },
  { name: 'Feb', stripe: 3000, paypal: 1398, total: 4398 },
  { name: 'Mar', stripe: 2000, paypal: 9800, total: 11800 },
  { name: 'Apr', stripe: 2780, paypal: 3908, total: 6688 },
  { name: 'May', stripe: 1890, paypal: 4800, total: 6690 },
  { name: 'Jun', stripe: 2390, paypal: 3800, total: 6190 },
  { name: 'Jul', stripe: 3490, paypal: 4300, total: 7790 },
];

const payoutData = [
  { id: 1, date: '2025-04-01', amount: '$4,250.00', status: 'Completed', destination: 'Bank of America' },
  { id: 2, date: '2025-03-01', amount: '$3,870.00', status: 'Completed', destination: 'Bank of America' },
  { id: 3, date: '2025-02-01', amount: '$5,120.00', status: 'Completed', destination: 'Bank of America' },
  { id: 4, date: '2025-01-01', amount: '$2,930.00', status: 'Completed', destination: 'Bank of America' },
];

const platformRevenue = [
  { id: 1, platform: 'JET AI', monthly: '$2,450.00', annual: '$12,350.00', users: 324 },
  { id: 2, platform: 'CryptoBot', monthly: '$1,870.00', annual: '$8,970.00', users: 213 },
  { id: 3, platform: 'FitnessAI', monthly: '$1,250.00', annual: '$6,780.00', users: 187 },
  { id: 4, platform: 'SportsAI', monthly: '$980.00', annual: '$4,320.00', users: 104 },
  { id: 5, platform: 'ShopAI', monthly: '$1,540.00', annual: '$7,640.00', users: 167 },
  { id: 6, platform: 'EduAI', monthly: '$890.00', annual: '$4,120.00', users: 92 },
];

const FinancialOverview: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-[#4a89dc]" /> Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$45,893.00</div>
            <p className="text-xs text-green-500">+7.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <CreditCard className="h-4 w-4 mr-1 text-[#4a89dc]" /> Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$12,450.00</div>
            <p className="text-xs text-gray-400">Next payout: May 1, 2025</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <PiggyBank className="h-4 w-4 mr-1 text-[#4a89dc]" /> Lifetime Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$187,245.00</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 28.4% YoY growth
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" />
                  <XAxis dataKey="name" stroke="#4a89dc" />
                  <YAxis stroke="#4a89dc" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a1328', borderColor: '#4a89dc' }}
                    labelStyle={{ color: '#4a89dc' }}
                  />
                  <Line type="monotone" dataKey="stripe" stroke="#4a89dc" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="paypal" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="total" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableHead className="text-[#4a89dc]">Platform</TableHead>
                  <TableHead className="text-[#4a89dc]">Monthly</TableHead>
                  <TableHead className="text-[#4a89dc]">Annual</TableHead>
                  <TableHead className="text-[#4a89dc]">Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platformRevenue.map((item) => (
                  <TableRow key={item.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableCell className="font-medium text-white">{item.platform}</TableCell>
                    <TableCell>{item.monthly}</TableCell>
                    <TableCell>{item.annual}</TableCell>
                    <TableCell>{item.users}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableHead className="text-[#4a89dc]">Date</TableHead>
                  <TableHead className="text-[#4a89dc]">Amount</TableHead>
                  <TableHead className="text-[#4a89dc]">Status</TableHead>
                  <TableHead className="text-[#4a89dc]">Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableCell className="font-medium text-white">{item.date}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>{item.destination}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FinancialOverview;