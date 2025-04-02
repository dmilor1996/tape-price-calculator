const CACHE_NAME = 'price-calculator-cache-v3';
const urlsToCache = [
  '/tape-price-calculator/',
  '/tape-price-calculator/index.html',
  '/tape-price-calculator/tape-calculator.html',
  '/tape-price-calculator/pouch-calculator.html',
  '/tape-price-calculator/styles.css',
  '/tape-price-calculator/tape-script.js',
  '/tape-price-calculator/pouch-script.js',
  '/tape-price-calculator/tape-icon.png',
  '/tape-price-calculator/pouch-icon.png',
  '/tape-price-calculator/pwa-icon-192.png',
  '/tape-price-calculator/pwa-icon-512.png',
  '/tape-price-calculator/manifest.json'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
  console.log('Установка Service Worker, кэширование ресурсов...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование ресурсов:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker установлен, пропускаем ожидание');
        self.skipWaiting();
      })
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
  console.log('Активация Service Worker...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker активирован, захватываем клиентов');
      self.clients.claim();
    })
  );
});

// Обработка запросов (стратегия "Stale-While-Revalidate")
self.addEventListener('fetch', event => {
  const isFirebaseRequest = event.request.url.includes('firestore.googleapis.com');

  if (isFirebaseRequest) {
    console.log('Запрос к Firebase, используем Network First:', event.request.url);
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return networkResponse;
        })
        .catch(() => {
          console.log('Firebase недоступен, возвращаем ошибку');
          return new Response(JSON.stringify({ error: "Offline mode" }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  } else {
    console.log('Запрос к статическому ресурсу, используем Stale-While-Revalidate:', event.request.url);
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            console.log('Обновляем кэш для:', event.request.url);
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            console.log('Сеть недоступна, возвращаем кэшированный ответ для:', event.request.url);
            return cachedResponse;
          });

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});

// Обработка сообщений от клиента
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Получено сообщение SKIP_WAITING, активируем Service Worker');
    self.skipWaiting();
  }
});
