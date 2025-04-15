import React from 'react';
import { Link } from 'wouter';
import { 
  BarChart4, 
  DollarSign, 
  Settings, 
  Users, 
  Shield, 
  AlertTriangle, 
  Activity,
  LogOut,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const SuperAdminNavigation: React.FC = () => {
  const handleLogout = () => {
    // In a real implementation, this would clear auth tokens and session data
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-[#0a1328] border-r border-[#4a89dc]/20 h-screen flex flex-col">
      <div className="p-4 border-b border-[#4a89dc]/20 flex items-center justify-between">
        <Link href="/dashboard">
          <a className="flex items-center">
            <div className="bg-[#4a89dc] text-white p-2 rounded-md mr-2">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">JET AI</h1>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </a>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-6">
          <p className="text-gray-400 text-xs font-medium mb-2 px-2">MAIN MENU</p>
          <nav className="space-y-1">
            <Link href="/dashboard">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md group">
                <Home className="h-5 w-5 mr-3" />
                Return to Main App
                <ChevronRight className="h-4 w-4 ml-auto" />
              </a>
            </Link>
          </nav>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-xs font-medium mb-2 px-2">ADMINISTRATION</p>
          <nav className="space-y-1">
            <Link href="#analytics">
              <a className="flex items-center px-2 py-2 text-sm text-white bg-[#050b17] rounded-md">
                <BarChart4 className="h-5 w-5 mr-3 text-[#4a89dc]" />
                Analytics
              </a>
            </Link>
            <Link href="#financial">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md">
                <DollarSign className="h-5 w-5 mr-3" />
                Financial Overview
              </a>
            </Link>
            <Link href="#system">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md">
                <Settings className="h-5 w-5 mr-3" />
                System Configuration
              </a>
            </Link>
            <Link href="#membership">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md">
                <Users className="h-5 w-5 mr-3" />
                Membership Management
              </a>
            </Link>
            <Link href="#agents">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md">
                <Shield className="h-5 w-5 mr-3" />
                Agent Configuration
              </a>
            </Link>
            <Link href="#clients">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md">
                <Users className="h-5 w-5 mr-3" />
                Client Database
              </a>
            </Link>
          </nav>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-xs font-medium mb-2 px-2">MONITORING</p>
          <nav className="space-y-1">
            <Link href="#alerts">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md">
                <AlertTriangle className="h-5 w-5 mr-3" />
                Alerts Center
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-auto">8</span>
              </a>
            </Link>
            <Link href="#activity">
              <a className="flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#050b17] rounded-md">
                <Activity className="h-5 w-5 mr-3" />
                System Activity
              </a>
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-[#4a89dc]/20">
        <Button 
          onClick={handleLogout}
          className="w-full bg-[#050b17] hover:bg-[#0f1e36] text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminNavigation;