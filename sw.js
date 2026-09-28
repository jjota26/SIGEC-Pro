/* ============================================================
   SIGEC-Pro — Service Worker: Desativação e Auto-Remoção
   Aplicação 100% Web Pura em Memória RAM sem retenção local no disco.
   ============================================================ */

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Sem interceção de fetch: todos os pedidos seguem diretamente para a rede
self.addEventListener("fetch", event => {
  return;
});
