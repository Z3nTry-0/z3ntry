# Z3nTry - DESIGN.md

> Guía de implementación derivada de **Z3nTry Brand Guidelines - Z3N-BRD-001 - v1.0 - Agosto 2026**.
>
> Este archivo traduce el manual de marca a reglas prácticas para interfaces digitales. Cuando una decisión de UI no esté definida por el manual, no debe presentarse como una regla oficial de marca ni competir con los lineamientos de este documento.

---

## 1. Dirección de marca

Z3nTry existe en la intersección entre:

- Ciberseguridad ofensiva.
- Ciberseguridad defensiva.
- Desarrollo de software y arquitectura.
- Automatización, infraestructura y producto digital.
- Marketing técnico y orientado a datos.
- Tecnología contemporánea.
- Cultura técnica / underground.
- Disciplina corporativa.

> **Extensión digital:** desarrollo de software y marketing no aparecen como pilares de identidad en el manual de marca original. Se incorporan aquí como territorios de comunicación compatibles con la identidad existente, sin modificar sus colores, logotipo ni fundamentos visuales.

La experiencia visual debe sentirse:

- **Joven**: contemporánea, sin solemnidad innecesaria.
- **Técnica**: el dominio del tema debe sentirse antes que el discurso comercial.
- **Atrevida**: los hallazgos y riesgos no se suavizan por apariencia.
- **Minimalista**: cada elemento debe cumplir una función.
- **Premium**: precisión, acabado y ausencia de ruido.
- **Disruptiva**: cuestiona el estándar sin caer en caos visual.
- **Ofensiva**: comunica anticipación, no reacción tardía.
- **Rigurosa**: lo técnico y lo corporativo reciben el mismo nivel de cuidado.
- **Directa**: sin rodeos visuales ni verbales.

### Lo que Z3nTry no es

- No es una firma tradicional o excesivamente solemne.
- No utiliza lenguaje corporativo vacío.
- No adopta una estética de startup adolescente.
- No convierte la cultura hacker en decoración sin propósito.
- No depende de gradientes, glow, glassmorphism o efectos llamativos para verse tecnológica.


### Territorios de comunicación extendidos

La identidad puede aplicarse a tres grandes territorios digitales sin cambiar de lenguaje visual.

#### Cybersecurity

Conceptos asociados:

- Attack surface.
- Offensive / defensive operations.
- Findings y exposición.
- Threat intelligence.
- Hardening y resilience.
- Security assessments.

La comunicación debe priorizar evidencia, riesgo, impacto y acción.

#### Software Development

Conceptos asociados:

- Arquitectura de software.
- Backend y APIs.
- Cloud-native development.
- DevOps y CI/CD.
- Automatización.
- Observabilidad.
- Performance y reliability.
- Integraciones y sistemas distribuidos.

La estética técnica puede apoyarse en elementos reales de ingeniería como nombres de servicios, rutas, estados de despliegue, diagramas simples, métricas, commits, endpoints o pipelines. Deben comunicar funcionamiento real; no utilizar código ficticio únicamente como decoración.

Ejemplos de microcopy:

```text
// BUILD / RELEASE
DEPLOYMENT: HEALTHY
API LATENCY: 84ms
PIPELINE: PASSED
```

#### Marketing & Growth

Conceptos asociados:

- Posicionamiento de producto.
- Growth y adquisición.
- Campañas digitales.
- Conversión.
- Analítica.
- Contenido técnico.
- Go-to-market.
- Automatización de marketing.

El marketing debe conservar el tono de Z3nTry: datos antes que adjetivos, beneficios concretos antes que promesas genéricas y evidencia antes que superlativos.

Ejemplos de microcopy:

```text
// CAMPAIGN / PERFORMANCE
CONVERSION: 4.8%
QUALIFIED LEADS: 128
CAC: -17.4%
```

```text
Diseñamos, desplegamos y medimos sistemas digitales con objetivos verificables.
```

No convertir el territorio de marketing en una estética visual diferente. Cybersecurity, software y marketing deben sentirse como partes del mismo sistema Z3nTry.

---

## 2. Principio visual central

**La jerarquía se construye con espacio, tipografía, contraste y hairlines; no con contenedores decorativos.**

La interfaz debe sentirse como un sistema técnico preciso, no como una colección de tarjetas.

### Priorizar

- Superficies oscuras amplias.
- Espacio negativo.
- Jerarquía tipográfica fuerte.
- Líneas estructurales sutiles.
- Labels técnicos y microcopy monoespaciado.
- Acentos rojos puntuales.
- Asimetría y fragmentación controladas.

### Evitar

- Grandes superficies de color.
- Sombras pesadas.
- Resplandores.
- Degradados decorativos.
- Texturas de fondo densas.
- Cajas innecesarias alrededor de cada bloque.
- Efectos cyber/glitch usados solo como decoración.

---

## 3. Sistema de color

### Colores oficiales

| Token | Nombre | HEX | RGB | Uso principal |
|---|---|---:|---:|---|
| `--color-void` | Void Black | `#050505` | `5, 5, 5` | Fondo dominante |
| `--color-signal` | Signal Red | `#E10600` | `225, 6, 0` | Acento, señal, alerta |
| `--color-ash` | Ash White | `#F2F2F2` | `242, 242, 242` | Texto y contraste |

### Proporción visual de referencia

- **70% Void Black**
- **20% Ash White**
- **10% Signal Red**

Signal Red es exclusivamente un **acento**. Se utiliza para subrayar, señalar, marcar o alertar. No debe cubrir grandes superficies.

### Tokens CSS

```css
:root {
  --color-void: #050505;
  --color-signal: #e10600;
  --color-ash: #f2f2f2;

  /* Regla del sistema visual: blanco al 14% de opacidad. */
  --color-hairline: rgb(242 242 242 / 14%);
}
```

### Void Black

Usar para:

- Fondo principal.
- Navegación.
- Secciones.
- Superficies detrás del isologo.

### Ash White

Usar para:

- Titulares.
- Cuerpo de texto.
- Labels de alta prioridad.
- Elementos que requieran contraste tipográfico principal.

### Signal Red

Usar para:

- Marcadores activos.
- Indicadores de sección.
- Palabras o fragmentos breves de énfasis.
- Estados técnicos relevantes.
- Líneas de señal.
- Alertas críticas cuando el significado lo justifique.

### No hacer

- Reinterpretar los colores del logo.
- Sustituir Signal Red por otro color de marca.
- Usar rojo como fondo de grandes bloques.
- Introducir nuevos colores como decoración de marca.

Si el producto necesita colores semánticos adicionales para estados como éxito, advertencia o información, deben definirse como **tokens de producto**, no como nuevos colores oficiales de marca.

---

## 4. Tipografía

El sistema utiliza tres roles tipográficos.

### 4.1 Display

**Uso:** titulares, tags y afirmaciones principales.

**Dirección:** grotesk condensada / de alto impacto, bold, mayúsculas y presencia visual compacta.

Familias recomendadas por el manual:

- Neue Machina.
- Archivo Black.

Sustituto utilizado en el documento de marca:

- Liberation Sans Bold.

### 4.2 Body

**Uso:** párrafos, informes, contratos, explicaciones y texto extenso.

**Dirección:** grotesk neutra. La legibilidad tiene prioridad sobre la personalidad.

Familias recomendadas:

- Suisse Int'l.
- Inter.

Sustituto utilizado en el documento:

- Liberation Sans Regular.

### 4.3 Utility Mono

**Uso:** metadatos, IDs, códigos documentales, coordenadas y microcopy técnico.

Familias recomendadas:

- IBM Plex Mono.
- JetBrains Mono.

Sustituto utilizado en el documento:

- Liberation Mono.

### Escala de referencia del manual

| Rol | Tamaño / interlineado | Peso | Caja | Tracking |
|---|---|---|---|---|
| H1 / Display | `34 / 38 pt` | Bold | Uppercase | `+1%` |
| H2 / Section | `18 / 22 pt` | Bold | Uppercase | `+3%` |
| H3 / Subhead | `13 / 16 pt` | Bold | Según contenido | Default |
| Body | `10.5 / 17 pt` | Regular | Sentence case | Default |
| Caption / Mono | `8 / 12 pt` | Regular | Según contenido | `+5%` |

En web responsive puede variar la conversión exacta a `px`, pero deben conservarse:

- La jerarquía.
- El peso.
- El uso de mayúsculas.
- La relación de tracking.
- La separación clara entre display, body y mono.

### Estructura de tokens sugerida

```css
:root {
  --font-display: "Neue Machina", "Archivo Black", "Liberation Sans", sans-serif;
  --font-body: "Suisse Int'l", Inter, "Liberation Sans", sans-serif;
  --font-mono: "IBM Plex Mono", "JetBrains Mono", "Liberation Mono", monospace;
}

.type-display {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.type-section {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.type-body {
  font-family: var(--font-body);
  font-weight: 400;
}

.type-mono {
  font-family: var(--font-mono);
  font-weight: 400;
  letter-spacing: 0.05em;
}
```

> El manual no resuelve el licenciamiento final. No asumir que Neue Machina o Suisse Int'l pueden distribuirse sin validar sus licencias.

---

## 5. Logotipo

El isologo de Z3nTry se compone de dos bloques visuales inseparables:

- **Z3**: Signal Red, gestual e irregular. Representa la ofensiva y el vector de ataque.
- **nTRY**: blanco, más afilado y controlado. Representa la defensa y la precisión sobre el hallazgo.

### Reglas obligatorias

- Mantener orientación horizontal original.
- Mantener proporciones originales.
- Mantener los colores rojo y blanco originales.
- Mantener `Z3` y `nTRY` como una sola pieza.
- Usar el asset oficial; no reconstruir el logo con texto ni con otra tipografía.
- Colocarlo sobre fondos oscuros.
- Mantenerlo alejado de fotografías o texturas densas.
- No añadir bordes, contenedores ni marcos decorativos.
- No añadir sombras, biseles, resplandores ni degradados.

### Área de protección

El margen mínimo equivale a **X**, donde X es la altura del dígito `3` dentro del isologo.

Ningún texto, imagen, borde o grafismo debe invadir esa zona.

### Tamaño mínimo

- **Digital:** 32 px de altura para el isologo completo.
- **Impreso:** 15 mm de altura.

---

## 6. Lenguaje visual

### 6.1 Línea de señal

El trazo irregular del isologo puede extenderse al sistema como:

- Divisor.
- Acento.
- Marcador.
- Indicador de sección.

Debe usarse con moderación.

**Nunca convertirlo en textura de fondo completa.**

### 6.2 Fragmentación

Los bloques pueden presentar una ligera desalineación o corte diagonal que recuerde el trazo del logo.

Usos adecuados:

- Hero.
- Portadas.
- Transiciones de sección.
- Separadores editoriales.

Evitar en:

- Párrafos extensos.
- Formularios.
- Tablas densas.
- Grillas repetitivas de cards.

La fragmentación debe sentirse deliberada, nunca como un efecto glitch aleatorio.

### 6.3 Coordenadas y microcopy técnico

Usar etiquetas cortas en monoespaciada que funcionen como lecturas de sistema.

Patrones presentes en el manual:

```text
// 09 / SYSTEM
SEC.09 / VISUAL
Z3N-09.4.2026
```

Usos apropiados:

- Número de sección.
- Fecha.
- Timestamp.
- Identificador.
- Estado.
- Coordenada.
- Referencia documental.

Su función es reforzar el carácter técnico **sin saturar la pieza**.

### 6.4 Hairlines

Usar líneas de **1 px en blanco al 14% de opacidad** para:

- Estructurar grids.
- Separar regiones.
- Definir columnas.
- Dividir metadatos.
- Organizar contenido.

Los hairlines sustituyen cajas pesadas y sombras.

```css
.hairline {
  border-color: rgb(242 242 242 / 14%);
  border-width: 1px;
}
```

---

## 7. Layout y composición

El manual no define un grid web, una escala de spacing ni un sistema de `border-radius` específico. Las siguientes restricciones sí se derivan de sus principios visuales.

### Reglas de composición

1. El fondo oscuro debe dominar.
2. El espacio negativo es una herramienta principal de jerarquía.
3. No encerrar cada bloque en una caja.
4. Usar hairlines antes que cards, sombras o paneles decorativos.
5. Reservar el rojo para focos intencionales.
6. Usar display en mayúsculas para afirmaciones principales.
7. Usar mono para metadatos, no para todo el contenido.
8. Se permite asimetría cuando esté controlada.
9. La interfaz debe mantener legibilidad y rigor profesional.
10. Minimalismo antes que decoración.

### Contenedores

Cuando la funcionalidad exija un contenedor:

- Mantener fondo oscuro.
- Usar bordes finos y de bajo contraste.
- Evitar drop shadows.
- Evitar glow.
- Evitar marcos ornamentales.
- Priorizar espacio interno y separación mediante hairlines.

### Esquinas

El manual no especifica radios de borde. No convertir el redondeado pronunciado en una característica central de marca salvo que el producto lo requiera.

---

## 8. Componentes de interfaz

Esta sección traduce el sistema visual documentado a patrones digitales. Son decisiones de implementación compatibles con la marca; no agregan nuevos colores ni recursos visuales oficiales.

### 8.1 Header / navegación

- Oscuro, compacto y visualmente ligero.
- Priorizar espacio sobre un gran contenedor.
- Separar del contenido con hairline solo cuando sea necesario.
- Mantener el logo sobre una superficie limpia y oscura.
- La navegación no debe competir con el display principal.
- Un estado activo puede usar un pequeño marcador Signal Red en lugar de una gran pill rellena.

### 8.2 Hero

- Una afirmación dominante.
- Display en mayúsculas.
- Mucho espacio negativo.
- Rojo como señal puntual.
- Microcopy técnico opcional en mono.
- La imagen o recurso gráfico no debe competir con el logo ni con el titular.
- La fragmentación diagonal puede usarse como recurso focal de manera controlada.

#### Composición vigente del Hero principal

- El isologo oficial se centra horizontal y verticalmente como foco principal.
- El isologo se superpone al globo. Esta superposición es una decisión específica del Hero y debe preservar la legibilidad completa de la marca mediante contraste y capas controladas.
- El globo se centra verticalmente, se desplaza hacia la derecha y utiliza oversizing con recorte intencional por el borde derecho.
- No existe panel, divisor ni corte vertical entre el contenido y el globo: ambos pertenecen a una sola composición continua.
- No se debe forzar que todos los elementos entren perfectamente en el viewport. La escala y el overflow son recursos visuales deliberados.
- La izquierda mantiene abundante espacio negativo; el volumen visual principal se concentra en el centro y el lado derecho.
- Bogotá debe permanecer visible en la composición inicial.
- `Cybersecurity`, `Technologies` y `Design` se centran bajo el isologo y funcionan como un único descriptor.
- `A safer tomorrow` se ubica en el lado izquierdo.
- `Ideas / defense / growth / globally` se ubica hacia el extremo inferior derecho cuando el viewport dispone de espacio suficiente.
- Las líneas de ambos bloques editoriales aparecen debajo del texto, nunca a un costado.
- La navegación debe conservar presencia y legibilidad sin competir con el isologo.

#### Tratamiento visual del globo

- Usar una esfera oscura, graticules discretas y contornos físicos de costas y continentes.
- No mostrar fronteras políticas internas.
- Los contornos geográficos usan gris grafito de bajo brillo; no Ash White puro.
- Signal Red se reserva para Bogotá, pulsos, rutas y pequeños indicadores.
- Mantener profundidad mediante la superposición del globo, el isologo y las rutas, sin glow ni postprocesado decorativo.
- Las conexiones deben sentirse activas pero contenidas: varias rutas pueden coexistir, sin convertir el planeta en una malla densa.

#### Protección de la presentación

En el Hero se evita la selección accidental de contenido, la copia desde la interfaz y el arrastre nativo del isologo. Esta protección conserva la presentación durante la interacción, pero no debe considerarse una medida de seguridad ni sustituir la accesibilidad semántica.

### 8.3 Encabezado de sección

Anatomía recomendada:

```text
// 02 / CAPABILITY

OFFENSIVE SECURITY
------------------  <- línea Signal Red corta
```

- Eyebrow técnico / mono.
- Heading display en mayúsculas.
- Línea roja breve cuando aporte jerarquía.
- Espacio generoso antes del contenido.

### 8.4 Bloques de contenido

Preferir:

```text
LABEL / MONO
TÍTULO
Descripción...
-------------------------------- 1px hairline
```

Evitar como patrón por defecto:

```text
[ card redondeada + sombra + icono + gradiente ]
```

### 8.5 Botones / CTA

El manual no define un estilo de botón específico. Deben conservar el carácter general:

- Label directo.
- Contraste claro.
- Tratamiento mínimo.
- Signal Red reservado para prioridad o acento.
- Sin glow, bisel ni degradado decorativo.
- Evitar pills excesivas salvo necesidad funcional.

### 8.6 Terminal / consola

Una interfaz inspirada en terminal es compatible con el sistema de microcopy técnico siempre que sea funcional y contenida.

Usar:

- Tipografía mono.
- Comandos, IDs o estados breves.
- Ash White para lectura.
- Signal Red solo para énfasis significativo.
- Hairlines si hace falta separación.

Evitar:

- Código aleatorio de relleno.
- Glitch constante.
- Scanlines excesivos.
- Neon glow.
- Output decorativo que reduzca claridad.

### 8.7 Datos, findings y contenido de seguridad

El tono de marca privilegia hechos por encima de adjetivos.

Para findings, métricas y salidas técnicas:

- Mostrar el resultado primero.
- Hacer visible severidad o estado relevante.
- Priorizar cifras y evidencia.
- Mantener la explicación concisa.
- No suavizar hallazgos críticos mediante ambigüedad visual.


### 8.8 Desarrollo de software

Las secciones relacionadas con ingeniería deben verse como interfaces de sistemas reales, no como una simulación de código.

Patrones apropiados:

- Arquitecturas simplificadas mediante nodos y conexiones.
- APIs y endpoints como metadata técnica.
- Pipelines de CI/CD.
- Estados de build, test y deployment.
- Métricas de disponibilidad, latencia o throughput.
- Logs o terminales breves cuando expliquen una acción.
- Listas de tecnologías tratadas como información, no como una nube de logos decorativa.

Ejemplo:

```text
// SOFTWARE / PLATFORM

BACKEND SYSTEMS
Spring Boot · Java · PostgreSQL

DEPLOYMENT
Docker · Kubernetes · Cloud

STATUS
BUILD PASSED / 128 TESTS
```

Para arquitectura visual, preferir líneas finas, labels mono y conexiones limpias. Evitar diagramas excesivamente ornamentales, neón o elementos 3D sin función.

### 8.9 Marketing y comunicación comercial

Las secciones de marketing deben utilizar la misma precisión visual que un reporte técnico.

Patrones apropiados:

- Métricas de campañas.
- KPIs y resultados verificables.
- Comparaciones before / after.
- Embudos simples.
- Casos de estudio.
- Claims acompañados por evidencia.
- CTAs concretos y orientados a resultado.

Ejemplo:

```text
// GROWTH / CASE STUDY

+34% CONVERSION
-17% ACQUISITION COST
6 WEEKS TO VALIDATION
```

Preferir mensajes como:

```text
Reducimos el tiempo de despliegue de 45 a 12 minutos.
```

```text
La campaña generó 128 leads calificados con un CAC 17% menor.
```

Evitar:

```text
Transformamos tu negocio con soluciones digitales revolucionarias.
```

El objetivo es vender mediante claridad, capacidad técnica y resultados, no mediante una estética publicitaria separada de la identidad de Z3nTry.

---

## 9. Motion

El manual no define animaciones, duraciones ni curvas de easing.

Si se utiliza motion, debe respetar la personalidad documentada:

- Minimalista.
- Precisa.
- Funcional.
- Controlada.
- Sin distraer de la información.

No usar motion como excusa para introducir glitch, glow o ruido visual.

---

## 10. Tono de voz y UI copy

### Voz

- Directa.
- Técnica cuando debe serlo.
- Sin adornos.
- Verbos activos.
- Afirmaciones verificables.
- Cifras y hechos por encima de adjetivos.

### Preferir

```text
12 hallazgos críticos. 3 explotables sin autenticación.
```

```text
Identificamos la vulnerabilidad antes de que fuera explotada.
```

```text
El entorno de producción quedó expuesto durante 40 días.
```

### Evitar

```text
Soluciones revolucionarias de ciberseguridad de próxima generación.
```

```text
La experiencia de hacking más sofisticada del mercado.
```

```text
Esto podría eventualmente representar cierto nivel de exposición.
```

### CTA

Preferir labels breves y orientados a una acción clara:

```text
Ver hallazgos
Iniciar assessment
Revisar alcance
Contactar a Z3nTry
```

Evitar mensajes comerciales genéricos que no indiquen acción o resultado.

---

## 11. Información y documentación

Z3nTry utiliza identificadores técnicos estructurados en sus documentos oficiales.

Patrón:

```text
Z3N-ÁREA-NÚMERO
```

Áreas definidas:

- `LEG` - Legal.
- `SEC` - Security.
- `COM` - Comercial.
- `BRD` - Brand.
- `RH` - Recursos Humanos.
- `POL` - Políticas.

Clasificaciones:

- `PUBLIC`
- `INTERNAL`
- `CONFIDENTIAL`
- `RESTRICTED`

En interfaces que muestren reportes, archivos o findings oficiales, estos datos pueden presentarse como metadatos técnicos en monoespaciada.

---

## 12. Do / Don't

### Do

- Usar `#050505` como canvas dominante.
- Usar `#F2F2F2` para lectura de alto contraste.
- Usar `#E10600` como acento controlado.
- Construir jerarquía con espacio y tipografía.
- Usar hairlines de `1px` / `14%` de blanco.
- Usar display uppercase para afirmaciones principales.
- Usar mono para metadatos técnicos.
- Mantener el logo intacto sobre fondos oscuros y limpios.
- Usar fragmentación de forma puntual.
- Mantener el copy corto, técnico y directo.

### Don't

- Cubrir grandes áreas con rojo.
- Añadir colores de acento arbitrarios.
- Usar fondo claro como base principal de una composición de marca.
- Poner el logo sobre fondos visualmente ruidosos.
- Agregar sombras, glow, biseles o degradados al logo.
- Separar o recolorear el logo.
- Convertir cada sección en una card.
- Sobrecargar la interfaz con clichés cyberpunk.
- Añadir ruido sin función.
- Usar superlativos de marketing sin sustento.

---

## 13. Checklist de implementación

Antes de aprobar una pantalla:

- [ ] Void Black domina claramente la composición.
- [ ] Signal Red actúa como acento, no como gran superficie.
- [ ] El heading principal usa el rol display.
- [ ] El cuerpo usa grotesk neutra.
- [ ] El mono se reserva para metadata y microcopy técnico.
- [ ] La jerarquía depende principalmente de espacio y tipografía.
- [ ] Los divisores usan hairlines sutiles.
- [ ] La pantalla no depende de sombras o glow para construir jerarquía.
- [ ] El logo está intacto, correctamente coloreado y sobre fondo oscuro limpio.
- [ ] Se respeta el área de protección del logo.
- [ ] El logo tiene al menos 32 px de altura en digital.
- [ ] La fragmentación, si existe, está controlada y no afecta texto corrido.
- [ ] El microcopy técnico es breve y funcional.
- [ ] El copy es directo, verificable y sin relleno comercial.
- [ ] Si la sección trata software, utiliza conceptos reales de ingeniería en lugar de código decorativo.
- [ ] Si la sección trata marketing, los claims están respaldados por datos, evidencia o una propuesta de valor concreta.
- [ ] Cybersecurity, software y marketing conservan una única identidad visual.
- [ ] Todo elemento decorativo cumple una función clara.

---

## 14. Fuente de verdad

La autoridad final es **Z3nTry Brand Guidelines - Z3N-BRD-001 - v1.0**.

Este `DESIGN.md` es una traducción orientada a implementación. No define como reglas de marca elementos que el PDF deja abiertos, entre ellos:

- Escala fija de spacing para web.
- Breakpoints.
- Grid web.
- Valores de `border-radius`.
- Familia de iconografía.
- Duraciones o easing de animación.
- Colores semánticos adicionales.
- Selección final de tipografías licenciadas.

Esos elementos pueden añadirse posteriormente como **tokens de producto** sin modificar los fundamentos de marca anteriores.

Las secciones de **Software Development** y **Marketing & Growth** incluidas en este archivo son extensiones de implementación solicitadas para el producto digital; no forman parte de los pilares definidos explícitamente en `Z3N-BRD-001 v1.0`. Deben evolucionar siempre dentro del sistema visual y verbal de la marca existente.
