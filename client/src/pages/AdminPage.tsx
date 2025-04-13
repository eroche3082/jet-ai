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
  SendIcon,
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
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  // Mock authentication credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123456';
  
  // Mock statistics
  const statistics = {
    totalUsers: 0,
    vipUsers: 0,
    standardUsers: 0,
    beginnerUsers: 0,
    languageSpecialists: 0,
    codesGenerated: 0,
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
            <Card className="bg-[#0a1021] border-gray-800">
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Overview of user statistics and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#050b17] rounded-lg p-5 border border-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <h3 className="text-3xl font-bold mt-1">{statistics.totalUsers}</h3>
                      </div>
                      <div className="bg-[#4a89dc]/10 p-2 rounded-md">
                        <Users className="h-5 w-5 text-[#4a89dc]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#050b17] rounded-lg p-5 border border-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">VIP Users</p>
                        <h3 className="text-3xl font-bold mt-1">{statistics.vipUsers}</h3>
                      </div>
                      <div className="bg-[#4a89dc]/10 p-2 rounded-md">
                        <Shield className="h-5 w-5 text-[#4a89dc]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#050b17] rounded-lg p-5 border border-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Codes Generated</p>
                        <h3 className="text-3xl font-bold mt-1">{statistics.codesGenerated}</h3>
                      </div>
                      <div className="bg-[#4a89dc]/10 p-2 rounded-md">
                        <Code className="h-5 w-5 text-[#4a89dc]" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Distribution */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-4">User Category Distribution</h4>
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
                        <span className="text-sm text-gray-400">Beginner Users</span>
                        <span className="text-sm text-gray-400">{statistics.beginnerUsers}</span>
                      </div>
                      <div className="h-2 bg-[#050b17] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${statistics.totalUsers ? (statistics.beginnerUsers / statistics.totalUsers) * 100 : 0}%` }}
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
              </CardContent>
            </Card>
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
        </Tabs>
      </main>
    </div>
  );
}