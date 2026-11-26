import assert from "node:assert/strict";
import test from "node:test";
import { paintAsciiField } from "../src/features/about/animations/ascii-field.ts";

const cols = 80;
const rows = 30;
const empty = new Uint8ClampedArray(cols * rows * 4);

function frame(pixels, ripple, elapsed = 4200) {
  const characters = [];
  const context = {
    canvas: { width: 400, height: 150 },
    clearRect() {},
    fillText(glyph, x, y) {
      characters.push([glyph, x, y, this.fillStyle, this.globalAlpha]);
    },
  };
  paintAsciiField(context, pixels, cols, rows, elapsed, ripple);
  return characters;
}

test("a click wave changes nearby glyphs and leaves distant cells unchanged", () => {
  const before = frame(empty);
  const ripple = { x: 50, y: 50, age: 280 };
  const during = frame(empty, ripple);
  assert.notDeepEqual(during, before);
  for (const [index, glyph] of before.entries()) {
    if (Math.hypot(glyph[1] - ripple.x, glyph[2] - ripple.y) >= 85) {
      assert.deepEqual(during[index], glyph);
    }
  }
  assert.deepEqual(frame(empty, { ...ripple, age: 660 }), before);
});

test("the lock changes glyphs without moving its silhouette or changing the idle backdrop", () => {
  const pixel = empty.slice();
  const center = 15 * cols + 40;
  pixel.set([250, 175, 45, 255], center * 4);
  const variants = Array.from({ length: 13 }, (_, variant) => frame(pixel, undefined, variant));
  assert.equal(variants[0][center][3], "rgb(250, 175, 45)");
  assert.equal(new Set(variants.map((glyphs) => glyphs[center][0])).size, 2);
  for (const glyphs of variants) {
    assert.deepEqual(glyphs[center].slice(1), variants[0][center].slice(1));
    assert.deepEqual(glyphs[center - 2], variants[0][center - 2]);
  }
  assert.deepEqual(frame(empty, undefined, 1000), frame(empty));
});
