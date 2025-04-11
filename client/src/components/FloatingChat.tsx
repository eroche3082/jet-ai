import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Mic, Camera, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VertexAIChat from './VertexAIChat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import placeholder from '@/assets/ai-assistant-avatar.png';

interface FloatingChatProps {
  className?: string;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil para ajustar la interfaz
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Prevenir scroll cuando el chat está abierto a pantalla completa
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Abrir el chat
  const handleOpen = () => {
    setIsOpen(true);
  };

  // Cerrar el chat
  const handleClose = () => {
    setIsOpen(false);
  };

  // Manejar input de cámara
  const handleCameraClick = () => {
    alert('Funcionalidad de cámara en desarrollo');
  };

  // Manejar escaneo de QR
  const handleQrScanClick = () => {
    alert('Funcionalidad de escaneo QR en desarrollo');
  };

  return (
    <>
      {/* Botón flotante cuando está cerrado */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 shadow-lg rounded-full",
            className
          )}
        >
          <Button
            onClick={handleOpen}
            size="lg"
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
          >
            <MessageSquare size={24} className="text-primary-foreground" />
          </Button>
        </motion.div>
      )}
      
      {/* Chat a pantalla completa cuando está abierto */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="flex flex-col h-full">
              {/* Cabecera */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="text-xl font-semibold">JetAI Assistant</div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X size={24} />
                </Button>
              </div>
              
              {/* Contenido principal: avatar a la izquierda, chat a la derecha */}
              <div className="flex flex-1 overflow-hidden">
                {/* Panel izquierdo (Avatar) - Se oculta en móvil */}
                {!isMobile && (
                  <div className="w-1/3 border-r p-4 flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                        <img 
                          src={placeholder} 
                          alt="AI Assistant Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-medium">JetAI Concierge</h3>
                      <p className="text-center text-muted-foreground max-w-xs">
                        Tu asistente de viaje personalizado, listo para ayudarte con recomendaciones inteligentes y planificación a medida.
                      </p>
                      
                      {/* Controles adicionales */}
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="icon" onClick={handleCameraClick}>
                          <Camera size={18} />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleQrScanClick}>
                          <QrCode size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Panel derecho (Chat) */}
                <div className={cn("flex-1", isMobile ? "w-full" : "w-2/3")}>
                  <VertexAIChat 
                    initialMessage="¡Hola! Soy tu asistente de viaje JetAI. ¿En qué puedo ayudarte hoy? Puedo recomendarte destinos, crear itinerarios personalizados o responder preguntas sobre tu próximo viaje."
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;