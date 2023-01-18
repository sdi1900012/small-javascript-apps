'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal'); //chooses everything of this class
//console.log(btnsOpenModal);

const openModal = function () {
  modal.classList.remove('hidden'); //removes the hidden class from the modal show it can be shown
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//we want for every one of the three buttons to work
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

//event listener for the X button and overlay click
btnCloseModal.addEventListener('click', closeModal); //!we do not call the function, we just write its name
overlay.addEventListener('click', closeModal);

//we pass as argument the event to the function
document.addEventListener('keyup', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
