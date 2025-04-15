import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  Filter, 
  Search,
  Bell,
  XCircle,
  Info,
  Terminal
} from 'lucide-react';

const alertsData = [
  { 
    id: 1, 
    title: 'API Rate Limit Warning', 
    description: 'OpenAI API rate limit at 80% of quota. Consider upgrading plan.',
    type: 'warning',
    source: 'OpenAI API',
    timestamp: '2025-04-15 01:45:22',
    status: 'new'
  },
  { 
    id: 2, 
    title: 'Firebase Functions Degraded', 
    description: 'Firebase Functions experiencing increased latency in the us-central1 region.',
    type: 'warning',
    source: 'Firebase',
    timestamp: '2025-04-14 23:12:05',
    status: 'acknowledged'
  },
  { 
    id: 3, 
    title: 'Memory Usage High', 
    description: 'JET AI server memory usage has exceeded 85% for more than 30 minutes.',
    type: 'warning',
    source: 'System Monitor',
    timestamp: '2025-04-14 22:08:17',
    status: 'acknowledged'
  },
  { 
    id: 4, 
    title: 'Payment Processing Failed', 
    description: 'Multiple Stripe payment processing attempts failed for subscription renewal.',
    type: 'error',
    source: 'Stripe API',
    timestamp: '2025-04-14 18:43:56',
    status: 'resolved'
  },
  { 
    id: 5, 
    title: 'Google Cloud Vision Quota Reached', 
    description: 'Monthly quota for Google Cloud Vision API has been reached.',
    type: 'error',
    source: 'Google Cloud',
    timestamp: '2025-04-14 15:22:30',
    status: 'resolved'
  },
  { 
    id: 6, 
    title: 'Database Connection Instability', 
    description: 'PostgreSQL database connection experiencing intermittent failures.',
    type: 'error',
    source: 'Database',
    timestamp: '2025-04-14 12:10:45',
    status: 'resolved'
  },
  { 
    id: 7, 
    title: 'Suspicious Login Attempt', 
    description: 'Multiple failed login attempts from IP address 192.168.1.105.',
    type: 'critical',
    source: 'Security',
    timestamp: '2025-04-14 08:37:12',
    status: 'resolved'
  },
  { 
    id: 8, 
    title: 'System Update Completed', 
    description: 'Scheduled system update has been completed successfully.',
    type: 'info',
    source: 'System',
    timestamp: '2025-04-13 23:05:18',
    status: 'resolved'
  }
];

const systemHealthData = [
  { name: 'CPU Usage', value: 42, status: 'normal' },
  { name: 'Memory Usage', value: 78, status: 'warning' },
  { name: 'Disk Space', value: 56, status: 'normal' },
  { name: 'Network Bandwidth', value: 63, status: 'normal' },
  { name: 'Database Load', value: 82, status: 'warning' },
  { name: 'API Response Time', value: 95, status: 'critical' },
];

const AlertsCenter: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAlerts = alertsData.filter(alert => {
    const matchesFilter = filter === 'all' || alert.status === filter || alert.type === filter;
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500/20 text-blue-500">New</Badge>;
      case 'acknowledged':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Acknowledged</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-500">Resolved</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };
  
  const newAlertsCount = alertsData.filter(alert => alert.status === 'new').length;
  
  return (
    <Tabs defaultValue="alerts" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 bg-[#0a1328] border-[#4a89dc]/20 border">
        <TabsTrigger value="alerts" className="flex gap-1 items-center">
          <AlertTriangle className="h-4 w-4" /> Alerts {newAlertsCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {newAlertsCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="system-health" className="flex gap-1 items-center">
          <CheckCircle2 className="h-4 w-4" /> System Health
        </TabsTrigger>
        <TabsTrigger value="logs" className="flex gap-1 items-center">
          <Terminal className="h-4 w-4" /> System Logs
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="alerts">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Incident Alerts</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor and manage system alerts and incidents
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
                <Button variant="outline" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> History
                </Button>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white flex items-center gap-1">
                  <Bell className="h-4 w-4" /> Configure Notifications
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* New/Unresolved Alerts */}
            {alertsData.filter(alert => alert.status === 'new').length > 0 && (
              <div className="mb-6 space-y-3">
                {alertsData.filter(alert => alert.status === 'new').map(alert => (
                  <Alert 
                    key={alert.id} 
                    className={
                      alert.type === 'critical' ? 'border-red-500 bg-red-500/10' :
                      alert.type === 'error' ? 'border-red-400 bg-red-400/10' :
                      alert.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10' :
                      'border-blue-400 bg-blue-400/10'
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        {getStatusIcon(alert.type)}
                        <div>
                          <AlertTitle className="text-white">{alert.title}</AlertTitle>
                          <AlertDescription className="text-gray-300">
                            {alert.description}
                          </AlertDescription>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>{alert.source}</span>
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Acknowledge</Button>
                        <Button size="sm" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Resolve</Button>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search alerts..." 
                  className="pl-10 bg-[#050b17] border-[#4a89dc]/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="min-w-[180px] bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Filter alerts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border border-[#4a89dc]/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-[#050b17]">
                  <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableHead className="text-[#4a89dc]">Severity</TableHead>
                    <TableHead className="text-[#4a89dc]">Alert</TableHead>
                    <TableHead className="text-[#4a89dc]">Source</TableHead>
                    <TableHead className="text-[#4a89dc]">Time</TableHead>
                    <TableHead className="text-[#4a89dc]">Status</TableHead>
                    <TableHead className="text-[#4a89dc] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length === 0 ? (
                    <TableRow className="hover:bg-[#0f1e36]">
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        No alerts found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(alert.type)}
                            <span className="ml-2 capitalize">
                              {alert.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-white">{alert.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{alert.description}</div>
                        </TableCell>
                        <TableCell>{alert.source}</TableCell>
                        <TableCell>{alert.timestamp}</TableCell>
                        <TableCell>{getStatusBadge(alert.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {alert.status !== 'resolved' && (
                              <>
                                {alert.status === 'new' && (
                                  <Button variant="outline" size="sm">Acknowledge</Button>
                                )}
                                <Button 
                                  size="sm" 
                                  className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                                >
                                  Resolve
                                </Button>
                              </>
                            )}
                            {alert.status === 'resolved' && (
                              <Button variant="outline" size="sm">View Details</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="system-health">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20 mb-6">
          <CardHeader>
            <CardTitle>System Health Dashboard</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time monitoring of system resources and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemHealthData.map((item, index) => (
                <Card key={index} className="bg-[#050b17] border-[#4a89dc]/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex justify-between">
                      <span>{item.name}</span>
                      <Badge 
                        className={
                          item.status === 'normal' ? 'bg-green-500/20 text-green-500' :
                          item.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }
                      >
                        {item.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-white">{item.value}%</span>
                        <span>
                          {item.status === 'normal' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {item.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                          {item.status === 'critical' && <AlertCircle className="h-5 w-5 text-red-500" />}
                        </span>
                      </div>
                      <Progress 
                        value={item.value} 
                        className={`h-2 bg-gray-700 ${
                          item.status === 'normal' ? '[&>div]:bg-green-500' :
                          item.status === 'warning' ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-red-500'
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-[#050b17] border-[#4a89dc]/20">
                <CardHeader>
                  <CardTitle>Server Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">API Server</div>
                      <Badge className="bg-green-500/20 text-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Web Server</div>
                      <Badge className="bg-green-500/20 text-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Database Server</div>
                      <Badge className="bg-green-500/20 text-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">File Storage</div>
                      <Badge className="bg-green-500/20 text-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Task Queue</div>
                      <Badge className="bg-yellow-500/20 text-yellow-500">Degraded</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#050b17] border-[#4a89dc]/20">
                <CardHeader>
                  <CardTitle>External Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Google Cloud APIs</div>
                      <Badge className="bg-green-500/20 text-green-500">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">OpenAI API</div>
                      <Badge className="bg-green-500/20 text-green-500">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Stripe Payment</div>
                      <Badge className="bg-green-500/20 text-green-500">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Firebase Services</div>
                      <Badge className="bg-yellow-500/20 text-yellow-500">Partial Outage</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Amadeus Travel API</div>
                      <Badge className="bg-green-500/20 text-green-500">Operational</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="logs">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>System Logs</CardTitle>
                <CardDescription className="text-gray-400">
                  View detailed system logs and diagnostic information
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="error">
                  <SelectTrigger className="min-w-[150px] bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Clear</Button>
                <Button variant="outline">Download</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-[#050b17] border border-[#4a89dc]/20 rounded-md p-4 font-mono text-sm h-[500px] overflow-y-auto">
              <div className="text-red-400">[2025-04-15 01:45:22] [ERROR] OpenAI API rate limit at 80% of quota. Consider upgrading plan.</div>
              <div className="text-yellow-400">[2025-04-15 01:40:15] [WARN] High memory usage detected (85% used).</div>
              <div className="text-white">[2025-04-15 01:38:42] [INFO] User ID 24601 logged in from IP 203.0.113.42 (New York, USA).</div>
              <div className="text-white">[2025-04-15 01:35:18] [INFO] Successfully processed payment for subscription ID S-2025041501.</div>
              <div className="text-red-400">[2025-04-15 01:32:05] [ERROR] Firebase Functions experiencing increased latency in the us-central1 region.</div>
              <div className="text-white">[2025-04-15 01:30:22] [INFO] Generated QR code for access plan ID P-2025041523.</div>
              <div className="text-white">[2025-04-15 01:28:07] [INFO] Database backup completed successfully. Size: 1.2GB.</div>
              <div className="text-yellow-400">[2025-04-15 01:25:40] [WARN] API request to Google Cloud Translation took 3.5s (threshold: 3.0s).</div>
              <div className="text-white">[2025-04-15 01:20:15] [INFO] New user registered: user123@example.com (ID: 24602).</div>
              <div className="text-white">[2025-04-15 01:18:32] [INFO] Updated system configuration: MAX_REQUESTS_PER_MINUTE set to 100.</div>
              <div className="text-red-400">[2025-04-15 01:16:47] [ERROR] Failed to process Stripe payment for user ID 24578. Error: Card declined.</div>
              <div className="text-white">[2025-04-15 01:15:20] [INFO] System health check completed. All services operational.</div>
              <div className="text-yellow-400">[2025-04-15 01:12:55] [WARN] JWT token about to expire for user ID 24590.</div>
              <div className="text-white">[2025-04-15 01:10:30] [INFO] Generated travel itinerary for user ID 24567.</div>
              <div className="text-red-400">[2025-04-15 01:08:12] [ERROR] Google Cloud Vision API quota reached. 0 requests remaining for today.</div>
              <div className="text-white">[2025-04-15 01:05:45] [INFO] Scheduled maintenance completed for SportsAI platform.</div>
              <div className="text-yellow-400">[2025-04-15 01:03:20] [WARN] CPU usage spike detected. Now at 78%.</div>
              <div className="text-white">[2025-04-15 01:00:00] [INFO] Hourly system status report: All systems nominal.</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AlertsCenter;