import React from 'react';
import VertexAIChat from '@/components/VertexAIChat';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function VertexAIPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Volver</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold">JetAI Travel Assistant - Powered by Vertex AI</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Docs
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium mb-4">Sobre JetAI - Vertex AI</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              JetAI utiliza ahora Google Vertex AI con el modelo Gemini para ofrecerte una experiencia de planificación
              de viajes más inteligente y conversacional.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Detección inteligente de saludos e intenciones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Flujo de conversación estructurado y guiado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Capacidades multimodales avanzadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Planificación de itinerarios personalizada</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium mb-4">Cómo usar</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-primary">Paso 1: Elige tu destino</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comienza diciéndole a JetAI a dónde quieres viajar
                </p>
              </div>
              <div>
                <h3 className="font-medium text-primary">Paso 2: Responde las preguntas</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  El asistente te preguntará por tu presupuesto, fechas, viajeros e intereses
                </p>
              </div>
              <div>
                <h3 className="font-medium text-primary">Paso 3: Obtén tu itinerario</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  JetAI creará un itinerario personalizado basado en tus preferencias
                </p>
              </div>
              <div>
                <h3 className="font-medium text-primary">Paso 4: Explora opciones</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Descubre hoteles, vuelos y experiencias relacionadas con tu viaje
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-[calc(100vh-10rem)]">
            <VertexAIChat />
          </div>
        </div>
      </div>
    </div>
  );
}