// Variables pour les boutons
const startButton = document.getElementById('start-game');
const resumeButton = document.getElementById('resume-game');

// Variables pour le jeu
let gameMode;
let score = 0;
let snake = [];
let specialItems = [];
let obstacles = [];
let currentLevel = 1;
let gameInterval;
let canvas, ctx;
let direction = 'right';

// Chargement des sons
const collectSound = new Audio('sounds/collect.mp3');
const collisionSound = new Audio('sounds/collision.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');

// Gestion des événements des boutons de mode
document.getElementById('classic-mode').addEventListener('click', function() {
    gameMode = "classic";
    showStartButton();
});

document.getElementById('survival-mode').addEventListener('click', function() {
    gameMode = "survival";
    showStartButton();
});

document.getElementById('puzzle-mode').addEventListener('click', function() {
    gameMode = "puzzle";
    showStartButton();
});

// Gestion des événements des boutons Commencer et Reprendre
startButton.addEventListener('click', function() {
    startGame();
});

resumeButton.addEventListener('click', function() {
    startGame(); // Redémarrer le jeu
});

// Gestion des événements du clavier virtuel
document.getElementById('up').addEventListener('click', function() {
    setDirection('up');
});
document.getElementById('down').addEventListener('click', function() {
    setDirection('down');
});
document.getElementById('left').addEventListener('click', function() {
    setDirection('left');
});
document.getElementById('right').addEventListener('click', function() {
    setDirection('right');
});

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            setDirection('up');
            break;
        case 'ArrowDown':
            setDirection('down');
            break;
        case 'ArrowLeft':
            setDirection('left');
            break;
        case 'ArrowRight':
            setDirection('right');
            break;
    }
});

function setDirection(newDirection) {
    // Assure que le serpent ne peut pas faire demi-tour
    if (newDirection === 'up' && direction !== 'down') direction = 'up';
    if (newDirection === 'down' && direction !== 'up') direction = 'down';
    if (newDirection === 'left' && direction !== 'right') direction = 'left';
    if (newDirection === 'right' && direction !== 'left') direction = 'right';
}

function showStartButton() {
    // Cacher le choix du mode
    document.getElementById("mode-container").style.display = "none";
    // Afficher le bouton Commencer
    document.getElementById("start-container").style.display = "block";
}

function startGame() {
    score = 0;
    specialItems = [];
    obstacles = [];
    currentLevel = 1;
    direction = 'right';

    // Cacher les boutons et le mode de jeu
    document.getElementById("mode-container").style.display = "none";
    document.getElementById("start-container").style.display = "none";
    document.getElementById("resume-container").style.display = "none";
    
    // Afficher le jeu
    document.getElementById("game-area").style.display = "flex";

    // Initialiser le canvas
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;

    // Initialiser le labyrinthe et le serpent pour le niveau actuel
    loadLevel(currentLevel);
}

function loadLevel(level) {
    alert("Level " + level);

    // Initialiser le labyrinthe et le serpent pour le niveau actuel
    initializeLabyrinth(level);
    initializeSnake();
    generateSpecialItems(level);

    gameInterval = setInterval(updateGame, 200);
}

function updateGame() {
    let head = {...snake[0]};
    moveSnake(head);
    snake.unshift(head);

    // Vérifier si le serpent collecte un objet
    for (let i = 0; i < specialItems.length; i++) {
        if (head.x === specialItems[i].x && head.y === specialItems[i].y) {
            collectSound.play();
            score += 10;
            specialItems.splice(i, 1); // Retirer l'objet collecté
            break;
        }
    }

    // Vérifier si le niveau est terminé
    if (isLevelCompleted()) {
        clearInterval(gameInterval);
        currentLevel++;
        if (currentLevel > 5) {
            completeAllLevels();
        } else {
            loadLevel(currentLevel);
        }
    } else {
        snake.pop();
    }

    renderGame();
}

function initializeLabyrinth(level) {
    // Code pour initialiser le labyrinthe en fonction du niveau
    obstacles = []; // Remet à zéro les obstacles

    // Exemple simple pour générer quelques obstacles aléatoires
    for (let i = 0; i < 10; i++) {
        obstacles.push({
            x: Math.floor(Math.random() * (canvas.width / 20)),
            y: Math.floor(Math.random() * (canvas.height / 20))
        });
    }
}

function initializeSnake() {
    snake = [
        {x: 10, y: 10}
    ];
}

function generateSpecialItems(level) {
    // Code pour générer des objets spéciaux en fonction du niveau
    specialItems = []; // Remet à zéro les objets spéciaux

    // Exemple simple pour générer quelques objets spéciaux aléatoires
    for (let i = 0; i < 5; i++) {
        specialItems.push({
            x: Math.floor(Math.random() * (canvas.width / 20)),
            y: Math.floor(Math.random() * (canvas.height / 20))
        });
    }
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les objets spéciaux
    ctx.fillStyle = 'blue';
    specialItems.forEach(item => {
        ctx.fillRect(item.x * 20, item.y * 20, 20, 20);
    });

    // Dessiner les obstacles
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x * 20, obstacle.y * 20, 20, 20);
    });

    // Dessiner le serpent
    ctx.fillStyle = 'green';
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? 'darkgreen' : 'green'; // La tête du serpent est plus foncée
        ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
    });
}

function moveSnake(head) {
    switch(direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }

    // Vérifier les collisions avec les murs ou obstacles
    if (head.x < 0 || head.x >= canvas.width / 20 || head.y < 0 || head.y >= canvas.height / 20) {
        collisionSound.play();
        endGame();
    }

    // Vérifier les collisions avec les obstacles
    for (let obstacle of obstacles) {
        if (head.x === obstacle.x && head.y === obstacle.y) {
            collisionSound.play();
            endGame();
        }
    }

    // Vérifier les collisions avec le serpent lui-même
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            collisionSound.play();
            endGame();
        }
    }
}

function isLevelCompleted() {
    // Vérifier si toutes les conditions pour terminer le niveau sont remplies (par exemple, collecter tous les objets)
    return score >= currentLevel * 50; // Exemple : 50 points requis par niveau
}

function endGame() {
    clearInterval(gameInterval);
    gameOverSound.play();
    alert("Game Over! Your score is " + score);
    // Afficher le bouton Reprendre après une fin de jeu
    document.getElementById("resume-container").style.display = "block";
    document.getElementById("game-area").style.display = "none";
}

function completeAllLevels() {
    alert("Vous avez terminé tous les niveaux !");
    endGame();
}
