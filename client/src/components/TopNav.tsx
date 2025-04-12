import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  Globe, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TopNav() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3); // Example notification count

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would toggle dark mode for the entire app
    document.documentElement.classList.toggle('dark');
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // In a real implementation, this would trigger a search
    }
  };

  return (
    <div className="fixed top-0 right-0 z-40 h-16 ml-64 left-0 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for cryptocurrencies (BTC, ETH, ADA...)"
            className="pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full bg-slate-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right Side Items */}
      <div className="flex items-center gap-4">
        {/* Global Settings */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Language Selector */}
          <button className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
            <Globe className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>

          {/* Settings */}
          <button className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* User Section */}
        <div className="border-l border-slate-600 pl-4 ml-2 flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Login</p>
          </div>
        </div>
      </div>
    </div>
  );
}