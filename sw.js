const CACHE_NAME = 'price-calculator-cache-v5'; // Обновляем CACHE_NAME
const APP_VERSION = '1.0.5'; // Обновляем версию приложения
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
  console.log('Установка Service Worker, версия:', APP_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование ресурсов:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker установлен, пропускаем ожидание');
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
  console.log('Активация Service Worker, версия:', APP_VERSION);
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
      return self.clients.claim();
    })
  );
});

// Обработка запросов (стратегия "Network First" для всех ресурсов)
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
    console.log('Запрос к ресурсу, используем Network First:', event.request.url);
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }) // Отключаем кэширование на уровне fetch
        .then(networkResponse => {
          // Обновляем кэш
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Если сеть недоступна, возвращаем кэшированный ответ
          console.log('Сеть недоступна, возвращаем кэшированный ответ для:', event.request.url);
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || new Response('Ресурс недоступен в оффлайн-режиме', { status: 503 });
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
