import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}