import { gsap } from "gsap";

export function setupHeroAnimation(root: HTMLElement): () => void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return () => undefined;
  }

  const context = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from("[data-hero-globe]", { opacity: 0, scale: 0.92, duration: 1.3 })
      .from("[data-hero-logo]", { opacity: 0, x: -32, duration: 0.9 }, 0.28)
      .from("[data-hero-signal]", { opacity: 0, duration: 0.65 }, 0.44)
      .from("[data-hero-item]", { opacity: 0, y: 12, duration: 0.55, stagger: 0.08 }, 0.58);
  }, root);

  return () => context.revert();
}
