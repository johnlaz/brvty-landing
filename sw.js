const CACHE_NAME = 'brvty-v1';
const RUNTIME_CACHE = 'brvty-runtime-v1';
const CRITICAL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css',
  '/script.js'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CRITICAL_URLS);
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME && name !== RUNTIME_CACHE) {
            return caches.delete(name);
          }
        })
      );
      self.clients.claim();
    })()
  );
});

// Fetch event - network-first for API, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls - network first with fallback
  if (url.pathname.includes('/api/') || 
      url.hostname !== self.location.hostname ||
      request.url.includes('googleapis') ||
      request.url.includes('openai')) {
    return event.respondWith(networkFirst(request));
  }

  // Static assets - cache first
  if (shouldCache(request)) {
    return event.respondWith(cacheFirst(request));
  }

  // HTML - network first
  if (request.destination === 'document') {
    return event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const runtime = await caches.open(RUNTIME_CACHE);
      runtime.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline - resource not cached', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const runtime = await caches.open(RUNTIME_CACHE);
      runtime.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Network unavailable', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

function shouldCache(request) {
  const { destination, url } = request;
  return (
    destination === 'style' ||
    destination === 'script' ||
    destination === 'image' ||
    destination === 'font' ||
    url.includes('.woff') ||
    url.includes('.woff2')
  );
}

// Message from client - cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    })();
  }
});
