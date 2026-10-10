// The order keepsake as a PDF, made in the browser (there is no backend): page one is the thank-you
// letter, page two the order slip, each laid on a sheet of textured paper like the screen. The
// letter and the slip are captured from a copy rendered off screen at a fixed width (so a phone gets
// the same pages as a desktop) with html-to-image, composed onto an A4 canvas with a soft shadow and
// a slight tilt, and bound with jsPDF. Both libraries load only when someone asks for the PDF.
// Everything is an image, so the PDF's text cannot be selected.

const PAGE = { width: 1654, height: 2339 }; // A4 at 200 dpi
const MARGIN = 150;
const DESK = "#efe6d2";
// Page pixels per CSS pixel for the desk's paper tiles, so the grain reads at the size it does on screen.
const TEXTURE_SCALE = 1.7;
const TILES = [
  ["--paper-mottle", 700, 700],
  ["--paper-fibre", 520, 260],
  ["--paper-grain", 180, 180],
] as const;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src.slice(0, 40)}…`));
    image.src = src;
  });
}

// The paper tiles are SVG data URIs held in custom properties on :root (globals.css).
async function tile(property: string, width: number, height: number, scale: number) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  const src = value.match(/^url\(["']?(.*?)["']?\)$/)?.[1];
  if (!src) return null;
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Multiplies the paper tiles into a canvas, then keeps only what lies inside `outline`'s pixels.
async function texture(context: CanvasRenderingContext2D, scale: number, outline?: HTMLCanvasElement) {
  const { width, height } = context.canvas;
  context.globalCompositeOperation = "multiply";
  for (const [property, tileWidth, tileHeight] of TILES) {
    const paper = await tile(property, tileWidth, tileHeight, scale);
    const pattern = paper && context.createPattern(paper, "repeat");
    if (!pattern) continue;
    context.fillStyle = pattern;
    context.fillRect(0, 0, width, height);
  }
  if (outline) {
    context.globalCompositeOperation = "destination-in";
    context.drawImage(outline, 0, 0);
  }
  context.globalCompositeOperation = "source-over";
}

// The captured letter or slip on its own paper: html-to-image cannot paint the tiles (see globals.css).
async function paperArt(art: HTMLCanvasElement, scale: number) {
  const canvas = document.createElement("canvas");
  canvas.width = art.width;
  canvas.height = art.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");
  context.drawImage(art, 0, 0);
  await texture(context, scale, art);
  return canvas;
}

async function paperSheet() {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE.width;
  canvas.height = PAGE.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");
  context.fillStyle = DESK;
  context.fillRect(0, 0, PAGE.width, PAGE.height);
  await texture(context, TEXTURE_SCALE);
  return { canvas, context };
}

// One page: the node, as large as the margins allow, centred on the paper and turned by `tilt` degrees.
async function page(node: HTMLElement, tilt: number, maxWidth = PAGE.width - MARGIN * 2) {
  const { toCanvas } = await import("html-to-image");
  const { width, height } = node.getBoundingClientRect();
  const scale = Math.min(maxWidth / width, (PAGE.height - MARGIN * 2) / height);
  const art = await paperArt(await toCanvas(node, { pixelRatio: scale, width, height }), scale);
  const { canvas, context } = await paperSheet();
  context.save();
  context.translate(PAGE.width / 2, PAGE.height / 2);
  context.rotate((tilt * Math.PI) / 180);
  context.shadowColor = "rgba(40, 24, 10, 0.28)";
  context.shadowBlur = 48;
  context.shadowOffsetY = 26;
  context.drawImage(art, -art.width / 2, -art.height / 2);
  context.restore();
  return canvas;
}

export async function downloadOrderPdf(root: HTMLElement, orderNumber: string) {
  const letter = root.querySelector<HTMLElement>('[data-pdf="letter"]');
  const slip = root.querySelector<HTMLElement>('[data-pdf="slip"]');
  if (!letter || !slip) throw new Error("Nothing to print");
  await document.fonts.ready;

  const pages = [await page(letter, -0.5), await page(slip, 1.2, 900)];
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  pages.forEach((canvas, index) => {
    if (index > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.88), "JPEG", 0, 0, 210, 297);
  });
  pdf.setProperties({ title: `Ree order ${orderNumber}`, subject: "Thank-you letter and order slip", author: "Ree" });
  pdf.save(`ree-order-${orderNumber}.pdf`);
}
