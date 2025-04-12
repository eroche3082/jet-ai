import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'wouter';

export default function ChatPage() {
  const [location, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center gap-4">
        <Card className="w-full max-w-md p-6 text-center space-y-4">
          <MessageSquare className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Chat Functionality Removed</h1>
          <p className="text-muted-foreground">
            The chat functionality has been removed from this application.
            Please navigate back to the home page.
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}