# AGENTS.md — Codex Working Agreement

This file defines **how Codex should work in this repository**.

It is intentionally short. Detailed visual, architectural, and animation decisions live in dedicated documents and should not be duplicated here.

---

## 1. Repository documentation map

Before making changes, Codex must understand the role of each project document:

```text
.
├── AGENTS.md
├── README.md
├── DESIGN.md
└── docs/
    ├── ARCHITECTURE.md
    └── ANIMATIONS.md
```

### `AGENTS.md`

Defines:

- how Codex should approach tasks;
- which documents must be read;
- source-of-truth precedence;
- validation requirements;
- general coding behavior.

### `README.md`

Defines:

- what the project is;
- prerequisites;
- installation;
- local development;
- available npm scripts;
- Docker usage;
- how to build and preview the project.

Codex must keep the README aligned when commands, dependencies, setup, Docker usage, or project requirements change.

### `DESIGN.md`

This is the **visual and UX source of truth**.

It defines, or should define:

- brand identity;
- typography;
- colors;
- spacing;
- visual hierarchy;
- terminal-inspired UI language;
- page composition;
- responsive visual behavior;
- component appearance;
- visual rules for software-development and marketing content.

Codex must read `DESIGN.md` before changing:

- layout;
- typography;
- colors;
- spacing;
- visual effects;
- section presentation;
- component appearance;
- responsive visual behavior.

Do not invent a new visual system when `DESIGN.md` already defines one.

### `docs/ARCHITECTURE.md`

This is the **technical architecture source of truth**.

It defines:

- Astro project structure;
- feature-first / Screaming Architecture conventions;
- dependency boundaries;
- TypeScript rules;
- styling organization;
- accessibility and SEO expectations;
- package-management rules;
- ESLint and Astro checks;
- Docker;
- Compose;
- `.gitignore`;
- `.dockerignore`;
- environment-variable handling;
- technical performance requirements.

Codex must read it before making structural or infrastructure changes.

### `docs/ANIMATIONS.md`

This is the **motion and interactive-graphics source of truth**.

It defines:

- Three.js / `three-globe`;
- interactive globe behavior;
- Colombia as the primary network origin;
- GSAP responsibilities;
- Motion responsibilities;
- animation ownership;
- reduced-motion behavior;
- WebGL performance;
- responsive animation degradation;
- cleanup and lifecycle rules.

Codex must read it before adding or modifying animations, WebGL, Three.js, GSAP, Motion, or interactive visual effects.

---

## 2. Required reading by task

Do not blindly read every file for every trivial change. Read the documents relevant to the task.

| Task | Required documents |
|---|---|
| Any repository task | `AGENTS.md` |
| Visual/UI change | `AGENTS.md`, `DESIGN.md` |
| New section or feature | `AGENTS.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` |
| Refactor / folder structure | `AGENTS.md`, `docs/ARCHITECTURE.md` |
| Globe / GSAP / Motion change | `AGENTS.md`, `DESIGN.md`, `docs/ANIMATIONS.md` |
| New animated section | `AGENTS.md`, `DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/ANIMATIONS.md` |
| Docker / Compose / lint / build config | `AGENTS.md`, `docs/ARCHITECTURE.md`, `README.md` |
| Setup or command change | `AGENTS.md`, `README.md`, and relevant technical docs |

---

## 3. Source-of-truth rules

Use the documents according to their responsibility.

### Visual decision

Use:

```text
DESIGN.md
```

### Technical organization

Use:

```text
docs/ARCHITECTURE.md
```

### Animation or 3D behavior

Use:

```text
docs/ANIMATIONS.md
```

### Setup and execution

Use:

```text
README.md
```

### Agent workflow

Use:

```text
AGENTS.md
```

Do not copy large sections from one document into another.

Cross-reference the canonical document instead.

---

## 4. Conflict resolution

When instructions appear to conflict, use this order:

1. Explicit instruction from the current user/task.
2. `DESIGN.md` for visual and UX decisions.
3. `docs/ARCHITECTURE.md` for technical structure.
4. `docs/ANIMATIONS.md` for animation and WebGL implementation.
5. `README.md` for documented setup and execution behavior.
6. Existing implementation, when it does not conflict with the sources above.

If a task intentionally changes one of these decisions, update the corresponding source-of-truth document as part of the same change.

---

## 5. General engineering behavior

Codex should:

- inspect existing code before creating new abstractions;
- preserve established conventions when they are sound;
- prefer Astro-native solutions;
- keep client-side JavaScript minimal;
- avoid unnecessary framework dependencies;
- avoid unrelated refactors;
- keep feature-specific code close to the feature;
- keep shared abstractions genuinely shared;
- use strict TypeScript;
- maintain semantic HTML;
- preserve accessibility;
- preserve responsive behavior;
- respect `prefers-reduced-motion`;
- clean up browser-side effects and animation resources;
- avoid committing secrets;
- use one package manager consistently.

Do not introduce React, Vue, Svelte, Solid, Preact, or another UI framework only to implement simple state, animation, or the globe.

---

## 6. Change workflow

For each task:

1. Read `AGENTS.md`.
2. Identify which source-of-truth documents apply.
3. Inspect the affected implementation.
4. Make the smallest coherent change.
5. Follow `DESIGN.md` for appearance.
6. Follow `docs/ARCHITECTURE.md` for technical placement.
7. Follow `docs/ANIMATIONS.md` for motion or 3D behavior.
8. Update documentation if the task changes a documented convention.
9. Run the required quality checks.
10. Report relevant validation results.

---

## 7. Quality gates

Before considering code changes complete, run the applicable checks.

Baseline:

```bash
npm run lint
npm run check
npm run build
```

When dependency reproducibility is relevant:

```bash
npm ci
```

When Docker files change:

```bash
docker build --target runtime -t astro-landing:test .
docker compose config
```

If the local environment supports it, also validate the production-like Compose service.

Do not disable lint rules globally merely to make validation pass.

---

## 8. Documentation maintenance

Update the canonical document when a change affects its responsibility.

Examples:

- new visual token → `DESIGN.md`;
- new feature boundary → `docs/ARCHITECTURE.md`;
- new globe behavior → `docs/ANIMATIONS.md`;
- new npm command → `README.md`;
- new Codex workflow rule → `AGENTS.md`.

Keep these documents synchronized with the implementation.

---

## 9. Final rule

The repository should remain easy to understand from the top level:

```text
AGENTS.md              -> how Codex works
README.md              -> what the project is and how to run it
DESIGN.md              -> how the product should look and feel
docs/ARCHITECTURE.md   -> how the codebase is organized
docs/ANIMATIONS.md     -> how motion and interactive graphics behave
```

Prefer clear ownership between documents over one oversized instruction file.
