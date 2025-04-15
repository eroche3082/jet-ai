import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Save, 
  AlertCircle, 
  Filter, 
  Search, 
  EyeOff, 
  Eye, 
  FolderCog,
  MessageSquare,
  Map,
  Camera,
  CreditCard,
  Bot,
  Mail,
  Share2,
  Zap,
  PanelLeft
} from 'lucide-react';

// Mock data for features
const featureGroups = [
  {
    id: 'ai',
    name: 'AI Capabilities',
    icon: <Bot className="h-5 w-5" />,
    features: [
      { id: 'ai-chat', name: 'AI Travel Assistant', enabled: true, restricted: false },
      { id: 'ai-recommendations', name: 'Smart Recommendations', enabled: true, restricted: false },
      { id: 'ai-sentiment', name: 'Sentiment Analysis', enabled: true, restricted: false },
      { id: 'ai-forecasting', name: 'Trip Forecasting', enabled: true, restricted: false },
      { id: 'ai-translation', name: 'Real-time Translation', enabled: true, restricted: false },
      { id: 'ai-voice', name: 'Voice Interaction', enabled: false, restricted: true }
    ]
  },
  {
    id: 'travel',
    name: 'Travel Features',
    icon: <Map className="h-5 w-5" />,
    features: [
      { id: 'travel-search', name: 'Flight & Hotel Search', enabled: true, restricted: false },
      { id: 'travel-bookings', name: 'Booking Management', enabled: true, restricted: false },
      { id: 'travel-itinerary', name: 'Itinerary Builder', enabled: true, restricted: false },
      { id: 'travel-maps', name: 'Interactive Maps', enabled: true, restricted: false },
      { id: 'travel-weather', name: 'Weather Forecasts', enabled: true, restricted: false },
      { id: 'travel-ar', name: 'AR Navigation', enabled: false, restricted: true }
    ]
  },
  {
    id: 'social',
    name: 'Social Features',
    icon: <Share2 className="h-5 w-5" />,
    features: [
      { id: 'social-sharing', name: 'Trip Sharing', enabled: true, restricted: false },
      { id: 'social-community', name: 'Travel Community', enabled: true, restricted: false },
      { id: 'social-reviews', name: 'User Reviews', enabled: true, restricted: false },
      { id: 'social-messaging', name: 'Direct Messaging', enabled: false, restricted: false },
      { id: 'social-groups', name: 'Travel Groups', enabled: false, restricted: false }
    ]
  },
  {
    id: 'media',
    name: 'Media Features',
    icon: <Camera className="h-5 w-5" />,
    features: [
      { id: 'media-photos', name: 'Travel Photos', enabled: true, restricted: false },
      { id: 'media-videos', name: 'Video Sharing', enabled: true, restricted: false },
      { id: 'media-storage', name: 'Cloud Storage', enabled: true, restricted: false },
      { id: 'media-editing', name: 'Photo Editing', enabled: false, restricted: false },
      { id: 'media-albums', name: 'Travel Albums', enabled: true, restricted: false }
    ]
  },
  {
    id: 'payments',
    name: 'Payments & Billing',
    icon: <CreditCard className="h-5 w-5" />,
    features: [
      { id: 'payments-subscriptions', name: 'Subscription Management', enabled: true, restricted: true },
      { id: 'payments-methods', name: 'Payment Methods', enabled: true, restricted: true },
      { id: 'payments-invoices', name: 'Invoice History', enabled: true, restricted: true },
      { id: 'payments-discounts', name: 'Discount Codes', enabled: true, restricted: true }
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: <Mail className="h-5 w-5" />,
    features: [
      { id: 'notifications-email', name: 'Email Notifications', enabled: true, restricted: false },
      { id: 'notifications-push', name: 'Push Notifications', enabled: true, restricted: false },
      { id: 'notifications-alerts', name: 'Travel Alerts', enabled: true, restricted: false },
      { id: 'notifications-digest', name: 'Weekly Digest', enabled: false, restricted: false }
    ]
  },
  {
    id: 'performance',
    name: 'Performance Features',
    icon: <Zap className="h-5 w-5" />,
    features: [
      { id: 'performance-cache', name: 'Content Caching', enabled: true, restricted: true },
      { id: 'performance-offline', name: 'Offline Mode', enabled: true, restricted: false },
      { id: 'performance-prefetch', name: 'Data Prefetching', enabled: true, restricted: true },
      { id: 'performance-compression', name: 'Image Compression', enabled: true, restricted: false }
    ]
  },
  {
    id: 'ui',
    name: 'UI Components',
    icon: <PanelLeft className="h-5 w-5" />,
    features: [
      { id: 'ui-darkmode', name: 'Dark Mode', enabled: true, restricted: false },
      { id: 'ui-animations', name: 'UI Animations', enabled: true, restricted: false },
      { id: 'ui-accessibility', name: 'Accessibility Features', enabled: true, restricted: false },
      { id: 'ui-responsive', name: 'Responsive Design', enabled: true, restricted: false },
      { id: 'ui-rtl', name: 'RTL Support', enabled: false, restricted: false }
    ]
  }
];

const FeatureToggles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEnabled, setFilterEnabled] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<{id: string, name: string} | null>(null);
  
  // Apply search and filters
  const filteredGroups = featureGroups.map(group => {
    const filteredFeatures = group.features.filter(feature => {
      const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filterEnabled === null || 
        (filterEnabled === 'enabled' && feature.enabled) || 
        (filterEnabled === 'disabled' && !feature.enabled);
      
      return matchesSearch && matchesFilter;
    });
    
    return {
      ...group,
      features: filteredFeatures,
      hasMatches: filteredFeatures.length > 0
    };
  }).filter(group => group.hasMatches);
  
  const selectedGroup = selectedGroupId ? 
    featureGroups.find(group => group.id === selectedGroupId) : 
    null;
  
  // Toggle a feature
  const toggleFeature = (groupId: string, featureId: string) => {
    // In a real application, this would update the state or make an API call
    console.log(`Toggling feature: ${featureId} in group ${groupId}`);
  };
  
  // Count enabled/disabled features
  const enabledCount = featureGroups.reduce(
    (count, group) => count + group.features.filter(f => f.enabled).length, 
    0
  );
  
  const totalFeatures = featureGroups.reduce(
    (count, group) => count + group.features.length, 
    0
  );
  
  const restrictedCount = featureGroups.reduce(
    (count, group) => count + group.features.filter(f => f.restricted).length, 
    0
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Feature Management</h2>
        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
          <Save className="h-4 w-4 mr-2" /> Save Configuration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Active Features</p>
                <p className="text-2xl font-bold text-white">{enabledCount}/{totalFeatures}</p>
              </div>
              <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Disabled Features</p>
                <p className="text-2xl font-bold text-white">{totalFeatures - enabledCount}</p>
              </div>
              <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Restricted Features</p>
                <p className="text-2xl font-bold text-white">{restrictedCount}</p>
              </div>
              <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Feature Groups</CardTitle>
              <CardDescription className="text-gray-400">
                Manage features by category
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {featureGroups.map(group => (
                  <Button
                    key={group.id}
                    variant={selectedGroupId === group.id ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedGroupId === group.id ? "bg-[#4a89dc] hover:bg-[#3a79cc]" : ""
                    }`}
                    onClick={() => setSelectedGroupId(group.id)}
                  >
                    <span className="mr-2">{group.icon}</span>
                    <span className="flex-grow text-left">{group.name}</span>
                    <span className="text-xs rounded-full bg-[#050b17] px-2 py-1">
                      {group.features.filter(f => f.enabled).length}/{group.features.length}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" /> Enable All Features
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FolderCog className="h-4 w-4 mr-2" /> Reset to Defaults
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" /> Request New Feature
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Feature Configuration</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search features..."
                      className="pl-8 bg-[#050b17] border-[#4a89dc]/20 w-48"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    variant={filterEnabled === null ? "default" : "outline"}
                    size="sm"
                    className={filterEnabled === null ? "bg-[#4a89dc]" : ""}
                    onClick={() => setFilterEnabled(null)}
                  >
                    <Filter className="h-4 w-4 mr-1" /> All
                  </Button>
                  
                  <Button
                    variant={filterEnabled === 'enabled' ? "default" : "outline"}
                    size="sm"
                    className={filterEnabled === 'enabled' ? "bg-[#4a89dc]" : ""}
                    onClick={() => setFilterEnabled('enabled')}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Enabled
                  </Button>
                  
                  <Button
                    variant={filterEnabled === 'disabled' ? "default" : "outline"}
                    size="sm"
                    className={filterEnabled === 'disabled' ? "bg-[#4a89dc]" : ""}
                    onClick={() => setFilterEnabled('disabled')}
                  >
                    <EyeOff className="h-4 w-4 mr-1" /> Disabled
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedGroup ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold flex items-center">
                      {selectedGroup.icon}
                      <span className="ml-2">{selectedGroup.name}</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedGroup.features.map(feature => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20 hover:border-[#4a89dc]/40"
                      >
                        <div>
                          <div className="font-medium flex items-center">
                            {feature.name}
                            {feature.restricted && (
                              <span className="ml-2 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-sm">
                                Restricted
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">ID: {feature.id}</div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={() => toggleFeature(selectedGroup.id, feature.id)}
                              id={`toggle-${feature.id}`}
                            />
                            <Label htmlFor={`toggle-${feature.id}`} className="cursor-pointer">
                              {feature.enabled ? 'Enabled' : 'Disabled'}
                            </Label>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#4a89dc]"
                            onClick={() => setEditingFeature(feature)}
                          >
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                  <Settings className="h-12 w-12 text-gray-500" />
                  <div>
                    <p className="text-lg">Select a feature group</p>
                    <p className="text-sm">Choose a category from the sidebar to view and manage features</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedGroupId(featureGroups[0].id)}
                  >
                    View AI Capabilities
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {editingFeature && (
            <Card className="bg-[#0a1328] border-[#4a89dc]/20">
              <CardHeader>
                <CardTitle>Configure {editingFeature.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  Adjust detailed settings for this feature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featureId">Feature ID</Label>
                  <Input
                    id="featureId"
                    value={editingFeature.id}
                    disabled
                    className="bg-[#050b17] border-[#4a89dc]/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featureName">Display Name</Label>
                  <Input
                    id="featureName"
                    defaultValue={editingFeature.name}
                    className="bg-[#050b17] border-[#4a89dc]/20"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="featureAccess">Access Level</Label>
                    <div className="flex gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          id="access-public" 
                          name="accessLevel" 
                          className="rounded-full bg-[#0a1328]" 
                          defaultChecked 
                        />
                        <Label htmlFor="access-public" className="font-normal cursor-pointer">Public</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          id="access-restricted" 
                          name="accessLevel" 
                          className="rounded-full bg-[#0a1328]" 
                        />
                        <Label htmlFor="access-restricted" className="font-normal cursor-pointer">Restricted</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="featureVisibility">Visibility</Label>
                    <div className="flex gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="visibility-free" 
                          className="rounded bg-[#0a1328]" 
                          defaultChecked 
                        />
                        <Label htmlFor="visibility-free" className="font-normal cursor-pointer">Free</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="visibility-pro" 
                          className="rounded bg-[#0a1328]" 
                          defaultChecked 
                        />
                        <Label htmlFor="visibility-pro" className="font-normal cursor-pointer">Pro</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="visibility-business" 
                          className="rounded bg-[#0a1328]" 
                          defaultChecked 
                        />
                        <Label htmlFor="visibility-business" className="font-normal cursor-pointer">Business</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Settings</Label>
                  <div className="flex flex-col gap-3 p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="setting-cache" className="cursor-pointer">Enable Caching</Label>
                      <Switch id="setting-cache" defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="setting-analytics" className="cursor-pointer">Usage Analytics</Label>
                      <Switch id="setting-analytics" defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="setting-beta" className="cursor-pointer">Beta Features</Label>
                      <Switch id="setting-beta" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingFeature(null)}>
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureToggles;