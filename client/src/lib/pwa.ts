/**
 * PWA utilities for JetAI
 * Handles service worker registration, offline capabilities, and mobile features
 */

/**
 * Register the service worker for PWA capabilities
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered with scope:', registration.scope);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    });
  }
  return null;
}

/**
 * Check if the app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function initializeConnectivityListeners(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Cache key API responses for offline use
 */
export async function cacheApiResponse(url: string, response: any): Promise<void> {
  try {
    localStorage.setItem(`jetai_cache_${url}`, JSON.stringify({
      data: response,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching API response:', error);
  }
}

/**
 * Get cached API response
 */
export function getCachedApiResponse(url: string, maxAgeMs: number = 3600000): any {
  try {
    const cached = localStorage.getItem(`jetai_cache_${url}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age > maxAgeMs) {
      // Cache is too old
      localStorage.removeItem(`jetai_cache_${url}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error retrieving cached API response:', error);
    return null;
  }
}

/**
 * Check if app has been installed (PWA)
 */
export function isPWAInstalled(): boolean {
  // Check if the display mode is standalone (PWA)
  return window.matchMedia('(display-mode: standalone)').matches || 
         // @ts-ignore: Property 'standalone' exists on iOS Safari navigator
         (window.navigator.standalone === true);
}

/**
 * Main PWA initialization function
 */
export function initializePWA() {
  // Register service worker
  const swRegistration = registerServiceWorker();
  
  // Set up online/offline detection
  const cleanup = initializeConnectivityListeners(
    () => {
      console.log('App is online');
      document.body.classList.remove('offline-mode');
      // Sync any pending operations
      syncOfflineData();
    },
    () => {
      console.log('App is offline');
      document.body.classList.add('offline-mode');
      // Show offline notification
      showOfflineNotification();
    }
  );
  
  // Check initial network state
  if (!isOnline()) {
    document.body.classList.add('offline-mode');
    showOfflineNotification();
  }
  
  // Register for background sync
  registerForBackgroundSync();
  
  // Initialize for sharing capabilities
  initializeWebShareFeatures();
  
  // Set up periodic sync for content
  registerPeriodicSync();
  
  return cleanup;
}

/**
 * Show notification when app goes offline
 */
function showOfflineNotification() {
  // Implementation depends on UI library
  console.log('JetAI is running in offline mode. Some features may be limited.');
}

/**
 * Sync data stored while offline
 */
async function syncOfflineData() {
  const pendingOperations = localStorage.getItem('jetai_pending_operations');
  
  if (pendingOperations) {
    try {
      const operations = JSON.parse(pendingOperations);
      // Process operations...
      
      localStorage.removeItem('jetai_pending_operations');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }
}

/**
 * Register for background sync API
 * Note: This is a newer API and may not be available in all browsers
 */
async function registerForBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // @ts-ignore: Background sync is still experimental
      if (registration.sync) {
        // Register for various sync tasks
        // @ts-ignore: Background sync is still experimental
        await registration.sync.register('sync-itineraries');
        // @ts-ignore: Background sync is still experimental
        await registration.sync.register('sync-bookmarks');
      }
    } catch (error) {
      console.error('Error registering for background sync:', error);
    }
  }
}

/**
 * Initialize Web Share API features
 */
function initializeWebShareFeatures() {
  if (navigator.share) {
    // Enhance share buttons with native sharing
    document.querySelectorAll('[data-share]').forEach(element => {
      element.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const el = e.currentTarget as HTMLElement;
        const url = el.getAttribute('data-share-url') || window.location.href;
        const title = el.getAttribute('data-share-title') || document.title;
        const text = el.getAttribute('data-share-text') || '';
        
        try {
          await navigator.share({
            title,
            text,
            url
          });
        } catch (error) {
          console.error('Error sharing content:', error);
        }
      });
    });
  }
}

/**
 * Register for periodic background sync
 * Note: This is a newer API and may not be available in all browsers
 */
async function registerPeriodicSync() {
  if ('serviceWorker' in navigator && 'PeriodicSyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // @ts-ignore: Periodic Sync API is still experimental
      const periodicSyncManager = registration.periodicSync;
      
      if (periodicSyncManager) {
        // Check permission
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync' as PermissionName
        });
        
        if (status.state === 'granted') {
          // @ts-ignore: Periodic Sync API is still experimental
          await periodicSyncManager.register('update-content', {
            minInterval: 24 * 60 * 60 * 1000 // Once per day
          });
        }
      }
    } catch (error) {
      console.error('Error registering for periodic sync:', error);
    }
  }
}

/**
 * Get device orientation
 */
export function getDeviceOrientation(): 'portrait' | 'landscape' {
  return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
}

/**
 * Listen for device orientation changes
 */
export function listenForOrientationChanges(callback: (orientation: 'portrait' | 'landscape') => void) {
  const mediaQuery = window.matchMedia('(orientation: portrait)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'portrait' : 'landscape');
  };
  
  mediaQuery.addEventListener('change', handler);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
}