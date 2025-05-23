import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
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
      setError('Invalid credentials. Please try username: admin, password: admin123456');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-primary" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <span className="ml-2 text-2xl font-bold">JET AI</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Log in to your JET AI account to access your personalized travel assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
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
              <Button type="submit" className="w-full text-white bg-[#4a89dc] hover:bg-[#3a79cc]" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              <span>Don't have an account? </span>
              <a 
                onClick={() => navigate('/onboarding')} 
                className="text-primary hover:underline cursor-pointer"
              >
                Sign up
              </a>
            </div>
            <div className="text-sm text-center">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Forgot password?
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right Side - Hero Image */}
      <div 
        className="w-full md:w-1/2 bg-cover bg-center hidden md:block"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1569629743817-70d8db6c323b?q=80&w=1974&auto=format&fit=crop')" 
        }}
      >
        <div className="h-full bg-[#050b17]/60 p-12 flex flex-col justify-center">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Unlock Your Travel Potential</h2>
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