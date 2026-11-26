export const routeTravelMs = 2600;
export const routeHoldMs = 2000;
export const routeCycleMs = routeTravelMs + routeHoldMs + 380;
export const desktopRouteLimit = 10;
export const compactRouteLimit = 4;

export function getRoutePhase(elapsed: number): { progress: number; visible: boolean; signal: number | null } {
  if (elapsed < 0) return { progress: 0, visible: false, signal: null };
  if (elapsed < routeTravelMs) return { progress: elapsed / routeTravelMs, visible: true, signal: null };
  const held = elapsed - routeTravelMs;
  if (held <= routeHoldMs) return { progress: 1, visible: true, signal: held / routeHoldMs };
  return { progress: 1, visible: false, signal: null };
}
