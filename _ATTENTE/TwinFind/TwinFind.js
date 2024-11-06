const cardsContainer = document.querySelector(".cards"),
timeTag = document.querySelector(".time b"),
flipsTag = document.querySelector(".flips b"),
refreshBtn = document.querySelector(".details button");

let maxTime = 120;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

const cardImages = [
    "img/img-1.png",
    "img/img-2.png",
    "img/img-3.png",
    "img/img-4.png",
    "img/img-5.png",
    "img/img-6.png",
];

function createCards() {
    let cardArray = [...cardImages, ...cardImages];
    cardArray.sort(() => Math.random() > 0.5 ? 1 : -1);
    cardArray.forEach(imgSrc => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="view front-view">
                <img src="img/que_icon.svg" alt="icon">
            </div>
            <div class="view back-view">
                <img src="${imgSrc}" alt="card-img">
            </div>
        `;

        cardsContainer.appendChild(card);
        card.addEventListener("click", flipCard);
    });
}

function initTimer() {
    if(timeLeft <= 0) {
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}

function flipCard({target: clickedCard}) {
    if(!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    if(clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matchedCard++;
        if(matchedCard == 6 && timeLeft > 0) {
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
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

function shuffleCard() {
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    disableDeck = isPlaying = false;
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    cardsContainer.innerHTML = "";
    createCards();
}

refreshBtn.addEventListener("click", shuffleCard);
createCards();
