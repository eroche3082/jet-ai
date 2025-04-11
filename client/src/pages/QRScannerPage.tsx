import { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

// This would typically be done with a proper QR code scanning library
// like jsQR or html5-qrcode in a production app
const mockScanQrCode = (videoElement: HTMLVideoElement): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate scanning delay
    setTimeout(() => {
      // Return a mock result
      resolve('https://jetai.travel/itinerary/barcelona-weekend');
    }, 1500);
  });
};

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const { toast } = useToast();
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const checkCameraAvailability = async () => {
    try {
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(cameras.length > 0);
    } catch (error) {
      console.error('Error checking camera:', error);
      setHasCamera(false);
    }
  };
  
  useEffect(() => {
    checkCameraAvailability();
    
    // Clean up on component unmount
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      stopCamera();
    };
  }, []);
  
  const startCamera = async () => {
    if (!videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission('granted');
        setIsScanning(true);
        
        // Start scanning for QR codes
        startQrScanner();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false);
      setCameraPermission('denied');
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan QR codes",
        variant: "destructive"
      });
    }
  };
  
  const stopCamera = () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsScanning(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };
  
  const startQrScanner = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    // Simulate scanning - in a real app this would use a proper QR code library
    scanIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const result = await mockScanQrCode(videoRef.current);
          
          // If we have a result, stop scanning and report it
          if (result) {
            setScannedResult(result);
            stopCamera();
            clearInterval(scanIntervalRef.current!);
            scanIntervalRef.current = null;
            
            toast({
              title: "QR Code Scanned",
              description: "We found a link to an itinerary",
            });
          }
        } catch (error) {
          console.error('Error scanning QR code:', error);
        }
      }
    }, 500);
  };
  
  const restartScanner = () => {
    setScannedResult(null);
    startCamera();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-40 bg-white shadow-sm py-3 px-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="font-display text-xl font-bold text-center flex-1 mr-7">QR Scanner</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {hasCamera ? (
          <>
            {!isScanning && !scannedResult && cameraPermission !== 'denied' && (
              <div className="text-center max-w-md mx-auto">
                <div className="bg-primary/10 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">QR Scanner Feature</h2>
                <p className="text-gray-600 mb-6">
                  Scan QR codes to access itineraries, get information about attractions, or unlock special offers.
                </p>
                <Button onClick={startCamera} className="w-full">
                  Start Scanning
                </Button>
              </div>
            )}
            
            {cameraPermission === 'denied' && (
              <div className="text-center max-w-md mx-auto">
                <div className="bg-red-100 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Camera Access Denied</h2>
                <p className="text-gray-600 mb-6">
                  To scan QR codes, you need to allow camera access in your browser settings.
                </p>
                <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="ghost" className="w-full mt-2">
                    Return to Explore
                  </Button>
                </Link>
              </div>
            )}
            
            {isScanning && !scannedResult && (
              <div className="w-full max-w-lg">
                <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      if (videoRef.current) videoRef.current.play();
                    }}
                  />
                  
                  {/* QR Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2/3 h-2/3 border-2 border-white rounded-lg flex items-center justify-center">
                      <div className="animate-pulse">
                        <QrCode className="h-12 w-12 text-white/80" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-gray-600 mb-4">Position the QR code within the frame to scan</p>
                  <Button onClick={stopCamera} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {scannedResult && (
              <div className="text-center max-w-md mx-auto">
                <div className="bg-green-100 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">QR Code Scanned</h2>
                
                <div className="bg-white p-4 rounded-lg border mb-6">
                  <div className="flex items-center text-primary font-medium mb-2">
                    <LinkIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="truncate">{scannedResult}</p>
                  </div>
                  <p className="text-sm text-gray-500">Barcelona Weekend Itinerary</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link href="/itineraries/barcelona-weekend">
                    <Button className="w-full">
                      View Itinerary
                    </Button>
                  </Link>
                  <Button onClick={restartScanner} variant="outline" className="w-full">
                    Scan Another Code
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-orange-100 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
              <QrCode className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">QR Feature</h2>
            <p className="text-gray-600 mb-6">
              This feature is coming soon. No camera was detected on your device or the feature is not supported in your browser.
            </p>
            <Link href="/">
              <Button className="w-full">
                Return to Explore
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}