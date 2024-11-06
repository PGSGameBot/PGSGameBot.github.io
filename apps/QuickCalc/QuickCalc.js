const clickSound = new Audio('../../assets/sounds/touch.mp3');
const deleteSound = new Audio('../../assets/sounds/del.mp3');
const clearSound = new Audio('../../assets/sounds/clear.mp3');
const equalsSound = new Audio('../../assets/sounds/click.mp3');

let outputScreen = document.getElementById('output-screen');
let realTimeResult = document.getElementById('real-time-result');
let calculationDone = false;
let history = [];

let clickSoundEnabled = true;
let deleteSoundEnabled = true;
let clearSoundEnabled = true;
let equalsSoundEnabled = true;
let allSoundsEnabled = true;


// Désactiver ou réactiver les sons
document.getElementById('toggle-touch-sound').addEventListener('change', (event) => {
  clickSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-del-sound').addEventListener('change', (event) => {
  deleteSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-clr-sound').addEventListener('change', (event) => {
  clearSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-equals-sound').addEventListener('change', (event) => {
  equalsSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-all-sounds').addEventListener('change', (event) => {
  allSoundsEnabled = !event.target.checked;
  clickSoundEnabled = deleteSoundEnabled = clearSoundEnabled = equalsSoundEnabled = allSoundsEnabled;
});

function playClickSound() {
  if (allSoundsEnabled && clickSoundEnabled) {
    clickSound.play();
  }
}

function playDeleteSound() {
  if (allSoundsEnabled && deleteSoundEnabled) {
    deleteSound.play();
  }
}

function playClearSound() {
  if (allSoundsEnabled && clearSoundEnabled) {
    clearSound.play();
  }
}

function playEqualsSosund() {
  if (allSoundsEnabled && equalsSoundEnabled) {
    equalsSound.play();
  }
}

// AFFICHAGE
function updateRealTimeResult() {
  let expression = outputScreen.value;
  expression = processExpression(expression);

  try {
    let result = eval(expression);
    if (!isNaN(result)) {
      realTimeResult.value = result;
    } else if (expression !== "") {
      realTimeResult.value = realTimeResult.value;
    } else {
      realTimeResult.value = '';
    }
  } catch (err) {
    realTimeResult.value = '😏';
  }
}

outputScreen.addEventListener('input', updateRealTimeResult);


function display(num) {
  let output = outputScreen.value;
  let cursorPosition = outputScreen.selectionStart;

  if (calculationDone) {
    outputScreen.value += num;
    outputScreen.setSelectionRange(outputScreen.value.length, outputScreen.value.length);
    calculationDone = false;
  } else {
    outputScreen.value = output.slice(0, cursorPosition) + num + output.slice(cursorPosition);
    outputScreen.setSelectionRange(cursorPosition + num.length, cursorPosition + num.length);
  }

  outputScreen.focus();
  updateRealTimeResult();
  playClickSound();
}

// EFFACER ET TOUT EFFACER
function clr() {
  outputScreen.value = '';
  outputScreen.style.color = 'black';
  isResultDisplayed = false;
  playClearSound();
} // TOUT EFFACER

function effacer() {
  let output = outputScreen.value;
  let cursorPosition = outputScreen.selectionStart;

  if (cursorPosition > 0) {
    outputScreen.value = output.slice(0, cursorPosition - 1) + output.slice(cursorPosition);
    outputScreen.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
  }
  outputScreen.focus();
  playDeleteSound();
} // EFFACER

// GESTION MEMOIRE
let memory = 0;

function memoryAdd() {
  memory += parseFloat(outputScreen.value) || 0;
  document.getElementById('memory-indicator').innerText = 'M+';
}

function memorySubtract() {
  memory -= parseFloat(outputScreen.value) || 0;
  document.getElementById('memory-indicator').innerText = 'M-';
}

function memoryRecall() {
  outputScreen.value = memory;
}

function memoryClear() {
  memory = 0;
  document.getElementById('memory-indicator').innerText = '';
}

// Fonctions avancées
let hiddenButtons = document.querySelectorAll('.hide');
let calculator = document.querySelector('.calculator');

function toggleGrid() {
  hiddenButtons.forEach(button => {
    button.classList.toggle('show');
  });

  if (calculator.classList.contains('show-grid')) {
    calculator.classList.remove('show-grid');
    outputScreen.classList.remove('show-grid');
  } else {
    calculator.classList.add('show-grid');
    outputScreen.classList.add('show-grid');
  }

  playClickSound();
}

// FONCTIONS
function trigFunction(func, val) {
  let rad = val * (Math.PI / 180);
  switch (func) {
    case 'sin': return Math.sin(rad);
    case 'cos': return Math.cos(rad);
    case 'tan': return Math.tan(rad);
    case 'asin': return Math.asin(val) * (180 / Math.PI);
    case 'acos': return Math.acos(val) * (180 / Math.PI);
    case 'atan': return Math.atan(val) * (180 / Math.PI);
  }
} 

function mathConstant(constant) {
  switch (constant) {
    case 'π': return Math.PI;
    case 'e': return Math.E;
  }
}

function sqrt(val) {
  return Math.sqrt(val);
}

function cbrt(val) {
  return Math.cbrt(val);
}

function log10(val) {
  return Math.log10(val);
}

function ln(val) {
  return Math.log(val);
}

function factorial(val) {
  if (val < 0) return 'Non pris en charge';
  if (val === 0 || val === 1) return 1;
  let result = 1;
  for (let i = 2; i <= val; i++) {
    result *= i;
  }
  return result;
}

// Traitement des opérateurs
function processExpression(expression) {
  expression = expression.replace(/sin\(([^)]+)\)/g, (match, p1) => trigFunction('sin', eval(p1)));
  expression = expression.replace(/cos\(([^)]+)\)/g, (match, p1) => trigFunction('cos', eval(p1)));
  expression = expression.replace(/tan\(([^)]+)\)/g, (match, p1) => trigFunction('tan', eval(p1)));
  expression = expression.replace(/asin\(([^)]+)\)/g, (match, p1) => trigFunction('asin', eval(p1)));
  expression = expression.replace(/acos\(([^)]+)\)/g, (match, p1) => trigFunction('acos', eval(p1)));
  expression = expression.replace(/atan\(([^)]+)\)/g, (match, p1) => trigFunction('atan', eval(p1)));

  expression = expression.replace(/π/g, () => mathConstant('π'));
  expression = expression.replace(/e/g, () => mathConstant('e'));

  expression = expression.replace(/√\(([^)]+)\)/g, (match, p1) => sqrt(eval(p1)));
  expression = expression.replace(/∛\(([^)]+)\)/g, (match, p1) => cbrt(eval(p1)));
  expression = expression.replace(/log\(([^)]+)\)/g, (match, p1) => log10(eval(p1)));
  expression = expression.replace(/ln\(([^)]+)\)/g, (match, p1) => ln(eval(p1)));

  if (/!\d/.test(expression)) {
    outputScreen.value = 'Format invalide';
    outputScreen.style.color = 'red';
    return null; 
  }

  expression = expression.replace(/(\d+)!/g, (match, p1) => factorial(parseInt(p1)));
  expression = expression.replace(/(\d+)%/g, (match, p1) => p1 / 100);

  return expression;
}

// CALCUL
function calculate() {
  let expression = outputScreen.value;
  expression = processExpression(expression);

  if (expression === null) {
    return; 
  }

  try {
    let result = eval(expression);

    if (!isNaN(result) && isFinite(result)) {
      outputScreen.value = result;
      realTimeResult.value = '';
      history.push(`${expression} = ${result}`);
      calculationDone = true;
      updateHistoryButton();
    } else {
      outputScreen.value = 'Erreur';
      outputScreen.style.color = 'red';
    }
    calculationDone = true;
    playEqualsSosund();
  } catch (err) {
    outputScreen.value = 'Erreur';
    outputScreen.style.color = 'red';
  }

  outputScreen.setSelectionRange(outputScreen.value.length, outputScreen.value.length);
  outputScreen.blur(); 
}

// Historique
function updateHistoryButton() {
  if (history.length > 0) {
    document.getElementById('history-btn').style.display = 'block';
  }
}

function showHistory() {
  document.querySelector('.calculator').style.display = 'none';
  let historyDiv = document.getElementById('history');
  historyDiv.style.display = 'block';

  let historyContent = '<h3>Historique des calculs</h3><ul>';
  history.forEach(entry => {
    historyContent += `<li>${entry}</li>`;
  });
  historyContent += '</ul>';
  historyContent += '<button onclick="downloadHistory()">Télécharger</button>';
  historyContent += '<button onclick="hideHistory()">Retour</button>';

  historyDiv.innerHTML = historyContent;
}

function hideHistory() {
  document.getElementById('history').style.display = 'none';
  document.querySelector('.calculator').style.display = 'grid';
}

document.getElementById('history-btn').style.display = 'none';

// Sauvegarde
function downloadHistory() {
  let blob = new Blob([history.join('\n')], { type: 'text/plain' });
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'historique_de_calculs.txt';
  link.click();

  alert(`Historique des calculs téléchargé avec succès`);
}
