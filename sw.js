var CACHE_NAME='tokyo-trip-v1';
var URLS=[
  './',
  './index.html',
  './leaflet.js',
  './leaflet.css',
  './images/marker-icon.png',
  './images/marker-icon-2x.png',
  './images/marker-shadow.png',
  './images/layers.png',
  './images/layers-2x.png'
];

// Install: cache core files
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){return n!==CACHE_NAME}).map(function(n){return caches.delete(n)})
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch',function(e){
  // Skip Firebase and external API calls
  if(e.request.url.indexOf('firebaseio.com')!==-1||
     e.request.url.indexOf('gstatic.com')!==-1||
     e.request.url.indexOf('googleapis.com')!==-1){
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(res){
      // Cache successful responses
      if(res.ok){
        var clone=res.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request,clone);
        });
      }
      return res;
    }).catch(function(){
      // Offline: serve from cache
      return caches.match(e.request);
    })
  );
});
