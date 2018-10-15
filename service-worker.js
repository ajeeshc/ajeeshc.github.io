var cacheName = 'KCW-100';
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll([
                './index.html',
                './Dist/templates.js',
                './Dist/main.bundle.js',
                './Dist/vendor.bundle.js',
                './Dist/workflowPortal.styles.css',
                './Images/web_application.png',
                './Images/online.1.jpg',
                './store.js',
                './sw-registration.js',
                './service-worker.js',
                './JS/Comments/Comments.html'
            ]);
        })
    );
}); 

// To delete the old chache if name changed it will delete old chache 
self.addEventListener('activate', (event) => {
    console.info('Event: Activate');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    } 
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method == 'GET') {
        
        // Get the User data from the indexed db once you offline 
        if ((event.request.url.includes('UserComments') || event.request.url.includes('GetbookFor')) && !navigator.onLine) {
            event.respondWith(
                fetch(event.request)
                 .then(function(){ 
                    return readTheResponsefromTheIndexedDB('KCW-OfflineDB', 'UserData', event.request.url).then(function (response) {
                        return response;
                    });
                })
                .catch(function (result) {
                    return readTheResponsefromTheIndexedDB('KCW-OfflineDB', 'UserData', event.request.url).then(function (response) {
                        return response;
                    });
                })
            );
        }
     
        else {
            //to aviod api-caching of all user data call 
            if (!event.request.url.includes('UserComments') || event.request.url.includes('GetbookFor') )
            {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(event.request).then(function (response) {
                            return response || fetch(event.request).then(function (response) {
                                cache.put(event.request, response.clone());
                                return response;
                            });
                        });
                    })
                );
            }
        }
    }
    else {
        // TO GIVE THE SUCCESS MESSAGE FOR PUSH IN OFFLINE MODE
        if (!navigator.onLine) {
            event.respondWith(
                fetch(event.request).catch(function (result) {
                    return new Response("Pushed to Offline DB", { headers: { 'content-type': 'text/plain' } })
                })
            )
        }
    }
});

self.addEventListener('sync', function (event) {
    if (event.tag == 'myFirstSync') {
        console.log("synching")

    }
    console.log("test");
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });


function readTheResponsefromTheIndexedDB(dbName, storeName, key) {
    return new Promise((resolve, reject) => {
        var openRequest = indexedDB.open(dbName, 2);
        openRequest.onupgradeneeded = function (e) {
            let db = request.result;
            if (!db.objectStore.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        }
        openRequest.onsuccess = function (e) {
            console.log("Success!");
            db = e.target.result;
            var transaction = db.transaction([storeName], "readwrite");
            var store = transaction.objectStore(storeName);
            var request = store.get(key);
            request.onerror = function () {
                console.log("Error");
                reject("unexpected error happened");
            }
            request.onsuccess = function (e) {
                console.log("return the respose from db");
                //JSON.parse(request.result)
                resolve(new Response(request.result, { headers: { 'content-type': 'text/plain' } }));
            }
        }
        openRequest.onerror = function (e) {
            console.log("Error");
            console.dir(e);
        }
    });

}