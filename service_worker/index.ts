declare const self: ServiceWorkerGlobalScope;

const FILES = [
    "/",
]

self.addEventListener("install", (event)=>{
    event.waitUntil(
        caches.open(VERSION).then(cache=>{
            const promise = cache.addAll(FILES);
            cache.addAll(IMAGES); //Dont Wait For Images
            return promise;
        })
    )
});

self.addEventListener("activate", (event)=>{
    self.clients.claim();
});

self.addEventListener("message", (event)=>{
    if(event.data.cache) {
        event.waitUntil(
            caches.open(VERSION).then(cache=>{
                return cache.add(event.data.cache)
            })
        );
    } else if(event.data.update) {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", (event)=>{
    event.respondWith((async()=>{
        const cache = await caches.open(VERSION);

        const cacheResponse = await cache.match(event.request);
        if(cacheResponse)
            return cacheResponse;

        const response = await fetch(event.request);
        if(response.ok)
            await cache.put(event.request, response.clone());

        return response;
    })())
})