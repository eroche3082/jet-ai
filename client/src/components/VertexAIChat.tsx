import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, VolumeX, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import useTextToSpeech from '@/hooks/useTextToSpeech';

// Declaración global para SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Tipos para la memoria de conversación
interface ConversationMemory {
  destination: string;
  budget: string;
  dates: string;
  travelers: string;
  interests: string[];
  currentQuestion: 'greeting' | 'destination' | 'budget' | 'dates' | 'travelers' | 'interests' | 'summary';
  conversationStarted: boolean;
}

// Tipo para los mensajes de chat
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface VertexAIChatProps {
  className?: string;
  initialMessage?: string;
}

const VertexAIChat: React.FC<VertexAIChatProps> = ({ 
  className,
  initialMessage = "¡Hola! Soy JetAI, tu asistente de viaje. ¿En qué puedo ayudarte hoy?"
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [memory, setMemory] = useState<ConversationMemory>({
    destination: '',
    budget: '',
    dates: '',
    travelers: '',
    interests: [],
    currentQuestion: 'greeting',
    conversationStarted: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Hooks para reconocimiento de voz y texto a voz
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    isBrowserSupported 
  } = useSpeechRecognition({ language: 'es-ES' });
  
  const { 
    speak, 
    cancel, 
    isSpeaking, 
    isVoiceSupported, 
    isMuted, 
    toggleMute 
  } = useTextToSpeech({ language: 'es-ES' });

  // Iniciar la conversación con el mensaje de bienvenida
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
      
      // Si el audio está habilitado, lee el mensaje de bienvenida
      if (isVoiceSupported && !isMuted) {
        setTimeout(() => speak(initialMessage), 500);
      }
    }
  }, [initialMessage, isVoiceSupported, isMuted, speak, messages.length]);

  // Actualizar el input con la transcripción de voz
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Desplazarse al final del chat cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Leer respuestas del asistente cuando llegan
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !isMuted && isVoiceSupported) {
      // Limpiar el texto de markdown antes de leerlo
      const cleanText = lastMessage.content.replace(/[*#_\[\]]/g, '');
      speak(cleanText);
    }
  }, [messages, speak, isMuted, isVoiceSupported]);

  // Enviar mensaje al backend
  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;
    
    // Detener cualquier audio actual
    cancel();
    
    // Agregar mensaje del usuario al chat
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Limpiar input y errores
    setInputValue('');
    setError(null);
    setIsLoading(true);
    
    try {
      // Preparar historial para enviar a la API (sin incluir el mensaje actual)
      const history = messages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      
      // Llamar a la API de chat con Vertex AI
      const response = await fetch('/api/chat/vertex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          history,
          memory
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error en la conexión con el asistente');
      }
      
      const data = await response.json();
      
      // Agregar respuesta al chat
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.message 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Actualizar memoria y sugerencias
      if (data.memory) {
        setMemory(data.memory);
      }
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
      
    } catch (err: any) {
      console.error('Error al enviar mensaje:', err);
      setError(err.message || 'Error al comunicarse con el asistente');
    } finally {
      setIsLoading(false);
      // Enfocar el input después de enviar
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Manejar envío desde el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
    handleSendMessage();
  };
  
  // Manejar clic en sugerencias
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  
  // Manejar toggle de reconocimiento de voz
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setInputValue('');
      startListening();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Encabezado */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">J</span>
          </div>
          <h3 className="font-medium">JetAI Assistant</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMute}
            disabled={!isVoiceSupported}
            title={isMuted ? 'Activar audio' : 'Silenciar'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        </div>
      </div>
      
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={cn(
              "flex w-full max-w-full",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div 
              className={cn(
                "rounded-lg px-4 py-2 max-w-[85%]",
                message.role === 'user' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}
            >
              <ReactMarkdown 
                components={{
                  p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
                  ul: ({children}) => <ul className="list-disc pl-4 mb-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-4 mb-1">{children}</ol>,
                  li: ({children}) => <li className="mb-0.5">{children}</li>,
                  a: ({href, children}) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {children}
                    </a>
                  ),
                }}
                className="prose prose-sm dark:prose-invert max-w-none"
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm">
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Sugerencias */}
      {suggestions.length > 0 && (
        <div className="p-2 overflow-x-auto whitespace-nowrap border-t">
          <div className="flex space-x-2 pb-1">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-muted/80 flex-shrink-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="pr-10"
              disabled={isLoading}
            />
            {isBrowserSupported && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={handleVoiceToggle}
                disabled={isLoading}
              >
                {isListening ? (
                  <MicOff size={18} className="text-destructive" />
                ) : (
                  <Mic size={18} />
                )}
              </Button>
            )}
          </div>
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VertexAIChat;