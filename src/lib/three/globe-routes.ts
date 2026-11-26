import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import type ThreeGlobe from "three-globe";
import { getRoutePhase, routeCycleMs } from "./route-phase";

interface Coordinates {
  lat: number;
  lng: number;
}

const segments = 96;

export function createGlobeRoutes(
  globe: ThreeGlobe,
  origin: Coordinates,
  destinations: readonly Coordinates[],
  count: number,
  animated: boolean,
  opacity: number
): (elapsed: number) => void {
  const coordinates = globe.getCoords(origin.lat, origin.lng, 0);
  const start = new Vector3(coordinates.x, coordinates.y, coordinates.z);
  const radius = start.length();
  start.normalize();
  const active = new Set<Coordinates>();
  const slots = Array.from({ length: Math.min(count, destinations.length) }, (_, index) => {
    const geometry = new BufferGeometry();
    const positions = new Float32BufferAttribute(new Float32Array((segments + 1) * 3), 3);
    geometry.setAttribute("position", positions);
    const material = new LineBasicMaterial({
      color: 0xe10600, transparent: true, opacity, depthWrite: false
    });
    const line = new Line(geometry, material);
    const signal = animated
      ? new Mesh(new SphereGeometry(radius * 0.012, 8, 6), new MeshBasicMaterial({ color: 0xff594f }))
      : undefined;
    if (signal) {
      signal.visible = false;
      globe.add(signal);
    }
    const end = new Vector3();
    const direction = new Vector3();
    let current: Coordinates | undefined;
    let time = -index * routeCycleMs / count;

    function replace(): void {
      const candidates = destinations.filter((destination) => !active.has(destination));
      const next = candidates[Math.floor(Math.random() * candidates.length)] ?? current;
      if (!next) return;
      if (current) active.delete(current);
      current = next;
      active.add(next);

      const point = globe.getCoords(next.lat, next.lng, 0);
      end.set(point.x, point.y, point.z).normalize();
      const angle = start.angleTo(end);
      const height = radius * Math.min(0.36, 0.1 + angle * 0.13);
      const sinAngle = Math.sin(angle);
      for (let step = 0; step <= segments; step += 1) {
        const progress = step / segments;
        if (sinAngle > 0.0001) {
          direction.copy(start).multiplyScalar(Math.sin((1 - progress) * angle) / sinAngle)
            .addScaledVector(end, Math.sin(progress * angle) / sinAngle);
        } else {
          direction.copy(start).lerp(end, progress).normalize();
        }
        direction.multiplyScalar(radius * 1.025 + Math.sin(Math.PI * progress) * height);
        positions.setXYZ(step, direction.x, direction.y, direction.z);
      }
      positions.needsUpdate = true;
      geometry.computeBoundingSphere();
    }

    replace();
    geometry.setDrawRange(0, animated ? 0 : segments + 1);
    globe.add(line);

    return (elapsed: number): void => {
      time += elapsed;
      if (time >= routeCycleMs) {
        time -= routeCycleMs;
        replace();
      }
      const phase = getRoutePhase(time);
      line.visible = phase.visible && phase.progress > 0;
      geometry.setDrawRange(0, Math.floor(phase.progress * segments) + 1);
      if (signal) {
        signal.visible = phase.signal !== null;
        if (phase.signal !== null) {
          const position = phase.signal * segments;
          const from = Math.floor(position);
          const to = Math.min(from + 1, segments);
          signal.position.fromBufferAttribute(positions, from);
          signal.position.lerp(direction.fromBufferAttribute(positions, to), position - from);
        }
      }
    };
  });

  return animated ? (elapsed) => slots.forEach((update) => update(elapsed)) : () => undefined;
}
