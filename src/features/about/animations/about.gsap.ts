import { gsap } from "gsap";

export function setupAboutAnimation(root: HTMLElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => undefined;
  }

  const context = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from("[data-about-meta]", { opacity: 0, y: 8, duration: 0.5, stagger: 0.08 })
      .from("[data-about-headline] span", { opacity: 0, x: -24, duration: 0.72, stagger: 0.09 }, 0.2)
      .from("[data-about-copy]", { opacity: 0, y: 12, duration: 0.62 }, 0.58)
      .from("[data-about-capability]", { opacity: 0, y: 10, duration: 0.5, stagger: 0.1 }, 0.72)
      .from("[data-about-globe-wrap]", { opacity: 0, scale: 0.94, duration: 1.35 }, 0.25)
      .from("[data-about-technical]", { opacity: 0, duration: 0.7, stagger: 0.08 }, 0.82)
      .from("[data-about-message]", { opacity: 0, y: 12, duration: 0.7 }, 1.02)
      .from("[data-about-footer]", { opacity: 0, y: 8, duration: 0.5, stagger: 0.08 }, 1.05);
  }, root);

  return () => context.revert();
}
