import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Palette, Globe, Layout, Database, Languages } from 'lucide-react';

const SystemConfiguration: React.FC = () => {
  return (
    <Tabs defaultValue="appearance" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4 bg-[#0a1328] border-[#4a89dc]/20 border">
        <TabsTrigger value="appearance" className="flex gap-1 items-center">
          <Palette className="h-4 w-4" /> Appearance
        </TabsTrigger>
        <TabsTrigger value="api-settings" className="flex gap-1 items-center">
          <Globe className="h-4 w-4" /> API Settings
        </TabsTrigger>
        <TabsTrigger value="ui-layout" className="flex gap-1 items-center">
          <Layout className="h-4 w-4" /> UI Layout
        </TabsTrigger>
        <TabsTrigger value="languages" className="flex gap-1 items-center">
          <Languages className="h-4 w-4" /> Languages
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="appearance">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="primary-color" type="color" value="#4a89dc" className="w-16 h-10" />
                    <Input value="#4a89dc" className="font-mono" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="secondary-color" type="color" value="#050b17" className="w-16 h-10" />
                    <Input value="#050b17" className="font-mono" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="accent-color" type="color" value="#82ca9d" className="w-16 h-10" />
                    <Input value="#82ca9d" className="font-mono" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Variant</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="tint">Tint</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <div className="space-y-4">
                    <Slider defaultValue={[4]} max={16} step={1} />
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">0px</span>
                      <span className="text-xs text-gray-400">8px</span>
                      <span className="text-xs text-gray-400">16px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#4a89dc]/20">
              <div className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Apply Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="api-settings">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="gemini-api">Google Gemini AI</Label>
                  <p className="text-xs text-gray-400">Enable/disable Gemini AI integration</p>
                </div>
                <Switch id="gemini-api" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="openai-api">OpenAI GPT Integration</Label>
                  <p className="text-xs text-gray-400">Enable/disable OpenAI GPT fallback</p>
                </div>
                <Switch id="openai-api" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anthropic-api">Anthropic Claude</Label>
                  <p className="text-xs text-gray-400">Enable/disable Anthropic Claude integration</p>
                </div>
                <Switch id="anthropic-api" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stripe-api">Stripe Payments</Label>
                  <p className="text-xs text-gray-400">Enable/disable Stripe payment processing</p>
                </div>
                <Switch id="stripe-api" defaultChecked />
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="google-api-key">Google API Key (masked)</Label>
                <Input id="google-api-key" type="password" value="••••••••••••••••••••••••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model-selection">AI Model Selection</Label>
                <Select defaultValue="gemini-flash">
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="claude-3">Claude 3 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#4a89dc]/20">
              <div className="flex justify-between">
                <Button variant="outline">Test Connections</Button>
                <Button>Save Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="ui-layout">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>UI Layout Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sidebar-navigation">Sidebar Navigation</Label>
                  <p className="text-xs text-gray-400">Show/hide sidebar navigation</p>
                </div>
                <Switch id="sidebar-navigation" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="top-navigation">Top Navigation Bar</Label>
                  <p className="text-xs text-gray-400">Show/hide top navigation bar</p>
                </div>
                <Switch id="top-navigation" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="footer">Footer</Label>
                  <p className="text-xs text-gray-400">Show/hide footer area</p>
                </div>
                <Switch id="footer" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="chat-widget">Chat Widget</Label>
                  <p className="text-xs text-gray-400">Show/hide floating chat widget</p>
                </div>
                <Switch id="chat-widget" defaultChecked />
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="homepage-layout">Homepage Layout</Label>
                <Select defaultValue="modern">
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="container-width">Container Width</Label>
                <div className="space-y-4">
                  <Slider defaultValue={[1200]} min={800} max={1600} step={50} />
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">800px</span>
                    <span className="text-xs text-gray-400">1200px</span>
                    <span className="text-xs text-gray-400">1600px</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#4a89dc]/20">
              <div className="flex justify-between">
                <Button variant="outline">Reset Layout</Button>
                <Button>Apply Layout</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="languages">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-language">Default System Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="zh">Chinese (Simplified)</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-detect">Auto-detect User Language</Label>
                  <p className="text-xs text-gray-400">Automatically detect user browser language</p>
                </div>
                <Switch id="auto-detect" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multilingual-support">Multilingual Support</Label>
                  <p className="text-xs text-gray-400">Allow AI to respond in multiple languages</p>
                </div>
                <Switch id="multilingual-support" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="language-switcher">Show Language Switcher</Label>
                  <p className="text-xs text-gray-400">Display language selector in UI</p>
                </div>
                <Switch id="language-switcher" defaultChecked />
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Enabled Languages</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-en" defaultChecked />
                    <Label htmlFor="lang-en">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-es" defaultChecked />
                    <Label htmlFor="lang-es">Spanish</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-fr" defaultChecked />
                    <Label htmlFor="lang-fr">French</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-de" defaultChecked />
                    <Label htmlFor="lang-de">German</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-it" defaultChecked />
                    <Label htmlFor="lang-it">Italian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-pt" defaultChecked />
                    <Label htmlFor="lang-pt">Portuguese</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-zh" defaultChecked />
                    <Label htmlFor="lang-zh">Chinese</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lang-ja" defaultChecked />
                    <Label htmlFor="lang-ja">Japanese</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#4a89dc]/20">
              <div className="flex justify-between">
                <Button variant="outline">Reset to English Only</Button>
                <Button>Save Language Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SystemConfiguration;