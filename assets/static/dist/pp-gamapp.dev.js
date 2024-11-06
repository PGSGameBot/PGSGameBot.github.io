"use strict";

// --- CHARGEMENT HEADER ---
fetch('../assets/static/pp-nav.html').then(function (response) {
  return response.text();
}).then(function (data) {
  document.querySelector('nav').innerHTML = data; // MENU

  var menuIcon = document.getElementById('menu-icon');
  var menu = document.getElementById('menu');

  if (menuIcon && menu) {
    menuIcon.addEventListener('click', function () {
      menu.classList.toggle('show');
      document.addEventListener('click', function (event) {
        var isClickInsideMenu = menu.contains(event.target);
        var isClickOnToggle = menuIcon.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && menu.classList.contains('show')) {
          menu.classList.remove('show');
        }
      });
    });
  } // AJUSTEMENT DES CHEMINS


  document.querySelectorAll('header a').forEach(function (a) {
    a.href = window.location.pathname.includes('games/') ? '../' + a.getAttribute('href') : a.getAttribute('href');
  }); // PARTAGER

  var shareBtn = document.getElementById('share-btn');

  if (shareBtn) {
    shareBtn.addEventListener('click', function (e) {
      e.preventDefault();

      if (navigator.share) {
        navigator.share({
          title: 'PGS GAME BOT',
          text: 'Jouez, collectez des points, et divertissez-vous avec PGS GAME BOT !',
          url: window.location.href
        }).then(function () {
          console.log('Partager avec succès');
        })["catch"](function (error) {
          console.error('Erreur lors du partage:', error);
        });
      } else {
        alert('Nous n’arrivons pas à partager PGSGameBot depuis ce navigateur. \nChangez de navigateur et réessayez.');
      }
    });
  } // POPUP DE NOTATION


  var rateBtn = document.getElementById('rate-btn');
  var ratePopup = document.getElementById('rate-popup');
  var rateClose = document.getElementById('rate-close');
  var emojiContainer = document.getElementById('emoji-container');
  var emojis = document.querySelectorAll('.emoji');
  var commentField = document.getElementById('comment');
  var submitRatingBtn = document.getElementById('submit-rating-btn');
  var selectedEmoji = null;
  var savedRating = localStorage.getItem('rating');
  var savedComment = localStorage.getItem('comment');

  if (savedRating) {
    rateBtn.textContent = 'Gérer mon avis 📝';
  }

  rateBtn.addEventListener('click', function () {
    ratePopup.style.display = 'flex';

    if (savedRating) {
      emojis.forEach(function (emoji) {
        return emoji.classList.remove('selected');
      });
      document.querySelector(".emoji[data-value=\"".concat(savedRating, "\"]")).classList.add('selected');
      selectedEmoji = savedRating;
      commentField.style.display = 'block';
      submitRatingBtn.style.display = 'block';
      commentField.value = savedComment || '';
    }
  });
  rateClose.addEventListener('click', function () {
    ratePopup.style.display = 'none';
  });
  emojiContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('emoji')) {
      emojis.forEach(function (emoji) {
        return emoji.classList.remove('selected');
      });
      e.target.classList.add('selected');
      selectedEmoji = e.target.getAttribute('data-value');
      commentField.style.display = 'block';
      submitRatingBtn.style.display = 'block';
    }
  });
  submitRatingBtn.addEventListener('click', function () {
    var comment = commentField.value;
    alert("Votre avis a \xE9t\xE9 sauvegard\xE9 avec succ\xE8s dans votre navigateur.\n\nVotre note : ".concat(selectedEmoji, "\nVotre commentaire : ").concat(comment || 'Aucun commentaire', "\n\nNous ne collectons pas encore ces informations, donc vous \xEAtes le seul \xE0 le voir pour le moment."));
    localStorage.setItem('rating', selectedEmoji);
    localStorage.setItem('comment', comment);
    rateBtn.textContent = 'Gérer mon avis';
    ratePopup.style.display = 'none';
  });
}); // --- CHARGEMENT DES JEUX ET APPLICATIONS ---

document.addEventListener('DOMContentLoaded', function () {
  function loadSection(selector, url) {
    return fetch(url).then(function (response) {
      return response.text();
    }).then(function (data) {
      var section = document.querySelector(selector);

      if (section) {
        section.innerHTML = data;
      }
    });
  }

  loadSection('.games', '../assets/static/pp-games.html').then(function () {
    if (!document.querySelector('.games')) {
      return loadSection('.apps', '../assets/static/pp-apps.html');
    }
  }).then(init);

  function init() {
    // AJUSTEMENT DES CHEMINS
    document.querySelectorAll('.game img, .app img').forEach(function (img) {
      var isGamesPage = window.location.pathname.includes('games/');
      var isAppsPage = window.location.pathname.includes('apps/');
      img.src = isGamesPage || isAppsPage ? '../assets/img/' + img.src.split('/').pop() : 'assets/img/' + img.src.split('/').pop();
    });
    document.querySelectorAll('.game a, .app a').forEach(function (a) {
      if (!a.id) {
        // "Bientôt disponible"
        var isGamesPage = window.location.pathname.includes('games/');
        var isAppsPage = window.location.pathname.includes('apps/');
        a.href = isGamesPage || isAppsPage ? '../' + a.getAttribute('href') : a.getAttribute('href');
      }
    }); // TRI ALPHABÉTIQUE

    function sortItems() {
      var sortValue = document.getElementById("sort-filter").value;
      var items = Array.from(document.querySelectorAll('.game, .app'));
      items.forEach(function (item) {
        return item.style.order = "";
      });

      if (sortValue === 'alpha-games') {
        items.filter(function (item) {
          return item.classList.contains('game');
        }).sort(function (a, b) {
          return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        }).forEach(function (item, index) {
          return item.style.order = index;
        });
      } else if (sortValue === 'alpha-apps') {
        items.filter(function (item) {
          return item.classList.contains('app');
        }).sort(function (a, b) {
          return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        }).forEach(function (item, index) {
          return item.style.order = index;
        });
      } else if (sortValue === 'alpha-all') {
        items.sort(function (a, b) {
          return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        }).forEach(function (item, index) {
          return item.style.order = index;
        });
      }
    }

    var sortFilter = document.getElementById("sort-filter");

    if (sortFilter) {
      sortFilter.addEventListener("change", sortItems);
    } // FILTRES POUR LES JEUX ET APPLICATIONS


    var filterGames = document.getElementById('filter-games');
    var filterApps = document.getElementById('filter-apps');

    if (filterGames) {
      filterGames.addEventListener('change', function () {
        var category = this.value;
        var games = document.querySelectorAll('.game');
        var foundGame = false;
        games.forEach(function (game) {
          if (category === 'all' || game.getAttribute('data-category') === category) {
            game.style.display = 'block';
            foundGame = true;
          } else {
            game.style.display = 'none';
          }
        });

        if (!foundGame) {
          document.querySelector('.games').innerHTML = "<p>Aucun jeu n'est encore disponible pour \"".concat(category, "\".</p>");
        }
      });
    }

    if (filterApps) {
      filterApps.addEventListener('change', function () {
        var category = this.value;
        var apps = document.querySelectorAll('.app');
        var foundApp = false;
        apps.forEach(function (app) {
          if (category === 'all' || app.getAttribute('data-category') === category) {
            app.style.display = 'block';
            foundApp = true;
          } else {
            app.style.display = 'none';
          }
        });

        if (!foundApp) {
          document.querySelector('.apps').innerHTML = "<p>Aucune application n'est encore disponible pour \"".concat(category, "\".</p>");
        }
      });
    } // VUE LISTE ET GRILLE


    var viewSelector = document.getElementById('view-selector');
    var gamesSection = document.querySelector('.games');
    var appsSection = document.querySelector('.apps');

    if (viewSelector && (gamesSection || appsSection)) {
      var applyView = function applyView(view) {
        if (gamesSection) {
          gamesSection.classList.toggle('list-view', view === 'liste');
        }

        if (appsSection) {
          appsSection.classList.toggle('list-view', view === 'liste');
        }
      };

      var savedView = localStorage.getItem('preferredView');

      if (savedView) {
        viewSelector.value = savedView;
        applyView(savedView);
      }

      viewSelector.addEventListener('change', function () {
        var selectedView = viewSelector.value;
        applyView(selectedView);
        localStorage.setItem('preferredView', selectedView);
      });
    }
  }
}); // --- CHARGEMENT DU FOOTER ---

fetch('../assets/static/pp-footer.html').then(function (response) {
  return response.text();
}).then(function (data) {
  document.querySelector('footer').innerHTML = data; // AJUSTEMENT DES CHEMINS

  document.querySelectorAll('footer a').forEach(function (a) {
    a.href = window.location.pathname.includes('games/') ? '../' + a.getAttribute('href') : a.getAttribute('href');
  });
}); // HERO ANIMATION
// Données de texte et images

var Gametexts = ["Réponds aux questions et gagne des points dans Trivia Battle.", "Découvre le parfait mélange de stratégie et de simplicité avec AlignX.", "Retrouve des paires identiques cachées parmi les cartes dans Twin Find.", "Mémorise et reproduis les séquences de couleurs dans Memo tiles.", "Run Snake arrive bientôt. Tu pourras guider le serpent en évitant les obstacles."];
var Gameimg = ["../assets/img/game-TBLogo.png", "../assets/img/game-AXLogo.png", "../assets/img/game-TFLogo.png", "../assets/img/game-MTLogo.png", "../assets/img/game-RSLogo.png"];
var Apptexts = ["Linguo translate.", "Art Board.", "Trick Time.", "Lumi Clock.", "Quick Calculator.", "Pass Master."];
var Appimg = ["../assets/img/app-LTLogo.png", "../assets/img/app-ABLogo.png", "../assets/img/app-TTLogo.png", "../assets/img/app-LCLogo.png", "../assets/img/app-QCLogo.png", "../assets/img/app-PMLogo.png"];
var animations = ['slide-in-left', 'slide-in-top', 'rotate-in', 'fade-in'];
var heroImage = document.getElementById('hero-img');
var GameIntroText = document.getElementById('game-intro');
var AppIntroText = document.getElementById('app-intro');

function animateText(element, text) {
  if (!element) return;
  element.innerHTML = '';
  var randomAnimation = animations[Math.floor(Math.random() * animations.length)];
  text.split('').forEach(function (letter, index) {
    var span = document.createElement('span');
    span.textContent = letter === ' ' ? "\xA0" : letter;
    span.classList.add('letter', randomAnimation);
    span.style.animationDelay = "".concat(index * 0.05, "s");
    element.appendChild(span);
  });
}

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function changeGameContent() {
  if (!GameIntroText) return;
  var randomIndex = getRandomIndex(Gametexts);
  var currentText = Gametexts[randomIndex];
  animateText(GameIntroText, currentText);
  heroImage.src = Gameimg[randomIndex];
}

function changeAppContent() {
  if (!AppIntroText) return;
  var randomIndex = getRandomIndex(Apptexts);
  var currentText = Apptexts[randomIndex];
  animateText(AppIntroText, currentText);
  heroImage.src = Appimg[randomIndex];
}

if (window.location.pathname.includes('games')) {
  changeGameContent();
  setInterval(changeGameContent, 10000);
} else if (window.location.pathname.includes('apps')) {
  changeAppContent();
  setInterval(changeAppContent, 10000);
} // RECHERCHE


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
  var toggleAppsBtn = document.getElementById('toggle-apps-btn');
  var apps = document.querySelectorAll('.apps .app');
  apps.forEach(function (app, index) {
    if (index > 2) app.style.display = 'none';
  });

  if (apps.length <= 3) {
    toggleAppsBtn.style.display = 'none';
  }

  toggleAppsBtn.addEventListener('click', function () {
    if (toggleAppsBtn.textContent === 'Voir plus') {
      apps.forEach(function (app) {
        return app.style.display = 'block';
      });
      toggleAppsBtn.textContent = 'Voir moins';
    } else {
      apps.forEach(function (app, index) {
        if (index > 2) app.style.display = 'none';
      });
      toggleAppsBtn.textContent = 'Voir plus';
    }
  }); // Applications
}); // TRADUCTION

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'fr'
  }, 'google_translate_element');
}

function changeLanguage(lang) {
  var selectField = document.querySelector("select.goog-te-combo");

  if (selectField) {
    selectField.value = lang;
    selectField.dispatchEvent(new Event("change"));
  }
} // BLOQUER LE ZOOM


window.addEventListener('wheel', function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, {
  passive: false
}); // Zoom de la souris

window.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
    e.preventDefault();
  }
}); // Ctrl +/-