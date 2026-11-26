const introDelay = 1700;

export function scheduleHomeIntroScroll(services: HTMLElement): () => void {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const initialHash = window.location.hash;
  if (
    !navigation ||
    navigation.type !== "navigate" ||
    new URL(navigation.name).pathname !== "/" ||
    (initialHash !== "" && initialHash !== "#home") ||
    window.scrollY !== 0 ||
    motion.matches ||
    document.hidden
  ) return () => undefined;

  const listeners = new AbortController();
  const { signal } = listeners;
  const timer = window.setTimeout(() => {
    cancel();
    if (!motion.matches && !document.hidden && window.location.hash === initialHash && window.scrollY === 0) {
      services.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, introDelay);

  function cancel(): void {
    window.clearTimeout(timer);
    listeners.abort();
  }

  for (const event of ["wheel", "touchstart", "pointerdown", "keydown", "scroll", "hashchange"]) {
    window.addEventListener(event, cancel, { passive: true, signal });
  }
  document.addEventListener("visibilitychange", cancel, { signal });
  motion.addEventListener("change", cancel, { signal });
  return cancel;
}
