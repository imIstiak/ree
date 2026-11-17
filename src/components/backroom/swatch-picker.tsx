"use client";

import { useRef, useState, useSyncExternalStore, type MouseEvent } from "react";

// Picks a card colour from a photograph: click (or tap) anywhere on the photo to take the colour
// there (a small average, so a single stray pixel does not decide it), or take one of the photo's
// main colours from the row of suggestions; the browser's own eyedropper and a plain colour box are
// there too. The photo is loaded through Next's image optimiser (/_next/image), which serves it
// from this site, so the canvas may read its pixels whichever host the original lives on.

type Props = {
  src?: string;
  value?: string;
  onChange: (hex: string | undefined) => void;
  autoLabel?: string;
};

const subscribeNever = () => () => {};

const hex = (r: number, g: number, b: number) => `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

// A same-origin copy of the photo for the canvas.
function readableSrc(src: string) {
  if (src.startsWith("blob:") || src.startsWith("data:")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;
}

// The photo's main colours: a 48 × 48 sample bucketed to 4 bits a channel, most common first,
// skipping ones too close to a colour already taken.
function mainColours(data: Uint8ClampedArray, count = 6) {
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bucket.n += 1;
    bucket.r += data[i];
    bucket.g += data[i + 1];
    bucket.b += data[i + 2];
    buckets.set(key, bucket);
  }
  const picked: [number, number, number][] = [];
  for (const bucket of [...buckets.values()].sort((a, b) => b.n - a.n)) {
    const colour: [number, number, number] = [bucket.r / bucket.n, bucket.g / bucket.n, bucket.b / bucket.n];
    if (picked.every((other) => Math.hypot(other[0] - colour[0], other[1] - colour[1], other[2] - colour[2]) > 48)) picked.push(colour);
    if (picked.length === count) break;
  }
  return picked.map(([r, g, b]) => hex(r, g, b));
}

export function SwatchPicker({ src, value, onChange, autoLabel = "Automatic" }: Props) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hover, setHover] = useState<{ x: number; y: number; colour: string } | null>(null);
  const [failed, setFailed] = useState(false);
  // The browser's eyedropper (Chromium only), known after hydration.
  const dropper = useSyncExternalStore(subscribeNever, () => "EyeDropper" in window, () => false);

  function loaded(image: HTMLImageElement) {
    try {
      const sample = document.createElement("canvas");
      sample.width = image.naturalWidth;
      sample.height = image.naturalHeight;
      const context = sample.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("no canvas");
      context.drawImage(image, 0, 0);
      sample.dataset.src = image.src;
      canvas.current = sample;
      const small = document.createElement("canvas");
      small.width = 48;
      small.height = 48;
      const smallContext = small.getContext("2d");
      smallContext?.drawImage(image, 0, 0, 48, 48);
      setSuggestions(smallContext ? mainColours(smallContext.getImageData(0, 0, 48, 48).data) : []);
      setFailed(false);
    } catch {
      canvas.current = null;
      setFailed(true);
    }
  }

  // The average colour of a 7 × 7 patch under the pointer, in the photo's own pixels.
  function colourAt(event: MouseEvent<HTMLImageElement>) {
    const sample = canvas.current;
    if (!sample) return null;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.round(((event.clientX - box.left) / box.width) * sample.width);
    const y = Math.round(((event.clientY - box.top) / box.height) * sample.height);
    const size = 7;
    const data = sample.getContext("2d")!.getImageData(Math.max(0, x - 3), Math.max(0, y - 3), size, size).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n += 1;
    }
    return { x: event.clientX - box.left, y: event.clientY - box.top, colour: hex(r / n, g / n, b / n) };
  }

  async function pickWithEyeDropper() {
    try {
      const picker = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
      const { sRGBHex } = await picker.open();
      onChange(sRGBHex.toLowerCase());
    } catch {
      // Cancelled.
    }
  }

  return (
    <div className="space-y-3">
      {src ? (
        <div className="relative overflow-hidden border border-lp-border bg-lp-surface">
          {/* The img box hugs the photo (no letterboxing), so a click maps straight onto its pixels. */}
          {/* A plain img: the canvas needs this exact, same-origin file, not next/image's markup. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={readableSrc(src)}
            alt="Click the photo to take its colour"
            // A photo that finished loading before hydration never fires onLoad: read it on mount.
            ref={(node) => {
              if (node?.complete && node.naturalWidth > 0 && canvas.current?.dataset.src !== node.src) loaded(node);
            }}
            onLoad={(event) => loaded(event.currentTarget)}
            onError={() => setFailed(true)}
            onMouseMove={(event) => setHover(colourAt(event))}
            onMouseLeave={() => setHover(null)}
            onClick={(event) => {
              const picked = colourAt(event);
              if (picked) onChange(picked.colour);
            }}
            className="mx-auto block h-auto max-h-72 w-auto max-w-full cursor-crosshair"
          />
          {hover && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute size-9 -translate-x-1/2 -translate-y-[130%] rounded-full border-2 border-white shadow-[0_2px_8px_rgb(0_0_0/.45)]"
              style={{ left: hover.x, top: hover.y, backgroundColor: hover.colour }}
            />
          )}
        </div>
      ) : (
        <p className="text-[11px] text-lp-muted">Add a photo to pick its colours.</p>
      )}
      {failed && src && <p className="text-[11px] text-lp-muted">This photo can&apos;t be read for colours here; use the colour box instead.</p>}

      {suggestions.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[.12em] text-lp-muted uppercase">From the photo</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {suggestions.map((colour) => (
              <button
                key={colour}
                type="button"
                onClick={() => onChange(colour)}
                aria-label={`Use ${colour}`}
                aria-pressed={value === colour}
                title={colour}
                className="size-8 cursor-pointer border border-black/15 shadow-sm transition-transform hover:-translate-y-0.5 aria-pressed:outline-2 aria-pressed:outline-offset-2 aria-pressed:outline-lp-brand motion-reduce:transition-none"
                style={{ backgroundColor: colour }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-[11px]">
        <label className="flex items-center gap-2">
          <span className="text-[10px] tracking-[.12em] text-lp-muted uppercase">Chosen</span>
          <input type="color" value={value ?? "#d8d3ad"} onChange={(event) => onChange(event.target.value)} className="h-8 w-10 cursor-pointer border border-lp-border bg-transparent" />
          <span className="font-medium tabular-nums">{value ?? autoLabel}</span>
        </label>
        {dropper && (
          <button type="button" onClick={pickWithEyeDropper} className="cursor-pointer underline underline-offset-4">
            Eyedropper
          </button>
        )}
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="cursor-pointer text-lp-muted underline underline-offset-4">
            Back to automatic
          </button>
        )}
      </div>
    </div>
  );
}
