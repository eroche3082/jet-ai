import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { Copy, ExternalLink, ChevronRight, BarChart3, Settings, Check, CreditCard } from 'lucide-react';

// Sample partner data for UI demonstration
const DEMO_DATA = {
  partner: {
    id: 'p_123456',
    name: 'Travel Explorer',
    logo: '/assets/partners/partner-avatar.png',
    website: 'https://example.com',
    subdomain: 'explorer',
    joinedAt: '2023-10-15T12:00:00Z',
    status: 'active',
    balance: 542.89,
    pendingBalance: 128.50,
    referralCode: 'EXPLORER22',
    referralUrl: 'https://jetai.app/?ref=EXPLORER22',
  },
  metrics: {
    visits: {
      total: 1482,
      thisMonth: 328,
      change: 12.5
    },
    signups: {
      total: 241,
      thisMonth: 42,
      change: 8.3
    },
    bookings: {
      total: 112,
      thisMonth: 18,
      change: -3.2
    },
    earnings: {
      total: 1245.67,
      thisMonth: 215.34,
      change: 5.8
    },
    conversionRate: 7.6
  },
  recentBookings: [
    {
      id: 'b_78912',
      destination: 'Paris, France',
      amount: 425.00,
      commission: 42.50,
      date: '2023-11-28',
      status: 'completed'
    },
    {
      id: 'b_78911',
      destination: 'Bali, Indonesia',
      amount: 850.00,
      commission: 85.00,
      date: '2023-11-25',
      status: 'completed'
    },
    {
      id: 'b_78910',
      destination: 'Tokyo, Japan',
      amount: 670.00,
      commission: 67.00,
      date: '2023-11-22',
      status: 'completed'
    }
  ]
};

export default function PartnerDashboard() {
  const [copied, setCopied] = useState(false);
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(DEMO_DATA.partner.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your JetAI affiliate account</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/partner/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/partner/payouts">
              <CreditCard className="mr-2 h-4 w-4" />
              Payouts
            </Link>
          </Button>
          <Button asChild>
            <Link href="/partner/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending Balance</CardTitle>
            <CardDescription>Next payout on 15th</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">
              {formatCurrency(DEMO_DATA.partner.pendingBalance)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Earned</CardTitle>
            <CardDescription>All time earnings</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">
              {formatCurrency(DEMO_DATA.partner.balance)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
            <CardDescription>Visits to bookings</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold">{DEMO_DATA.metrics.conversionRate}%</div>
              <div className="text-sm text-muted-foreground mb-1">
                Target: 8%
              </div>
            </div>
            <Progress value={DEMO_DATA.metrics.conversionRate * 100 / 10} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Track your referrals and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visits">
              <TabsList className="mb-4">
                <TabsTrigger value="visits">Visits</TabsTrigger>
                <TabsTrigger value="signups">Signups</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>
              <TabsContent value="visits" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Total Visits</div>
                    <div className="text-2xl font-bold">{DEMO_DATA.metrics.visits.total.toLocaleString()}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">This Month</div>
                    <div className="text-2xl font-bold">{DEMO_DATA.metrics.visits.thisMonth.toLocaleString()}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Monthly Change</div>
                    <div className={`text-2xl font-bold ${DEMO_DATA.metrics.visits.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {DEMO_DATA.metrics.visits.change >= 0 ? '+' : ''}{DEMO_DATA.metrics.visits.change}%
                    </div>
                  </div>
                </div>
                <div className="h-[250px] bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground">Visit trend chart will appear here</div>
                </div>
              </TabsContent>
              {/* Other tabs would be similar but with different metrics */}
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Share Your Link</CardTitle>
            <CardDescription>
              Use this link to earn commissions on referrals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
              <div className="flex-1 truncate text-sm">
                {DEMO_DATA.partner.referralUrl}
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={copyReferralLink}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Embed Code</div>
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md overflow-x-auto">
                &lt;script src="https://jetai.app/embed.js?ref={DEMO_DATA.partner.referralCode}"&gt;&lt;/script&gt;
                <br/>
                &lt;div id="jetai-assistant"&gt;&lt;/div&gt;
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/partner/analytics">
                View Detailed Analytics
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Earnings from your referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Booking ID</th>
                    <th className="text-left py-3 px-4 font-medium">Destination</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-right py-3 px-4 font-medium">Amount</th>
                    <th className="text-right py-3 px-4 font-medium">Commission</th>
                    <th className="text-center py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_DATA.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="py-3 px-4 text-sm">{booking.id}</td>
                      <td className="py-3 px-4">{booking.destination}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(booking.amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(booking.commission)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              View All Bookings
            </Button>
            <Button variant="ghost" size="sm">
              Export CSV
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">White-Label Your JetAI</h2>
        <p className="text-muted-foreground mb-4">
          Upgrade to a custom subdomain with your branding and colors. Ideal for travel creators and agencies.
        </p>
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-background mb-2">
            <div className="font-medium">Basic Partner</div>
            <div className="text-muted-foreground">Current Plan</div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-background mb-2">
            <div className="font-medium">White-Label Partner</div>
            <div className="text-primary">{formatCurrency(49.99)}/month</div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-background">
            <div className="font-medium">Enterprise Partner</div>
            <div className="text-primary">Custom Pricing</div>
          </div>
        </div>
        <Button>
          Upgrade to White-Label
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}