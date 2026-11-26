import assert from "node:assert/strict";
import test from "node:test";
import { getRoutePhase, routeHoldMs, routeCycleMs, routeTravelMs } from "../src/lib/three/route-phase.ts";

test("the route grows from its origin before the signal appears", () => {
  assert.deepEqual(getRoutePhase(-1), { progress: 0, visible: false, signal: null });
  assert.deepEqual(getRoutePhase(routeTravelMs / 2), { progress: 0.5, visible: true, signal: null });
  assert.deepEqual(getRoutePhase(routeTravelMs), { progress: 1, visible: true, signal: 0 });
});

test("the signal traverses the completed route during a two-second hold", () => {
  assert.equal(routeHoldMs, 2000);
  assert.deepEqual(getRoutePhase(routeTravelMs + routeHoldMs / 2), { progress: 1, visible: true, signal: 0.5 });
  assert.deepEqual(getRoutePhase(routeTravelMs + routeHoldMs), { progress: 1, visible: true, signal: 1 });
  assert.deepEqual(getRoutePhase(routeTravelMs + routeHoldMs + 1), { progress: 1, visible: false, signal: null });
  assert.equal(getRoutePhase(routeCycleMs - 1).visible, false);
});
