# ARCHITECTURE.md — Astro Landing Page Technical Architecture

This document is the technical source of truth for the project.

Visual decisions belong in `../DESIGN.md`.
Animation and WebGL decisions belong in `ANIMATIONS.md`.

---

## 1. Technical goals

Build a production-ready landing page using:

- Astro;
- TypeScript;
- modern CSS;
- feature-first organization;
- Screaming Architecture principles adapted to Astro;
- minimal client-side JavaScript;
- ESLint and Astro checks as mandatory quality gates;
- Docker for reproducible local and production-like execution.

The architecture should remain simple enough for a landing page while still scaling cleanly as sections and interactions grow.

---

## 2. Primary stack

### Required

- Astro
- TypeScript
- CSS
- ESLint
- `eslint-plugin-astro`
- `typescript-eslint`
- `@astrojs/check`

### Interactive graphics

The approved animation/3D stack is documented in:

```text
docs/ANIMATIONS.md
```

Do not add another UI framework unless a concrete feature requires it and the additional client runtime is justified.

Astro remains the primary application framework.

---

## 3. Architectural style

Use a **feature-first structure inspired by Screaming Architecture**.

The codebase should communicate product capabilities such as:

```text
home
about
experience
services
certificates
```

rather than grouping all application logic only by technical type.

Astro framework directories such as `pages` and `layouts` remain top-level because they have framework-defined responsibilities.

---

## 4. Recommended structure

```text
src/
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── globe/
│
├── components/
│   ├── ui/
│   └── shell/
│
├── features/
│   ├── home/
│   │   ├── components/
│   │   ├── data/
│   │   ├── types/
│   │   └── animations/
│   ├── about/
│   │   ├── components/
│   │   ├── data/
│   │   └── types/
│   ├── experience/
│   │   ├── components/
│   │   ├── data/
│   │   └── types/
│   ├── services/
│   │   ├── components/
│   │   ├── data/
│   │   └── types/
│   └── certificates/
│       ├── components/
│       ├── data/
│       └── types/
│
├── layouts/
│   └── BaseLayout.astro
│
├── lib/
│   ├── animation/
│   ├── dom/
│   └── three/
│
├── pages/
│   └── index.astro
│
├── styles/
│   ├── reset.css
│   ├── tokens.css
│   ├── global.css
│   └── utilities.css
│
└── types/
    └── global.d.ts
```

This is a guideline, not a requirement to create empty folders.

Create a folder only when the feature needs it.

---

## 5. Why `features/` instead of only `components/`

A structure such as:

```text
components/
├── home/
├── about/
├── services/
└── certificates/
```

works for small projects, but it describes everything as UI.

A feature may eventually own:

- Astro components;
- local data;
- TypeScript types;
- browser scripts;
- animations;
- helpers specific to that feature.

Therefore prefer:

```text
features/services/
├── components/
├── data/
├── types/
└── animations/
```

This keeps related implementation together.

---

## 6. Dependency boundaries

### `src/pages`

Responsibilities:

- routing;
- top-level page composition;
- page metadata;
- composing features.

Avoid:

- large data definitions;
- Three.js initialization;
- complex animation timelines;
- feature-specific implementation details.

### `src/layouts`

Responsibilities:

- shared HTML document structure;
- `<head>`;
- metadata;
- global styles;
- common shell composition.

### `src/features/*`

A feature owns its local implementation.

A feature may import from:

- its own directory;
- `src/components`;
- `src/lib`;
- `src/styles`;
- shared types when genuinely required.

Avoid direct imports from one feature into another.

If multiple features need the same abstraction, move it to an intentionally shared layer.

### `src/components/ui`

Reusable presentation-focused components.

Examples:

```text
Button.astro
SectionTitle.astro
Icon.astro
```

Do not place feature data or 3D initialization here.

### `src/components/shell`

Reusable application-shell elements.

Examples:

```text
Header.astro
Footer.astro
TerminalFrame.astro
```

### `src/lib`

Cross-feature implementation utilities only.

Examples:

```text
reducedMotion.ts
cleanup.ts
renderer.ts
```

Do not turn `lib` into a miscellaneous folder.

---

## 7. Astro rules

### Static by default

Astro components should render static HTML/CSS unless interaction requires browser JavaScript.

Use JavaScript only for:

- interactive navigation;
- terminal interactions;
- animation;
- WebGL;
- explicitly interactive UI.

Do not create client-side state for content that can be generated at build time.

### Prefer `.astro`

Use native Astro components for:

- sections;
- cards;
- typography;
- layout;
- buttons;
- navigation;
- static content.

### Hydration

If another frontend framework is ever introduced, use the least aggressive client directive possible.

Prefer:

```text
client:visible
client:idle
```

Use:

```text
client:load
```

only when immediate interaction is required.

For the interactive globe, prefer an Astro container plus a client TypeScript module rather than adding React solely for Three.js.

---

## 8. TypeScript

Use strict TypeScript.

Avoid:

- `any`;
- unsafe assertions;
- untyped configuration objects;
- duplicated interfaces;
- unchecked DOM access.

Prefer narrowing:

```ts
const element = document.querySelector<HTMLElement>("[data-example]");

if (!element) {
  return;
}
```

Feature-specific types belong inside the feature.

Use `src/types` only for types genuinely shared across multiple features.

---

## 9. Naming conventions

### Folders

Use lowercase:

```text
features/home
features/services
components/ui
```

### Astro components

Use PascalCase:

```text
Hero.astro
InteractiveGlobe.astro
ServiceCard.astro
TerminalFrame.astro
```

### TypeScript files

Use descriptive names:

```text
globe.client.ts
connections.ts
reducedMotion.ts
```

Avoid generic names such as:

```text
helpers.ts
stuff.ts
data2.ts
script.ts
```

---

## 10. Data and presentation

Do not hardcode large content arrays inside Astro templates.

Prefer:

```text
src/features/services/data/services.ts
src/features/experience/data/experience.ts
src/features/certificates/data/certificates.ts
```

Data should remain typed.

Templates should focus on rendering.

---

## 11. Styling organization

Visual values are defined by `DESIGN.md`.

Technical CSS organization follows these rules:

- use Astro scoped styles for component-local styles;
- keep shared tokens in `src/styles/tokens.css`;
- keep reset/base styles in global stylesheets;
- add utilities only when they remove meaningful duplication;
- avoid a single giant global stylesheet;
- avoid repeated hardcoded values when a design token exists.

Do not invent brand tokens in this document. `DESIGN.md` owns those values.

---

## 12. Responsive implementation

Use fluid layout techniques before adding many breakpoints.

Examples:

```css
font-size: clamp(2rem, 6vw, 5.5rem);
```

Use:

- CSS Grid;
- Flexbox;
- `min()`;
- `max()`;
- `clamp()`;
- container-aware sizing when appropriate.

Test at minimum around:

```text
360px
768px
1024px
1440px
1920px
```

Visual behavior must remain consistent with `DESIGN.md`.

---

## 13. Accessibility

Mandatory:

- semantic HTML;
- logical heading hierarchy;
- one primary `h1`;
- keyboard-accessible interactive elements;
- visible focus states;
- correct link/button semantics;
- appropriate alt text;
- sufficient contrast;
- no critical information available only on hover;
- reduced-motion support.

Animation-specific accessibility is documented in `ANIMATIONS.md`.

---

## 14. SEO

`BaseLayout.astro` should support:

- title;
- meta description;
- canonical URL when deployment URL is known;
- Open Graph title;
- Open Graph description;
- Open Graph image;
- viewport;
- theme color;
- favicon.

Use semantic landmarks:

```text
header
nav
main
section
footer
```

---

## 15. DOM scripting

Use `data-*` attributes as stable JavaScript hooks.

Prefer:

```ts
const root = document.querySelector<HTMLElement>("[data-hero]");
const title = root?.querySelector<HTMLElement>("[data-hero-title]");
```

Avoid coupling behavior to purely visual class names.

Bad:

```ts
document.querySelector(".purple-title");
```

---

## 16. Client-side cleanup

Any browser-side setup must expose or contain cleanup for:

- event listeners;
- observers;
- timers;
- animation frames;
- external library instances.

Animation-specific cleanup requirements are defined in `ANIMATIONS.md`.

---

## 17. Package manager

Use exactly one package manager.

If the repository contains:

```text
package-lock.json
```

use npm by default.

Do not keep both:

```text
package-lock.json
pnpm-lock.yaml
```

unless the repository intentionally uses a workspace configuration requiring it.

If migrating to pnpm:

1. remove the npm lockfile;
2. generate `pnpm-lock.yaml`;
3. update Docker;
4. update CI;
5. update README commands;
6. validate all scripts.

---

## 18. Required package scripts

Recommended baseline:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint \"src/**/*.{astro,js,mjs,cjs,ts,mts,cts}\" \"astro.config.*\" \"eslint.config.*\"",
    "lint:fix": "npm run lint -- --fix",
    "test:lint": "npm run lint && npm run check",
    "test": "npm run test:lint"
  }
}
```

If unit or browser tests are added later, expand `test` instead of removing lint/type validation.

---

## 19. ESLint

Use ESLint flat config.

Recommended dependencies:

```bash
npm install -D   eslint   @eslint/js   eslint-plugin-astro   eslint-plugin-jsx-a11y   typescript-eslint   @astrojs/check   typescript
```

Baseline `eslint.config.js`:

```js
import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "coverage/**"
    ]
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  ...eslintPluginAstro.configs.recommended,

  {
    files: ["**/*.{ts,mts,cts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ]
    }
  },

  {
    files: ["**/*.astro"],
    rules: {
      "astro/no-set-html-directive": "error"
    }
  }
];
```

If an exception is genuinely necessary, scope it narrowly.

Do not disable a rule globally to hide a local problem.

---

## 20. Quality gates

Before considering a code change complete:

```bash
npm run lint
npm run check
npm run build
```

When dependency reproducibility matters:

```bash
npm ci
```

All applicable checks should pass.

---

## 21. Docker strategy

Assume a static Astro site unless SSR is explicitly introduced.

For static output:

- build with Node;
- serve `dist/` from a minimal static server;
- do not run `astro dev` in production;
- do not ship project `node_modules` in the final runtime image;
- use a multi-stage Dockerfile.

Recommended:

```dockerfile
# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS dev
COPY . .
EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM deps AS build
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3   CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

If the project moves to SSR, replace this static runtime with the appropriate Astro adapter/runtime architecture.

---

## 22. Compose

Recommended `compose.yml`:

```yaml
services:
  dev:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
    ports:
      - "4321:4321"
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    environment:
      NODE_ENV: development

  web:
    profiles:
      - production
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
    ports:
      - "8080:80"
    restart: unless-stopped

volumes:
  node_modules:
```

Development:

```bash
docker compose up --build dev
```

Production-like local run:

```bash
docker compose --profile production up --build web
```

Do not mount the source directory into the production container.

---

## 23. `.dockerignore`

Recommended baseline:

```gitignore
node_modules
dist
.astro
coverage

.git
.github
.gitignore

.env
.env.*
!.env.example

npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

.DS_Store
Thumbs.db

.vscode
.idea

README.md
```

Do not ignore files required by the build, including:

```text
package.json
package-lock.json
astro.config.*
tsconfig.json
src/
public/
```

---

## 24. `.gitignore`

Recommended baseline:

```gitignore
# dependencies
node_modules/

# Astro/build output
dist/
.astro/

# tests
coverage/

# environment
.env
.env.*
!.env.example

# logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# editors
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

# misc
*.local
```

Never commit secrets.

---

## 25. Environment variables

Only expose browser-safe values through Astro's public environment mechanism.

Never expose:

- private API tokens;
- cloud credentials;
- secret keys;
- deployment credentials.

Commit:

```text
.env.example
```

Do not commit real environment files containing secrets.

---

## 26. General performance

Performance is an architectural requirement.

- minimize initial JavaScript;
- lazy-load expensive browser-only code;
- optimize raster assets;
- prefer modern image formats;
- use Astro image tooling when useful;
- avoid unnecessarily large icon libraries;
- load only required font files/weights;
- prevent layout shifts;
- avoid unnecessary third-party scripts.

3D and animation performance requirements are defined in `ANIMATIONS.md`.

---

## 27. Error handling and graceful degradation

Core landing-page content must remain usable if:

- JavaScript is disabled;
- WebGL is unavailable;
- an animation library fails to initialize;
- reduced motion is enabled.

Interactive enhancement must not become a dependency for basic content access.

---

## 28. Technical definition of done

A technical task is complete when applicable items pass:

- feature boundaries remain clear;
- Astro remains static-first;
- client JavaScript is justified;
- TypeScript is properly typed;
- accessibility is preserved;
- no unnecessary framework was added;
- lint passes;
- Astro check passes;
- production build passes;
- Docker config remains valid when changed;
- README is updated if execution/setup changed;
- architecture documentation is updated if conventions changed.

---

## 29. Architectural principle

When choosing between an elaborate abstraction and a clear Astro-native implementation, prefer the Astro-native implementation.

The project should feel sophisticated because of its design and interaction, not because the codebase is unnecessarily complex.
