import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClipboard } from "@/hooks/use-clipboard";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import EmbedWidgetDemo from "@/components/EmbedWidgetDemo";

// Analytics Cards
const StatCard = ({ title, value, change, prefix, suffix, isLoading }: {
  title: string;
  value: number;
  change?: number;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {prefix}{value.toLocaleString()}{suffix}
            </div>
            {change !== undefined && (
              <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default function PartnerDashboard() {
  const { toast } = useToast();
  const { copy } = useClipboard();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch partner analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/partners/analytics'],
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Get the partner code from local storage or generate a temporary one for demo
  const partnerCode = localStorage.getItem('partnerCode') || 'PARTNER123';
  const partnerUrl = `https://jetai.app/?ref=${partnerCode}`;
  const embedCode = `<script src="https://jetai.app/embed.js" data-partner="${partnerCode}"></script>`;
  
  // Mock payout data
  const payouts = [
    { id: 'p_123456', amount: 125.50, status: 'paid', date: '2025-03-15', method: 'Bank Transfer' },
    { id: 'p_123455', amount: 89.75, status: 'paid', date: '2025-02-15', method: 'Bank Transfer' },
    { id: 'p_123454', amount: 67.20, status: 'paid', date: '2025-01-15', method: 'Bank Transfer' }
  ];
  
  // Handle copy functions
  const handleCopyReferralLink = () => {
    copy(partnerUrl);
    toast({
      title: "Referral link copied!",
      description: "The link has been copied to your clipboard",
    });
  };
  
  const handleCopyEmbedCode = () => {
    copy(embedCode);
    toast({
      title: "Embed code copied!",
      description: "The code has been copied to your clipboard",
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your JetAI partnership and track your earnings</p>
        </div>
        <Button>
          <Link href="/partner/settings">Partner Settings</Link>
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Referral Links</TabsTrigger>
          <TabsTrigger value="widget">Widget</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Visits"
              value={analytics?.visits?.total || 0}
              change={analytics?.visits?.change}
              isLoading={isLoading}
            />
            <StatCard
              title="Total Signups"
              value={analytics?.signups?.total || 0}
              change={analytics?.signups?.change}
              isLoading={isLoading}
            />
            <StatCard
              title="Total Bookings"
              value={analytics?.bookings?.total || 0}
              change={analytics?.bookings?.change}
              isLoading={isLoading}
            />
            <StatCard
              title="Total Earnings"
              value={analytics?.earnings?.total || 0}
              prefix="$"
              change={analytics?.earnings?.change}
              isLoading={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Recent bookings from your referred customers</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : analytics?.recentBookings?.length ? (
                  <div className="space-y-4">
                    {analytics.recentBookings.map((booking: any) => (
                      <div key={booking.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{booking.destination}</div>
                          <div className="text-sm text-muted-foreground">{booking.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${booking.commission.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.status === 'completed' ? 
                              <span className="text-green-600">Completed</span> : 
                              <span className="text-yellow-600">Pending</span>
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No recent bookings to display
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Bookings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Visits to bookings conversion</CardDescription>
              </CardHeader>
              <CardContent className="h-[180px] flex flex-col items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <div className="text-5xl font-bold text-primary mb-2">
                      {(analytics?.conversionRate || 0).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {analytics?.conversionRate > 5 
                        ? 'Great job! Your conversion rate is above average.' 
                        : 'Try optimizing your referral strategy to improve conversion.'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={handleCopyReferralLink} className="w-full">
                  Copy Referral Link
                </Button>
                <Button onClick={handleCopyEmbedCode} variant="outline" className="w-full">
                  Copy Embed Code
                </Button>
                <Button variant="outline" className="w-full">
                  <Link href="/partner/marketing">Marketing Materials</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Referral Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link with your audience to earn commissions on bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="referral-link">Main Referral Link</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="referral-link" 
                    readOnly 
                    value={partnerUrl} 
                    className="flex-1"
                  />
                  <Button onClick={handleCopyReferralLink}>Copy</Button>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Tracking Parameters</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add custom tracking parameters to your referral links to track different campaigns
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="campaign-link">Campaign Tracking</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="campaign-link" 
                        readOnly 
                        value={`${partnerUrl}&utm_campaign=summer_promo`} 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          copy(`${partnerUrl}&utm_campaign=summer_promo`);
                          toast({
                            title: "Campaign link copied!",
                            description: "The campaign link has been copied to your clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="source-link">Source Tracking</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="source-link" 
                        readOnly 
                        value={`${partnerUrl}&utm_source=newsletter`} 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          copy(`${partnerUrl}&utm_source=newsletter`);
                          toast({
                            title: "Source link copied!",
                            description: "The source link has been copied to your clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Special Offer Links</CardTitle>
              <CardDescription>
                These links include special offers for your audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="discount-link">10% Discount Link</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="discount-link" 
                    readOnly 
                    value={`${partnerUrl}&promo=PARTNER10`} 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      copy(`${partnerUrl}&promo=PARTNER10`);
                      toast({
                        title: "Discount link copied!",
                        description: "The discount link has been copied to your clipboard",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Offers 10% off first booking. Valid until Dec 31, 2025.
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="credits-link">Free Credits Link</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="credits-link" 
                    readOnly 
                    value={`${partnerUrl}&promo=FREECREDITS`} 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      copy(`${partnerUrl}&promo=FREECREDITS`);
                      toast({
                        title: "Free credits link copied!",
                        description: "The free credits link has been copied to your clipboard",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Offers 5 free AI credits on signup. Valid until Dec 31, 2025.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Widget Tab */}
        <TabsContent value="widget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Embed Widget</CardTitle>
              <CardDescription>
                Add the JetAI travel assistant widget to your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="embed-code">Widget Embed Code</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="embed-code" 
                    readOnly 
                    value={embedCode}
                    className="flex-1"
                  />
                  <Button onClick={handleCopyEmbedCode}>Copy</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add this code to your website before the closing &lt;/body&gt; tag to embed the JetAI widget.
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Widget Preview</h3>
                <div className="border rounded-md p-4 h-[320px] bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
                  <EmbedWidgetDemo />
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Widget Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize the appearance and behavior of your widget
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="primary-color" 
                          type="text" 
                          placeholder="#3182CE" 
                          className="flex-1"
                        />
                        <div className="w-10 h-10 rounded bg-primary border"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="widget-position">Widget Position</Label>
                      <select 
                        id="widget-position" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="right">Right</option>
                        <option value="left">Left</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="greeting-text">Greeting Text</Label>
                      <Input 
                        id="greeting-text" 
                        type="text" 
                        placeholder="Hi there! Need help planning your trip?" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="placeholder-text">Input Placeholder</Label>
                      <Input 
                        id="placeholder-text" 
                        type="text" 
                        placeholder="Where would you like to go?" 
                      />
                    </div>
                  </div>
                  
                  <Button className="mt-4">
                    Update Widget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Current Balance"
              value={analytics?.earnings?.thisMonth || 0}
              prefix="$"
              isLoading={isLoading}
            />
            <StatCard
              title="Lifetime Earnings"
              value={analytics?.earnings?.total || 0}
              prefix="$"
              isLoading={isLoading}
            />
            <StatCard
              title="Commission Rate"
              value={10}
              suffix="%"
              isLoading={isLoading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Record of all your payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payouts.length > 0 ? (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Method</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((payout) => (
                        <tr key={payout.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{payout.id}</td>
                          <td className="p-4 align-middle">{payout.date}</td>
                          <td className="p-4 align-middle">${payout.amount.toFixed(2)}</td>
                          <td className="p-4 align-middle">{payout.method}</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                              {payout.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No payout history to display
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Download CSV</Button>
              <Button>Request Payout</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>
                Configure how you receive your earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payout-method">Payout Method</Label>
                  <select 
                    id="payout-method" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payout-email">Payout Email</Label>
                  <Input 
                    id="payout-email" 
                    type="email" 
                    placeholder="your@email.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payout-threshold">Payout Threshold</Label>
                  <select 
                    id="payout-threshold" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="50">$50</option>
                    <option value="100">$100</option>
                    <option value="200">$200</option>
                    <option value="custom">Custom Amount</option>
                  </select>
                </div>
                
                <Button type="submit">Save Payout Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referred Customers</CardTitle>
              <CardDescription>
                Users who signed up using your referral link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Loading customer data...</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-4">Customer data will be displayed here</p>
                    <Button variant="outline">
                      <Link href="/partner/customers">View Detailed Customer Data</Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Settings</CardTitle>
              <CardDescription>
                Configure your partner account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Partner settings will be displayed here</p>
                <Button>
                  <Link href="/partner/settings">Manage Partner Settings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}