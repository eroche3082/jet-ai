import { useState } from 'react';

/**
 * A hook to copy text to clipboard
 * @returns Object with copy function and copied state
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false);
  
  /**
   * Copies the provided text to clipboard
   * @param text - The text to copy
   * @returns Promise resolving to true if copy was successful
   */
  const copy = async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(successful);
        setTimeout(() => setCopied(false), 2000);
        
        return successful;
      } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        setCopied(false);
        return false;
      }
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Could not copy text: ', err);
      setCopied(false);
      return false;
    }
  };
  
  return { copied, copy };
}