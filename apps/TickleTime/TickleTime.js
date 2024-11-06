const selectMenu = document.querySelectorAll('select');
const content = document.querySelector('.content');
const currentTime = document.querySelectorAll('.clock');
const setAlarmTime = document.querySelector('.set');

const ring = new Audio('../../assets/sounds/ringtone.mp3');
const tickSound = new Audio('../../assets/sounds/click.mp3');
const selectSound = new Audio('../../assets/sounds/select.mp3');

let alarmTime;
let isAlarmSet = false;

let selectSoundEnabled = true;
let miniteurSoundEnabled = false;
let alarmSoundEnabled = true;
let allSoundsEnabled = true;

// Désactiver ou réactiver les sons
document.getElementById('toggle-select-sound').addEventListener('change', (event) => {
  selectSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-miniteur-sound').addEventListener('change', (event) => {
  miniteurSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-alarm-sound').addEventListener('change', (event) => {
  alarmSoundEnabled = !event.target.checked;
});

document.getElementById('toggle-all-sounds').addEventListener('change', (event) => {
  allSoundsEnabled = !event.target.checked;
  selectSoundEnabled = miniteurSoundEnabled = alarmSoundEnabled = allSoundsEnabled;
});

function playSelectSound() {
  if (allSoundsEnabled && selectSoundEnabled) {
    selectSound.play();
  }
}

function playMiniteurSound() {
  if (allSoundsEnabled && miniteurSoundEnabled) {
    tickSound.play();
  }
}

function playAlarmSound() {
  if (allSoundsEnabled && alarmSoundEnabled) {
    ring.play();
  }
}

// Calcule
for (let i = 1; i <= 12; i++) {
  i = i < 10 ? '0' + i : i;
  let option = `<option value="${i}">${i}</option>`
  selectMenu[0].lastElementChild.insertAdjacentHTML('afterend', option)
}
for (let i = 0; i <= 59; i++) {
  i = i < 10 ? '0' + i : i;
  let option = `<option value="${i}">${i}</option>`
  selectMenu[1].lastElementChild.insertAdjacentHTML('afterend', option)
}
for (let i = 0; i <= 59; i++) {
  i = i < 10 ? '0' + i : i;
  let option = `<option value="${i}">${i}</option>`
  selectMenu[2].lastElementChild.insertAdjacentHTML('afterend', option)
}
for (let i = 1; i <= 2; i++) {
  let ampm = i == 1 ? 'AM' : 'PM';
  let option = `<option value="${ampm}">${ampm}</option>`
  selectMenu[3].lastElementChild.insertAdjacentHTML('afterend', option)
}

setInterval(clock, 1000);

function clock() {
  const date = new Date();

  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let ampm = 'AM';

  if (h >= 12) {
    ampm = 'PM';
  }

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h % 12;
  }

  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  currentTime[0].innerText = h;
  currentTime[1].innerText = m;
  currentTime[2].innerText = s;
  currentTime[3].innerText = ampm;

  playMiniteurSound();

  if (alarmTime == `${h}:${m}:${s} ${ampm}`) {
    playAlarmSound();
    ring.loop = true;
  }
}

clock();

function setAlarm() {
  if (isAlarmSet) {
    ring.pause();
    alarmTime = '';
    setAlarmTime.style.color = 'black';
    setAlarmTime.style.backgroundColor = 'hsl(115,72%,53.7%)';
    content.classList.remove('disable');
    setAlarmTime.innerText = 'Réglez nouvelle alarme';
    return isAlarmSet = false;
  }
  const time = `${selectMenu[0].value}:${selectMenu[1].value}:${selectMenu[2].value} ${selectMenu[3].value}`;
  alarmTime = time;

  if (time.includes('Hour') || time.includes('Min') || time.includes('Sec') || time.includes('AM/PM')) {
    alert('Vous devez tout définir ; l’heure, la minute, la seconde ainsi que le moment');
    return;
  }
  isAlarmSet = true;
  content.classList.add('disable');
  setAlarmTime.style.backgroundColor = '#690202';
  setAlarmTime.style.color = '#fff';
  setAlarmTime.innerText = 'Arrêtez l’alarme';
}

setAlarmTime.addEventListener('click', setAlarm);

selectMenu.forEach(select => {
  select.addEventListener('change', () => {
    playSelectSound();
  });
});
