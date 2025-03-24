// Имя кэша
const CACHE_NAME = 'calculator-cache-v1';

// Файлы для кэширования
const urlsToCache = [
    '/',
    '/index.html',
    '/pouch-calculator.html',
    '/tape-calculator.html',
    '/styles.css',
    '/pouch-script.js',
    '/tape-script.js',
    '/tape-icon.png',
    '/pouch-icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование ресурсов');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка запросов (стратегия "сначала сеть, потом кэш")
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Если запрос успешен, обновляем кэш
                if (networkResponse && networkResponse.status === 200) {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Если нет интернета, возвращаем из кэша
                return caches.match(event.request).then(response => {
                    return response || new Response('Оффлайн: нет данных в кэше', { status: 503 });
                });
            })
    );
});
