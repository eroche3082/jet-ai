import React from 'react';
import Layout from '@/components/Layout';
import AIChat from '@/components/AIChat';

export default function ChatPage() {
  return (
    <div className="py-6 px-4 md:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">JET AI Travel Assistant</h1>
        <p className="text-gray-600 mt-1">Your personal AI travel companion for all your journey needs</p>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden h-[calc(100vh-220px)]">
        <AIChat voiceEnabled={true} personality="travel-expert" />
      </div>
      
      <div className="mt-4 text-sm text-center text-gray-500">
        <p>Powered by Google Vertex AI (Gemini) with GPT-4o and Claude 3 fallbacks</p>
      </div>
    </div>
  );
}