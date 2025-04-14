import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AIChat from '@/components/AIChat';

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Travel Assistant</h1>
        <p className="text-gray-600 mt-1">Your personal AI travel companion for all your journey needs</p>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden h-[calc(100vh-180px)]">
        <AIChat />
      </div>
    </DashboardLayout>
  );
}