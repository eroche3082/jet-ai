import { useState } from 'react';
import { 
  Award,
  Gift,
  TrendingUp,
  Calendar,
  Share2,
  Mail,
  CreditCard,
  Plane,
  MessageSquare
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Progress 
} from '@/components/ui/progress';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import TravelSummaryEmail from '@/components/TravelSummaryEmail';
import AIChat from '@/components/AIChat';

// Sample data for the rewards page
const rewardActivities = [
  { 
    id: 1, 
    name: 'Complete your first trip', 
    points: 500, 
    completed: true, 
    date: '2025-03-15' 
  },
  { 
    id: 2, 
    name: 'Create and share a social post', 
    points: 100, 
    completed: false 
  },
  { 
    id: 3, 
    name: 'Book accommodation through JET AI', 
    points: 300, 
    completed: true, 
    date: '2025-04-01' 
  },
  { 
    id: 4, 
    name: 'Generate a travel summary', 
    points: 150, 
    completed: false 
  },
  { 
    id: 5, 
    name: 'Refer a friend', 
    points: 1000, 
    completed: false 
  },
  { 
    id: 6, 
    name: 'Complete 5 trips', 
    points: 2500, 
    completed: false 
  }
];

const rewardHistory = [
  { 
    id: 1, 
    description: 'Trip to Paris completed', 
    points: 500, 
    type: 'earned', 
    date: 'Mar 15, 2025' 
  },
  { 
    id: 2, 
    description: 'Booking accommodation in Paris', 
    points: 300, 
    type: 'earned', 
    date: 'Apr 01, 2025' 
  },
  { 
    id: 3, 
    description: '$25 Travel Credit', 
    points: -2500, 
    type: 'redeemed', 
    date: 'Apr 12, 2025' 
  },
];

const availableRewards = [
  {
    id: 1,
    name: '$25 Travel Credit',
    description: 'Get $25 off your next booking',
    points: 2500,
    image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    name: 'Priority Support',
    description: 'Get priority access to our support team for 30 days',
    points: 1500,
    image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGN1c3RvbWVyJTIwc2VydmljZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    name: 'Flight Upgrade',
    description: 'Upgrade your seat on your next flight',
    points: 5000,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZsaWdodHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    name: 'Free Hotel Night',
    description: 'Get one free night at select hotels',
    points: 10000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  }
];

export default function RewardsPage() {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  // Calculate total points (earned minus redeemed)
  const totalPoints = rewardHistory.reduce((acc, item) => {
    return acc + (item.type === 'earned' ? item.points : -item.points);
  }, 0);

  // Calculate progress to next tier
  const currentTier = 'Silver';
  const nextTier = 'Gold';
  const pointsToNextTier = 5000;
  const progress = (totalPoints / pointsToNextTier) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#050b17] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">JET AI - Rewards & Loyalty</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="opacity-75">Welcome,</span>{' '}
              <span className="font-medium">{user?.username || 'Traveler'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-[#050b17] to-[#1a2b50] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Award className="h-5 w-5 mr-2" />
                  Your Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{totalPoints.toLocaleString()}</span>
                  <span className="text-sm opacity-85">Total JetPoints</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Tier: {currentTier}</span>
                    <span>Next: {nextTier}</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/20" />
                  <div className="text-xs mt-1 opacity-85">
                    {Math.round(pointsToNextTier - totalPoints).toLocaleString()} points to {nextTier}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Ways to Earn</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="flex items-center">
                      <Plane className="h-4 w-4 mr-2 text-[#4a89dc]" />
                      Complete a trip
                    </span>
                    <span className="text-[#4a89dc] font-medium">500 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="flex items-center">
                      <Share2 className="h-4 w-4 mr-2 text-[#4a89dc]" />
                      Share on social media
                    </span>
                    <span className="text-[#4a89dc] font-medium">100 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[#4a89dc]" />
                      Generate travel summary
                    </span>
                    <span className="text-[#4a89dc] font-medium">150 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-[#4a89dc]" />
                      Book with JET AI
                    </span>
                    <span className="text-[#4a89dc] font-medium">300 pts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Member Benefits</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="bg-[#4a89dc]/10 p-1 rounded mr-2">
                      <TrendingUp className="h-3 w-3 text-[#4a89dc]" />
                    </div>
                    <span>Exclusive travel deals</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-[#4a89dc]/10 p-1 rounded mr-2">
                      <Gift className="h-3 w-3 text-[#4a89dc]" />
                    </div>
                    <span>Redeem points for rewards</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-[#4a89dc]/10 p-1 rounded mr-2">
                      <Calendar className="h-3 w-3 text-[#4a89dc]" />
                    </div>
                    <span>Priority booking windows</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-[#4a89dc]/10 p-1 rounded mr-2">
                      <Award className="h-3 w-3 text-[#4a89dc]" />
                    </div>
                    <span>Tier upgrades with more benefits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="rewards" className="mt-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="activities">Reward Activities</TabsTrigger>
              <TabsTrigger value="travel-summary">Generate Travel Summary</TabsTrigger>
            </TabsList>

            {/* Available Rewards */}
            <TabsContent value="rewards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {availableRewards.map((reward) => (
                  <Card key={reward.id} className="overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={reward.image} 
                        alt={reward.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center pt-0">
                      <span className="font-bold text-[#4a89dc]">{reward.points.toLocaleString()} points</span>
                      <Button 
                        size="sm" 
                        className="bg-[#4a89dc] hover:bg-[#3a79cc]"
                        disabled={totalPoints < reward.points}
                      >
                        Redeem
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reward Activities */}
            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>Reward Activities</CardTitle>
                  <CardDescription>Complete these activities to earn more JetPoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewardActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.name}</TableCell>
                          <TableCell>{activity.points}</TableCell>
                          <TableCell>
                            {activity.completed ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Completed
                                {activity.date && <span className="ml-1 text-gray-500">• {activity.date}</span>}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!activity.completed && (
                              <Button size="sm" variant="outline">
                                Start
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Points History</CardTitle>
                  <CardDescription>Recent transactions in your rewards account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewardHistory.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              transaction.type === 'earned' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {transaction.type === 'earned' ? 'Earned' : 'Redeemed'}
                            </span>
                          </TableCell>
                          <TableCell className={`text-right font-medium ${
                            transaction.type === 'earned' ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.points}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Travel Summary Generator */}
            <TabsContent value="travel-summary">
              <Card>
                <CardHeader>
                  <CardTitle>Travel Summary Email</CardTitle>
                  <CardDescription>
                    Generate a beautiful summary of your trip and earn 150 points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TravelSummaryEmail />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Chat Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-[#4a89dc] hover:bg-[#3a79cc] text-white shadow-lg"
        onClick={toggleChat}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl rounded-lg overflow-hidden z-50">
          <AIChat />
        </div>
      )}
    </div>
  );
}