const CACHE = "maas-v0.1.0";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/css/main.css",
  "./src/js/app.js",
  "./src/js/core/store.js",
  "./src/js/modules/content.js",
  "./src/assets/icons/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
