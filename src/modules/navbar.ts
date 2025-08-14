import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { createAttribute } from "peakflow";
import { createAttribute } from "../../node_modules/peakflow/dist/attributeselector/index";

type AnimateElement =
  | "heading"
  | "nav-component"
  | "nav-brand"
  | "nav-link"
  | "nav-button"
  | "light-nav"
  | "nav-brand-fixed";
const animateSelector = createAttribute<AnimateElement>("data-animate");

export function hideNavCTA(
  nav: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): void {
  if (!nav) throw new Error(`Please pass a navbar to animate.`);
  const navComponents = nav instanceof HTMLElement ? [nav] : Array.from(nav);
  navComponents.forEach((component) => {
    const button = component.querySelector(".button");
    gsap.to(button, {
      translateY: "-5rem",
      ease: "power1.out",
      duration: 0.2,
    });
  });
}

export function showNavCTA(
  nav: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): void {
  if (!nav) throw new Error(`Please pass a navbar to animate.`);
  const navComponents = nav instanceof HTMLElement ? [nav] : Array.from(nav);
  navComponents.forEach((component) => {
    const button = component.querySelector(".button");
    gsap.to(button, {
      translateY: "0rem",
      ease: "power1.out",
      duration: 0.2,
    });
  });
}

export function navToLight(
  nav: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): void {
  if (!nav) throw new Error(`Please pass a navbar to animate.`);
  const navComponents = nav instanceof HTMLElement ? [nav] : Array.from(nav);
  navComponents.forEach((component) => {
    const buttons = component.querySelectorAll(".button");
    buttons.forEach((button) => {
      button.setAttribute(
        "data-wf--button-icon-external--variant",
        "alternate",
      );
      button.classList.remove("is-secondary");
      button.classList.add("is-alternate");
      const curtain = button.querySelector(".button-curtain");
      if (!curtain) return;
      curtain.classList.remove("is-secondary");
      curtain.classList.add("is-alternate");
    });
    const navButton = component.querySelector(".w-nav-button");
    navButton.classList.add("is-alternate");
  });
}

export function navToDefault(
  nav: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
): void {
  if (!nav) throw new Error(`Please pass a navbar to animate.`);
  const navComponents = nav instanceof HTMLElement ? [nav] : Array.from(nav);
  navComponents.forEach((component) => {
    const buttons = component.querySelectorAll(".button");
    buttons.forEach((button) => {
      button.setAttribute(
        "data-wf--button-icon-external--variant",
        "secondary",
      );
      button.classList.add("is-secondary");
      button.classList.remove("is-alternate");
      const curtain = button.querySelector(".button-curtain");
      if (!curtain) return;
      curtain.classList.add("is-secondary");
      curtain.classList.remove("is-alternate");
    });
    const navButton = component.querySelector(".w-nav-button");
    navButton.classList.remove("is-alternate");
  });
}

export function initNavAnimation(): void {
  gsap.registerPlugin(ScrollTrigger);

  const navComponents = Array.from(
    document.querySelectorAll<HTMLElement>(animateSelector("nav-component")),
  );
  const lightSections = Array.from(
    document.querySelectorAll<HTMLElement>(animateSelector("light-nav")),
  );
  const brandElements = Array.from(
    document.querySelectorAll<HTMLElement>(animateSelector("nav-brand-fixed")),
  );

  let navIsLight = false; // Tracks current navbar state
  let navButtonIsHidden = false;

  lightSections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top-=40px top", // when section top enters top of viewport
      end: "bottom-=40px top", // when section bottom leaves top of viewport
      onEnter: () => {
        // console.log("ENTER      -- NAV IS LIGHT:", navIsLight);
        if (!navIsLight) {
          navToLight(navComponents);
          navIsLight = true;
        }
      },
      onEnterBack: () => {
        // console.log("ENTER BACK -- NAV IS LIGHT:", navIsLight);
        if (!navIsLight) {
          navToLight(navComponents);
          navIsLight = true;
        }
      },
      onLeave: () => {
        // console.log("LEAVE      -- NAV IS LIGHT:", navIsLight);
        if (navIsLight) {
          navToDefault(navComponents);
          navIsLight = false;
        }
      },
      onLeaveBack: () => {
        // console.log("LEAVE BACK -- NAV IS LIGHT:", navIsLight);
        if (navIsLight) {
          navToDefault(navComponents);
          navIsLight = false;
        }
      },
    });
  });

  brandElements.forEach((brand) => {
    ScrollTrigger.create({
      trigger: brand,
      start: "top-=80px top",
      end: "bottom+=10px top",
      onEnter: () => {
        console.log("ENTER      -- NAV CTA IS HIDDEN:", navButtonIsHidden);
        if (!navButtonIsHidden) {
          hideNavCTA(navComponents);
          navButtonIsHidden = true;
        }
      },
      onEnterBack: () => {
        console.log("ENTER BACK -- NAV CTA IS HIDDEN:", navButtonIsHidden);
        if (!navButtonIsHidden) {
          hideNavCTA(navComponents);
          navButtonIsHidden = true;
        }
      },
      onLeave: () => {
        console.log("LEAVE      -- NAV CTA IS HIDDEN:", navButtonIsHidden);
        if (navButtonIsHidden) {
          showNavCTA(navComponents);
          navButtonIsHidden = false;
        }
      },
      onLeaveBack: () => {
        console.log("LEAVE BACK -- NAV CTA IS HIDDEN:", navButtonIsHidden);
        if (navButtonIsHidden) {
          showNavCTA(navComponents);
          navButtonIsHidden = false;
        }
      },
    });
  });

  // Set initial nav state on load
  const anyLightSection = Array.from(lightSections).some((el) =>
    ScrollTrigger.isInViewport(el, 0.5),
  );
  if (anyLightSection) {
    navToLight(navComponents);
    navIsLight = true;
  } else {
    navToDefault(navComponents);
    navIsLight = false;
  }

  const anyBrandNav = Array.from(brandElements).some((el) =>
    ScrollTrigger.isInViewport(el, 0.2),
  );
  if (anyBrandNav) {
    hideNavCTA(navComponents);
    navButtonIsHidden = true;
  } else {
    showNavCTA(navComponents);
    navButtonIsHidden = false;
  }
}
