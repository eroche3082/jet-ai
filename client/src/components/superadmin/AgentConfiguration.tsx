import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Settings, Bot, Code, Gauge, Power, Cpu, Brain, Sparkles, MessageSquare, Edit, Trash2 } from 'lucide-react';

// Mock data for the AI models
const availableModels = [
  { 
    id: 'gemini-1.5-flash', 
    name: 'Gemini 1.5 Flash', 
    provider: 'Google', 
    type: 'text',
    context: 'Up to 128k tokens',
    status: 'active',
    costPerToken: '$0.00035'
  },
  { 
    id: 'gemini-1.5-pro', 
    name: 'Gemini 1.5 Pro', 
    provider: 'Google', 
    type: 'multimodal',
    context: 'Up to 128k tokens',
    status: 'active',
    costPerToken: '$0.00070'
  },
  { 
    id: 'gpt-4o', 
    name: 'GPT-4o', 
    provider: 'OpenAI', 
    type: 'multimodal',
    context: 'Up to 128k tokens',
    status: 'active',
    costPerToken: '$0.00050'
  },
  { 
    id: 'claude-3.7-sonnet', 
    name: 'Claude 3.7 Sonnet', 
    provider: 'Anthropic', 
    type: 'multimodal',
    context: 'Up to 200k tokens',
    status: 'active',
    costPerToken: '$0.00075'
  }
];

// Mock data for agent configurations
const agentConfigurations = [
  {
    id: 'travel-concierge',
    name: 'Travel Concierge',
    description: 'Main assistant for travel planning and recommendations',
    primaryModel: 'gemini-1.5-pro',
    fallbackModel: 'gpt-4o',
    active: true,
    prompt: 'You are JET AI, an emotionally intelligent multilingual travel assistant...',
    temperature: 0.7,
    requestsPerDay: 5280,
    avgResponseTime: '1.2s'
  },
  {
    id: 'itinerary-builder',
    name: 'Itinerary Builder',
    description: 'Specialized agent for creating detailed travel itineraries',
    primaryModel: 'claude-3.7-sonnet',
    fallbackModel: 'gpt-4o',
    active: true,
    prompt: 'You are an expert travel planner specialized in creating detailed itineraries...',
    temperature: 0.5,
    requestsPerDay: 2150,
    avgResponseTime: '2.1s'
  },
  {
    id: 'flight-finder',
    name: 'Flight Finder',
    description: 'Agent specialized in finding and recommending flights',
    primaryModel: 'gemini-1.5-flash',
    fallbackModel: 'gpt-4o',
    active: true,
    prompt: 'You are a flight search specialist with extensive knowledge of airlines...',
    temperature: 0.3,
    requestsPerDay: 3410,
    avgResponseTime: '0.8s'
  },
  {
    id: 'hotel-recommender',
    name: 'Hotel Recommender',
    description: 'Agent for hotel and accommodation recommendations',
    primaryModel: 'gemini-1.5-pro',
    fallbackModel: 'claude-3.7-sonnet',
    active: true,
    prompt: 'You are a hotel and accommodation expert with detailed knowledge...',
    temperature: 0.6,
    requestsPerDay: 2840,
    avgResponseTime: '1.5s'
  }
];

const AgentConfiguration: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('agents');
  
  const selectedAgentData = agentConfigurations.find(agent => agent.id === selectedAgent);

  return (
    <Tabs defaultValue="agents" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList className="bg-[#050b17]">
        <TabsTrigger value="agents" className="flex items-center gap-2">
          <Bot className="h-4 w-4" /> AI Agents
        </TabsTrigger>
        <TabsTrigger value="models" className="flex items-center gap-2">
          <Brain className="h-4 w-4" /> AI Models
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Gauge className="h-4 w-4" /> Performance
        </TabsTrigger>
        <TabsTrigger value="prompts" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> System Prompts
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="agents" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">AI Agent Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New AI Agent</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Configure a new AI agent for specialized tasks within JET AI
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agentId" className="text-right">
                    Agent ID
                  </Label>
                  <Input id="agentId" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="unique-agent-id" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agentName" className="text-right">
                    Agent Name
                  </Label>
                  <Input id="agentName" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="New Agent Name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agentDescription" className="text-right">
                    Description
                  </Label>
                  <Input id="agentDescription" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20" placeholder="Purpose and role of this agent" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="primaryModel" className="text-right">
                    Primary Model
                  </Label>
                  <Select>
                    <SelectTrigger id="primaryModel" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fallbackModel" className="text-right">
                    Fallback Model
                  </Label>
                  <Select>
                    <SelectTrigger id="fallbackModel" className="col-span-3 bg-[#050b17] border-[#4a89dc]/20">
                      <SelectValue placeholder="Select fallback model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="temperature" className="text-right">
                    Temperature
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input id="temperature" type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="bg-[#050b17] border-[#4a89dc]/20" />
                    <span className="min-w-8 text-center">0.7</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="systemPrompt" className="text-right pt-2">
                    System Prompt
                  </Label>
                  <textarea 
                    id="systemPrompt" 
                    className="col-span-3 bg-[#050b17] border-[#4a89dc]/20 rounded-md p-2 min-h-32" 
                    placeholder="Enter the system prompt that defines this agent's behavior and capabilities..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Create Agent</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableHead className="text-[#4a89dc]">Agent</TableHead>
                  <TableHead className="text-[#4a89dc]">Models</TableHead>
                  <TableHead className="text-[#4a89dc]">Status</TableHead>
                  <TableHead className="text-[#4a89dc]">Requests</TableHead>
                  <TableHead className="text-[#4a89dc]">Avg. Response</TableHead>
                  <TableHead className="text-[#4a89dc]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentConfigurations.map((agent) => (
                  <TableRow key={agent.id} className={`hover:bg-[#0f1e36] border-b-[#4a89dc]/20 ${selectedAgent === agent.id ? 'bg-[#0f1e36]' : ''}`}>
                    <TableCell className="font-medium">
                      <div>{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{availableModels.find(m => m.id === agent.primaryModel)?.name || agent.primaryModel}</div>
                      <div className="text-xs text-gray-400">Fallback: {availableModels.find(m => m.id === agent.fallbackModel)?.name || agent.fallbackModel}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${agent.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {agent.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{agent.requestsPerDay.toLocaleString()}/day</TableCell>
                    <TableCell>{agent.avgResponseTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedAgent(agent.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Power className={`h-4 w-4 ${agent.active ? 'text-green-500' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {selectedAgent && selectedAgentData && (
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedAgentData.name} Configuration</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed configuration and performance metrics
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedAgent(null)}>Close</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="config">
                <TabsList className="bg-[#050b17]">
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                </TabsList>
                
                <TabsContent value="config" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-primaryModel">Primary Model</Label>
                      <Select defaultValue={selectedAgentData.primaryModel}>
                        <SelectTrigger id="edit-primaryModel" className="bg-[#050b17] border-[#4a89dc]/20">
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map(model => (
                            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-fallbackModel">Fallback Model</Label>
                      <Select defaultValue={selectedAgentData.fallbackModel}>
                        <SelectTrigger id="edit-fallbackModel" className="bg-[#050b17] border-[#4a89dc]/20">
                          <SelectValue placeholder="Select fallback model" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map(model => (
                            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-temperature">Temperature</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="edit-temperature" 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          defaultValue={selectedAgentData.temperature.toString()} 
                          className="bg-[#050b17] border-[#4a89dc]/20" 
                        />
                        <span className="min-w-8 text-center">{selectedAgentData.temperature}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <div className="flex items-center pt-2">
                        <Switch 
                          id="edit-status" 
                          checked={selectedAgentData.active} 
                          className="data-[state=checked]:bg-[#4a89dc]"
                        />
                        <Label htmlFor="edit-status" className="ml-2">
                          {selectedAgentData.active ? 'Active' : 'Inactive'}
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input 
                      id="edit-description" 
                      defaultValue={selectedAgentData.description} 
                      className="bg-[#050b17] border-[#4a89dc]/20" 
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="metrics" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Daily Requests</h3>
                      <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                        <p className="text-gray-400">Request volume chart would be rendered here</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Response Times</h3>
                      <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                        <p className="text-gray-400">Response time chart would be rendered here</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <h3 className="font-medium mb-3">Usage Metrics</h3>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="text-sm text-gray-400">Daily Requests</div>
                          <div className="text-2xl font-bold text-white mt-1">{selectedAgentData.requestsPerDay.toLocaleString()}</div>
                        </div>
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="text-sm text-gray-400">Avg Response Time</div>
                          <div className="text-2xl font-bold text-white mt-1">{selectedAgentData.avgResponseTime}</div>
                        </div>
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="text-sm text-gray-400">Success Rate</div>
                          <div className="text-2xl font-bold text-white mt-1">98.7%</div>
                        </div>
                        <div className="bg-[#050b17] p-4 rounded-md border border-[#4a89dc]/20">
                          <div className="text-sm text-gray-400">Daily Cost</div>
                          <div className="text-2xl font-bold text-white mt-1">$42.80</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="prompt" className="mt-4">
                  <div className="space-y-3">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <div className="relative">
                      <textarea 
                        id="system-prompt" 
                        className="w-full min-h-[300px] bg-[#050b17] border border-[#4a89dc]/20 rounded-md p-4 font-mono text-sm" 
                        defaultValue={selectedAgentData.prompt}
                      />
                      <Button className="absolute top-2 right-2 bg-[#050b17] hover:bg-[#0f1e36] border border-[#4a89dc]/20" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm">Restore Default</Button>
                      <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white" size="sm">Save Prompt</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Changes</Button>
              <Button variant="outline">Reset Configuration</Button>
            </CardFooter>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="models" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>AI Model Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Manage available AI models and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                  <TableHead className="text-[#4a89dc]">Model</TableHead>
                  <TableHead className="text-[#4a89dc]">Provider</TableHead>
                  <TableHead className="text-[#4a89dc]">Type</TableHead>
                  <TableHead className="text-[#4a89dc]">Context</TableHead>
                  <TableHead className="text-[#4a89dc]">Cost</TableHead>
                  <TableHead className="text-[#4a89dc]">Status</TableHead>
                  <TableHead className="text-[#4a89dc]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableModels.map((model) => (
                  <TableRow key={model.id} className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.provider}</TableCell>
                    <TableCell>{model.type}</TableCell>
                    <TableCell>{model.context}</TableCell>
                    <TableCell>{model.costPerToken}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${model.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {model.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Power className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Model
            </Button>
            <Button variant="outline">Configure API Keys</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>AI Performance Monitoring</CardTitle>
            <CardDescription className="text-gray-400">
              Monitor and optimize AI agent performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-[#050b17] border-[#4a89dc]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Avg Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">1.4s</div>
                  <p className="text-sm text-green-500">12% faster than last week</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#050b17] border-[#4a89dc]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">98.7%</div>
                  <p className="text-sm text-green-500">1.2% improvement</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#050b17] border-[#4a89dc]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Daily Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">15,420</div>
                  <p className="text-sm text-green-500">+23% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#050b17] border-[#4a89dc]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Daily Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">$184.50</div>
                  <p className="text-sm text-red-500">+18% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Response Time by Model</h3>
                <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                  <p className="text-gray-400">Response time chart would be rendered here</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Daily Usage by Agent</h3>
                <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                  <p className="text-gray-400">Usage chart would be rendered here</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Performance Optimization</h3>
              
              <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
                <div>
                  <h3 className="font-medium">Automatic Model Selection</h3>
                  <p className="text-sm text-gray-400">Dynamically choose models based on query complexity</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
                <div>
                  <h3 className="font-medium">Prompt Caching</h3>
                  <p className="text-sm text-gray-400">Cache common responses to reduce API calls</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
                <div>
                  <h3 className="font-medium">Result Throttling</h3>
                  <p className="text-sm text-gray-400">Limit requests during high demand periods</p>
                </div>
                <Switch className="data-[state=checked]:bg-[#4a89dc]" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Optimization Settings</Button>
            <Button variant="outline">View Detailed Analytics</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="prompts" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>System Prompts Library</CardTitle>
            <CardDescription className="text-gray-400">
              Manage and organize system prompts for different AI agent roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">Travel Concierge</h3>
                    <p className="text-sm text-gray-400 mt-1">Core prompt for main travel assistant interactions</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" /> Optimize
                    </Button>
                  </div>
                </div>
                <div className="mt-4 bg-[#0a1328] p-3 rounded border border-[#4a89dc]/30 font-mono text-xs text-gray-300 max-h-40 overflow-y-auto">
                  <code>You are JET AI, an emotionally intelligent multilingual travel assistant trained on the most advanced AI systems. Your purpose is to help travelers plan their journeys, discover destinations, and enhance their travel experiences through personalized recommendations and detailed knowledge.</code>
                </div>
              </div>
              
              <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">Itinerary Builder</h3>
                    <p className="text-sm text-gray-400 mt-1">Specialized prompt for creating detailed travel itineraries</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" /> Optimize
                    </Button>
                  </div>
                </div>
                <div className="mt-4 bg-[#0a1328] p-3 rounded border border-[#4a89dc]/30 font-mono text-xs text-gray-300 max-h-40 overflow-y-auto">
                  <code>You are an expert travel planner specialized in creating detailed itineraries that balance efficiency, enjoyment, and cultural exploration. Your itineraries should include transportation details, time estimates, budget considerations, and insider tips for each destination.</code>
                </div>
              </div>
              
              <div className="bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">Flight Finder</h3>
                    <p className="text-sm text-gray-400 mt-1">Specialized prompt for flight search and recommendations</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" /> Optimize
                    </Button>
                  </div>
                </div>
                <div className="mt-4 bg-[#0a1328] p-3 rounded border border-[#4a89dc]/30 font-mono text-xs text-gray-300 max-h-40 overflow-y-auto">
                  <code>You are a flight search specialist with extensive knowledge of airlines, routes, pricing strategies, and airport logistics. Your goal is to find the best flight options considering price, duration, comfort, reliability, and the user's specific preferences.</code>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Prompt Template
            </Button>
            <Button variant="outline">Import/Export Library</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AgentConfiguration;