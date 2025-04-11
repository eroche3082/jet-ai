import React from 'react';
import VertexAIChat from '@/components/VertexAIChat';

const VertexAIPage: React.FC = () => {
  return (
    <div className="container mx-auto flex flex-col h-full mt-16 pb-8">
      <div className="flex flex-col flex-1 rounded-lg border shadow-sm overflow-hidden">
        <VertexAIChat 
          className="flex-1" 
          initialMessage="Hola, soy JetAI, tu asistente personal de viajes. ¿En qué puedo ayudarte?"
        />
      </div>
    </div>
  );
};

export default VertexAIPage;