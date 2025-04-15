/**
 * JET AI PWA Utility Functions
 * 
 * This file contains utility functions for working with PWA (Progressive Web App) functionality,
 * including service worker registration, installation prompts, and offline detection.
 */

// Check if the app is running as a PWA
export function isPWAInstalled(): boolean {
  // Check if the display mode is standalone (PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // @ts-ignore - Property standalone exists on iOS Safari
  const isFromHomeScreen = window.navigator.standalone; 
  
  // Also check URL params in case we want to test PWA mode
  const urlParams = new URLSearchParams(window.location.search);
  const forcePWA = urlParams.get('pwa') === 'true';
  
  return isStandalone || isFromHomeScreen || forcePWA;
}

// Register the service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      
      // Fallback registration attempt with a simple cache-only service worker
      try {
        const fallbackRegistration = await navigator.serviceWorker.register('/sw-fallback.js', {
          scope: '/'
        });
        console.log('Fallback Service Worker registered:', fallbackRegistration.scope);
        return fallbackRegistration;
      } catch (fallbackError) {
        console.error('Service Worker fallback registration also failed:', fallbackError);
        return null;
      }
    }
  }
  
  console.warn('Service Worker is not supported in this browser');
  return null;
}

// Check for updates to the service worker
export async function checkForServiceWorkerUpdates(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update().catch(error => {
        console.error('Error updating Service Worker:', error);
      });
    }
  }
}

// Listen for service worker updates and notify the user
export function listenForServiceWorkerUpdates(callback: () => void): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      callback();
    });
  }
}

// Show an install prompt for the PWA (stores the deferredPrompt)
let deferredPrompt: any = null;

export function initInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Store the event so it can be triggered later
    deferredPrompt = e;
    
    // Update UI notify the user they can install the PWA
    console.log('App can be installed, showing install button');
    
    // Optionally, dispatch an event to notify components that can show an install button
    window.dispatchEvent(new CustomEvent('pwaInstallable'));
  });
  
  // When the app is successfully installed
  window.addEventListener('appinstalled', () => {
    // Log installation to analytics
    console.log('PWA was installed');
    
    // Clear the deferredPrompt variable
    deferredPrompt = null;
    
    // Dispatch an event to update UI
    window.dispatchEvent(new CustomEvent('pwaInstalled'));
  });
}

// Show the install prompt (this should be called from a user interaction, like a button click)
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('Installation prompt not available');
    return false;
  }
  
  // Show the prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const choiceResult = await deferredPrompt.userChoice;
  
  // Reset the deferred prompt variable
  deferredPrompt = null;
  
  // Return true if the user accepted the installation
  return choiceResult.outcome === 'accepted';
}

// Function to request background sync
export async function requestBackgroundSync(tag: string): Promise<boolean> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log(`Background sync registered for ${tag}`);
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  }
  console.warn('Background sync is not supported in this browser');
  return false;
}

// Function to request periodic background sync
export async function requestPeriodicBackgroundSync(tag: string, minInterval: number): Promise<boolean> {
  if ('serviceWorker' in navigator && 'periodicSync' in (navigator as any).serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const periodicSync = (registration as any).periodicSync;
      
      // Check permission
      const status = await periodicSync.permissionState();
      if (status !== 'granted') {
        console.warn('Periodic Sync permission not granted');
        return false;
      }
      
      // Register periodic sync
      await periodicSync.register(tag, {
        minInterval: minInterval // minimum interval in milliseconds
      });
      
      console.log(`Periodic background sync registered for ${tag}`);
      return true;
    } catch (error) {
      console.error('Periodic background sync registration failed:', error);
      return false;
    }
  }
  
  console.warn('Periodic background sync is not supported in this browser');
  return false;
}

// Function to monitor network status
export function initNetworkStatusMonitoring(
  onlineCallback: () => void,
  offlineCallback: () => void
): () => void {
  const handleOnline = () => {
    console.log('App is online');
    onlineCallback();
  };
  
  const handleOffline = () => {
    console.log('App is offline');
    offlineCallback();
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Initial check
  if (navigator.onLine) {
    onlineCallback();
  } else {
    offlineCallback();
  }
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

// Function to send a notification
export async function sendNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }
  
  // Set default options
  const defaultOptions: NotificationOptions = {
    badge: '/icons/badge-96x96.png',
    icon: '/icons/icon-192x192.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Check permission
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, mergedOptions);
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  } else if (Notification.permission !== 'denied') {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        const notification = new Notification(title, mergedOptions);
        return true;
      } catch (error) {
        console.error('Error creating notification after permission granted:', error);
        return false;
      }
    }
  }
  
  return false;
}

// Function to check if app is still using latest version
export async function checkAppVersion(currentVersion: string): Promise<boolean> {
  try {
    const response = await fetch('/api/app-version');
    if (!response.ok) {
      return true; // Assume current version is latest if fetch fails
    }
    
    const data = await response.json();
    const latestVersion = data.version;
    
    return currentVersion === latestVersion;
  } catch (error) {
    console.error('Error checking app version:', error);
    return true; // Assume current version is latest if fetch fails
  }
}

// Function to set CSS env variables based on device
export function setupSafeAreaVariables(): void {
  if (typeof window !== 'undefined' && 'CSS' in window && CSS.supports('padding-top: env(safe-area-inset-top)')) {
    // Read the values
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
  }
}