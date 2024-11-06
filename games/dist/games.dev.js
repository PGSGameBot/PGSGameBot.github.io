"use strict";

// RECHERCHE
var recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

function displayRecentSearches() {
  var list = document.getElementById('recent-searches-list');
  list.innerHTML = '';
  recentSearches.forEach(function (search, index) {
    var li = document.createElement('li');
    li.textContent = search;
    li.addEventListener('mouseover', function () {
      document.getElementById('search-bar').value = search.trim();
    });
    li.addEventListener('click', function () {
      document.getElementById('search-bar').value = search.trim();
    });
    var deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.className = 'delete-search';
    deleteButton.dataset.index = index;
    li.appendChild(deleteButton);
    list.appendChild(li);
  });
  document.getElementById('clear-all-searches').style.display = recentSearches.length >= 2 ? 'block' : 'none';
  document.getElementById('recent-searches').style.display = recentSearches.length ? 'block' : 'none';
} // Bande de recherches récentes


var searchTimeout;
document.getElementById('search-bar').addEventListener('keyup', function () {
  clearTimeout(searchTimeout);
  var query = this.value.trim().toLowerCase();

  if (query) {
    searchTimeout = setTimeout(function () {
      if (!recentSearches.includes(query)) {
        if (recentSearches.length >= 3) {
          recentSearches.pop();
        }

        recentSearches.unshift(query);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        displayRecentSearches();
      }
    }, 2000);
  } // Saisie et ajout de la recherche
  // Logique de recherche dans les jeux et applications


  var games = document.querySelectorAll('.game');
  var apps = document.querySelectorAll('.app');
  var foundGame = false;
  var foundApp = false;
  games.forEach(function (game) {
    var gameName = game.querySelector('h2').textContent.toLowerCase();

    if (gameName.includes(query)) {
      game.style.display = 'block';
      foundGame = true;
    } else {
      game.style.display = 'none';
    }
  });
  apps.forEach(function (app) {
    var appName = app.querySelector('h2').textContent.toLowerCase();

    if (appName.includes(query)) {
      app.style.display = 'block';
      foundApp = true;
    } else {
      app.style.display = 'none';
    }
  });
  var gamesSection = document.querySelector('.games');
  var appsSection = document.querySelector('.apps');

  if (!foundGame) {
    gamesSection.innerHTML = "<p>Aucun jeu ne porte \"".concat(query, "\".</p>");
  }

  if (!foundApp) {
    appsSection.innerHTML = "<p>Aucune application ne porte \"".concat(query, "\".</p>");
  }
}); // Affichage du résultat

document.getElementById('recent-searches-list').addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-search')) {
    var index = e.target.dataset.index;
    recentSearches.splice(index, 1);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    displayRecentSearches();
  }
}); // Effacer une ligne

document.getElementById('clear-all-searches').addEventListener('click', function () {
  recentSearches = [];
  localStorage.removeItem('recentSearches');
  displayRecentSearches();
}); // Effacer tout

displayRecentSearches(); // AFFICHAGE / FERMERTURE DE LA BANDE

document.getElementById('search-bar').addEventListener('focus', function () {
  displayRecentSearches(); // Affiche les recherches récentes
}); // Affichage
// Écoute le blur (perte de focus) sur la barre de recherche

document.getElementById('search-bar').addEventListener('blur', function () {
  setTimeout(function () {
    document.getElementById('recent-searches').style.display = 'none';
  }, 200);
}); // Fermeture
// BOUTONS VOIR PLUS/VOIR MOINS

document.addEventListener('DOMContentLoaded', function () {
  var toggleGamesBtn = document.getElementById('toggle-games-btn');
  var games = document.querySelectorAll('.games .game');
  games.forEach(function (game, index) {
    if (index > 2) game.style.display = 'none';
  });

  if (games.length <= 3) {
    toggleGamesBtn.style.display = 'none';
  }

  toggleGamesBtn.addEventListener('click', function () {
    if (toggleGamesBtn.textContent === 'Voir plus') {
      games.forEach(function (game) {
        return game.style.display = 'block';
      });
      toggleGamesBtn.textContent = 'Voir moins';
    } else {
      games.forEach(function (game, index) {
        if (index > 2) game.style.display = 'none';
      });
      toggleGamesBtn.textContent = 'Voir plus';
    }
  });
});