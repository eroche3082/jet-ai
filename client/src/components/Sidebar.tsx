import { Link, useLocation } from 'wouter';
import {
  BarChart3,
  Heart,
  Briefcase,
  DollarSign,
  Wallet,
  MessageSquare,
  Image,
  Coins,
  LightbulbIcon,
  Twitter,
  Calculator,
  Gamepad2,
  Newspaper,
  Bell,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [location] = useLocation();

  const navigationItems = [
    {
      section: 'main',
      items: [
        {
          label: 'Cryptocurrency Dashboard',
          icon: <BarChart3 className="h-5 w-5" />,
          href: '/',
          badge: null
        },
        {
          label: 'Favorites',
          icon: <Heart className="h-5 w-5" />,
          href: '/favorites',
          badge: null
        }
      ]
    },
    {
      section: 'portfolio',
      items: [
        {
          label: 'Portfolio Simulator',
          icon: <Briefcase className="h-5 w-5" />,
          href: '/portfolio-simulator',
          badge: null
        },
        {
          label: 'Portfolio AI',
          icon: <Briefcase className="h-5 w-5" />,
          href: '/portfolio-ai',
          badge: null
        },
        {
          label: 'Risk Watchlist',
          icon: <Bell className="h-5 w-5" />,
          href: '/risk-watchlist',
          badge: null
        }
      ]
    },
    {
      section: 'tools',
      items: [
        {
          label: 'Wallet Messaging',
          icon: <MessageSquare className="h-5 w-5" />,
          href: '/wallet-messaging',
          badge: null
        },
        {
          label: 'NFT Gallery',
          icon: <Image className="h-5 w-5" />,
          href: '/nft-gallery',
          badge: null
        },
        {
          label: 'Token Tracker',
          icon: <Coins className="h-5 w-5" />,
          href: '/token-tracker',
          badge: null
        },
        {
          label: 'Investment Advisor',
          icon: <LightbulbIcon className="h-5 w-5" />,
          href: '/investment-advisor',
          badge: null
        },
        {
          label: 'Twitter Analysis',
          icon: <Twitter className="h-5 w-5" />,
          href: '/twitter-analysis',
          badge: null
        },
        {
          label: 'Tax Simulator',
          icon: <Calculator className="h-5 w-5" />,
          href: '/tax-simulator',
          badge: null
        },
        {
          label: 'Gamification',
          icon: <Gamepad2 className="h-5 w-5" />,
          href: '/gamification',
          badge: null
        },
        {
          label: 'Crypto News',
          icon: <Newspaper className="h-5 w-5" />,
          href: '/crypto-news',
          badge: null
        },
        {
          label: 'Alert System',
          icon: <Bell className="h-5 w-5" />,
          href: '/alert-system',
          badge: null
        },
        {
          label: 'Cryptocurrency Converter',
          icon: <RefreshCcw className="h-5 w-5" />,
          href: '/cryptocurrency-converter',
          badge: null
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white border-r border-slate-800 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="w-9 h-9 rounded flex items-center justify-center bg-indigo-600">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-xl font-bold">CryptoBot</div>
      </div>

      {/* Navigation Items */}
      <div className="mt-2">
        {navigationItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.items.map((item, itemIndex) => (
              <Link 
                key={itemIndex} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                  location === item.href
                    ? "bg-indigo-600 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-indigo-500 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}