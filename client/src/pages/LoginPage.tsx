import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plane } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials');
  const [, navigate] = useLocation();

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // For demo purposes, we're using hardcoded credentials
    if (username === 'admin' && password === 'admin123456') {
      // Simulate API call delay
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'admin' }));
        navigate('/dashboard');
      }, 1000);
    } else {
      setIsLoading(false);
      setError('Invalid credentials. Try admin/admin123456');
    }
  };

  const handleAccessCodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate Access Code validation
    if (accessCode && (accessCode.startsWith('JET-') || accessCode === 'EDU-VIP-7121')) {
      // Simulate API call delay
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ username: 'guest', role: 'premium', accessCode }));
        navigate('/dashboard');
      }, 1000);
    } else {
      setIsLoading(false);
      setError('Invalid access code. Try EDU-VIP-7121');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-6">
              <Plane className="h-10 w-10 text-[#4a89dc]" />
              <span className="ml-2 text-2xl font-bold">JET <span className="text-[#4a89dc]">AI</span></span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">AI Assistant</CardTitle>
            <CardDescription className="text-center">
              Log in to access your travel platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="credentials" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="accessCode">Access Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="credentials">
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  {activeTab === 'credentials' && error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#4a89dc] hover:bg-[#4a89dc]/90 text-white font-medium py-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                  
                  <div className="text-sm text-center text-gray-500 mt-4">
                    <div>Default username: <span className="font-medium">admin</span></div>
                    <div>Password: <span className="font-medium">admin123456</span></div>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="accessCode">
                <form onSubmit={handleAccessCodeLogin} className="space-y-4">
                  {activeTab === 'accessCode' && error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="accessCode">Your Access Code</Label>
                    <Input
                      id="accessCode"
                      type="text"
                      placeholder="Example: EDU-VIP-1234"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#4a89dc] hover:bg-[#4a89dc]/90 text-white font-medium py-2" 
                    disabled={isLoading}
                  >
                    Access Dashboard
                  </Button>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-700 font-medium mb-1">Your code from onboarding:</p>
                    <p className="text-center text-xl font-bold text-blue-800">EDU-VIP-7121</p>
                  </div>
                  
                  <p className="text-sm text-center text-gray-500 mt-4">
                    Access your personalized dashboard using the code generated during onboarding.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              <a 
                onClick={() => navigate('/')} 
                className="text-[#4a89dc] hover:underline cursor-pointer"
              >
                Back to main page
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right Side - Hero Image */}
      <div 
        className="w-full md:w-1/2 bg-cover bg-center hidden md:block"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1569629743817-70d8db6c323b?q=80&w=2071&auto=format&fit=crop')" 
        }}
      >
        <div className="h-full bg-[#050b17]/70 p-12 flex flex-col justify-center">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Unlock Your Travel Potential with JET AI</h2>
            <p className="text-lg opacity-90 mb-8">
              Log in to access your AI travel assistant, saved itineraries, and personalized recommendations. 
              Your next adventure is just a few clicks away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}