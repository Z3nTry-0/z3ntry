export function mountVisibleScene(
  container: HTMLElement,
  load: () => Promise<(container: HTMLElement) => () => void>
): () => void {
  let nearViewport = false;
  let loading = false;
  let disposed = false;
  let disposeScene: (() => void) | undefined;

  function mount(): void {
    if (disposed || loading || !nearViewport || document.hidden) return;
    loading = true;
    void load().then((setup) => {
      if (disposed) return;
      if (document.hidden || !nearViewport) {
        loading = false;
        return;
      }
      disposeScene = setup(container);
    }).catch(() => {
      // If loading or WebGL initialization fails, keep the CSS fallback.
    });
  }

  const observer = new IntersectionObserver(([entry]) => {
    nearViewport = entry?.isIntersecting ?? false;
    mount();
  }, { rootMargin: "160px" });

  observer.observe(container);
  document.addEventListener("visibilitychange", mount);
  return () => {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    document.removeEventListener("visibilitychange", mount);
    disposeScene?.();
    disposeScene = undefined;
  };
}
