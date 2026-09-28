/* ============================================================
   SIGEC-Pro — Service Worker PWA de Alto Desempenho
   Estratégia: Stale-While-Revalidate com Cache-First Inteligente
   Garante carregamento instantâneo (<50ms) e fluidez em todos os computadores.
   ============================================================ */

const CACHE_NAME = 'sigec-pro-v1.7.36';
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/i18n.js",
  "/duplicatesManager.js",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

/* Instalação: pré-carrega os recursos principais com verificação resiliente */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log("[SW] Pre-caching core assets...");
      for (const asset of CORE_ASSETS) {
        try {
          const res = await fetch(asset, { cache: 'no-cache' });
          if (res && res.ok) {
            await cache.put(asset, res);
          }
        } catch (e) {
          console.warn("[SW] Erro ao pré-carregar:", asset, e);
        }
      }
    })
  );
  self.skipWaiting();
});

/* Ativação: limpa caches antigas imediatamente */
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

/* Fetch: Otimizado para velocidade máxima */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 1. Pedidos à API (/api/*) e domínios externos: direto à rede sem cache
  if (url.pathname.startsWith('/api/') || !url.origin.includes(self.location.origin)) {
    return;
  }

  // 2. Ficheiros estáticos (.js, .css, imagens, fontes, manifest): Stale-While-Revalidate
  const isStatic = url.pathname.endsWith('.js') ||
                   url.pathname.endsWith('.css') ||
                   url.pathname.endsWith('.png') ||
                   url.pathname.endsWith('.svg') ||
                   url.pathname.endsWith('.ico') ||
                   url.pathname.endsWith('.json') ||
                   url.pathname.endsWith('.woff2');

  if (isStatic) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Documento HTML principal (/ ou index.html): Network-First rápido com fallback para cache
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request, { ignoreSearch: true }).then(cached => {
            return cached || caches.match('/index.html', { ignoreSearch: true });
          });
        })
    );
  }
});
