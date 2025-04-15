import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Layout, 
  CreditCard, 
  Users, 
  Settings, 
  ShieldCheck, 
  Clock,
  LogOut
} from 'lucide-react';

interface AdminManagerNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminManagerNavigation: React.FC<AdminManagerNavigationProps> = ({ 
  activeTab, 
  setActiveTab,
  onLogout
}) => {
  const navItems = [
    { id: 'platform', label: 'Platform Operations', icon: <Layout className="h-5 w-5" /> },
    { id: 'membership', label: 'Membership Plans', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'users', label: 'User Management', icon: <Users className="h-5 w-5" /> },
    { id: 'features', label: 'Feature Toggles', icon: <Settings className="h-5 w-5" /> },
    { id: 'system', label: 'System Integrity', icon: <ShieldCheck className="h-5 w-5" /> },
    { id: 'logs', label: 'Activity Logs', icon: <Clock className="h-5 w-5" /> }
  ];

  return (
    <div className="w-64 bg-[#0a1328] border-r border-[#4a89dc]/20 p-4 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#4a89dc]">JET AI</h2>
          <p className="text-sm text-gray-400">Admin Manager Panel</p>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id 
                  ? "bg-[#4a89dc] hover:bg-[#3a79cc]" 
                  : "hover:bg-[#050b17]"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </nav>
        
        <div className="pt-4 border-t border-[#4a89dc]/20">
          <Button 
            variant="ghost" 
            className="w-full justify-start hover:bg-[#050b17] text-red-400 hover:text-red-300"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
          
          <div className="mt-4 p-3 bg-[#050b17] rounded-md">
            <div className="text-sm font-medium">Admin Manager</div>
            <div className="text-xs text-gray-400">Last login: Apr 15, 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagerNavigation;