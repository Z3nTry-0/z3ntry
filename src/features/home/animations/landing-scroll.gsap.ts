import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { observeAboutBoundary } from "../../../lib/dom/observe-about-boundary";

export function setupLandingScroll(root: HTMLElement): () => void {
  const hero = root.querySelector<HTMLElement>("[data-hero]");
  const about = root.querySelector<HTMLElement>("[data-about]");
  const contact = root.querySelector<HTMLElement>("[data-contact]");
  if (!hero || !about) return () => undefined;

  const navLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav-section]");
  const scrollControl = document.querySelector<HTMLElement>("[data-scroll-control]");
  let inHero = true;
  const updateScrollControl = (): void => {
    if (scrollControl) scrollControl.hidden = !inHero && document.activeElement !== scrollControl;
  };
  scrollControl?.addEventListener("blur", updateScrollControl);
  const stopObserving = observeAboutBoundary(about, (section) => {
    inHero = section === "home";
    updateScrollControl();
    navLinks.forEach((link) => {
      const active = link.dataset.navSection === section;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, {
    services: root.querySelector<HTMLElement>("#services"),
    experience: root.querySelector<HTMLElement>("#experience"),
    contact,
  });

  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to(hero.querySelectorAll("[data-hero-transition]"), {
      opacity: 0,
      y: -18,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, root);

  return () => {
    stopObserving();
    scrollControl?.removeEventListener("blur", updateScrollControl);
    if (scrollControl) scrollControl.hidden = false;
    motion.revert();
  };
}
