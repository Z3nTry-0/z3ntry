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

Both globes draw each route progressively from Bogotá to its destination over
2.6 seconds. The completed line stays visible for two seconds without blinking
while a small point travels along it from Bogotá to the destination. The line
then disappears before another destination is selected. Starts are
staggered, with at most ten routes on desktop and four on compact or
coarse-pointer devices. Active destinations do not repeat. Reduced motion
shows static completed routes without a moving point or replacement.

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

### About-page globe

The About page owns a separate, lighter globe instance in
`src/features/about/animations/about-globe.client.ts`. Its behavior differs
intentionally from the home Hero:

- up to ten routes leave Bogotá toward representative global locations;
- the camera starts facing Bogotá;
- pointer and touch input allow horizontal and vertical orbit;
- pan and zoom remain disabled;
- damping provides controlled inertia;
- slow automatic rotation pauses during interaction and resumes after 2.8 seconds;
- the renderer and controls pause when offscreen or when the document is hidden;
- reduced motion disables auto-rotation, route animation, and radar propagation.

The About globe connection data belongs in
`src/features/about/data/globe.ts`. The component must retain a CSS fallback and
an accessible text description if WebGL is unavailable.

### Page transitions

Home-to-feature navigation uses Astro's native `ClientRouter`. The root page
transition combines a short fade with less than one rem of vertical movement.
It must remain restrained, disable itself for reduced motion, and coordinate
with each page's GSAP entrance rather than competing with it.

Page-specific animation and WebGL setup must handle Astro navigation lifecycle
events:

- initialize or reinitialize on `astro:page-load`;
- dispose GSAP contexts, WebGL resources, observers, timers, and listeners on
  `astro:before-swap`;
- retain `pagehide` cleanup for full document exits.
- remount the globe on a persisted `pageshow` after the browser restores a
  previously cached document.

Both globes defer WebGL until the container is near the viewport and the
document is visible. The CSS fallback stays visible until a sized canvas has
drawn, and returns on context loss until Three.js restores the renderer.
Hidden or offscreen globes pause rendering and three-globe's internal cycles.
The active render loop follows the browser's `requestAnimationFrame` cadence
on all devices, without a separate FPS cap.
Compact devices retain a DPR of at most 1 and no MSAA. With reduced motion, the canvas only redraws
for initialization, resizing, restoration or direct control input. Vertical
swipes and pinch zoom remain native; horizontal dragging rotates the globe.

### Home-to-About scroll sequence

The Hero logo image drifts up and back in a continuous, gentle loop. The CSS
animation runs on the image so it does not override GSAP transforms on the
heading or section. Reduced motion leaves the image still.

On the landing page, Home and About form a continuous vertical experience. GSAP
`ScrollTrigger` owns the transition in
`src/features/home/animations/landing-scroll.gsap.ts`:

1. the Hero identity fades and moves slightly upward; the red accent only
   animates on entrance, while the side notes and coordinates have no tweens;
2. the single shared globe eases into the full square reserved beside (or below)
   the About introduction; `landing-globe-position.ts` owns its transform;
3. About copy and the complete capability lists remain stationary and visible.

The document scrolls freely and reversibly, without snap or pinning. The globe
stage stays sticky through Contact and leaves before the footer. After About’s
visual is offscreen, the same canvas moves to the Contact slot before it enters
the viewport. The standalone Contact page keeps a static SVG in that slot. No
new WebGL scene is created. Reduced motion skips the Hero interpolation.
The `Scroll down` anchor targets
`#about` and is shown in Home. The navigation tracks Home, About, Services,
Experience and Contact at the midpoint of the viewport; the terminal keeps its
Home/About context. One short SVG signal runs along a hairline between the
closing About note and Contact (beside the note on `/about`). It follows the
scroll on entry and remains static without view timelines or with reduced motion.

On a fresh visit to the top of Home (`/` or `/#home`), `home-intro-scroll.client.ts`
waits 1.7 seconds before a one-time native smooth scroll to Services. User
interaction, leaving the page, a different fragment target, or reduced-motion preference
prevent the automatic scroll. With reduced motion, the scroll-linked animations
are also disabled and About remains visible in normal document flow.

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
- disable progressive route drawing, moving route indicators, and replacement;
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

### Interactive terminal panel

The global terminal owns its local open/close transition in component CSS. It
expands vertically from the bottom-left prompt so its motion communicates the
relationship between trigger and panel without competing with the globe or the
page-level GSAP timelines. No other animation system may animate the panel's
opacity or transform.

When `prefers-reduced-motion: reduce` is active, the panel changes state without
transition and the prompt cursor remains static. The terminal is not rendered
visually below the desktop breakpoint defined in `DESIGN.md`.

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

### ASCII panel lifecycle

- The divider samples a flat SVG into a Canvas 2D character grid; it does not
  allocate a Three.js renderer. Only lock glyphs vary at rest. A click anywhere
  on the panel, touch, or keyboard activation starts a short localized ripple.
- The glyph timer and ripple stop offscreen or when the document is hidden.
  With reduced motion, the static illustration is used without mounting Canvas.

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
