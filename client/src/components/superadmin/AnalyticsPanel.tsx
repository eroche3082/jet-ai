import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 4000, sessions: 2400 },
  { name: 'Feb', users: 3000, sessions: 1398 },
  { name: 'Mar', users: 2000, sessions: 9800 },
  { name: 'Apr', users: 2780, sessions: 3908 },
  { name: 'May', users: 1890, sessions: 4800 },
  { name: 'Jun', users: 2390, sessions: 3800 },
  { name: 'Jul', users: 3490, sessions: 4300 },
];

const platformData = [
  { name: 'JET AI', users: 4000, sessions: 2400 },
  { name: 'CryptoBot', users: 3000, sessions: 1398 },
  { name: 'FitnessAI', users: 2000, sessions: 1800 },
  { name: 'SportsAI', users: 1000, sessions: 800 },
  { name: 'ShopAI', users: 2500, sessions: 2100 },
  { name: 'EduAI', users: 1500, sessions: 1200 },
];

const AnalyticsPanel: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,456</div>
            <p className="text-xs text-green-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,245</div>
            <p className="text-xs text-green-500">+5% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8.7%</div>
            <p className="text-xs text-red-500">-2% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">72%</div>
            <p className="text-xs text-green-500">+3% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" />
                  <XAxis dataKey="name" stroke="#4a89dc" />
                  <YAxis stroke="#4a89dc" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a1328', borderColor: '#4a89dc' }}
                    labelStyle={{ color: '#4a89dc' }}
                  />
                  <Bar dataKey="users" fill="#4a89dc" />
                  <Bar dataKey="sessions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Platform Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" />
                  <XAxis dataKey="name" stroke="#4a89dc" />
                  <YAxis stroke="#4a89dc" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a1328', borderColor: '#4a89dc' }}
                    labelStyle={{ color: '#4a89dc' }}
                  />
                  <Bar dataKey="users" fill="#4a89dc" />
                  <Bar dataKey="sessions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AnalyticsPanel;