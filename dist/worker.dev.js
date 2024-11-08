"use strict";

// SERVICE WORKER
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
      console.log('Service worker enregistré avec succès :', registration);
    })["catch"](function (error) {
      console.log('L\'enregistrement du service worker a échoué :', error);
    });
  }
} // Installation


function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = registrations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var registration = _step.value;
          registration.unregister().then(function (success) {
            console.log('Service worker désinstallé avec succès :', success);
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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

var enableServiceWorker = true;
toggleServiceWorker(enableServiceWorker);