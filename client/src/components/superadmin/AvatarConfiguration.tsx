import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Plus, Save, Settings, Trash2, Upload, VideoIcon } from 'lucide-react';

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

const AvatarConfiguration = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    heygen: '',
    elevenlabs: ''
  });
  const [savedSettings, setSavedSettings] = useState({
    enableAvatars: false,
    defaultAvatar: '',
    maxTokens: 150,
    temperature: 0.7
  });

  // Fetch avatars from JSON file
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('/avatars/data/avatar_list.json');
        const data = await response.json();
        // Add is_enabled property to each avatar
        const processedAvatars = data.data.map((avatar: Avatar) => ({
          ...avatar,
          is_enabled: true // Default all avatars to enabled
        }));
        
        setAvatars(processedAvatars);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  const handleSaveSettings = async () => {
    try {
      // In a real implementation, you would save these settings to your backend
      // await apiRequest('POST', '/api/avatar/settings', {
      //   apiKeys,
      //   settings: savedSettings,
      //   enabledAvatars: avatars.filter(a => a.is_enabled).map(a => a.id)
      // });
      
      // For now, just simulate a successful save
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
          alert('Settings saved successfully!');
        }, 1000);
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleAvatarEnabled = (avatarId: string) => {
    setAvatars(avatars.map(avatar => 
      avatar.id === avatarId 
        ? { ...avatar, is_enabled: !avatar.is_enabled } 
        : avatar
    ));
  };

  const handleEditAvatar = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setIsEditDialogOpen(true);
  };

  const saveAvatarChanges = () => {
    if (!selectedAvatar) return;
    
    setAvatars(avatars.map(avatar => 
      avatar.id === selectedAvatar.id 
        ? selectedAvatar 
        : avatar
    ));
    
    setIsEditDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#4a89dc]" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="avatars">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="avatars">Available Avatars</TabsTrigger>
        <TabsTrigger value="settings">API Configuration</TabsTrigger>
        <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
      </TabsList>

      {/* Avatars Tab */}
      <TabsContent value="avatars">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
          <CardHeader>
            <CardTitle>AI Video Avatars</CardTitle>
            <CardDescription className="text-gray-400">
              Configure AI-powered video avatars for JET AI travel assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {avatars.map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`bg-[#050b17] border border-[#4a89dc]/20 rounded-lg overflow-hidden transition-opacity ${!avatar.is_enabled ? 'opacity-60' : ''}`}
                >
                  <div className="relative">
                    <img 
                      src={avatar.thumbnail} 
                      alt={avatar.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/avatars/img/default-avatar.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2 p-1 bg-black/70 rounded">
                      <Switch 
                        checked={avatar.is_enabled} 
                        onCheckedChange={() => toggleAvatarEnabled(avatar.id)}
                        className="data-[state=checked]:bg-[#4a89dc]"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{avatar.name}</h3>
                    <p className="text-sm text-gray-400">{avatar.pose_name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${avatar.gender === 'male' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}`}>
                        {avatar.gender}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-[#4a89dc] border-[#4a89dc]/20 hover:bg-[#4a89dc]/10"
                        onClick={() => handleEditAvatar(avatar)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" className="text-[#4a89dc] border-[#4a89dc]/20 hover:bg-[#4a89dc]/10">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Avatar
              </Button>
              <Button 
                className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                onClick={handleSaveSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* API Configuration Tab */}
      <TabsContent value="settings">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Configure the necessary API keys for AI video avatar functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input 
                  id="openai-key"
                  type="password"
                  placeholder="Enter OpenAI API key"
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                  className="bg-[#050b17] border-[#4a89dc]/20 text-white"
                />
                <p className="text-xs text-gray-400">Required for ChatGPT conversation capabilities</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="heygen-key">HeyGen API Key</Label>
                <Input 
                  id="heygen-key"
                  type="password"
                  placeholder="Enter HeyGen API key"
                  value={apiKeys.heygen}
                  onChange={(e) => setApiKeys({...apiKeys, heygen: e.target.value})}
                  className="bg-[#050b17] border-[#4a89dc]/20 text-white"
                />
                <p className="text-xs text-gray-400">Required for AI video avatar generation</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
                <Input 
                  id="elevenlabs-key"
                  type="password"
                  placeholder="Enter ElevenLabs API key"
                  value={apiKeys.elevenlabs}
                  onChange={(e) => setApiKeys({...apiKeys, elevenlabs: e.target.value})}
                  className="bg-[#050b17] border-[#4a89dc]/20 text-white"
                />
                <p className="text-xs text-gray-400">Optional: Enhanced voice capabilities</p>
              </div>

              <div className="pt-4">
                <Button 
                  className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                  onClick={handleSaveSettings}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save API Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Advanced Settings Tab */}
      <TabsContent value="advanced">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20 text-white">
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Configure advanced settings for AI video avatars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-avatars">Enable Video Avatars</Label>
                  <p className="text-xs text-gray-400">Allow users to interact with AI video avatars</p>
                </div>
                <Switch 
                  id="enable-avatars"
                  checked={savedSettings.enableAvatars}
                  onCheckedChange={(checked) => setSavedSettings({...savedSettings, enableAvatars: checked})}
                  className="data-[state=checked]:bg-[#4a89dc]"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="default-avatar">Default Avatar</Label>
                <Select 
                  value={savedSettings.defaultAvatar}
                  onValueChange={(value) => setSavedSettings({...savedSettings, defaultAvatar: value})}
                >
                  <SelectTrigger className="bg-[#050b17] border-[#4a89dc]/20 text-white">
                    <SelectValue placeholder="Select a default avatar" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050b17] border-[#4a89dc]/20 text-white">
                    {avatars.filter(a => a.is_enabled).map((avatar) => (
                      <SelectItem key={avatar.id} value={avatar.id}>
                        {avatar.name} - {avatar.pose_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input 
                  id="max-tokens"
                  type="number"
                  min="50"
                  max="500"
                  value={savedSettings.maxTokens}
                  onChange={(e) => setSavedSettings({...savedSettings, maxTokens: parseInt(e.target.value)})}
                  className="bg-[#050b17] border-[#4a89dc]/20 text-white"
                />
                <p className="text-xs text-gray-400">Maximum tokens for each AI response (50-500)</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="temperature">Temperature</Label>
                <Input 
                  id="temperature"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={savedSettings.temperature}
                  onChange={(e) => setSavedSettings({...savedSettings, temperature: parseFloat(e.target.value)})}
                  className="bg-[#050b17] border-[#4a89dc]/20 text-white"
                />
                <p className="text-xs text-gray-400">Creativity level of AI responses (0-1)</p>
              </div>

              <div className="pt-4">
                <Button 
                  className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                  onClick={handleSaveSettings}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Advanced Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Edit Avatar Dialog */}
      {selectedAvatar && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#0a1328] border-[#4a89dc]/20 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>Configure Avatar: {selectedAvatar.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Customize avatar settings and behavior
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <img 
                  src={selectedAvatar.thumbnail} 
                  alt={selectedAvatar.name}
                  className="w-full h-64 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/avatars/img/default-avatar.jpg';
                  }}
                />
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="avatar-enabled">Avatar Enabled</Label>
                    <Switch 
                      id="avatar-enabled"
                      checked={selectedAvatar.is_enabled}
                      onCheckedChange={(checked) => 
                        setSelectedAvatar({...selectedAvatar, is_enabled: checked})
                      }
                      className="data-[state=checked]:bg-[#4a89dc]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatar-voice">Voice Selection</Label>
                    <Select 
                      value={selectedAvatar.voice_id}
                      onValueChange={(value) => 
                        setSelectedAvatar({...selectedAvatar, voice_id: value})
                      }
                    >
                      <SelectTrigger className="bg-[#050b17] border-[#4a89dc]/20 text-white">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#050b17] border-[#4a89dc]/20 text-white">
                        <SelectItem value="d7bbcdd6964c47bdaae26decade4a933">Default Voice</SelectItem>
                        <SelectItem value="custom_voice_1">Custom Voice 1</SelectItem>
                        <SelectItem value="custom_voice_2">Custom Voice 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="avatar-interactive">Interactive Mode</Label>
                    <Switch 
                      id="avatar-interactive"
                      checked={selectedAvatar.is_interactive}
                      onCheckedChange={(checked) => 
                        setSelectedAvatar({...selectedAvatar, is_interactive: checked})
                      }
                      className="data-[state=checked]:bg-[#4a89dc]"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 text-[#4a89dc] border-[#4a89dc]/20 hover:bg-[#4a89dc]/10"
                  >
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Test Avatar
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar-name">Display Name</Label>
                  <Input 
                    id="avatar-name"
                    value={selectedAvatar.name}
                    onChange={(e) => 
                      setSelectedAvatar({...selectedAvatar, name: e.target.value})
                    }
                    className="bg-[#050b17] border-[#4a89dc]/20 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar-pose">Pose Description</Label>
                  <Input 
                    id="avatar-pose"
                    value={selectedAvatar.pose_name}
                    onChange={(e) => 
                      setSelectedAvatar({...selectedAvatar, pose_name: e.target.value})
                    }
                    className="bg-[#050b17] border-[#4a89dc]/20 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar-gender">Gender</Label>
                  <Select 
                    value={selectedAvatar.gender}
                    onValueChange={(value) => 
                      setSelectedAvatar({...selectedAvatar, gender: value})
                    }
                  >
                    <SelectTrigger className="bg-[#050b17] border-[#4a89dc]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050b17] border-[#4a89dc]/20 text-white">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar-attitude">Personality & Attitude</Label>
                  <textarea 
                    id="avatar-attitude"
                    rows={7}
                    value={selectedAvatar.attitude}
                    onChange={(e) => 
                      setSelectedAvatar({...selectedAvatar, attitude: e.target.value})
                    }
                    className="w-full rounded-md bg-[#050b17] border border-[#4a89dc]/20 text-white p-2 text-sm"
                  />
                  <p className="text-xs text-gray-400">
                    Define the avatar's personality, knowledge, and how it should respond
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="destructive" 
                className="bg-red-900 hover:bg-red-800 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Avatar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                onClick={saveAvatarChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Tabs>
  );
};

export default AvatarConfiguration;