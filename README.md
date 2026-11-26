# Z3nTry Landing Page

Landing page estática de Z3nTry construida con Astro, TypeScript y CSS moderno. El Hero inicial presenta la identidad de marca y una visualización interactiva de alcance global con Colombia como nodo de origen.

## Hero actual

- Logotipo oficial centrado y superpuesto sobre la composición 3D.
- Globo sobredimensionado, centrado verticalmente, desplazado y recortado de forma intencional por el borde derecho.
- Vista inicial orientada a Bogotá con rotación horizontal mediante puntero o interacción táctil.
- Costas y continentes representados sin fronteras políticas internas.
- Hasta diez conexiones en escritorio y cuatro en móvil: cada línea se extiende desde Bogotá y permanece visible dos segundos mientras un punto la recorre, sin parpadeos.
- Catálogo de 73 destinos con cobertura reforzada en Estados Unidos, México, Canadá, Europa y Latinoamérica.
- Fallback visual y comportamiento adaptado para `prefers-reduced-motion`.

La visualización utiliza `three`, `three-globe`, `world-atlas` y `topojson-client`. Los detalles de renderizado, interacción y ciclo de vida están documentados en [`docs/ANIMATIONS.md`](docs/ANIMATIONS.md).

## Página About

La ruta `/about` y la sección de la portada presentan el enfoque de Z3nTry, tres capacidades con diagramas y listas de servicios visibles, cifras de experiencia y el cierre `ALWAYS ONE STEP AHEAD`. El contenido se basa en `docs/About Z3nTry — English.md`, `docs/Z3nTry Services — Landing Page.md` y `docs/Experience — Español.md`. La ruta independiente tiene su propio globo interactivo.

La portada integra Home y About en un recorrido vertical libre. En una visita nueva desde arriba (`/` o `/#home`), la portada espera 1,7 segundos antes de desplazarse suavemente hacia Services, si no hay interacción y el visitante no prefiere movimiento reducido. La rueda, los gestos táctiles y el control `Scroll down` siguen disponibles. El globo compartido se encuadra en About y Contact; el texto de About permanece visible sin animación.

Services y Experience enlazan a `/#services` y `/#experience` desde el menú. Contact y el footer cierran la portada; `/contact` ofrece el mismo acceso directo por correo. Instagram (`@z3n_try`) es el único canal enlazado en el footer y se puede reemplazar con `PUBLIC_INSTAGRAM_HANDLE`.

El formulario de Contact prepara un borrador mediante `mailto:contact@z3ntry.com` en el cliente de correo configurado. El sitio no envía mensajes ni requiere una API o credenciales de Resend.

El `ClientRouter` nativo de Astro mantiene transiciones fluidas hacia rutas independientes, con limpieza de las instancias GSAP y WebGL durante cada cambio de página.

## Requisitos

- Node.js 26.13.1 (fijado en `.nvmrc`).
- npm 11 o superior.

## Desarrollo local

```bash
nvm use      # toma la versión de .nvmrc
npm ci
npm run dev
```

El archivo `.nvmrc` fija la versión de Node del proyecto. Con `nvm` instalado y el auto-switch configurado en el shell, la versión correcta se activa automáticamente al entrar al directorio.

Astro sirve el proyecto en `http://localhost:4321` por defecto.

## Scripts

```bash
npm run dev       # servidor local
npm run lint      # ESLint
npm run check     # validación de Astro y TypeScript
npm run build     # check + build de producción
npm run preview   # previsualiza dist/
npm test          # lint + check
```

## Estructura

La implementación sigue la arquitectura feature-first descrita en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). La identidad visual vive en [`DESIGN.md`](DESIGN.md) y el comportamiento del globo y las animaciones en [`docs/ANIMATIONS.md`](docs/ANIMATIONS.md).
