import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, Camera, ScanLine, Glasses, Share2, PanelLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function ChatPage() {
  const [location, setLocation] = useLocation();
  
  // The UniversalChatbot component automatically detects when it's on the /chat route
  // and will display in fullscreen mode, so this page mainly serves as a container
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Placeholder content that will be behind the chat interface */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center gap-4">
        <Card className="w-full max-w-md p-6 text-center space-y-4">
          <MessageSquare className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">JetAI Chat Interface</h1>
          <p className="text-muted-foreground">
            The chat interface should be visible and maximized on this page.
            If it's not showing, you can navigate back to the home page.
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
          <Card className="p-4 flex flex-col items-center text-center">
            <Mic className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-medium">Voice Input</h3>
            <p className="text-sm text-muted-foreground">
              Speak to JetAI using your voice for a hands-free experience
            </p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center text-center">
            <Camera className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-medium">Image Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Upload or take photos to get information about destinations
            </p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center text-center">
            <ScanLine className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-medium">QR Scanner</h3>
            <p className="text-sm text-muted-foreground">
              Scan QR codes to quickly access travel information
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}