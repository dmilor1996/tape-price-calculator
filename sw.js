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
    '/tape-price-calculator/manifest.json'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование ресурсов...');
                return Promise.all(
                    urlsToCache.map(url => {
                        return fetch(url, { mode: 'no-cors' })
                            .then(response => {
                                if (!response.ok) {
                                    console.warn(`Не удалось кэшировать ${url}`);
                                    return;
                                }
                                return cache.put(url, response);
                            })
                            .catch(err => {
                                console.error(`Ошибка кэширования ${url}:`, err);
                            });
                    })
                );
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
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    })
                    .catch(() => {
                        return caches.match('/tape-price-calculator/index.html');
                    });
            })
    );
});
