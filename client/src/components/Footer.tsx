import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Settings, Shield, Mail, Github, Twitter, Facebook } from 'lucide-react';
import AdminPanel from './AdminPanel';

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
      
      {/* Admin Panel */}
      <AdminPanel open={adminPanelOpen} onOpenChange={setAdminPanelOpen} />
    </>
  );
};

export default Footer;