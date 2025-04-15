import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Home, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  BarChart4, 
  Settings, 
  Users, 
  DollarSign,
  AlertTriangle,
  Activity,
  User
} from 'lucide-react';

const SuperAdminNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 p-2 bg-[#4a89dc] rounded-full shadow-lg md:hidden top-4 left-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#050b17] border-r border-[#4a89dc]/20 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center p-6 border-b border-[#4a89dc]/20">
            <Shield className="h-6 w-6 text-[#4a89dc] mr-2" />
            <h2 className="text-xl font-bold text-white">Super Admin</h2>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link href="/superadmin">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <Home className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Dashboard</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=analytics">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <BarChart4 className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Analytics</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=financial">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <DollarSign className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Financial</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=system">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <Settings className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>System Config</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=membership">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <Users className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Membership</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=agents">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <Shield className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Agent Config</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=clients">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <User className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Client Database</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=alerts">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <AlertTriangle className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Alerts Center</span>
              </a>
            </Link>
            
            <Link href="/superadmin?tab=activity">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <Activity className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Activity Logs</span>
              </a>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#4a89dc]/20">
            <Link href="/">
              <a className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#0a1328] hover:text-[#4a89dc] rounded-md transition-all group">
                <LogOut className="h-5 w-5 mr-3 group-hover:text-[#4a89dc]" />
                <span>Exit Super Admin</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminNavigation;