// JET AI - Service Worker
const CACHE_NAME = 'jetai-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/icon.svg',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.svg',
  '/manifest.json'
];

// Assets that should be cached as they're used
const RUNTIME_ASSETS = [
  /\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/,
  // Add other file extensions as needed
];

// Install event - precache key assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing new service worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete, forcing activation');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new service worker');
  
  const currentCaches = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            console.log('[Service Worker] Deleting old cache:', cacheToDelete);
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Helper function to determine if an asset should be cached at runtime
function shouldCacheAtRuntime(url) {
  const parsedUrl = new URL(url);
  
  // Exclude API requests, analytics, etc.
  if (
    parsedUrl.pathname.startsWith('/api/') ||
    parsedUrl.pathname.includes('google-analytics') ||
    parsedUrl.pathname.includes('analytics') ||
    parsedUrl.pathname.includes('gtag') ||
    parsedUrl.pathname.includes('firebase')
  ) {
    return false;
  }
  
  // Check against the runtime asset patterns
  return RUNTIME_ASSETS.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(parsedUrl.pathname);
    }
    return parsedUrl.pathname === pattern;
  });
}

// Fetch event - network first with cache fallback strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin and API requests
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('/api/')) {
    return;
  }

  // Handle navigation requests with a network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('[Service Worker] Navigation fetch failed, serving offline page');
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For non-navigation requests, use a stale-while-revalidate approach
  if (shouldCacheAtRuntime(event.request.url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Cache the updated version in the background
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((error) => {
              console.log('[Service Worker] Fetch failed:', error);
              // Return nothing so we fall back to the cached version
            });
            
          // Return the cached version first (or wait for the network if no cached version)
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});

// Background sync event to handle offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'jetai-offline-data') {
    console.log('[Service Worker] Background sync triggered');
    event.waitUntil(syncOfflineData());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');

  let title = 'JET AI Update';
  let options = {
    body: 'New travel information is available',
    icon: '/icons/icon-512x512.png',
    badge: '/icons/badge-96x96.png'
  };

  // Try to extract details from the push message
  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      
      // Merge options with any provided in the notification
      options = {
        ...options,
        ...data.options
      };
    } catch (e) {
      console.error('[Service Worker] Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received');

  event.notification.close();

  // Default URL to open
  let url = '/';

  // Check if there's a specific URL to navigate to
  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Function to handle syncing offline data
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB
    const offlineData = await getOfflineData();
    
    // No offline data to sync
    if (!offlineData || offlineData.length === 0) {
      return;
    }
    
    // Process each offline item
    const syncPromises = offlineData.map(async (item) => {
      try {
        const response = await fetch(item.url, {
          method: item.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item.data),
        });
        
        if (response.ok) {
          // Successfully synced this item, remove it
          await removeOfflineItem(item.id);
          return true;
        }
        return false;
      } catch (error) {
        console.error('[Service Worker] Error syncing item:', error);
        return false;
      }
    });
    
    // Wait for all sync attempts to complete
    await Promise.all(syncPromises);
    
    // Notify the user if sync was successful
    self.registration.showNotification('JET AI Sync Complete', {
      body: 'Your offline changes have been synchronized',
      icon: '/icons/icon-512x512.png',
    });
    
  } catch (error) {
    console.error('[Service Worker] Sync error:', error);
  }
}

// These functions would be implemented using IndexedDB
// They are stubbed here for the example
async function getOfflineData() {
  // This would retrieve data from IndexedDB
  // Return empty array for now
  return [];
}

async function removeOfflineItem(id) {
  // This would remove a synced item from IndexedDB
  console.log('[Service Worker] Removing synced item with ID:', id);
}