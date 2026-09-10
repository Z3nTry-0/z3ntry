# ANIMATIONS.md — Motion, Globe and WebGL Guidelines

This document is the source of truth for animation and interactive graphics.

Visual style belongs in `../DESIGN.md`.
General technical architecture belongs in `ARCHITECTURE.md`.

---

## 1. Animation goals

Animations should reinforce the design without making the landing page feel overloaded.

The main interactive visual is a globe that:

- represents global connectivity;
- uses a restrained number of network routes;
- makes Colombia the primary origin/highlight;
- supports pointer and touch interaction;
- remains visually compatible with the terminal-inspired interface;
- degrades gracefully on mobile and reduced-motion environments.

Animation is enhancement, not a requirement for accessing content.

---

## 2. Approved stack

Use:

- `three`
- `three-globe`
- `motion`
- `gsap`

Optional Three.js controls may be used when required for pointer/touch globe interaction.

Do not introduce another animation library unless the current stack cannot reasonably solve the requirement.

---

## 3. Responsibility by library

Motion, GSAP, and Three.js must have clearly separated responsibilities.

### Motion

Use Motion for lightweight DOM/SVG interactions:

- opacity;
- translate/scale;
- reveal effects;
- hover/focus feedback;
- SVG path drawing;
- terminal cursor/prompt effects;
- simple staggered entrances.

Prefer small, local animations.

### GSAP

Use GSAP for:

- coordinated hero timelines;
- complex multi-element sequences;
- scroll-linked animation;
- `ScrollTrigger`;
- synchronized section transitions;
- animating numeric properties of a Three.js camera/object when needed.

### Three.js / `three-globe`

Use Three.js or the globe library for:

- globe rendering;
- camera;
- controls;
- globe rotation;
- arc/path visualization;
- connection dash movement;
- WebGL lifecycle.

---

## 4. Ownership rule

Do not animate the same property on the same element with multiple systems.

Bad:

```text
Motion -> transform
GSAP   -> transform
CSS    -> transition: transform
```

Good:

```text
Motion   -> local UI micro-interactions
GSAP     -> timeline / scroll orchestration
Three.js -> 3D rendering and globe movement
```

If two libraries must coordinate, define the ownership explicitly before implementation.

---

## 5. Interactive globe

### Cartographic treatment

The hero globe should use physical land/coastline outlines as its geographic
silhouette. Do not render internal political borders. Any antimeridian seam in
the source TopoJSON must be discarded so no synthetic line crosses the globe.

The current implementation uses `world-atlas/countries-110m.json`, reads its
`land` topology through `topojson-client`, and builds a lightweight Three.js
line-segment layer on top of `ThreeGlobe`. A small shader discards coastline
segments on the rear hemisphere. This prevents back-facing geography from
showing through the sphere and avoids the cost of triangulating a global land
polygon.

Visual treatment:

- dark, nearly transparent globe material;
- restrained graticules;
- graphite-gray coastlines rather than pure white;
- no internal political borders;
- Signal Red for Bogotá, radar rings, and active routes.

Current scene structure:

```text
Three.js Scene
├── ThreeGlobe
│   ├── dark globe material
│   ├── graticules
│   ├── front-facing coastline layer
│   ├── Bogotá marker
│   ├── destination points
│   ├── transient connection arcs
│   └── Bogotá radar rings
├── PerspectiveCamera
└── OrbitControls
```

### Preferred architecture

Use a native Astro component as the visual container:

```text
src/features/home/components/InteractiveGlobe.astro
```

Place browser-side implementation in:

```text
src/features/home/animations/globe.client.ts
```

Place globe connection data in:

```text
src/features/home/data/connections.ts
```

Place related types in:

```text
src/features/home/types/globe.ts
```

Do not add React only to mount Three.js.

---

## 6. Globe loading strategy

The globe is one of the heaviest client-side features and should be isolated.

Preferred flow:

1. Astro renders the globe container.
2. Determine whether the feature should initialize.
3. Dynamically import Three.js / globe code when appropriate.
4. Create the renderer only once.
5. Start the render loop.
6. Pause unnecessary work when not visible.
7. Dispose all resources during teardown.

If the globe is not immediately necessary for first paint, use `IntersectionObserver` or a similar visibility strategy before loading it.

---

## 7. Colombia as primary network origin

Colombia must be visually emphasized as the main origin of the network.

Use one or more restrained techniques:

- brighter origin point;
- subtle pulse;
- ring;
- route emission;
- short label;
- slightly stronger arc intensity.

Do not exaggerate the effect until it becomes visually distracting.

The actual appearance must follow `DESIGN.md`.

The initial camera position must face Bogotá (`4.7110, -74.0721`) so the origin
marker remains visible when the Hero first renders.

---

## 8. Connection data

Keep geography separate from rendering logic.

Example:

```ts
export interface GlobePoint {
  lat: number;
  lng: number;
  label: string;
}

export interface GlobeConnection {
  source: GlobePoint;
  target: GlobePoint;
}
```

Store connections in:

```text
src/features/home/data/connections.ts
```

Do not embed long route arrays directly inside `InteractiveGlobe.astro`.

The current catalog contains 73 destinations. Its coverage is intentionally
stronger across:

- United States;
- Mexico and Canada;
- Western, Central, Northern, Southern, and Eastern Europe;
- Central America and the Caribbean;
- South America.

The catalog size is not the simultaneous render count. It is a pool from which
active destinations are selected at runtime.

---

## 9. Connection density

The globe should communicate select global connections, not a full mesh.

Hero routes are transient: a route travels once from Bogotá to its destination,
then it is removed and replaced with another randomly selected destination. Keep
the active route count bounded and avoid duplicate active destinations.

Current behavior:

- 10 active route slots on desktop and tablet;
- 8 active route slots on compact viewports;
- 3.2-second travel time from origin to destination;
- staggered initial progress so routes do not finish simultaneously;
- one moving dash per route rather than a permanently filled arc;
- immediate removal at arrival;
- random replacement from the destination catalog;
- no duplicate destination among currently active routes.

Recommended hero range:

```text
5–12 visible routes
```

Use fewer connections on smaller devices when appropriate.

Do not raise the current 8–10 active-route range merely because the destination
catalog grows. New locations increase variety, not simultaneous WebGL density.

Avoid:

- dozens or hundreds of simultaneous arcs;
- dense line clusters;
- excessive particle counts;
- unnecessary labels on every destination.

The globe should remain readable behind or around hero content.

---

## 10. Interaction behavior

The globe should support:

- pointer rotation;
- touch rotation;
- optional limited zoom;
- slow idle rotation;
- temporary suppression or reduction of auto-rotation during user interaction.

Avoid aggressive inertial movement.

The globe should feel responsive but controlled.

Current camera behavior:

- pointer and touch rotate the globe horizontally;
- pan and zoom are disabled;
- vertical orbit is narrowly constrained to prevent the globe from flipping;
- idle motion begins by sweeping from right to left;
- idle motion is bounded around the Bogotá-facing camera position so Colombia
  does not leave the primary composition;
- pointer interaction suspends idle motion;
- after 3.6 seconds without interaction, the camera eases back toward Colombia
  and resumes the bounded sweep.

---

## 11. Camera and layout behavior

The globe should not assume one desktop viewport.

Its composition should adapt to:

```text
mobile
tablet
desktop
large desktop
```

Possible mobile simplifications:

- reduce globe size;
- reduce connection count;
- reduce pixel ratio;
- reduce animation speed;
- disable expensive decorative effects;
- change camera distance;
- reposition the globe relative to the hero.

Do not simply scale down a 1920×1080 composition.

The Hero currently uses oversizing and overflow as deliberate composition tools.
On desktop, the globe remains vertically centered, is shifted to the right, and
is intentionally cropped by the right viewport edge. It must not be placed in a
separate visual panel or divided from the logo. The centered logo may overlap the
globe while the left side retains substantial negative space.

---

## 12. WebGL performance

The globe implementation must:

- cap device pixel ratio;
- avoid unnecessary post-processing;
- avoid dynamic shadows unless essential;
- keep geometry reasonable;
- pause unnecessary rendering when hidden;
- stop work when the document is not visible when appropriate;
- use `ResizeObserver` for container sizing;
- reuse vectors/materials instead of allocating them each frame;
- reduce work on lower-power/mobile devices.

Reasonable baseline:

```ts
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.5)
);
```

Increase only if the visual benefit justifies the cost.

---

## 13. Render loop

Avoid uncontrolled permanent rendering when the globe is not visible.

A render loop should:

- use `requestAnimationFrame`;
- store the frame id;
- stop during cleanup;
- optionally pause when offscreen;
- avoid per-frame DOM queries;
- avoid per-frame object allocation where possible.

Example shape:

```ts
let frameId = 0;
let running = true;

function render() {
  if (!running) return;

  frameId = requestAnimationFrame(render);

  // update
  // renderer.render(...)
}

render();

return () => {
  running = false;
  cancelAnimationFrame(frameId);
};
```

---

## 14. Resize handling

Use `ResizeObserver` rather than attaching expensive global resize logic when possible.

On resize:

- read the container dimensions;
- update camera aspect;
- update projection matrix;
- resize renderer;
- do not recreate the entire globe.

---

## 15. Visibility handling

Where useful:

```ts
document.visibilityState
```

can be used to pause:

- idle rotation;
- dash animation;
- unnecessary render loops.

For below-the-fold or partially visible effects, consider `IntersectionObserver`.

---

## 16. Reduced motion

All significant animations must respect:

```css
@media (prefers-reduced-motion: reduce)
```

Also check reduced motion in JavaScript before initializing heavy effects.

When reduced motion is enabled:

- disable globe auto-rotation;
- disable moving network dashes and route replacement;
- avoid large scroll-linked transforms;
- skip long entrance timelines;
- replace complex movement with immediate rendering or short opacity changes;
- preserve all information and functionality.

The reduced-motion state keeps the selected routes and destinations static.

Example:

```ts
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
```

---

## 17. Motion guidelines

Use Motion for animations that are:

- local;
- lightweight;
- tied to one component;
- easy to cancel;
- not part of a large orchestration timeline.

Good examples:

```text
nav link hover
button hover
terminal cursor
small reveal
SVG line drawing
section label entrance
```

Avoid using Motion for the 3D renderer lifecycle.

---

## 18. GSAP guidelines

Use GSAP where timeline control provides real value.

Good examples:

- hero load sequence;
- synchronized title/globe/terminal entrance;
- scroll-based section transitions;
- multi-stage choreography;
- camera numeric-property animation.

Use scoped GSAP contexts when applicable.

Avoid global selectors when a feature root can scope the animation.

---

## 19. ScrollTrigger

Use ScrollTrigger only when scroll-driven motion adds clear value.

Do not turn every section into a pinned or scrubbed experience.

Avoid:

- excessive pinning;
- long scroll-jacking sequences;
- movement that harms readability;
- animating large layout properties when transforms would work.

Always verify mobile behavior independently.

---

## 20. Animation cleanup

Every setup function must have a teardown strategy.

Preferred pattern:

```ts
export function setupHeroAnimation(
  root: HTMLElement
): () => void {
  // setup

  return () => {
    // cleanup
  };
}
```

### GSAP cleanup

- kill timelines;
- kill relevant ScrollTriggers;
- remove event listeners;
- scope selectors.

### Motion cleanup

- stop/cancel persistent animations when the component is removed;
- clean up observers/listeners created around Motion.

### Three.js cleanup

- cancel animation frame;
- disconnect observers;
- remove listeners;
- dispose controls;
- dispose renderer;
- dispose manually created geometries;
- dispose materials;
- dispose textures;
- release references to large objects.

---

## 21. DOM hooks

Use `data-*` attributes for animation behavior.

Example:

```html
<section data-hero>
  <h1 data-hero-title>...</h1>
  <div data-globe></div>
</section>
```

Then:

```ts
const root = document.querySelector<HTMLElement>("[data-hero]");

if (!root) return;

const title = root.querySelector<HTMLElement>("[data-hero-title]");
```

Do not tie animation scripts to visual CSS class names unless the class is intentionally a behavioral contract.

---

## 22. Globe accessibility

If the globe is decorative:

- keep meaningful text in normal HTML;
- ensure the canvas is not exposed as meaningless interactive content to assistive technology.

If the globe communicates actual data:

- provide an accessible text summary;
- do not require hover to obtain important information;
- ensure the same information exists outside the WebGL canvas.

WebGL must never be the only source of essential content.

---

## 23. Graceful degradation

The page must remain usable if:

- WebGL is unavailable;
- Three.js fails to initialize;
- JavaScript is disabled;
- reduced motion is enabled.

Preferred fallback:

- static globe visual;
- simplified background;
- non-animated network graphic;
- or no globe at all if the surrounding HTML still communicates the message.

Do not display raw runtime errors in the UI.

---

## 24. Avoid unnecessary visual load

Do not add animation simply because the libraries are available.

Avoid:

- animating every text block;
- multiple competing background effects;
- continuous movement across the entire screen;
- hundreds of network particles;
- excessive blur;
- multiple layers of parallax;
- combined GSAP + Motion + CSS animation for the same visual result.

The hero globe is the primary motion feature. Other animations should support it rather than compete with it.

---

## 25. Recommended feature organization

Example:

```text
src/features/home/
├── components/
│   ├── Hero.astro
│   ├── InteractiveGlobe.astro
│   └── HeroTerminal.astro
│
├── animations/
│   ├── hero.motion.ts
│   ├── hero.gsap.ts
│   └── globe.client.ts
│
├── data/
│   └── connections.ts
│
└── types/
    └── globe.ts
```

Only create separate files where the complexity justifies them.

For a small one-off reveal, keeping the animation near the component may be clearer.

---

## 26. Animation definition of done

For any animation or globe task:

- the animation follows `DESIGN.md`;
- Motion/GSAP/Three.js ownership is clear;
- reduced motion is supported;
- mobile behavior was considered;
- interaction works with pointer/touch when applicable;
- cleanup is implemented;
- no obvious memory leak remains;
- there are no console errors;
- the page remains usable without the animation;
- WebGL workload is bounded;
- globe connections remain visually restrained;
- Colombia remains the primary network origin when relevant.

Also run the repository quality gates from `AGENTS.md`.

---

## 27. Final motion principle

Use motion to communicate hierarchy, connection, and technical character.

Do not use motion to compensate for weak layout.

The final experience should feel intentional and controlled rather than constantly animated.
