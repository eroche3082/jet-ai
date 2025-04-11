/**
 * JetAI PWA Utilities
 * 
 * This module handles Progressive Web App functionality
 * including service worker registration and updates.
 */

import { getAffiliateId } from '@/lib/utils';

// Register service worker
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  console.log('New service worker available');
                  // Notify the user about the update if needed
                  showUpdateNotification();
                }
              });
            }
          });
          
          // Track affiliate information if present
          const affiliateId = getAffiliateId();
          if (affiliateId) {
            trackAffiliateVisit(affiliateId);
          }
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
    
    // Handle controller change (service worker update)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker updated and activated');
    });
  }
}

// Check if the app was installed (for analytics)
export function trackAppInstalled(): void {
  window.addEventListener('appinstalled', (event) => {
    // Log the installation event
    console.log('JetAI was installed as a PWA');
    
    // In a real app, we would send this to an analytics service
    try {
      // This is a placeholder for actual analytics tracking
      const installData = {
        timestamp: new Date().toISOString(),
        platform: navigator.platform,
        referrer: document.referrer,
        affiliateId: getAffiliateId()
      };
      
      console.log('Installation data:', installData);
      
      // Would typically call an API endpoint here:
      // fetch('/api/analytics/app-installed', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(installData)
      // });
    } catch (error) {
      console.error('Failed to track PWA installation:', error);
    }
  });
}

// Track affiliate visit through service worker
function trackAffiliateVisit(affiliateId: string): void {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'TRACK_AFFILIATE',
      affiliateId
    });
  }
}

// Show notification when a service worker update is available
function showUpdateNotification(): void {
  // This could be implemented with a UI notification
  console.log('A new version of JetAI is available. Refresh to update.');
  
  // In a real app, we would show a toast or modal:
  // toast({
  //   title: "Update Available",
  //   description: "A new version of JetAI is available. Refresh to update.",
  //   action: <ToastAction altText="Refresh" onClick={() => window.location.reload()}>
  //     Refresh
  //   </ToastAction>,
  // })
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

// Setup background sync for offline functionality
export async function setupBackgroundSync(): Promise<void> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Register sync for itineraries
      await registration.sync.register('sync-itineraries');
      console.log('Background sync registered for itineraries');
      
      // Register sync for bookmarks
      await registration.sync.register('sync-bookmarks');
      console.log('Background sync registered for bookmarks');
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  } else {
    console.log('Background sync not supported');
  }
}

// Setup periodic content updates
export async function setupPeriodicSync(): Promise<void> {
  if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const periodicSync = registration.periodicSync;
      
      // Check if permission is granted
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as any
      });
      
      if (status.state === 'granted') {
        // Register periodic sync
        await periodicSync.register('update-content', {
          minInterval: 24 * 60 * 60 * 1000 // Once per day (in ms)
        });
        console.log('Periodic background sync registered');
      }
    } catch (error) {
      console.error('Periodic background sync registration failed:', error);
    }
  } else {
    console.log('Periodic background sync not supported');
  }
}

// Initialize all PWA features
export function initializePWA(): void {
  registerServiceWorker();
  trackAppInstalled();
  
  // Initialize these features on user interaction
  // Not calling immediately as they require user interaction
  // requestNotificationPermission();
  // setupBackgroundSync();
  // setupPeriodicSync();
}