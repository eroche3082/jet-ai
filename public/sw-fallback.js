// JET AI - Fallback Service Worker
// This is a simplified service worker that provides basic offline functionality
// when the main service worker fails to register.

const CACHE_NAME = 'jetai-fallback-cache-v1';
const OFFLINE_URL = '/offline.html';
const ESSENTIAL_ASSETS = [
  '/',
  '/offline.html',
  '/icons/icon.svg',
  '/icons/apple-touch-icon.svg',
  '/manifest.json'
];

// Basic install handler - cache essential files
self.addEventListener('install', (event) => {
  console.log('[Fallback SW] Installing');
  
  // Skip waiting to activate this service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Fallback SW] Caching offline page and essential assets');
        return cache.addAll(ESSENTIAL_ASSETS);
      })
      .catch((error) => {
        console.error('[Fallback SW] Caching error:', error);
      })
  );
});

// Activate handler - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Fallback SW] Activating');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[Fallback SW] Deleting old cache:', cacheName);
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

// Super simple fetch handler - network first with offline fallback for navigation
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle navigation requests specially
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('[Fallback SW] Offline - serving cached offline page');
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // Simple network-first cache for other requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        console.log('[Fallback SW] Fetch failed, trying cache:', event.request.url);
        return caches.match(event.request);
      })
  );
});