import type ThreeGlobe from "three-globe";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line, Mesh, type Camera, type Scene, type WebGLRenderer } from "three";

interface GlobeLifecycleOptions {
  container: HTMLElement;
  globe: ThreeGlobe;
  renderer: WebGLRenderer;
  camera: Camera & { aspect: number; updateProjectionMatrix(): void };
  scene: Scene;
  controls: OrbitControls;
  animated: boolean;
  compact: boolean;
  beforeFrame?: (elapsedMs: number) => void;
}

export function startGlobeLifecycle({
  container, globe, renderer, camera, scene, controls, animated, compact, beforeFrame
}: GlobeLifecycleOptions): () => void {
  const canvas = renderer.domElement;
  // OrbitControls sets this to "none"; keep vertical swipes and pinch zoom native.
  canvas.style.touchAction = "pan-y pinch-zoom";
  let visible = false;
  let stopped = false;
  let contextLost = false;
  let running = false;
  let frame: number | undefined;
  let previousTime: number | undefined;
  let hasSize = false;

  function queueFrame(): void {
    if (running && frame === undefined) frame = requestAnimationFrame(draw);
  }

  function draw(time: number): void {
    frame = undefined;
    if (!running || stopped) return;
    const elapsed = previousTime === undefined ? 0 : time - previousTime;
    previousTime = time;
    if (animated) {
      const delta = Math.min(elapsed, 50);
      beforeFrame?.(delta);
      // OrbitControls applies damping per update; autofocus rotation uses seconds.
      controls.update(delta / 1000);
    }
    renderer.render(scene, camera);
    if (renderer.info.render.calls > 0) container.classList.add("is-ready");
    if (animated || !container.classList.contains("is-ready")) queueFrame();
  }

  function sync(): void {
    const next = visible && hasSize && !document.hidden && !contextLost && !stopped;
    if (next === running) return;
    running = next;
    previousTime = undefined;
    if (running) {
      if (animated) globe.resumeAnimation();
      queueFrame();
    } else {
      globe.pauseAnimation();
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    }
  }

  const size = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { width, height } = entry.contentRect;
    hasSize = width > 0 && height > 0;
    if (hasSize && !contextLost) {
      const pixelRatio = Math.min(window.devicePixelRatio, compact ? 1 : 1.5);
      renderer.setDrawingBufferSize(width, height, pixelRatio);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    sync();
    queueFrame();
  });
  const viewport = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    sync();
  });

  const loseContext = (event: Event): void => {
    event.preventDefault();
    contextLost = true;
    container.classList.remove("is-ready");
    sync();
  };
  const restoreContext = (): void => {
    contextLost = false;
    size.unobserve(container);
    size.observe(container);
  };

  globe.pauseAnimation();
  size.observe(container);
  viewport.observe(container);
  controls.addEventListener("change", queueFrame);
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", loseContext);
  canvas.addEventListener("webglcontextrestored", restoreContext);

  return () => {
    if (stopped) return;
    stopped = true;
    sync();
    size.disconnect();
    viewport.disconnect();
    controls.removeEventListener("change", queueFrame);
    document.removeEventListener("visibilitychange", sync);
    canvas.removeEventListener("webglcontextlost", loseContext);
    canvas.removeEventListener("webglcontextrestored", restoreContext);
    controls.dispose();
    // three-globe exposes this teardown to dispose its private layer tickers.
    globe._destructor();
    globe.traverse((object) => {
      if (object instanceof Mesh || object instanceof Line) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    container.classList.remove("is-ready");
  };
}
