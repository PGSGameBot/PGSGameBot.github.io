// SERVICE WORKER
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (registration) {
        console.log('Service worker enregistré avec succès :', registration);
      })
      .catch(function (error) {
        console.log('L\'enregistrement du service worker a échoué :', error);
      });
  }
} // Installation

function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister()
          .then(function (success) {
            console.log('Service worker désinstallé avec succès :', success);
          });
      }
    });
  }
} // Désinstallation



// MISE A JOUR DU SERVICE
function toggleServiceWorker(enableServiceWorker) {
  if (enableServiceWorker) {
    registerServiceWorker();
  } else {
    unregisterServiceWorker();
  }
}

let enableServiceWorker = true;
toggleServiceWorker(enableServiceWorker);