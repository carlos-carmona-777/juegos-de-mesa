/* Juegos de Mesa — service worker.
   Precarga todo en la instalación para que la app funcione sin conexión, y
   comprueba la red al abrirla para que una versión nueva entre sola.
   Sube CACHE si cambias FUENTES, ICONOS o el manifest (el contenido de
   index.html se refresca por su cuenta). */

const CACHE = "juegos-v3";

/* Cuánto esperamos a la red antes de servir la copia guardada.
   En el metro, con una barra de cobertura, no queremos pantalla en blanco. */
const NET_TIMEOUT = 3000;

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

// fetch con límite de tiempo: si la red tarda, se rinde y tira de caché.
function fromNetwork(input, init) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), NET_TIMEOUT);
    fetch(input, init).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

// Guarda en caché solo respuestas buenas del mismo origen.
function save(key, res) {
  if (res && res.ok && res.type === "basic") {
    const copy = res.clone();
    caches.open(CACHE).then((cache) => cache.put(key, copy));
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  /* Navegaciones: la red primero, así una versión recién publicada llega
     al móvil sin tener que reinstalar la app. Siempre se devuelve la misma
     página, venga la URL que venga, y si no hay red se sirve la guardada. */
  if (req.mode === "navigate") {
    event.respondWith(
      fromNetwork("./index.html", { cache: "no-store" })
        .then((res) => save("./index.html", res))
        .catch(() => caches.match("./index.html"))
        .then((res) => res || fetch(req))
    );
    return;
  }

  /* Todo lo demás (fuentes, iconos, manifest) no cambia de una versión a
     otra: caché primero, y lo que no estuviera precargado se guarda al pedirlo. */
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => save(req, res));
    })
  );
});
