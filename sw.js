/* ============================================================
   SIGEC-Pro — Service Worker PWA
   Estrategia: Network First com fallback para cache
   ============================================================ */

const CACHE_NAME = 'sigec-pro-v5.4';
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

/* Instalacao: pre-carrega os recursos principais */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Pre-caching core assets");
      return cache.addAll(CORE_ASSETS);
    }).catch(err => {
      console.warn("[SW] Pre-cache parcial:", err);
    })
  );
  self.skipWaiting();
});

/* Ativacao: limpa caches antigas */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log("[SW] Removendo cache antiga:", k);
          return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

/* Fetch: Network First, fallback para cache */
self.addEventListener("fetch", event => {
  // Ignora pedidos nao-GET e pedidos externos (ex: HF API)
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (!url.origin.includes(self.location.origin) && !url.hostname.includes("hf.space")) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guarda resposta fresca na cache
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sem rede: serve da cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Fallback para a pagina principal
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
      })
  );
});
