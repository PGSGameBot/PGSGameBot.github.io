// CHARGEMENT DES CHEMINS PERSONNALISE
document
let pathToLoadHTML;

if (window.location.pathname.includes('/pages/')) {
  pathToLoadHTML = '../assets/static/pp-load.html';
} else if (window.location.pathname.includes('/games/')) {
  pathToLoadHTML = '../../assets/static/pp-load.html';
} else if (window.location.pathname.includes('/apps/')) {
  pathToLoadHTML = '../../assets/static/pp-load.html';
} else {
  pathToLoadHTML = 'assets/static/pp-load.html';
}

fetch(pathToLoadHTML)
  .then(response => response.text())
  .then(data => {
    document.querySelector('.loader').innerHTML = data;

    document.querySelector('.loader').innerHTML = data
  });

window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.display = 'none';
  }
});
