import { Link, useLocation } from 'wouter';
import {
  Home,
  Globe,
  Plane,
  Building,
  MapPin,
  ShoppingCart,
  Calendar,
  Briefcase,
  Image,
  UserCircle,
  Settings,
  HelpCircle,
  Wallet,
  BarChart,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [location] = useLocation();

  const navigationItems = [
    { 
      label: 'Cryptocurrency Dashboard', 
      icon: <Home className="w-5 h-5" />, 
      href: '/' 
    },
    { 
      label: 'Favorites', 
      icon: <MapPin className="w-5 h-5" />, 
      href: '/favorites' 
    },
    { 
      label: 'Portfolio Simulator', 
      icon: <BarChart className="w-5 h-5" />, 
      href: '/portfolio' 
    },
    { 
      label: 'Portfolio AI', 
      icon: <Briefcase className="w-5 h-5" />, 
      href: '/portfolio-ai' 
    },
    { 
      label: 'Risk Watchlist', 
      icon: <Clock className="w-5 h-5" />, 
      href: '/risk-watchlist' 
    },
    { 
      label: 'Wallet Messaging', 
      icon: <Wallet className="w-5 h-5" />, 
      href: '/wallet' 
    },
    { 
      label: 'NFT Gallery', 
      icon: <Image className="w-5 h-5" />, 
      href: '/nft-gallery' 
    },
    { 
      label: 'Token Tracker', 
      icon: <Globe className="w-5 h-5" />, 
      href: '/token-tracker' 
    },
    { 
      label: 'Investment Advisor', 
      icon: <UserCircle className="w-5 h-5" />, 
      href: '/investment-advisor' 
    },
    { 
      label: 'Twitter Analysis', 
      icon: <Calendar className="w-5 h-5" />, 
      href: '/twitter-analysis' 
    },
    { 
      label: 'Tax Simulator', 
      icon: <Building className="w-5 h-5" />, 
      href: '/tax-simulator' 
    },
    { 
      label: 'Gamification', 
      icon: <ShoppingCart className="w-5 h-5" />, 
      href: '/gamification' 
    },
    { 
      label: 'Crypto News', 
      icon: <Globe className="w-5 h-5" />, 
      href: '/crypto-news' 
    },
    { 
      label: 'Alert System', 
      icon: <HelpCircle className="w-5 h-5" />, 
      href: '/alert-system' 
    },
    { 
      label: 'Cryptocurrency Converter', 
      icon: <Plane className="w-5 h-5" />, 
      href: '/converter' 
    },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 flex items-center gap-2">
        <div className="bg-indigo-500 w-8 h-8 rounded flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 8L13 12L9 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 4H14C13.4477 4 13 4.44772 13 5V5C13 5.55228 13.4477 6 14 6H15C15.5523 6 16 5.55228 16 5V5C16 4.44772 15.5523 4 15 4Z" fill="white"/>
            <path d="M15 18H14C13.4477 18 13 18.4477 13 19V19C13 19.5523 13.4477 20 14 20H15C15.5523 20 16 19.5523 16 19V19C16 18.4477 15.5523 18 15 18Z" fill="white"/>
          </svg>
        </div>
        <span className="text-xl font-bold">CryptoBot</span>
      </div>

      <div className="mt-6">
        {navigationItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <a
              className={cn(
                "flex items-center gap-3 px-5 py-3 text-sm transition-colors",
                location === item.href
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </div>

      <div className="p-4 mt-6 bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div>
            <p className="text-sm font-medium">User Account</p>
            <p className="text-xs text-gray-400">Pro Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}