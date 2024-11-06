const canvas = document.getElementById('ardoise');
const ctx = canvas.getContext('2d');

const historySound = new Audio('../../assets/sounds/touch.mp3');
const clearSound = new Audio('../../assets/sounds/clear.mp3');

let painting = false;
let gommeActive = false;
let couleur = document.getElementById('couleur').value;
let taillePinceau = document.getElementById('taille').value;
let tailleGomme = document.getElementById('tailleGomme').value;
let backgroundColor = document.getElementById('backgroundColor').value;
let backgroundPattern = document.getElementById('backgroundPattern').value;
let selectedForme = document.getElementById('formes').value;
let history = [];
let redoStack = [];

let historySoundEnabled = true;
let clearSoundEnabled = true;
let allSoundsEnabled = true;

// Désactiver ou réactiver les sons
document.getElementById('toggle-history-sound').addEventListener('change', (event) => {
  historySoundEnabled = !event.target.checked;
});

document.getElementById('toggle-clr-sound').addEventListener('change', (event) => {
  clearSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-all-sounds').addEventListener('change', (event) => {
  allSoundsEnabled = !event.target.checked;
  historySoundEnabled = clearSoundEnabled = allSoundsEnabled;
});

function playHistorySound() {
  if (allSoundsEnabled && historySoundEnabled) {
    historySound.play();
  }
}

function playClearSound() {
  if (allSoundsEnabled && clearSoundEnabled) {
    clearSound.play();
  }
}

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startPaintingTouch);
canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  startPainting({ clientX: touch.clientX, clientY: touch.clientY });
});
canvas.addEventListener('touchend', stopPainting);
canvas.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  draw({ clientX: touch.clientX, clientY: touch.clientY });
  e.preventDefault();
}, { passive: false });


document.getElementById('couleur').addEventListener('input', (e) => {
  couleur = e.target.value;
  gommeActive = false;
  updateToolIndicators();
});

document.getElementById('taille').addEventListener('input', (e) => {
  taillePinceau = e.target.value;
});

document.getElementById('tailleGomme').addEventListener('input', (e) => {
  tailleGomme = e.target.value;
});

document.getElementById('clear').addEventListener('click', () => {
  saveState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
  redoStack = [];
  playClearSound()
});

document.getElementById('gomme').addEventListener('click', () => {
  gommeActive = true;
  updateToolIndicators();
});

document.getElementById('formes').addEventListener('change', (e) => {
  selectedForme = e.target.value;
});

document.getElementById('backgroundColor').addEventListener('input', (e) => {
  backgroundColor = e.target.value;
  setCanvasBackground();
});

document.getElementById('backgroundPattern').addEventListener('change', (e) => {
  backgroundPattern = e.target.value;
  setCanvasBackground();
});


document.getElementById('save').addEventListener('click', saveCanvas);
document.getElementById('share').addEventListener('click', shareCanvas);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);


document.querySelector('.add-controls').addEventListener('click', () => {
  gommeActive = false;
  updateToolIndicators();
  document.querySelector('.remove-controls').classList.remove('active-controls');
});


function startPainting(e) {
  painting = true;
  draw(e);
}

function stopPainting() {
  painting = false;
  ctx.beginPath();
  saveState();
}

function draw(e) {
  if (!painting) return;

  const rect = canvas.getBoundingClientRect();
  const correctionOffsetX = 100;
  const correctionOffsetY = 30;
  const x = (e.clientX || e.touches[0].clientX) - rect.left - (gommeActive ? tailleGomme / 2 : taillePinceau / 2) + correctionOffsetX;
  const y = (e.clientY || e.touches[0].clientY) - rect.top - (gommeActive ? tailleGomme / 2 : taillePinceau / 2) + correctionOffsetY;

  ctx.lineWidth = gommeActive ? tailleGomme : taillePinceau;
  ctx.lineCap = 'round';

  if (gommeActive) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(255,255,255,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = couleur;
  }

  if (selectedForme === 'none') {
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    drawShape(x, y);
  }
}

function drawShape(x, y) {
  ctx.beginPath();
  ctx.strokeStyle = couleur;
  ctx.lineWidth = taillePinceau;

  switch (selectedForme) {
    case 'rectangle':
      ctx.rect(x - 50, y - 50, 100, 100);
      break;
    case 'triangle':
      ctx.moveTo(x, y - 50);
      ctx.lineTo(x + 50, y + 50);
      ctx.lineTo(x - 50, y + 50);
      ctx.closePath();
      break;
    case 'cercle':
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      break;
    case 'losange':
      ctx.moveTo(x, y - 50);
      ctx.lineTo(x + 50, y);
      ctx.lineTo(x, y + 50);
      ctx.lineTo(x - 50, y);
      ctx.closePath();
      break;
  }
  ctx.stroke();
}

function setCanvasBackground() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (backgroundPattern !== 'default') {
    const pattern = getPattern();
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function getPattern() {
  const patternCanvas = document.createElement('canvas');
  const patternContext = patternCanvas.getContext('2d');
  patternCanvas.width = 10;
  patternCanvas.height = 10;

  switch (backgroundPattern) {
    case 'pattern1':  // Lignes diagonales
      patternContext.strokeStyle = '#cccccc';
      patternContext.moveTo(0, 0);
      patternContext.lineTo(10, 10);
      patternContext.stroke();
      break;
    case 'pattern2':  // Points réguliers
      patternContext.fillStyle = '#cccccc';
      patternContext.beginPath();
      patternContext.arc(5, 5, 2, 0, Math.PI * 2);
      patternContext.fill();
      break;
    case 'pattern3':  // Grille carrée
      patternContext.strokeStyle = '#cccccc';
      patternContext.strokeRect(0, 0, 10, 10);
      break;
    case 'pattern4':  // Tissage géométrique
      patternContext.strokeStyle = '#cccccc';
      patternContext.moveTo(0, 0);
      patternContext.lineTo(10, 0);
      patternContext.moveTo(10, 15);
      patternContext.lineTo(10, 5);
      patternContext.moveTo(15, 0);
      patternContext.lineTo(15, 10);
      patternContext.stroke();
      break;
  }

  return ctx.createPattern(patternCanvas, 'repeat');
}

function saveCanvas() {
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const time = today.toTimeString().split(' ')[0].replace(/:/g, '-');
  const fileName = `PGS ArtBoard_${date}_${time}.png`;

  const link = document.createElement('a');
  link.download = fileName;
  canvas.toBlob(function (blob) {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.click();
  }, 'image/png');

  alert(`Dessin téléchargé avec succès`);
}

function shareCanvas() {
  canvas.toBlob((blob) => {
    const file = new File([blob], "PGS ArtBoard.png", { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'PGS ArtBoard',
        text: 'Voici un dessin réalisé sur ArtBoard, une ardoise créée par Pro Gestion Soft !'
      }).catch((error) => console.error('Erreur lors du partage :', error));
    } else {
      alert('Nous n’arrivons pas à partager votre dessin ArtBoard depuis ce navigateur. \nChangez de navigateur et ressayez.');
    }
  }, 'image/png');
}

function undo() {
  if (history.length > 0) {
    redoStack.push(history.pop());
    restoreState();
  }
  playHistorySound();
}

function redo() {
  if (redoStack.length > 0) {
    history.push(redoStack.pop());
    restoreState();
  }
  playHistorySound();
}

function saveState() {
  history.push(canvas.toDataURL());
  redoStack = [];
}

function restoreState() {
  const img = new Image();
  img.src = history[history.length - 1];
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

function startPaintingTouch(e) {
  const touch = e.touches[0];
  painting = true;
  draw({ clientX: touch.clientX, clientY: touch.clientY });
}

function stopPaintingTouch() {
  painting = false;
  ctx.beginPath();
  saveState();
}

function updateToolIndicators() {
  const pinceauBtn = document.getElementById('couleur').parentElement;
  const gommeBtn = document.getElementById('gomme');
  const addControls = document.querySelector('.add-controls');
  const removeControls = document.querySelector('.remove-controls');

  if (gommeActive) {
    gommeBtn.classList.add('active-tool');
    addControls.style.border = '2px solid red';
    removeControls.style.border = '2px solid blue';
  } else {
    pinceauBtn.classList.add('active-tool');
    addControls.style.border = '2px solid blue';
    removeControls.style.border = '2px solid red';
  }
}

setCanvasBackground();
updateToolIndicators();
