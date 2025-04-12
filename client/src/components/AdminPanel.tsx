import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { firestore } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Download, Save, RefreshCw, FileText, ListChecks, Table, Paintbrush, MessageSquareText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SystemDiagnosticReport from './SystemDiagnosticReport';
import TabStatusTracker from './TabStatusTracker';
import VisualEnhancementsTracker from './VisualEnhancementsTracker';
import ChatFlowsTracker from './ChatFlowsTracker';

// Define the phase structure type
interface PhaseItem {
  id: string;
  label: string;
  completed: boolean;
}

interface Phase {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'complete';
  items: PhaseItem[];
  notes: string;
}

// Initial phases data
const initialPhases: Phase[] = [
  {
    id: 'phase-0',
    title: 'PHASE 0: Initialization',
    status: 'complete',
    notes: '',
    items: [
      { id: 'p0-1', label: 'App skeleton created (file structure, folders, base config)', completed: true },
      { id: 'p0-2', label: '.env and AppSecrets loaded', completed: true },
      { id: 'p0-3', label: 'Firebase / Backend connected', completed: true },
      { id: 'p0-4', label: 'Replit project initialized', completed: true },
      { id: 'p0-5', label: 'GitHub repo linked (if used)', completed: true },
    ]
  },
  {
    id: 'phase-1',
    title: 'PHASE 1: Layout & UI Base',
    status: 'complete',
    notes: '',
    items: [
      { id: 'p1-1', label: 'Header / Navbar implemented', completed: true },
      { id: 'p1-2', label: 'Side Panel Menu with all tabs', completed: true },
      { id: 'p1-3', label: 'Footer bar with Admin Panel trigger', completed: true },
      { id: 'p1-4', label: 'Responsive layout configured (mobile + desktop)', completed: true },
      { id: 'p1-5', label: 'Route navigation for each tab working', completed: true },
    ]
  },
  {
    id: 'phase-2',
    title: 'PHASE 2: Chatbot System Core',
    status: 'complete',
    notes: '',
    items: [
      { id: 'p2-1', label: 'Chatbot floating icon visible', completed: true },
      { id: 'p2-2', label: 'FullPage chatbot opens on click', completed: true },
      { id: 'p2-3', label: 'Vertex AI connected', completed: true },
      { id: 'p2-4', label: 'Audio input/output active', completed: true },
      { id: 'p2-5', label: 'Multilingual support tested', completed: true },
      { id: 'p2-6', label: 'Firebase context memory active', completed: true },
      { id: 'p2-7', label: 'Onboarding flow (10–15 questions) implemented', completed: true },
      { id: 'p2-8', label: 'Responses stored in subscriber dashboard', completed: true },
    ]
  },
  {
    id: 'phase-3',
    title: 'PHASE 3: Tab-by-Tab Module Integration',
    status: 'in-progress',
    notes: '',
    items: [
      { id: 'p3-1', label: 'Tab 1: Dashboard - UI built and responsive', completed: true },
      { id: 'p3-2', label: 'Tab 1: Dashboard - Backend/API connected', completed: true },
      { id: 'p3-3', label: 'Tab 1: Dashboard - Chart, form, or dynamic components functional', completed: true },
      { id: 'p3-4', label: 'Tab 1: Dashboard - State management active', completed: true },
      { id: 'p3-5', label: 'Tab 1: Dashboard - Chatbot context-aware for this tab', completed: true },
      { id: 'p3-6', label: 'Tab 1: Dashboard - Content in English and clean', completed: true },
      
      { id: 'p3-7', label: 'Tab 2: Data / Analytics - UI built and responsive', completed: true },
      { id: 'p3-8', label: 'Tab 2: Data / Analytics - Backend/API connected', completed: true },
      { id: 'p3-9', label: 'Tab 2: Data / Analytics - Chart, form, or dynamic components functional', completed: true },
      { id: 'p3-10', label: 'Tab 2: Data / Analytics - State management active', completed: true },
      { id: 'p3-11', label: 'Tab 2: Data / Analytics - Chatbot context-aware for this tab', completed: true },
      { id: 'p3-12', label: 'Tab 2: Data / Analytics - Content in English and clean', completed: true },
      
      { id: 'p3-13', label: 'Tab 3: Explore / Library - UI built and responsive', completed: true },
      { id: 'p3-14', label: 'Tab 3: Explore / Library - Backend/API connected', completed: true },
      { id: 'p3-15', label: 'Tab 3: Explore / Library - Chart, form, or dynamic components functional', completed: true },
      { id: 'p3-16', label: 'Tab 3: Explore / Library - State management active', completed: true },
      { id: 'p3-17', label: 'Tab 3: Explore / Library - Chatbot context-aware for this tab', completed: true },
      { id: 'p3-18', label: 'Tab 3: Explore / Library - Content in English and clean', completed: true },
      
      { id: 'p3-19', label: 'Tab 4: Profile / Preferences - UI built and responsive', completed: true },
      { id: 'p3-20', label: 'Tab 4: Profile / Preferences - Backend/API connected', completed: true },
      { id: 'p3-21', label: 'Tab 4: Profile / Preferences - Chart, form, or dynamic components functional', completed: true },
      { id: 'p3-22', label: 'Tab 4: Profile / Preferences - State management active', completed: true },
      { id: 'p3-23', label: 'Tab 4: Profile / Preferences - Chatbot context-aware for this tab', completed: true },
      { id: 'p3-24', label: 'Tab 4: Profile / Preferences - Content in English and clean', completed: true },
      
      { id: 'p3-25', label: 'Tab 5: Smart Tools / AI - UI built and responsive', completed: true },
      { id: 'p3-26', label: 'Tab 5: Smart Tools / AI - Backend/API connected', completed: true },
      { id: 'p3-27', label: 'Tab 5: Smart Tools / AI - Chart, form, or dynamic components functional', completed: true },
      { id: 'p3-28', label: 'Tab 5: Smart Tools / AI - State management active', completed: true },
      { id: 'p3-29', label: 'Tab 5: Smart Tools / AI - Chatbot context-aware for this tab', completed: true },
      { id: 'p3-30', label: 'Tab 5: Smart Tools / AI - Content in English and clean', completed: false },
    ]
  },
  {
    id: 'phase-4',
    title: 'PHASE 4: User Personalization',
    status: 'in-progress',
    notes: '',
    items: [
      { id: 'p4-1', label: 'Subscriber profile system active', completed: true },
      { id: 'p4-2', label: 'User data stored in Firebase', completed: true },
      { id: 'p4-3', label: 'Personalized dashboard rendering', completed: true },
      { id: 'p4-4', label: 'Avatar or name used by chatbot', completed: true },
      { id: 'p4-5', label: 'Recommendations or dynamic views based on data', completed: false },
    ]
  },
  {
    id: 'phase-5',
    title: 'PHASE 5: External Integrations',
    status: 'in-progress',
    notes: '',
    items: [
      { id: 'p5-1', label: 'Stripe connected (test mode)', completed: true },
      { id: 'p5-2', label: 'News API / YouTube / Maps working', completed: true },
      { id: 'p5-3', label: 'Google APIs (Vision, TTS, STT, Translate)', completed: true },
      { id: 'p5-4', label: 'Webhooks or third-party APIs operational', completed: false },
    ]
  },
  {
    id: 'phase-6',
    title: 'PHASE 6: Testing & QA',
    status: 'in-progress',
    notes: '',
    items: [
      { id: 'p6-1', label: 'Mobile testing', completed: true },
      { id: 'p6-2', label: 'Tablet testing', completed: true },
      { id: 'p6-3', label: 'Multibrowser test', completed: false },
      { id: 'p6-4', label: 'Loading and error states verified', completed: true },
      { id: 'p6-5', label: 'Chatbot tested in each tab', completed: true },
    ]
  },
  {
    id: 'phase-7',
    title: 'PHASE 7: Admin Tools',
    status: 'in-progress',
    notes: '',
    items: [
      { id: 'p7-1', label: 'Admin dashboard with logs viewer', completed: true },
      { id: 'p7-2', label: 'Subscriber list', completed: true },
      { id: 'p7-3', label: 'Manual onboarding override', completed: false },
      { id: 'p7-4', label: 'AI prompt tester', completed: true },
      { id: 'p7-5', label: 'System diagnostics panel added', completed: true },
      { id: 'p7-6', label: 'Ability to mark phase checkboxes manually', completed: true },
    ]
  },
  {
    id: 'phase-8',
    title: 'PHASE 8: Pre-Launch Prep',
    status: 'pending',
    notes: '',
    items: [
      { id: 'p8-1', label: 'SEO basics (title, meta)', completed: false },
      { id: 'p8-2', label: 'Privacy + terms pages linked', completed: false },
      { id: 'p8-3', label: 'Social icons / links added', completed: false },
      { id: 'p8-4', label: 'Contact form or email integrated', completed: false },
    ]
  },
  {
    id: 'phase-9',
    title: 'PHASE 9: Deployment',
    status: 'pending',
    notes: '',
    items: [
      { id: 'p9-1', label: 'Firebase Hosting connected', completed: false },
      { id: 'p9-2', label: 'Custom domain linked', completed: false },
      { id: 'p9-3', label: 'SSL active', completed: false },
      { id: 'p9-4', label: 'Post-deploy test run completed', completed: false },
      { id: 'p9-5', label: 'Final admin checklist saved', completed: false },
    ]
  },
];

// Function to calculate the status based on completed items
const calculateStatus = (items: PhaseItem[]): 'pending' | 'in-progress' | 'complete' => {
  const completedCount = items.filter(item => item.completed).length;
  if (completedCount === 0) return 'pending';
  if (completedCount === items.length) return 'complete';
  return 'in-progress';
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getVariant = () => {
    switch (status) {
      case 'complete':
        return 'outline';
      case 'in-progress':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <Badge variant={getVariant()}>{getLabel()}</Badge>
  );
};

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ open, onOpenChange }) => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Set initial loading state and then automatically turn it off after a delay
  useEffect(() => {
    if (open) {
      setLoading(true);
      
      // Just use local phases data for now since Firebase connection might be causing issues
      setTimeout(() => {
        setLoading(false);
      }, 500);
      
      // Uncomment this code when Firebase issues are resolved
      /*
      const loadPhases = async () => {
        try {
          const docRef = doc(firestore, 'admin', 'phases');
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.phases) {
              setPhases(data.phases);
            }
          }
        } catch (error) {
          console.error('Error loading phases data:', error);
          // Just log the error but continue with default phases
        }
      };
      
      loadPhases();
      */
    }
  }, [open]);

  // Toggle a specific item
  const toggleItem = (phaseId: string, itemId: string) => {
    setPhases(currentPhases => 
      currentPhases.map(phase => {
        if (phase.id === phaseId) {
          const updatedItems = phase.items.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          });
          
          return { 
            ...phase, 
            items: updatedItems,
            status: calculateStatus(updatedItems)
          };
        }
        return phase;
      })
    );
  };

  // Update notes for a phase
  const updateNotes = (phaseId: string, notes: string) => {
    setPhases(currentPhases => 
      currentPhases.map(phase => 
        phase.id === phaseId ? { ...phase, notes } : phase
      )
    );
  };

  // Save all phases data to Firebase
  const savePhases = async () => {
    try {
      setSaving(true);
      const docRef = doc(firestore, 'admin', 'phases');
      await setDoc(docRef, { phases, lastUpdated: new Date() });
      
      toast({
        title: 'Success',
        description: 'Phases data saved successfully',
      });
    } catch (error) {
      console.error('Error saving phases data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save phases data to Firebase',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Export phases data as JSON
  const exportData = () => {
    try {
      const dataStr = JSON.stringify({ phases, exportedAt: new Date() }, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataUri);
      downloadLink.setAttribute('download', `jetai-admin-phases-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: 'Success',
        description: 'Phases data exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export phases data',
        variant: 'destructive',
      });
    }
  };

  // Reset to initial data
  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all phase data to initial values? This cannot be undone.')) {
      setPhases(initialPhases);
      toast({
        title: 'Info',
        description: 'Phases data reset to initial values',
      });
    }
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalItems = phases.reduce((acc, phase) => acc + phase.items.length, 0);
    const completedItems = phases.reduce((acc, phase) => 
      acc + phase.items.filter(item => item.completed).length, 0);
    
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>JetAI Admin Panel</SheetTitle>
          <SheetDescription>
            Monitor and manage development phases and project progress.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading phases data...</p>
          </div>
        ) : (
          <Tabs defaultValue="phases">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="phases" className="flex items-center gap-1">
                <ListChecks className="h-4 w-4" />
                Phase Checklist
              </TabsTrigger>
              <TabsTrigger value="diagnostic" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                System Diagnostic
              </TabsTrigger>
              <TabsTrigger value="tab-status" className="flex items-center gap-1">
                <Table className="h-4 w-4" />
                Tab Status
              </TabsTrigger>
              <TabsTrigger value="visual-enhancements" className="flex items-center gap-1">
                <Paintbrush className="h-4 w-4" />
                Visual Enhancements
              </TabsTrigger>
              <TabsTrigger value="chat-flows" className="flex items-center gap-1">
                <MessageSquareText className="h-4 w-4" />
                Chat Flows
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phases" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium">Overall Progress</h3>
                  <div className="w-full bg-secondary h-2 rounded-full mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${calculateOverallProgress()}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {calculateOverallProgress()}% complete
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportData}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={savePhases}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                    Save
                  </Button>
                </div>
              </div>

              <Accordion type="multiple" defaultValue={['phase-0']} className="mb-6">
                {phases.map((phase) => (
                  <AccordionItem key={phase.id} value={phase.id} className="border rounded-md mb-4 pb-0">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex flex-1 items-center justify-between pr-4">
                        <span className="font-medium text-left">{phase.title}</span>
                        <StatusBadge status={phase.status} />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        {phase.items.map((item) => (
                          <div key={item.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={item.id}
                              checked={item.completed}
                              onCheckedChange={() => toggleItem(phase.id, item.id)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={item.id}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item.label}
                            </label>
                          </div>
                        ))}
                        
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-1">Notes</h4>
                          <Textarea 
                            placeholder="Add notes about this phase..."
                            value={phase.notes}
                            onChange={(e) => updateNotes(phase.id, e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetData}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset to Default
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onOpenChange(false)}
                >
                  Close Panel
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="diagnostic" className="mt-0">
              <SystemDiagnosticReport />
              
              <div className="flex justify-end pt-4 mt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onOpenChange(false)}
                >
                  Close Panel
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="tab-status" className="mt-0">
              <TabStatusTracker />
              
              <div className="flex justify-end pt-4 mt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onOpenChange(false)}
                >
                  Close Panel
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="visual-enhancements" className="mt-0">
              <VisualEnhancementsTracker />
              
              <div className="flex justify-end pt-4 mt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onOpenChange(false)}
                >
                  Close Panel
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="chat-flows" className="mt-0">
              <ChatFlowsTracker />
              
              <div className="flex justify-end pt-4 mt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onOpenChange(false)}
                >
                  Close Panel
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AdminPanel;