const CACHE_NAME = 'brvty-v6';
const OFFLINE_URL = '/app/offline.html';

const PRECACHE_ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/manifest.json',
  '/app/offline.html',
  '/app/icon-192.png',
  '/app/icon-512.png',
  '/app/icon-180.png',
  '/app/icon-152.png',
  '/app/icon-120.png',
  '/app/icon-76.png',
];

// ── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('BRVTY SW: precache partial failure', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Never intercept: Gemini API, Google Fonts, iTunes, Open Library, CDNs
  if (
    url.includes('googleapis.com') ||
    url.includes('generativelanguage') ||
    url.includes('fonts.google') ||
    url.includes('fonts.gstatic') ||
    url.includes('itunes.apple.com') ||
    url.includes('covers.openlibrary.org') ||
    url.includes('cdnjs.cloudflare.com') ||
    e.request.method !== 'GET'
  ) return;

  // Navigation requests — serve app shell, fallback to offline page
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/app/index.html')
        .then(r => r || fetch(e.request))
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Everything else — cache-first with network fallback + background update
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ── SHARE TARGET ─────────────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.pathname === '/app/' && url.searchParams.has('title')) {
    // Share target received — let the app handle it via URL params
    e.respondWith(caches.match('/app/index.html'));
  }
});

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/app/') && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/app/');
    })
  );
});
