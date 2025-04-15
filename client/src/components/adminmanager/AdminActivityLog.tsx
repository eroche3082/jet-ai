import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  User, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  UserX, 
  Settings, 
  RefreshCw, 
  ShieldAlert, 
  Eye, 
  Download, 
  FileText, 
  AlertTriangle
} from 'lucide-react';

// Mock data for activity logs
const activityLogs = [
  {
    id: '1001',
    timestamp: '2025-04-15 10:45:22',
    admin: 'admin',
    action: 'edit',
    target: 'Platform content',
    details: 'Updated homepage hero section content',
    ip: '192.168.1.105'
  },
  {
    id: '1002',
    timestamp: '2025-04-15 10:32:17',
    admin: 'admin',
    action: 'toggle',
    target: 'Feature',
    details: 'Disabled "AR Navigation" feature',
    ip: '192.168.1.105'
  },
  {
    id: '1003',
    timestamp: '2025-04-15 10:15:03',
    admin: 'admin',
    action: 'edit',
    target: 'Membership plan',
    details: 'Updated Pro Plan pricing from $19.99 to $24.99',
    ip: '192.168.1.105'
  },
  {
    id: '1004',
    timestamp: '2025-04-15 09:58:41',
    admin: 'admin',
    action: 'view',
    target: 'User profile',
    details: 'Viewed user profile for john.smith@example.com',
    ip: '192.168.1.105'
  },
  {
    id: '1005',
    timestamp: '2025-04-15 09:45:12',
    admin: 'admin',
    action: 'create',
    target: 'Membership plan',
    details: 'Created new "Elite" membership plan',
    ip: '192.168.1.105'
  },
  {
    id: '1006',
    timestamp: '2025-04-15 09:30:05',
    admin: 'admin',
    action: 'login',
    target: 'System',
    details: 'Admin login successful',
    ip: '192.168.1.105'
  },
  {
    id: '1007',
    timestamp: '2025-04-14 17:15:33',
    admin: 'admin',
    action: 'delete',
    target: 'Content block',
    details: 'Deleted outdated promotion banner',
    ip: '192.168.1.105'
  },
  {
    id: '1008',
    timestamp: '2025-04-14 16:45:29',
    admin: 'admin',
    action: 'respond',
    target: 'Support ticket',
    details: 'Responded to ticket T-1002 from user david.c@example.com',
    ip: '192.168.1.105'
  },
  {
    id: '1009',
    timestamp: '2025-04-14 15:30:18',
    admin: 'admin',
    action: 'create',
    target: 'Menu item',
    details: 'Added "AI Features" to the main navigation menu',
    ip: '192.168.1.105'
  },
  {
    id: '1010',
    timestamp: '2025-04-14 14:20:05',
    admin: 'admin',
    action: 'edit',
    target: 'System',
    details: 'Updated email notification templates',
    ip: '192.168.1.105'
  }
];

// Mock security alerts
const securityAlerts = [
  {
    id: 'S1001',
    timestamp: '2025-04-15 08:30:25',
    severity: 'high',
    category: 'authentication',
    description: 'Multiple failed login attempts from IP 45.123.45.67',
    status: 'pending'
  },
  {
    id: 'S1002',
    timestamp: '2025-04-14 12:45:15',
    severity: 'medium',
    category: 'access',
    description: 'Unusual access pattern detected for user olivia.m@example.com',
    status: 'resolved'
  },
  {
    id: 'S1003',
    timestamp: '2025-04-13 19:22:08',
    severity: 'low',
    category: 'system',
    description: 'API rate limit reached for travel search endpoint',
    status: 'resolved'
  },
  {
    id: 'S1004',
    timestamp: '2025-04-13 14:15:30',
    severity: 'medium',
    category: 'access',
    description: 'User attempted to access restricted payment API',
    status: 'resolved'
  }
];

const AdminActivityLog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [securityTab, setSecurityTab] = useState('activity');
  
  // Apply filters to logs
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    // Apply time filter
    const logTime = new Date(log.timestamp);
    const now = new Date();
    
    if (timeFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return matchesSearch && matchesAction && logTime >= today;
    } else if (timeFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return matchesSearch && matchesAction && logTime >= weekAgo;
    }
    
    return matchesSearch && matchesAction;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Admin Activity Log</h2>
        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
          <Download className="h-4 w-4 mr-2" /> Export Logs
        </Button>
      </div>
      
      <Tabs defaultValue={securityTab} onValueChange={setSecurityTab} className="space-y-4">
        <TabsList className="bg-[#0a1328]">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Activity Log
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Security Alerts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search logs..."
                    className="pl-8 bg-[#050b17] border-[#4a89dc]/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[130px] bg-[#050b17] border-[#4a89dc]/20">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="toggle">Toggle</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[130px] bg-[#050b17] border-[#4a89dc]/20">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
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
                      <th className="text-left py-3 text-[#4a89dc]">Timestamp</th>
                      <th className="text-left py-3 text-[#4a89dc]">Admin</th>
                      <th className="text-left py-3 text-[#4a89dc]">Action</th>
                      <th className="text-left py-3 text-[#4a89dc]">Target</th>
                      <th className="text-left py-3 text-[#4a89dc]">Details</th>
                      <th className="text-left py-3 text-[#4a89dc]">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-[#4a89dc]/20 hover:bg-[#0f1e36]">
                        <td className="py-3 whitespace-nowrap text-sm text-gray-400">
                          {log.timestamp}
                        </td>
                        <td className="py-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-[#4a89dc]" />
                          {log.admin}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            log.action === 'create' ? 'bg-green-500/20 text-green-500' : 
                            log.action === 'edit' ? 'bg-blue-500/20 text-blue-400' : 
                            log.action === 'delete' ? 'bg-red-500/20 text-red-500' : 
                            log.action === 'toggle' ? 'bg-purple-500/20 text-purple-400' : 
                            log.action === 'view' ? 'bg-gray-500/20 text-gray-400' : 
                            log.action === 'login' ? 'bg-[#4a89dc]/20 text-[#4a89dc]' : 
                            log.action === 'respond' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </span>
                        </td>
                        <td className="py-3">{log.target}</td>
                        <td className="py-3 max-w-md truncate">{log.details}</td>
                        <td className="py-3 whitespace-nowrap font-mono text-xs text-gray-400">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 flex justify-between">
              <div className="text-sm text-gray-400">
                Showing {filteredLogs.length} of {activityLogs.length} log entries
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh Logs
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Admin Actions By Type</CardTitle>
              <CardDescription className="text-gray-400">
                Summary of admin actions over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Content Edits</p>
                      <p className="text-2xl font-bold text-white">32</p>
                    </div>
                    <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Edit className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Feature Toggles</p>
                      <p className="text-2xl font-bold text-white">15</p>
                    </div>
                    <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">User Management</p>
                      <p className="text-2xl font-bold text-white">24</p>
                    </div>
                    <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription className="text-gray-400">
                Recent security events that require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-md border ${
                      alert.status === 'pending' ? 'bg-[#0a1328] border-red-500/30' : 'bg-[#050b17] border-[#4a89dc]/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div>
                          {alert.severity === 'high' ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : alert.severity === 'medium' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {alert.category.charAt(0).toUpperCase() + alert.category.slice(1)} Alert
                            </h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              alert.severity === 'high' ? 'bg-red-500/20 text-red-500' : 
                              alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {alert.description}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">Alert ID: {alert.id} • {alert.timestamp}</div>
                        </div>
                      </div>
                      
                      <div>
                        {alert.status === 'pending' ? (
                          <Button size="sm" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                            Resolve
                          </Button>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh Alerts
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" /> Security Report
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Security Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Quick security-related actions
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white justify-start">
                <Eye className="h-4 w-4 mr-2" /> Audit User Permissions
              </Button>
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white justify-start">
                <UserX className="h-4 w-4 mr-2" /> Lock Suspicious Accounts
              </Button>
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white justify-start">
                <ShieldAlert className="h-4 w-4 mr-2" /> Security Health Check
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminActivityLog;