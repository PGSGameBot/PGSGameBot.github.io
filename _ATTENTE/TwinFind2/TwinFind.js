const imageSets = {
    animals: ['img/anm-1.png', 'img/anm-2.png', 'img/anm-3.png', 'img/anm-4.png', 'img/anm-5.png', 'img/anm-6.png'],
    fruits: ['img/fruit-1.png', 'img/fruit-2.png', 'img/fruit-3.png', 'img/fruit-4.png', 'img/fruit-5.png', 'img/fruit-6.png'],
    symbols: ['img/symbol-1.png', 'img/symbol-2.png', 'img/symbol-3.png', 'img/symbol-4.png', 'img/symbol-5.png', 'img/symbol-6.png'],
    mixed: []
};

if (imageType === 'mixed') {
    // Choisir au hasard des images de tous les types
    selectedImages = shuffleArray([...imageSets.animals, ...imageSets.fruits, ...imageSets.symbols])
                    .slice(0, 6); // Prendre 6 images aléatoires
    selectedImages = [...selectedImages, ...selectedImages]; // Dupliquer pour former des paires
}


// Combine all images for 'mixed' type
imageSets.mixed = [...imageSets.animals, ...imageSets.fruits, ...imageSets.symbols];


let movesLeft, timeLeft, timerInterval;

const board = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const startButton = document.getElementById('startGame');

// Start game event
startButton.addEventListener('click', startGame);

function startGame() {
    // Get selections
    const imageType = document.getElementById('imageType').value;
    const gameMode = document.getElementById('gameMode').value;
    const difficulty = document.getElementById('difficulty').value;
    const preDisplay = document.getElementById('preDisplay').value;

    // Set difficulty
    switch (difficulty) {
        case 'easy':
            movesLeft = 10;
            timeLeft = 120;
            break;
        case 'medium':
            movesLeft = 6;
            timeLeft = 60;
            break;
        case 'hard':
            movesLeft = 4;
            timeLeft = 30;
            break;
    }

    // Initialize board
    initializeGame(imageType, gameMode);
    
    
    // Manage modes
    if (gameMode === 'time') {
        startTimer();
    } else if (gameMode === 'moves') {
        updateMoves();
    }

    if (preDisplay === 'yes') {
        preDisplayCards(selectedImages, difficulty);
    }
}







function initializeGame(imageType, gameMode) {
    let selectedImages = [...imageSets[imageType], ...imageSets[imageType]]; // Duplicate images for pairs
    selectedImages.sort(() => 0.5 - Math.random()); // Shuffle images

    // Clear the board before starting
    board.innerHTML = '';
    selectedImages.forEach((imageSrc, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="background-image: url('${imageSrc}');"></div>
                <div class="card-back" style="background-image: url('img/0back.png');"></div>
            </div>
        `;
        board.appendChild(card);
        card.addEventListener('click', () => flipCard(card, gameMode));
    });
}

// Timer countdown
function startTimer() {
    gameStatus.textContent = `Temps restant : ${timeLeft} secondes`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        gameStatus.textContent = `Temps restant : ${timeLeft} secondes`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Temps écoulé ! Vous avez perdu.');
            startGame(); // Restart the game after timeout
        }
    }, 1000);
}

// Update remaining moves
function updateMoves() {
    gameStatus.textContent = `Mouvements restants : ${movesLeft}`;
}

// Flip card logic
function flipCard(card, gameMode) {
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        if (gameMode === 'moves') {
            movesLeft--;
            updateMoves();
            if (movesLeft <= 0) {
                alert('Vous avez épuisé tous vos mouvements !');
                startGame(); // Restart game after losing
            }
        }
    }
}





// Nouvelle fonction pour gérer le pré-affichage des cartes
function preDisplayCards(selectedImages, difficulty) {
    const preDisplayTime = {
        easy: 6000, // 6 secondes
        medium: 4000, // 4 secondes
        hard: 2000 // 2 secondes
    };
    
    selectedImages.forEach((imageSrc, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back" style="background-image: url('img/0back.png');"></div>
                <div class="card-front" style="background-image: url('${imageSrc}');"></div>
            </div>
        `;
        board.appendChild(card);
    });

    // Attendre avant de basculer les cartes
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-back" style="background-image: url('img/0back.png');"></div>
                    <div class="card-front"></div>
                </div>
            `;
        });
    }, preDisplayTime[difficulty]);
}

