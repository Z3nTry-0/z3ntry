type Section = "home" | "about" | "services" | "experience" | "contact";

export function observeAboutBoundary(
  about: HTMLElement,
  onChange: (section: Section) => void,
  sections: { services?: HTMLElement | null; experience?: HTMLElement | null; contact?: HTMLElement | null } = {}
): () => void {
  const { services, experience, contact } = sections;
  const boundaries = [
    ["experience", experience],
    ["services", services],
    ["about", about],
  ] as const;
  let current: Section | undefined;
  let frame: number | undefined;

  const update = (): void => {
    frame = undefined;
    const boundary = window.innerHeight / 2;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const next = contact && (contact.getBoundingClientRect().top <= boundary || atBottom)
      ? "contact"
      : boundaries.find(([, element]) => element && element.getBoundingClientRect().top <= boundary)?.[0] ?? "home";
    if (next !== current) {
      current = next;
      onChange(next);
    }
  };
  const schedule = (): void => { frame ??= window.requestAnimationFrame(update); };

  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
  };
}
