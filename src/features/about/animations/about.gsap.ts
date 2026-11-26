import { gsap } from "gsap";

export function setupAboutAnimation(root: HTMLElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => undefined;
  }

  const context = gsap.context(() => {
    gsap.from("[data-about-globe-wrap]", { opacity: 0.65, scale: 0.97, duration: 0.85, ease: "power3.out" });
  }, root);

  return () => context.revert();
}
