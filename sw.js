// Имя кэша для статических ресурсов
const STATIC_CACHE = 'static-v1';
// Имя кэша для данных Firebase
const DATA_CACHE = 'data-v1';

// Список ресурсов для кэширования
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pouch-calculator.html',
  '/tape-calculator.html',
  '/styles.css',
  '/pouch-script.js',
  '/tape-script.js',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/tape-icon.png',
  '/pouch-icon.png',
  '/manifest.json'
];

// Установка Service Worker и кэширование статических ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('Кэширование статических ресурсов');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Активируем Service Worker сразу после установки
  self.skipWaiting();
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Захватываем клиентов (страницы) сразу после активации
  self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Проверяем, является ли запрос запросом к Firebase
  const isFirebaseRequest = requestUrl.origin === 'https://firestore.googleapis.com';

  if (event.request.method !== 'GET') {
    // Пропускаем не-GET запросы
    event.respondWith(fetch(event.request));
    return;
  }

  if (STATIC_ASSETS.includes(requestUrl.pathname) || requestUrl.pathname === '/') {
    // Для статических ресурсов используем стратегию "Cache First"
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else if (isFirebaseRequest) {
    // Для запросов к Firebase используем стратегию "Network First, Cache Fallback"
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Сохраняем ответ в кэш
          return caches.open(DATA_CACHE).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Если сеть недоступна, возвращаем данные из кэша
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Если данных в кэше нет, возвращаем ошибку
            return new Response(JSON.stringify({ error: 'Оффлайн: данные недоступны' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
  } else {
    // Для остальных запросов (например, Font Awesome) используем сеть
    event.respondWith(fetch(event.request));
  }
});
