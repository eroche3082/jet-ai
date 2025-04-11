import { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  MapPin, 
  Camera, 
  PenSquare, 
  Trash, 
  MoreVertical,
  XCircle,
  Star,
  MessageCircle,
  Heart,
  Download,
  Share2,
  Tag,
  QrCode,
  Link as LinkIcon,
  ScanLine,
  Image as ImageIcon,
  Video,
  Scissors,
  Plus,
  RotateCw,
  Ticket,
  Plane,
  Hotel,
  Bus,
  MapPinned,
  Volume2,
  Globe,
  Sparkles,
  Languages
} from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import SmartImageUploader, { SmartImageData } from './SmartImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Type definitions
interface MemoryItem {
  id: string;
  type: 'photo' | 'note' | 'ticket' | 'drawing' | 'location' | 'video';
  title: string;
  content: string;
  date: Date;
  location?: string;
  tags?: string[];
  imageUrl?: string;
  arEnabled?: boolean;
  arData?: {
    modelUrl?: string;
    markers?: string[];
    annotations?: {
      text: string;
      position: [number, number, number];
    }[];
  };
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
  };
}

interface MemoryPage {
  id: string;
  title: string;
  date: Date;
  location?: string;
  coverImage?: string;
  items: MemoryItem[];
  backgroundColor: string;
  backgroundImage?: string;
}

interface TravelScrapbookProps {
  initialPages?: MemoryPage[];
  readOnly?: boolean;
  onSave?: (pages: MemoryPage[]) => void;
  onShare?: (pageId: string) => void;
}

export default function TravelMemoryScrapbook({
  initialPages = [],
  readOnly = false,
  onSave,
  onShare
}: TravelScrapbookProps) {
  const [pages, setPages] = useState<MemoryPage[]>(initialPages.length > 0 ? initialPages : [createDefaultPage()]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemType, setNewItemType] = useState<MemoryItem['type']>('photo');
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [arViewItem, setArViewItem] = useState<MemoryItem | null>(null);
  const [isARViewOpen, setIsARViewOpen] = useState(false);
  
  const scrapbookRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const currentPage = pages[currentPageIndex];
  
  // Helper function to create a default page
  function createDefaultPage(): MemoryPage {
    return {
      id: crypto.randomUUID(),
      title: 'New Memory Page',
      date: new Date(),
      items: [],
      backgroundColor: '#f9fafb',
    };
  }
  
  // Create a new memory item
  const createMemoryItem = (type: MemoryItem['type']): MemoryItem => {
    const centerPosition = scrapbookRef.current 
      ? {
          x: scrapbookRef.current.clientWidth / 2 - 120,
          y: scrapbookRef.current.clientHeight / 2 - 120,
        }
      : { x: 100, y: 100 };
      
    return {
      id: crypto.randomUUID(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: '',
      date: new Date(),
      position: {
        x: centerPosition.x,
        y: centerPosition.y,
        width: type === 'photo' || type === 'video' ? 240 : 200,
        height: type === 'photo' || type === 'video' ? 180 : 150,
        rotation: 0,
        zIndex: currentPage.items.length + 1,
      },
      arEnabled: false,
    };
  };
  
  // Add a new page
  const addNewPage = () => {
    const newPages = [...pages, createDefaultPage()];
    setPages(newPages);
    setCurrentPageIndex(newPages.length - 1);
    
    if (onSave) {
      onSave(newPages);
    }
    
    toast({
      title: 'New page added',
      description: 'A new blank page has been added to your scrapbook',
    });
  };
  
  // Delete current page
  const deleteCurrentPage = () => {
    if (pages.length <= 1) {
      toast({
        title: 'Cannot delete page',
        description: 'Your scrapbook must have at least one page',
        variant: 'destructive',
      });
      return;
    }
    
    const newPages = pages.filter((_, index) => index !== currentPageIndex);
    setPages(newPages);
    setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
    
    if (onSave) {
      onSave(newPages);
    }
    
    toast({
      title: 'Page deleted',
      description: 'The page has been removed from your scrapbook',
    });
  };
  
  // Save changes to a page
  const savePage = (updatedPage: MemoryPage) => {
    const newPages = [...pages];
    newPages[currentPageIndex] = updatedPage;
    setPages(newPages);
    
    if (onSave) {
      onSave(newPages);
    }
  };
  
  // Add a new item to the current page
  const addNewItem = (type: MemoryItem['type']) => {
    const newItem = createMemoryItem(type);
    
    const updatedPage = {
      ...currentPage,
      items: [...currentPage.items, newItem],
    };
    
    savePage(updatedPage);
    setEditingItem(newItem);
    setIsEditDialogOpen(true);
  };
  
  // Manejar adición de imágenes inteligentes con análisis AI
  const handleSmartImageSelected = (imageData: SmartImageData) => {
    const centerPosition = scrapbookRef.current 
      ? {
          x: scrapbookRef.current.clientWidth / 2 - 120,
          y: scrapbookRef.current.clientHeight / 2 - 120,
        }
      : { x: 100, y: 100 };
    
    // Crear un nuevo item con los datos mejorados de la imagen
    const newItem: MemoryItem = {
      id: crypto.randomUUID(),
      type: 'photo',
      title: imageData.title,
      content: imageData.description,
      date: new Date(),
      location: imageData.location,
      tags: imageData.tags,
      imageUrl: imageData.imageUrl,
      position: {
        x: centerPosition.x,
        y: centerPosition.y,
        width: 240,
        height: 180,
        rotation: 0,
        zIndex: currentPage.items.length + 1,
      },
      arEnabled: false,
    };
    
    // Si hay datos AR adicionales, habilitarlos
    if (imageData.landmarks && imageData.landmarks.length > 0) {
      const landmark = imageData.landmarks[0];
      if (landmark.location) {
        newItem.arEnabled = true;
        newItem.arData = {
          annotations: [{
            text: landmark.description,
            position: [0, 0, 0],
          }]
        };
      }
    }
    
    // Actualizar la página
    const updatedPage = {
      ...currentPage,
      items: [...currentPage.items, newItem],
    };
    
    // Si no hay una imagen de portada establecida, usar esta
    if (!currentPage.coverImage && imageData.imageUrl) {
      updatedPage.coverImage = imageData.imageUrl;
    }
    
    savePage(updatedPage);
    
    toast({
      title: 'Smart image added',
      description: 'Your enhanced image has been added to the scrapbook',
    });
  };
  
  // Delete an item from the current page
  const deleteItem = (itemId: string) => {
    const updatedItems = currentPage.items.filter(item => item.id !== itemId);
    
    const updatedPage = {
      ...currentPage,
      items: updatedItems,
    };
    
    savePage(updatedPage);
    
    toast({
      title: 'Item deleted',
      description: 'The item has been removed from your scrapbook',
    });
  };
  
  // Update an item in the current page
  const updateItem = (updatedItem: MemoryItem) => {
    const itemIndex = currentPage.items.findIndex(item => item.id === updatedItem.id);
    
    if (itemIndex === -1) return;
    
    const updatedItems = [...currentPage.items];
    updatedItems[itemIndex] = updatedItem;
    
    const updatedPage = {
      ...currentPage,
      items: updatedItems,
    };
    
    savePage(updatedPage);
  };
  
  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>, itemId: string) => {
    if (readOnly) return;
    
    const item = currentPage.items.find(item => item.id === itemId);
    if (!item) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggedItem(itemId);
    setIsDragging(true);
    
    // Update zIndex to bring to front
    const updatedItem = {
      ...item,
      position: {
        ...item.position!,
        zIndex: Math.max(...currentPage.items.map(i => i.position?.zIndex || 0)) + 1,
      },
    };
    
    updateItem(updatedItem);
  };
  
  // Handle drag move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedItem || readOnly) return;
    
    const item = currentPage.items.find(item => item.id === draggedItem);
    if (!item || !item.position) return;
    
    const scrapbookRect = scrapbookRef.current?.getBoundingClientRect();
    if (!scrapbookRect) return;
    
    // Calculate new position relative to the scrapbook container
    const newX = e.clientX - scrapbookRect.left - dragOffset.x;
    const newY = e.clientY - scrapbookRect.top - dragOffset.y;
    
    // Update the item's position
    const updatedItem = {
      ...item,
      position: {
        ...item.position,
        x: Math.max(0, Math.min(newX, scrapbookRect.width - item.position.width)),
        y: Math.max(0, Math.min(newY, scrapbookRect.height - item.position.height)),
      },
    };
    
    updateItem(updatedItem);
  };
  
  // Handle drag end
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedItem(null);
    }
  };
  
  // Edit an item
  const editItem = (item: MemoryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };
  
  // Handle saving item edits
  const handleSaveItemEdit = (updatedItem: Partial<MemoryItem>) => {
    if (!editingItem) return;
    
    const newItem = {
      ...editingItem,
      ...updatedItem,
    };
    
    updateItem(newItem);
    setIsEditDialogOpen(false);
    setEditingItem(null);
    
    toast({
      title: 'Changes saved',
      description: 'Your changes have been saved to the memory item',
    });
  };
  
  // Handle AR view
  const openARView = (item: MemoryItem) => {
    if (!item.arEnabled) {
      toast({
        title: 'AR not available',
        description: 'This item does not have AR content associated with it',
        variant: 'destructive',
      });
      return;
    }
    
    setArViewItem(item);
    setIsARViewOpen(true);
  };
  
  // Enable AR for an item
  const enableARForItem = (item: MemoryItem) => {
    const updatedItem = {
      ...item,
      arEnabled: true,
      arData: item.arData || {
        annotations: [{
          text: item.title,
          position: [0, 0, 0],
        }]
      },
    };
    
    updateItem(updatedItem);
    
    toast({
      title: 'AR Enabled',
      description: 'This item now has AR features',
    });
  };
  
  // Handle page changes
  const handlePageChange = (pageIndex: number) => {
    setCurrentPageIndex(pageIndex);
  };
  
  // Update page settings
  const updatePageSettings = (updatedPageData: Partial<MemoryPage>) => {
    const updatedPage = {
      ...currentPage,
      ...updatedPageData,
    };
    
    savePage(updatedPage);
    setIsEditingPage(false);
    
    toast({
      title: 'Page updated',
      description: 'Your changes to the page have been saved',
    });
  };
  
  // Handle drag events for touch devices
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !draggedItem || readOnly || !scrapbookRef.current) return;
      
      const touch = e.touches[0];
      const scrapbookRect = scrapbookRef.current.getBoundingClientRect();
      
      const newX = touch.clientX - scrapbookRect.left - dragOffset.x;
      const newY = touch.clientY - scrapbookRect.top - dragOffset.y;
      
      const item = currentPage.items.find(item => item.id === draggedItem);
      if (!item || !item.position) return;
      
      const updatedItem = {
        ...item,
        position: {
          ...item.position,
          x: Math.max(0, Math.min(newX, scrapbookRect.width - item.position.width)),
          y: Math.max(0, Math.min(newY, scrapbookRect.height - item.position.height)),
        },
      };
      
      updateItem(updatedItem);
      e.preventDefault();
    };
    
    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        setDraggedItem(null);
      }
    };
    
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, draggedItem, dragOffset, readOnly]);
  
  // Clean up mouse events when component unmounts
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setDraggedItem(null);
      };
      
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);
  
  // Save scrapbook periodically
  useEffect(() => {
    if (onSave && !readOnly) {
      const saveTimer = setTimeout(() => {
        onSave(pages);
      }, 5000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [pages, onSave, readOnly]);
  
  const renderItemContent = (item: MemoryItem) => {
    switch (item.type) {
      case 'photo':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/600x400/d1d5db/6b7280?text=${encodeURIComponent('Photo')}`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80">
              <p className="text-sm font-medium truncate">{item.title}</p>
              {item.location && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'note':
        return (
          <div className="w-full h-full flex flex-col p-3 bg-yellow-50 dark:bg-yellow-900/30">
            <h4 className="text-sm font-medium mb-1">{item.title}</h4>
            <p className="text-xs flex-1 overflow-auto">{item.content}</p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        );
      
      case 'ticket':
        return (
          <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-800 overflow-hidden">
            <div className="bg-primary/80 p-2 text-white">
              <div className="flex items-center">
                <Ticket className="w-4 h-4 mr-2" />
                <p className="text-sm font-medium truncate">{item.title}</p>
              </div>
            </div>
            <div className="p-3 flex-1 border-dashed border-2 border-t-0 border-primary/20">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{format(new Date(item.date), 'MMM d, yyyy')}</span>
                </div>
                {item.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="font-medium truncate max-w-[120px]">{item.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="font-medium">
                    {item.content?.includes('flight') ? (
                      <span className="flex items-center"><Plane className="w-3 h-3 mr-1" /> Flight</span>
                    ) : item.content?.includes('hotel') ? (
                      <span className="flex items-center"><Hotel className="w-3 h-3 mr-1" /> Hotel</span>
                    ) : item.content?.includes('bus') || item.content?.includes('train') ? (
                      <span className="flex items-center"><Bus className="w-3 h-3 mr-1" /> Transport</span>
                    ) : (
                      <span className="flex items-center"><Ticket className="w-3 h-3 mr-1" /> Event</span>
                    )}
                  </span>
                </div>
              </div>
              {item.imageUrl && (
                <div className="mt-2 h-12 flex justify-center">
                  <img 
                    src={item.imageUrl} 
                    alt="QR Code" 
                    className="h-full"
                  />
                </div>
              )}
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30">
                  <MapPinned className="w-12 h-12 text-blue-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.location}</p>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden relative bg-black">
              {item.imageUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80">
              <p className="text-sm font-medium truncate">{item.title}</p>
              {item.location && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'drawing':
        return (
          <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 p-2">
            <h4 className="text-xs font-medium mb-1">{item.title}</h4>
            <div className="flex-1 overflow-hidden border border-dashed border-gray-300 dark:border-gray-600 rounded">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PenSquare className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return <div className="p-2">Unknown item type</div>;
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Scrapbook Controls */}
      <div className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">{currentPage.title}</h2>
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditingPage(true)}>
              <PenSquare className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">Edit Page</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Page Navigation */}
          <div className="text-sm">
            Page {currentPageIndex + 1} of {pages.length}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(Math.min(pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === pages.length - 1}
          >
            Next
          </Button>
          
          {!readOnly && (
            <>
              <Button variant="outline" size="sm" onClick={addNewPage}>
                <Plus className="w-4 h-4 mr-1" />
                <span>Add Page</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={deleteCurrentPage}>
                    <Trash className="w-4 h-4 mr-2 text-red-500" />
                    <span>Delete Page</span>
                  </DropdownMenuItem>
                  {onShare && (
                    <DropdownMenuItem onClick={() => onShare(currentPage.id)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      <span>Share Page</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href={`/ar?memoryId=${currentPage.id}`}>
                      <ScanLine className="w-4 h-4 mr-2" />
                      <span>View in AR</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
      
      {/* Scrapbook Page */}
      <div 
        ref={scrapbookRef}
        className="relative w-full aspect-[1.4/1] min-h-[500px] rounded-lg overflow-hidden"
        style={{
          backgroundColor: currentPage.backgroundColor || '#f8f9fa',
          backgroundImage: currentPage.backgroundImage ? `url(${currentPage.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {currentPage.items.map(item => (
          <div
            key={item.id}
            className={`absolute p-1 ${
              !readOnly ? 'cursor-move' : ''
            } ${
              item.arEnabled ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
            }`}
            style={{
              left: `${item.position?.x || 0}px`,
              top: `${item.position?.y || 0}px`,
              width: `${item.position?.width || 200}px`,
              height: `${item.position?.height || 150}px`,
              transform: `rotate(${item.position?.rotation || 0}deg)`,
              zIndex: item.position?.zIndex || 1,
            }}
            onMouseDown={!readOnly ? (e) => handleDragStart(e, item.id) : undefined}
          >
            <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded shadow-md overflow-hidden">
              {renderItemContent(item)}
              
              {/* Item controls */}
              {!readOnly && (
                <div className="absolute -top-3 -right-3 flex space-x-1">
                  <button
                    className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => editItem(item)}
                  >
                    <PenSquare className="w-3 h-3" />
                  </button>
                  <button
                    className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => deleteItem(item.id)}
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* AR indicator and button */}
              {item.arEnabled && (
                <button
                  className="absolute top-1 left-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 focus:outline-none"
                  onClick={() => openARView(item)}
                >
                  <QrCode className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {/* Add item floating button */}
        {!readOnly && (
          <div className="absolute bottom-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="rounded-full w-12 h-12">
                  <Plus className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => addNewItem('photo')}>
                  <Camera className="w-4 h-4 mr-2" />
                  <span>Add Photo</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('note')}>
                  <PenSquare className="w-4 h-4 mr-2" />
                  <span>Add Note</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('ticket')}>
                  <Ticket className="w-4 h-4 mr-2" />
                  <span>Add Ticket</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('location')}>
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Add Location</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('video')}>
                  <Video className="w-4 h-4 mr-2" />
                  <span>Add Video</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('drawing')}>
                  <Scissors className="w-4 h-4 mr-2" />
                  <span>Add Drawing</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      {/* Memory Item Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Memory Item</DialogTitle>
            <DialogDescription>
              Update the details of your memory item. Make it special!
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              
              {(editingItem.type === 'note' || editingItem.type === 'ticket') && (
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    rows={3}
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  />
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editingItem.date instanceof Date 
                    ? format(editingItem.date, 'yyyy-MM-dd')
                    : format(new Date(editingItem.date), 'yyyy-MM-dd')}
                  onChange={(e) => setEditingItem({ 
                    ...editingItem, 
                    date: new Date(e.target.value) 
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="e.g. Paris, France"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={editingItem.imageUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant={editingItem.arEnabled ? "default" : "outline"}
                  onClick={() => setEditingItem({ 
                    ...editingItem, 
                    arEnabled: !editingItem.arEnabled,
                    arData: editingItem.arData || {
                      annotations: [{
                        text: editingItem.title,
                        position: [0, 0, 0],
                      }]
                    }
                  })}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {editingItem.arEnabled ? 'AR Enabled' : 'Enable AR'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setEditingItem({ 
                    ...editingItem, 
                    position: {
                      ...editingItem.position!,
                      rotation: ((editingItem.position?.rotation || 0) + 5) % 360
                    }
                  })}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingItem(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => editingItem && handleSaveItemEdit(editingItem)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Page Edit Dialog */}
      <Dialog open={isEditingPage} onOpenChange={setIsEditingPage}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Customize your scrapbook page settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pageTitle">Page Title</Label>
              <Input
                id="pageTitle"
                value={currentPage.title}
                onChange={(e) => savePage({ ...currentPage, title: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="pageBackground">Background Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="pageBackground"
                  type="color"
                  value={currentPage.backgroundColor}
                  onChange={(e) => savePage({ ...currentPage, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={currentPage.backgroundColor}
                  onChange={(e) => savePage({ ...currentPage, backgroundColor: e.target.value })}
                  placeholder="#f9fafb"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="pageBackgroundImage">Background Image URL</Label>
              <Input
                id="pageBackgroundImage"
                value={currentPage.backgroundImage || ''}
                onChange={(e) => savePage({ ...currentPage, backgroundImage: e.target.value })}
                placeholder="https://example.com/background.jpg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="pageDate">Page Date</Label>
              <Input
                id="pageDate"
                type="date"
                value={currentPage.date instanceof Date 
                  ? format(currentPage.date, 'yyyy-MM-dd')
                  : format(new Date(currentPage.date), 'yyyy-MM-dd')}
                onChange={(e) => savePage({ 
                  ...currentPage, 
                  date: new Date(e.target.value) 
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="pageLocation">Location</Label>
              <Input
                id="pageLocation"
                value={currentPage.location || ''}
                onChange={(e) => savePage({ ...currentPage, location: e.target.value })}
                placeholder="e.g. Tokyo, Japan"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditingPage(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setIsEditingPage(false)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AR View Dialog */}
      <Dialog open={isARViewOpen} onOpenChange={setIsARViewOpen}>
        <DialogContent className="sm:max-w-2xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>AR View</DialogTitle>
            <DialogDescription>
              Scan this AR marker with your phone or use the AR view button
            </DialogDescription>
          </DialogHeader>
          
          {arViewItem && (
            <div className="flex flex-col items-center justify-center space-y-4 flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-64 h-64 flex items-center justify-center border-2 border-black">
                  <QrCode className="w-40 h-40" />
                </div>
              </div>
              
              <Button asChild>
                <Link href={`/ar?itemId=${arViewItem.id}`}>
                  <ScanLine className="w-4 h-4 mr-2" />
                  Open AR View
                </Link>
              </Button>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-sm mt-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">How to view in AR:</h3>
                <ol className="list-decimal pl-4 space-y-1 text-blue-700 dark:text-blue-400">
                  <li>Open the JetAI App on your mobile device</li>
                  <li>Tap the Scanner icon in the navigation</li>
                  <li>Point your camera at this QR code</li>
                  <li>The content will appear in augmented reality</li>
                </ol>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setIsARViewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}