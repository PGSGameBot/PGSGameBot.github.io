// CHARGEMENT DU MENU
fetch('page-nav.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('nav').innerHTML = data;

    // MENU
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');

    if (menuIcon && menu) {
      menuIcon.addEventListener('click', function () {
        menu.classList.toggle('show'); // Ouvrir le menu

        document.addEventListener('click', (event) => {
          const isClickInsideMenu = menu.contains(event.target);
          const isClickOnToggle = menuIcon.contains(event.target);

          if (!isClickInsideMenu && !isClickOnToggle && menu.classList.contains('show')) {
            menu.classList.remove('show'); // Fermer le menu
          }
        });
      });
    }
  }); //Navigation


fetch('page-footer.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('footer').innerHTML = data;
  }); //Footer


// BOUTON COPIER
document.addEventListener('DOMContentLoaded', function () {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', function () {
      const codeElement = document.querySelector(this.getAttribute('data-clipboard-target'));
      const range = document.createRange();
      range.selectNode(codeElement);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      try {
        document.execCommand('copy');
        alert('Copié !');
      } catch (err) {
        alert('Erreur lors de la copie.');
      }
      window.getSelection().removeAllRanges();
    });
  });
});


// BOUTON VOIR PLUS/VOIR MOINS
document.addEventListener('DOMContentLoaded', function () {

  function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = section.querySelector('.toggle-button');
    const items = section.querySelectorAll('h3');
    const maxVisibleItems = 5;
    let isCollapsed = true;

    items.forEach((item, index) => {
      if (index >= maxVisibleItems) {
        item.style.display = 'none';
        item.nextElementSibling.style.display = 'none';
      }
    });

    button.addEventListener('click', function () {
      if (isCollapsed) {
        items.forEach(item => {
          item.style.display = 'block';
          item.nextElementSibling.style.display = 'block';
        });
        button.textContent = 'Voir moins';
      } else {
        items.forEach((item, index) => {
          if (index >= maxVisibleItems) {
            item.style.display = 'none';
            item.nextElementSibling.style.display = 'none';
          }
        });
        button.textContent = 'Voir plus';
      }
      isCollapsed = !isCollapsed;
    });

    if (items.length > maxVisibleItems) {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  }

  toggleSection('historique');
  toggleSection('prochainement');
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