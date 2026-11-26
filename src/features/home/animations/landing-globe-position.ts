export function setupLandingGlobePosition(root: HTMLElement): () => void {
  const hero = root.querySelector<HTMLElement>("[data-hero]");
  const stage = root.querySelector<HTMLElement>("[data-landing-stage]");
  const globe = root.querySelector<HTMLElement>("[data-landing-globe]");
  const aboutSlot = root.querySelector<HTMLElement>("[data-globe-about-slot]");
  const contactSlot = root.querySelector<HTMLElement>("[data-globe-contact-slot]");
  if (!hero || !stage || !globe || !aboutSlot || !contactSlot) return () => undefined;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame: number | null = null;

  const position = (): void => {
    frame = null;
    const viewportHeight = window.innerHeight;
    const width = globe.offsetWidth;
    if (width === 0) return;

    const about = aboutSlot.getBoundingClientRect();
    const start = viewportHeight * 0.92;
    const end = viewportHeight * 0.4;
    const progress = motion.matches
      ? Number(about.top <= end)
      : Math.max(0, Math.min(1, (start - about.top) / (start - end)));
    if (progress === 0) {
      globe.style.removeProperty("transform");
      return;
    }

    const contact = contactSlot.getBoundingClientRect();
    // Exchange targets only in the gap between them, where both are offscreen.
    const target = (about.bottom + contact.top) / 2 < viewportHeight / 2 ? contact : about;
    const stageBounds = stage.getBoundingClientRect();
    const x = target.left + target.width / 2 - stageBounds.left - globe.offsetLeft - width / 2;
    const y = target.top + target.height / 2 - stageBounds.top - globe.offsetTop;
    const scale = 1 + (target.width / width - 1) * progress;
    globe.style.transform = `translate(${x * progress}px, calc(-50% + ${y * progress}px)) scale(${scale})`;
  };

  const schedule = (): void => {
    if (frame === null) frame = window.requestAnimationFrame(position);
  };

  position();
  root.setAttribute("data-globe-following", "");
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  motion.addEventListener("change", schedule);

  const resize = new ResizeObserver(schedule);
  for (const element of [root, hero, stage, globe, aboutSlot, contactSlot]) resize.observe(element);

  return () => {
    if (frame !== null) window.cancelAnimationFrame(frame);
    resize.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    motion.removeEventListener("change", schedule);
    root.removeAttribute("data-globe-following");
    globe.style.removeProperty("transform");
  };
}
