import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader2, Save, Video, Upload, RefreshCw, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Avatar {
  id: string;
  name: string;
  pose_name: string;
  thumbnail: string;
  created_at: number;
  voice_id: string;
  is_interactive: boolean;
  gender: string;
  attitude: string;
  is_enabled?: boolean;
}

interface ApiKeys {
  openai: string;
  heygen: string;
  elevenlabs: string;
}

interface Settings {
  enableAvatars: boolean;
  defaultAvatar: string;
  maxTokens: number;
  temperature: number;
}

interface AvatarConfig {
  apiKeys: ApiKeys;
  settings: Settings;
  enabledAvatarIds: string[];
}

const AvatarConfiguration: React.FC = () => {
  const { toast } = useToast();
  
  // State for the configuration
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: '',
    heygen: '',
    elevenlabs: ''
  });
  
  const [settings, setSettings] = useState<Settings>({
    enableAvatars: false,
    defaultAvatar: '',
    maxTokens: 1000,
    temperature: 0.7
  });
  
  const [enabledAvatarIds, setEnabledAvatarIds] = useState<string[]>([]);
  
  // Fetch avatar configuration
  const { data: configData, isLoading: isLoadingConfig, error: configError } = useQuery({
    queryKey: ['/api/avatar/config'],
    queryFn: async () => {
      const response = await fetch('/api/avatar/config');
      if (!response.ok) {
        throw new Error('Failed to fetch avatar configuration');
      }
      return response.json();
    }
  });
  
  // Fetch available avatars
  const { data: avatarsData, isLoading: isLoadingAvatars, error: avatarsError } = useQuery({
    queryKey: ['/api/avatar/list'],
    queryFn: async () => {
      const response = await fetch('/api/avatar/list');
      if (!response.ok) {
        throw new Error('Failed to fetch avatar list');
      }
      return response.json();
    }
  });
  
  // Update configuration when data is loaded
  useEffect(() => {
    if (configData?.config) {
      setApiKeys(configData.config.apiKeys);
      setSettings(configData.config.settings);
      setEnabledAvatarIds(configData.config.enabledAvatarIds);
    }
  }, [configData]);
  
  // Mutation for updating the configuration
  const updateConfigMutation = useMutation({
    mutationFn: async (data: { apiKeys: ApiKeys, settings: Settings, enabledAvatarIds: string[] }) => {
      const response = await apiRequest('POST', '/api/avatar/config', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/avatar/config'] });
      toast({
        title: "Configuration Updated",
        description: "Avatar configuration has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update avatar configuration: " + error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle save configuration
  const handleSaveConfig = () => {
    updateConfigMutation.mutate({
      apiKeys,
      settings,
      enabledAvatarIds
    });
  };
  
  // Handle avatar toggle
  const handleAvatarToggle = (avatarId: string, enabled: boolean) => {
    if (enabled) {
      setEnabledAvatarIds([...enabledAvatarIds, avatarId]);
    } else {
      setEnabledAvatarIds(enabledAvatarIds.filter(id => id !== avatarId));
    }
  };
  
  // Handle refresh avatars
  const refreshAvatarsList = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/avatar/list'] });
  };
  
  // Process avatars data to include enabled status
  const processedAvatars = avatarsData?.success ? 
    avatarsData.avatars.map((avatar: Avatar) => ({
      ...avatar,
      is_enabled: enabledAvatarIds.includes(avatar.id)
    })) : [];
  
  // Handle avatar edit
  const handleEditAvatar = (avatar: Avatar) => {
    toast({
      title: "Avatar Editor",
      description: `This feature requires direct access to the LiveSmart AI interface. You would normally be redirected to edit ${avatar.name}.`,
      variant: "default",
    });
  };
  
  // Render
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6" /> LiveSmart AI Video Avatars Configuration
          </CardTitle>
          <CardDescription>
            Configure AI video avatar integration for JET AI platform
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="api-keys" className="px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="avatars">Avatars Manager</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-keys" className="mt-0">
            <CardContent className="px-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key (for avatar text generation)</Label>
                <Input 
                  id="openai-key" 
                  type="password" 
                  placeholder="sk-..." 
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heygen-key">HeyGen API Key (for video avatar generation)</Label>
                <Input 
                  id="heygen-key" 
                  type="password" 
                  placeholder="hg-..." 
                  value={apiKeys.heygen}
                  onChange={(e) => setApiKeys({ ...apiKeys, heygen: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="elevenlabs-key">ElevenLabs API Key (for voice synthesis)</Label>
                <Input 
                  id="elevenlabs-key" 
                  type="password" 
                  placeholder="el-..." 
                  value={apiKeys.elevenlabs}
                  onChange={(e) => setApiKeys({ ...apiKeys, elevenlabs: e.target.value })}
                />
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <CardContent className="px-0 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-avatars">Enable AI Video Avatars</Label>
                  <p className="text-sm text-gray-500">Turn on video avatar functionality across the platform</p>
                </div>
                <Switch 
                  id="enable-avatars" 
                  checked={settings.enableAvatars}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableAvatars: checked })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-avatar">Default Avatar ID</Label>
                <Input 
                  id="default-avatar" 
                  placeholder="avatar1" 
                  value={settings.defaultAvatar}
                  onChange={(e) => setSettings({ ...settings, defaultAvatar: e.target.value })}
                />
                <p className="text-xs text-gray-500">Enter the ID of the avatar to use by default</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens">Max Tokens: {settings.maxTokens}</Label>
                </div>
                <Slider 
                  id="max-tokens"
                  min={100}
                  max={4000}
                  step={100}
                  value={[settings.maxTokens]}
                  onValueChange={(value) => setSettings({ ...settings, maxTokens: value[0] })}
                />
                <p className="text-xs text-gray-500">Maximum number of tokens for text generation</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature: {settings.temperature.toFixed(1)}</Label>
                </div>
                <Slider 
                  id="temperature"
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={[settings.temperature]}
                  onValueChange={(value) => setSettings({ ...settings, temperature: value[0] })}
                />
                <p className="text-xs text-gray-500">Controls randomness in the AI responses (higher = more creative)</p>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="avatars" className="mt-0">
            <CardContent className="px-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Available Avatars</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshAvatarsList}
                  disabled={isLoadingAvatars}
                >
                  {isLoadingAvatars ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh
                </Button>
              </div>
              
              {isLoadingAvatars ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : avatarsError ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load avatars: {avatarsError instanceof Error ? avatarsError.message : "Unknown error"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processedAvatars.map((avatar: Avatar) => (
                    <Card key={avatar.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md">{avatar.name}</CardTitle>
                          <Switch 
                            checked={avatar.is_enabled} 
                            onCheckedChange={(checked) => handleAvatarToggle(avatar.id, checked)}
                          />
                        </div>
                        <CardDescription>
                          {avatar.attitude} {avatar.gender}, {avatar.pose_name} pose
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                          {avatar.thumbnail ? (
                            <img 
                              src={avatar.thumbnail} 
                              alt={avatar.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/gray/white?text=No+Preview";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <Video className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4">
                        <div className="text-sm text-gray-500">
                          ID: {avatar.id}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEditAvatar(avatar)}>
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-end gap-2 pt-6">
          <Button 
            variant="default" 
            onClick={handleSaveConfig} 
            disabled={updateConfigMutation.isPending}
            className="gap-2"
          >
            {updateConfigMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Avatars Enabled:</span>
              <span className="flex items-center">
                {settings.enableAvatars ? (
                  <><Check className="h-4 w-4 text-green-500 mr-1" /> Enabled</>
                ) : (
                  <><X className="h-4 w-4 text-red-500 mr-1" /> Disabled</>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Avatars:</span>
              <span className="font-medium">{enabledAvatarIds.length} / {processedAvatars.length}</span>
            </div>
            <div className="flex justify-between">
              <span>OpenAI API Key:</span>
              <span className="flex items-center">
                {apiKeys.openai ? (
                  <><Check className="h-4 w-4 text-green-500 mr-1" /> Configured</>
                ) : (
                  <><X className="h-4 w-4 text-red-500 mr-1" /> Not Configured</>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>HeyGen API Key:</span>
              <span className="flex items-center">
                {apiKeys.heygen ? (
                  <><Check className="h-4 w-4 text-green-500 mr-1" /> Configured</>
                ) : (
                  <><X className="h-4 w-4 text-red-500 mr-1" /> Not Configured</>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>ElevenLabs API Key:</span>
              <span className="flex items-center">
                {apiKeys.elevenlabs ? (
                  <><Check className="h-4 w-4 text-green-500 mr-1" /> Configured</>
                ) : (
                  <><X className="h-4 w-4 text-red-500 mr-1" /> Not Configured</>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvatarConfiguration;