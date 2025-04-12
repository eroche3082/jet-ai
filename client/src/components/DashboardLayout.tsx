import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, navigate] = useLocation();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn && !location.startsWith('/login')) {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 pt-4 px-6 pb-8">
        {children}
      </main>
    </div>
  );
}