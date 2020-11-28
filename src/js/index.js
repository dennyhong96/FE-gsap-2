const { gsap } = require("gsap");

const dots = document.querySelectorAll(".progress__item__dot");
const sections = document.querySelectorAll(".section");
const container = document.querySelector(".container");
const backgrounds = [
  "radial-gradient(#2B3760,#0B1023)",
  "radial-gradient(#4E3022,#161616)",
  "radial-gradient(#4E4342,#161616)",
];

const menuBtn = document.querySelector(".header__menu-btn");
const logo = document.querySelector(".header__logo");
const headerOpen = document.querySelector(".header__open");
const social = document.querySelector(".header__open__social");
const contact = document.querySelector(".header__open__contact");

let currentSectionNum = 0;
let nextScrollSectionNum = 0;
let timeline;

// Adds click listener to dot buttons
dots.forEach((dot, idx) => {
  dot.addEventListener("click", function () {
    // Changes active display section
    changeActiveSection(idx);
  });
});

// Changes active dot button
function changeActiveDots(activeDot) {
  dots.forEach((dot) => dot.classList.remove("progress__item__dot--active"));
  activeDot.classList.add("progress__item__dot--active");
}

// Changes active section
function changeActiveSection(nextSectionNum) {
  const currentSection = sections[currentSectionNum];
  const nextSection = sections[nextSectionNum];
  const currentSectionImgLeft = currentSection.querySelector(".section__hero__image--left");
  const currentSectionImgRight = currentSection.querySelector(".section__hero__image--right");
  const nextSectionImgLeft = nextSection.querySelector(".section__hero__image--left");
  const nextSectionImgRight = nextSection.querySelector(".section__hero__image--right");

  // If animation is currently playing, do nothing
  if (timeline?.isActive()) return;

  // Changes active dot button
  changeActiveDots(dots[nextSectionNum]);

  timeline = gsap.timeline({
    defaults: { duration: 0.3 },
    onComplete() {
      // Make dot btns clicable again
      dots.forEach((dot) => {
        dot.style.pointerEvents = "all";
      });

      // Update active section number
      currentSectionNum = nextSectionNum;
    },
  });

  timeline
    .fromTo(currentSectionImgLeft, { y: "-10%" }, { y: "-100%" })
    .fromTo(currentSectionImgRight, { y: "10%" }, { y: "-100%" }, "-0.2")
    .to(container, { backgroundImage: backgrounds[nextSectionNum] })
    .fromTo(
      currentSection,
      { opacity: 1, pointerEvents: "all" },
      { opacity: 0, pointerEvents: "none" }
    )
    .fromTo(
      nextSection,
      { opacity: 0, pointerEvents: "none" },
      { opacity: 1, pointerEvents: "all" }
    )
    .fromTo(nextSectionImgLeft, { y: "100%" }, { y: "-10%" }, 0.7)
    .fromTo(nextSectionImgRight, { y: "100%" }, { y: "10%" }, 0.9)
    // Clears inline styles to make hover styles work again
    .set([nextSectionImgLeft, nextSectionImgRight], { clearProps: "all" });
}

// Wheel event, different from a scroll event, does not have scroll bar
// touchmove event for mobile
["wheel", "touchmove"].forEach((evtType) =>
  document.addEventListener(
    evtType,
    throttle(function (evt) {
      // Wheels up
      if (evt.deltaY > 0) {
        if (currentSectionNum < 2) {
          nextScrollSectionNum++;
        } else {
          nextScrollSectionNum = 0;
        }
        changeActiveDots(dots[nextScrollSectionNum]);
        changeActiveSection(nextScrollSectionNum);
      }

      // Wheels down
      if (evt.deltaY < 0) {
        if (currentSectionNum > 0) {
          nextScrollSectionNum--;
        } else {
          nextScrollSectionNum = sections.length - 1;
        }
        changeActiveDots(dots[nextScrollSectionNum]);
        changeActiveSection(nextScrollSectionNum);
      }
    }, 1500)
  )
);

// Throttling
function throttle(fn, limit) {
  // Uses closure
  let isThrottle = false;

  return function (...args) {
    console.log(args); // => evt
    console.log(this); // => document (evt.currentTarget)

    if (!isThrottle) {
      fn.apply(this, args);
      isThrottle = true;
      setTimeout(() => (isThrottle = false), limit);
    }
  };
}

// Navigation animation
const timeline2 = gsap.timeline({ paused: true, reversed: true, defaults: { duration: 0.5 } });

timeline2
  .to(headerOpen, { y: 0 })
  .fromTo(contact, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.5)
  .fromTo(social, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.5)
  .fromTo(logo, { color: "#fff" }, { color: "#333" }, 0)
  .fromTo(menuBtn, { color: "#fff" }, { color: "#333" }, 0);

menuBtn.addEventListener("click", function () {
  // Toggles the animation based on .isReversed()
  timeline2.reversed()
    ? (() => {
        timeline2.timeScale(1);
        timeline2.play();
      })()
    : (() => {
        // 2time speed when reversing the animation
        timeline2.timeScale(2);
        timeline2.reverse();
      })();
});
