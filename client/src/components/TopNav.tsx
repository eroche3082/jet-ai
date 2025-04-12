import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  Moon, 
  Sun, 
  Globe 
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function TopNav() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would apply dark mode to the entire app
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
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full flex items-center justify-between pl-64 pr-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for cryptocurrencies (BTC, ETH, ADA...)"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right Side Items */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Language Selector */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium overflow-hidden">
            {user?.email ? (
              <span>{user.email.charAt(0).toUpperCase()}</span>
            ) : (
              <span>G</span>
            )}
          </div>
          <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}