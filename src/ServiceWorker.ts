import {Alert} from 'react-native';

export function registerServiceWorker(filename:string, updateCallback:(sw:ServiceWorker)=>void) {
    if (!("serviceWorker" in navigator))
        return;

    navigator.serviceWorker.register(filename).then((serviceWorker)=>{
        if(!navigator.serviceWorker.controller)
            return;

        if(serviceWorker.waiting) {
            updateCallback(serviceWorker.waiting);

        } else if(serviceWorker.installing) {
            serviceWorker.addEventListener("statechange", ()=>{
                if (serviceWorker.installing?.state === "installed") {
                    updateCallback(serviceWorker.installing)
                }
            });

        } else {
            serviceWorker.addEventListener("updatefound", ()=>{
                const newServiceWorker = serviceWorker.installing;

                newServiceWorker?.addEventListener("statechange", ()=>{
                    if (newServiceWorker.state === "installed") {
                        updateCallback(newServiceWorker)
                    }
                });
            });
        }
    }).catch(console.error);

    navigator.serviceWorker.ready.then(()=>{
        navigator.serviceWorker.controller?.postMessage({cache: (document.currentScript as HTMLScriptElement|null)?.src});
        navigator.serviceWorker.addEventListener("message", (event)=>{
            console.error("Error From Service Worker:\n", event.data);
        })
    })
}

export function loadServiceWorker(filename:string) {
    registerServiceWorker(filename, (serviceWorker)=>{
        navigator.serviceWorker.addEventListener('controllerchange', ()=>{
            window.location.reload();
        }, {once: true});

        Alert.alert("Update Available", "There is an update available, you can restart the app or refresh the page to update.", [
            {
                text: "Update Now",
                onPress:() => {
                    serviceWorker.postMessage({update:true})
                }
            },
            {
                text: "Update Later",
                style: 'cancel'
            }
        ])
    });


}