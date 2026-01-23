declare const self: ServiceWorkerGlobalScope;

const FILES = [
    "/",
]

async function updateCachedFiles(cache:Cache):Promise<string[]>{
    const images = IMAGES;

    for(const request of await cache.keys()) {
        const index = images.indexOf(request.url);
        if(index >= 0){
            //Remove Image URI's already cached
            images.splice(index, 1);
        } else if(request.destination !== "image"){

            //Delete any code files cached
            await cache.delete(request)
        }
    }

    //Return all files that need to be cached still.
    return FILES.concat(images)
}

function sendMessage(value:any) {
    self.clients.matchAll().then(clients=>{
        clients.forEach(c=>c.postMessage(value))
    })
}

self.addEventListener("install", (event)=>{
    event.waitUntil((async()=>{
        const cache = await caches.open(VERSION);
        const list = await updateCachedFiles(cache);
        return await cache.addAll(list);
    })());
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
        else
            sendMessage(response.clone())

        return response;
    })())
})