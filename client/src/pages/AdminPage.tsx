import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  BarChart3, 
  Download, 
  Search, 
  Filter, 
  LogOut,
  Shield,
  Code,
  Mail,
  Send as SendIcon,
  Info 
} from 'lucide-react';
import { useLocation } from 'wouter';

// Define user types
interface UserData {
  id: string;
  name: string;
  email: string;
  code: string;
  category: string;
  platform: string;
  level: string;
  dateCreated: string;
  preferences?: any;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  // Mock authentication credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123456';
  
  // Analytics data
  const statistics = {
    totalUsers: 0,
    vipUsers: 0,
    standardUsers: 0,
    beginnerUsers: 0,
    languageSpecialists: 0,
    codesGenerated: 0,
    // Additional statistics for enhanced analytics
    destinationsVisited: 15,
    upcomingTrips: 8,
    activeBudgets: 12,
    totalRewards: 2450,
    aiInteractions: 348,
    // Daily stats for 7 days
    dailyStats: [
      { date: '2025-04-08', users: 3, searches: 25, bookings: 1 },
      { date: '2025-04-09', users: 5, searches: 42, bookings: 2 },
      { date: '2025-04-10', users: 8, searches: 63, bookings: 3 },
      { date: '2025-04-11', users: 4, searches: 37, bookings: 1 },
      { date: '2025-04-12', users: 7, searches: 59, bookings: 4 },
      { date: '2025-04-13', users: 10, searches: 78, bookings: 5 },
      { date: '2025-04-14', users: 6, searches: 45, bookings: 2 }
    ],
    // Platform usage
    platformUsage: {
      web: 65,
      mobile: 35,
      ios: 20,
      android: 15
    },
    // Top destinations
    topDestinations: [
      { name: 'Tokyo, Japan', count: 18 },
      { name: 'Paris, France', count: 15 },
      { name: 'New York, USA', count: 12 },
      { name: 'Barcelona, Spain', count: 10 },
      { name: 'London, UK', count: 8 }
    ],
    // User engagement categories
    engagement: {
      activeUsers: 42,
      returning: 28,
      new: 14,
      churnRate: 3.5
    },
    // AI feature usage
    aiFeatureUsage: [
      { feature: 'Smart Recommendations', usage: 78 },
      { feature: 'Trip Planning', usage: 65 },
      { feature: 'Language Translation', usage: 42 },
      { feature: 'Budget Optimization', usage: 38 },
      { feature: 'Safety Alerts', usage: 22 }
    ]
  };
  
  useEffect(() => {
    // Check if already authenticated
    const adminAuth = localStorage.getItem('jetai_admin_auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadUsers();
    }
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('jetai_admin_auth', 'true');
      setIsAuthenticated(true);
      loadUsers();
      toast({
        title: 'Login successful',
        description: 'Welcome to the JET AI admin panel.',
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('jetai_admin_auth');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out of the admin panel.',
    });
  };
  
  const loadUsers = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we're loading from localStorage (if any users have been created via onboarding)
      const mockUsers: UserData[] = [];
      
      // Check localStorage for any users created through the onboarding process
      const storedUserData = localStorage.getItem('jetai_user_data');
      const storedUserCode = localStorage.getItem('jetai_user_code');
      const storedUserCategory = localStorage.getItem('jetai_user_category');
      
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          mockUsers.push({
            id: '1',
            name: userData.name || 'Unknown',
            email: userData.email || 'unknown@example.com',
            code: storedUserCode || 'TRAVEL-BEG-0000',
            category: storedUserCategory || 'Standard Traveler',
            platform: 'JET AI Travel',
            level: storedUserCategory?.includes('VIP') ? 'VIP' : 'Standard',
            dateCreated: new Date().toISOString().split('T')[0],
            preferences: userData.preferences,
          });
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }
      
      // Add mock data if no real users
      if (mockUsers.length === 0) {
        mockUsers.push(
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            code: 'TRAVEL-VIP-FR-2025',
            category: 'Luxury Traveler with French proficiency',
            platform: 'JET AI Travel',
            level: 'VIP',
            dateCreated: '2025-04-12',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            code: 'TRAVEL-ADV-ES-2025',
            category: 'Adventure Seeker with Spanish proficiency',
            platform: 'JET AI Travel',
            level: 'Standard',
            dateCreated: '2025-04-11',
          },
          {
            id: '3',
            name: 'Alex Johnson',
            email: 'alex.j@example.com',
            code: 'TRAVEL-BIZ-JP-2025',
            category: 'Business Traveler with Japanese proficiency',
            platform: 'JET AI Travel',
            level: 'Standard',
            dateCreated: '2025-04-10',
          }
        );
      }
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
      // Update statistics
      statistics.totalUsers = mockUsers.length;
      statistics.vipUsers = mockUsers.filter(user => user.level === 'VIP').length;
      statistics.standardUsers = mockUsers.filter(user => user.level === 'Standard').length;
      statistics.beginnerUsers = mockUsers.filter(user => user.category.includes('Beginner')).length;
      statistics.languageSpecialists = mockUsers.filter(user => 
        user.category.includes('Spanish') || 
        user.category.includes('French') || 
        user.category.includes('German') || 
        user.category.includes('Italian') || 
        user.category.includes('Japanese') || 
        user.category.includes('Chinese') || 
        user.category.includes('Portuguese') || 
        user.category.includes('Russian') || 
        user.category.includes('Arabic') || 
        user.category.includes('Korean')
      ).length;
      statistics.codesGenerated = mockUsers.length;
      
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.code.toLowerCase().includes(query) ||
        user.category.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  };
  
  const exportToCSV = () => {
    if (users.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no users to export.',
        variant: 'destructive',
      });
      return;
    }
    
    const headers = ['Name', 'Email', 'Code', 'Category', 'Platform', 'Level', 'Date Created'];
    const csvData = users.map(user => [
      user.name,
      user.email,
      user.code,
      user.category,
      user.platform,
      user.level,
      user.dateCreated,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(',')),
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'jetai_users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export successful',
      description: 'User data has been exported to CSV.',
    });
  };
  
  const handleSendEmail = async () => {
    if (selectedUsers.length === 0 || !emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select recipients and provide both subject and content.',
        variant: 'destructive',
      });
      return;
    }
    
    setSendingEmail(true);
    
    try {
      // Get the selected users' email addresses
      const selectedUsersData = users.filter(user => selectedUsers.includes(user.id));
      
      // For each selected user, send an email
      const emailPromises = selectedUsersData.map(async (user) => {
        try {
          const response = await fetch('/api/notifications/send-custom', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              subject: emailSubject,
              content: emailContent,
              code: user.code,
              category: user.category
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to send email to ${user.email}`);
          }
          
          return { success: true, email: user.email };
        } catch (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          return { success: false, email: user.email, error };
        }
      });
      
      const results = await Promise.all(emailPromises);
      const successCount = results.filter(r => r.success).length;
      
      if (successCount === selectedUsersData.length) {
        toast({
          title: 'Email Sent Successfully',
          description: `Email sent to ${successCount} ${successCount === 1 ? 'user' : 'users'}.`,
        });
        
        // Reset form
        setEmailSubject('');
        setEmailContent('');
        setSelectedUsers([]);
      } else {
        toast({
          title: 'Partial Success',
          description: `Sent to ${successCount} out of ${selectedUsersData.length} users. Some emails failed to send.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: 'Error',
        description: 'Failed to send emails. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSendingEmail(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050b17] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-[#4a89dc]/30 bg-gradient-to-b from-[#0a1021] to-[#050b17]">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-[#4a89dc]" />
            </div>
            <CardTitle className="text-2xl text-center text-white">Admin Login</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="username"
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#050b17] border-gray-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#050b17] border-gray-700 text-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Default credentials: admin / admin123456</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#050b17] text-white">
      {/* Header */}
      <header className="bg-[#0a1021] border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-[#4a89dc]" />
            <h1 className="text-xl font-bold">JET AI Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => setLocation('/')}
            >
              View Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-[#0a1021] border border-gray-800 p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-[#4a89dc] data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#4a89dc] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="codes" className="data-[state=active]:bg-[#4a89dc] data-[state=active]:text-white">
              <Code className="h-4 w-4 mr-2" />
              Access Codes
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#4a89dc] data-[state=active]:text-white">
              <Mail className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-[#0a1021] border-gray-800">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription className="text-gray-400">
                  View and manage all users registered in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-6">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-10 bg-[#050b17] border-gray-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:text-white"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#4a89dc] text-[#4a89dc] hover:bg-[#4a89dc]/10"
                      onClick={exportToCSV}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="py-10 text-center">
                    <div className="inline-block animate-spin h-8 w-8 border-4 border-[#4a89dc] border-t-transparent rounded-full"></div>
                    <p className="mt-2 text-gray-400">Loading user data...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-gray-400">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-[#0a1021]">
                          <TableHead className="text-gray-400">Name</TableHead>
                          <TableHead className="text-gray-400">Email</TableHead>
                          <TableHead className="text-gray-400">Code</TableHead>
                          <TableHead className="text-gray-400">Category</TableHead>
                          <TableHead className="text-gray-400">Level</TableHead>
                          <TableHead className="text-gray-400">Date Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id} className="border-gray-800 hover:bg-[#0a1021]/50">
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <code className="bg-[#050b17] px-2 py-1 rounded text-sm font-mono">
                                {user.code}
                              </code>
                            </TableCell>
                            <TableCell>{user.category}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                user.level === 'VIP'
                                  ? 'bg-[#4a89dc]/20 text-[#4a89dc]'
                                  : 'bg-gray-700/20 text-gray-300'
                              }`}>
                                {user.level}
                              </span>
                            </TableCell>
                            <TableCell>{user.dateCreated}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Overview Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#0a1021] border-gray-800 hover:border-[#4a89dc]/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics.totalUsers}</h3>
                      <p className="text-xs text-green-500 mt-1">↑ 12% growth</p>
                    </div>
                    <div className="bg-[#4a89dc]/10 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-[#4a89dc]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#0a1021] border-gray-800 hover:border-[#4a89dc]/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm">Destinations Visited</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics.destinationsVisited}</h3>
                      <p className="text-xs text-green-500 mt-1">↑ 8% this month</p>
                    </div>
                    <div className="bg-[#4a89dc]/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-[#4a89dc]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#0a1021] border-gray-800 hover:border-[#4a89dc]/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm">Active Budgets</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics.activeBudgets}</h3>
                      <p className="text-xs text-green-500 mt-1">↑ 15% this week</p>
                    </div>
                    <div className="bg-[#4a89dc]/10 p-3 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-[#4a89dc]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#0a1021] border-gray-800 hover:border-[#4a89dc]/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm">AI Interactions</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics.aiInteractions}</h3>
                      <p className="text-xs text-green-500 mt-1">↑ 23% increase</p>
                    </div>
                    <div className="bg-[#4a89dc]/10 p-3 rounded-lg">
                      <Brain className="h-6 w-6 text-[#4a89dc]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Analytics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Analytics Card */}
              <Card className="bg-[#0a1021] border-gray-800 col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#4a89dc]" />
                    User Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Detailed user statistics and distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {/* User Types Distribution */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-gray-300">User Distribution</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-400">Standard Users</span>
                            <span className="text-sm text-gray-400">{statistics.standardUsers}</span>
                          </div>
                          <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${statistics.totalUsers ? (statistics.standardUsers / statistics.totalUsers) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-400">VIP Users</span>
                            <span className="text-sm text-gray-400">{statistics.vipUsers}</span>
                          </div>
                          <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#4a89dc]" 
                              style={{ width: `${statistics.totalUsers ? (statistics.vipUsers / statistics.totalUsers) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-400">Language Specialists</span>
                            <span className="text-sm text-gray-400">{statistics.languageSpecialists}</span>
                          </div>
                          <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500" 
                              style={{ width: `${statistics.totalUsers ? (statistics.languageSpecialists / statistics.totalUsers) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Platform Usage */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-gray-300">Platform Usage</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#050b17] rounded-lg p-3 text-center border border-gray-800">
                          <p className="text-2xl font-bold text-[#4a89dc]">{statistics.platformUsage.web}%</p>
                          <p className="text-xs text-gray-400 mt-1">Web Platform</p>
                        </div>
                        <div className="bg-[#050b17] rounded-lg p-3 text-center border border-gray-800">
                          <p className="text-2xl font-bold text-[#4a89dc]">{statistics.platformUsage.mobile}%</p>
                          <p className="text-xs text-gray-400 mt-1">Mobile Platform</p>
                        </div>
                        <div className="bg-[#050b17] rounded-lg p-3 text-center border border-gray-800">
                          <p className="text-2xl font-bold text-[#4a89dc]">{statistics.platformUsage.ios}%</p>
                          <p className="text-xs text-gray-400 mt-1">iOS Usage</p>
                        </div>
                        <div className="bg-[#050b17] rounded-lg p-3 text-center border border-gray-800">
                          <p className="text-2xl font-bold text-[#4a89dc]">{statistics.platformUsage.android}%</p>
                          <p className="text-xs text-gray-400 mt-1">Android Usage</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Engagement */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-gray-300">User Engagement</h4>
                      <div className="bg-[#050b17] rounded-lg p-4 border border-gray-800">
                        <div className="flex justify-between mb-2">
                          <div>
                            <p className="text-sm text-gray-400">Active Users</p>
                            <p className="text-lg font-bold">{statistics.engagement.activeUsers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Churn Rate</p>
                            <p className="text-lg font-bold">{statistics.engagement.churnRate}%</p>
                          </div>
                        </div>
                        <div className="flex justify-between mt-3">
                          <div>
                            <p className="text-sm text-gray-400">New Users</p>
                            <p className="text-lg font-bold">{statistics.engagement.new}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Returning</p>
                            <p className="text-lg font-bold">{statistics.engagement.returning}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Activity Trends Card */}
              <Card className="bg-[#0a1021] border-gray-800 col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-[#4a89dc]" />
                    Activity Trends
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    7-day overview of users, searches, and bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] pt-4 px-4">
                    {/* This would be a chart in a real implementation */}
                    <div className="relative h-full flex items-end p-4 border-b border-l border-gray-700">
                      {/* X and Y axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between">
                        <span className="text-xs text-gray-500">80</span>
                        <span className="text-xs text-gray-500">60</span>
                        <span className="text-xs text-gray-500">40</span>
                        <span className="text-xs text-gray-500">20</span>
                        <span className="text-xs text-gray-500">0</span>
                      </div>
                      
                      {/* Chart bars - this is a simple representation */}
                      <div className="w-full h-full flex justify-between pl-10">
                        {statistics.dailyStats.map((day, index) => (
                          <div key={index} className="flex flex-col items-center justify-end h-full">
                            <div className="relative flex flex-col items-center justify-end w-12">
                              {/* Bookings bar */}
                              <div 
                                className="w-3 bg-green-500 rounded-t-sm mb-px" 
                                style={{ height: `${(day.bookings / 10) * 100}%` }}
                                title={`${day.bookings} bookings`}
                              ></div>
                              
                              {/* Users bar */}
                              <div 
                                className="w-3 bg-[#4a89dc] rounded-t-sm mb-px" 
                                style={{ height: `${(day.users / 10) * 100}%` }}
                                title={`${day.users} users`}
                              ></div>
                              
                              {/* Searches bar */}
                              <div 
                                className="w-3 bg-purple-500 rounded-t-sm" 
                                style={{ height: `${(day.searches / 100) * 100}%` }}
                                title={`${day.searches} searches`}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">{day.date.split('-')[2]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Chart Legend */}
                    <div className="flex justify-center items-center mt-6 space-x-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm bg-purple-500 mr-2"></div>
                        <span className="text-xs text-gray-400">Searches</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm bg-[#4a89dc] mr-2"></div>
                        <span className="text-xs text-gray-400">Users</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                        <span className="text-xs text-gray-400">Bookings</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Feature Insights */}
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-4 text-gray-300">AI Feature Usage Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {statistics.aiFeatureUsage.map((feature, index) => (
                        <div key={index} className="bg-[#050b17] rounded-lg p-3 border border-gray-800 flex flex-col items-center">
                          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
                            <div 
                              className="bg-[#4a89dc] h-1.5 rounded-full" 
                              style={{ width: `${(feature.usage / 100) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-center">{feature.feature}</p>
                          <p className="text-lg font-bold text-[#4a89dc]">{feature.usage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Top Destinations & Travel Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#0a1021] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-[#4a89dc]" />
                    Top Destinations
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Most popular travel destinations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statistics.topDestinations.map((destination, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-[#4a89dc]/20 flex items-center justify-center text-sm mr-3">
                            {index + 1}
                          </div>
                          <span>{destination.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold mr-2">{destination.count}</span>
                          <span className="text-xs text-gray-500">visits</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#0a1021] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Rocket className="h-5 w-5 mr-2 text-[#4a89dc]" />
                    System Performance
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Key metrics and operational status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#050b17] rounded-lg p-4 border border-gray-800">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-300">AI Response Time</h4>
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">Excellent</span>
                      </div>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold">0.8</span>
                        <span className="text-sm text-gray-400 ml-1">seconds</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#050b17] rounded-lg p-4 border border-gray-800">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-300">System Uptime</h4>
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">Stable</span>
                      </div>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold">99.9</span>
                        <span className="text-sm text-gray-400 ml-1">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">API Health</span>
                        <span className="text-xs text-green-400">Operational</span>
                      </div>
                      <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[98%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Database Performance</span>
                        <span className="text-xs text-green-400">Optimal</span>
                      </div>
                      <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[95%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Memory Usage</span>
                        <span className="text-xs text-yellow-400">Moderate</span>
                      </div>
                      <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[65%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Storage Usage</span>
                        <span className="text-xs text-green-400">Low</span>
                      </div>
                      <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[30%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Codes Tab */}
          <TabsContent value="codes" className="space-y-6">
            <Card className="bg-[#0a1021] border-gray-800">
              <CardHeader>
                <CardTitle>Access Codes</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage and track generated access codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-[#0a1021]">
                        <TableHead className="text-gray-400">Access Code</TableHead>
                        <TableHead className="text-gray-400">User</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Date Created</TableHead>
                        <TableHead className="text-gray-400">Language</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        // Extract language from category if available
                        let language = 'None';
                        if (user.category) {
                          const languageMatch = user.category.match(/with (\w+) proficiency/);
                          if (languageMatch && languageMatch[1]) {
                            language = languageMatch[1];
                          }
                        }
                        
                        // Extract code type
                        let codeType = 'Standard';
                        if (user.code) {
                          if (user.code.includes('-VIP')) {
                            codeType = 'VIP';
                          } else if (user.code.includes('-ADV')) {
                            codeType = 'Adventure';
                          } else if (user.code.includes('-BIZ')) {
                            codeType = 'Business';
                          } else if (user.code.includes('-FAM')) {
                            codeType = 'Family';
                          } else if (user.code.includes('-EXP')) {
                            codeType = 'Explorer';
                          } else if (user.code.includes('-BEG')) {
                            codeType = 'Beginner';
                          }
                        }
                        
                        return (
                          <TableRow key={user.id} className="border-gray-800 hover:bg-[#0a1021]/50">
                            <TableCell>
                              <code className="bg-[#050b17] px-2 py-1 rounded text-sm font-mono">
                                {user.code}
                              </code>
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                codeType === 'VIP'
                                  ? 'bg-[#4a89dc]/20 text-[#4a89dc]'
                                  : codeType === 'Adventure'
                                  ? 'bg-green-500/20 text-green-400'
                                  : codeType === 'Business'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-gray-700/20 text-gray-300'
                              }`}>
                                {codeType}
                              </span>
                            </TableCell>
                            <TableCell>{user.dateCreated}</TableCell>
                            <TableCell>
                              {language !== 'None' && (
                                <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                                  {language}
                                </span>
                              )}
                              {language === 'None' && (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-[#0a1021] border-gray-800">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription className="text-gray-400">
                  Send email notifications to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Select Recipients</h3>
                    <div className="bg-[#050b17] border border-gray-800 rounded-md p-4 max-h-60 overflow-y-auto">
                      {users.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No users available</p>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center mb-3">
                            <input
                              type="checkbox"
                              id="select-all"
                              className="h-4 w-4 rounded border-gray-700 bg-[#050b17] text-[#4a89dc]"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(users.map(user => user.id));
                                } else {
                                  setSelectedUsers([]);
                                }
                              }}
                              checked={selectedUsers.length === users.length && users.length > 0}
                            />
                            <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                              Select All Users
                            </label>
                          </div>
                          
                          {users.map((user) => (
                            <div key={user.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`user-${user.id}`}
                                className="h-4 w-4 rounded border-gray-700 bg-[#050b17] text-[#4a89dc]"
                                value={user.id}
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                  }
                                }}
                              />
                              <label htmlFor={`user-${user.id}`} className="ml-2 text-sm flex justify-between w-full">
                                <span>{user.name}</span>
                                <span className="text-gray-400">{user.email}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {selectedUsers.length} {selectedUsers.length === 1 ? 'user' : 'users'} selected
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="email-subject" className="block text-sm font-medium mb-1">
                        Email Subject
                      </label>
                      <Input
                        id="email-subject"
                        placeholder="Enter email subject..."
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="bg-[#050b17] border-gray-700 w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email-content" className="block text-sm font-medium mb-1">
                        Email Content
                      </label>
                      <textarea
                        id="email-content"
                        placeholder="Enter email content..."
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className="w-full h-40 rounded-md border border-gray-700 bg-[#050b17] p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#4a89dc]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      className="bg-[#4a89dc] hover:bg-[#3a79cc]"
                      disabled={
                        selectedUsers.length === 0 ||
                        !emailSubject.trim() ||
                        !emailContent.trim() ||
                        sendingEmail
                      }
                      onClick={handleSendEmail}
                    >
                      {sendingEmail ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <SendIcon className="mr-2 h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}