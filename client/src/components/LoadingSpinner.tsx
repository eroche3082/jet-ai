import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = '#4a89dc', 
  className = '' 
}: LoadingSpinnerProps) {
  // Determine size class
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  }[size];
  
  return (
    <div 
      className={`animate-spin rounded-full border-t-transparent ${sizeClass} ${className}`} 
      style={{ borderColor: `${color} transparent transparent transparent` }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}