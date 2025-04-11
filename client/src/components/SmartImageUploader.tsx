/**
 * SmartImageUploader
 * 
 * Componente para cargar imágenes con análisis automático de Google Vision.
 * Extrae información como texto, puntos de referencia, etiquetas, etc.
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  Upload, 
  ImagePlus, 
  MapPin, 
  Tag, 
  Volume2, 
  Languages, 
  Loader2,
  PlusCircle,
  CheckCircle2,
  Info,
  Globe,
  Mic,
  Globe2
} from 'lucide-react';
import { analyzeImage, generateAudio, translateText, getLocationInfo } from '@/services/memoryEnhancementService';
import { LANGUAGE_OPTIONS } from '@/services/memoryEnhancementService';

interface SmartImageUploaderProps {
  onImageSelected: (imageData: SmartImageData) => void;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  buttonIcon?: boolean;
  autoDetectLocation?: boolean;
}

export interface SmartImageData {
  file: File;
  imageUrl: string;
  title: string;
  description: string;
  location?: string;
  tags?: string[];
  landmarks?: {
    description: string;
    score: number;
    location?: {
      lat: number;
      lng: number;
    };
  }[];
  detectedText?: string;
  audioNarration?: {
    url: string;
    duration: number;
  };
  translations?: {
    language: string;
    text: string;
  }[];
  mapUrl?: string;
  nearbyAttractions?: {
    name: string;
    vicinity: string;
    rating: number;
  }[];
}

export default function SmartImageUploader({
  onImageSelected,
  buttonText = 'Añadir foto',
  buttonVariant = 'default',
  buttonIcon = true,
  autoDetectLocation = true,
}: SmartImageUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>('Preparando...');
  const [progress, setProgress] = useState(0);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [detectedLandmark, setDetectedLandmark] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<any | null>(null);
  
  const [generateAudioNarration, setGenerateAudioNarration] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState('es-ES');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [translatedDescriptions, setTranslatedDescriptions] = useState<{[key: string]: string}>({});
  const [translateTo, setTranslateTo] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Función para seleccionar archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Tipo de archivo no válido',
          description: 'Por favor selecciona una imagen (JPG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      
      // Crear URL de vista previa
      const objectUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
      
      // Generar título automático basado en el nombre del archivo
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Quitar extensión
      const formattedTitle = fileName
        .replace(/[-_]/g, ' ') // Reemplazar guiones y guiones bajos por espacios
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar primera letra de cada palabra
      
      setTitle(formattedTitle);
      
      // Analizar imagen automáticamente
      processImage(file);
    }
  };
  
  // Procesar imagen con Google Vision
  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(10);
    setCurrentStage('Analizando imagen...');
    
    try {
      // Analizar imagen
      const analysis = await analyzeImage(file);
      setImageAnalysis(analysis);
      setProgress(50);
      
      // Extraer etiquetas principales (top 5 con mayor confianza)
      const topLabels = analysis.analysis.labels
        .filter((label: any) => label.score > 0.7)
        .slice(0, 5)
        .map((label: any) => label.description);
      
      setSelectedTags(topLabels);
      
      // Extraer texto detectado y usarlo como descripción inicial si está vacía
      if (analysis.analysis.text && !description) {
        setDescription(analysis.analysis.text);
      }
      
      setProgress(70);
      setCurrentStage('Detectando ubicación...');
      
      // Extraer información de ubicación si hay landmarks
      if (analysis.analysis.landmarks && analysis.analysis.landmarks.length > 0) {
        const landmark = analysis.analysis.landmarks[0];
        setDetectedLandmark(landmark.description);
        
        if (autoDetectLocation && landmark.description) {
          setLocation(landmark.description);
          
          // Obtener información adicional de la ubicación
          setCurrentStage('Obteniendo detalles de ubicación...');
          try {
            const locationData = await getLocationInfo(landmark.description);
            setLocationInfo(locationData);
          } catch (error) {
            console.error('Error obteniendo información de ubicación:', error);
          }
        }
      }
      
      setProgress(100);
      setCurrentStage('¡Listo!');
      
    } catch (error) {
      console.error('Error procesando imagen:', error);
      toast({
        title: 'Error al procesar imagen',
        description: 'Ha ocurrido un error analizando la imagen. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generar narración de audio
  const handleGenerateAudio = async () => {
    if (!description) {
      toast({
        title: 'Descripción requerida',
        description: 'Por favor escribe una descripción para generar el audio.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    setCurrentStage('Generando narración de audio...');
    
    try {
      const result = await generateAudio(description, audioLanguage);
      setAudioUrl(result.audioUrl);
      
      toast({
        title: 'Audio generado',
        description: 'La narración de audio ha sido generada con éxito.',
      });
    } catch (error) {
      console.error('Error generando audio:', error);
      toast({
        title: 'Error al generar audio',
        description: 'Ha ocurrido un problema generando el audio. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Traducir descripción
  const handleTranslate = async (language: string) => {
    if (!description) {
      toast({
        title: 'Descripción requerida',
        description: 'Por favor escribe una descripción para traducir.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    setCurrentStage(`Traduciendo a ${LANGUAGE_OPTIONS.find(l => l.code === language)?.name}...`);
    
    try {
      const result = await translateText(description, language.substring(0, 2));
      
      setTranslatedDescriptions({
        ...translatedDescriptions,
        [language]: result.translatedText
      });
      
      if (!translateTo.includes(language)) {
        setTranslateTo([...translateTo, language]);
      }
      
    } catch (error) {
      console.error('Error traduciendo texto:', error);
      toast({
        title: 'Error al traducir',
        description: 'Ha ocurrido un problema con la traducción. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Guardar y continuar
  const handleSave = () => {
    if (!selectedFile || !previewUrl) {
      toast({
        title: 'Imagen requerida',
        description: 'Por favor selecciona una imagen primero.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!title) {
      toast({
        title: 'Título requerido',
        description: 'Por favor proporciona un título para tu foto.',
        variant: 'destructive',
      });
      return;
    }
    
    // Preparar datos para enviar al componente padre
    const imageData: SmartImageData = {
      file: selectedFile,
      imageUrl: previewUrl,
      title,
      description,
      location,
      tags: selectedTags,
    };
    
    // Añadir datos adicionales si están disponibles
    if (imageAnalysis) {
      if (imageAnalysis.analysis.landmarks) {
        imageData.landmarks = imageAnalysis.analysis.landmarks;
      }
      if (imageAnalysis.analysis.text) {
        imageData.detectedText = imageAnalysis.analysis.text;
      }
    }
    
    if (audioUrl) {
      imageData.audioNarration = {
        url: audioUrl,
        duration: 0, // En este punto no tenemos la duración real
      };
    }
    
    if (Object.keys(translatedDescriptions).length > 0) {
      imageData.translations = Object.entries(translatedDescriptions).map(([lang, text]) => ({
        language: lang,
        text: text as string,
      }));
    }
    
    if (locationInfo) {
      imageData.mapUrl = locationInfo.staticMapUrl;
      imageData.nearbyAttractions = locationInfo.nearbyAttractions;
    }
    
    // Enviar al componente padre
    onImageSelected(imageData);
    
    // Resetear estado
    resetState();
    
    // Cerrar modal
    setIsOpen(false);
  };
  
  // Resetear estado
  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageAnalysis(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setSelectedTags([]);
    setDetectedLandmark(null);
    setLocationInfo(null);
    setGenerateAudioNarration(false);
    setAudioUrl(null);
    setTranslatedDescriptions({});
    setTranslateTo([]);
    setProgress(0);
    setCurrentStage('Preparando...');
  };
  
  // Cancelar y cerrar
  const handleCancel = () => {
    resetState();
    setIsOpen(false);
  };
  
  return (
    <>
      <Button 
        variant={buttonVariant}
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        {buttonIcon && <Camera className="h-4 w-4" />}
        {buttonText}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Añadir nueva foto de viaje</DialogTitle>
            <DialogDescription>
              Sube una foto y utiliza IA para mejorarla con información automática.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda: Vista previa y carga */}
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="text-center p-8">
                    <ImagePlus className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Selecciona una imagen para comenzar
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Seleccionar imagen
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{currentStage}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </div>
            
            {/* Columna derecha: Formulario y datos detectados */}
            <div className="space-y-6">
              <Tabs defaultValue="basic">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="ai">Mejoras IA</TabsTrigger>
                  <TabsTrigger value="translate">Traducciones</TabsTrigger>
                </TabsList>
                
                {/* Pestaña de información básica */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título de la foto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe este momento de tu viaje"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="location">Ubicación</Label>
                      {detectedLandmark && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setLocation(detectedLandmark)}
                              >
                                <MapPin className="h-4 w-4 mr-1" />
                                Usar detectado
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Punto de referencia detectado: {detectedLandmark}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="¿Dónde fue tomada esta foto?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Etiquetas</Label>
                    <div className="flex flex-wrap gap-2">
                      {imageAnalysis && imageAnalysis.analysis && imageAnalysis.analysis.labels && imageAnalysis.analysis.labels.slice(0, 10).map((label: any, index: number) => (
                        <Badge 
                          key={index}
                          variant={selectedTags.includes(label.description) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            if (selectedTags.includes(label.description)) {
                              setSelectedTags(selectedTags.filter(tag => tag !== label.description));
                            } else {
                              setSelectedTags([...selectedTags, label.description]);
                            }
                          }}
                        >
                          {label.description}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Pestaña de mejoras con IA */}
                <TabsContent value="ai" className="space-y-4">
                  {/* Narración de audio */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Mic className="h-4 w-4 mr-2" />
                        Narración de audio
                      </CardTitle>
                      <CardDescription>
                        Genera una narración de audio para esta foto
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="generate-audio"
                            checked={generateAudioNarration}
                            onCheckedChange={setGenerateAudioNarration}
                          />
                          <Label htmlFor="generate-audio">Generar audio</Label>
                        </div>
                        
                        {generateAudioNarration && (
                          <select
                            value={audioLanguage}
                            onChange={(e) => setAudioLanguage(e.target.value)}
                            className="rounded border px-3 py-1 text-sm"
                          >
                            {LANGUAGE_OPTIONS.map(option => (
                              <option key={option.code} value={option.code}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      
                      {generateAudioNarration && (
                        <Button 
                          onClick={handleGenerateAudio} 
                          disabled={isProcessing || !description}
                          size="sm"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Volume2 className="h-4 w-4 mr-2" />
                          )}
                          Generar narración
                        </Button>
                      )}
                      
                      {audioUrl && (
                        <div className="mt-4">
                          <audio controls src={audioUrl} className="w-full">
                            Tu navegador no soporta el elemento de audio.
                          </audio>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Información de ubicación */}
                  {location && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          Información de ubicación
                        </CardTitle>
                        <CardDescription>
                          Descubre más sobre este lugar
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button 
                          onClick={async () => {
                            if (!location) return;
                            setIsProcessing(true);
                            setCurrentStage('Obteniendo información del lugar...');
                            try {
                              const locationData = await getLocationInfo(location);
                              setLocationInfo(locationData);
                            } catch (error) {
                              console.error('Error obteniendo información de ubicación:', error);
                              toast({
                                title: 'Error',
                                description: 'No se pudo obtener información de esta ubicación',
                                variant: 'destructive',
                              });
                            } finally {
                              setIsProcessing(false);
                            }
                          }}
                          variant="outline"
                          size="sm"
                          disabled={isProcessing || !location}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Info className="h-4 w-4 mr-2" />
                          )}
                          Obtener detalles
                        </Button>
                        
                        {locationInfo && (
                          <div className="space-y-4 mt-2">
                            {locationInfo.staticMapUrl && (
                              <img 
                                src={locationInfo.staticMapUrl} 
                                alt="Mapa de la ubicación" 
                                className="w-full rounded border"
                              />
                            )}
                            
                            {locationInfo.locationInfo && (
                              <div className="text-sm">
                                <p className="font-medium">Dirección:</p>
                                <p>{locationInfo.locationInfo.formattedAddress}</p>
                              </div>
                            )}
                            
                            {locationInfo.nearbyAttractions && locationInfo.nearbyAttractions.length > 0 && (
                              <div>
                                <p className="font-medium text-sm mb-2">Atracciones cercanas:</p>
                                <ul className="text-sm space-y-1">
                                  {locationInfo.nearbyAttractions.slice(0, 3).map((attraction: any, index: number) => (
                                    <li key={index} className="flex items-start">
                                      <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                      <span>{attraction.name} {attraction.rating && `(${attraction.rating}★)`}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                {/* Pestaña de traducciones */}
                <TabsContent value="translate" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Traducciones
                      </CardTitle>
                      <CardDescription>
                        Traduce tu descripción a otros idiomas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGE_OPTIONS.filter(l => l.code !== 'es-ES').slice(0, 6).map(language => (
                            <Badge 
                              key={language.code}
                              variant={translateTo.includes(language.code) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                if (!translateTo.includes(language.code)) {
                                  handleTranslate(language.code);
                                } else {
                                  // Si ya está seleccionado, quitarlo
                                  setTranslateTo(translateTo.filter(code => code !== language.code));
                                  // Y eliminar la traducción
                                  const newTranslations = {...translatedDescriptions};
                                  delete newTranslations[language.code];
                                  setTranslatedDescriptions(newTranslations);
                                }
                              }}
                            >
                              {language.name}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Mostrar traducciones */}
                        {translateTo.length > 0 && (
                          <div className="space-y-3 mt-4">
                            {translateTo.map(langCode => (
                              <div key={langCode} className="border rounded p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {LANGUAGE_OPTIONS.find(l => l.code === langCode)?.name}
                                  </span>
                                </div>
                                <p className="text-sm">
                                  {translatedDescriptions[langCode] || (
                                    <span className="text-gray-400 italic">Traduciendo...</span>
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isProcessing || !selectedFile || !title}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar imagen
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}