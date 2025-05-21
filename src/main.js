import gsap from 'gsap';
import Typewriter from 'typewriter-effect/dist/core';

console.log('hello DONUTS');

// Typewriter navbar anim
new Typewriter('.hiring-text', {
  strings: ["We're hiring!"],
  autoStart: true,
  loop: true,
  cursor: '|',
  delay: 150,
  deleteSpeed: 50
});

// Gradient Video animation
const gradientTl = gsap.timeline({
  repeat: -1
});

gradientTl
  .to('.gradient-1', {
    width: '0%',
    duration: 2,
    ease: 'power3.inOut'
  })
  .to('.gradient-2', {
    width: '70%',
    duration: 2,
    ease: 'power3.out'
  }, '-=0.5')
  .to('.gradient-2', {
    width: '0%',
    duration: 2,
    ease: 'power3.inOut'
  })
  .to('.gradient-1', {
    width: '70%',
    duration: 2,
    ease: 'power3.out'
  }, '-=0.5');

// Marquee animation
function initMarquee() {
  const lists = document.querySelectorAll('.marquee-css__list');
  const firstList = lists[0];
  const secondList = lists[1];
  
  const itemWidth = firstList.offsetWidth;
  
  gsap.to([firstList, secondList], {
    x: -itemWidth,
    duration: 30,
    ease: 'none',
    repeat: -1,
    onRepeat: function() {
      gsap.set([firstList, secondList], { x: 0 });
    }
  });
}

// Initialiser le marquee
initMarquee();





