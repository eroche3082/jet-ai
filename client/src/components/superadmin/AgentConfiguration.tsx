import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, Settings, Cloud, Lock, AlertCircle, RefreshCw, Edit } from 'lucide-react';

const agents = [
  { 
    id: 1, 
    name: 'JET AI', 
    type: 'Travel Assistant',
    status: 'Active',
    version: '2.4.1',
    lastUpdate: '2025-04-12',
    features: ['Google Gemini Integration', 'OpenAI GPT-4o Fallback', 'Claude 3 Sonnet Support'],
    users: 6321,
    url: 'jetai.replit.app',
    deployed: true
  },
  { 
    id: 2, 
    name: 'CryptoBot', 
    type: 'Finance Assistant',
    status: 'Active',
    version: '1.9.3',
    lastUpdate: '2025-04-10',
    features: ['Real-time Trading', 'Market Analysis', 'Portfolio Management'],
    users: 2458,
    url: 'cryptobot.replit.app',
    deployed: true
  },
  { 
    id: 3, 
    name: 'FitnessAI', 
    type: 'Health Coach',
    status: 'Active',
    version: '1.5.2',
    lastUpdate: '2025-04-08',
    features: ['Workout Plans', 'Nutrition Tracking', 'Progress Monitoring'],
    users: 3154,
    url: 'fitnessai.replit.app',
    deployed: true
  },
  { 
    id: 4, 
    name: 'SportsAI', 
    type: 'Sports Analytics',
    status: 'Maintenance',
    version: '1.2.0',
    lastUpdate: '2025-04-01',
    features: ['Game Predictions', 'Player Statistics', 'Live Scores'],
    users: 1782,
    url: 'sportsai.replit.app',
    deployed: true
  },
  { 
    id: 5, 
    name: 'ShopAI', 
    type: 'Shopping Assistant',
    status: 'Active',
    version: '2.1.0',
    lastUpdate: '2025-04-05',
    features: ['Product Recommendations', 'Price Tracking', 'Deal Alerts'],
    users: 4120,
    url: 'shopai.replit.app',
    deployed: true
  },
  { 
    id: 6, 
    name: 'EduAI', 
    type: 'Education Assistant',
    status: 'Development',
    version: '0.9.5',
    lastUpdate: '2025-04-14',
    features: ['Personalized Learning', 'Quiz Generation', 'Resource Recommendations'],
    users: 845,
    url: 'eduai.replit.app',
    deployed: false
  }
];

const AgentConfiguration: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{agents.length}</div>
            <p className="text-xs text-green-500">All systems operational</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{agents.filter(agent => agent.status === 'Active').length}</div>
            <p className="text-xs text-green-500">Ready and available</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{agents.reduce((sum, agent) => sum + agent.users, 0).toLocaleString()}</div>
            <p className="text-xs text-green-500">Across all platforms</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Latest Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">April 14</div>
            <p className="text-xs text-gray-400">EduAI v0.9.5</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-[#0a1328] border-[#4a89dc]/20 mb-6">
        <CardHeader>
          <CardTitle>Agent Management</CardTitle>
          <CardDescription className="text-gray-400">
            Configure and monitor all AI agents across the platform ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                <TableHead className="text-[#4a89dc]">Agent</TableHead>
                <TableHead className="text-[#4a89dc]">Status</TableHead>
                <TableHead className="text-[#4a89dc]">Users</TableHead>
                <TableHead className="text-[#4a89dc]">Version</TableHead>
                <TableHead className="text-[#4a89dc]">Last Update</TableHead>
                <TableHead className="text-[#4a89dc]">URL</TableHead>
                <TableHead className="text-[#4a89dc]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-white">{agent.name}</span>
                      <span className="text-xs text-gray-400">{agent.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        agent.status === 'Active' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' :
                        agent.status === 'Maintenance' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' :
                        'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
                      }
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.users.toLocaleString()}</TableCell>
                  <TableCell>v{agent.version}</TableCell>
                  <TableCell>{agent.lastUpdate}</TableCell>
                  <TableCell>
                    {agent.deployed ? (
                      <a 
                        href={`https://${agent.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#4a89dc] hover:underline"
                      >
                        {agent.url}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not deployed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
                        <DialogHeader>
                          <DialogTitle>Configure {agent.name}</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Manage settings and permissions for this agent.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Agent Status</Label>
                                <p className="text-xs text-gray-400">Enable/disable this agent</p>
                              </div>
                              <Switch defaultChecked={agent.status === 'Active'} />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="version">Version</Label>
                              <Input id="version" value={`v${agent.version}`} className="bg-[#050b17] border-[#4a89dc]/20" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Features</Label>
                              <div className="space-y-2">
                                {agent.features.map((feature, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm">{feature}</span>
                                    <Switch defaultChecked />
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Security Level</Label>
                              <div className="flex items-center space-x-4">
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <Lock className="h-4 w-4 mr-2" /> Standard
                                  <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="flex space-x-2">
                          <Button variant="outline" className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2" /> Restart Agent
                          </Button>
                          <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-[#4a89dc]" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">Firebase Auth</div>
                  <div className="text-xs text-gray-400">Authentication service</div>
                </div>
                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                  Operational
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">Firebase Hosting</div>
                  <div className="text-xs text-gray-400">Web hosting platform</div>
                </div>
                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                  Operational
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">Firebase Functions</div>
                  <div className="text-xs text-gray-400">Serverless functions</div>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
                  Degraded
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">Google Vertex AI</div>
                  <div className="text-xs text-gray-400">AI/ML platform</div>
                </div>
                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                  Operational
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">OpenAI API</div>
                  <div className="text-xs text-gray-400">AI models API</div>
                </div>
                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                  Operational
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">Stripe API</div>
                  <div className="text-xs text-gray-400">Payment processing</div>
                </div>
                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-[#4a89dc]" />
              Recent Agent Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-yellow-500/20 rounded-md bg-yellow-500/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">Firebase Functions Degraded</div>
                  <div className="text-xs text-gray-400">2 hours ago</div>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Firebase Functions experiencing increased latency in the us-central1 region. This may affect serverless operations.
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border border-green-500/20 rounded-md bg-green-500/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">SportsAI Maintenance</div>
                  <div className="text-xs text-gray-400">2 days ago</div>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Scheduled maintenance for SportsAI to update prediction algorithms and improve accuracy.
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border border-red-500/20 rounded-md bg-red-500/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">API Rate Limit Exceeded</div>
                  <div className="text-xs text-gray-400">3 days ago</div>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  CryptoBot exceeded OpenAI API rate limits due to increased user activity. Issue resolved by increasing quota.
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AgentConfiguration;