const staticCacheName = "site-static-v1";
const filesToCache = [
  "/",
  "/index.html",
  "/js/index.js",
  "/js/idb.js",
  "/css/styles.css",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
];

const requests = [];

self.addEventListener("test", (e) => {
  console.log("222");
});

// install service worker
self.addEventListener("install", (evt) => {
  console.log("service worker installed");

  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(filesToCache);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// intercept the fetch requests to the server
self.addEventListener("fetch", (evt) => {
  const saveToIndexedDB = (eventReq) => {
    eventReq
      .json()
      .then((data) => {
        console.log(data);

        var request = indexedDB.open("budgetDB");

        request.onsuccess = () => {
          var db = request.result;
          var transaction = db.transaction(["transactions"], "readwrite");
          var store = transaction.objectStore("transactions");

          store.put({
            name: data.name,
            value: data.value,
            date: data.date,
          });
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };


  if (navigator.onLine) {
    // if online

    // if (evt.request.method == "POST") {
      console.log("online");

      var request = indexedDB.open("budgetDB");

      request.onsuccess = () => {
        var db = request.result;
        var transaction = db.transaction(["transactions"], "readwrite");
        var store = transaction.objectStore("transactions");

        var r2 = store.getAll()
        store.clear()

        r2.onsuccess = e => {
           const body = e.target.result 

           console.log(body)

           fetch("/api/transaction/bulk", {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(body)
           }).then ( r => {
           } )
           .catch( e => {
             // do nothing
           } )
        }

      };
    // }
  } else {
    console.log("offline");

    switch (evt.request.method) {
      case "GET":
        break;

      case "POST":
        // saveToIndexedDB(evt.request);
        break;
    }
  }

  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request);
    })
  );
});
