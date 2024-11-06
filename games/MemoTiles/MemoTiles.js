const gameBoard = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const difficultySelect = document.getElementById("difficulty");
const timerModeCheckbox = document.getElementById("timer-mode");
const timerDisplay = document.getElementById("timer");
const tiles = [];

const settings = {
    easy: { sequenceLength: 3, displayTime: 1000, timeLimit: 30 },
    medium: { sequenceLength: 4, displayTime: 900, timeLimit: 25 },
    hard: { sequenceLength: 5, displayTime: 800, timeLimit: 20 },
    pro: { sequenceLength: 6, displayTime: 700, timeLimit: 15 }
};

const correctSound = new Audio('../../assets/sounds/correct.mp3');
const incorrectSound = new Audio('../../assets/sounds/incorrect.mp3');
const levelUpSound = new Audio('../../assets/sounds/level-up.mp3');


let sequence = [];
let currentLevel = 1;
let currentStep = 0;
let score = 0;
let highScore = 0;
let difficulty = 'easy';
let timer;
let timeRemaining;
let multiplier = 1;
let bonus = 0;

let victorySoundEnabled = true;
let incorrectSoundEnabled = true;
let levelUpSoundEnabled = true;
let allSoundsEnabled = true;


// Désactiver ou réactiver les sons
document.getElementById('toggle-victory-sound').addEventListener('change', (event) => {
    victorySoundEnabled = !event.target.checked;
});

document.getElementById('toggle-incorrect-sound').addEventListener('change', (event) => {
    incorrectSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-levelup-sound').addEventListener('change', (event) => {
    levelUpSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-all-sounds').addEventListener('change', (event) => {
    allSoundsEnabled = !event.target.checked;
    victorySoundEnabled = incorrectSoundEnabled = levelUpSoundEnabled = allSoundsEnabled;
});


function playCorrectSound() {
    if (allSoundsEnabled && victorySoundEnabled) {
        correctSound.play();
    }
}

function playIncorrectSound() {
    if (allSoundsEnabled && incorrectSoundEnabled) {
        incorrectSound.play();
    }
}

function playLevelUpSound() {
    if (allSoundsEnabled && levelUpSoundEnabled) {
        levelUpSound.play();
    }
}

// Création des tuiles
for (let i = 0; i < 15; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.addEventListener("click", onTileClick);
    gameBoard.appendChild(tile);
    tiles.push(tile);
}

function generateSequence() {
    sequence = [];
    const seqLength = settings[difficulty].sequenceLength;
    for (let i = 0; i < seqLength; i++) {
        const randomIndex = Math.floor(Math.random() * tiles.length);
        sequence.push(tiles[randomIndex]);
    }
}

function showSequence() {
    let step = 0;
    const intervalId = setInterval(() => {
        if (step === sequence.length) {
            clearInterval(intervalId);
            if (timerModeCheckbox.checked) startTimer();
            return;
        }
        const tile = sequence[step];
        tile.classList.add("correct");
        setTimeout(() => {
            tile.classList.remove("correct");
        }, settings[difficulty].displayTime / 2);
        step++;
    }, settings[difficulty].displayTime);
}

function startTimer() {
    timeRemaining = settings[difficulty].timeLimit;
    timerDisplay.textContent = timeRemaining;
    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function onTileClick() {
    const tile = event.target;
    if (tile === sequence[currentStep]) {
        playCorrectSound();
        tile.classList.add("correct");
        currentStep++;
        if (currentStep === sequence.length) {
            clearInterval(timer); 
            score += multiplier + bonus;
            bonus = 0;
            scoreDisplay.textContent = score;
            multiplier++;
            updateHighScore();
            playLevelUpSound();
            currentStep = 0;
            currentLevel++;
            generateSequence();
            setTimeout(() => {
                showSequence();
            }, 1000);
        }
    } else {
        playIncorrectSound();
        tile.classList.add("incorrect");
        setTimeout(() => {
            tile.classList.remove("incorrect");
            endGame();
        }, 500);
    }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
}

function endGame() {
    clearInterval(timer);
    alert(`Raté ! \nVotre score est de ${score}. \nVotre meilleur score : ${highScore}`);
    score = 0;
    currentLevel = 1;
    currentStep = 0;
    multiplier = 1;
    bonus = 0;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = '--';

    startBtn.textContent = "Recommencer";
    startBtn.style.display = "inline";
}

function startGame() {
    startBtn.style.display = "none";
    difficulty = difficultySelect.value;
    generateSequence();
    showSequence();
    multiplier = 1;
    bonus = settings[difficulty].timeLimit;
}

startBtn.addEventListener("click", startGame);
