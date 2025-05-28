const CACHE_NAME = 'daily-planner-cache-v1';
// Add core assets that make up the app shell.
// '/index.tsx' is the main script loaded via module type.
// Fonts and external libraries (Tailwind, React via ESM.sh) are typically handled by browser HTTP cache or CDN.
const urlsToCache = [
  '/', // Represents index.html at the root
  '/index.html',
  '/index.tsx',
  '/manifest.json' // Added manifest for better offline capability
  // IMPORTANT: If you create the icon files as specified in manifest.json (e.g., /icons/icon-192x192.png), 
  // consider adding their paths here for complete offline access to the app shell.
  // For example:
  // '/icons/icon-192x192.png',
  // '/icons/icon-512x512.png' 
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache app shell during install:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensures the activated service worker takes control immediately
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https schemes
  if (event.request.method !== 'GET' ||
      !(event.request.url.startsWith('http:') || event.request.url.startsWith('https:'))) {
    // For non-GET requests or other schemes (e.g., chrome-extension://), do nothing and let the browser handle it.
    return;
  }

  // Strategy: Network falling back to cache for navigation requests (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If network fetch is successful, return it
          return response;
        })
        .catch(() => {
          // If network fetch fails (offline), try to serve index.html from cache
          console.log('Network fetch failed for navigation, serving index.html from cache.');
          return caches.match('/'); // Or '/index.html'
        })
    );
    return;
  }

  // Strategy: Cache first, then network for other assets (JS, potentially CSS if local, images if local)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // Serve from cache
          return response;
        }
        // Not in cache, fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Optionally, cache the newly fetched resource if it's one of our app's assets
            // This check ensures we only cache our own assets, not all third-party responses.
            // Check if the request URL's pathname is in our list of cachable URLs
            const requestPath = new URL(event.request.url).pathname;
            // For root path, urlsToCache might contain '/' but request.url might be '/index.html' or vice-versa.
            // So, a simple includes check might not be enough if server serves index.html for '/'.
            // For simplicity here, we stick to the urlsToCache list.
            if (networkResponse && networkResponse.status === 200 && urlsToCache.includes(requestPath)) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetch failed for resource:', event.request.url, error);
          // Optionally return a fallback response for specific asset types, e.g., a placeholder image.
          // For now, just let the browser handle the failed fetch.
        });
      })
  );
});