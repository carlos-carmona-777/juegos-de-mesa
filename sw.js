/* Juegos de Mesa — service worker.
   Precarga todo en la instalación y luego sirve siempre desde caché.
   Sube CACHE cada vez que cambies cualquier fichero del listado. */

const CACHE = "juegos-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-1024.png",
  "./fonts/fonts.css",
  "./fonts/rye-400-latin.woff2",
  "./fonts/rye-400-latin-ext.woff2",
  "./fonts/nunito-sans-400-latin.woff2",
  "./fonts/nunito-sans-400-latin-ext.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navegaciones: siempre la misma página, venga la URL que venga.
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((hit) => hit || fetch(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        // Guarda lo que se pida y no estuviera precargado (mismo origen).
        if (res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
