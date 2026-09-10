# Z3nTry Landing Page

Landing page estática de Z3nTry construida con Astro, TypeScript y CSS moderno. El Hero inicial presenta la identidad de marca y una visualización interactiva de alcance global con Colombia como nodo de origen.

## Hero actual

- Logotipo oficial centrado y superpuesto sobre la composición 3D.
- Globo sobredimensionado, centrado verticalmente, desplazado y recortado de forma intencional por el borde derecho.
- Vista inicial orientada a Bogotá con rotación horizontal mediante puntero o interacción táctil.
- Costas y continentes representados sin fronteras políticas internas.
- Entre 8 y 10 conexiones transitorias activas: cada ruta sale de Bogotá, llega una vez a su destino y es sustituida por otra selección aleatoria.
- Catálogo de 73 destinos con cobertura reforzada en Estados Unidos, México, Canadá, Europa y Latinoamérica.
- Fallback visual y comportamiento adaptado para `prefers-reduced-motion`.

La visualización utiliza `three`, `three-globe`, `world-atlas` y `topojson-client`. Los detalles de renderizado, interacción y ciclo de vida están documentados en [`docs/ANIMATIONS.md`](docs/ANIMATIONS.md).

## Página About

La ruta `/about` presenta el perfil de Z3nTry mediante el headline `WE SECURE. WE ENGINEER. WE POSITION.`, las capacidades Cybersecurity, Development y Design, el mindset `ALWAYS ONE STEP AHEAD` y un globo tecnológico interactivo propio. El contenido se basa en los documentos oficiales disponibles en `docs/About Z3nTry — Español.md` y `docs/About Z3nTry — English.md`.

La portada integra Home y About en un único recorrido vertical. El control global `Scroll down`, la rueda del mouse y los gestos táctiles recorren una transición GSAP/ScrollTrigger en la que ambos contenidos se cruzan mediante fade, mientras un único globo persistente se aproxima y About emerge desde el fondo. El recorrido usa scroll snap para asentarse en la posición exacta de cada sección. El header, la terminal y el control de scroll son elementos globales persistentes del layout. La ruta `/about` se conserva como acceso directo independiente.

El `ClientRouter` nativo de Astro mantiene transiciones fluidas hacia rutas independientes, con limpieza de las instancias GSAP y WebGL durante cada cambio de página.

## Requisitos

- Node.js 24 o superior.
- npm 11 o superior.

## Desarrollo local

```bash
npm install
npm run dev
```

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
