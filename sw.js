const CACHE_NAME = 'brvty-v1';
const RUNTIME_CACHE = 'brvty-runtime-v1';
const CRITICAL_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CRITICAL_URLS.filter(url => url !== '/' && url !== '/index.html'));
        // Don't cache / and /index.html as they change frequently
      } catch (e) {
        console.log('Cache install error:', e);
      }
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

// Fetch event - network-first for HTML/API, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip localhost and chrome extensions
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.protocol === 'chrome-extension:') {
    return;
  }

  // API calls and external requests - network first
  if (url.pathname.includes('/api/') || 
      url.hostname !== self.location.hostname ||
      request.url.includes('googleapis') ||
      request.url.includes('openai') ||
      request.url.includes('gemini') ||
      request.url.includes('groq')) {
    return event.respondWith(networkFirst(request));
  }

  // Static assets (CSS, JS, images, fonts) - cache first
  if (shouldCache(request)) {
    return event.respondWith(cacheFirst(request));
  }

  // HTML and documents - network first
  if (request.destination === 'document') {
    return event.respondWith(networkFirst(request));
  }

  // Default: network first
  return event.respondWith(networkFirst(request));
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
    url.includes('.woff2') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('.jpeg') ||
    url.includes('.gif')
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
