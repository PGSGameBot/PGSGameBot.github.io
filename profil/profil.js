// CHARGEMENT GLOBAL
window.onload = function () {
  displayProfile();
  initializePhoneInput();
  handleFormInput();
};


// CHARGEMENT DU PROFIL
function displayProfile() {
  const profileImage = localStorage.getItem("profileImage") || "../assets/img/auth-Profil.png";
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const username = localStorage.getItem("username") || "";
  const dob = localStorage.getItem("dob") || "";
  const gender = localStorage.getItem("gender") || "";
  const email = localStorage.getItem("email") || "";
  const phone = localStorage.getItem("phone") || "";
  const bio = localStorage.getItem("bio") || "";

  document.getElementById("profileImage").src = profileImage;

  const profileInfoDisplay = document.getElementById("profile-info-Display");
  const hasInfo = [
    updateFieldDisplay("firstNameDisplay", "Prénoms : ", firstName),
    updateFieldDisplay("lastNameDisplay", "Nom : ", lastName),
    updateFieldDisplay("usernameDisplay", "Nom d'utilisateur : ", username),
    updateFieldDisplay("dobDisplay", "Date de naissance : ", dob),
    updateFieldDisplay("genderDisplay", "Sexe : ", gender),
    updateFieldDisplay("emailDisplay", "Adresse mail : ", email),
    updateFieldDisplay("phoneDisplay", "Numéro de téléphone : ", phone),
    updateFieldDisplay("bioDisplay", "Bibliographie : ", bio)
  ].some(Boolean);

  profileInfoDisplay.style.display = hasInfo ? "block" : "none";

  const deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.style.display = username ? "block" : "none";
} // Affichage des infos

function updateFieldDisplay(fieldId, labelText, value) {
  const field = document.getElementById(fieldId);
  if (value) {
    field.innerHTML = `${labelText}<span class="user-info">${value}</span>`;
    field.style.display = "block";
    return true;
  } else {
    field.style.display = "none";
    return false;
  }
} // Mise en forme des infos


// MODIFICATION DU PROFIL
document.getElementById("editBtn").addEventListener("click", function () {
  document.getElementById("profileDisplay").style.display = "none";
  document.getElementById("profileEdit").style.display = "block";

  document.getElementById("firstName").value = localStorage.getItem("firstName") || "";
  document.getElementById("lastName").value = localStorage.getItem("lastName") || "";
  document.getElementById("username").value = localStorage.getItem("username") || "";
  document.getElementById("dob").value = localStorage.getItem("dob") || "";
  document.getElementById("gender").value = localStorage.getItem("gender") || "";
  document.getElementById("email").value = localStorage.getItem("email") || "";
  document.getElementById("phone").value = localStorage.getItem("phone") || "";
  document.getElementById("bio").value = localStorage.getItem("bio") || "";
});


// SAUVERGARDE DES DONNEES
document.getElementById("saveBtn").addEventListener("click", function () {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const username = document.getElementById("username").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const bio = document.getElementById("bio").value;

  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  const dayDiff = today.getDate() - dobDate.getDate();

  // Alertes
  if (!username) {
    alert("Veuillez définir un nom d’utilisateur avant de poursuivre.");
    return;
  }

  if (!validateUsernameLength(username)) {
    alert("Le nom d'utilisateur doit comporter au moins 5 caractères.");
    return;
  }

  if (!dob) {
    alert("Veuillez définir date de naissance avant de poursuivre.");
    return;
  }

  if (age < 15 || (age === 15 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
    alert("Vous devez avoir au moins 15 ans.");
    return;
  }

  if (age > 150 || (age === 150 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
    alert("Serieux, aussi vieux que ça ?");
    return;
  }

  if (!validateEmail(email)) {
    alert("Veuillez entrer une adresse e-mail valide.");
    return;
  }

  localStorage.setItem("firstName", capitalize(firstName));
  localStorage.setItem("lastName", capitalize(lastName));
  localStorage.setItem("username", username);
  localStorage.setItem("dob", dob);
  localStorage.setItem("gender", gender);
  localStorage.setItem("email", email);
  localStorage.setItem("phone", phone);
  localStorage.setItem("bio", bio);

  document.getElementById("profileEdit").style.display = "none";
  document.getElementById("profileDisplay").style.display = "block";

  displayProfile();
});

// AUTRES BOUTONS
document.getElementById("cancelBtn").addEventListener("click", function () {
  document.getElementById("profileEdit").style.display = "none";
  document.getElementById("profileDisplay").style.display = "block";
}); // Annuler

document.getElementById("deleteBtn").addEventListener("click", function () {
  const username = localStorage.getItem("username") || "utilisateur";
  const confirmation = prompt(`Pour confirmer la suppression, tapez "Supprimer définitivement ${username}"`);

  if (confirmation === `Supprimer définitivement ${username}`) {
    localStorage.clear();
    alert("Dommage de vous voir partir ! \nVotre profil a été supprimé avcec succès."); displayProfile();
  } else { alert("Erreur de confirmation ! \nLa suppression du profil a échouée."); }
}); // Supprimer

document.getElementById("moreInfoBtn").addEventListener("click", function () {
  const moreInfoText = document.getElementById("moreInfoText");
  const moreInfoBtn = document.getElementById("moreInfoBtn");

  if (moreInfoText.style.display === "none") {
    moreInfoText.style.display = "block";
    moreInfoBtn.textContent = "Masquer 🔺";
  } else {
    moreInfoText.style.display = "none";
    moreInfoBtn.textContent = "En savoir plus 🔻";
  }
}); //En savoir plus


// RESTRICTIONS DES CHAMPS
function capitalize(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} // Premières lettres majuscule

function validateNameInput(input) {
  input.value = input.value.replace(/[0-9]/g, '');
} // Caractère alphabetique

function validateUsernameInput(input) {
  input.value = input.value.replace(/\s/g, '');
} // Sans espace

function validateUsernameLength(username) {
  return username.length >= 5;
} // Minimun 5 caractères

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
} // Email

document.getElementById("firstName").addEventListener("input", function () {
  validateNameInput(this);
});

document.getElementById("lastName").addEventListener("input", function () {
  validateNameInput(this);
});

document.getElementById("username").addEventListener("input", function () {
  validateUsernameInput(this);
});


// Bouton Sauvegarder
function handleFormInput() {
  const fields = document.querySelectorAll("#firstName, #lastName, #username, #dob, #gender, #email, #phone, #bio");
  const saveBtn = document.getElementById("saveBtn");

  checkFields();

  fields.forEach(field => {
    field.addEventListener("input", function () {
      checkFields();
    });
  });

  function checkFields() {
    let isAnyFieldFilled = false;
    fields.forEach(field => {
      if (field.value.trim() !== "") {
        isAnyFieldFilled = true;
      }
    });

    if (isAnyFieldFilled) {
      saveBtn.style.display = "block";
    } else {
      saveBtn.style.display = "none";
    }
  }
}


// Photo de profil
document.getElementById("changePicBtn").addEventListener("click", function () {
  document.getElementById("profilePic").click();
});

document.getElementById("profilePic").addEventListener("change", function () {
  const file = this.files[0]; if (file) {
    const reader = new FileReader(); reader.onload = function (e) {
      document.getElementById("profileImage").src = e.target.result; localStorage.setItem("profileImage", e.target.result);
    }; reader.readAsDataURL(file);
  }
});



// Indicatif téléphonique
function initializePhoneInput() {
  const input = document.querySelector("#phone");
  window.intlTelInput(input, {
    initialCountry: "bj",
    geoIpLookup: function (callback) {
      fetch('https://ipinfo.io/json?token=demo')
        .then(response => response.json())
        .then(data => {
          const countryCode = (data && data.country) ? data.country : "bj";
          callback(countryCode);
        });
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });
}


// MENU
document.addEventListener('DOMContentLoaded', () => {
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
});


// Traduction
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
