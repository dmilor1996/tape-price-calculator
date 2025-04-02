const CACHE_NAME = 'price-calculator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/tape-calculator.html',
  '/pouch-calculator.html',
  '/styles.css',
  '/tape-script.js',
  '/pouch-script.js',
  '/tape-icon.png',
  '/pouch-icon.png',
  '/manifest.json'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование ресурсов');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Пропускаем ожидание и сразу активируем Service Worker
        self.skipWaiting();
      })
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // Захватываем клиентов (страницы) сразу после активации
      self.clients.claim();
    })
  );
});

// Обработка запросов (стратегия "Stale-While-Revalidate")
self.addEventListener('fetch', event => {
  // Проверяем, является ли запрос запросом к Firebase
  const isFirebaseRequest = event.request.url.includes('firestore.googleapis.com');

  if (isFirebaseRequest) {
    // Для запросов к Firebase используем "Network First"
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return networkResponse;
        })
        .catch(() => {
          return new Response(JSON.stringify({ error: "Offline mode" }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  } else {
    // Для статических ресурсов используем "Stale-While-Revalidate"
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            // Обновляем кэш с новым ответом
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // Если сеть недоступна, возвращаем кэшированный ответ
            return cachedResponse;
          });

          // Возвращаем кэшированный ответ (если есть), пока загружается новый
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});

// Обработка сообщений от клиента (например, для принудительного обновления)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
