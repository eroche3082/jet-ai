import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);
  const { toast } = useToast();
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
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
        setIsCameraActive(true);
        setCameraPermission('granted');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraActive(false);
      setCameraPermission('denied');
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature",
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
    setIsCameraActive(false);
  };
  
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image data URL
      const photoData = canvas.toDataURL('image/jpeg');
      setPhotoTaken(photoData);
      
      // Optional: Stop camera after taking photo
      stopCamera();
      
      toast({
        title: "Photo captured",
        description: "Your photo has been captured successfully",
      });
    }
  };
  
  const discardPhoto = () => {
    setPhotoTaken(null);
    startCamera();
  };
  
  const analyzePhoto = async () => {
    if (!photoTaken) return;
    
    try {
      toast({
        title: "Analyzing photo",
        description: "Your photo is being analyzed...",
      });
      
      // Here you would typically send the photo to your backend for analysis
      // For now we'll just simulate with a timeout
      setTimeout(() => {
        toast({
          title: "Analysis complete",
          description: "We've identified this as a popular tourist landmark. Would you like to learn more?",
        });
      }, 1500);
    } catch (error) {
      console.error('Error analyzing photo:', error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze your photo. Please try again.",
        variant: "destructive"
      });
    }
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
            <h1 className="font-display text-xl font-bold text-center flex-1 mr-7">Camera</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {hasCamera ? (
          <>
            {!isCameraActive && !photoTaken && cameraPermission !== 'denied' && (
              <div className="text-center max-w-md mx-auto">
                <div className="bg-primary/10 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Camera Feature</h2>
                <p className="text-gray-600 mb-6">
                  Use your camera to capture landmarks, scan documents, or search for travel info.
                </p>
                <Button onClick={startCamera} className="w-full">
                  Access Camera
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
                  To use this feature, you need to allow camera access in your browser settings.
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
            
            {isCameraActive && !photoTaken && (
              <div className="w-full max-w-lg relative">
                <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      if (videoRef.current) videoRef.current.play();
                    }}
                  />
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button 
                    onClick={takePhoto}
                    className="rounded-full w-16 h-16 flex items-center justify-center bg-white border-4 border-primary"
                    variant="outline"
                  >
                    <div className="rounded-full w-12 h-12 bg-primary"></div>
                  </Button>
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
            
            {photoTaken && (
              <div className="w-full max-w-lg">
                <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden">
                  <img 
                    src={photoTaken} 
                    alt="Captured photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex justify-between mt-4 gap-4">
                  <Button 
                    onClick={discardPhoto}
                    variant="outline"
                    className="flex-1"
                  >
                    Retake
                  </Button>
                  <Button 
                    onClick={analyzePhoto}
                    className="flex-1"
                  >
                    Use Photo
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-orange-100 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
              <Camera className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Camera Feature</h2>
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