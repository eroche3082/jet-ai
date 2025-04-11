import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AIChat from '@/components/AIChat';

const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Prevent scrolling when chat is open
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
  
  const handleOpen = () => {
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full"
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
      
      {/* Full-screen chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <AIChat isOpen={isOpen} onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;