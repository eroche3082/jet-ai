import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Bell, Check, X, Search, Server, Users, MessageSquare, Clock, Database, Info, MailCheck, Plus, Settings, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data for system alerts
const alerts = [
  {
    id: 1,
    title: 'API Rate Limit Warning',
    severity: 'warning',
    category: 'api',
    timestamp: '2025-04-15T10:23:45',
    description: 'Google Vertex AI API rate limit at 85% of daily quota.',
    source: 'API Gateway',
    status: 'active',
    assignedTo: null
  },
  {
    id: 2,
    title: 'Database Connection Issue',
    severity: 'critical',
    category: 'database',
    timestamp: '2025-04-15T09:18:22',
    description: 'Intermittent connection failures to PostgreSQL database detected.',
    source: 'Database Monitor',
    status: 'active',
    assignedTo: 'Sarah Johnson'
  },
  {
    id: 3,
    title: 'Unusual Login Activity',
    severity: 'high',
    category: 'security',
    timestamp: '2025-04-15T08:52:14',
    description: 'Multiple failed login attempts detected from IP 198.51.100.24.',
    source: 'Security Monitor',
    status: 'resolved',
    assignedTo: 'Michael Chen'
  },
  {
    id: 4,
    title: 'Memory Usage High',
    severity: 'medium',
    category: 'system',
    timestamp: '2025-04-15T07:45:33',
    description: 'Server memory usage exceeding 85% for more than 30 minutes.',
    source: 'System Monitor',
    status: 'active',
    assignedTo: null
  },
  {
    id: 5,
    title: 'Payment Gateway Error',
    severity: 'high',
    category: 'payment',
    timestamp: '2025-04-15T06:21:05',
    description: 'Stripe webhook failures detected for subscription renewals.',
    source: 'Payment Service',
    status: 'investigating',
    assignedTo: 'James Wilson'
  },
  {
    id: 6,
    title: 'Notification Service Degraded',
    severity: 'low',
    category: 'service',
    timestamp: '2025-04-14T23:12:40',
    description: 'Email notification delivery experiencing delays of 5-10 minutes.',
    source: 'Notification Service',
    status: 'resolved',
    assignedTo: 'Emily Zhang'
  },
  {
    id: 7,
    title: 'Storage Space Warning',
    severity: 'medium',
    category: 'storage',
    timestamp: '2025-04-14T21:34:18',
    description: 'File storage usage at 92% of allocated capacity.',
    source: 'Storage Monitor',
    status: 'resolved',
    assignedTo: 'David Garcia'
  },
  {
    id: 8,
    title: 'Amadeus API Timeout',
    severity: 'high',
    category: 'api',
    timestamp: '2025-04-14T19:28:56',
    description: 'Increased timeout errors when accessing Amadeus flight search API.',
    source: 'API Gateway',
    status: 'investigating',
    assignedTo: null
  }
];

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

// Helper function to get the appropriate icon and color for severity level
const getSeverityDetails = (severity: string) => {
  switch (severity) {
    case 'critical':
      return { 
        icon: <AlertTriangle className="h-4 w-4" />, 
        bgColor: 'bg-red-500/20', 
        textColor: 'text-red-500',
        borderColor: 'border-red-500/30'
      };
    case 'high':
      return { 
        icon: <AlertTriangle className="h-4 w-4" />, 
        bgColor: 'bg-orange-500/20', 
        textColor: 'text-orange-500',
        borderColor: 'border-orange-500/30'
      };
    case 'medium':
      return { 
        icon: <Info className="h-4 w-4" />, 
        bgColor: 'bg-yellow-500/20', 
        textColor: 'text-yellow-500',
        borderColor: 'border-yellow-500/30'
      };
    case 'low':
      return { 
        icon: <Info className="h-4 w-4" />, 
        bgColor: 'bg-blue-500/20', 
        textColor: 'text-blue-500',
        borderColor: 'border-blue-500/30'
      };
    case 'warning':
      return { 
        icon: <AlertTriangle className="h-4 w-4" />, 
        bgColor: 'bg-yellow-500/20', 
        textColor: 'text-yellow-500',
        borderColor: 'border-yellow-500/30'
      };
    default:
      return { 
        icon: <Info className="h-4 w-4" />, 
        bgColor: 'bg-gray-500/20', 
        textColor: 'text-gray-500',
        borderColor: 'border-gray-500/30'
      };
  }
};

// Helper function to get the appropriate icon and color for status
const getStatusDetails = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        icon: <AlertTriangle className="h-4 w-4" />, 
        bgColor: 'bg-red-500/20', 
        textColor: 'text-red-500'
      };
    case 'investigating':
      return { 
        icon: <Search className="h-4 w-4" />, 
        bgColor: 'bg-orange-500/20', 
        textColor: 'text-orange-500'
      };
    case 'resolved':
      return { 
        icon: <Check className="h-4 w-4" />, 
        bgColor: 'bg-green-500/20', 
        textColor: 'text-green-500'
      };
    default:
      return { 
        icon: <Info className="h-4 w-4" />, 
        bgColor: 'bg-gray-500/20', 
        textColor: 'text-gray-500'
      };
  }
};

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'api':
      return <Server className="h-4 w-4" />;
    case 'database':
      return <Database className="h-4 w-4" />;
    case 'security':
      return <Shield className="h-4 w-4" />;
    case 'system':
      return <Server className="h-4 w-4" />;
    case 'payment':
      return <MessageSquare className="h-4 w-4" />;
    case 'service':
      return <Bell className="h-4 w-4" />;
    case 'storage':
      return <Database className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const AlertsCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  
  // Toggle alert expansion
  const toggleAlertExpansion = (alertId: number) => {
    if (expandedAlerts.includes(alertId)) {
      setExpandedAlerts(expandedAlerts.filter(id => id !== alertId));
    } else {
      setExpandedAlerts([...expandedAlerts, alertId]);
    }
  };
  
  // Filter alerts based on search, status, and severity
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });
  
  // Sort alerts by timestamp (newest first) and severity
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Sort by status first (active > investigating > resolved)
    const statusPriority = { active: 3, investigating: 2, resolved: 1 };
    const statusDiff = statusPriority[a.status as keyof typeof statusPriority] - statusPriority[b.status as keyof typeof statusPriority];
    if (statusDiff !== 0) return -statusDiff;
    
    // Then sort by severity
    const severityPriority = { critical: 4, high: 3, medium: 2, low: 1, warning: 2 };
    const severityDiff = severityPriority[a.severity as keyof typeof severityPriority] - severityPriority[b.severity as keyof typeof severityPriority];
    if (severityDiff !== 0) return -severityDiff;
    
    // Finally sort by timestamp
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  // Calculate alerts by status
  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
  const investigatingAlerts = alerts.filter(alert => alert.status === 'investigating').length;
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved').length;
  
  // Calculate alerts by severity
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical').length;
  const highAlerts = alerts.filter(alert => alert.severity === 'high').length;
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium' || alert.severity === 'warning').length;
  const lowAlerts = alerts.filter(alert => alert.severity === 'low').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">System Alerts Center</h2>
        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
          <Plus className="h-4 w-4 mr-2" /> Create Alert
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold text-white">{activeAlerts}</p>
              </div>
              <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Investigating</p>
                <p className="text-2xl font-bold text-white">{investigatingAlerts}</p>
              </div>
              <div className="h-10 w-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Search className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Resolved Today</p>
                <p className="text-2xl font-bold text-white">{resolvedAlerts}</p>
              </div>
              <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Critical Issues</p>
                <p className="text-2xl font-bold text-white">{criticalAlerts}</p>
              </div>
              <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search alerts..."
              className="pl-8 bg-[#050b17] border-[#4a89dc]/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-[#050b17] border-[#4a89dc]/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[160px] bg-[#050b17] border-[#4a89dc]/20">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="bg-[#050b17]">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <Card className="bg-[#0a1328] border-[#4a89dc]/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                      <TableHead className="text-[#4a89dc]">Severity</TableHead>
                      <TableHead className="text-[#4a89dc]">Alert</TableHead>
                      <TableHead className="text-[#4a89dc]">Status</TableHead>
                      <TableHead className="text-[#4a89dc]">Source</TableHead>
                      <TableHead className="text-[#4a89dc]">Time</TableHead>
                      <TableHead className="text-[#4a89dc]">Assigned To</TableHead>
                      <TableHead className="text-[#4a89dc] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAlerts.map((alert) => (
                      <React.Fragment key={alert.id}>
                        <TableRow className={`hover:bg-[#0f1e36] border-b-[#4a89dc]/20 ${expandedAlerts.includes(alert.id) ? 'bg-[#0f1e36]' : ''}`}>
                          <TableCell>
                            <div className={`flex items-center justify-center p-1 rounded-full ${getSeverityDetails(alert.severity).bgColor}`}>
                              {getSeverityDetails(alert.severity).icon}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div 
                              className="flex items-center cursor-pointer" 
                              onClick={() => toggleAlertExpansion(alert.id)}
                            >
                              {expandedAlerts.includes(alert.id) ? (
                                <ChevronUp className="h-4 w-4 mr-2 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                              )}
                              <div>
                                <div className="font-medium">{alert.title}</div>
                                <div className="text-xs text-gray-400">{alert.description.substring(0, 60)}{alert.description.length > 60 ? '...' : ''}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getStatusDetails(alert.status).bgColor} ${getStatusDetails(alert.status).textColor}`}>
                              {getStatusDetails(alert.status).icon}
                              <span>{alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}</span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(alert.category)}
                              <span>{alert.source}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{formatTimestamp(alert.timestamp)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {alert.assignedTo ? alert.assignedTo : (
                              <span className="text-gray-400">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`${alert.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[#050b17]'}`}
                              >
                                {alert.status === 'resolved' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {expandedAlerts.includes(alert.id) && (
                          <TableRow className="bg-[#0f1e36] border-b-[#4a89dc]/20">
                            <TableCell colSpan={7}>
                              <div className="p-3 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="col-span-2">
                                    <h4 className="font-medium mb-2">Alert Details</h4>
                                    <div className={`p-3 rounded-md ${getSeverityDetails(alert.severity).bgColor} ${getSeverityDetails(alert.severity).borderColor} border`}>
                                      <p className="text-sm">{alert.description}</p>
                                    </div>
                                    
                                    <div className="mt-4 space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Alert ID:</span>
                                        <span>#{alert.id}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Category:</span>
                                        <span>{alert.category.charAt(0).toUpperCase() + alert.category.slice(1)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Detected At:</span>
                                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Actions</h4>
                                    <div className="space-y-2">
                                      <Button className="w-full flex justify-between items-center bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                                        <span>Assign to Me</span>
                                        <Users className="h-4 w-4" />
                                      </Button>
                                      {alert.status !== 'resolved' ? (
                                        <Button variant="outline" className="w-full flex justify-between items-center">
                                          <span>Mark as Resolved</span>
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      ) : (
                                        <Button variant="outline" className="w-full flex justify-between items-center bg-green-500/10 text-green-500 border-green-500/20">
                                          <span>Resolved</span>
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button variant="outline" className="w-full flex justify-between items-center">
                                        <span>View Logs</span>
                                        <Search className="h-4 w-4" />
                                      </Button>
                                      <Button variant="outline" className="w-full flex justify-between items-center">
                                        <span>Send Notification</span>
                                        <MailCheck className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                
                                {alert.status !== 'resolved' && (
                                  <div className="pt-4 border-t border-[#4a89dc]/20">
                                    <h4 className="font-medium mb-2">Recommended Actions</h4>
                                    <div className="bg-[#050b17] p-3 rounded-md text-sm">
                                      {alert.category === 'api' && 'Check API usage patterns and consider increasing rate limits or implementing more aggressive caching.'}
                                      {alert.category === 'database' && 'Investigate database connection pool settings and check for slow queries that might be causing timeout issues.'}
                                      {alert.category === 'security' && 'Review access logs and consider temporary IP blocking if pattern continues. Update security policies if needed.'}
                                      {alert.category === 'system' && 'Analyze resource usage trends and consider scaling up infrastructure or optimizing resource-intensive operations.'}
                                      {alert.category === 'payment' && 'Verify webhook endpoint configuration and review recent transaction logs for patterns.'}
                                      {alert.category === 'service' && 'Check service dependencies and queue processing metrics. Consider scaling service if under heavy load.'}
                                      {alert.category === 'storage' && 'Review storage usage trends and cleanup unused assets. Consider upgrading storage allocation.'}
                                    </div>
                                  </div>
                                )}
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
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <Card className="bg-[#0a1328] border-[#4a89dc]/20">
              <CardHeader>
                <CardTitle>Alert Timeline</CardTitle>
                <CardDescription className="text-gray-400">
                  Chronological view of system alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#4a89dc]/20">
                  {sortedAlerts.map((alert, index) => {
                    const { bgColor, textColor, icon } = getSeverityDetails(alert.severity);
                    return (
                      <div key={alert.id} className="relative">
                        <div className={`absolute left-[-24px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${bgColor} ${textColor}`}>
                          {icon}
                        </div>
                        <div className={`p-4 rounded-md bg-[#050b17] border ${getSeverityDetails(alert.severity).borderColor}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{alert.title}</h4>
                              <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusDetails(alert.status).bgColor} ${getStatusDetails(alert.status).textColor}`}>
                              {getStatusDetails(alert.status).icon}
                              <span>{alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}</span>
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(alert.category)}
                              <span>{alert.source}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-[#0a1328] border-[#4a89dc]/20">
              <CardHeader>
                <CardTitle>Alert Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Insights and trends for system alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Alerts by Severity</h3>
                    <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex flex-col justify-center">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              Critical
                            </span>
                            <span className="text-gray-400">{criticalAlerts}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${(criticalAlerts / alerts.length) * 100}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                              High
                            </span>
                            <span className="text-gray-400">{highAlerts}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(highAlerts / alerts.length) * 100}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              Medium
                            </span>
                            <span className="text-gray-400">{mediumAlerts}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(mediumAlerts / alerts.length) * 100}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              Low
                            </span>
                            <span className="text-gray-400">{lowAlerts}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(lowAlerts / alerts.length) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Alerts by Category</h3>
                    <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-400">Pie chart visualization would be displayed here</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Alert Resolution Time</h3>
                    <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-400">Timeline chart visualization would be displayed here</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Alert Trend (Last 30 Days)</h3>
                    <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-400">Trend chart visualization would be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Alert Resolution Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                      <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">Average Resolution Time</div>
                        <div className="text-2xl font-bold">2h 15m</div>
                        <div className="text-xs text-green-500 mt-1">12% faster than last month</div>
                      </div>
                    </div>
                    
                    <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                      <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">Resolution Rate</div>
                        <div className="text-2xl font-bold">94.2%</div>
                        <div className="text-xs text-green-500 mt-1">+2.8% from last month</div>
                      </div>
                    </div>
                    
                    <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                      <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">Monthly Alerts</div>
                        <div className="text-2xl font-bold">42</div>
                        <div className="text-xs text-red-500 mt-1">+8 from last month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlertsCenter;