"use strict";

// all audio 
const clickSound = new Audio("audio/card-click-sound.mp3");
const matchSound = new Audio("audio/match-sound.mp3");
const noMatchSound = new Audio("audio/no-match-sound.mp3");
const won = new Audio("audio/won.mp3");

window.addEventListener("load", start);

// all images
const images = ["sw0179a.png", "sw0268.png", "sw0274.png", "sw0432.png", "sw0527.png", "sw0560.png", 
"sw0561.png", "sw0586.png", "sw0770.png", "sw0774.png", "sw0779.png", "sw0991.png", "sw1137.png", "sw1285.png"];

const CARDS_ON_BOARD = 14;
let tries = 0;
let matches = 0;

let selectedCard = null;

// reset the game and start again
const resetButton = document.getElementById('reset-game');
resetButton.addEventListener("click", resetGame);

// start the game
function start() {
  console.log("Javascript runing");
  const cards = initializeCards();
  displayCards(cards);
  makeCardsClickable();
  displayTries();
  displayMatches();
}

// initialize cards and mix in random order
function initializeCards() {
  // create array of numbers
  const numbers = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6];

  for (let i = 0; i < CARDS_ON_BOARD / 2; i++) {
  numbers[i] = i;
  numbers[i + CARDS_ON_BOARD / 2] = i;
  }

  // create shuffled of 'cards'
  const cards = [];
  while (numbers.length > 0) {
  const random = Math.floor(Math.random() * numbers.length);
  // add random index to cards
  cards.push(numbers[random]);
  // remove random index
  numbers.splice(random, 1);
  }

  console.log(cards);
  return cards;
}

// display cards
function displayCards(cards) {
  const elements = document.querySelectorAll(".card");
  elements.forEach((element, index) => {
  element.dataset.image = cards[index];
  const image = element.querySelector("img");
  image.src = "images/" + images[cards[index]];
  })
  console.log(elements);
}

// make cards clickable
function makeCardsClickable() {
  document.querySelectorAll(".card").forEach(card =>
  card.addEventListener("click", (event) => clickCard(card)));
}

// when a card is clicked
function clickCard(card) {
  clickSound.play();
  if (card == selectedCard) {
  // same card clicked twice - ignore
  return;
  }

  if (card.dataset.match) {
  // card already matched - cannot be selected!
  return;
  }

  if (selectedCard) {
  tries++;
  card.classList.add("selected");
  const firstCard = selectedCard;
  const secondCard = card;

  console.log("Two cards selected");
  console.log(firstCard);
  console.log(secondCard);
  
  if (firstCard.dataset.image == secondCard.dataset.image) {
  // match! - mark cards as matching
  matchSound.play();
  matches++;
  firstCard.dataset.match = true;
  secondCard.dataset.match = true;
  } else {
  // no match - unselect cards
  setTimeout(() => {
  noMatchSound.play();
  firstCard.classList.remove("selected");
  secondCard.classList.remove("selected")
  }, 500);
}

  selectedCard = null;
  } else {
  card.classList.add("selected");
  selectedCard = card;
  }

  displayTries();
  displayMatches();

  if (matches == CARDS_ON_BOARD / 2) {
  // all matches found
  gameOver();
  }
}

// display tries
function displayTries() {
  document.querySelector("#scores #tries span").textContent = tries;
}

// display matches
function displayMatches() {
  document.querySelector("#scores #matches span").textContent = matches;
}

// game over (won the game)
function gameOver() {
  console.log("Game Over");
  won.play();
  document.querySelector("#gameover").classList.remove("hide");
}

// reset game
function resetGame() {
  location.reload();
}