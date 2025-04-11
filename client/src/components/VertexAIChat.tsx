import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

// Definir tipos para SpeechRecognition que no están disponibles por defecto en TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Definir tipos para mensajes y memoria de conversación
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ConversationMemory {
  destination: string;
  budget: string;
  dates: string;
  travelers: string;
  interests: string[];
  currentQuestion: 'greeting' | 'destination' | 'budget' | 'dates' | 'travelers' | 'interests' | 'summary';
  conversationStarted: boolean;
}

// Inicializar memoria de conversación vacía
const initialMemory: ConversationMemory = {
  destination: '',
  budget: '',
  dates: '',
  travelers: '',
  interests: [],
  currentQuestion: 'greeting',
  conversationStarted: false
};

interface VertexAIChatProps {
  className?: string;
  onClose?: () => void;
  initialMessage?: string;
}

const VertexAIChat: React.FC<VertexAIChatProps> = ({ className, onClose, initialMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [memory, setMemory] = useState<ConversationMemory>(initialMemory);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioSupported, setIsAudioSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Verificar soporte de audio
  useEffect(() => {
    setIsAudioSupported(
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
  }, []);

  // Inicializar reconocimiento de voz si está disponible
  useEffect(() => {
    if (isAudioSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES'; // Idioma por defecto (puede ser cambiado)

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        // Enviar mensaje automáticamente
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isAudioSupported]);

  // Agregar mensaje inicial
  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    } else {
      // Si no hay mensaje inicial, agregar un mensaje de bienvenida del asistente
      setMessages([
        {
          role: 'assistant', 
          content: '¡Bienvenido a JetAI! Soy tu asistente personal de viajes. ¿En qué puedo ayudarte hoy?'
        }
      ]);
      // Sugerencias iniciales
      setSuggestions([
        "Quiero planear un viaje",
        "¿Qué destinos recomiendas?",
        "Busco vacaciones en la playa",
        "Viaje cultural a Europa"
      ]);
    }
  }, [initialMessage]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-to-Speech
  const speakText = async (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    setIsSpeaking(true);
    
    // Detener cualquier síntesis en curso
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar voz
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Seleccionar voz femenina si está disponible
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.includes('es') && voice.name.includes('Female')
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Detener síntesis de voz
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Toggle grabación de voz
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.abort();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  // Enviar mensaje
  const handleSendMessage = async (text: string = userInput) => {
    if (!text.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Llamar a la API de VertexAI
      const response = await fetch('/api/chat/vertex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages,
          memory: memory,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      
      // Actualizar memoria de conversación
      setMemory(data.memory);
      
      // Agregar mensaje del asistente
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.message 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Actualizar sugerencias
      setSuggestions(data.suggestions || []);
      
      // Auto-reproducir respuesta con TTS si estaba grabando
      if (isRecording) {
        speakText(data.message);
      }
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar envío con Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-primary/5">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarImage src="/jetai-logo.png" alt="JetAI" />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">JetAI Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by Vertex AI</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        )}
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-muted rounded-tl-none'
              }`}
            >
              <div className="prose dark:prose-invert prose-sm max-w-none">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested Responses */}
      {suggestions.length > 0 && (
        <div className="p-2 overflow-x-auto flex gap-2 border-t">
          {suggestions.map((suggestion, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-xs whitespace-nowrap"
              onClick={() => handleSendMessage(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      
      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          {isAudioSupported && (
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "default" : "outline"}
              className={`shrink-0 ${isRecording ? 'text-white bg-red-500 hover:bg-red-600' : ''}`}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
          )}
          
          <div className="relative flex-1">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="pr-10"
              disabled={isLoading || isRecording}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim() || isLoading || isRecording}
            >
              <Send size={18} />
              <span className="sr-only">Enviar</span>
            </Button>
          </div>
          
          <Button
            type="button"
            size="icon"
            variant={isSpeaking ? "default" : "outline"}
            className="shrink-0"
            onClick={isSpeaking ? stopSpeaking : () => messages.length > 0 && speakText(messages[messages.length - 1].content)}
            disabled={messages.length === 0 || isLoading}
          >
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-center text-muted-foreground">
          {memory.destination && (
            <div className="flex justify-center gap-2 flex-wrap">
              {memory.destination && <span className="px-2 py-1 bg-primary/10 rounded-full">📍 {memory.destination}</span>}
              {memory.budget && <span className="px-2 py-1 bg-primary/10 rounded-full">💰 {memory.budget}</span>}
              {memory.dates && <span className="px-2 py-1 bg-primary/10 rounded-full">📅 {memory.dates}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VertexAIChat;