'use strict';
//?game summary
/*
Each player rolls the dice. They can save the points they gathered or they can continue rolling the dice.
 But if the dice rolls 1, they lose all the points they gathered this round, and the other player starts his turn.
 The first to reach 100 Points wins the game!
*/

//selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1'); //alternate way to choose by id, works slightly faster
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores;
let currentScore;
let activePlayer;
let playing; //this will become false when the game ends

function init() {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true; //this will become false when the game ends

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');

  diceEl.classList.add('hidden');
}
init();

//function to change player
function changePlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;

  activePlayer = activePlayer === 0 ? 1 : 0;
  //if the class exists there toggle removes it, if it doesnt it adds it
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
  currentScore = 0;
}

//rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing === true) {
    //1.generate random dice roll 1-6
    const dice = Math.trunc(Math.random() * 6) + 1;

    //2.display dice
    //first remoce hidden class
    if (diceEl.classList.contains('hidden')) diceEl.classList.remove('hidden');

    diceEl.src = `dice-${dice}.png`; //change the image

    //3. if rolled 1 switch to next player
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      changePlayer();
    }
  }
});

//hold button functionality
btnHold.addEventListener('click', function () {
  if (playing === true) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');

      diceEl.classList.add('hidden');

      playing = false;
    } else {
      changePlayer();
    }
  }
});

//new game button functionality
btnNew.addEventListener('click', init);
