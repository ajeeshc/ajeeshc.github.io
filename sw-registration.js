
let newWorker;
function showUpdateBar() {
  let notificationbar = document.getElementById('sw_notificationbar');
  notificationbar.className = 'show';
 
}

document.getElementById('reload').addEventListener('click', function () {
  newWorker.postMessage({ action: 'skipWaiting' });
  let notificationbar = document.getElementById('sw_notificationbar');
  setInterval(function () { notificationbar.classList.remove('show') }, 3000);
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('service-worker.js', { scope: './' })
    .then(function (registration) {
      console.log("Service worker registered - from the 24 ", registration)
      registration.addEventListener('updatefound', () => {
        newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          switch (newWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {

                showUpdateBar();
              }
              break;
          }
        });
      });
    })
    .catch(function (err) {
      console.log("Service Worker Failes to Register", err)
    })

  navigator.serviceWorker.addEventListener('message', function (event) {
    document.getElementById("cache-generic-msg").style.display = "block";
    console.log("Got reply from service worker: " + event.data);
  });

  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });

}