const CACHE_NAME = 'pdf-cache-v1';
const ASSETS_TO_CACHE = [
 '/pdf.worker.js', // 必要なワーカーファイルをキャッシュ
];

self.addEventListener('install', (event) => {
 event.waitUntil(
  caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
 );
});

self.addEventListener('fetch', (event) => {
 const url = event.request.url;

 // 特定のパターンに一致する場合はキャッシュを利用（例: S3からのPDF）
 if (url.includes('s3.amazonaws.com') && url.endsWith('.pdf')) {
  event.respondWith(
   caches.open(CACHE_NAME).then((cache) => {
    return cache.match(event.request).then((cachedResponse) => {
     if (cachedResponse) {
      return cachedResponse;
     }

     return fetch(event.request).then((networkResponse) => {
      // ネットワークから取得したPDFをキャッシュ
      cache.put(event.request, networkResponse.clone());
      return networkResponse;
     });
    });
   })
  );
 } else {
  // 他のリクエストは通常通り処理
  event.respondWith(fetch(event.request));
 }
});
