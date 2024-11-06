const cardsContainer = document.querySelector(".cards");
const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");
const refreshBtn = document.getElementById("refreshBtn");
const startBtn = document.getElementById("startBtn");
const imageTypeSelector = document.getElementById("imageTypeSelector");
const gameModeSelector = document.getElementById("gameModeSelector");
const prefetchSelector = document.getElementById("prefetchSelector");
const difficultySelector = document.getElementById("difficultySelector");
const detailsContainer = document.querySelector(".details");
const controlDiv = document.querySelector(".control");

const animalImages = ["img/anm1.png", "img/anm2.png", "img/anm3.png", "img/anm4.png", "img/anm5.png", "img/anm6.png",];
const fruitImages = ["img/fruit1.png", "img/fruit2.png", "img/fruit3.png", "img/fruit4.png", "img/fruit5.png", "img/fruit6.png",];
const symbolImages = ["img/symb1.png", "img/symb2.png", "img/symb3.png", "img/symb4.png", "img/symb5.png", "img/symb6.png",];

gameModeSelector.addEventListener("change", function () {
  const selectedMode = gameModeSelector.value;
  if (selectedMode === "none") {
    difficultySelector.disabled = true;
  } else {
    difficultySelector.disabled = false;
    setDifficultySettings(); 
  }
});

let maxTime = 120;
let timeLeft = maxTime;
let maxFlips = 20;
let flipsLeft = maxFlips;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
let gameMode = 'all';
let prefetch = 'yes';
let prefetchDuration = 2000;


// Fonction pour démarrer ou reprendre le jeu
function startOrResumeGame() {
  if (isPlaying) {
    shuffleCard();
  } else {
    startGame();
  }
}

// Selection des images
function getSelectedImages() {
  const selectedType = imageTypeSelector.value;
  if (selectedType === "animals") {
    return animalImages;
  } else if (selectedType === "fruits") {
    return fruitImages;
  } else {
    return symbolImages;
  }
}

// Paramètre de difficulté
function setDifficultySettings() {

  if (gameMode === "none") {
    maxTime = Infinity;
    maxFlips = Infinity;
    timeTag.innerText = "∞";
    flipsTag.innerText = "∞";
    difficultySelector.disabled = true;
  } else {
    difficultySelector.disabled = false;
    const difficulty = difficultySelector.value;

    if (difficulty === "easy") {
      maxTime = 120;
      maxFlips = 20;
      prefetchDuration = prefetch === "yes" ? 2000 : 0;
    } else if (difficulty === "medium") {
      maxTime = 90;
      maxFlips = 16;
      prefetchDuration = prefetch === "yes" ? 1000 : 0;
    } else if (difficulty === "hard") {
      maxTime = 60;
      maxFlips = 12;
      prefetchDuration = prefetch === "yes" ? 100 : 0;
    }

    timeLeft = maxTime;
    flipsLeft = maxFlips;
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flipsLeft;
  }
}

// Création des cartes
function createCards() {
  let cardImages = getSelectedImages();
  let cardArray = [...cardImages, ...cardImages];
  cardArray.sort(() => Math.random() > 0.5 ? 1 : -1);

  cardsContainer.innerHTML = '';

  cardArray.forEach(imgSrc => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
            <div class="view front-view">
                <img src="img/0back.png" alt="Carte fermée">
            </div>
            <div class="view back-view">
                <img src="${imgSrc}" alt="Carte ouverte">
            </div>
        `;

    cardsContainer.appendChild(card);
    card.addEventListener("click", flipCard);
  });
}

// Durée
function initTimer() {
  if (gameMode === "none") return;

  if (timeLeft <= 0) {
    clearInterval(timer);
    isPlaying = false;
    alert("Temps écoulé !");
    return;
  }

  timeLeft--;
  timeTag.innerText = timeLeft;
}

// Retourner les cartes
function flipCard(e) {
  const clickedCard = e.currentTarget;

  if (!isPlaying || disableDeck || clickedCard === cardOne || clickedCard.classList.contains('flip') || timeLeft <= 0 || flipsLeft <= 0) return;

  flipsLeft--;
  flipsTag.innerText = flipsLeft;
  clickedCard.classList.add("flip");

  if (!cardOne) {
    cardOne = clickedCard;
    return;
  }

  cardTwo = clickedCard;
  disableDeck = true;

  let cardOneImg = cardOne.querySelector(".back-view img").src;
  let cardTwoImg = cardTwo.querySelector(".back-view img").src;

  matchCards(cardOneImg, cardTwoImg);
}

// Vérifaction de correspondance des cartes
function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard === getSelectedImages().length && timeLeft > 0) {
      clearInterval(timer);
      isPlaying = false;
      alert("Félicitations, vous avez gagné !");
    }

    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;
    return;
  }

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

// Démarrer du jeu
function startGame() {
  controlDiv.style.display = "none";
  detailsContainer.style.display = "flex";
  cardsContainer.style.display = "flex";

  gameMode = gameModeSelector.value;
  prefetch = prefetchSelector.value;

  setDifficultySettings();

  if (gameMode === 'none') {
    timeTag.parentElement.style.display = 'block'; // None
    flipsTag.parentElement.style.display = 'block'; // None
  } else if (gameMode === 'time') {
    timeTag.parentElement.style.display = 'block';
    flipsTag.parentElement.style.display = 'none';
  } else if (gameMode === 'flips') {
    timeTag.parentElement.style.display = 'none';
    flipsTag.parentElement.style.display = 'block';
  } else if (gameMode === 'all') {
    timeTag.parentElement.style.display = 'block';
    flipsTag.parentElement.style.display = 'block';
  }

  createCards();

  const allCards = document.querySelectorAll(".card");

  if (prefetch === 'yes') {
    allCards.forEach(card => card.classList.add("flip"));

    setTimeout(() => {
      allCards.forEach(card => card.classList.remove("flip"));
      isPlaying = true;
      startBtn.innerText = "Arrêter";
      startBtn.classList.add("uvs-esc");
      if (gameMode !== 'flips') {
        timer = setInterval(initTimer, 1000);
      }
    }, prefetchDuration);
  } else {
    isPlaying = true;
    startBtn.innerText = "Arrêter";
    startBtn.classList.add("uvs-esc");
    if (gameMode !== 'flips') {
      timer = setInterval(initTimer, 1000);
    }
  }
}


// Mélange des cartes et recommencer le jeu
function shuffleCard() {
  timeLeft = maxTime;
  flipsLeft = maxFlips;
  matchedCard = 0;
  cardOne = cardTwo = "";
  disableDeck = false;
  isPlaying = false;
  clearInterval(timer);

  timeTag.innerText = timeLeft;
  flipsTag.innerText = flipsLeft;
  cardsContainer.innerHTML = "";

  controlDiv.style.display = "block";
  detailsContainer.style.display = "none";

  startBtn.innerText = "Démarrer";
  startBtn.classList.remove("uvs-esc");
}

startBtn.addEventListener("click", startOrResumeGame);
