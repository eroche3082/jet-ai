import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Cloud, 
  HardDrive, 
  Key, 
  Server, 
  Settings, 
  ShieldAlert, 
  Globe, 
  Layers, 
  FileJson,
  Database,
  Cpu,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const SystemConfiguration: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    performanceMode: "balanced",
    defaultLanguage: "english",
    dataRetentionDays: "90",
    timeZone: "UTC"
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforceStrongPasswords: true,
    twoFactorAuth: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    ipRestriction: false,
    auditLogging: true
  });

  const toggleMaintenance = () => {
    setGeneralSettings({
      ...generalSettings,
      maintenanceMode: !generalSettings.maintenanceMode
    });
  };

  const toggleDebugMode = () => {
    setGeneralSettings({
      ...generalSettings,
      debugMode: !generalSettings.debugMode
    });
  };

  const toggleTwoFactor = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorAuth: !securitySettings.twoFactorAuth
    });
  };

  const toggleStrongPasswords = () => {
    setSecuritySettings({
      ...securitySettings,
      enforceStrongPasswords: !securitySettings.enforceStrongPasswords
    });
  };

  const toggleIpRestriction = () => {
    setSecuritySettings({
      ...securitySettings,
      ipRestriction: !securitySettings.ipRestriction
    });
  };

  const toggleAuditLogging = () => {
    setSecuritySettings({
      ...securitySettings,
      auditLogging: !securitySettings.auditLogging
    });
  };

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="bg-[#050b17]">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="h-4 w-4" /> General
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" /> Security
        </TabsTrigger>
        <TabsTrigger value="api" className="flex items-center gap-2">
          <Key className="h-4 w-4" /> API Keys
        </TabsTrigger>
        <TabsTrigger value="integrations" className="flex items-center gap-2">
          <Globe className="h-4 w-4" /> Integrations
        </TabsTrigger>
        <TabsTrigger value="storage" className="flex items-center gap-2">
          <HardDrive className="h-4 w-4" /> Storage
        </TabsTrigger>
        <TabsTrigger value="backups" className="flex items-center gap-2">
          <Cloud className="h-4 w-4" /> Backups
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Cpu className="h-4 w-4" /> Performance
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>General System Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Configure the core system settings for JET AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-400">When enabled, the site will be inaccessible to regular users</p>
              </div>
              <Switch 
                checked={generalSettings.maintenanceMode} 
                onCheckedChange={toggleMaintenance} 
                className="data-[state=checked]:bg-[#4a89dc]"
              />
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">Debug Mode</h3>
                <p className="text-sm text-gray-400">Display detailed error messages and debugging information</p>
              </div>
              <Switch 
                checked={generalSettings.debugMode} 
                onCheckedChange={toggleDebugMode} 
                className="data-[state=checked]:bg-[#4a89dc]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="performanceMode">Performance Mode</Label>
                <Select 
                  value={generalSettings.performanceMode} 
                  onValueChange={(value) => setGeneralSettings({...generalSettings, performanceMode: value})}
                >
                  <SelectTrigger id="performanceMode" className="bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Select performance mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="maximum">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default System Language</Label>
                <Select 
                  value={generalSettings.defaultLanguage} 
                  onValueChange={(value) => setGeneralSettings({...generalSettings, defaultLanguage: value})}
                >
                  <SelectTrigger id="defaultLanguage" className="bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention (days)</Label>
                <Input 
                  id="dataRetention" 
                  type="number" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  value={generalSettings.dataRetentionDays}
                  onChange={(e) => setGeneralSettings({...generalSettings, dataRetentionDays: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeZone">System Time Zone</Label>
                <Select 
                  value={generalSettings.timeZone} 
                  onValueChange={(value) => setGeneralSettings({...generalSettings, timeZone: value})}
                >
                  <SelectTrigger id="timeZone" className="bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">EST (UTC-5)</SelectItem>
                    <SelectItem value="CST">CST (UTC-6)</SelectItem>
                    <SelectItem value="MST">MST (UTC-7)</SelectItem>
                    <SelectItem value="PST">PST (UTC-8)</SelectItem>
                    <SelectItem value="GMT">GMT (UTC+0)</SelectItem>
                    <SelectItem value="CET">CET (UTC+1)</SelectItem>
                    <SelectItem value="EET">EET (UTC+2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Changes</Button>
            <Button variant="outline">Restore Defaults</Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>System Messages</CardTitle>
            <CardDescription className="text-gray-400">
              Configure system-wide messages and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
              <Input 
                id="maintenanceMessage" 
                className="bg-[#050b17] border-[#4a89dc]/20" 
                defaultValue="The system is currently undergoing scheduled maintenance. Please check back later."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Input 
                id="welcomeMessage" 
                className="bg-[#050b17] border-[#4a89dc]/20" 
                defaultValue="Welcome to JET AI - Your intelligent travel companion powered by advanced AI technology."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supportContact">Support Contact Information</Label>
              <Input 
                id="supportContact" 
                className="bg-[#050b17] border-[#4a89dc]/20" 
                defaultValue="support@jetai.com | +1 (555) 123-4567"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Update Messages</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Configure system security parameters and policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">Enforce Strong Passwords</h3>
                <p className="text-sm text-gray-400">Require complex passwords with minimum length of 8 characters</p>
              </div>
              <Switch 
                checked={securitySettings.enforceStrongPasswords} 
                onCheckedChange={toggleStrongPasswords} 
                className="data-[state=checked]:bg-[#4a89dc]"
              />
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Require 2FA for all admin and sensitive operations</p>
              </div>
              <Switch 
                checked={securitySettings.twoFactorAuth} 
                onCheckedChange={toggleTwoFactor} 
                className="data-[state=checked]:bg-[#4a89dc]"
              />
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">IP Restriction</h3>
                <p className="text-sm text-gray-400">Limit admin access to specific IP addresses</p>
              </div>
              <Switch 
                checked={securitySettings.ipRestriction} 
                onCheckedChange={toggleIpRestriction} 
                className="data-[state=checked]:bg-[#4a89dc]"
              />
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">Audit Logging</h3>
                <p className="text-sm text-gray-400">Record all admin actions for compliance and security</p>
              </div>
              <Switch 
                checked={securitySettings.auditLogging} 
                onCheckedChange={toggleAuditLogging} 
                className="data-[state=checked]:bg-[#4a89dc]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input 
                  id="sessionTimeout" 
                  type="number" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input 
                  id="maxLoginAttempts" 
                  type="number" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                />
              </div>
            </div>
            
            {securitySettings.ipRestriction && (
              <div className="space-y-2">
                <Label htmlFor="allowedIps">Allowed IP Addresses (comma separated)</Label>
                <Input 
                  id="allowedIps" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  placeholder="192.168.1.1, 10.0.0.1, etc."
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Security Settings</Button>
            <Button variant="outline">Restore Defaults</Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>SSL Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Configure SSL certificates and secure connection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20 flex items-start space-x-4">
                <div className="p-2 bg-green-500/20 rounded">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">SSL Certificate Status</h4>
                  <p className="text-sm text-gray-400 mt-1">Your SSL certificate is valid and up to date</p>
                  <p className="text-xs text-gray-500 mt-2">Expires: February 15, 2026 (306 days remaining)</p>
                </div>
              </div>
              
              <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20 flex items-start space-x-4">
                <div className="p-2 bg-yellow-500/20 rounded">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-medium">HSTS Configuration</h4>
                  <p className="text-sm text-gray-400 mt-1">HTTP Strict Transport Security is not enabled</p>
                  <p className="text-xs text-gray-500 mt-2">Recommended: Enable HSTS for enhanced security</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Manage SSL Settings</Button>
            <Button variant="outline">Renew Certificate</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="api" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>API Key Management</CardTitle>
            <CardDescription className="text-gray-400">
              Generate and manage API keys for external integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="border-collapse w-full">
              <thead>
                <tr className="border-b border-[#4a89dc]/20">
                  <th className="text-left py-3 text-[#4a89dc]">API Key Name</th>
                  <th className="text-left py-3 text-[#4a89dc]">Created</th>
                  <th className="text-left py-3 text-[#4a89dc]">Permissions</th>
                  <th className="text-left py-3 text-[#4a89dc]">Last Used</th>
                  <th className="text-left py-3 text-[#4a89dc]">Status</th>
                  <th className="text-right py-3 text-[#4a89dc]">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#4a89dc]/20">
                  <td className="py-3">
                    <div className="font-medium">Primary API Key</div>
                    <div className="text-xs text-gray-400">sk_live_****************************1234</div>
                  </td>
                  <td className="py-3">Apr 10, 2025</td>
                  <td className="py-3">Full Access</td>
                  <td className="py-3">Today at 11:42 AM</td>
                  <td className="py-3">
                    <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">Active</span>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="outline" size="sm" className="mr-2">Reveal</Button>
                    <Button variant="outline" size="sm" className="text-red-500">Revoke</Button>
                  </td>
                </tr>
                <tr className="border-b border-[#4a89dc]/20">
                  <td className="py-3">
                    <div className="font-medium">Analytics API Key</div>
                    <div className="text-xs text-gray-400">sk_live_****************************5678</div>
                  </td>
                  <td className="py-3">Mar 25, 2025</td>
                  <td className="py-3">Read Only</td>
                  <td className="py-3">Yesterday at 3:15 PM</td>
                  <td className="py-3">
                    <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">Active</span>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="outline" size="sm" className="mr-2">Reveal</Button>
                    <Button variant="outline" size="sm" className="text-red-500">Revoke</Button>
                  </td>
                </tr>
                <tr className="border-b border-[#4a89dc]/20">
                  <td className="py-3">
                    <div className="font-medium">Testing API Key</div>
                    <div className="text-xs text-gray-400">sk_test_***************************9012</div>
                  </td>
                  <td className="py-3">Feb 18, 2025</td>
                  <td className="py-3">Full Access</td>
                  <td className="py-3">Apr 12, 2025</td>
                  <td className="py-3">
                    <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">Active</span>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="outline" size="sm" className="mr-2">Reveal</Button>
                    <Button variant="outline" size="sm" className="text-red-500">Revoke</Button>
                  </td>
                </tr>
                <tr className="border-b border-[#4a89dc]/20">
                  <td className="py-3">
                    <div className="font-medium">Legacy API Key</div>
                    <div className="text-xs text-gray-400">sk_live_****************************3456</div>
                  </td>
                  <td className="py-3">Jan 05, 2025</td>
                  <td className="py-3">Full Access</td>
                  <td className="py-3">Mar 01, 2025</td>
                  <td className="py-3">
                    <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-full">Revoked</span>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="outline" size="sm" disabled>Reveal</Button>
                    <Button variant="outline" size="sm" disabled>Revoke</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Generate New API Key</Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>API Rate Limiting</CardTitle>
            <CardDescription className="text-gray-400">
              Configure rate limits and quotas for API usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
                <Input 
                  id="rateLimit" 
                  type="number" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  defaultValue="60"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dailyQuota">Daily Quota (requests per day)</Label>
                <Input 
                  id="dailyQuota" 
                  type="number" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  defaultValue="10000"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Rate Limits</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="integrations" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Third-Party Integrations</CardTitle>
            <CardDescription className="text-gray-400">
              Configure connections to external services and APIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border border-[#4a89dc]/20 rounded-md bg-[#050b17]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-500/20 rounded-md flex items-center justify-center">
                    <FileJson className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Vertex AI Integration</h3>
                    <p className="text-sm text-gray-400">Google Cloud AI/ML services</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-green-500 text-sm">Connected</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-[#4a89dc]/20 rounded-md bg-[#050b17]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-500/20 rounded-md flex items-center justify-center">
                    <FileJson className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">OpenAI API</h3>
                    <p className="text-sm text-gray-400">GPT-4o and embeddings</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-green-500 text-sm">Connected</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-[#4a89dc]/20 rounded-md bg-[#050b17]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-500/20 rounded-md flex items-center justify-center">
                    <FileJson className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Amadeus Travel API</h3>
                    <p className="text-sm text-gray-400">Flight and hotel reservations</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-green-500 text-sm">Connected</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-[#4a89dc]/20 rounded-md bg-[#050b17]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-500/20 rounded-md flex items-center justify-center">
                    <FileJson className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Stripe Payment Gateway</h3>
                    <p className="text-sm text-gray-400">Payment processing and subscriptions</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-green-500 text-sm">Connected</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-[#4a89dc]/20 rounded-md bg-[#050b17]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-500/20 rounded-md flex items-center justify-center">
                    <FileJson className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">SendGrid Email Service</h3>
                    <p className="text-sm text-gray-400">Transactional email delivery</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-yellow-500 text-sm">Configuration Required</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Add New Integration</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="storage" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Storage Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Configure storage providers and data storage settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#050b17] border-[#4a89dc]/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Database Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">54.8 GB</div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Database className="h-4 w-4 mr-1" />
                      <span>PostgreSQL</span>
                    </div>
                    <div className="mt-3 h-2 bg-gray-700 rounded-full">
                      <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>35% Used</span>
                      <span>150 GB Allocated</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#050b17] border-[#4a89dc]/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">File Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">128.2 GB</div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <HardDrive className="h-4 w-4 mr-1" />
                      <span>Google Cloud Storage</span>
                    </div>
                    <div className="mt-3 h-2 bg-gray-700 rounded-full">
                      <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>42% Used</span>
                      <span>300 GB Allocated</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#050b17] border-[#4a89dc]/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Cache Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">18.5 GB</div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Layers className="h-4 w-4 mr-1" />
                      <span>Redis</span>
                    </div>
                    <div className="mt-3 h-2 bg-gray-700 rounded-full">
                      <div className="h-full bg-[#4a89dc] rounded-full" style={{ width: '62%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>62% Used</span>
                      <span>30 GB Allocated</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Storage Providers</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="gcs" name="storageProvider" checked className="text-[#4a89dc]" />
                    <label htmlFor="gcs">Google Cloud Storage (Current)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="aws" name="storageProvider" className="text-[#4a89dc]" />
                    <label htmlFor="aws">Amazon S3</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="azure" name="storageProvider" className="text-[#4a89dc]" />
                    <label htmlFor="azure">Azure Blob Storage</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="local" name="storageProvider" className="text-[#4a89dc]" />
                    <label htmlFor="local">Local Storage</label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                  <Input 
                    id="maxFileSize" 
                    type="number" 
                    className="bg-[#050b17] border-[#4a89dc]/20" 
                    defaultValue="50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fileTypes">Allowed File Types (comma separated)</Label>
                  <Input 
                    id="fileTypes" 
                    className="bg-[#050b17] border-[#4a89dc]/20" 
                    defaultValue="jpg, jpeg, png, gif, pdf, doc, docx, xls, xlsx"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bucketName">Storage Bucket Name</Label>
                <Input 
                  id="bucketName" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  defaultValue="jetai-production-storage"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Storage Settings</Button>
            <Button variant="outline">Clear Cache</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="backups" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Backup Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Configure automated backup schedule and retention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="backupFrequency" className="bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                <Input 
                  id="backupRetention" 
                  type="number" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  defaultValue="30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupTime">Daily Backup Time</Label>
                <Input 
                  id="backupTime" 
                  type="time" 
                  className="bg-[#050b17] border-[#4a89dc]/20" 
                  defaultValue="02:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupLocation">Backup Storage Location</Label>
                <Select defaultValue="google">
                  <SelectTrigger id="backupLocation" className="bg-[#050b17] border-[#4a89dc]/20">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Cloud Storage</SelectItem>
                    <SelectItem value="aws">Amazon S3</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">Encrypt Backups</h3>
                <p className="text-sm text-gray-400">Apply AES-256 encryption to backup files</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
              <div>
                <h3 className="font-medium">Include User Files</h3>
                <p className="text-sm text-gray-400">Include user uploaded files in backups</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Recent Backups</h3>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableHead className="text-[#4a89dc]">Backup ID</TableHead>
                    <TableHead className="text-[#4a89dc]">Date</TableHead>
                    <TableHead className="text-[#4a89dc]">Size</TableHead>
                    <TableHead className="text-[#4a89dc]">Type</TableHead>
                    <TableHead className="text-[#4a89dc]">Status</TableHead>
                    <TableHead className="text-right text-[#4a89dc]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableCell className="font-medium">backup-20250415-020000</TableCell>
                    <TableCell>Apr 15, 2025 02:00 AM</TableCell>
                    <TableCell>78.2 GB</TableCell>
                    <TableCell>Full</TableCell>
                    <TableCell>
                      <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">Completed</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Restore</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableCell className="font-medium">backup-20250414-020000</TableCell>
                    <TableCell>Apr 14, 2025 02:00 AM</TableCell>
                    <TableCell>77.9 GB</TableCell>
                    <TableCell>Full</TableCell>
                    <TableCell>
                      <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">Completed</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Restore</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#0f1e36] border-b-[#4a89dc]/20">
                    <TableCell className="font-medium">backup-20250413-020000</TableCell>
                    <TableCell>Apr 13, 2025 02:00 AM</TableCell>
                    <TableCell>77.5 GB</TableCell>
                    <TableCell>Full</TableCell>
                    <TableCell>
                      <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">Completed</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Restore</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Backup Settings</Button>
            <Button variant="outline">Create Manual Backup</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-4">
        <Card className="bg-[#0a1328] border-[#4a89dc]/20">
          <CardHeader>
            <CardTitle>Performance Monitoring</CardTitle>
            <CardDescription className="text-gray-400">
              Monitor system performance and resource usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">CPU Usage</h3>
                <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                  <p className="text-gray-400">CPU usage chart would be rendered here</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Memory Usage</h3>
                <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                  <p className="text-gray-400">Memory usage chart would be rendered here</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Database Queries</h3>
                <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                  <p className="text-gray-400">Database query chart would be rendered here</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">API Response Times</h3>
                <div className="h-60 bg-[#050b17] rounded-md p-4 border border-[#4a89dc]/20 flex items-center justify-center">
                  <p className="text-gray-400">API response time chart would be rendered here</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Optimization Settings</h3>
              
              <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
                <div>
                  <h3 className="font-medium">Enable Caching</h3>
                  <p className="text-sm text-gray-400">Cache frequent queries and API responses</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
                <div>
                  <h3 className="font-medium">Database Query Optimization</h3>
                  <p className="text-sm text-gray-400">Automatically optimize and index frequently used queries</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
                <div>
                  <h3 className="font-medium">Asset Compression</h3>
                  <p className="text-sm text-gray-400">Compress images and static assets for faster loading</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#4a89dc]/20">
                <div>
                  <h3 className="font-medium">Google Cloud CDN</h3>
                  <p className="text-sm text-gray-400">Use CDN for static asset delivery</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#4a89dc]" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#4a89dc]/20 pt-6 gap-2">
            <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">Save Performance Settings</Button>
            <Button variant="outline">Reset Counters</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

interface TableProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead>{children}</thead>;
};

interface TableBodyProps {
  children: React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

const TableHead: React.FC<TableHeadProps> = ({ children, className }) => {
  return <th className={`h-12 px-4 text-left align-middle font-medium ${className}`}>{children}</th>;
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return <td className={`p-4 align-middle ${className}`}>{children}</td>;
};

export default SystemConfiguration;