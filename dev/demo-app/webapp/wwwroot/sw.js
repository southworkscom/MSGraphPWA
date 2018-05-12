var cacheName = 'goat-cache-v6';
var urlsToCache = [
    '/',
    '/sw.js',
    '/favicon.ico',
    '/manifest.json',
    '/dist/main.js',
    '/dist/vendor.js',
    '/dist/site.css',
    '/images/page_bg.png',
    '/images/goat-notification.png',
    '/resources/toastNotificationWithImage.xml'
];

self.addEventListener('install', function (event) {
    // offline cache
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            var staleCaches = cacheNames.filter(name => name !== cacheName);
            console.log('removing stale caches', staleCaches);
            return Promise.all(
                staleCaches.map(name => caches.delete(name)));
        }));
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            }));
});