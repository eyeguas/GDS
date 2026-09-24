const CACHE = 'gds-training-v61';
// Some lessons continue across extra files (base, B, C); listing every possible
// suffix here is safe because the install step below skips any that don't exist.
const lessons = ['LSN', 'AM', 'Q'].flatMap(prefix => Array.from({ length: 40 }, (_, index) =>
  ['', 'B', 'C'].map(part => `./orion/GDS/${prefix}${index + 1}${part}.DAT`)
)).flat();
const essentials = ['./', './index.html', './manifest.webmanifest', './modern/styles.css', './modern/app.js', './modern/icon.svg', './modern/icons/icon-192.png', './modern/icons/icon-512.png', './modern/icons/apple-touch-icon.png', './modern/icons/favicon-32.png', './modern/assets/travel-training.svg', './orion/GDS/DIR.DSP', './orion/GDS/AMCDE.DAT'];

self.addEventListener('install', event => {
  // Fetch each file individually (rather than cache.addAll, which aborts entirely
  // on the first missing file) so an optional lesson part that doesn't exist for
  // a given lesson never blocks installing the cache for everything else.
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(
    [...essentials, ...lessons].map(url => fetch(url).then(response => {
      if (response.ok) return cache.put(url, response);
    }).catch(() => {}))
  )));
  self.skipWaiting();
});
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
