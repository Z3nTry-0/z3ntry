import { paintAsciiField, rippleDuration } from "./ascii-field";

export function setupAsciiLock(container: HTMLElement): () => void {
  if (!(container instanceof HTMLButtonElement)) return () => undefined;
  const panel = container;
  const output = panel.querySelector<HTMLElement>("[data-ascii-output]");
  const image = panel.querySelector("img");
  const canvas = document.createElement("canvas");
  const display = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  const sample = mask.getContext("2d");
  if (!output || !image || !display || !sample) return () => undefined;

  let visible = false;
  let pixels: Uint8ClampedArray | undefined;
  let timer: number | undefined;
  let frame: number | undefined;
  let variant = 0;
  let origin: { x: number; y: number; time: number } | undefined;

  const draw = (now = performance.now()): void => {
    if (!pixels) return;
    const age = origin ? now - origin.time : rippleDuration;
    if (age >= rippleDuration) origin = undefined;
    paintAsciiField(display, pixels, mask.width, mask.height, variant, origin && { ...origin, age });
  };

  const resize = (): void => {
    const { clientWidth: width, clientHeight: height } = output;
    if (!height || !width || !image.naturalWidth) return;
    canvas.width = width;
    canvas.height = height;
    mask.width = Math.max(1, Math.floor(width / 4.5));
    mask.height = Math.max(1, Math.floor(height / 6.5));
    const lockHeight = height * 0.76;
    const lockWidth = lockHeight * image.naturalWidth / image.naturalHeight;
    sample.setTransform(mask.width / width, 0, 0, mask.height / height, 0, 0);
    sample.drawImage(image, (width - lockWidth) / 2, (height - lockHeight) / 2, lockWidth, lockHeight);
    pixels = sample.getImageData(0, 0, mask.width, mask.height).data;
    draw();
    panel.setAttribute("data-ascii-ready", "");
    panel.disabled = false;
  };

  const tick = (now: number): void => {
    frame = undefined;
    draw(now);
    if (origin) frame = requestAnimationFrame(tick);
  };

  const sync = (): void => {
    if (visible && !document.hidden) {
      timer ??= window.setInterval(() => {
        variant++;
        if (!origin) draw();
      }, 1800);
    } else {
      window.clearInterval(timer);
      timer = undefined;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      origin = undefined;
    }
    if (visible && !document.hidden && !origin) draw();
  };

  const ripple = (event: MouseEvent): void => {
    const bounds = output.getBoundingClientRect();
    origin = {
      x: event.detail ? event.clientX - bounds.left : bounds.width / 2,
      y: event.detail ? event.clientY - bounds.top : bounds.height / 2,
      time: performance.now(),
    };
    frame ??= requestAnimationFrame(tick);
  };

  const viewport = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    sync();
  });
  const sizing = new ResizeObserver(resize);
  output.append(canvas);
  viewport.observe(panel);
  sizing.observe(output);
  image.addEventListener("load", resize);
  panel.addEventListener("click", ripple);
  document.addEventListener("visibilitychange", sync);

  return () => {
    visible = false;
    sync();
    viewport.disconnect();
    sizing.disconnect();
    image.removeEventListener("load", resize);
    panel.removeEventListener("click", ripple);
    document.removeEventListener("visibilitychange", sync);
    canvas.remove();
    panel.removeAttribute("data-ascii-ready");
    panel.disabled = true;
  };
}
