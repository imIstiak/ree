import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

// Build social artwork from Ree's existing vector identity, without remote assets.
const root = new URL("../", import.meta.url);
const output = new URL("public/seo/", root);
await mkdir(output, { recursive: true });
const mark = await readFile(new URL("public/ree-mark.svg", root));
await sharp(mark).resize(512, 512).png().toFile(new URL("ree-logo.png", output).pathname);

const logo = (await readFile(new URL("public/ree-logo.svg", root), "utf8"))
  .replace('<svg ', '<svg x="78" y="152" width="210" height="284" ')
  .replace('color="#00664f"', 'color="#ffe7cc"');

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#004d3b"/>
  <rect x="22" y="22" width="1156" height="586" rx="3" fill="none" stroke="#ffe7cc" stroke-opacity=".45" stroke-dasharray="5 6"/>
  <path d="M337 95V535" stroke="#ffe7cc" stroke-opacity=".3"/>
  ${logo}
  <g fill="#ffe7cc">
    <text x="390" y="155" font-family="Arial, sans-serif" font-size="18" letter-spacing="4">DHAKA · BANGLADESH</text>
    <g font-family="Georgia, serif" font-size="59">
      <text x="387" y="257">Not everything old</text>
      <text x="387" y="329">belongs in the past.</text>
    </g>
    <text x="390" y="397" font-family="Arial, sans-serif" font-size="25">Luxury fashion from Bangladesh</text>
    <text x="390" y="445" font-family="Arial, sans-serif" font-size="19" opacity=".8">Rural craft. Bengali heritage. Living history.</text>
    <text x="390" y="527" font-family="Arial, sans-serif" font-size="22" letter-spacing="2">ree.bd</text>
  </g>
</svg>`;
await sharp(Buffer.from(card)).png().toFile(new URL("ree-social.png", output).pathname);
console.log("Generated Ree's 1200×630 social card and 512×512 organization logo.");
