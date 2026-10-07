/**
 * BRVTY Landing service worker.
 * HTML is network-first (so edits show up immediately); static assets are cache-first.
 * Bump CACHE_NAME on each deploy that changes cached assets.
 */
const CACHE_NAME = 'brvty-landing-v4';
const PRECACHE_URLS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png', './lazlab-96.png'];

self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('brvty-landing-') && k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fonts: stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(CACHE_NAME).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }

  if (url.origin !== self.location.origin) return;                       // analytics, workers.dev, etc.
  if (/\.(apk|mp3)$/i.test(url.pathname) || req.headers.has('range')) return; // large/ranged media: network only

  // Pages: network-first, cached copy when offline
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      if (r && r.ok) { const copy = r.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); }
      return r;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }

  // Static assets: cache-first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r && r.status === 200) { const copy = r.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); }
    return r;
  })));
});
