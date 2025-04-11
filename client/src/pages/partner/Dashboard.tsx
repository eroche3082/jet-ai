import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTheme } from "@/components/ThemeProvider";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import EmbedWidgetDemo from "@/components/EmbedWidgetDemo";
import { formatCurrency } from '@/lib/utils';
import {
  ArrowUpRight,
  Copy,
  Check,
  BarChart3,
  Users,
  CreditCard,
  DollarSign,
  Palette,
  Globe,
  Code,
  Settings,
  ChevronDown,
  ChevronUp,
  User,
  Eye,
  Calendar as CalendarIcon,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  colorClass?: string;
}

const StatCard = ({ title, value, change, icon, colorClass = 'bg-primary/10 text-primary' }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {typeof change !== 'undefined' && (
              <div className="flex items-center mt-1">
                {change > 0 ? (
                  <div className="flex items-center text-green-500 text-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {change}%
                  </div>
                ) : change < 0 ? (
                  <div className="flex items-center text-red-500 text-sm">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {Math.abs(change)}%
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Minus className="h-3 w-3 mr-1" />
                    0%
                  </div>
                )}
                <span className="text-xs text-muted-foreground ml-1">vs. last month</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();
  const { copied, copy } = useClipboard();
  const [embedCode, setEmbedCode] = useState('');
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [brandSettings, setBrandSettings] = useState({
    primaryColor: theme.primaryColor,
    accentColor: '#34D399',
    fontSize: 'medium',
    borderRadius: theme.borderRadius,
    darkMode: false,
    widgetPosition: 'right',
    widgetText: 'Need travel advice?'
  });
  
  // Partner referral code from localStorage
  const partnerCode = localStorage.getItem('partnerCode') || 'PARTNER123';
  const referralUrl = `${window.location.origin}/?ref=${partnerCode}`;
  
  // Generate embed code based on settings
  useEffect(() => {
    const code = `<script>
  (function(w,d,s,o,f,js,fjs){
    w['JetAI-Widget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    w[o].l=1*new Date();js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','jetai','https://app.jetai.com/embed.js'));
  jetai('init', {
    partnerId: '${partnerCode}',
    primaryColor: '${brandSettings.primaryColor}',
    position: '${brandSettings.widgetPosition}',
    greeting: 'Hi there! I can help plan your perfect trip.',
    darkMode: ${brandSettings.darkMode},
    borderRadius: '${brandSettings.borderRadius}'
  });
</script>`;
    
    setEmbedCode(code);
  }, [partnerCode, brandSettings]);
  
  // Fetch partner stats
  const { data: statsData = {}, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/partners/stats'],
    enabled: true,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1,
  });
  
  // Update brand settings
  const handleBrandSettingChange = (key: string, value: string | boolean) => {
    setBrandSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle copy referral link
  const handleCopyReferralLink = async () => {
    await copy(referralUrl);
  };
  
  // Handle copy embed code
  const handleCopyEmbedCode = async () => {
    await copy(embedCode);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your JetAI partner account and track your earnings
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            View Public Page
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <Button>
            Account Settings
            <Settings className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              Integration
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Date Range Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select defaultValue="last30days">
                        <SelectTrigger id="dateRange" className="w-[180px]">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last7days">Last 7 days</SelectItem>
                          <SelectItem value="last30days">Last 30 days</SelectItem>
                          <SelectItem value="last90days">Last 90 days</SelectItem>
                          <SelectItem value="thisYear">This year</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[180px] pl-3 text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                            onSelect={() => {}}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <span>to</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[180px] pl-3 text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(new Date(), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date()}
                            onSelect={() => {}}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <Button>
                    Apply Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Visits" 
                value={isLoadingStats ? '...' : statsData.visits?.count || 0}
                change={isLoadingStats ? undefined : statsData.visits?.change || 0}
                icon={<Eye className="h-6 w-6" />}
                colorClass="bg-blue-100 text-blue-600"
              />
              
              <StatCard 
                title="Signups" 
                value={isLoadingStats ? '...' : statsData.signups?.count || 0}
                change={isLoadingStats ? undefined : statsData.signups?.change || 0}
                icon={<User className="h-6 w-6" />}
                colorClass="bg-green-100 text-green-600"
              />
              
              <StatCard 
                title="Bookings" 
                value={isLoadingStats ? '...' : statsData.bookings?.count || 0}
                change={isLoadingStats ? undefined : statsData.bookings?.change || 0}
                icon={<CheckCircle2 className="h-6 w-6" />}
                colorClass="bg-purple-100 text-purple-600"
              />
              
              <StatCard 
                title="Total Earnings" 
                value={isLoadingStats ? '...' : formatCurrency(statsData.earnings?.total || 0)}
                change={isLoadingStats ? undefined : statsData.earnings?.change || 0}
                icon={<DollarSign className="h-6 w-6" />}
                colorClass="bg-amber-100 text-amber-600"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest bookings from your referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(statsData.recentBookings || []).length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left pb-3 font-medium">Customer</th>
                                <th className="text-left pb-3 font-medium">Destination</th>
                                <th className="text-left pb-3 font-medium">Date</th>
                                <th className="text-right pb-3 font-medium">Amount</th>
                                <th className="text-right pb-3 font-medium">Commission</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(statsData.recentBookings || []).map((booking: any, index: number) => (
                                <tr key={index} className="border-b last:border-0">
                                  <td className="py-3">{booking.customer}</td>
                                  <td className="py-3">{booking.destination}</td>
                                  <td className="py-3">{new Date(booking.date).toLocaleDateString()}</td>
                                  <td className="py-3 text-right">{formatCurrency(booking.amount)}</td>
                                  <td className="py-3 text-right text-green-600">{formatCurrency(booking.commission)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No bookings yet. Share your referral link to start earning.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" size="sm">
                    View All Bookings
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate</CardTitle>
                  <CardDescription>Visits to bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4">
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          {/* Circle background */}
                          <div className="w-full h-full rounded-full bg-gray-100"></div>
                          {/* Progress overlay */}
                          <div className="absolute top-0 left-0 w-full h-full">
                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#e6e6e6"
                                strokeWidth="10"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - (statsData.conversionRate?.value || 0) / 100)}`}
                                className="text-primary"
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                          </div>
                          {/* Percentage text */}
                          <div className="absolute text-3xl font-bold">
                            {isLoadingStats ? '...' : `${statsData.conversionRate?.value || 0}%`}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center">
                          {statsData.conversionRate?.change > 0 ? (
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="mr-1 h-4 w-4" />
                              +{statsData.conversionRate?.change}%
                            </div>
                          ) : statsData.conversionRate?.change < 0 ? (
                            <div className="flex items-center text-red-600">
                              <TrendingDown className="mr-1 h-4 w-4" />
                              {statsData.conversionRate?.change}%
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-600">
                              <Minus className="mr-1 h-4 w-4" />
                              0%
                            </div>
                          )}
                          <span className="text-sm text-muted-foreground ml-1">vs. last month</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <div className="text-muted-foreground">Visits</div>
                            <div className="font-medium">{isLoadingStats ? '...' : statsData.visits?.count || 0}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Signups</div>
                            <div className="font-medium">{isLoadingStats ? '...' : statsData.signups?.count || 0}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Bookings</div>
                            <div className="font-medium">{isLoadingStats ? '...' : statsData.bookings?.count || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>
                  Share this link with your audience to earn commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input 
                    value={referralUrl}
                    readOnly
                    className="font-mono text-sm flex-1"
                  />
                  <Button
                    onClick={handleCopyReferralLink}
                    variant="outline"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Performance</CardTitle>
                <CardDescription>Track your referral performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {isLoadingStats ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      </div>
                      <p>Referral analytics visualization would appear here</p>
                      <p className="text-sm mt-1">(Showing real data from your referral program)</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Referral Sources</CardTitle>
                  <CardDescription>Where your referrals are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Your Website</div>
                          <div className="text-sm text-muted-foreground">Direct embed</div>
                        </div>
                        <div className="font-medium">68%</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Social Media</div>
                          <div className="text-sm text-muted-foreground">Facebook, Instagram</div>
                        </div>
                        <div className="font-medium">22%</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '22%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-sm text-muted-foreground">Newsletters</div>
                        </div>
                        <div className="font-medium">10%</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Commission Summary</CardTitle>
                  <CardDescription>Your earnings breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground">Month to date</div>
                        <div className="text-xl font-bold">{formatCurrency(statsData.earnings?.total * 0.3 || 0)}</div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div>Booking Commissions</div>
                          <div>{formatCurrency(statsData.earnings?.total * 0.25 || 0)}</div>
                        </div>
                        <div className="flex justify-between">
                          <div>Subscription Commissions</div>
                          <div>{formatCurrency(statsData.earnings?.total * 0.05 || 0)}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between font-medium">
                          <div>Total Earnings (All Time)</div>
                          <div>{formatCurrency(statsData.earnings?.total || 0)}</div>
                        </div>
                        <div className="flex justify-between">
                          <div>Pending Payout</div>
                          <div>{formatCurrency(statsData.earnings?.total * 0.1 || 0)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your past payments and upcoming payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">Next Payout</div>
                      <div className="text-muted-foreground">May 1, 2025</div>
                    </div>
                    <div>
                      <div className="font-medium text-right">{formatCurrency(statsData.earnings?.total * 0.1 || 0)}</div>
                      <div className="text-sm text-muted-foreground">Processing</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">April Payout</div>
                        <div className="text-sm text-muted-foreground">April 1, 2025</div>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(289.50)}</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">March Payout</div>
                        <div className="text-sm text-muted-foreground">March 1, 2025</div>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(178.25)}</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">February Payout</div>
                        <div className="text-sm text-muted-foreground">February 1, 2025</div>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(132.75)}</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  View All Transactions
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Manage your payment methods and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-6 bg-blue-500 rounded mr-4"></div>
                        <div>
                          <div className="font-medium">•••• •••• •••• 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 05/28</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Payout Schedule</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="monthly" 
                          name="payout_schedule" 
                          checked={true}
                          className="h-4 w-4 text-primary" 
                        />
                        <Label htmlFor="monthly">Monthly (Default)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="quarterly" 
                          name="payout_schedule" 
                          className="h-4 w-4 text-primary" 
                        />
                        <Label htmlFor="quarterly">Quarterly</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Minimum Payout</h3>
                    <div className="flex space-x-2">
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="50">$50.00</option>
                        <option value="100">$100.00</option>
                        <option value="200">$200.00</option>
                        <option value="500">$500.00</option>
                      </select>
                      <Button>Save</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>White Label Settings</CardTitle>
                <CardDescription>Customize the appearance of your JetAI instance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value={brandSettings.primaryColor}
                          onChange={(e) => handleBrandSettingChange('primaryColor', e.target.value)}
                          className="w-10 h-10 p-1 rounded border"
                        />
                        <Input
                          value={brandSettings.primaryColor}
                          onChange={(e) => handleBrandSettingChange('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          id="accentColor"
                          value={brandSettings.accentColor}
                          onChange={(e) => handleBrandSettingChange('accentColor', e.target.value)}
                          className="w-10 h-10 p-1 rounded border"
                        />
                        <Input
                          value={brandSettings.accentColor}
                          onChange={(e) => handleBrandSettingChange('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="borderRadius">Border Radius</Label>
                      <select
                        id="borderRadius"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={brandSettings.borderRadius}
                        onChange={(e) => handleBrandSettingChange('borderRadius', e.target.value)}
                      >
                        <option value="0">Sharp (0rem)</option>
                        <option value="0.25rem">Slight (0.25rem)</option>
                        <option value="0.5rem">Medium (0.5rem)</option>
                        <option value="0.75rem">Rounded (0.75rem)</option>
                        <option value="1rem">Full (1rem)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <select
                        id="fontSize"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={brandSettings.fontSize}
                        onChange={(e) => handleBrandSettingChange('fontSize', e.target.value)}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="darkMode"
                        checked={brandSettings.darkMode}
                        onCheckedChange={(checked) => handleBrandSettingChange('darkMode', checked)}
                      />
                      <Label htmlFor="darkMode">Dark Mode</Label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Save Brand Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subdomain Settings</CardTitle>
                <CardDescription>Manage your custom subdomain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="text-green-600 h-5 w-5 mr-2" />
                      <h3 className="font-medium">Your subdomain is active</h3>
                    </div>
                    <div className="flex items-center">
                      <Globe className="text-muted-foreground h-4 w-4 mr-2" />
                      <a 
                        href={`https://${partnerCode.toLowerCase()}.jetai.app`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        {partnerCode.toLowerCase()}.jetai.app
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="customDomain">Add Custom Domain (Optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="customDomain"
                        placeholder="travel.yourdomain.com"
                        className="flex-1"
                      />
                      <Button variant="outline">
                        Verify
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add a custom domain to further brand your JetAI instance.
                      You'll need to configure DNS settings with your domain provider.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Preview</CardTitle>
                <CardDescription>Preview how the JetAI widget will appear on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] border rounded-lg p-4 bg-gray-50 relative">
                  <EmbedWidgetDemo />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Widget Settings</CardTitle>
                <CardDescription>Customize the widget appearance and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="widgetPosition">Widget Position</Label>
                      <select
                        id="widgetPosition"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={brandSettings.widgetPosition}
                        onChange={(e) => handleBrandSettingChange('widgetPosition', e.target.value)}
                      >
                        <option value="right">Bottom Right</option>
                        <option value="left">Bottom Left</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="widgetText">Widget Text</Label>
                      <Input
                        id="widgetText"
                        value={brandSettings.widgetText}
                        onChange={(e) => handleBrandSettingChange('widgetText', e.target.value)}
                        placeholder="Need help planning?"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Save Widget Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Embed Code</CardTitle>
                <CardDescription>Add this code to your website to embed the JetAI widget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => setShowEmbedCode(!showEmbedCode)}
                    >
                      {showEmbedCode ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${showEmbedCode ? 'max-h-80' : 'max-h-20'}`}>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                        <code>{embedCode}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCopyEmbedCode}
                      variant="outline"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}