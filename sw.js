var CACHE_NAME='tokyo-trip-v2';
var URLS=[
  './',
  './index.html',
  './leaflet.js',
  './leaflet.css',
  './images/marker-icon.png',
  './images/marker-icon-2x.png',
  './images/marker-shadow.png',
  './images/layers.png',
  './images/layers-2x.png',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js'
];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){return cache.addAll(URLS)})
  );
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){return n!==CACHE_NAME}).map(function(n){return caches.delete(n)}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  // Let Firebase realtime connections pass through
  if(e.request.url.indexOf('firebaseio.com')!==-1&&e.request.url.indexOf('.js')===-1){return}
  e.respondWith(
    fetch(e.request).then(function(res){
      if(res.ok){var clone=res.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(e.request,clone)})}
      return res;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
