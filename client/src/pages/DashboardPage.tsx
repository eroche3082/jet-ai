import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  AreaChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  MapIcon,
  CalendarIcon,
  MessageSquareIcon,
  PlaneIcon,
  HotelIcon,
  UserIcon,
  CreditCardIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIChat from '@/components/AIChat';

const data = [
  { month: 'Jan', searches: 65, bookings: 28 },
  { month: 'Feb', searches: 59, bookings: 25 },
  { month: 'Mar', searches: 80, bookings: 40 },
  { month: 'Apr', searches: 81, bookings: 35 },
  { month: 'May', searches: 56, bookings: 28 },
  { month: 'Jun', searches: 55, bookings: 30 },
  { month: 'Jul', searches: 40, bookings: 20 },
];

const predictiveData = [
  { month: 'Aug', searches: 65, bookings: 32 },
  { month: 'Sep', searches: 75, bookings: 37 },
  { month: 'Oct', searches: 85, bookings: 42 },
  { month: 'Nov', searches: 70, bookings: 35 },
  { month: 'Dec', searches: 90, bookings: 45 },
];

const upcomingTrips = [
  {
    id: 1,
    destination: 'Paris, France',
    startDate: '2025-05-15',
    endDate: '2025-05-22',
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'
  },
  {
    id: 2,
    destination: 'Tokyo, Japan',
    startDate: '2025-06-10',
    endDate: '2025-06-18',
    status: 'Planning',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2487&auto=format&fit=crop'
  },
];

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [isShowingAIChat, setIsShowingAIChat] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUsername(user.username || 'Guest');
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {username}</h1>
          <p className="text-gray-600">Here's an overview of your travel plans and insights</p>
        </div>
        <Button 
          size="lg" 
          className="flex items-center gap-2 bg-[#3a55e7] hover:bg-[#2b3fbb]"
          onClick={() => setIsShowingAIChat(!isShowingAIChat)}
        >
          <MessageSquareIcon size={18} />
          <span>Ask AI Assistant</span>
        </Button>
      </div>

      {isShowingAIChat && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <AIChat />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base">Total Itineraries</CardTitle>
              <CardDescription>Created travel plans</CardDescription>
            </div>
            <MapIcon className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base">Upcoming Trips</CardTitle>
              <CardDescription>Confirmed bookings</CardDescription>
            </div>
            <CalendarIcon className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next: Paris, May 15</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base">AI Interactions</CardTitle>
              <CardDescription>Chats with assistant</CardDescription>
            </div>
            <MessageSquareIcon className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">8 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Travel Activity</CardTitle>
            <CardDescription>Your searches and bookings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="searches" fill="#3a55e7" name="Searches" />
                  <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Predictive Trends</CardTitle>
            <CardDescription>AI-generated forecast for your travel patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[...data, ...predictiveData]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="searches" 
                    stroke="#3a55e7" 
                    fill="#3a55e7" 
                    fillOpacity={0.2}
                    name="Searches"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.2}
                    name="Bookings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Trips</CardTitle>
          <CardDescription>Your scheduled and planned travel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingTrips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden h-full border shadow-sm">
                <div 
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${trip.image})` }}
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{trip.destination}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <CalendarIcon size={14} className="mr-1" />
                    <span>
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium 
                        ${trip.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-[#ebeffe] text-[#3a55e7]'}
                      `}
                    >
                      {trip.status}
                    </span>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}