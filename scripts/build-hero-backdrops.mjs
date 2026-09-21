// Encode the approved, full-width campaign photographs for the landing hero.
//   node scripts/build-hero-backdrops.mjs
//
// The lossless masters already contain the extended rooms, balanced lighting and
// safe head/foot margins. Do not rebuild them from the original portraits: stretching
// their edges produces blurry side bands and clips the lower body.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const jobs = [
  { name: "stage", output: "campaign-stage.webp" },
  { name: "stairs", output: "campaign-stairs-wide.webp" },
  { name: "lounge", output: "campaign-lounge-wide.webp" },
];

await mkdir(new URL("../public/landing/", import.meta.url), { recursive: true });

for (const job of jobs) {
  const source = new URL(`../assets/hero/campaign-${job.name}-master.webp`, import.meta.url);
  const output = new URL(`../public/landing/${job.output}`, import.meta.url);
  const photo = sharp(source.pathname);
  const { width, height } = await photo.metadata();
  if (!width || !height || Math.abs(width / height - 1840 / 1090) > 0.01) {
    throw new Error(`${job.name}: expected a landscape master matching the 1840:1090 hero`);
  }

  const info = await photo.webp({ quality: 88, effort: 6 }).toFile(output.pathname);
  console.log(`${job.name}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
}
