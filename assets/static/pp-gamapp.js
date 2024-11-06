// --- CHARGEMENT HEADER ---
fetch('../assets/static/pp-nav.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('nav').innerHTML = data;

    // MENU
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');

    if (menuIcon && menu) {
      menuIcon.addEventListener('click', function () {
        menu.classList.toggle('show');

        document.addEventListener('click', (event) => {
          const isClickInsideMenu = menu.contains(event.target);
          const isClickOnToggle = menuIcon.contains(event.target);

          if (!isClickInsideMenu && !isClickOnToggle && menu.classList.contains('show')) {
            menu.classList.remove('show');
          }
        });
      });
    }

    // AJUSTEMENT DES CHEMINS
    document.querySelectorAll('header a').forEach(a => {
      a.href = window.location.pathname.includes('games/')
        ? '../' + a.getAttribute('href')
        : a.getAttribute('href');
    });

    // PARTAGER
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (navigator.share) {
          navigator.share({
            title: 'PGS GAME BOT',
            text: 'Jouez, collectez des points, et divertissez-vous avec PGS GAME BOT !',
            url: window.location.href
          }).then(() => {
            console.log('Partager avec succès');
          }).catch((error) => {
            console.error('Erreur lors du partage:', error);
          });
        } else {
          alert('Nous n’arrivons pas à partager PGSGameBot depuis ce navigateur. \nChangez de navigateur et réessayez.');
        }
      });
    }

    // POPUP DE NOTATION
    const rateBtn = document.getElementById('rate-btn');
    const ratePopup = document.getElementById('rate-popup');
    const rateClose = document.getElementById('rate-close');
    const emojiContainer = document.getElementById('emoji-container');
    const emojis = document.querySelectorAll('.emoji');
    const commentField = document.getElementById('comment');
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    let selectedEmoji = null;
    const savedRating = localStorage.getItem('rating');
    const savedComment = localStorage.getItem('comment');

    if (savedRating) {
      rateBtn.textContent = 'Gérer mon avis 📝';
    }

    rateBtn.addEventListener('click', function () {
      ratePopup.style.display = 'flex';

      if (savedRating) {
        emojis.forEach(emoji => emoji.classList.remove('selected'));
        document.querySelector(`.emoji[data-value="${savedRating}"]`).classList.add('selected');
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
        emojis.forEach(emoji => emoji.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedEmoji = e.target.getAttribute('data-value');
        commentField.style.display = 'block';
        submitRatingBtn.style.display = 'block';
      }
    });

    submitRatingBtn.addEventListener('click', function () {
      const comment = commentField.value;
      alert(`Votre avis a été sauvegardé avec succès dans votre navigateur.\n\nVotre note : ${selectedEmoji}\nVotre commentaire : ${comment || 'Aucun commentaire'}\n\nNous ne collectons pas encore ces informations, donc vous êtes le seul à le voir pour le moment.`);

      localStorage.setItem('rating', selectedEmoji);
      localStorage.setItem('comment', comment);

      rateBtn.textContent = 'Gérer mon avis';

      ratePopup.style.display = 'none';
    });
  })


// --- CHARGEMENT DES JEUX ET APPLICATIONS ---
document.addEventListener('DOMContentLoaded', function () {
  function loadSection(selector, url) {
    return fetch(url)
      .then(response => response.text())
      .then(data => {
        const section = document.querySelector(selector);
        if (section) {
          section.innerHTML = data;
        }
      });
  }

  loadSection('.games', '../assets/static/pp-games.html')
    .then(() => {
      if (!document.querySelector('.games')) {
        return loadSection('.apps', '../assets/static/pp-apps.html');
      }
    })
    .then(init);

  function init() {
    // AJUSTEMENT DES CHEMINS
    document.querySelectorAll('.game img, .app img').forEach(img => {
      const isGamesPage = window.location.pathname.includes('games/');
      const isAppsPage = window.location.pathname.includes('apps/');

      img.src = (isGamesPage || isAppsPage)
        ? '../assets/img/' + img.src.split('/').pop()
        : 'assets/img/' + img.src.split('/').pop();
    });

    document.querySelectorAll('.game a, .app a').forEach(a => {
      if (!a.id) { // "Bientôt disponible"
        const isGamesPage = window.location.pathname.includes('games/');
        const isAppsPage = window.location.pathname.includes('apps/');

        a.href = (isGamesPage || isAppsPage)
          ? '../' + a.getAttribute('href')
          : a.getAttribute('href');
      }
    });

    // TRI ALPHABÉTIQUE
    function sortItems() {
      const sortValue = document.getElementById("sort-filter").value;

      let items = Array.from(document.querySelectorAll('.game, .app'));
      items.forEach(item => item.style.order = "");

      if (sortValue === 'alpha-games') {
        items.filter(item => item.classList.contains('game')).sort((a, b) => {
          return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        }).forEach((item, index) => item.style.order = index);
      } else if (sortValue === 'alpha-apps') {
        items.filter(item => item.classList.contains('app')).sort((a, b) => {
          return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        }).forEach((item, index) => item.style.order = index);
      } else if (sortValue === 'alpha-all') {
        items.sort((a, b) => {
          return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        }).forEach((item, index) => item.style.order = index);
      }
    }

    const sortFilter = document.getElementById("sort-filter");
    if (sortFilter) {
      sortFilter.addEventListener("change", sortItems);
    }

    // FILTRES POUR LES JEUX ET APPLICATIONS
    const filterGames = document.getElementById('filter-games');
    const filterApps = document.getElementById('filter-apps');
    
    if (filterGames) {
      filterGames.addEventListener('change', function () {
        let category = this.value;
        let games = document.querySelectorAll('.game');
        let foundGame = false;

        games.forEach(game => {
          if (category === 'all' || game.getAttribute('data-category') === category) {
            game.style.display = 'block';
            foundGame = true;
          } else {
            game.style.display = 'none';
          }
        });

        if (!foundGame) {
          document.querySelector('.games').innerHTML = `<p>Aucun jeu n'est encore disponible pour "${category}".</p>`;
        }
      });
    }

    if (filterApps) {
      filterApps.addEventListener('change', function () {
        let category = this.value;
        let apps = document.querySelectorAll('.app');
        let foundApp = false;

        apps.forEach(app => {
          if (category === 'all' || app.getAttribute('data-category') === category) {
            app.style.display = 'block';
            foundApp = true;
          } else {
            app.style.display = 'none';
          }
        });

        if (!foundApp) {
          document.querySelector('.apps').innerHTML = `<p>Aucune application n'est encore disponible pour "${category}".</p>`;
        }
      });
    }

    // VUE LISTE ET GRILLE
    const viewSelector = document.getElementById('view-selector');
    const gamesSection = document.querySelector('.games');
    const appsSection = document.querySelector('.apps');

    if (viewSelector && (gamesSection || appsSection)) {
      const savedView = localStorage.getItem('preferredView');
      if (savedView) {
        viewSelector.value = savedView;
        applyView(savedView);
      }

      viewSelector.addEventListener('change', function () {
        const selectedView = viewSelector.value;
        applyView(selectedView);
        localStorage.setItem('preferredView', selectedView);
      });

      function applyView(view) {
        if (gamesSection) {
          gamesSection.classList.toggle('list-view', view === 'liste');
        }
        if (appsSection) {
          appsSection.classList.toggle('list-view', view === 'liste');
        }
      }
    }
  }
});


// --- CHARGEMENT DU FOOTER ---
fetch('../assets/static/pp-footer.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('footer').innerHTML = data;

    // AJUSTEMENT DES CHEMINS
    document.querySelectorAll('footer a').forEach(a => {
      a.href = window.location.pathname.includes('games/')
        ? '../' + a.getAttribute('href')
        : a.getAttribute('href');
    });
  });


// HERO ANIMATION
// Données de texte et images
const Gametexts = [
  "Réponds aux questions et gagne des points dans Trivia Battle.",
  "Découvre le parfait mélange de stratégie et de simplicité avec AlignX.",
  "Retrouve des paires identiques cachées parmi les cartes dans Twin Find.",
  "Mémorise et reproduis les séquences de couleurs dans Memo tiles.",
  "Run Snake arrive bientôt. Tu pourras guider le serpent en évitant les obstacles."
];

const Gameimg = [
  "../assets/img/game-TBLogo.png",
  "../assets/img/game-AXLogo.png",
  "../assets/img/game-TFLogo.png",
  "../assets/img/game-MTLogo.png",
  "../assets/img/game-RSLogo.png"
];

const Apptexts = [
  "Linguo translate.",
  "Art Board.",
  "Trick Time.",
  "Lumi Clock.",
  "Quick Calculator.",
  "Pass Master."
];

const Appimg = [
  "../assets/img/app-LTLogo.png",
  "../assets/img/app-ABLogo.png",
  "../assets/img/app-TTLogo.png",
  "../assets/img/app-LCLogo.png",
  "../assets/img/app-QCLogo.png",
  "../assets/img/app-PMLogo.png"
];

const animations = ['slide-in-left', 'slide-in-top', 'rotate-in', 'fade-in'];

const heroImage = document.getElementById('hero-img');
const GameIntroText = document.getElementById('game-intro');
const AppIntroText = document.getElementById('app-intro');

function animateText(element, text) {
  if (!element) return;

  element.innerHTML = '';
  const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

  text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    span.classList.add('letter', randomAnimation);
    span.style.animationDelay = `${index * 0.05}s`;
    element.appendChild(span);
  });
}

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function changeGameContent() {
  if (!GameIntroText) return;

  const randomIndex = getRandomIndex(Gametexts);
  const currentText = Gametexts[randomIndex];
  animateText(GameIntroText, currentText);
  heroImage.src = Gameimg[randomIndex];
}

function changeAppContent() {
  if (!AppIntroText) return;

  const randomIndex = getRandomIndex(Apptexts);
  const currentText = Apptexts[randomIndex];
  animateText(AppIntroText, currentText);
  heroImage.src = Appimg[randomIndex];
}

if (window.location.pathname.includes('games')) {
  changeGameContent();
  setInterval(changeGameContent, 10000); 
} else if (window.location.pathname.includes('apps')) {
  changeAppContent();
  setInterval(changeAppContent, 10000); 
}























// RECHERCHE
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

function displayRecentSearches() {
  const list = document.getElementById('recent-searches-list');
  list.innerHTML = '';

  recentSearches.forEach((search, index) => {
    const li = document.createElement('li');
    li.textContent = search;

    li.addEventListener('mouseover', () => {
      document.getElementById('search-bar').value = search.trim();
    });

    li.addEventListener('click', () => {
      document.getElementById('search-bar').value = search.trim();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.className = 'delete-search';
    deleteButton.dataset.index = index;

    li.appendChild(deleteButton);
    list.appendChild(li);
  });

  document.getElementById('clear-all-searches').style.display = recentSearches.length >= 2 ? 'block' : 'none';
  document.getElementById('recent-searches').style.display = recentSearches.length ? 'block' : 'none';
} // Bande de recherches récentes

let searchTimeout;
document.getElementById('search-bar').addEventListener('keyup', function () {
  clearTimeout(searchTimeout);
  const query = this.value.trim().toLowerCase();

  if (query) {
    searchTimeout = setTimeout(() => {
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
  let games = document.querySelectorAll('.game');
  let apps = document.querySelectorAll('.app');
  let foundGame = false;
  let foundApp = false;

  games.forEach(game => {
    let gameName = game.querySelector('h2').textContent.toLowerCase();
    if (gameName.includes(query)) {
      game.style.display = 'block';
      foundGame = true;
    } else {
      game.style.display = 'none';
    }
  });

  apps.forEach(app => {
    let appName = app.querySelector('h2').textContent.toLowerCase();
    if (appName.includes(query)) {
      app.style.display = 'block';
      foundApp = true;
    } else {
      app.style.display = 'none';
    }
  });

  const gamesSection = document.querySelector('.games');
  const appsSection = document.querySelector('.apps');

  if (!foundGame) {
    gamesSection.innerHTML = `<p>Aucun jeu ne porte "${query}".</p>`;
  }

  if (!foundApp) {
    appsSection.innerHTML = `<p>Aucune application ne porte "${query}".</p>`;
  }
}); // Affichage du résultat


document.getElementById('recent-searches-list').addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-search')) {
    const index = e.target.dataset.index;
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

displayRecentSearches();


// AFFICHAGE / FERMERTURE DE LA BANDE
document.getElementById('search-bar').addEventListener('focus', function () {
  displayRecentSearches(); // Affiche les recherches récentes
}); // Affichage

// Écoute le blur (perte de focus) sur la barre de recherche
document.getElementById('search-bar').addEventListener('blur', function () {
  setTimeout(() => {
    document.getElementById('recent-searches').style.display = 'none';
  }, 200);
}); // Fermeture





// BOUTONS VOIR PLUS/VOIR MOINS
document.addEventListener('DOMContentLoaded', function () {

  const toggleAppsBtn = document.getElementById('toggle-apps-btn');
  const apps = document.querySelectorAll('.apps .app');

  apps.forEach((app, index) => {
    if (index > 2) app.style.display = 'none';
  });

  if (apps.length <= 3) {
    toggleAppsBtn.style.display = 'none';
  }

  toggleAppsBtn.addEventListener('click', function () {
    if (toggleAppsBtn.textContent === 'Voir plus') {
      apps.forEach(app => app.style.display = 'block');
      toggleAppsBtn.textContent = 'Voir moins';
    } else {
      apps.forEach((app, index) => {
        if (index > 2) app.style.display = 'none';
      });
      toggleAppsBtn.textContent = 'Voir plus';
    }
  }); // Applications
});
















// TRADUCTION
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'fr' }, 'google_translate_element');
}

function changeLanguage(lang) {
  var selectField = document.querySelector("select.goog-te-combo");
  if (selectField) {
    selectField.value = lang;
    selectField.dispatchEvent(new Event("change"));
  }
}


// BLOQUER LE ZOOM
window.addEventListener('wheel', function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false }); // Zoom de la souris

window.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
    e.preventDefault();
  }
}); // Ctrl +/-
