const handHour = document.querySelector('.hour')
const handMin = document.querySelector('.min')
const handSec = document.querySelector('.sec')
const digSec = document.querySelector('.seconds')
const digMin = document.querySelector('.minutes')
const digHour = document.querySelector('.hours')
const digAmpm = document.querySelector('.ampm')
const calendar = document.querySelector('.date')
const day = document.querySelector('.day')
const date = new Date();
const displayModeSelect = document.getElementById('display-mode');
const toggleDaySelect = document.getElementById('toggle-day');
const toggleRemainingSelect = document.getElementById('toggle-remaining-day');
const digitalTime = document.getElementById('digital-time');
const timeCircle = document.getElementById('time');


let is24HourFormat = false;
let dd = date.getDate();
let mm = date.getMonth();
let yy = date.getFullYear();
let month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
            "Août", "Septembre", "Octobre", "Novembre", "Decembre"];
let today = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

calendar.innerHTML = dd + ' ' + month[mm] + ' ' + yy;
day.innerHTML = today[date.getDay()];


document.getElementById('toggleFormat').addEventListener('click', function () {
  is24HourFormat = !is24HourFormat;
  this.textContent = is24HourFormat ? 'Format 12H' : 'Format 24H';
});

setInterval(loop);

// Temps restant
function getTimeRemaining(endTime) {
  const total = Date.parse(endTime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function updateRemainingTime() {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const timeRemainingDay = getTimeRemaining(endOfDay);

  document.getElementById('remainingDay').innerHTML = 
    `Demain dans ${timeRemainingDay.hours}h ${timeRemainingDay.minutes}m ${timeRemainingDay.seconds}s`;

  const endOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59);
  const timeRemainingYear = getTimeRemaining(endOfYear);

  document.getElementById('remainingYear').innerHTML = 
    `L'année prochaine dans ${timeRemainingYear.days} jours, ${timeRemainingYear.hours}h ${timeRemainingYear.minutes}m ${timeRemainingYear.seconds}s`;
}

setInterval(updateRemainingTime, 1000);

// GESTION DES AFFICHAGES
function setDisplayMode(mode) {
  if (mode === 'flexible') {
    digitalTime.style.display = 'block';
    timeCircle.style.display = 'none';
  } else if (mode === 'stylish') {
    digitalTime.style.display = 'none';
    timeCircle.style.display = 'flex';
  } else {
    digitalTime.style.display = 'none';
    timeCircle.style.display = 'none';
  }
} // Mode d'affichage digital

displayModeSelect.addEventListener('change', function() {
  setDisplayMode(displayModeSelect.value);
});

window.addEventListener('load', function() {
  setDisplayMode('flexible');
});

toggleDaySelect.addEventListener('change', function() {
  const value = toggleDaySelect.value;
  const dayElement = document.querySelector('.day');
  const dateElement = document.querySelector('.date');
  
  if (value === 'all') {
    dayElement.style.display = 'block';
    dateElement.style.display = 'block';
  } else if (value === 'day-only') {
    dayElement.style.display = 'block';
    dateElement.style.display = 'none';
  } else if (value === 'date-only') {
    dayElement.style.display = 'none';
    dateElement.style.display = 'block';
  } else {
    dayElement.style.display = 'none';
    dateElement.style.display = 'none';
  }
}); // Affichage d'aujourd'hui

toggleRemainingSelect.addEventListener('change', function() {
  const value = toggleRemainingSelect.value;
  const remainingDay = document.getElementById('remainingDay');
  const remainingYear = document.getElementById('remainingYear');
  
  if (value === 'all') {
    remainingDay.style.display = 'block';
    remainingYear.style.display = 'block';
  } else if (value === 'day-only') {
    remainingDay.style.display = 'block';
    remainingYear.style.display = 'none';
  } else if (value === 'year-only') {
    remainingDay.style.display = 'none';
    remainingYear.style.display = 'block';
  } else {
    remainingDay.style.display = 'none';
    remainingYear.style.display = 'none';
  }
}); // Changement de l'affichage du temps restant

// Montre analogiue
function loop() {
  const date = new Date();
  let hs = date.getSeconds() * 6;
  let hm = date.getMinutes() * 6;
  let hh = date.getHours() * 30;
  handSec.style.transform = `rotateZ(${hs}deg)`;
  handMin.style.transform = `rotateZ(${hm + (hs / 60)}deg)`;
  handHour.style.transform = `rotateZ(${hh + (hm / 12)}deg)`;

  let ds = date.getSeconds();
  let dm = date.getMinutes();
  let dh = date.getHours();
  let ap = dh < 12 ? 'AM' : 'PM';

  if (!is24HourFormat) {
    if (dh == 0) {
      dh = 12;
    }
    if (dh > 12) {
      dh -= 12;
    }
    digAmpm.style.display = 'block';
  } else {
    digAmpm.style.display = 'none';
  }

  if (ds < 10) ds = '0' + ds;
  if (dm < 10) dm = '0' + dm;
  if (dh < 10) dh = '0' + dh;

  digSec.innerHTML = ds;
  digMin.innerHTML = dm;
  digHour.innerHTML = dh;
}

setInterval(loop, 1000);


// Numerique Stylé
setInterval(() => {
  let hours = document.getElementById('hours');
  let minutes = document.getElementById('minutes');
  let seconds = document.getElementById('seconds');
  let ampm = document.getElementById('ampm');

  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();
  let am = h >= 12 ? "PM" : "AM";

  let hh = document.getElementById('hh');
  let mm = document.getElementById('mm');
  let ss = document.getElementById('ss');

  let hr_dot = document.querySelector('.hr_dot');
  let min_dot = document.querySelector('.min_dot');
  let sec_dot = document.querySelector('.sec_dot');

  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;


  hours.innerHTML = h + "<br><span>Heures</span>";
  minutes.innerHTML = m + "<br><span>Minutes</span>";
  seconds.innerHTML = s + "<br><span>Secondes</span>";
  am.innerHTML = ampm;


  hh.style.strokeDashoffset = 440 - (440 * h) / 12;
  mm.style.strokeDashoffset = 440 - (440 * m) / 60;
  ss.style.strokeDashoffset = 440 - (440 * s) / 60;


  hr_dot.style.transform = `rotate(${h * 30}deg)`;
  min_dot.style.transform = `rotate(${m * 6}deg)`;
  sec_dot.style.transform = `rotate(${s * 6}deg)`;
})