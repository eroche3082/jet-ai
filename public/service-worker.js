// JetAI Service Worker
// Version 1.0.0

const CACHE_NAME = 'jetai-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Resources to pre-cache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/embed.js',
  '/assets/logo.svg',
  '/assets/chat-icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - pre-cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin and API requests
  if (
    !event.request.url.startsWith(self.location.origin) || 
    event.request.url.includes('/api/')
  ) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // When network fails, serve the offline page for HTML requests
          if (event.request.headers.get('Accept').includes('text/html')) {
            return caches.match(OFFLINE_PAGE);
          }
        });
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }
  
  const data = event.data?.json() ?? {};
  const title = data.title || 'JetAI Update';
  const options = {
    body: data.body || 'Something new in JetAI!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((windowClients) => {
        // Check if there is already a window focused
        const existingClient = windowClients.find(client => 
          client.url === urlToOpen && 'focus' in client
        );
        
        if (existingClient) {
          return existingClient.focus();
        }
        
        // If there's no existing window, open a new one
        return clients.openWindow(urlToOpen);
      })
  );
});

// Track dynamic affiliate visits
self.addEventListener('message', (event) => {
  // Handle messages from the main thread
  if (event.data && event.data.type === 'TRACK_AFFILIATE') {
    const affiliateId = event.data.affiliateId;
    // This would store the affiliate ID in IndexedDB for tracking
    // In a real implementation, we'd do more here
    console.log('Tracking affiliate visit:', affiliateId);
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-itineraries') {
    event.waitUntil(syncItineraries());
  } else if (event.tag === 'sync-bookmarks') {
    event.waitUntil(syncBookmarks());
  }
});

// Sync functions (placeholders)
async function syncItineraries() {
  // Would implement background sync logic here
  console.log('Syncing itineraries in the background');
}

async function syncBookmarks() {
  // Would implement bookmark sync logic here
  console.log('Syncing bookmarks in the background');
}

// Periodic sync for content updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Content update function (placeholder)
async function updateContent() {
  // Would implement content refresh logic here
  console.log('Performing periodic content update');
}