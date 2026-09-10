import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function setupLandingScroll(root: HTMLElement): () => void {
  const hero = root.querySelector<HTMLElement>("[data-hero]");
  const about = root.querySelector<HTMLElement>("[data-about]");
  const heroGlobe = root.querySelector<HTMLElement>("[data-landing-globe]");
  const heroContent = hero?.querySelectorAll<HTMLElement>("[data-hero-transition]");
  const aboutMessage = about?.querySelector<HTMLElement>("[data-about-message]");
  const aboutMessageBackdrop = about?.querySelector<HTMLElement>("[data-about-message-backdrop]");
  const aboutMessageCopy = about?.querySelectorAll<HTMLElement>("[data-about-message-copy]");
  const aboutContent = about?.querySelectorAll<HTMLElement>(
    "[data-about-meta], [data-about-headline], [data-about-copy], [data-about-capability], [data-about-technical], [data-about-footer]"
  );

  if (
    !hero ||
    !about ||
    !heroGlobe ||
    !heroContent ||
    !aboutMessage ||
    !aboutMessageBackdrop ||
    !aboutMessageCopy ||
    !aboutContent
  ) {
    return () => undefined;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav-section]"));

  const setActiveNavigation = (section: "home" | "about"): void => {
    navLinks.forEach((link) => {
      const active = link.dataset.navSection === section;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  if (prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target === about) setActiveNavigation("about");
      else if (visible?.target === hero) setActiveNavigation("home");
    }, { threshold: [0.35, 0.65] });

    observer.observe(hero);
    observer.observe(about);
    return () => observer.disconnect();
  }

  gsap.registerPlugin(ScrollTrigger);

  const context = gsap.context(() => {
    const transitionTimeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.75,
        invalidateOnRefresh: true,
        onEnter: () => setActiveNavigation("home"),
        onEnterBack: () => setActiveNavigation("home"),
        onLeave: () => setActiveNavigation("about")
      }
    });

    transitionTimeline
      .to(heroContent, { opacity: 0, y: -18, duration: 0.62, stagger: 0.018 }, 0)
      .to(heroGlobe, { scale: 1.24, xPercent: -5, opacity: 0.86, duration: 0.72, ease: "power2.inOut" }, 0.12);

    gsap.set(aboutContent, { opacity: 0, y: 24 });
    gsap.set(aboutMessageBackdrop, { opacity: 0, scale: 0.76 });
    gsap.set(aboutMessageCopy, { opacity: 0, y: 18 });

    const aboutTimeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: about,
        start: "top bottom",
        end: "top top",
        scrub: 0.85,
        invalidateOnRefresh: true,
        onEnter: () => setActiveNavigation("about"),
        onEnterBack: () => setActiveNavigation("about"),
        onLeaveBack: () => setActiveNavigation("home")
      }
    });

    aboutTimeline
      .to(aboutContent, { opacity: 1, y: 0, duration: 0.64, stagger: 0.025 }, 0.06)
      .to(aboutMessageBackdrop, { opacity: 1, scale: 1, duration: 0.58, ease: "power2.out" }, 0.24)
      .to(aboutMessageCopy, { opacity: 1, y: 0, duration: 0.42, stagger: 0.06 }, 0.48);
  }, root);

  ScrollTrigger.refresh();

  return () => {
    context.revert();
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === hero || trigger.trigger === about) trigger.kill();
    });
  };
}
