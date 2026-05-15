/* LarCare service worker — cache-first for static assets, network-first for HTML. */
const CACHE_VERSION = 'larcare-v2.3.5';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE = [
  './',
  './index.html',
  './app.html',
  './offline.html',
  './manifest.json',
  './css/styles.css',
  './css/landing.css',
  './js/app.js',
  './js/components.js',
  './js/views.js',
  './js/views_provider.js',
  './js/mock_data.js',
  './js/data_layer.js',
  './js/config.js',
  './js/simulator.js',
  './js/audio.js',
  './js/install_detector.js',
  './js/install_prompt.js',
  './js/notifications.js',
  './js/theme.js',
  './js/i18n.js',
  './js/admin.js',
  './js/payment.js',
  './js/views_search.js',
  './js/chat.js',
  './js/dashboard.js',
  './js/onboarding.js',
  './js/map.js',
  './js/features.js',
  './js/audio_recorder.js',
  './js/onboarding_client.js',
  './js/demo_tour.js',
  './icons/favicon.svg',
  './icons/favicon-16.png',
  './icons/favicon-32.png',
  './icons/favicon.ico',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/apple-touch-icon-152.png',
  './icons/apple-touch-icon-167.png',
  './icons/og-image.png',
  './icons/twitter-card.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

// Permite que a página force ativação imediata do SW novo
// (botão "Atualizar agora" + auto-detect mandam { type: 'SKIP_WAITING' })
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notifications: listener para evento push (servidor externo)
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const title = data.title || 'LarCare';
  const options = {
    body: data.body || '',
    icon: data.icon || 'icons/icon-192.png',
    badge: data.badge || 'icons/icon-192.png',
    tag: data.tag || 'larcare',
    data: data.data || {},
    vibrate: data.vibrate || [50, 30, 50]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Clique numa notificação: foca aba existente OU abre nova com URL relevante
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          c.navigate(url).catch(() => {});
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin && !url.host.includes('fonts.gstatic.com') && !url.host.includes('fonts.googleapis.com')) {
    return; // let the network handle third parties (avoids opaque cache bloat)
  }

  // Network-first for navigation requests, falling back to cached shell, then offline page.
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./offline.html')))
    );
    return;
  }

  // Cache-first for everything else.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => cached);
    })
  );
});
