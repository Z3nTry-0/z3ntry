import ThreeGlobe from "three-globe";
import { mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesAtlas from "world-atlas/countries-110m.json";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  aboutGlobeDestinations as destinations,
  aboutGlobeOrigin as bogota,
  type AboutGlobePoint as GlobePoint
} from "../data/globe";
import { startGlobeLifecycle } from "../../../lib/three/globe-lifecycle";
import { createGlobeRoutes } from "../../../lib/three/globe-routes";
import { compactRouteLimit, desktopRouteLimit } from "../../../lib/three/route-phase";

interface BoundaryGeometry {
  type: "MultiLineString";
  coordinates: number[][][];
}

interface AtlasTopology extends Topology {
  objects: { land: GeometryCollection };
}

interface GlobeNode extends GlobePoint {
  isOrigin: boolean;
}

function createCoastlines(globe: ThreeGlobe, coastline: BoundaryGeometry): THREE.LineSegments {
  const vertices: number[] = [];

  coastline.coordinates.forEach((line) => {
    for (let index = 1; index < line.length; index += 1) {
      const previous = line[index - 1];
      const current = line[index];
      if (!previous || !current) continue;
      const [previousLng, previousLat] = previous;
      const [currentLng, currentLat] = current;
      if (Math.abs(currentLng - previousLng) > 180) continue;
      const start = globe.getCoords(previousLat, previousLng, 0.008);
      const end = globe.getCoords(currentLat, currentLng, 0.008);
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
        gl_FragColor = vec4(0.42, 0.42, 0.42, 0.62);
      }
    `
  });
  const lines = new THREE.LineSegments(geometry, material);
  lines.renderOrder = 4;
  return lines;
}

export function setupAboutGlobe(container: HTMLElement): () => void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 47.99rem), (pointer: coarse)").matches;
  const atlas = countriesAtlas as unknown as AtlasTopology;
  const coastline = mesh(atlas, atlas.objects.land) as BoundaryGeometry;
  const nodes: GlobeNode[] = [
    { ...bogota, isOrigin: true },
    ...destinations.map((destination) => ({ ...destination, isOrigin: false }))
  ];

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !compact });
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.append(renderer.domElement);

  const globe = new ThreeGlobe({ animateIn: false })
    .showAtmosphere(false)
    .showGraticules(true)
    .pointsData(nodes)
    .pointLat("lat")
    .pointLng("lng")
    .pointColor((point) => (point as GlobeNode).isOrigin ? "#e10600" : "rgba(242, 242, 242, 0.58)")
    .pointAltitude((point) => (point as GlobeNode).isOrigin ? 0.025 : 0.012)
    .pointRadius((point) => (point as GlobeNode).isOrigin ? 0.72 : 0.25)
    .pointsTransitionDuration(0)
    .ringsData([bogota])
    .ringLat("lat")
    .ringLng("lng")
    .ringColor(() => (progress: number) => `rgba(225, 6, 0, ${Math.max(0, 0.4 - progress * 0.4)})`)
    .ringMaxRadius(5)
    .ringPropagationSpeed(reducedMotion ? 0 : 0.8)
    .ringRepeatPeriod(reducedMotion ? Infinity : 1900);

  const globeMaterial = globe.globeMaterial() as THREE.MeshBasicMaterial;
  globeMaterial.color.set(0x101010);
  globeMaterial.transparent = true;
  globeMaterial.opacity = 0.08;
  globeMaterial.depthWrite = true;

  const graticules = globe.children.find((child) => child instanceof THREE.LineSegments);
  if (graticules instanceof THREE.LineSegments && graticules.material instanceof THREE.LineBasicMaterial) {
    graticules.material.color.set(0x8a8a8a);
    graticules.material.opacity = 0.13;
  }

  globe.add(createCoastlines(globe, coastline));
  const advanceRoutes = createGlobeRoutes(
    globe, bogota, destinations, compact ? compactRouteLimit : desktopRouteLimit, !reducedMotion, 0.56
  );
  scene.add(globe);

  const cameraPosition = globe.getCoords(bogota.lat, bogota.lng, compact ? 2.85 : 2.55);
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.045;
  controls.rotateSpeed = 0.34;
  controls.minPolarAngle = 0.45;
  controls.maxPolarAngle = Math.PI - 0.45;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = -0.22;
  controls.update();

  let resumeDelay = 0;

  function pauseAutoRotate(): void {
    resumeDelay = 0;
    controls.autoRotate = false;
  }

  function resumeAutoRotate(): void {
    if (!reducedMotion) resumeDelay = 2800;
  }

  controls.addEventListener("start", pauseAutoRotate);
  controls.addEventListener("end", resumeAutoRotate);
  const stop = startGlobeLifecycle({
    container, globe, renderer, camera, scene, controls,
    animated: !reducedMotion,
    compact,
    beforeFrame: (elapsed) => {
      advanceRoutes(elapsed);
      if (resumeDelay <= 0) return;
      resumeDelay = Math.max(0, resumeDelay - elapsed);
      if (resumeDelay === 0) controls.autoRotate = true;
    }
  });

  return () => {
    controls.removeEventListener("start", pauseAutoRotate);
    controls.removeEventListener("end", resumeAutoRotate);
    stop();
  };
}
