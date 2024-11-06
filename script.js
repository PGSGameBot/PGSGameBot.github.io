// --- CHARGEMENT HEADER ---
fetch('assets/static/pp-nav.html')
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


// --- CHARGEMENT DES JEUX ---
fetch('assets/static/pp-games.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('.games').innerHTML = data;

    // BOUTONS VOIR PLUS/VOIR MOINS 
    const toggleGamesBtn = document.getElementById('toggle-games-btn');
    const games = document.querySelectorAll('.games .game');

    games.forEach((game, index) => {
      if (index > 2) game.style.display = 'none';
    });

    if (games.length <= 3) {
      toggleGamesBtn.style.display = 'none';
    }

    toggleGamesBtn.addEventListener('click', function () {
      if (toggleGamesBtn.textContent === 'Dérouler les jeux 🔻') {
        games.forEach(game => game.style.display = 'block');
        toggleGamesBtn.textContent = 'Réduire les jeux 🔺';
      } else {
        games.forEach((game, index) => {
          if (index > 2) game.style.display = 'none';
        });
        toggleGamesBtn.textContent = 'Dérouler les jeux 🔻';
      }
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des jeux :', error);
  });


// --- CHARGEMENT DES APPLICATIONS ---
fetch('assets/static/pp-apps.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('.apps').innerHTML = data;

    // BOUTONS VOIR PLUS/VOIR MOINS 
    const toggleAppsBtn = document.getElementById('toggle-apps-btn');
    const apps = document.querySelectorAll('.apps .app');

    apps.forEach((app, index) => {
      if (index > 2) app.style.display = 'none';
    });

    if (apps.length <= 3) {
      toggleAppsBtn.style.display = 'none';
    }

    toggleAppsBtn.addEventListener('click', function () {
      if (toggleAppsBtn.textContent === 'Dérouler les applications 🔻') {
        apps.forEach(app => app.style.display = 'block');
        toggleAppsBtn.textContent = 'Réduire les applications 🔺';
      } else {
        apps.forEach((app, index) => {
          if (index > 2) app.style.display = 'none';
        });
        toggleAppsBtn.textContent = 'Dérouler les applications 🔻';
      }
    }); // Applications
  })
  .catch(error => {
    console.error('Erreur lors du chargement des jeux :', error);
  });


// --- CHARGEMENT FOOTER ---
fetch('assets/static/pp-footer.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('footer').innerHTML = data;
  });


// ANNONCE
function closeAnnouncement() {
  const announcementBar = document.querySelector('.announcement-bar');
  announcementBar.style.display = 'none';
}


// HERO
const texts = [
  "Es-tu prêt à relever des défis uniques et à explorer des outils révolutionnaires ? Plonge dans l’aventure dès maintenant !",
  "Prépare-toi à découvrir un univers où jeux et innovation se rencontrent. L’aventure t’attend, commençons !",
  "Il est temps de t'immerger dans un monde de jeux inédits et d'applications performantes. Laisse-toi guider, l’aventure démarre ici !",
  "Laisse-nous te surprendre avec nos jeux et applications. Es-tu prêt pour cette nouvelle aventure ? C’est parti !",
  "À toi de jouer ! Embarque pour une expérience unique où chaque instant compte. L’aventure commence ici et maintenant.",
  "Entre dans un monde où l’innovation et l’amusement se rejoignent. Tu es à un clic de commencer une aventure incroyable."
];

const images = [
  "assets/img/pp-repository.png",
  "assets/img/pp-repo-TB.png",
  "assets/img/pp-repo-MT.png",
  "assets/img/pp-repo-RS.png"
];

const heroImage = document.getElementById('hero-img');
heroImage.src = getRandomItem(images);
const heroParagraph = document.getElementById('hero-paragraph');
const animations = ['slide-in-left', 'slide-in-top', 'rotate-in', 'fade-in'];

let currentTextIndex = 0;

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function displayTextWithAnimation(text) {
  heroParagraph.innerHTML = '';

  const randomAnimation = getRandomItem(animations);

  text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    span.classList.add('letter', randomAnimation);

    span.style.animationDelay = `${index * 0.05}s`;
    heroParagraph.appendChild(span);
  });
}

function changeText() {
  const text = texts[currentTextIndex];
  displayTextWithAnimation(text);
  currentTextIndex = (currentTextIndex + 1) % texts.length;
}

changeText();
setInterval(changeText, 10000);


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


// FILTRES
document.getElementById('filter-games').addEventListener('change', function () {
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
}); // Jeux

document.getElementById('filter-apps').addEventListener('change', function () {
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
}); // Applications


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

document.getElementById("sort-filter").addEventListener("change", sortItems);


// POPUP PUBLICITE
document.addEventListener('DOMContentLoaded', function () {

  const popup = document.getElementById('popup');
  const popupClose = document.getElementById('popup-close');
  const continuer = document.getElementById('popup-close-btn');

  function showPopup() {
    popup.style.display = 'flex';
  }

  popupClose.addEventListener('click', function () {
    popup.style.display = 'none';
  });

  continuer.addEventListener('click', function () {
    popup.style.display = 'none';
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('showPopup') === 'true') {
    showPopup();
  }
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
