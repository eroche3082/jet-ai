import React, { useState, useEffect } from 'react';
import { 
  AgentMemory, 
  MemoryLog, 
  getAgentMemory, 
  updateAgentMemory, 
  addMemoryLog, 
  getRecentMemoryLogs, 
  exportAgentMemory, 
  createMemoryBackup 
} from '@/lib/agentMemoryService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Download, Save, Plus, RefreshCw, History, FileText, Database, Clock, Award } from 'lucide-react';
import copy from 'copy-to-clipboard';

const MemoryViewer: React.FC<{ userId: string }> = ({ userId }) => {
  const { toast } = useToast();
  const [memory, setMemory] = useState<AgentMemory | null>(null);
  const [logs, setLogs] = useState<MemoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportedJson, setExportedJson] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newLog, setNewLog] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load memory and logs data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const memoryData = await getAgentMemory();
        setMemory(memoryData);
        
        const logsData = await getRecentMemoryLogs(100);
        setLogs(logsData);
      } catch (error) {
        console.error('Error loading memory data:', error);
        toast({
          title: "Error",
          description: "Failed to load agent memory data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [refreshTrigger, toast]);
  
  // When Export tab is selected, generate exportable JSON
  useEffect(() => {
    if (activeTab === 'export' && memory) {
      const getExportData = async () => {
        const jsonData = await exportAgentMemory();
        setExportedJson(jsonData);
      };
      
      getExportData();
    }
  }, [activeTab, memory]);
  
  // Handle add new important prompt
  const handleAddPrompt = async () => {
    if (!newPrompt.trim()) return;
    
    try {
      const result = await addImportantPrompt(newPrompt, userId);
      
      if (result) {
        toast({
          title: "Success",
          description: "Important prompt added to agent memory",
        });
        
        setNewPrompt('');
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to add prompt');
      }
    } catch (error) {
      console.error('Error adding prompt:', error);
      toast({
        title: "Error",
        description: "Failed to add important prompt",
        variant: "destructive",
      });
    }
  };
  
  // Handle add new memory log
  const handleAddLog = async () => {
    if (!newLog.trim()) return;
    
    try {
      const result = await addMemoryLog(newLog, userId);
      
      if (result) {
        toast({
          title: "Success",
          description: "Log entry added to agent memory",
        });
        
        setNewLog('');
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to add log');
      }
    } catch (error) {
      console.error('Error adding log:', error);
      toast({
        title: "Error",
        description: "Failed to add log entry",
        variant: "destructive",
      });
    }
  };
  
  // Handle create backup
  const handleCreateBackup = async () => {
    try {
      const backupId = await createMemoryBackup(userId);
      
      if (backupId) {
        toast({
          title: "Backup Created",
          description: `Memory backup created successfully with ID: ${backupId}`,
        });
      } else {
        throw new Error('Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "Error",
        description: "Failed to create memory backup",
        variant: "destructive",
      });
    }
  };
  
  // Copy JSON to clipboard
  const handleCopyJson = () => {
    if (exportedJson) {
      copy(exportedJson);
      toast({
        title: "Copied",
        description: "Memory data copied to clipboard",
      });
    }
  };
  
  // Format timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading memory data...</p>
        </div>
      </div>
    );
  }
  
  if (!memory) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Memory Error</CardTitle>
            <CardDescription>Could not load agent memory</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Failed to load JET AI memory data. Please try again or check Firestore settings.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setRefreshTrigger(prev => prev + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Memory System</h2>
          <p className="text-muted-foreground">
            View and manage JET AI's development history and configuration memory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setRefreshTrigger(prev => prev + 1)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleCreateBackup}>
            <Database className="mr-2 h-4 w-4" />
            Create Backup
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">
            <Award className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="memory-logs">
            <Clock className="mr-2 h-4 w-4" />
            Memory Logs
          </TabsTrigger>
          <TabsTrigger value="important-prompts">
            <FileText className="mr-2 h-4 w-4" />
            Important Prompts
          </TabsTrigger>
          <TabsTrigger value="activity">
            <History className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="mr-2 h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Agent Details */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Details</CardTitle>
                <CardDescription>Basic information about JET AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Agent Name</Label>
                    <p className="text-lg font-semibold">{memory.agent_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Version</Label>
                    <p className="text-lg font-semibold">{memory.version}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <p className="text-md">{memory.role}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Deployment Status</Label>
                  <Badge variant={memory.deployment_status === 'deployed' ? 'default' : 'secondary'} className="mt-1">
                    {memory.deployment_status}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(memory.last_updated)}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Features</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {memory.superadmin_enabled && (
                      <Badge variant="outline">SuperAdmin</Badge>
                    )}
                    {memory.editor_enabled && (
                      <Badge variant="outline">Visual Editor</Badge>
                    )}
                    {memory.onboarding_flow === 'enabled' && (
                      <Badge variant="outline">Onboarding Flow</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Design Details */}
            <Card>
              <CardHeader>
                <CardTitle>Design Configuration</CardTitle>
                <CardDescription>UI/UX settings stored in agent memory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Theme</Label>
                    <p className="text-lg font-semibold capitalize">{memory.design.theme}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Button Style</Label>
                    <p className="text-lg font-semibold capitalize">{memory.design.button_style}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Primary Color</Label>
                  <div className="flex items-center mt-1">
                    <div 
                      className="h-6 w-6 rounded-full mr-2 border" 
                      style={{ backgroundColor: memory.design.primary_color }}
                    ></div>
                    <code className="text-sm">{memory.design.primary_color}</code>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Font</Label>
                  <p 
                    className="text-md font-semibold" 
                    style={{ fontFamily: memory.design.font }}
                  >
                    {memory.design.font}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Homepage CTA</Label>
                  <p className="text-md">{memory.homepage.cta_text}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Homepage Sections</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {memory.homepage.sections.map((section, index) => (
                      <Badge key={index} variant="secondary">{section}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Connections */}
            <Card>
              <CardHeader>
                <CardTitle>Connected APIs</CardTitle>
                <CardDescription>External services connected to JET AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {memory.connected_apis.map((api, index) => (
                    <Badge key={index}>{api}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Memory Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Memory Statistics</CardTitle>
                <CardDescription>Memory system overview and stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Important Prompts</Label>
                    <p className="text-2xl font-bold">{memory.important_prompts.length}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Log Dates</Label>
                    <p className="text-2xl font-bold">{Object.keys(memory.memory_logs).length}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Total Log Entries</Label>
                  <p className="text-xl font-semibold">
                    {Object.values(memory.memory_logs).reduce((sum, logs) => sum + logs.length, 0)}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Recent Activity</Label>
                  <div className="mt-2">
                    {logs.slice(0, 3).map((log, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-muted-foreground mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                        <div>
                          <span>{log.action}</span>
                          <span className="text-xs block">{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Memory Logs Tab */}
        <TabsContent value="memory-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Logs</CardTitle>
              <CardDescription>Development history by date</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {Object.entries(memory.memory_logs)
                  .sort((a, b) => b[0].localeCompare(a[0])) // Sort by date descending
                  .map(([date, logs]) => (
                    <div key={date} className="mb-6">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="mr-2">{date}</Badge>
                        <Separator className="flex-1" />
                      </div>
                      <ul className="space-y-2 ml-4">
                        {logs.map((log, index) => (
                          <li key={index} className="text-sm">
                            <div className="flex items-start">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                              {log}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="space-y-2 w-full">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="new-log">Add New Log Entry</Label>
                    <Input 
                      id="new-log" 
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      placeholder="Enter development log entry"
                    />
                  </div>
                  <Button onClick={handleAddLog} disabled={!newLog.trim()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Log
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  New logs will be added to today's date in the memory system.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Important Prompts Tab */}
        <TabsContent value="important-prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Important Prompts</CardTitle>
              <CardDescription>Significant development instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {memory.important_prompts.map((prompt, index) => (
                    <div key={index} className="p-4 border rounded">
                      <Badge className="mb-2">{`Prompt ${index + 1}`}</Badge>
                      <p className="whitespace-pre-wrap">{prompt}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="space-y-2 w-full">
                <div className="space-y-2">
                  <Label htmlFor="new-prompt">Add Important Prompt</Label>
                  <Textarea 
                    id="new-prompt" 
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Enter important development prompt"
                    className="min-h-[100px]"
                  />
                </div>
                <Button 
                  onClick={handleAddPrompt} 
                  disabled={!newPrompt.trim()} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Important Prompt
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Activity Log</CardTitle>
              <CardDescription>Recent changes to agent memory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.userId.substring(0, 8)}</TableCell>
                      <TableCell>
                        {log.details ? (
                          typeof log.details === 'string' 
                            ? log.details 
                            : JSON.stringify(log.details).substring(0, 50)
                        ) : (
                          <span className="text-muted-foreground text-sm">No details</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Memory</CardTitle>
              <CardDescription>Export JET AI memory as JSON</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded bg-muted/40">
                  <div className="flex justify-between mb-2">
                    <Label>Agent Memory JSON</Label>
                    <Button variant="ghost" size="sm" onClick={handleCopyJson}>
                      Copy JSON
                    </Button>
                  </div>
                  <ScrollArea className="h-[400px] w-full">
                    <pre className="text-xs p-2 whitespace-pre-wrap break-all">
                      {exportedJson}
                    </pre>
                  </ScrollArea>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleCreateBackup} className="mr-2">
                    <Database className="mr-2 h-4 w-4" />
                    Create Backup
                  </Button>
                  
                  <Button 
                    variant="default" 
                    onClick={() => {
                      const blob = new Blob([exportedJson], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `jetai-memory-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Import missing function from service
import { addImportantPrompt } from '@/lib/agentMemoryService';

export default MemoryViewer;