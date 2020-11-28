const { gsap } = require("gsap");

const dots = document.querySelectorAll(".progress__item__dot");
const sections = document.querySelectorAll(".section");
const container = document.querySelector(".container");
const backgrounds = [
  "radial-gradient(#2B3760,#0B1023)",
  "radial-gradient(#4E3022,#161616)",
  "radial-gradient(#4E4342,#161616)",
];

let currentSectionNum = 0;
let nextScrollSectionNum = 0;

// Adds click listener
dots.forEach((dot, idx) => {
  dot.addEventListener("click", function (evt) {
    dots.forEach((dot) => dot.classList.remove("progress__item__dot--active"));
    evt.target.classList.add("progress__item__dot--active");

    changeSection(idx);
  });
});

// Changes display section
function changeSection(nextSectionNum) {
  const currentSection = sections[currentSectionNum];
  const nextSection = sections[nextSectionNum];

  const currentSectionImgLeft = currentSection.querySelector(".section__hero__image--left");
  const currentSectionImgRight = currentSection.querySelector(".section__hero__image--right");
  const nextSectionImgLeft = nextSection.querySelector(".section__hero__image--left");
  const nextSectionImgRight = nextSection.querySelector(".section__hero__image--right");

  const timeline = gsap.timeline({ defaults: { duration: 0.3 } });
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
    .set([nextSectionImgLeft, nextSectionImgRight], { clearProps: "all" })
    // Update current section number
    .eventCallback("onComplete", () => (currentSectionNum = nextSectionNum));
}

// Wheel event, different from a scroll event, does not have scroll bar
document.addEventListener(
  "wheel",
  throttle(function (evt) {
    // Wheels up
    if (evt.deltaY > 0 && currentSectionNum < 2) {
      nextScrollSectionNum++;
      changeSection(nextScrollSectionNum);
    }

    // Wheels down
    if (evt.deltaY < 0 && currentSectionNum > 0) {
      nextScrollSectionNum--;
      changeSection(nextScrollSectionNum);
    }
  }, 1500)
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
