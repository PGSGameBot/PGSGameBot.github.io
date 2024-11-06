// CHARGER LA NAVIGATION ET LE FOOTER
fetch('../../assets/static/comon-nav.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('nav').innerHTML = data;

    // MENU
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('show');
      menuToggle.classList.toggle('x');
    });

    document.addEventListener('click', (event) => {
      const isClickInsideMenu = menu.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickOnToggle && menu.classList.contains('show')) {
        menu.classList.remove('show');
        menuToggle.classList.remove('x');
      }
    });

    // PARTAGER
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (navigator.share) {
          navigator.share({
            title: 'Découvrez cette merveille créee par PRO GESTION SOFT',
            text: 'Découvrez cette merveille créee par PRO GESTION SOFT. \n Amusez-vous et améliorez votre capacité intellectuelle.',
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
  }); //Navigation

fetch('../../assets/static/comon-footer.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('footer').innerHTML = data;
  }); //Footer


// INSTRUCTIONS
document.getElementById('toggle-instructions-btn').addEventListener('click', function () {
  const instructions = document.getElementById('instructions');
  if (instructions.style.display === 'none') {
    instructions.style.display = 'block';
    this.textContent = 'Masquer les instructions';
  } else {
    instructions.style.display = 'none';
    this.textContent = 'Afficher les instructions';
  }
});


// REGLAGE DES SONS
document.getElementById('toggle-sound-settings-btn').addEventListener('click', () => {
  document.getElementById('sound-settings').style.display = 'block';
});

document.getElementById('sound-settings-btn').addEventListener('click', () => {
  document.getElementById('sound-settings').style.display = 'none';
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
window.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false }); // Zoom de la souris

window.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
    e.preventDefault();
  }
}); // Zoom avec Ctrl +/-