// Minimal JET AI Fallback Service Worker 
// This is a simplified service worker that handles basic caching
// It's used as a fallback when the main service worker fails to register

const CACHE_NAME = 'jetai-fallback-cache-v1';
const OFFLINE_URL = '/offline.html';

// Install event - cache basic assets
self.addEventListener('install', (event) => {
  console.log('[Fallback SW] Installing Fallback Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Fallback SW] Caching offline page and core assets');
        return cache.addAll([
          OFFLINE_URL,
          '/icons/icon.svg',
          '/manifest.json'
        ]);
      })
      .then(() => {
        console.log('[Fallback SW] Skip waiting on install');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Fallback SW] Activating Fallback Service Worker');
  return self.clients.claim();
});

// Simplified fetch handler - only serves cached content if fetch fails
self.addEventListener('fetch', (event) => {
  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // If the request is for a page (navigate request), show offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        
        // For other resources, try from cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            // Return cached response or a simple error
            return cachedResponse || new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});