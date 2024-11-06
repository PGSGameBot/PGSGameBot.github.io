"use strict";

// CHARGEMENT DES CHEMINS PERSONNALISE
document;
var pathToLoadHTML;

if (window.location.pathname.includes('/pages/')) {
  pathToLoadHTML = '../assets/static/pp-load.html';
} else if (window.location.pathname.includes('/games/')) {
  pathToLoadHTML = '../../assets/static/pp-load.html';
} else if (window.location.pathname.includes('/apps/')) {
  pathToLoadHTML = '../../assets/static/pp-load.html';
} else {
  pathToLoadHTML = 'assets/static/pp-load.html';
}

fetch(pathToLoadHTML).then(function (response) {
  return response.text();
}).then(function (data) {
  document.querySelector('.loader').innerHTML = data;
  document.querySelector('.loader').innerHTML = data;
});
window.addEventListener('load', function () {
  var loader = document.querySelector('.loader');

  if (loader) {
    loader.style.display = 'none';
  }
});