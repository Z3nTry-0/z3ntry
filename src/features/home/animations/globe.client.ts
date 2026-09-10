import ThreeGlobe from "three-globe";
import { mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesAtlas from "world-atlas/countries-110m.json";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { colombia, connections } from "../data/connections";

interface BoundaryGeometry {
  type: "MultiLineString";
  coordinates: number[][][];
}

interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  dashOffset: number;
}

interface PointDatum {
  lat: number;
  lng: number;
  isOrigin: boolean;
}

interface RingDatum {
  lat: number;
  lng: number;
}

type Connection = (typeof connections)[number];

interface AtlasTopology extends Topology {
  objects: {
    land: GeometryCollection;
  };
}

function createLandOutline(
  globe: ThreeGlobe,
  coastline: BoundaryGeometry
): THREE.LineSegments {
  const vertices: number[] = [];

  coastline.coordinates.forEach((line) => {
    for (let index = 1; index < line.length; index += 1) {
      const previous = line[index - 1];
      const current = line[index];
      if (!previous || !current) continue;

      const [previousLng, previousLat] = previous;
      const [currentLng, currentLat] = current;

      // Some closed coastlines jump from +180° to -180°. That is a seam in
      // longitude, not a real segment across the planet.
      if (Math.abs(currentLng - previousLng) > 180) continue;

      const start = globe.getCoords(previousLat, previousLng, 0.012);
      const end = globe.getCoords(currentLat, currentLng, 0.012);
      vertices.push(start.x, start.y, start.z, end.x, end.y, end.z);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    vertexShader: `
      varying float vFacingCamera;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vFacingCamera = dot(normalize(worldPosition.xyz), normalize(cameraPosition));
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      varying float vFacingCamera;

      void main() {
        if (vFacingCamera <= 0.0) discard;
        gl_FragColor = vec4(0.48, 0.48, 0.48, 0.76);
      }
    `
  });
  const outline = new THREE.LineSegments(geometry, material);
  outline.renderOrder = 4;
  return outline;
}

function selectConnections(limit: number): typeof connections {
  const pool = [...connections];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[targetIndex]] = [pool[targetIndex]!, pool[index]!];
  }

  return pool.slice(0, limit);
}

function toArc(connection: Connection, dashOffset = 0): ArcDatum {
  return {
    startLat: connection.source.lat,
    startLng: connection.source.lng,
    endLat: connection.target.lat,
    endLng: connection.target.lng,
    dashOffset
  };
}

function toPoint(connection: Connection): PointDatum {
  return {
    lat: connection.target.lat,
    lng: connection.target.lng,
    isOrigin: false
  };
}

function selectNextConnection(activeConnections: Connection[]): Connection {
  const activeDestinations = new Set(activeConnections.map(({ target }) => target.label));
  const availableConnections = connections.filter(
    ({ target }) => !activeDestinations.has(target.label)
  );
  const pool = availableConnections.length > 0 ? availableConnections : connections;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function setupGlobe(container: HTMLElement): () => void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactViewport = window.matchMedia("(max-width: 47.99rem)").matches;
  const visibleConnections = selectConnections(compactViewport ? 8 : 10);
  const routeCount = visibleConnections.length;
  const routeDuration = 3200;
  const atlas = countriesAtlas as unknown as AtlasTopology;
  const coastline = mesh(atlas, atlas.objects.land) as BoundaryGeometry;
  const routes: ArcDatum[] = visibleConnections.map((connection, index) =>
    toArc(connection, (routeCount - index - 1) / routeCount)
  );
  const nodes: PointDatum[] = visibleConnections.map(toPoint);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.append(renderer.domElement);

  const globe = new ThreeGlobe()
    .showAtmosphere(false)
    .showGraticules(true)
    .arcsData(routes)
    .arcStartLat("startLat")
    .arcStartLng("startLng")
    .arcEndLat("endLat")
    .arcEndLng("endLng")
    .arcColor(() => "rgba(225, 6, 0, 0.78)")
    .arcStroke(0.2)
    .arcAltitudeAutoScale(0.44)
    .arcDashLength(0.24)
    .arcDashGap(1)
    .arcDashInitialGap("dashOffset")
    .arcDashAnimateTime(prefersReducedMotion ? 0 : routeDuration)
    .arcsTransitionDuration(0)
    .pointsData(nodes)
    .pointLat("lat")
    .pointLng("lng")
    .pointColor((point) => (point as PointDatum).isOrigin ? "#e10600" : "rgba(242, 242, 242, 0.82)")
    .pointAltitude((point) => (point as PointDatum).isOrigin ? 0.085 : 0.018)
    .pointRadius((point) => (point as PointDatum).isOrigin ? 1.65 : 0.34)
    .pointsTransitionDuration(0)
    .ringsData([{ lat: colombia.lat, lng: colombia.lng } satisfies RingDatum])
    .ringLat("lat")
    .ringLng("lng")
    .ringColor(() => (progress: number) => `rgba(225, 6, 0, ${Math.max(0, 0.58 - progress * 0.58)})`)
    .ringMaxRadius(6.4)
    .ringPropagationSpeed(prefersReducedMotion ? 0 : 1.2)
    .ringRepeatPeriod(prefersReducedMotion ? Infinity : 1450);

  const globeMaterial = globe.globeMaterial() as THREE.MeshBasicMaterial;
  globeMaterial.color = new THREE.Color(0x111111);
  globeMaterial.transparent = true;
  globeMaterial.opacity = 0.09;
  globeMaterial.wireframe = false;
  globeMaterial.depthWrite = true;

  const graticuleLayer = globe.children.find(
    (child) => child instanceof THREE.LineSegments
  ) as THREE.LineSegments | undefined;
  const graticuleMaterial = graticuleLayer?.material;
  if (graticuleMaterial instanceof THREE.LineBasicMaterial) {
    graticuleMaterial.color.set(0xf2f2f2);
    graticuleMaterial.opacity = 0.18;
  }

  globe.add(createLandOutline(globe, coastline));

  const markerPosition = globe.getCoords(colombia.lat, colombia.lng, 0.025);
  const colombiaMarker = new THREE.Group();
  const markerCore = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xe10600 })
  );
  const markerHalo = new THREE.Mesh(
    new THREE.SphereGeometry(2.7, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xe10600,
      transparent: true,
      opacity: 0.13,
      depthWrite: false
    })
  );
  colombiaMarker.position.set(markerPosition.x, markerPosition.y, markerPosition.z);
  colombiaMarker.add(markerHalo, markerCore);
  globe.add(colombiaMarker);
  scene.add(globe);

  const cameraPosition = globe.getCoords(colombia.lat, colombia.lng, compactViewport ? 2.85 : 2.72);
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.rotateSpeed = 0.42;
  controls.autoRotate = false;
  controls.update();

  const initialSpherical = new THREE.Spherical().setFromVector3(
    camera.position.clone().sub(controls.target)
  );
  const automatedSpherical = initialSpherical.clone();
  const currentSpherical = initialSpherical.clone();
  const cameraOffset = new THREE.Vector3();
  const automatedPosition = new THREE.Vector3();
  controls.minPolarAngle = initialSpherical.phi - 0.08;
  controls.maxPolarAngle = initialSpherical.phi + 0.08;

  let frameId = 0;
  let isVisible = true;
  let pageIsVisible = !document.hidden;
  let disposed = false;
  let resumeRotationTimer = 0;
  let routeCycleTimer = 0;
  let routeSlot = 0;
  let automaticMotionActive = !prefersReducedMotion;
  let returningToColombia = false;
  let sweepAngle = 0;
  let sweepDirection = -1;
  let previousFrameTime = performance.now();

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { width, height } = entry.contentRect;
    if (width <= 0 || height <= 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry?.isIntersecting ?? false;
    if (isVisible) render();
  }, { threshold: 0.05 });

  function render(): void {
    if (disposed || !isVisible || !pageIsVisible || frameId !== 0) return;

    const loop = (): void => {
      if (disposed || !isVisible || !pageIsVisible) {
        frameId = 0;
        return;
      }
      const frameTime = performance.now();
      const deltaTime = Math.min(frameTime - previousFrameTime, 50);
      previousFrameTime = frameTime;

      if (automaticMotionActive) {
        if (returningToColombia) {
          cameraOffset.copy(camera.position).sub(controls.target);
          currentSpherical.setFromVector3(cameraOffset);
          const azimuthDelta = Math.atan2(
            Math.sin(initialSpherical.theta - currentSpherical.theta),
            Math.cos(initialSpherical.theta - currentSpherical.theta)
          );
          const returnProgress = Math.min(1, deltaTime * 0.0025);
          currentSpherical.theta += azimuthDelta * returnProgress;
          currentSpherical.phi = THREE.MathUtils.lerp(
            currentSpherical.phi,
            initialSpherical.phi,
            returnProgress
          );
          automatedPosition.setFromSpherical(currentSpherical).add(controls.target);
          camera.position.copy(automatedPosition);

          if (Math.abs(azimuthDelta) < 0.003) {
            returningToColombia = false;
            sweepAngle = 0;
            sweepDirection = -1;
          }
        } else {
          sweepAngle += sweepDirection * deltaTime * 0.000015;
          if (Math.abs(sweepAngle) >= 0.14) {
            sweepAngle = Math.sign(sweepAngle) * 0.14;
            sweepDirection *= -1;
          }
          automatedSpherical.theta = initialSpherical.theta + sweepAngle;
          automatedPosition.setFromSpherical(automatedSpherical).add(controls.target);
          camera.position.copy(automatedPosition);
        }
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(loop);
    };

    loop();
  }

  function handleVisibilityChange(): void {
    pageIsVisible = !document.hidden;
    if (pageIsVisible) render();
  }

  function handlePointerDown(): void {
    window.clearTimeout(resumeRotationTimer);
    automaticMotionActive = false;
    returningToColombia = false;
  }

  function handlePointerEnd(): void {
    if (prefersReducedMotion) return;
    window.clearTimeout(resumeRotationTimer);
    resumeRotationTimer = window.setTimeout(() => {
      automaticMotionActive = true;
      returningToColombia = true;
    }, 3600);
  }

  function replaceCompletedRoute(): void {
    if (!isVisible || !pageIsVisible) return;
    const nextConnection = selectNextConnection(visibleConnections);
    visibleConnections[routeSlot] = nextConnection;
    routes[routeSlot] = toArc(nextConnection);
    nodes[routeSlot] = toPoint(nextConnection);
    globe.arcsData([...routes]);
    globe.pointsData([...nodes]);
    routeSlot = (routeSlot + 1) % routeCount;
  }

  resizeObserver.observe(container);
  intersectionObserver.observe(container);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  renderer.domElement.addEventListener("pointerdown", handlePointerDown);
  renderer.domElement.addEventListener("pointerup", handlePointerEnd);
  renderer.domElement.addEventListener("pointercancel", handlePointerEnd);
  if (!prefersReducedMotion) {
    routeCycleTimer = window.setInterval(replaceCompletedRoute, routeDuration / routeCount);
  }
  container.classList.add("is-ready");
  render();

  return () => {
    disposed = true;
    window.cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.clearTimeout(resumeRotationTimer);
    window.clearInterval(routeCycleTimer);
    renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
    renderer.domElement.removeEventListener("pointerup", handlePointerEnd);
    renderer.domElement.removeEventListener("pointercancel", handlePointerEnd);
    controls.dispose();
    globe.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
    container.classList.remove("is-ready");
  };
}
