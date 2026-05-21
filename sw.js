// Root SW — self-destructs so the landing page is never treated as an installable PWA.
// The real PWA lives at /app/ with its own sw.js and manifest.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    self.registration.unregister().then(() => self.clients.matchAll()).then(clients => {
      clients.forEach(client => client.navigate(client.url));
    })
  );
});
