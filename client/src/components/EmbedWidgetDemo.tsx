import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Check, MessageSquare } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface WidgetConfig {
  primaryColor: string;
  position: 'left' | 'right';
  greeting: string;
  placeholder: string;
  brandText: string;
}

export default function EmbedWidgetDemo() {
  const { theme } = useTheme();
  const [config, setConfig] = useState<WidgetConfig>({
    primaryColor: theme.colors.primary,
    position: 'right',
    greeting: 'Hi there! I\'m your AI travel assistant from JetAI. How can I help with your travel plans?',
    placeholder: 'Ask me about travel destinations...',
    brandText: `Powered by ${theme.name}`,
  });
  
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState('preview');
  
  const referralCode = 'PARTNER123'; // This would come from the partner's account

  // Generate embed code
  const generateEmbedCode = () => {
    return `<!-- JetAI Embeddable Assistant -->
<script>
  window.jetAIConfig = {
    primaryColor: "${config.primaryColor}",
    position: "${config.position}",
    greeting: "${config.greeting}",
    placeHolder: "${config.placeholder}",
    brandText: "${config.brandText}"
  };
</script>
<script src="https://jetai.app/embed.js?ref=${referralCode}"></script>
<div id="jetai-assistant"></div>`;
  };
  
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Preview component for the chat widget
  const WidgetPreview = () => (
    <div className="relative h-[400px] border rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="mb-2">Website content will appear here</p>
          <p className="text-sm">The widget will float in the corner</p>
        </div>
      </div>
      
      {/* Chat bubble */}
      <div className={`absolute bottom-4 ${config.position === 'right' ? 'right-4' : 'left-4'}`}>
        <div 
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: config.primaryColor }}
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Embeddable Chat Widget</CardTitle>
        <CardDescription>
          Add JetAI's travel assistant to your website with one line of code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            <WidgetPreview />
            
            <div className="mt-4">
              <Label className="text-sm font-medium">Embed Code</Label>
              <div className="mt-1 relative">
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                  {generateEmbedCode()}
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={copyEmbedCode}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <div 
                    className="w-10 h-10 rounded-md cursor-pointer border"
                    style={{ backgroundColor: config.primaryColor }}
                    onClick={() => document.getElementById('primaryColor')?.click()}
                  />
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <Label>Position</Label>
                <div className="flex gap-4 mt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="right"
                      checked={config.position === 'right'}
                      onChange={() => setConfig({...config, position: 'right'})}
                    />
                    <Label htmlFor="right">Right</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="left"
                      checked={config.position === 'left'}
                      onChange={() => setConfig({...config, position: 'left'})}
                    />
                    <Label htmlFor="left">Left</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="greeting">Greeting Message</Label>
                <Input
                  id="greeting"
                  value={config.greeting}
                  onChange={(e) => setConfig({...config, greeting: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="placeholder">Input Placeholder</Label>
                <Input
                  id="placeholder"
                  value={config.placeholder}
                  onChange={(e) => setConfig({...config, placeholder: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="brandText">Branding Text</Label>
                <Input
                  id="brandText"
                  value={config.brandText}
                  onChange={(e) => setConfig({...config, brandText: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button onClick={() => setSelectedTab('preview')} className="w-full">
              Update Preview
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="text-sm text-muted-foreground">
          <p>Add this widget to your website to earn commissions on travel bookings made through your referral link.</p>
        </div>
      </CardFooter>
    </Card>
  );
}