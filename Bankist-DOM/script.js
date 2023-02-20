'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const imgTargets = document.querySelectorAll('img[data-src]');
const allSections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//!Page navigation
//Add event listener to parent element
//at that listener determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Match strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//!Fade animation at Menu

const hoverFunc = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const clicked = e.target;
    const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');
    const logo = clicked.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el != clicked) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverFunc.bind(0.5));

//we also need to undo the fade when the mouse moves outside
nav.addEventListener('mouseout', hoverFunc.bind(1));

//!Sticky navigation
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //90px is the height of the navbar
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//!Event listener for scroll button
btnScrollTo.addEventListener('click', function (e) {
  // const section1Coords = section1.getBoundingClientRect();

  //scroll smooth, if you dont want smooth just pass the left and top as arguments
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

//!Tabbed Component
tabsContainer.addEventListener('click', function (e) {
  //Match strategy
  const clicked = e.target.closest('.operations__tab');

  //if user clicked the container nothing should happen
  if (!clicked) return;

  //now we need to remove active from the rest
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  //set that button active
  clicked.classList.add('operations__tab--active');

  //remove the previous content
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  //activate the content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//!REveal Sections

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  //we also need to clear the observer
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//!Lazy Loading Images
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace lower res image with the correct one
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//!Slider Component

// slide counters
let curSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  }
  curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else curSlide--;
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keyup', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

//functions for the dots
const createDots = function () {
  slides.forEach((_, i) =>
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};
createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0);

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
