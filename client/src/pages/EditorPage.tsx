import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  UIConfig, 
  DEFAULT_UI_CONFIG, 
  getUIConfig, 
  updateUIConfig, 
  subscribeToUIConfig, 
  logEditorActivity 
} from '@/lib/uiConfigService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getAuth } from 'firebase/auth';
import { Loader2, Save, RefreshCw, Layout, Home, Type, Image, MessageSquare, FileCode, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const fontOptions = [
  "Poppins", "Roboto", "Open Sans", "Montserrat", "Lato", "Raleway", "Inter", "Playfair Display", "DM Sans"
];

const buttonShapeOptions = [
  { value: "pill", label: "Pill" },
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" }
];

const layoutOptions = [
  { value: "dark", label: "Dark Mode" },
  { value: "light", label: "Light Mode" }
];

const EditorPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [config, setConfig] = useState<UIConfig>(DEFAULT_UI_CONFIG);
  const [originalConfig, setOriginalConfig] = useState<UIConfig | null>(null);
  const [selectedTab, setSelectedTab] = useState("header");

  // Check authentication on mount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
      } else {
        // Check if user is SuperAdmin by checking localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
        
        if (isLoggedIn && (isAdmin || isSuperAdmin)) {
          setIsAuthenticated(true);
          setUserId(isAdmin ? 'admin-user' : 'super-admin-user');
        } else {
          // If not authenticated, redirect to login
          setLocation('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [setLocation]);

  // Load initial configuration and subscribe to changes
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load initial configuration
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const initialConfig = await getUIConfig();
        setConfig(initialConfig);
        setOriginalConfig(initialConfig);
      } catch (error) {
        console.error('Error loading UI configuration:', error);
        toast({
          title: "Error Loading Configuration",
          description: "Failed to load the UI configuration. Using default settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUIConfig((updatedConfig) => {
      // Only update if we're not in the middle of saving
      if (!isSaving) {
        setConfig(updatedConfig);
        setOriginalConfig(updatedConfig);
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated, isSaving, toast]);

  // Save configuration changes
  const handleSave = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      const success = await updateUIConfig(config, userId);
      
      if (success) {
        toast({
          title: "Configuration Saved",
          description: "UI settings have been updated successfully.",
          variant: "default",
        });
        
        // Log this activity
        await logEditorActivity(
          userId, 
          "updated_ui_config", 
          { tab: selectedTab }
        );
        
        // Update original config
        setOriginalConfig(config);
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving UI configuration:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save UI configuration changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    if (originalConfig) {
      setConfig(originalConfig);
      toast({
        title: "Changes Reset",
        description: "All changes have been reverted to the last saved state.",
        variant: "default",
      });
    }
  };

  // Handle changes in form fields
  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setConfig((prevConfig) => {
      // Handle nested fields (e.g., visible_sections.chat)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'visible_sections') {
          return {
            ...prevConfig,
            visible_sections: {
              ...prevConfig.visible_sections,
              [child]: value as boolean
            }
          };
        }
      }
      
      // Handle normal fields
      return {
        ...prevConfig,
        [field]: value
      };
    });
  };

  // If not authenticated or still loading, show a loading state
  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xl font-medium">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Layout className="h-6 w-6" />
            <h1 className="text-lg font-semibold">JET AI Visual Editor</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            
            <Button
              variant="default"
              className="gap-1"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>UI Editor</CardTitle>
                <CardDescription>
                  Make changes to the UI components below. Changes are previewed in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="header" className="flex flex-col items-center px-2 py-1">
                      <Home className="h-4 w-4" />
                      <span className="text-xs mt-1">Header</span>
                    </TabsTrigger>
                    <TabsTrigger value="homepage" className="flex flex-col items-center px-2 py-1">
                      <Layout className="h-4 w-4" />
                      <span className="text-xs mt-1">Homepage</span>
                    </TabsTrigger>
                    <TabsTrigger value="visuals" className="flex flex-col items-center px-2 py-1">
                      <Image className="h-4 w-4" />
                      <span className="text-xs mt-1">Visuals</span>
                    </TabsTrigger>
                    <TabsTrigger value="assistant" className="flex flex-col items-center px-2 py-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs mt-1">Assistant</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Header Tab */}
                  <TabsContent value="header" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="header-menu">Header Menu Items</Label>
                      <Textarea 
                        id="header-menu" 
                        value={config.header_menu.join('\n')}
                        onChange={(e) => handleInputChange('header_menu', e.target.value.split('\n').filter(Boolean))}
                        placeholder="Enter menu items, one per line"
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter one menu item per line. These will appear in the top navigation.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="layout">Layout Theme</Label>
                      <Select 
                        value={config.layout} 
                        onValueChange={(value) => handleInputChange('layout', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select layout theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {layoutOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  {/* Homepage Tab */}
                  <TabsContent value="homepage" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="homepage-title">Homepage Title</Label>
                      <Input 
                        id="homepage-title" 
                        value={config.homepage_title}
                        onChange={(e) => handleInputChange('homepage_title', e.target.value)}
                        placeholder="Main headline" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="homepage-subtitle">Homepage Subtitle</Label>
                      <Input 
                        id="homepage-subtitle" 
                        value={config.homepage_subtitle}
                        onChange={(e) => handleInputChange('homepage_subtitle', e.target.value)}
                        placeholder="Supporting text" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cta-text">Call-to-Action Button Text</Label>
                      <Input 
                        id="cta-text" 
                        value={config.cta_text}
                        onChange={(e) => handleInputChange('cta_text', e.target.value)}
                        placeholder="Button text" 
                      />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <Label>Visible Sections</Label>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="chat-section" className="text-base">Chat Assistant</Label>
                          <p className="text-sm text-muted-foreground">Interactive AI chat feature</p>
                        </div>
                        <Switch 
                          id="chat-section" 
                          checked={config.visible_sections.chat}
                          onCheckedChange={(value) => handleInputChange('visible_sections.chat', value)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="features-section" className="text-base">Features</Label>
                          <p className="text-sm text-muted-foreground">Application features showcase</p>
                        </div>
                        <Switch 
                          id="features-section" 
                          checked={config.visible_sections.features}
                          onCheckedChange={(value) => handleInputChange('visible_sections.features', value)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="pricing-section" className="text-base">Pricing</Label>
                          <p className="text-sm text-muted-foreground">Subscription & pricing plans</p>
                        </div>
                        <Switch 
                          id="pricing-section" 
                          checked={config.visible_sections.pricing}
                          onCheckedChange={(value) => handleInputChange('visible_sections.pricing', value)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="itineraries-section" className="text-base">Itineraries</Label>
                          <p className="text-sm text-muted-foreground">Travel plans & itineraries</p>
                        </div>
                        <Switch 
                          id="itineraries-section" 
                          checked={config.visible_sections.itineraries}
                          onCheckedChange={(value) => handleInputChange('visible_sections.itineraries', value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Visuals Tab */}
                  <TabsContent value="visuals" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="primary-color" 
                          type="color" 
                          value={config.primary_color}
                          onChange={(e) => handleInputChange('primary_color', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={config.primary_color}
                          onChange={(e) => handleInputChange('primary_color', e.target.value)}
                          placeholder="#000000" 
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select 
                        value={config.font_family} 
                        onValueChange={(value) => handleInputChange('font_family', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font family" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="button-shape">Button Shape</Label>
                      <Select 
                        value={config.button_shape} 
                        onValueChange={(value) => handleInputChange('button_shape', value as 'pill' | 'rounded' | 'square')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select button shape" />
                        </SelectTrigger>
                        <SelectContent>
                          {buttonShapeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-sm font-medium">Image Uploads Coming Soon</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Image upload functionality for banners, backgrounds, and avatars will be available in the next update.
                      </p>
                    </div>
                  </TabsContent>
                  
                  {/* Assistant Tab */}
                  <TabsContent value="assistant" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <Label>Assistant Configuration</Label>
                      
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">AI Assistant Settings</h3>
                        <p className="text-sm text-muted-foreground mb-4">Configure AI assistant appearance and behavior</p>
                        
                        <div className="flex items-center justify-between py-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="chat-feature">Chat Feature</Label>
                            <p className="text-xs text-muted-foreground">Enable the AI chat interface</p>
                          </div>
                          <Switch 
                            id="chat-feature" 
                            checked={config.visible_sections.chat}
                            onCheckedChange={(value) => handleInputChange('visible_sections.chat', value)}
                          />
                        </div>
                        
                        <Separator className="my-2" />
                        
                        {/* Additional AI settings will be added here in future updates */}
                        
                        <div className="mt-4 bg-muted/50 rounded-lg p-3">
                          <p className="text-sm font-medium flex items-center">
                            <FileCode className="h-4 w-4 mr-2" />
                            Advanced Assistant Configuration
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Additional AI assistant personalization settings are available in the Super Admin panel.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  Last saved: {originalConfig?.last_edit ? new Date(originalConfig.last_edit.timestamp).toLocaleString() : 'Never'}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Preview panel */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  This shows how your changes will appear on the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 min-h-[600px] border-t">
                <div 
                  className="w-full h-full overflow-auto p-4"
                  style={{ 
                    fontFamily: config.font_family,
                    backgroundColor: config.layout === 'dark' ? '#050b17' : '#ffffff',
                    color: config.layout === 'dark' ? '#ffffff' : '#050b17'
                  }}
                >
                  {/* Preview Header */}
                  <div className="border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div style={{ color: config.primary_color }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <span className="text-xl font-bold" style={{ color: config.primary_color }}>JET AI</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {config.header_menu.map((item, index) => (
                          <span key={index} className="text-sm cursor-pointer hover:opacity-80">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Hero */}
                  <div className="text-center py-12 px-4">
                    <h1 className="text-4xl font-bold mb-4">{config.homepage_title}</h1>
                    <p className="text-xl mb-8">{config.homepage_subtitle}</p>
                    <button 
                      style={{
                        backgroundColor: config.primary_color,
                        color: '#ffffff',
                        borderRadius: 
                          config.button_shape === 'pill' ? '9999px' : 
                          config.button_shape === 'rounded' ? '0.5rem' : 
                          '0',
                        padding: '0.75rem 1.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {config.cta_text}
                    </button>
                  </div>
                  
                  {/* Features Preview (if enabled) */}
                  {config.visible_sections.features && (
                    <div className="py-8 border-t border-gray-200 dark:border-gray-700">
                      <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 border rounded-lg dark:border-gray-700">
                            <div className="h-10 w-10 rounded-full mb-4" style={{ backgroundColor: config.primary_color }}></div>
                            <h3 className="text-lg font-bold mb-2">Feature {i}</h3>
                            <p className="text-sm opacity-80">Description of this amazing feature that makes JET AI special.</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Pricing Preview (if enabled) */}
                  {config.visible_sections.pricing && (
                    <div className="py-8 border-t border-gray-200 dark:border-gray-700">
                      <h2 className="text-2xl font-bold mb-6 text-center">Pricing Plans</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Basic', 'Pro', 'Enterprise'].map((plan) => (
                          <div key={plan} className="p-6 border rounded-lg dark:border-gray-700">
                            <h3 className="text-xl font-bold mb-2">{plan}</h3>
                            <p className="text-3xl font-bold mb-4" style={{ color: config.primary_color }}>
                              ${plan === 'Basic' ? '0' : plan === 'Pro' ? '49' : '99'}
                              <span className="text-sm opacity-70">/mo</span>
                            </p>
                            <ul className="space-y-2 mb-6">
                              {[1, 2, 3].map((i) => (
                                <li key={i} className="flex items-center">
                                  <Check className="h-4 w-4 mr-2" style={{ color: config.primary_color }} />
                                  <span className="text-sm">Feature {i}</span>
                                </li>
                              ))}
                            </ul>
                            <button 
                              style={{
                                backgroundColor: plan === 'Pro' ? config.primary_color : 'transparent',
                                color: plan === 'Pro' ? '#ffffff' : undefined,
                                borderRadius: 
                                  config.button_shape === 'pill' ? '9999px' : 
                                  config.button_shape === 'rounded' ? '0.5rem' : 
                                  '0',
                                padding: '0.5rem 1rem',
                                border: `1px solid ${config.primary_color}`,
                                width: '100%'
                              }}
                            >
                              Select Plan
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Chat Assistant Preview (if enabled) */}
                  {config.visible_sections.chat && (
                    <div className="fixed bottom-6 right-6 preview-only">
                      <div 
                        className="h-12 w-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                        style={{ backgroundColor: config.primary_color }}
                      >
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Itineraries Preview (if enabled) */}
                  {config.visible_sections.itineraries && (
                    <div className="py-8 border-t border-gray-200 dark:border-gray-700">
                      <h2 className="text-2xl font-bold mb-6 text-center">Featured Itineraries</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['Paris Getaway', 'Tokyo Adventure'].map((trip) => (
                          <div key={trip} className="border rounded-lg overflow-hidden dark:border-gray-700">
                            <div 
                              className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                            >
                              <span className="text-lg opacity-50">Destination Image</span>
                            </div>
                            <div className="p-4">
                              <h3 className="text-lg font-bold mb-1">{trip}</h3>
                              <p className="text-sm opacity-80 mb-3">7 days of unforgettable experiences</p>
                              <div className="flex justify-between items-center">
                                <span className="font-medium" style={{ color: config.primary_color }}>$1,299</span>
                                <button 
                                  className="text-sm"
                                  style={{
                                    backgroundColor: config.primary_color,
                                    color: '#ffffff',
                                    borderRadius: 
                                      config.button_shape === 'pill' ? '9999px' : 
                                      config.button_shape === 'rounded' ? '0.5rem' : 
                                      '0',
                                    padding: '0.375rem 0.75rem',
                                  }}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;