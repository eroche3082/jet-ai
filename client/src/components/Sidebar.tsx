import { Link, useLocation } from 'wouter';
import { 
  HomeIcon, 
  GlobeIcon, 
  MapIcon, 
  CalendarIcon, 
  MessageSquareIcon,
  HotelIcon,
  PlaneIcon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon size={20} /> },
    { name: 'Chat Assistant', path: '/chat', icon: <MessageSquareIcon size={20} /> },
    { name: 'Destinations', path: '/destinations', icon: <GlobeIcon size={20} /> },
    { name: 'Travel Blog', path: '/blog', icon: <PlaneIcon size={20} className="rotate-45" /> },
    { name: 'AI Features', path: '/ai-features', icon: <PlaneIcon size={20} className="-rotate-45" /> },
    { name: 'Travel Community', path: '/travel-community', icon: <GlobeIcon size={20} /> },
    { name: 'Itineraries', path: '/itineraries', icon: <PlaneIcon size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <CalendarIcon size={20} /> },
    { name: 'Hotels', path: '/hotels', icon: <HotelIcon size={20} /> },
    { name: 'Flights', path: '/flights', icon: <PlaneIcon size={20} /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-700"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-30
        w-64 bg-white border-r border-gray-200 shadow-sm
        transition-transform duration-300 ease-in-out
        md:translate-x-0 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full py-6 px-4">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 px-4">
            <span className="text-[#4a89dc] text-2xl">
              <i className="fas fa-plane"></i>
            </span>
            <span className="ml-2 text-xl font-bold">JET <span className="text-[#4a89dc]">AI</span></span>
          </div>
          
          {/* Navigation items */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium
                  ${location === item.path 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User section */}
          <div className="border-t pt-4 mt-4">
            <Link href="/profile" className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span className="mr-3"><UserIcon size={20} /></span>
              Profile
            </Link>
            <Link href="/settings" className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span className="mr-3"><SettingsIcon size={20} /></span>
              Settings
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start mt-2 px-4 py-3 h-auto font-normal text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOutIcon size={20} className="mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}