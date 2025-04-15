// JET AI Service Worker
const CACHE_NAME = 'jetai-cache-v1';
const OFFLINE_URL = '/offline.html';

// Resources to cache
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/icon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/apple-touch-icon.svg',
  '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core app shell');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting on install');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Error during install:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
  // Don't cache API calls, let them go straight to the network
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('[Service Worker] Fetching resource:', event.request.url);
        
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache successful responses for future use
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('[Service Worker] Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // If the request is for a web page (navigate request), show offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other resource types, return a simple error response
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-itineraries') {
    console.log('[Service Worker] Syncing itineraries');
    event.waitUntil(syncItineraries());
  } else if (event.tag === 'sync-bookmarks') {
    console.log('[Service Worker] Syncing bookmarks');
    event.waitUntil(syncBookmarks());
  }
});

// Periodic background sync functionality
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    console.log('[Service Worker] Periodic sync: update-content');
    event.waitUntil(updateContent());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'JET AI Update',
        body: event.data.text()
      };
    }
  }
  
  const title = data.title || 'JET AI Update';
  const options = {
    body: data.body || 'Something new happened!',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/badge-96x96.png'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received');
  
  event.notification.close();
  
  // Open the app when notification is clicked
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Share target handling
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/share-target') && event.request.method === 'POST') {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const title = formData.get('title') || '';
        const text = formData.get('text') || '';
        const url = formData.get('url') || '';
        const photos = formData.getAll('photos') || [];
        
        // Save shared data for later use
        storeSharedData({ title, text, url, photos });
        
        // Redirect to app view that handles shared data
        return Response.redirect('/?handleShare=true', 303);
      })()
    );
  }
});

// Helper functions
async function syncItineraries() {
  try {
    // Get pending itinerary operations from IndexedDB/localStorage
    const pendingItems = JSON.parse(localStorage.getItem('pendingItineraries') || '[]');
    
    if (pendingItems.length === 0) {
      return;
    }
    
    // Process each pending item
    for (const item of pendingItems) {
      await fetch('/api/itineraries/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
    }
    
    // Clear pending items after successful sync
    localStorage.removeItem('pendingItineraries');
  } catch (error) {
    console.error('[Service Worker] Error syncing itineraries:', error);
  }
}

async function syncBookmarks() {
  try {
    // Get pending bookmark operations from IndexedDB/localStorage
    const pendingItems = JSON.parse(localStorage.getItem('pendingBookmarks') || '[]');
    
    if (pendingItems.length === 0) {
      return;
    }
    
    // Process each pending item
    for (const item of pendingItems) {
      await fetch('/api/bookmarks/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
    }
    
    // Clear pending items after successful sync
    localStorage.removeItem('pendingBookmarks');
  } catch (error) {
    console.error('[Service Worker] Error syncing bookmarks:', error);
  }
}

async function updateContent() {
  try {
    // Fetch latest data from API endpoints
    const response = await fetch('/api/content/latest');
    const data = await response.json();
    
    if (data.destinations) {
      // Update cached destinations data
      localStorage.setItem('latestDestinations', JSON.stringify(data.destinations));
    }
    
    if (data.blogPosts) {
      // Update cached blog posts
      localStorage.setItem('latestBlogPosts', JSON.stringify(data.blogPosts));
    }
    
    // Notify the app about updated content if it's open
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CONTENT_UPDATED',
        timestamp: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('[Service Worker] Error updating content:', error);
  }
}

function storeSharedData(data) {
  localStorage.setItem('sharedData', JSON.stringify({
    ...data,
    timestamp: Date.now()
  }));
}