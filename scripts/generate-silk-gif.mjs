// Run with `node scripts/generate-silk-gif.mjs` after installing the app's deps.
// Animation is baked into an actual transparent GIF; no runtime canvas or GPU.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const width = 640;
const height = 426;
const frames = 68;
const delay = 50;
const source = new URL("../assets/silk/silk-source.png", import.meta.url);
const output = new URL("../public/transitions/silk-drift.gif", import.meta.url);
const pixels = await sharp(source.pathname)
  .resize(width, height, { fit: "contain", background: "#0000" })
  .blur(1.1)
  .ensureAlpha()
  .raw()
  .toBuffer();
const animation = Buffer.alloc(width * height * 4 * frames);

for (let frame = 0; frame < frames; frame++) {
  const phase = frame / frames * Math.PI * 2;
  const offset = frame * width * height * 4;

  // Separate slow billows and smaller trailing ripples, with spatially varying
  // amplitudes. The photo supplies real folds rather than synthetic stripes.
  for (let y = 0; y < height; y++) {
    const v = y / height;
    const breeze = Math.sin(v * 5.2 - phase) * 11
      + Math.sin(v * 9.7 + phase * 2 + 0.8) * 3.2;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const freedom = 0.55 + (1 - u) * 0.45;
      const sx = x + breeze * freedom
        + Math.sin(u * 4 + v * 3 - phase) * 5;
      const sy = y + Math.sin(u * 6.1 + phase + v * 2) * 10 * freedom
        + Math.sin(u * 11 - phase * 2) * 2.4;
      const ix = Math.floor(sx);
      const iy = Math.floor(sy);
      if (ix < 0 || iy < 0 || ix >= width - 1 || iy >= height - 1) continue;

      const fx = sx - ix;
      const fy = sy - iy;
      const a = (iy * width + ix) * 4;
      const b = a + width * 4;
      const target = offset + (y * width + x) * 4;
      for (let channel = 0; channel < 4; channel++) {
        animation[target + channel] = Math.round(
          (pixels[a + channel] * (1 - fx) + pixels[a + 4 + channel] * fx) * (1 - fy)
          + (pixels[b + channel] * (1 - fx) + pixels[b + 4 + channel] * fx) * fy,
        );
      }
      // GIF has binary alpha; CSS supplies translucency without stippled noise.
      animation[target + 3] = animation[target + 3] >= 100 ? 255 : 0;
    }
  }
}

await mkdir(new URL("../public/transitions/", import.meta.url), { recursive: true });
await sharp(animation, {
  raw: { width, height: height * frames, channels: 4, pageHeight: height },
})
  .gif({ loop: 0, delay: Array(frames).fill(delay), colours: 48, dither: 0, effort: 7, interFrameMaxError: 16 })
  .toFile(output.pathname);

const metadata = await sharp(output.pathname, { animated: true }).metadata();
console.log(JSON.stringify({
  output: output.pathname,
  width: metadata.width,
  height: metadata.pageHeight,
  frames: metadata.pages,
  duration: metadata.delay.reduce((sum, value) => sum + value, 0),
  transparent: metadata.hasAlpha,
}, null, 2));
