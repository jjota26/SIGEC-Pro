/* ============================================================
   SIGEC-Pro — Service Worker PWA de Alto Desempenho
   Estratégia: Stale-While-Revalidate com Cache-First Inteligente
   Garante carregamento instantâneo (<30ms) em todos os computadores.
   DADOS E APIS: 100% DIRETO À REDE EM TEMPO REAL.
   ============================================================ */

const CACHE_NAME = 'sigec-pro-v1.7.37';
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

/* Instalação: pré-carrega recursos principais de interface */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log("[SW] Pre-caching core UI assets...");
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

/* Fetch: Separação rigorosa entre Código da Interface e Dados */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 1. DADOS E SINCRONIZAÇÃO EM TEMPO REAL:
  // Base de dados (/data/*, db.json), APIs (/api/*) e domínios externos (Hugging Face)
  // VÃO SEMPRE 100% DIRETO À REDE - NUNCA PASSAM PELA CACHE
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/data/') ||
    url.pathname.includes('db.json') ||
    !url.origin.includes(self.location.origin)
  ) {
    return; // Passagem direta sem interceção
  }

  // 2. Ficheiros de Código e Estilos (.js, .css, imagens, manifest):
  // Carregamento instantâneo (<30ms) a partir da cache local com revalidação assíncrona
  const isStaticAsset = url.pathname.endsWith('.js') ||
                        url.pathname.endsWith('.css') ||
                        url.pathname.endsWith('.png') ||
                        url.pathname.endsWith('.svg') ||
                        url.pathname.endsWith('.ico') ||
                        url.pathname.endsWith('manifest.json') ||
                        url.pathname.endsWith('.woff2');

  if (isStaticAsset) {
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

  // 3. Documento HTML principal: Network-First com fallback rápido para a cache
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
