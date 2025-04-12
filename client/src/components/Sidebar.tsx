import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, MapPin, MessageSquare, Book, CreditCard, Map, Settings, 
  User, Briefcase, Calendar, Heart, BookOpenCheck, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  comingSoon?: boolean;
}

const NavItem = ({ href, icon, label, active, comingSoon }: NavItemProps) => {
  return (
    <Link href={href}>
      <Button 
        variant={active ? "default" : "ghost"} 
        className="w-full justify-start h-11"
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
        {comingSoon && (
          <span className="ml-auto bg-primary/20 text-primary text-xs py-0.5 px-2 rounded-full">
            Coming Soon
          </span>
        )}
      </Button>
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const username = localStorage.getItem('username') || 'Admin';
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const navItems = [
    { href: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { href: '/destinations', icon: <MapPin size={20} />, label: 'Destinations' },
    { href: '/chat', icon: <MessageSquare size={20} />, label: 'AI Assistant' },
    { href: '/itineraries', icon: <Map size={20} />, label: 'Itineraries' },
    { href: '/portfolio', icon: <Book size={20} />, label: 'Travel Memories' },
    { href: '/travel-wallet', icon: <CreditCard size={20} />, label: 'Travel Wallet' },
    { href: '/bookings', icon: <Calendar size={20} />, label: 'My Bookings', comingSoon: true },
    { href: '/saved', icon: <Heart size={20} />, label: 'Saved Items' },
    { href: '/trips', icon: <Briefcase size={20} />, label: 'Trips', comingSoon: true },
    { href: '/resources', icon: <BookOpenCheck size={20} />, label: 'Travel Resources' },
    { href: '/profile', icon: <User size={20} />, label: 'Profile' },
    { href: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30">
      <div className="flex flex-col h-full">
        {/* Logo and Brand */}
        <div className="flex items-center h-16 px-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-primary text-2xl">
              <i className="fas fa-paper-plane"></i>
            </span>
            <span className="font-bold text-xl">Jet<span className="text-primary">AI</span></span>
          </Link>
        </div>
        
        {/* User Info */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <div className="ml-3">
              <div className="font-medium">{username}</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <ScrollArea className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavItem 
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={location === item.href}
                comingSoon={item.comingSoon}
              />
            ))}
          </nav>
        </ScrollArea>
        
        {/* Logout Button */}
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}