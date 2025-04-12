import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FileText, ListChecks, Loader2, Shield, Mail, Github, Twitter, Facebook } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SystemDiagnosticReport from './SystemDiagnosticReport';

const Footer: React.FC = () => {
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-muted/40 border-t border-border/40 py-4 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="font-bold text-primary">JetAI</span>
            <span className="text-xs text-muted-foreground ml-2">© {currentYear} All rights reserved</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-0">
            <Link href="/about">
              <Button variant="link" size="sm" className="text-xs h-8">
                About
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="link" size="sm" className="text-xs h-8">
                Privacy
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="link" size="sm" className="text-xs h-8">
                Terms
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="link" size="sm" className="text-xs h-8">
                Contact
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
              </Button>
            </a>
            <a href="mailto:support@jetai.app" aria-label="Email">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="h-4 w-4" />
              </Button>
            </a>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => setAdminPanelOpen(true)}
              aria-label="Admin Panel"
            >
              <Shield className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
      
      {/* Simplified Admin Panel (direct inline implementation) */}
      <Sheet open={adminPanelOpen} onOpenChange={setAdminPanelOpen}>
        <SheetContent side="left" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>JetAI Admin Panel</SheetTitle>
            <SheetDescription>
              Monitor and manage development phases and project progress.
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="diagnostic">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phases" className="flex items-center gap-1">
                <ListChecks className="h-4 w-4" />
                Phase Checklist
              </TabsTrigger>
              <TabsTrigger value="diagnostic" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                System Diagnostic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phases" className="mt-0">
              <div className="p-6 text-center">
                <p className="text-muted-foreground mb-4">Coming soon: Phase progress tracking</p>
                <p className="text-sm">This feature is currently being migrated to a new storage system.</p>
              </div>
            </TabsContent>

            <TabsContent value="diagnostic" className="mt-0">
              <SystemDiagnosticReport />
              
              <div className="flex justify-end pt-4 mt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setAdminPanelOpen(false)}
                >
                  Close Panel
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Footer;