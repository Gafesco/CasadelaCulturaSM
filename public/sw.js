// public/sw.js
const CACHE = "museo-cache-v4"; // <-- súbele el número

const ASSETS = [
  "/",
  "/index.html",
  "/data/exhibits.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((resp) => resp || fetch(e.request)));
});
