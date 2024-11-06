const correctSound = new Audio('../../assets/sounds/correct.mp3');
const incorrectSound = new Audio('../../assets/sounds/incorrect.mp3');
const levelUpSound = new Audio('../../assets/sounds/level-up.mp3');

const categoryNames = {
    culture: "Culture d'entreprise",
    science: "Science",
    math: "Mathématiques",
    it: "Informatique",
    biology: "Biologie",
    accounting: "Comptabilité",
    projectManagement: "Gestion de projet",
    en: "Anglais",
    fr: "Français",
    bj: "Bénin",
    sport: "Sport"
};

let score = 0;
let bestScore = 0;
let currentQuestionIndex = 0;
let countdownTimer;
let timeLeft;
let selectedDifficulty;
let selectedCategory;
let shuffledQuestions = [];
let questions = {};
let difficultySettings = {
    easy: { questions: 10, timer: 30 },
    medium: { questions: 15, timer: 20 },
    hard: { questions: 20, timer: 10 }
};
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

// Chargement des questions et reponses
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    })
    .catch(error => console.error('Erreur lors du chargement des questions:', error));

// Mélange du tableau
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    document.getElementById('start-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    selectedCategory = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    selectedDifficulty = difficultySettings[difficulty];

    score = 0;
    currentQuestionIndex = 0;

    bestScore = localStorage.getItem('bestScore') || 0;
    document.getElementById('best-score').textContent = `Meilleur score : ${bestScore}`;

    shuffledQuestions = shuffle([...questions[selectedCategory]]).slice(0, selectedDifficulty.questions);

    displayQuestion();
}

function displayQuestion() {
    const questionContainer = document.getElementById('question');
    const answersContainer = document.getElementById('answers');
    const questionNumberContainer = document.getElementById('question-number');

    answersContainer.innerHTML = '';

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const totalQuestions = selectedDifficulty.questions;

    questionNumberContainer.textContent = `Q${currentQuestionIndex + 1}/${totalQuestions} dans ${categoryNames[selectedCategory]}`;

    const shuffledAnswers = shuffle(currentQuestion.answers.map((answer, index) => ({ answer, index })));

    questionContainer.textContent = currentQuestion.question;

    shuffledAnswers.forEach(({ answer, index }) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index, button));
        answersContainer.appendChild(button);
    });

    startTimer(selectedDifficulty.timer);
}


function startTimer(duration) {
    timeLeft = duration;
    document.getElementById('countdown').textContent = timeLeft;

    countdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            alert("Temps écoulé !");
            moveToNextQuestion();
        }
    }, 1000);
}

function checkAnswer(selectedIndex, button) {
    clearInterval(countdownTimer);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    const buttons = document.querySelectorAll('#answers button');
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    if (selectedIndex === currentQuestion.correct) {
        button.classList.add('correct');
        playCorrectSound();
        score += 10;
    } else {
        button.classList.add('incorrect');
        playIncorrectSound();
    }

    document.getElementById('score').textContent = `Score : ${score}`;

    setTimeout(moveToNextQuestion, 1000);
}


function moveToNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < shuffledQuestions.length) {
        displayQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    playLevelUpSound()

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        alert(`Félicitations vous avez battu votre précédent meilleur score ! \n Votre nouveau meilleur score est : ${bestScore}`);
    } else {
        alert(`Terminé ! \nVotre score est ${score}`);
    }

    document.getElementById('game-container').style.display = 'none';
    document.getElementById('start-container').style.display = 'block';
}

document.getElementById('start-button').addEventListener('click', startGame);

// Bouton arrêter
document.getElementById('stop-button').addEventListener('click', stopGame);

function stopGame() {
    clearInterval(countdownTimer);
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('start-container').style.display = 'block';
}
