import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Keep browser icons and the standalone mark in sync with the master SVG.
const root = new URL("../", import.meta.url);
const logo = await readFile(new URL("public/ree-logo.svg", root), "utf8");
const mark = logo.match(/    <g id="ree-mark">([\s\S]*?)\n    <\/g>/)?.[1];
if (!mark) throw new Error("The master logo is missing its ree-mark group.");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="title">
  <title id="title">REE</title>${mark}
</svg>
`;
await writeFile(new URL("public/ree-mark.svg", root), svg);
await writeFile(new URL("src/app/icon.svg", root), svg);
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(new URL("src/app/apple-icon.png", root).pathname);

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(1, 2); // ICO image type.
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL("src/app/favicon.ico", root), Buffer.concat([header, ...images]));
console.log("Generated REE SVG, favicon, and Apple touch icons.");
