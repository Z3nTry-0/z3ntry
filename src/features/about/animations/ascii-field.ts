const backdrop = "0123456789ABCDEF./:+";
const shading = "oOx08#";
export const rippleDuration = 660;

interface Ripple {
  x: number;
  y: number;
  age: number;
}

export function paintAsciiField(
  canvas: CanvasRenderingContext2D,
  pixels: Uint8ClampedArray,
  cols: number,
  rows: number,
  variant: number,
  ripple: Ripple | undefined,
): void {
  const width = canvas.canvas.width;
  const height = canvas.canvas.height;
  const dx = width / cols;
  const dy = height / rows;
  const radius = Math.min(85, width * 0.24);
  const phase = ripple ? ripple.age / rippleDuration : 1;
  canvas.clearRect(0, 0, width, height);
  canvas.font = `${Math.min(dx * 1.53, dy)}px monospace`;
  canvas.textAlign = "center";
  canvas.textBaseline = "middle";

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col + 0.5) * dx;
      const y = (row + 0.5) * dy;
      const offset = (row * cols + col) * 4;
      const inLock = pixels[offset + 3] > 127;
      const distance = ripple ? Math.hypot(x - ripple.x, y - ripple.y) : 0;
      const wave = distance < radius && phase < 1
        ? Math.max(0, 1 - Math.abs(distance / radius - phase) * 6) * (1 - phase * 0.7)
        : 0;
      const hash = (Math.imul(col + 17, 374761393) ^ Math.imul(row + 11, 668265263)) >>> 0;
      const flicker = inLock && hash % 13 === variant % 13 ? 1 : 0;

      canvas.fillStyle = inLock
        ? `rgb(${pixels[offset]}, ${pixels[offset + 1]}, ${pixels[offset + 2]})`
        : wave > 0.2 ? "#aeb2b7" : "#81868c";
      canvas.globalAlpha = inLock ? 0.92 : 0.22 + (hash % 7) * 0.01 + wave * 0.45;
      const glyph = inLock
        ? shading[(hash + flicker) % shading.length]
        : backdrop[(hash + Math.round(wave * 10)) % backdrop.length];
      const pushX = ripple && distance > 0 ? wave * (x - ripple.x) / distance : 0;
      const pushY = ripple && distance > 0 ? wave * (y - ripple.y) / distance : 0;
      canvas.fillText(glyph, x + dx * pushX, y + dy * pushY * 0.65);
    }
  }
  canvas.globalAlpha = 1;
}
