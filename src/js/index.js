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

dots.forEach((dot, idx) => {
  dot.addEventListener("click", function (evt) {
    dots.forEach((dot) => dot.classList.remove("progress__item__dot--active"));
    evt.target.classList.add("progress__item__dot--active");

    const currentSection = sections[currentSectionNum];
    const nextSection = sections[idx];

    const currentSectionImgLeft = currentSection.querySelector(".section__hero__image--left");
    const currentSectionImgRight = currentSection.querySelector(".section__hero__image--right");
    const nextSectionImgLeft = nextSection.querySelector(".section__hero__image--left");
    const nextSectionImgRight = nextSection.querySelector(".section__hero__image--right");

    const timeline = gsap.timeline({ defaults: { duration: 0.3 } });
    timeline
      .fromTo(currentSectionImgLeft, { y: "-10%" }, { y: "-100%" })
      .fromTo(currentSectionImgRight, { y: "10%" }, { y: "-100%" }, "-0.2")
      .to(container, { backgroundImage: backgrounds[idx] })
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
      .eventCallback("onComplete", () => (currentSectionNum = idx));
  });
});
