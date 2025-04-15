import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminManagerNavigation from "@/components/adminmanager/AdminManagerNavigation";
import PlatformOperations from "@/components/adminmanager/PlatformOperations";
import MembershipManagement from "@/components/adminmanager/MembershipManagement";
import UserManagement from "@/components/adminmanager/UserManagement";
import FeatureToggles from "@/components/adminmanager/FeatureToggles";
import SystemIntegrity from "@/components/adminmanager/SystemIntegrity";
import AdminActivityLog from "@/components/adminmanager/AdminActivityLog";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock, Database, Layout, ShieldCheck, Users, Settings } from 'lucide-react';
import { useLocation } from 'wouter';

// Hardcoded admin credentials for this example
// In a production environment, these would be verified against a secure authentication system
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Admin3082#";

const AdminManagerPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('platform');
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      
      // Log this action (in a real app, this would be sent to a server)
      console.log('Admin Manager Login:', { timestamp: new Date().toISOString(), username });
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    
    // Log this action (in a real app, this would be sent to a server)
    console.log('Admin Manager Logout:', { timestamp: new Date().toISOString() });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050b17] p-4">
        <Card className="w-full max-w-md bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">JET AI Admin Manager</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#050b17] border border-[#4a89dc]/20 focus:border-[#4a89dc] focus:outline-none"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#050b17] border border-[#4a89dc]/20 focus:border-[#4a89dc] focus:outline-none"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#4a89dc] hover:bg-[#3a79cc]">
                Login to Admin Dashboard
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => navigate('/')}>
                Return to JET AI Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b17] flex">
      {/* Admin Manager Navigation Sidebar */}
      <AdminManagerNavigation activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Manager Dashboard</h1>
            <p className="text-gray-400">Manage JET AI platform settings and configurations</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        
        {/* System Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">System Status</p>
                  <p className="text-2xl font-bold text-white">Operational</p>
                </div>
                <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">1,245</p>
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
                  <p className="text-sm text-gray-400">Active Features</p>
                  <p className="text-2xl font-bold text-white">28/32</p>
                </div>
                <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Last Sync</p>
                  <p className="text-2xl font-bold text-white">5 min ago</p>
                </div>
                <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-[#0a1328] p-0 h-0 hidden">
            <TabsTrigger value="platform">Platform Operations</TabsTrigger>
            <TabsTrigger value="membership">Membership Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="features">Feature Toggles</TabsTrigger>
            <TabsTrigger value="system">System Integrity</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platform" className="space-y-4 mt-0">
            <PlatformOperations />
          </TabsContent>
          
          <TabsContent value="membership" className="space-y-4 mt-0">
            <MembershipManagement />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4 mt-0">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4 mt-0">
            <FeatureToggles />
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4 mt-0">
            <SystemIntegrity />
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4 mt-0">
            <AdminActivityLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminManagerPage;