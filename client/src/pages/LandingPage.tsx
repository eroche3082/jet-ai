import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plane, Globe, Languages, HeartHandshake, Wallet, FileCheck,
  BrainCircuit, PackageCheck, Cloud, Mountain, Stethoscope, 
  Bus, User, ShieldCheck, Leaf, Hotel, CalendarCheck, Clock,
  BadgeDollarSign, PanelTopOpen
} from 'lucide-react';

const features = [
  {
    title: "Itinerario Inteligente Generativo",
    description: "Itinerarios personalizados según preferencias, tiempo y presupuesto.",
    icon: <Plane className="h-8 w-8 text-primary" />
  },
  {
    title: "Comparador de Vuelos en Tiempo Real",
    description: "Encuentra vuelos con la mejor relación calidad-precio.",
    icon: <Globe className="h-8 w-8 text-primary" />
  },
  {
    title: "Traductor Multilingüe Integrado",
    description: "Traduce conversaciones y frases entre más de 30 idiomas.",
    icon: <Languages className="h-8 w-8 text-primary" />
  },
  {
    title: "Asesor Cultural Predictivo",
    description: "Información sobre costumbres y etiqueta de tu destino.",
    icon: <HeartHandshake className="h-8 w-8 text-primary" />
  },
  {
    title: "Gestor Automático de Presupuesto",
    description: "Monitoriza y sugiere ajustes a tu presupuesto de viaje.",
    icon: <Wallet className="h-8 w-8 text-primary" />
  },
  {
    title: "Scanner de Documentos de Viaje",
    description: "Verifica pasaportes, visas y documentos de viaje.",
    icon: <FileCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "Memoria Contextual entre Sesiones",
    description: "Recuerda conversaciones previas y preferencias para recomendaciones consistentes.",
    icon: <BrainCircuit className="h-8 w-8 text-primary" />
  },
  {
    title: "Generador de Packing List Personalizado",
    description: "Listas de equipaje adaptadas a tu destino y actividades.",
    icon: <PackageCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "Alertas Predictivas de Clima",
    description: "Anticipa y notifica sobre condiciones climáticas adversas.",
    icon: <Cloud className="h-8 w-8 text-primary" />
  },
  {
    title: "Identificador Visual de Atracciones",
    description: "Sube imágenes para recibir información detallada sobre monumentos.",
    icon: <Mountain className="h-8 w-8 text-primary" />
  },
  {
    title: "Asistente de Emergencias Médicas",
    description: "Traducciones médicas y ubicación de hospitales cercanos.",
    icon: <Stethoscope className="h-8 w-8 text-primary" />
  },
  {
    title: "Optimizador de Conexiones de Transporte",
    description: "Combinaciones óptimas de transporte para eficiencia y ahorro.",
    icon: <Bus className="h-8 w-8 text-primary" />
  },
  {
    title: "Filtro de Experiencias por Intereses",
    description: "Actividades y experiencias que coinciden con tus intereses.",
    icon: <User className="h-8 w-8 text-primary" />
  },
  {
    title: "Verificador de Seguridad de Zonas",
    description: "Evaluación de seguridad de diferentes zonas en tu destino.",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "Calculadora de Compensación de CO2",
    description: "Estima y compensa la huella de carbono de tu viaje.",
    icon: <Leaf className="h-8 w-8 text-primary" />
  },
  {
    title: "Comparador de Opciones de Alojamiento",
    description: "Analiza hoteles, Airbnb y más según tus preferencias.",
    icon: <Hotel className="h-8 w-8 text-primary" />
  },
  {
    title: "Asistente de Reservas con Confirmación",
    description: "Realiza reservas directamente con confirmación automática.",
    icon: <CalendarCheck className="h-8 w-8 text-primary" />
  },
  {
    title: "Generador de Itinerarios para Conexiones",
    description: "Mini-itinerarios para aprovechar escalas largas en aeropuertos.",
    icon: <Clock className="h-8 w-8 text-primary" />
  },
  {
    title: "Detector de Ofertas Flash",
    description: "Alertas sobre ofertas temporales que coinciden con tus preferencias.",
    icon: <BadgeDollarSign className="h-8 w-8 text-primary" />
  },
  {
    title: "Evaluador Multicriterio de Destinos",
    description: "Compara destinos según presupuesto, clima, atracciones y seguridad.",
    icon: <PanelTopOpen className="h-8 w-8 text-primary" />
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2029&auto=format&fit=crop')" }}
        ></div>
        
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Journey with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            JetAI combines cutting-edge artificial intelligence with expert travel insights to create
            personalized travel experiences tailored just for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Smart Features for Smart Travelers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border hover:shadow-md transition duration-300 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* About / Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-8">
            JetAI is designed to revolutionize how you plan, experience, and remember your travels. 
            We leverage the latest in artificial intelligence to eliminate the stress of travel planning,
            provide real-time assistance during your journey, and help you create lasting memories.
            Our platform combines predictive analytics, personalization, and multi-language support
            to ensure every traveler, regardless of experience level, can enjoy seamless journeys.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Travel Experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of travelers who have discovered the power of AI-assisted travel planning.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white" asChild>
              <Link href="/chat">Chat with Assistant</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-primary text-2xl mr-2">
                  <i className="fas fa-paper-plane"></i>
                </span>
                <span className="font-bold text-xl">
                  Jet<span className="text-primary">AI</span>
                </span>
              </Link>
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            © 2025 JetAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}