import React from 'react';
import GeminiApiTest from '@/components/GeminiApiTest';

const GeminiTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Prueba de API Gemini</h1>
      <GeminiApiTest />
    </div>
  );
};

export default GeminiTestPage;