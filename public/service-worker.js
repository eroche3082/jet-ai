// JET AI - Main Service Worker
// This service worker provides complete offline functionality
// with precaching of important assets and route-based strategies

// Configuration
const APP_VERSION = '1.0.0';
const CACHE_PREFIX = 'jetai-cache';
const STATIC_CACHE_NAME = `${CACHE_PREFIX}-static-v${APP_VERSION}`;
const DYNAMIC_CACHE_NAME = `${CACHE_PREFIX}-dynamic-v${APP_VERSION}`;
const IMAGES_CACHE_NAME = `${CACHE_PREFIX}-images-v${APP_VERSION}`;
const API_CACHE_NAME = `${CACHE_PREFIX}-api-v${APP_VERSION}`;

// Assets to precache (critical resources)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/icon.svg',
  '/icons/apple-touch-icon.svg',
  '/manifest.json'
];

// Cache size limits
const DYNAMIC_CACHE_LIMIT = 50;
const IMAGES_CACHE_LIMIT = 60;

// API endpoints for specific caching strategies
const API_ENDPOINTS = [
  { url: '/api/destinations', cacheName: API_CACHE_NAME, strategy: 'network-first', maxAge: 60 * 60 }, // 1 hour
  { url: '/api/featured', cacheName: API_CACHE_NAME, strategy: 'network-first', maxAge: 60 * 60 }, // 1 hour
  { url: '/api/user/profile', cacheName: API_CACHE_NAME, strategy: 'network-only' } // Always fetch from network
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing');
  
  // Skip waiting to activate this service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching resources');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch((error) => {
        console.error('[Service Worker] Precache error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating');
  
  // Get all cache names that start with 'jetai-cache'
  const cacheKeepList = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGES_CACHE_NAME, API_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && !cacheKeepList.includes(cacheName))
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip browser extension requests
  if (event.request.url.includes('chrome-extension://')) {
    return;
  }
  
  // Skip WebSocket connections
  if (event.request.headers.get('upgrade') === 'websocket') {
    return;
  }
  
  // Skip Vite HMR requests in development
  if (event.request.url.includes('/@vite/client') || 
      event.request.url.includes('/@react-refresh') ||
      event.request.url.includes('/node_modules/.vite/')) {
    return;
  }
  
  // Handle API requests
  if (event.request.url.includes('/api/')) {
    // Find matching API endpoint configuration
    const apiEndpoint = API_ENDPOINTS.find(endpoint => 
      event.request.url.includes(endpoint.url)
    );
    
    if (apiEndpoint) {
      // Apply the appropriate caching strategy
      if (apiEndpoint.strategy === 'network-only') {
        event.respondWith(
          fetch(event.request)
            .catch(() => {
              return caches.match('/offline.html');
            })
        );
        return;
      }
      
      if (apiEndpoint.strategy === 'network-first') {
        event.respondWith(
          fetch(event.request)
            .then((response) => {
              const clonedResponse = response.clone();
              caches.open(apiEndpoint.cacheName).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
              return response;
            })
            .catch(() => {
              return caches.match(event.request);
            })
        );
        return;
      }
    }
  }
  
  // Handle image requests
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise, fetch from network
          return fetch(event.request)
            .then((networkResponse) => {
              // Clone the response before caching it
              const clonedResponse = networkResponse.clone();
              
              // Cache the fetched response
              caches.open(IMAGES_CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, clonedResponse);
                  
                  // Limit cache size
                  limitCacheSize(IMAGES_CACHE_NAME, IMAGES_CACHE_LIMIT);
                });
              
              return networkResponse;
            })
            .catch(() => {
              // If image can't be fetched, return a placeholder or offline image
              // For now, just return null which will show as a broken image
              return null;
            });
        })
    );
    return;
  }
  
  // Handle navigation requests (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If the main document can't be fetched, return the cached offline page
          return caches.match('/offline.html');
        })
    );
    return;
  }
  
  // Handle all other requests with a stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response and update cache in background
        if (cachedResponse) {
          // Update cache in background
          fetch(event.request)
            .then((networkResponse) => {
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                  limitCacheSize(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
                });
            })
            .catch(() => {
              // Network failed, but we already returned the cached response so it's ok
            });
          
          return cachedResponse;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the response for future use
            const clonedResponse = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, clonedResponse);
                limitCacheSize(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // For non-HTML requests that fail and aren't in cache, we don't have a fallback
            return null;
          });
      })
  );
});

// Limit the size of a cache
function limitCacheSize(cacheName, maxItems) {
  caches.open(cacheName)
    .then((cache) => {
      cache.keys()
        .then((keys) => {
          if (keys.length > maxItems) {
            // Delete the oldest items to bring the total down to the limit
            const itemsToDelete = keys.length - maxItems;
            for (let i = 0; i < itemsToDelete; i++) {
              cache.delete(keys[i]);
            }
          }
        });
    });
}

// Background sync event handler
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-posts') {
    console.log('[Service Worker] Syncing new posts');
    event.waitUntil(syncNewPosts());
  }
  
  if (event.tag === 'sync-offline-favorites') {
    console.log('[Service Worker] Syncing offline favorites');
    event.waitUntil(syncOfflineFavorites());
  }
});

// Dummy function for demo purposes
function syncNewPosts() {
  // In a real app, this would get data from IndexedDB and send to server
  return Promise.resolve();
}

// Dummy function for demo purposes
function syncOfflineFavorites() {
  // In a real app, this would get data from IndexedDB and send to server
  return Promise.resolve();
}

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'JET AI Notification',
        body: event.data.text(),
        icon: '/icons/icon.svg'
      };
    }
  }
  
  const options = {
    body: data.body || 'Something new happened!',
    icon: data.icon || '/icons/icon.svg',
    badge: '/icons/badge-96x96.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'JET AI', options)
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  const url = event.notification.data.url || '/';
  event.notification.close();
  
  // Open the target URL in a new window/tab
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there is already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open with the URL, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});