import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { apiRequest } from '@/lib/queryClient';
import ReactMarkdown from 'react-markdown';

// Tipos para mensajes y estado de la memoria
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

// Estado inicial de la memoria
const initialMemory: ConversationMemory = {
  destination: '',
  budget: '',
  dates: '',
  travelers: '',
  interests: [],
  currentQuestion: 'greeting',
  conversationStarted: false,
};

interface VertexAIChatProps {
  className?: string;
  onClose?: () => void;
  initialMessage?: string;
}

const VertexAIChat: React.FC<VertexAIChatProps> = ({
  className = '',
  onClose,
  initialMessage = '¡Bienvenido a JetAI! Soy tu asistente personal de viajes. ¿En qué puedo ayudarte hoy?',
}) => {
  // Estado para los mensajes y la entrada del usuario
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para la memoria de la conversación
  const [memory, setMemory] = useState<ConversationMemory>(initialMemory);
  
  // Estado para sugerencias de respuesta
  const [suggestions, setSuggestions] = useState<string[]>([
    'Quiero viajar a París',
    'Busco un destino de playa',
    'Itinerario para Nueva York',
    'Destinos económicos en Europa'
  ]);
  
  // Estado para reconocimiento de voz y síntesis de voz
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Referencia al div de mensajes para auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll al final de los mensajes cuando se añaden nuevos
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Función para enviar mensaje al backend
  const sendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;
    
    // Añadir mensaje del usuario a la lista
    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Iniciar carga
    setIsLoading(true);
    setError(null);
    
    try {
      // Llamar a la API de Vertex AI
      const response = await apiRequest('POST', '/api/chat/vertex', {
        message: userInput,
        history: messages,
        memory: memory
      });
      
      const data = await response.json();
      
      // Actualizar la memoria con la respuesta
      setMemory(data.memory);
      
      // Añadir respuesta del asistente
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.message 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Actualizar sugerencias
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
      
      // Reproducir mensaje si el audio está habilitado
      if (audioEnabled) {
        speakMessage(data.message);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar el envío de mensajes al presionar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage(inputMessage);
    }
  };
  
  // Usar sugerencia como mensaje
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    sendMessage(suggestion);
  };
  
  // Función para iniciar reconocimiento de voz
  const startListening = () => {
    if (!isListening && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      try {
        // Compatibilidad del navegador
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
          
        if (!SpeechRecognitionAPI) {
          setError('El reconocimiento de voz no está soportado en este navegador');
          return;
        }
        
        recognitionRef.current = new SpeechRecognitionAPI();
        
        if (recognitionRef.current) {
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'es-ES'; // Puedes hacerlo dinámico
          
          recognitionRef.current.onstart = () => {
            setIsListening(true);
          };
          
          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInputMessage(transcript);
            // Auto-enviar después de reconocimiento
            setTimeout(() => {
              sendMessage(transcript);
            }, 500);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event);
            setIsListening(false);
          };
          
          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
          
          recognitionRef.current.start();
        }
      } catch (error) {
        console.error('Speech recognition not supported:', error);
        setIsListening(false);
      }
    }
  };
  
  // Detener reconocimiento de voz
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  // Función para síntesis de voz (Text-to-Speech)
  const speakMessage = (message: string) => {
    if (!audioEnabled || !window.speechSynthesis) return;
    
    // Detener cualquier síntesis en curso
    window.speechSynthesis.cancel();
    
    // Limpiar el contenido del mensaje (eliminar markdown, emojis, etc.)
    const cleanMessage = message
      .replace(/[*_#~`]/g, '')         // Eliminar markdown
      .replace(/!\[.*?\]\(.*?\)/g, '') // Eliminar enlaces de imagen
      .replace(/\[.*?\]\(.*?\)/g, '$1') // Reemplazar enlaces con solo el texto
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanMessage);
    utterance.lang = 'es-ES'; // Puedes hacerlo dinámico
    
    // Intentar encontrar una voz más natural si está disponible
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Monica') || voice.name.includes('Spanish') || voice.name.includes('Español')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Alternar audio
  const toggleAudio = () => {
    if (audioEnabled) {
      window.speechSynthesis?.cancel();
    }
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-950 rounded-lg shadow-md ${className}`}>
      {/* Encabezado del chat */}
      <div className="border-b px-4 py-3 flex justify-between items-center bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/avatar-jetai.png" alt="JetAI" />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">JetAI Travel Assistant</h3>
            <p className="text-xs opacity-90">Powered by Vertex AI</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="sr-only">Cerrar</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        )}
      </div>
      
      {/* Panel de estado del viaje */}
      {(memory.destination || memory.budget || memory.dates) && (
        <div className="px-4 py-2 bg-muted/40 border-b text-xs flex flex-wrap gap-2">
          {memory.destination && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
              🌍 {memory.destination}
            </span>
          )}
          {memory.budget && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
              💰 {memory.budget}
            </span>
          )}
          {memory.dates && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
              📅 {memory.dates}
            </span>
          )}
          {memory.travelers && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
              👥 {memory.travelers}
            </span>
          )}
        </div>
      )}
      
      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%]`}>
              {msg.role === 'assistant' && (
                <Avatar className="mt-1 h-8 w-8">
                  <AvatarImage src="/avatar-jetai.png" alt="JetAI" />
                  <AvatarFallback><Bot size={16} /></AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`rounded-lg px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-accent/40 text-foreground'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <Avatar className="mt-1 h-8 w-8">
                  <AvatarFallback><User size={16} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <Avatar className="mt-1 h-8 w-8">
                <AvatarImage src="/avatar-jetai.png" alt="JetAI" />
                <AvatarFallback><Bot size={16} /></AvatarFallback>
              </Avatar>
              <div className="bg-accent/40 text-foreground rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Sugerencias de respuesta */}
      <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto hide-scrollbar">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-sm rounded-full whitespace-nowrap transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
      
      {/* Input del usuario */}
      <div className="p-4 border-t">
        <div className="relative flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute left-1"
            onClick={toggleAudio}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          
          <div className="absolute right-1 flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={isListening ? 'text-primary' : ''}
            >
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VertexAIChat;