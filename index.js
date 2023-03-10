/* eslint-disable max-len */
const btn1 = document.getElementById('prev');
const btn2 = document.getElementById('next');
const myWrapper = document.getElementById('wrapper');
const mySlideItems = document.getElementsByClassName('slide');
const itemWidth = 450;

function myCarousel(wrapper, slideItems, widthOfItem, prevBtn, nextBtn) {
  const indexSize = slideItems.length - 1;
  const threshold = 100; // drag limit before moving to the next slide for touchscreen devices alone
  const widthofSlideItem = widthOfItem;
  let posX1 = 0;
  let posX2 = 0;
  let posInitial;
  let posFinal;
  let currentIndex = 0;
  let myInterval;
  let allowNextSlide = true;// during the process of transition it remains false after each slide transition it goes back to true to allow sliding
  let direction = 1; // if the user clickes next/prev it keeps moving that direction till the user clicks a diff. direction
  const indicator = document.getElementsByClassName('indicator');
  // cloning the first and last node
  const clonedFirstNode = slideItems[0].cloneNode(true);
  const clonedLastNode = slideItems[slideItems.length - 1].cloneNode(true);
  wrapper.insertBefore(clonedLastNode, slideItems[0]);
  wrapper.appendChild(clonedFirstNode);
  wrapper.classList.add('smooth-transition');

  // moves our slides left or right
  function move(dir, drag) {
    wrapper.classList.add('smooth-transition');
    if (allowNextSlide) {
      if (!drag) {
        posInitial = wrapper.offsetLeft; // initializes a current value for clicks only
        clearInterval(myInterval);
        myInterval = setInterval(runSlidesContinously, 3000);
      }
      if (dir === 1) {
        wrapper.style.left = `${posInitial - widthofSlideItem}px`; currentIndex++;
        allowNextSlide = false;
        direction = 1;
      }
      if (dir === -1) {
        wrapper.style.left = `${posInitial + widthofSlideItem}px`; currentIndex--;
        allowNextSlide = false;
        direction = -1;
      }
    }
  }

  function checkIndex() {
    if ((currentIndex === -1) || (currentIndex === (slideItems.length - 2))) {
    // move to the last slide
      if (currentIndex === -1) {
        wrapper.classList.remove('smooth-transition');
        wrapper.style.left = `${posInitial - (indexSize * widthofSlideItem)}px`;
        currentIndex = indexSize;
      } else { // move to the first slide
        wrapper.classList.remove('smooth-transition');
        wrapper.style.left = `${posInitial + (indexSize * widthofSlideItem)}px`;
        currentIndex = 0;
      }
    }
    // Indicators
    for (let i = 0; i < indicator.length; i++) {
      indicator[i].className = indicator[i].className.replace('active', '');
    }
    indicator[currentIndex].className += ' active';
  }
  wrapper.addEventListener('transitionend', checkIndex);

  // what happens when the user places his finger on the carousel -touchscreen
  function dragStart() {
    wrapper.classList.remove('smooth-transition');
    posInitial = wrapper.offsetLeft; // initializes a value for everytime a touch event is started.
    window.event.preventDefault(); // prevents the supposed normal/default action on when a user touch the screen
    posX1 = window.event.touches[0].clientX;
  }

  // what happens while the user drag his finger on the carousel *touchscreen devices
  function dragAction() {
    if (allowNextSlide) {
      posX2 = posX1 - window.event.touches[0].clientX;
      posX1 = window.event.touches[0].clientX;
      wrapper.style.left = `${wrapper.offsetLeft - posX2}px`;
    }
  }

  // what happens when user removes his finger while sliding *touchscreen
  function dragEnd() {
    posFinal = wrapper.offsetLeft;
    if ((posInitial - threshold) > posFinal) {
      move(1, 'drag');
    } else if ((posFinal - threshold) > posInitial) {
      move(-1, 'drag');
    } else {
      wrapper.style.left = `${posInitial}px`;
    }
    myInterval = setInterval(runSlidesContinously, 3000);
    wrapper.classList.add('smooth-transition');
  }
  // click eventListeners
  nextBtn.addEventListener('click', () => { move(1); });
  prevBtn.addEventListener('click', () => { move(-1); });
  // Once transition is taking place, gateway to control the slides will be closed till when transition is done for that slide
  wrapper.addEventListener('transitionstart', () => { allowNextSlide = false; });
  // calls back setInterval to continue executing when a slide transition just ended
  wrapper.addEventListener('transitionend', () => { allowNextSlide = true; });
  // touch eventListener
  wrapper.addEventListener('touchstart', () => { clearInterval(myInterval); dragStart(); });
  wrapper.addEventListener('touchmove', dragAction);
  wrapper.addEventListener('touchend', dragEnd);

  // moves/loops through the slides continously till infinite
  function runSlidesContinously() {
    if (currentIndex < (slideItems.length - 2)) {
      if ((currentIndex === 0 && direction === 1) || (currentIndex === (slideItems.length - 2) && direction === -1)) {
        return move(direction);
      }
      return move(direction);
    }
  }
  myInterval = setInterval(runSlidesContinously, 3000); // onload the setIinterval function is started
}
myCarousel(myWrapper, mySlideItems, itemWidth, btn1, btn2);
