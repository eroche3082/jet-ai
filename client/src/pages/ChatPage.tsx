import React from 'react';
import AIChat from '@/components/AIChat';
import { Sparkles, Plane } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#050b17] flex items-center">
            <Plane className="h-6 w-6 mr-2 text-[#4a89dc]" /> 
            JET AI Travel Assistant
          </h1>
          <p className="text-gray-600 mt-1">Your personal AI travel companion powered by advanced language models</p>
        </div>
        <div className="hidden md:flex items-center bg-[#050b17]/5 rounded-full px-4 py-1 text-sm font-medium text-[#050b17]">
          <Sparkles className="h-4 w-4 mr-2 text-[#4a89dc]" />
          Multimodal AI Technology
        </div>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden h-[calc(100vh-220px)]">
        <AIChat voiceEnabled={true} personality="travel-expert" />
      </div>
      
      <div className="mt-4 text-sm text-center text-gray-500">
        <p>Powered by Google Vertex AI (Gemini) with OpenAI GPT-4o and Anthropic Claude 3 fallbacks</p>
      </div>
    </div>
  );
}