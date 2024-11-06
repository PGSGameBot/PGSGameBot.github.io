const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+[]{}<>?";
const consonants = "bcdfghjklmnpqrstvwxyz";
const vowels = "aeiou";
const words = ["lune", "volant", "doux", "raisin", "chat", "arbre", "pierre", "mer"];

const copySound = new Audio('../../assets/sounds/del.mp3');
const genSound = new Audio('../../assets/sounds/click.mp3');
const downSound = new Audio('../../assets/sounds/clear.mp3');

let copySoundEnabled = true;
let genSoundEnabled = true;
let downSoundEnabled = true;
let allSoundsEnabled = true;


// Désactiver ou réactiver les sons
document.getElementById('toggle-copy-sound').addEventListener('change', (event) => {
  copySoundEnabled = !event.target.checked;
});

document.getElementById('toggle-gen-sound').addEventListener('change', (event) => {
  genSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-down-sound').addEventListener('change', (event) => {
  downSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-all-sounds').addEventListener('change', (event) => {
  allSoundsEnabled = !event.target.checked;
  copySoundEnabled = genSoundEnabled = downSoundEnabled = allSoundsEnabled;
});

function playCopySound() {
  if (allSoundsEnabled && copySoundEnabled) {
    copySound.play();
  }
}

function playGenSound() {
  if (allSoundsEnabled && genSoundEnabled) {
    genSound.play();
  }
}

function playDownSound() {
  if (allSoundsEnabled && downSoundEnabled) {
    downSound.play();
  }
}


document.getElementById("generate-btn").addEventListener("click", generatePassword);
document.getElementById("copy-btn").addEventListener("click", copyPassword);
document.getElementById("toggle-history-btn").addEventListener("click", toggleHistory);
document.getElementById("toggle-password-visibility").addEventListener("click", togglePasswordVisibility);

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('history-list').style.display = 'none';
  document.getElementById('toggle-history-btn').style.display = 'none';
});

document.getElementById('validity').addEventListener('change', function () {
  const expirationInput = document.getElementById('expiration');
  const expirationLabel = document.getElementById('expiration-label');
  if (this.value === 'oui') {
    expirationInput.style.display = 'block';
    expirationLabel.style.display = 'block';
  } else {
    expirationInput.style.display = 'none';
    expirationLabel.style.display = 'none';
  }
});

// Visibilité du div passedef (Définition du mot de passe)
document.querySelector('.passedef').style.display = 'none';

document.querySelectorAll('.passetype input').forEach(input => {
  input.addEventListener('change', () => {
    const passedefDiv = document.querySelector('.passedef');
    if (document.getElementById('readable').checked || document.getElementById('todef').checked) {
      passedefDiv.style.display = 'block';
      document.getElementById('symbols').disabled = document.getElementById('readable').checked;
    } else {
      passedefDiv.style.display = 'none';
      document.getElementById('symbols').disabled = false;
    }
    toggleGenerateButton();
  });
});

// Désactivaction du bouton Générer
function toggleGenerateButton() {
  const passetypeSelected = document.querySelector('.passetype input:checked');
  const passdefChecked = document.querySelector('.passedef input:checked');
  const isDisabled = !passetypeSelected ||
    (document.getElementById('todef').checked || document.getElementById('readable').checked) && !passdefChecked;

  document.getElementById("generate-btn").disabled = isDisabled;
}

document.addEventListener('DOMContentLoaded', toggleGenerateButton);
document.querySelectorAll('.passetype input, .passedef input').forEach(input => {
  input.addEventListener('change', toggleGenerateButton);
});

// Désactivation des caractères spéciaux pour passe lisible
document.getElementById('readable').addEventListener('change', () => {
  const symbolsCheckbox = document.getElementById('symbols');
  symbolsCheckbox.disabled = true;
  symbolsCheckbox.checked = false;
});

// Mode sécurisé
function togglePasswordVisibility() {
  const passwordField = document.getElementById("generated-password");
  const toggleButton = document.getElementById("toggle-password-visibility");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleButton.textContent = "🚫";
  } else {
    passwordField.type = "password";
    toggleButton.textContent = "👁️";
  }
}

// Généner le mot de passe
function generatePassword() {
  const length = parseInt(document.getElementById("length").value);
  const numWords = 4;
  const readable = document.getElementById("readable").checked;
  const passphrase = document.getElementById("passphrase").checked;
  const secureMode = document.getElementById("secure-mode").checked;
  const passwordField = document.getElementById("generated-password");
  const validity = document.getElementById("validity").value;

  let password = "";

  if (passphrase) {
    password = generatePassphrase(numWords);
  } else if (readable) {
    password = generateReadablePassword(length);
  } else {
    let characters = "";
    if (document.getElementById("uppercase").checked) characters += uppercaseLetters;
    if (document.getElementById("lowercase").checked) characters += lowercaseLetters;
    if (document.getElementById("numbers").checked) characters += numbers;
    if (document.getElementById("symbols").checked) characters += symbols;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  }

  passwordField.value = password;
  passwordField.classList.toggle("secure-mode", secureMode);

  togglePasswordVisibility();
  updateUI(password);

  if (secureMode) {
    passwordField.type = "password";
    document.getElementById("toggle-password-visibility").textContent = "👁️";
  } else {
    passwordField.type = "text";
    document.getElementById("toggle-password-visibility").textContent = "🚫";
  }


  if (validity === "oui") {
    const expirationDate = calculateExpirationDate();
    alert(`Mot de passe expirera le ${expirationDate}`);
  }

  playGenSound();
}


// Fonction pour les différents types de génération
function generatePassphrase(numWords) {
  return Array.from({ length: numWords }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
} // Phrase de passe

function generateReadablePassword(length) {
  const includeUppercase = document.getElementById('uppercase').checked;
  const includeNumbers = document.getElementById('numbers').checked;
  let password = "";

  while (password.length < length) {
    let word = words[Math.floor(Math.random() * words.length)];
    if (includeUppercase && Math.random() > 0.5) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    password += word;
    if (includeNumbers && Math.random() > 0.5) {
      password += Math.floor(Math.random() * 10);
    }
  }

  return password.slice(0, length);
} // Passe lisible

// Expiration
function calculateExpirationDate() {
  const expiration = parseInt(document.getElementById("expiration").value);
  const now = new Date();
  now.setDate(now.getDate() + expiration);
  return now.toLocaleDateString();
}

// --
function updateUI(password) {
  const passwordField = document.getElementById("generated-password");
  const copyBtn = document.getElementById("copy-btn");
  const saveBtn = document.getElementById("save-btn");
  const historyList = document.getElementById("history-list");

  copyBtn.disabled = !password;
  saveBtn.disabled = !password;

  addToHistory(password);
  updateStrengthIndicator(password);

  if (historyList.childElementCount > 0) {
    document.getElementById("toggle-history-btn").style.display = 'inline-block';
    historyList.style.display = 'none';
  }
}

// Historique des mots de passe
function addToHistory(password) {
  const historyList = document.getElementById("history-list");
  if (historyList.childElementCount >= 5) {
    historyList.removeChild(historyList.lastElementChild);
  }

  const listItem = document.createElement("li");
  listItem.textContent = password;
  listItem.addEventListener("click", () => {
    document.getElementById("generated-password").value = password;
  });
  historyList.prepend(listItem);
  updateHistoryButtonVisibility();
} // Ajout à l'historique

function updateHistoryButtonVisibility() {
  const historyList = document.getElementById("history-list");
  document.getElementById("toggle-history-btn").style.display = historyList.childElementCount > 0 ? 'inline-block' : 'none';
} // Mise à jour du bouton de l'historique

function toggleHistory() {
  const historyList = document.getElementById("history-list");
  const toggleBtn = document.getElementById("toggle-history-btn");

  if (historyList.style.display === "none") {
    historyList.style.display = "block";
    toggleBtn.textContent = "Masquer l'historique";
  } else {
    historyList.style.display = "none";
    toggleBtn.textContent = "Afficher l'historique";
  }
} // Masquer l'historique si vide

// Indicateur de sécurité
function updateStrengthIndicator(password) {
  const strengthText = document.getElementById("strength-text");
  const strength = calculatePasswordStrength(password);

  if (strength < 2) {
    strengthText.textContent = "Faible";
    strengthText.style.color = "red";
  } else if (strength < 3) {
    strengthText.textContent = "Moyenne";
    strengthText.style.color = "orange";
  } else {
    strengthText.textContent = "Forte";
    strengthText.style.color = "green";
  }
}

function calculatePasswordStrength(password) {
  let strength = 0;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[\W_]/.test(password)) strength++;
  return strength;
}

// Copie
function copyPassword() {
  const passwordField = document.getElementById("generated-password");
  passwordField.select();
  passwordField.setSelectionRange(0, 99999); // Pour les mobiles

  document.execCommand("copy");
  playCopySound();
  alert("Mot de passe copié !");
}

// Sauvergarde local
function savePasswordsToFile() {
  const historyList = document.getElementById("history-list");
  const passwords = [];

  historyList.querySelectorAll("li").forEach(item => {
    passwords.push(item.textContent);
  });

  const blob = new Blob([passwords.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Password_Par_PassMaster.txt";
  link.click();

  playDownSound()
  alert(`Mots de passe téléchargé avec succès`);
}

document.getElementById("save-btn").addEventListener("click", savePasswordsToFile);
