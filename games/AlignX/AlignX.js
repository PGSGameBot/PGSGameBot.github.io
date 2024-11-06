document.addEventListener("DOMContentLoaded", () => {
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const playerDisplay = document.querySelector('.display-player');
  const resetButton = document.querySelector('#reset');
  const announcer = document.querySelector('.announcer');
  const modeSelect = document.querySelector('#modeSelect');
  const difficultySelect = document.querySelector('#difficultySelect');
  const gamesPlayedDisplay = document.querySelector('#gamesPlayed');
  const winsDisplay = document.querySelector('#wins');
  const lossesDisplay = document.querySelector('#losses');
  const tiesDisplay = document.querySelector('#ties');

  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let isGameActive = true;
  let gamesPlayed = 0;
  let wins = 0;
  let losses = 0;
  let ties = 0;
  let winningIndices = [];

  const PLAYERX_WON = 'WIN';
  const PLAYERO_WON = 'LOSE';
  const TIE = 'TIE';

  const winSound = new Audio('../../assets/sounds/win.mp3');
  const tieSound = new Audio('../../assets/sounds/tie.mp3');
  const loseSound = new Audio('../../assets/sounds/lose.mp3');
  const moveSound = new Audio('../../assets/sounds/correct.mp3');

  let winSoundEnabled = true;
  let tieSoundEnabled = true;
  let loseSoundEnabled = true;
  let moveSoundEnabled = true;
  let allSoundsEnabled = true;


  // Désactiver ou réactiver les sons
  document.getElementById('toggle-win-sound').addEventListener('change', (event) => {
    winSoundEnabled = !event.target.checked;
  });

  document.getElementById('toggle-tie-sound').addEventListener('change', (event) => {
    tieSoundEnabled = !event.target.checked;
  });

  document.getElementById('toggle-lose-sound').addEventListener('change', (event) => {
    loseSoundEnabled = !event.target.checked;
  });

  document.getElementById('toggle-move-sound').addEventListener('change', (event) => {
    moveSoundEnabled = !event.target.checked;
  });

  document.getElementById('toggle-all-sounds').addEventListener('change', (event) => {
    allSoundsEnabled = !event.target.checked;
    winSoundEnabled = loseSoundEnabled = tieSoundEnabled = moveSoundEnabled = allSoundsEnabled;
  });

  function playWinSound() {
    if (allSoundsEnabled && winSoundEnabled) {
      winSound.play();
    }
  }

  function playTieSound() {
    if (allSoundsEnabled && tieSoundEnabled) {
      tieSound.play();
    }
  }

  function playLoseSound() {
    if (allSoundsEnabled && loseSoundEnabled) {
      loseSound.play();
    }
  }

  function playMoveSound() {
    if (allSoundsEnabled && moveSoundEnabled) {
      moveSound.play();
    }
  }

  // Conditions de victoire
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const isValidAction = (tile) => {
    return tile.innerText === '' && isGameActive;
  };

  const updateBoard = (index) => {
    board[index] = currentPlayer;
  };

  const changePlayer = () => {
    playerDisplay.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerDisplay.innerText = currentPlayer;
    playerDisplay.classList.add(`player${currentPlayer}`);
  };

  const announce = (type) => {
    switch (type) {
      case 'WIN':
        announcer.innerHTML = `Félicitation, X gagne !`;
        announcer.style.color = currentPlayer === 'X' ? '#106102' : '#6a0813';
        playWinSound();
        highlightWinningTiles();
        break;
      case 'TIE':
        announcer.innerText = 'Match nul!';
        announcer.style.color = '#333';
        playTieSound();
        break;
      case 'LOSE':
        announcer.innerHTML = `Dommage, O gagne !`;
        announcer.style.color = '#6a0813';
        playLoseSound();
        highlightLosingTiles();
        break;
    }
    announcer.classList.remove('hide');
    disableBoard();
    applyGridPatternToNonWinningTiles();
  };

  const handleResultValidation = () => {
    let roundWon = false;
    winningIndices = [];
    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      const a = board[winCondition[0]];
      const b = board[winCondition[1]];
      const c = board[winCondition[2]];
      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        winningIndices = winCondition;
        break;
      }
    }

    if (roundWon) {
      announce(currentPlayer === 'X' ? 'WIN' : 'LOSE');
      isGameActive = false;
      updateStats(currentPlayer === 'X' ? 'win' : 'lose');
    } else if (!board.includes('')) {
      announce('TIE');
      isGameActive = false;
      updateStats('tie');
    }
  };

  const updateStats = (result) => {
    gamesPlayed++;
    gamesPlayedDisplay.innerText = gamesPlayed;

    if (result === 'win') {
      wins++;
      winsDisplay.innerText = wins;
    } else if (result === 'lose') {
      losses++;
      lossesDisplay.innerText = losses;
    } else if (result === 'tie') {
      ties++;
      tiesDisplay.innerText = ties;
    }
  };

  const userAction = (tile, index) => {
    if (isValidAction(tile)) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      playMoveSound();
      updateBoard(index);
      handleResultValidation();
      if (isGameActive) {
        if (modeSelect.value === 'ai' && currentPlayer === 'X') {
          changePlayer();
          setTimeout(aiMove, 500);
        } else {
          changePlayer();
        }
      }
    }
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    announcer.classList.add('hide');
    announcer.style.color = '';

    if (currentPlayer === 'O') {
      changePlayer();
    }

    tiles.forEach(tile => {
      tile.innerText = '';
      tile.classList.remove('playerX', 'playerO', 'winner', 'loser', 'disabled', 'grid-pattern');
    });
  };

  function aiMove() {
    let availableIndices = board
      .map((val, index) => val === '' ? index : null)
      .filter(val => val !== null);

    let chosenIndex;

    switch (difficultySelect.value) {
      case 'easy':
        chosenIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        break;
      case 'medium':
        chosenIndex = findBestMove(false) || availableIndices[Math.floor(Math.random() * availableIndices.length)];
        break;
      case 'hard':
        chosenIndex = findBestMove(true);
        break;
    }

    if (chosenIndex !== undefined) {
      const tile = tiles[chosenIndex];
      tile.innerText = 'O';
      tile.classList.add('playerO');
      board[chosenIndex] = 'O';
      handleResultValidation();
      changePlayer();
    }
  }

  function findBestMove(isHardMode) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, 0, false, isHardMode);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  const highlightWinningTiles = () => {
    winningIndices.forEach(index => {
      tiles[index].classList.add('winner');
    });
  };

  const highlightLosingTiles = () => {
    winningIndices.forEach(index => {
      tiles[index].classList.add('loser');
    });
  };

  const disableBoard = () => {
    tiles.forEach(tile => {
      tile.classList.add('disabled');
    });
  };

  const applyGridPatternToNonWinningTiles = () => {
    tiles.forEach(tile => {
      if (!tile.classList.contains('winner') && !tile.classList.contains('loser')) {
        tile.classList.add('grid-pattern');
      }
    });
  };

  const scores = {
    O: 1,
    X: -1,
    tie: 0
  };

  function minimax(board, depth, isMaximizing, isHardMode) {
    let result = checkWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false, isHardMode);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true, isHardMode);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function checkWinner() {
    let winner = null;
    winningConditions.forEach(condition => {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        winner = board[a];
      }
    });

    if (winner === null && !board.includes('')) {
      return 'tie';
    } else {
      return winner;
    }
  }

  // Événements pour chaque case du plateau
  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => userAction(tile, index));
  });

  resetButton.addEventListener('click', resetBoard);

  modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'ai') {
      difficultySelect.style.display = 'inline-block';
    } else {
      difficultySelect.style.display = 'none';
    }
  });
});
