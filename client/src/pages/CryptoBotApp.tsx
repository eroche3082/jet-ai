import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import CryptoLayout from '@/components/CryptoLayout';
import CryptoDashboard from '@/pages/CryptoDashboard';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/ThemeProvider';

// Create placeholder pages for routes that aren't yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh]">
    <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
    <p className="text-slate-400 text-center max-w-md">
      This feature is coming soon. Please check back later.
      <br />
      We're working hard to bring you the best cryptocurrency experience.
    </p>
  </div>
);

export default function CryptoBotApp() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Set the document title based on the current page
    let pageTitle = 'CryptoBot';
    
    if (location !== '/') {
      // Convert route to title (e.g., /portfolio-simulator → Portfolio Simulator)
      const pageName = location.substring(1)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      pageTitle = `${pageName} | CryptoBot`;
    }
    
    document.title = pageTitle;
  }, [location]);

  // Don't render children until fonts are loaded
  return (
    <AuthProvider>
      <ThemeProvider>
        <CryptoLayout>
          <Switch>
            <Route path="/" component={CryptoDashboard} />
            <Route path="/favorites">
              <PlaceholderPage title="Favorites" />
            </Route>
            <Route path="/portfolio-simulator">
              <PlaceholderPage title="Portfolio Simulator" />
            </Route>
            <Route path="/portfolio-ai">
              <PlaceholderPage title="Portfolio AI" />
            </Route>
            <Route path="/risk-watchlist">
              <PlaceholderPage title="Risk Watchlist" />
            </Route>
            <Route path="/wallet-messaging">
              <PlaceholderPage title="Wallet Messaging" />
            </Route>
            <Route path="/nft-gallery">
              <PlaceholderPage title="NFT Gallery" />
            </Route>
            <Route path="/token-tracker">
              <PlaceholderPage title="Token Tracker" />
            </Route>
            <Route path="/investment-advisor">
              <PlaceholderPage title="Investment Advisor" />
            </Route>
            <Route path="/twitter-analysis">
              <PlaceholderPage title="Twitter Analysis" />
            </Route>
            <Route path="/tax-simulator">
              <PlaceholderPage title="Tax Simulator" />
            </Route>
            <Route path="/gamification">
              <PlaceholderPage title="Gamification" />
            </Route>
            <Route path="/crypto-news">
              <PlaceholderPage title="Crypto News" />
            </Route>
            <Route path="/alert-system">
              <PlaceholderPage title="Alert System" />
            </Route>
            <Route path="/cryptocurrency-converter">
              <PlaceholderPage title="Cryptocurrency Converter" />
            </Route>
            <Route>
              <PlaceholderPage title="Page Not Found" />
            </Route>
          </Switch>
        </CryptoLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}