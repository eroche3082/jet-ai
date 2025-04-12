import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

interface ExpenseAnimationProps {
  amount: number;
  currency: string;
  category?: string;
  onComplete?: () => void;
}

const ExpenseAnimation: React.FC<ExpenseAnimationProps> = ({ 
  amount, 
  currency, 
  category,
  onComplete 
}) => {
  const [stage, setStage] = useState<'adding' | 'converting' | 'complete' | 'hidden'>('adding');
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStage('converting'), 1000);
    const timer2 = setTimeout(() => setStage('complete'), 2000);
    const timer3 = setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);
  
  return (
    <AnimatePresence mode="wait">
      {stage !== 'hidden' && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card p-8 rounded-lg shadow-lg w-80"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          >
            {stage === 'adding' && (
              <motion.div 
                className="flex flex-col items-center justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 1.5
                  }}
                >
                  <DollarSign className="w-8 h-8" />
                </motion.div>
                <h3 className="text-lg font-semibold">Adding Expense</h3>
                <p className="text-center text-muted-foreground text-sm">
                  {formatCurrency(amount, currency)}
                  {category && ` • ${category}`}
                </p>
              </motion.div>
            )}
            
            {stage === 'converting' && (
              <motion.div 
                className="flex flex-col items-center justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                >
                  <motion.div 
                    animate={{ 
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 1,
                      ease: "easeInOut"
                    }}
                  >
                    <TrendingUp className="w-8 h-8" />
                  </motion.div>
                </motion.div>
                <h3 className="text-lg font-semibold">Converting Currency</h3>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <span>{currency}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>USD</span>
                </div>
              </motion.div>
            )}
            
            {stage === 'complete' && (
              <motion.div 
                className="flex flex-col items-center justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                >
                  <Check className="w-8 h-8" />
                </motion.div>
                <h3 className="text-lg font-semibold">Expense Added</h3>
                <p className="text-center text-muted-foreground text-sm">
                  Your travel wallet has been updated
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default ExpenseAnimation;