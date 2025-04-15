import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Shield, Settings, Users, Activity, AlertTriangle, DollarSign, BarChart4, Video, Database } from 'lucide-react';
import SuperAdminNavigation from '@/components/superadmin/SuperAdminNavigation';
import AnalyticsPanel from '@/components/superadmin/AnalyticsPanel';
import FinancialOverview from '@/components/superadmin/FinancialOverview';
import SystemConfiguration from '@/components/superadmin/SystemConfiguration';
import MembershipPanel from '@/components/superadmin/MembershipPanel';
import AgentConfiguration from '@/components/superadmin/AgentConfiguration';
import ClientDatabase from '@/components/superadmin/ClientDatabase';
import AlertsCenter from '@/components/superadmin/AlertsCenter';
import AvatarConfiguration from '@/components/superadmin/AvatarConfiguration';
import MemoryViewer from '@/components/superadmin/MemoryViewer';

const SuperAdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrValue, setQrValue] = useState<string>('');
  const [showFaceRecognition, setShowFaceRecognition] = useState<boolean>(false);

  // Generate QR code on component mount
  useEffect(() => {
    const generateQR = async () => {
      // In a real implementation, this would be a secure token from the backend
      const timestamp = Date.now();
      const secureToken = `jetai-super-admin-${timestamp}`;
      setQrValue(secureToken);
    };

    generateQR();
  }, []);

  // Handle QR code scan (simulated)
  const handleQRScanned = () => {
    setIsLoading(true);
    setShowFaceRecognition(true);
    
    // Simulate API call for QR validation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Handle facial recognition (simulated)
  const handleFaceRecognition = () => {
    setIsLoading(true);
    
    // Simulate API call for face recognition
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 3000);
  };

  // Render login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#050b17] to-[#0a1328] p-4">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-md border-[#4a89dc]/20">
          <CardHeader className="text-center border-b border-[#4a89dc]/20">
            <CardTitle className="text-[#4a89dc] flex items-center justify-center gap-2">
              <Shield /> JET AI Super Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!showFaceRecognition ? (
              <>
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="bg-white p-3 rounded-lg">
                    <QRCodeSVG value={qrValue} size={220} />
                  </div>
                  <p className="text-sm text-center text-gray-300 max-w-xs">
                    Scan this QR code with La Capitana's authenticated mobile device to proceed with Super Admin authentication.
                  </p>
                  {/* This button is for demo purposes - in production it would be triggered by actual QR scan */}
                  <button 
                    onClick={handleQRScanned}
                    className="px-4 py-2 bg-[#4a89dc] hover:bg-[#3a79cc] text-white rounded-md flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {isLoading ? "Verifying..." : "Simulate QR Scan"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="h-56 w-56 bg-gray-800 rounded-lg border-2 border-[#4a89dc]/50 flex items-center justify-center">
                    <div className="text-gray-400">
                      {isLoading ? (
                        <Loader2 className="h-12 w-12 animate-spin" />
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <Users className="h-12 w-12" />
                          <p className="text-xs">Camera would activate here</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-300 max-w-xs">
                    Please look at the camera for facial recognition verification.
                  </p>
                  {/* This button is for demo purposes - in production it would be triggered by actual face recognition */}
                  <button 
                    onClick={handleFaceRecognition}
                    className="px-4 py-2 bg-[#4a89dc] hover:bg-[#3a79cc] text-white rounded-md flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {isLoading ? "Verifying..." : "Simulate Face Recognition"}
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Super Admin dashboard when authenticated
  return (
    <div className="flex min-h-screen bg-[#050b17]">
      <SuperAdminNavigation />
      <div className="flex-1 p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#4a89dc]">JET AI Super Admin Dashboard</h1>
          <p className="text-gray-400">Platform-wide administration and configuration</p>
        </header>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 bg-[#0a1328] border-[#4a89dc]/20 border">
            <TabsTrigger value="analytics" className="flex gap-1 items-center"><BarChart4 className="h-4 w-4" /> Analytics</TabsTrigger>
            <TabsTrigger value="financial" className="flex gap-1 items-center"><DollarSign className="h-4 w-4" /> Financial</TabsTrigger>
            <TabsTrigger value="system" className="flex gap-1 items-center"><Settings className="h-4 w-4" /> System</TabsTrigger>
            <TabsTrigger value="membership" className="flex gap-1 items-center"><Users className="h-4 w-4" /> Membership</TabsTrigger>
            <TabsTrigger value="agents" className="flex gap-1 items-center"><Shield className="h-4 w-4" /> Agents</TabsTrigger>
            <TabsTrigger value="avatars" className="flex gap-1 items-center"><Video className="h-4 w-4" /> Avatars</TabsTrigger>
            <TabsTrigger value="clients" className="flex gap-1 items-center"><Users className="h-4 w-4" /> Clients</TabsTrigger>
            <TabsTrigger value="alerts" className="flex gap-1 items-center"><AlertTriangle className="h-4 w-4" /> Alerts</TabsTrigger>
            <TabsTrigger value="activity" className="flex gap-1 items-center"><Activity className="h-4 w-4" /> Activity</TabsTrigger>
            <TabsTrigger value="memory" className="flex gap-1 items-center"><Database className="h-4 w-4" /> Memory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsPanel />
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <FinancialOverview />
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <SystemConfiguration />
          </TabsContent>
          
          <TabsContent value="membership" className="space-y-4">
            <MembershipPanel />
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-4">
            <AgentConfiguration />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <ClientDatabase />
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <AlertsCenter />
          </TabsContent>
          
          <TabsContent value="avatars" className="space-y-4">
            <AvatarConfiguration />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Activity monitoring and logging will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="memory" className="space-y-4">
            <MemoryViewer userId={isAuthenticated ? "super-admin-user" : ""} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminPage;