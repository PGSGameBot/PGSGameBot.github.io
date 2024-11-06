// CHARGEMENT DES CHEMINS PERSONNALISE
document
let pathToPersoHTML;

if (window.location.pathname.includes('/pages/')) {
  pathToPersoHTML = '../assets/static/pp-perso.html';
} else if (window.location.pathname.includes('/games/')) {
  pathToPersoHTML = '../../assets/static/pp-perso.html';
} else if (window.location.pathname.includes('/apps/')) {
  pathToPersoHTML = '../../assets/static/pp-perso.html';
} else {
  pathToPersoHTML = 'assets/static/pp-perso.html';
}

fetch(pathToPersoHTML)
  .then(response => response.text())
  .then(data => {
    document.querySelector('.perso').innerHTML = data;

    // FILE D'ATTENTTE
    let messageQueue = Promise.resolve();

    function displayMessage(messageElement, message) {
      return new Promise((resolve) => {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        messageElement.style.opacity = '1';

        setTimeout(() => {
          messageElement.style.opacity = '0';
          setTimeout(() => {
            messageElement.style.display = 'none';
            resolve();
          }, 500);
        }, 5000);
      });
    }

    function queueMessage(messageElement, message) {
      messageQueue = messageQueue.then(() => displayMessage(messageElement, message));
    }

    // GESTION DES COULEURS
    document.getElementById('theme-select').addEventListener('change', function () {
      const selectedTheme = this.value;
      document.body.classList.remove('light', 'dark');

      if (selectedTheme === 'light') {
        document.body.classList.add('light');
        queueMessage(document.getElementById('theme-message'), 'On préfère le mode jour ? C\'est super.');
      } else if (selectedTheme === 'dark') {
        document.body.classList.add('dark');
        queueMessage(document.getElementById('theme-message'), 'Wahou, le thème du mystère !');
      } else {
        queueMessage(document.getElementById('theme-message'), 'Hum, on revient à notre coloration ? C\'est génial.');
      }
      saveTheme(selectedTheme);
    });

    function saveTheme(theme) {
      localStorage.setItem('theme', theme);
    }

    function loadTheme() {
      const savedTheme = localStorage.getItem('theme') || 'default-theme';
      document.getElementById('theme-select').value = savedTheme;
      document.body.classList.remove('light', 'dark');
      if (savedTheme === 'light') {
        document.body.classList.add('light');
        queueMessage(document.getElementById('theme-message'), 'Nous avons restauré votre thème Clair.');
      } else if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        queueMessage(document.getElementById('theme-message'), 'Nous avons restauré votre thème Sombre.');
      } else {
        queueMessage(document.getElementById('theme-message'), 'Nous avons restauré votre thème Défaut.');
      }
    }

    // GESTION DES POLICES
    document.getElementById('font-select').addEventListener('change', function () {
      const selectedFont = this.value;
      document.body.classList.remove('modern', 'tradi');

      if (selectedFont === 'modern') {
        document.body.classList.add('modern');
        queueMessage(document.getElementById('font-message'), 'Une époque nouvelle ? Cool.');
      } else if (selectedFont === 'tradi') {
        document.body.classList.add('tradi');
        queueMessage(document.getElementById('font-message'), 'La nostalgie, vous préférez les temps anciens !');
      } else {
        queueMessage(document.getElementById('font-message'), 'Ah oui, c\'est toujours mieux d\'être équilibré.');
      }
      saveFont(selectedFont);
    });

    function saveFont(font) {
      localStorage.setItem('font', font);
    }

    function loadFont() {
      const savedFont = localStorage.getItem('font') || 'default-font';
      document.getElementById('font-select').value = savedFont;
      document.body.classList.remove('modern', 'tradi');
      if (savedFont === 'modern') {
        document.body.classList.add('modern');
        queueMessage(document.getElementById('font-message'), 'Nous avons restauré votre police Moderne.');
      } else if (savedFont === 'tradi') {
        document.body.classList.add('tradi');
        queueMessage(document.getElementById('font-message'), 'Nous avons restauré votre police Classique.');
      } else {
        queueMessage(document.getElementById('font-message'), 'Nous avons restauré votre police Défaut.');
      }
    }

    // GESTION DES TAILLES
    document.getElementById('size-select').addEventListener('change', function () {
      const selectedSize = this.value;
      document.body.classList.remove('mini', 'maxi');

      if (selectedSize === 'mini') {
        document.body.classList.add('mini');
        queueMessage(document.getElementById('size-message'), 'Bah, vous aimez les petites choses sûrement.');
      } else if (selectedSize === 'maxi') {
        document.body.classList.add('maxi');
        queueMessage(document.getElementById('size-message'), 'Okay, vous voulez voir gros ...');
      } else {
        queueMessage(document.getElementById('size-message'), 'C\'est mieux de revenir à la normale.');
      }
      saveSize(selectedSize);
    });

    function saveSize(size) {
      localStorage.setItem('size', size);
    }

    function loadSize() {
      const savedSize = localStorage.getItem('size') || 'default-size';
      document.getElementById('size-select').value = savedSize;
      document.body.classList.remove('mini', 'maxi');
      if (savedSize === 'mini') {
        document.body.classList.add('mini');
        queueMessage(document.getElementById('size-message'), 'Nous avons restauré votre taille Minimale.');
      } else if (savedSize === 'maxi') {
        document.body.classList.add('maxi');
        queueMessage(document.getElementById('size-message'), 'Nous avons restauré votre taille Maximale.');
      } else {
        queueMessage(document.getElementById('size-message'), 'Nous avons restauré votre taille Défaut.');
      }
    }

    // AFFICHER ET MASQUER LE CONTENU PERSO
    const togglePerso = document.getElementById('toggle-perso');
    const persoContent = document.getElementById('perso-content');
    const isPersoContentHidden = localStorage.getItem('persoContentHidden') === 'true';
    if (isPersoContentHidden) {
      persoContent.classList.add('hidden');
      togglePerso.textContent = '🎨';
    } else {
      persoContent.classList.remove('hidden');
      togglePerso.textContent = '🔽';
    }

    togglePerso.addEventListener('click', function () {
      if (persoContent.classList.contains('hidden')) {
        persoContent.classList.remove('hidden');
        togglePerso.textContent = '🔽';
        localStorage.setItem('persoContentHidden', 'false');
      } else {
        persoContent.classList.add('hidden');
        togglePerso.textContent = '🎨';
        localStorage.setItem('persoContentHidden', 'true');
      }
    });

    // CHARGEMENT DES PARAMÈTRES SAUVEGARDÉS
    window.onload = function () {
      loadTheme();
      loadFont();
      loadSize();
    };
  });
