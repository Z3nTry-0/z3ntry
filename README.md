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
