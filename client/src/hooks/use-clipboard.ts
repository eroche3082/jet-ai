import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * A hook to copy text to clipboard
 * @returns Object with copy function and copied state
 */
export function useClipboard(): UseClipboardReturn {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the provided text to clipboard
   * @param text - The text to copy
   * @returns Promise resolving to true if copy was successful
   */
  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopied(false);
      return false;
    }
  }, []);

  return { copied, copy };
}