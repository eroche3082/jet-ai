import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Compass, 
  Map as MapIcon, 
  Layers, 
  RotateCw, 
  Globe, 
  Info, 
  Landmark, 
  Building 
} from 'lucide-react';

export default function ARPage() {
  const [activeTab, setActiveTab] = useState<string>('monuments');
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Check if AR is supported
  useEffect(() => {
    // In a real app, we would check for WebXR or AR.js support
    // For demo purposes, we'll just check for camera support
    const checkARSupport = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setIsARSupported(true);
      } else {
        setIsARSupported(false);
      }
    };
    
    checkARSupport();
  }, []);
  
  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      
      // Clean up stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission(false);
    }
  };
  
  // Start AR camera
  const startARCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      
      setIsCameraActive(true);
      
      // In a real app, we'd initialize AR.js or WebXR here
      // and start tracking markers or surfaces
      
      // Simulate AR overlay with a simple canvas drawing
      const simulateAROverlay = () => {
        if (!canvasRef.current || !videoRef.current) return;
        
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        // Match canvas size to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw simulated AR elements based on active tab
        if (activeTab === 'monuments') {
          drawMonumentLabels(ctx, canvas.width, canvas.height);
        } else if (activeTab === 'navigation') {
          drawNavigationElements(ctx, canvas.width, canvas.height);
        } else if (activeTab === 'information') {
          drawInformationOverlay(ctx, canvas.width, canvas.height);
        }
        
        // Continue animation
        requestAnimationFrame(simulateAROverlay);
      };
      
      simulateAROverlay();
      
    } catch (error) {
      console.error('Error starting AR camera:', error);
      setIsCameraActive(false);
      setCameraPermission(false);
    }
  };
  
  // Stop AR camera
  const stopARCamera = () => {
    if (!videoRef.current) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };
  
  // Draw simulated monument labels
  const drawMonumentLabels = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Eiffel Tower label
    const x1 = width * 0.3;
    const y1 = height * 0.4;
    
    ctx.beginPath();
    ctx.arc(x1, y1, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 20, y1 - 40);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x1 - 100, y1 - 80, 160, 35);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Eiffel Tower', x1 - 90, y1 - 60);
    ctx.font = '12px Arial';
    ctx.fillText('1.2 km away', x1 - 90, y1 - 45);
    
    // Louvre Museum label
    const x2 = width * 0.7;
    const y2 = height * 0.6;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(x2, y2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 + 20, y2 - 40);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x2 - 60, y2 - 80, 160, 35);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Louvre Museum', x2 - 50, y2 - 60);
    ctx.font = '12px Arial';
    ctx.fillText('0.8 km away', x2 - 50, y2 - 45);
  };
  
  // Draw simulated navigation elements
  const drawNavigationElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw direction arrow
    ctx.fillStyle = 'rgba(0, 128, 255, 0.8)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Arrow pointing forward
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 100);
    ctx.lineTo(centerX - 30, centerY - 40);
    ctx.lineTo(centerX - 10, centerY - 40);
    ctx.lineTo(centerX - 10, centerY - 10);
    ctx.lineTo(centerX + 10, centerY - 10);
    ctx.lineTo(centerX + 10, centerY - 40);
    ctx.lineTo(centerX + 30, centerY - 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Distance indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(centerX - 70, centerY + 50, 140, 60);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Eiffel Tower', centerX, centerY + 70);
    ctx.font = '14px Arial';
    ctx.fillText('650 meters', centerX, centerY + 90);
    ctx.fillText('~8 min walk', centerX, centerY + 110);
    
    // Compass at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(width - 50, height - 50, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(width - 50, height - 80);
    ctx.lineTo(width - 50, height - 20);
    ctx.moveTo(width - 80, height - 50);
    ctx.lineTo(width - 20, height - 50);
    ctx.stroke();
    
    ctx.fillStyle = '#ff3b30';
    ctx.beginPath();
    ctx.moveTo(width - 50, height - 80);
    ctx.lineTo(width - 45, height - 70);
    ctx.lineTo(width - 55, height - 70);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('N', width - 50, height - 65);
    ctx.fillText('S', width - 50, height - 30);
    ctx.fillText('W', width - 70, height - 50);
    ctx.fillText('E', width - 30, height - 50);
  };
  
  // Draw simulated information overlay
  const drawInformationOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Bottom info card
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(20, height - 160, width - 40, 140);
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, height - 160, width - 40, 140);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Notre-Dame Cathedral', 40, height - 130);
    
    ctx.font = '14px Arial';
    ctx.fillText('Gothic cathedral built between 1163-1345', 40, height - 105);
    ctx.fillText('Currently visible: West facade', 40, height - 80);
    ctx.fillText('Opening hours: 8:00 AM - 6:45 PM', 40, height - 55);
    ctx.fillText('Tap for more information', 40, height - 30);
    
    // Highlight building outline
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
    ctx.lineWidth = 2;
    
    // Simulated building outline
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.3);
    ctx.lineTo(width * 0.7, height * 0.3);
    ctx.lineTo(width * 0.7, height * 0.6);
    ctx.lineTo(width * 0.3, height * 0.6);
    ctx.closePath();
    ctx.stroke();
    
    // Highlight points of interest
    ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
    
    // Point 1
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.3, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Point 2
    ctx.beginPath();
    ctx.arc(width * 0.4, height * 0.4, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Point 3
    ctx.beginPath();
    ctx.arc(width * 0.6, height * 0.4, 8, 0, Math.PI * 2);
    ctx.fill();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Augmented Reality Viewer</h1>
      
      {isARSupported === false && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Your device does not support Augmented Reality. Please try using a more recent device with camera support.
          </AlertDescription>
        </Alert>
      )}
      
      {isARSupported === true && cameraPermission === false && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Camera access is required for AR features. Please allow camera access in your browser settings.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AR Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden aspect-[4/3] flex items-center justify-center">
              {isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    playsInline 
                    muted
                  />
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full"
                  />
                </>
              ) : (
                <div className="text-center p-8">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">AR Camera Preview</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Experience your surroundings with augmented information through your device's camera.
                  </p>
                  
                  {cameraPermission === null ? (
                    <Button onClick={requestCameraPermission}>
                      Allow Camera Access
                    </Button>
                  ) : cameraPermission === true ? (
                    <Button onClick={startARCamera}>
                      Start AR Experience
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={requestCameraPermission}>
                      Retry Camera Permission
                    </Button>
                  )}
                </div>
              )}
              
              {isCameraActive && (
                <div className="absolute bottom-4 right-4">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={stopARCamera}
                  >
                    Stop AR
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AR Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">AR Mode</h3>
                <Tabs 
                  defaultValue={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="monuments">
                      <Landmark className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Monuments</span>
                    </TabsTrigger>
                    <TabsTrigger value="navigation">
                      <MapIcon className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Navigation</span>
                    </TabsTrigger>
                    <TabsTrigger value="information">
                      <Info className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Info</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="monuments" className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Displays nearby landmarks and monuments with distance information.
                    </p>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <div className="flex items-start space-x-3">
                        <Landmark className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Landmark Detection</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Points your camera at buildings and landmarks to identify them and get information about their history.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="navigation" className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Shows directional arrows and route information to guide you to your destination.
                    </p>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <div className="flex items-start space-x-3">
                        <Compass className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">AR Navigation</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Follow arrows and on-screen directions overlaid on the real world for easy wayfinding.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="information" className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Provides detailed information about buildings, artworks, and points of interest.
                    </p>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <div className="flex items-start space-x-3">
                        <Building className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Smart Information</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get details about opening hours, historical facts, and architectural information in real-time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Settings</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="w-4 h-4 mr-2" />
                    AR Layer Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Download Offline Maps
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Calibrate Compass
                  </Button>
                </div>
              </div>
              
              <Alert className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                <AlertDescription>
                  Please be aware of your surroundings when using AR. Do not walk while looking at the screen.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}