'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2023-02-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

//!function to display movements to movements list
const dateMovements = function (date, locale) {
  //calculates how many days have passed between 2 dates
  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

  const daysPassed = Math.round(calcDaysPassed(new Date(), date));

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getUTCMonth() + 1}`.padStart(2, 0);
    const year = date.getUTCFullYear();
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//!Function for currency
const formatCur = function (value, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(value);
};

//!function to display the movements
const displayMovements = function (acc, sort = false) {
  //empty the container
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = dateMovements(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>    
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//?function that changes the balance text in html
const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedBal = formatCur(balance, account.locale, account.currency);
  labelBalance.textContent = `${formattedBal}`;
  account.balance = balance;
};

//?function that calculates the summary
const calcSummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);

  const losses = account.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);

  //Bank pays interest for every deposit, only pays interest if the interest is greater than 1 euro
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((sum, mov) => sum + mov, 0);

  //update the  text
  const formattedInc = formatCur(income, account.locale, account.currency);
  const formattedLoss = formatCur(
    Math.abs(losses),
    account.locale,
    account.currency
  );
  const formattedInter = formatCur(interest, account.locale, account.currency);
  labelSumIn.textContent = `${formattedInc}`;
  labelSumOut.textContent = `${formattedLoss}`;
  labelSumInterest.textContent = `${formattedInter}`;
};

//? Function that creates usernames for each user
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//? Function that updates the interface
const updateUi = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcSummary(account);
};

const logOutTimer = function () {
  let time = 60 * 5;

  const tik = function () {
    const min = String(Math.floor(time / 60));
    const sec = String(time % 60);

    labelTimer.textContent = `${min.padStart(2, 0)}:${sec.padStart(2, 0)}`;

    //if timer reached zero, we need to logout the user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tik();

  const timer = setInterval(tik, 1000);
  return timer;
};

//!Handler for the login
let currentAccount;
let timer;

btnLogin.addEventListener('click', function (e) {
  //prevent from submiting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome
    labelWelcome.textContent = `Welcome back ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //clear the inputs for login
    inputLoginPin.value = inputLoginUsername.value = '';
    //blur them also
    inputLoginPin.blur();
    inputLoginUsername.blur();

    //update the interface
    //if there is timer we need to clear it first
    if (timer) clearInterval(timer);
    timer = logOutTimer();
    updateUi(currentAccount);
    //set the sorted variable to false
    sorted = false;
  } else {
    //hide everything
    containerApp.style.opacity = 0;
    //clear the inputs for login
    inputLoginPin.value = inputLoginUsername.value = '';
    //blur them also
    inputLoginPin.blur();
    inputLoginUsername.blur();
    labelWelcome.textContent = 'Log in to get started';
    alert('WRONG USERNAME/PIN');
  }
});

//!Handler for transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  //check for correct input
  if (inputTransferTo.value === '') {
    alert('Please enter the name of the receiver!');
    return;
  } else if (inputTransferTo.value === currentAccount.username) {
    alert('You cannot transfer to your account!');
    return;
  }

  if (amount <= 0) {
    alert('Amount must be a possitive value');
    return;
  } else if (amount > Number(labelBalance.textContent.split('€')[0])) {
    alert('Isufficient funds! Please choose lower amount');
    return;
  }

  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  if (receiver === undefined) {
    alert('User not found.');
  } else if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver?.username !== currentAccount.username
  ) {
    // console.log(`VALID!`);
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    //push the date to dates array
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    //we need to clear the input
    inputTransferAmount.value = inputTransferTo.value = '';
    //we also need to update the interface
    updateUi(currentAccount);
    //reset timer
    clearInterval(timer);
    timer = logOutTimer();
  }
});

//!Handler for deleting the user
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //delete the account from the accounts array
    const i = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(i, 1);
    console.log(accounts);

    //we have to hide everything from the ui
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  } else {
    alert('Wrong inputs!');
  }
});

//!Handler for requesting loan
//give loan only if there is a deposit >10% of the request
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //we need to round the input, bank does not give cents as loan
  const request = Math.floor(inputLoanAmount.value);

  if (
    request > 0 &&
    currentAccount.movements.some(mov => mov >= request * 0.1)
  ) {
    //it takes a bit of time to give the loan so we use timeout
    setTimeout(function () {
      currentAccount.movements.push(request);
      currentAccount.movementsDates.push(new Date().toISOString());
      //update the ui
      updateUi(currentAccount);
    }, 2500);
    //reset the timer
    clearInterval(timer);
    timer = logOutTimer();
  } else {
    alert('Cannot give this Loan!');
  }
  inputLoanAmount.value = '';
});

let sorted = false;
//!Handler for the sort button
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
