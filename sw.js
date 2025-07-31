// Service Worker per TimeTracker Pro PWA
const CACHE_NAME = 'timetracker-pro-v1';
const urlsToCache = [
  '/timetracker-pro/',
  '/timetracker-pro/index.html',
  '/timetracker-pro/static/js/bundle.js',
  '/timetracker-pro/static/css/main.css',
  '/timetracker-pro/manifest.json',
  '/timetracker-pro/icon-192.png',
  '/timetracker-pro/icon-512.png'
];

// Install event - Cache dei file principali
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Serve i file dalla cache quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Ritorna dalla cache se disponibile, altrimenti fetch dalla rete
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - Pulisce le cache vecchie
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache vecchia:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync per quando torna online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Qui potresti sincronizzare i dati con Supabase
  }
});

// Push notifications (opzionale per il futuro)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Notifica da TimeTracker Pro',
    icon: '/timetracker-pro/icon-192.png',
    badge: '/timetracker-pro/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Apri App',
        icon: '/timetracker-pro/icon-192.png'
      },
      {
        action: 'close',
        title: 'Chiudi',
        icon: '/timetracker-pro/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('TimeTracker Pro', options)
  );
});