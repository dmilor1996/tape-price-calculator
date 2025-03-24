// Версия кэша
const CACHE_NAME = 'tape-price-calculator-v1';

// Список ресурсов для кэширования
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
    '/tape-price-calculator/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование ресурсов...');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация Service Worker и удаление старого кэша
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
        }).then(() => self.clients.claim())
    );
});

// Обработка запросов (стратегия "Cache First, Then Network")
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Если ресурс есть в кэше, возвращаем его
                if (response) {
                    return response;
                }
                // Иначе делаем запрос в сеть
                return fetch(event.request)
                    .then(response => {
                        // Кэшируем только успешные ответы (status 200) и основные ресурсы (не API)
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Клонируем ответ, так как он может быть использован только один раз
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    })
                    .catch(() => {
                        // Если запрос не удался и ресурса нет в кэше, возвращаем заглушку (например, для оффлайн-страницы)
                        return caches.match('/tape-price-calculator/index.html');
                    });
            })
    );
});
