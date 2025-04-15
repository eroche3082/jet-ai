import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RefreshCw, 
  Database, 
  Server, 
  HardDrive, 
  Cloud, 
  Activity, 
  Cpu, 
  Zap, 
  FileText,
  DownloadCloud,
  Shield,
  Clock
} from 'lucide-react';

// Mock data for system status
const systemStatuses = [
  { id: 'web-server', name: 'Web Server', status: 'operational', uptime: '99.98%', icon: <Server className="h-5 w-5" /> },
  { id: 'database', name: 'Database', status: 'operational', uptime: '99.95%', icon: <Database className="h-5 w-5" /> },
  { id: 'ai-services', name: 'AI Services', status: 'operational', uptime: '99.92%', icon: <Cpu className="h-5 w-5" /> },
  { id: 'storage', name: 'File Storage', status: 'operational', uptime: '99.99%', icon: <HardDrive className="h-5 w-5" /> },
  { id: 'payments', name: 'Payment Gateway', status: 'operational', uptime: '99.97%', icon: <Zap className="h-5 w-5" /> },
  { id: 'auth', name: 'Authentication', status: 'operational', uptime: '99.99%', icon: <Shield className="h-5 w-5" /> },
  { id: 'cache', name: 'Cache System', status: 'operational', uptime: '100.00%', icon: <Cloud className="h-5 w-5" /> },
  { id: 'notifications', name: 'Notification Service', status: 'degraded', uptime: '98.72%', icon: <Activity className="h-5 w-5" /> }
];

// Mock data for system checks
const systemChecks = [
  { 
    id: 'frontend', 
    name: 'Frontend Components', 
    status: 'passed', 
    details: 'All UI components are rendering correctly', 
    lastCheck: '2025-04-15 10:30 AM' 
  },
  { 
    id: 'api', 
    name: 'API Endpoints', 
    status: 'passed', 
    details: 'All API endpoints are responding as expected', 
    lastCheck: '2025-04-15 10:30 AM' 
  },
  { 
    id: 'database', 
    name: 'Database Connections', 
    status: 'passed', 
    details: 'Database connections are stable and performing well', 
    lastCheck: '2025-04-15 10:30 AM' 
  },
  { 
    id: 'ai', 
    name: 'AI Services', 
    status: 'passed', 
    details: 'AI services are responding within expected parameters', 
    lastCheck: '2025-04-15 10:30 AM'
  },
  { 
    id: 'auth', 
    name: 'Authentication Services', 
    status: 'passed', 
    details: 'Authentication and authorization systems functioning properly', 
    lastCheck: '2025-04-15 10:30 AM' 
  },
  { 
    id: 'payments', 
    name: 'Payment Services', 
    status: 'passed', 
    details: 'Payment processing and subscription management is operational', 
    lastCheck: '2025-04-15 10:30 AM' 
  },
  { 
    id: 'notifications', 
    name: 'Notification Services', 
    status: 'warning', 
    details: 'Email delivery experiencing slight delays', 
    lastCheck: '2025-04-15 10:30 AM' 
  },
  { 
    id: 'storage', 
    name: 'Storage Services', 
    status: 'passed', 
    details: 'File storage and retrieval systems operating normally', 
    lastCheck: '2025-04-15 10:30 AM' 
  }
];

// Mock data for system logs
const systemLogs = [
  {
    timestamp: '2025-04-15 10:45:22',
    level: 'info',
    component: 'Server',
    message: 'System backup completed successfully'
  },
  {
    timestamp: '2025-04-15 10:32:17',
    level: 'warning',
    component: 'Notifications',
    message: 'Email delivery delays detected, investigating'
  },
  {
    timestamp: '2025-04-15 10:15:03',
    level: 'info',
    component: 'AI Services',
    message: 'Model updates applied successfully'
  },
  {
    timestamp: '2025-04-15 09:58:41',
    level: 'info',
    component: 'Auth',
    message: 'New security certificate installed'
  },
  {
    timestamp: '2025-04-15 09:45:12',
    level: 'info',
    component: 'Database',
    message: 'Routine maintenance completed'
  },
  {
    timestamp: '2025-04-15 09:30:05',
    level: 'info',
    component: 'Server',
    message: 'System health check started'
  },
  {
    timestamp: '2025-04-15 08:15:33',
    level: 'error',
    component: 'Payments',
    message: 'Temporary payment processing issue detected and resolved'
  },
  {
    timestamp: '2025-04-15 07:45:29',
    level: 'info',
    component: 'Storage',
    message: 'Automatic storage scaling activated'
  }
];

// Mock system metrics
const systemMetrics = {
  cpu: 32,
  memory: 45,
  storage: 68,
  network: 24,
  requests: 789,
  responseTime: 230,
  errorRate: 0.04,
  activeSessions: 153
};

const SystemIntegrity: React.FC = () => {
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [activeSystemTab, setActiveSystemTab] = useState('status');
  
  const startSystemCheck = () => {
    setIsRunningCheck(true);
    
    // In a real application, this would call an API to run the tests
    setTimeout(() => {
      setIsRunningCheck(false);
      // Update would come from the API response
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">System Integrity</h2>
        <Button 
          className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
          onClick={startSystemCheck}
          disabled={isRunningCheck}
        >
          {isRunningCheck ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" /> Run System Check
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">System Health</p>
                <p className="text-2xl font-bold text-white">Excellent</p>
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
                <p className="text-sm text-gray-400">Issues Detected</p>
                <p className="text-2xl font-bold text-white">1 Minor</p>
              </div>
              <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Last Check</p>
                <p className="text-2xl font-bold text-white">15 min ago</p>
              </div>
              <div className="h-10 w-10 bg-[#4a89dc]/20 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#4a89dc]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeSystemTab} onValueChange={setActiveSystemTab} className="space-y-4">
        <TabsList className="bg-[#0a1328]">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> System Status
          </TabsTrigger>
          <TabsTrigger value="checks" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> System Checks
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> System Logs
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" /> Performance Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription className="text-gray-400">
                Current status of all system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemStatuses.map((service) => (
                  <div 
                    key={service.id}
                    className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#0a1328] rounded-md flex items-center justify-center mr-3">
                        {service.icon}
                      </div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-xs text-gray-400">Uptime: {service.uptime}</div>
                      </div>
                    </div>
                    <div>
                      {service.status === 'operational' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500">
                          Operational
                        </span>
                      ) : service.status === 'degraded' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-500">
                          Degraded
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-500">
                          Down
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4">
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh Status
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription className="text-gray-400">
                Schedule and view upcoming maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Database Optimization</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Scheduled maintenance to optimize database performance.
                        No downtime expected.
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      Apr 20, 2025 (02:00 - 03:00 UTC)
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">AI Model Updates</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Deploying updated AI models for improved recommendations.
                        Brief service interruption possible.
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      Apr 25, 2025 (04:00 - 04:30 UTC)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                Schedule Maintenance
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="checks" className="space-y-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>System Checks</CardTitle>
              <CardDescription className="text-gray-400">
                Results from the most recent system integrity tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemChecks.map((check) => (
                  <div 
                    key={check.id}
                    className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        {check.status === 'passed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        ) : check.status === 'warning' ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="font-medium">{check.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {check.details}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {check.lastCheck}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <DownloadCloud className="h-4 w-4 mr-2" /> Export Report
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Run Again
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription className="text-gray-400">
                Recent system events and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemLogs.map((log, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-[#050b17] rounded-md border border-[#4a89dc]/20 flex"
                  >
                    <div className="w-36 shrink-0 text-sm text-gray-400">
                      {log.timestamp}
                    </div>
                    <div className="w-20 shrink-0">
                      {log.level === 'info' ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">INFO</span>
                      ) : log.level === 'warning' ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-500">WARN</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-500">ERROR</span>
                      )}
                    </div>
                    <div className="w-28 shrink-0 text-gray-300 font-mono text-sm">
                      [{log.component}]
                    </div>
                    <div className="text-sm">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
              <Button variant="outline">
                View All Logs
              </Button>
              <Button variant="outline">
                Download Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription className="text-gray-400">
                Current system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>CPU Usage</Label>
                      <span className="text-sm text-gray-400">{systemMetrics.cpu}%</span>
                    </div>
                    <Progress value={systemMetrics.cpu} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Memory Usage</Label>
                      <span className="text-sm text-gray-400">{systemMetrics.memory}%</span>
                    </div>
                    <Progress value={systemMetrics.memory} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Storage Usage</Label>
                      <span className="text-sm text-gray-400">{systemMetrics.storage}%</span>
                    </div>
                    <Progress value={systemMetrics.storage} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Network Utilization</Label>
                      <span className="text-sm text-gray-400">{systemMetrics.network}%</span>
                    </div>
                    <Progress value={systemMetrics.network} className="h-2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                    <div className="text-sm text-gray-400">Requests/Minute</div>
                    <div className="text-2xl font-bold mt-1">{systemMetrics.requests}</div>
                  </div>
                  
                  <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                    <div className="text-sm text-gray-400">Response Time</div>
                    <div className="text-2xl font-bold mt-1">{systemMetrics.responseTime}ms</div>
                  </div>
                  
                  <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                    <div className="text-sm text-gray-400">Error Rate</div>
                    <div className="text-2xl font-bold mt-1">{systemMetrics.errorRate}%</div>
                  </div>
                  
                  <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                    <div className="text-sm text-gray-400">Active Sessions</div>
                    <div className="text-2xl font-bold mt-1">{systemMetrics.activeSessions}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4">
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh Metrics
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>System Optimizations</CardTitle>
              <CardDescription className="text-gray-400">
                Actions to improve system performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white justify-start">
                <Zap className="h-4 w-4 mr-2" /> Clear System Cache
              </Button>
              <Button className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white justify-start">
                <Database className="h-4 w-4 mr-2" /> Optimize Database
              </Button>
              <Button className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white justify-start">
                <HardDrive className="h-4 w-4 mr-2" /> Clean Temporary Files
              </Button>
              <Button className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white justify-start">
                <Cloud className="h-4 w-4 mr-2" /> Restart API Services
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemIntegrity;