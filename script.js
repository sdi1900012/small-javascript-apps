'use strict';

// console.log(document.querySelector('.message').textContent);
// document.querySelector('.message').textContent = 'Correct Number!'; //in order to change the text!

// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;

// document.querySelector('.guess').value; //to get the value since it is input field

//Math.random gives a random number [0,1]
//math.trunc removes the decimal values!
let secretNumber = Math.trunc(Math.random() * 20) + 1;
//console.log(secretNumber);
let score = 20;
let highscore = 0;

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value); //it comes as string so we have to convert it to number first
  //console.log(guess, typeof guess);
  //wrong input
  if (!guess) {
    document.querySelector('.message').textContent = `⛔0 or no input!`;

    //when win
  } else if (guess === secretNumber) {
    if (score > 0)
      document.querySelector('.message').textContent = `🎉 Correct number!`;
    //highscore implementation
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    //change css background of entire site
    document.querySelector('body').style.backgroundColor = '#60b347'; //we got the code from .css file

    //we need to make the width bigger too
    document.querySelector('.number').style.width = '30rem'; //default in .css file is 15rem so lets double it

    //we want to show the correct number at the screeen
    document.querySelector('.number').textContent = secretNumber;

    //when different
  } else if (guess != secretNumber) {
    if (score > 1) {
      //prints defferent message based on the difference
      document.querySelector('.message').textContent =
        guess > secretNumber ? `📈 Too high!` : `📉 Too low!`;

      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = `💣 You lost!`;
      document.querySelector('.score').textContent = 0;
    }
  }
});

//again button functionality
document.querySelector('.again').addEventListener('click', function () {
  //first we reset the score  and calculate new random number
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
  document.querySelector('.score').textContent = 20;
  //reset the input
  document.querySelector('.guess').value = '';

  document.querySelector('body').style.backgroundColor = '#222'; //reset the black background
  document.querySelector('.number').style.width = '15rem'; // reset width to default
  document.querySelector('.number').textContent = '?';
  document.querySelector('.message').textContent = 'Start guessing...';
});
