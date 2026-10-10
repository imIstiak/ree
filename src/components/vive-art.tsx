import type { CSSProperties } from "react";

// Drawn pieces of the featured story (landing-main.tsx): a swatch of the nakshi kantha quilt that
// sews itself in beside the photograph of the ঋ-Vive tee, and the dashed leaders that run from the
// tee's details to their labels. Server components: every stitch draws with the `lp-sew`
// scroll-driven animation in globals.css (`--lp-sew-from` / `--lp-sew-to` say where in the SVG's
// passage it runs), so the whip stitch comes first, then the motif, then the needle. Dashed
// stitches are a solid path drawn through a dashed mask of itself, so they grow stitch by stitch.
// Browsers without scroll-driven animations, and reduced motion, show everything finished.

const cream = "var(--color-lp-brand-base)";
const madder = "var(--color-lp-patch-madder)";
const indigo = "var(--color-lp-patch-indigo)";
const mustard = "var(--color-lp-patch-mustard)";
const emerald = "var(--color-lp-brand)";

type Range = { from: string; to: string };
const sew = ({ from, to }: Range) => ({ "--lp-sew-from": from, "--lp-sew-to": to }) as CSSProperties;

// A running stitch: `d` drawn solid through a dashed mask of itself. `bounds` is the SVG's view box,
// since a mask defaults to the path's own box (nothing at all for a straight line).
function Stitch({ id, d, stroke, width = 1.1, dash = "4 3.2", range, bounds }: { id: string; d: string; stroke: string; width?: number; dash?: string; range: Range; bounds: string }) {
  const [x, y, w, h] = bounds.split(" ");
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h}>
        <path d={d} fill="none" stroke="#fff" strokeWidth={width * 2.2} strokeDasharray={dash} strokeLinecap="round" />
      </mask>
      <path d={d} pathLength={1} fill="none" stroke={stroke} strokeWidth={width} mask={`url(#${id})`} className="lp-sew-path" style={sew(range)} />
    </>
  );
}

// A continuous thread of embroidery.
function Thread({ d, stroke, width = 1.2, range, transform }: { d: string; stroke: string; width?: number; range: Range; transform?: string }) {
  return <path d={d} pathLength={1} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" transform={transform} className="lp-sew-path" style={sew(range)} />;
}

const swatchBox = "98 144 170 140";
const patchCloth = "M214 245Q160 250 106 244Q101 198 106 152Q160 147 214 151Q219 198 214 245Z";
// The whip stitch starts at the bottom-right corner, where the needle waits.
const patchStitch = "M211 241Q160 246 109 240Q105 198 110 156Q160 151 210 155Q215 198 211 241Z";

// A swatch cut from the quilt: cream cloth quilted in rows of running stitch, whipped round the edge,
// with a lotus in the middle, fish and a sun at the corners and vines above and below. The needle
// is still in the cloth, its thread running back to the last stitch.
export function QuiltSwatch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={swatchBox} className={`lp-sew ${className}`} aria-hidden="true">
      <defs>
        <pattern id="vive-rows" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 3h7M6 9h7" stroke={madder} strokeWidth=".7" strokeOpacity=".3" strokeLinecap="round" />
        </pattern>
      </defs>
      <path d={patchCloth} fill={cream} />
      <path d={patchCloth} fill="url(#vive-rows)" />
      <path d={patchCloth} fill="none" stroke="#000" strokeOpacity=".18" strokeWidth=".8" />
      <Stitch id="vive-st-patch" d={patchStitch} stroke={madder} width={1.4} dash="3.2 3" range={{ from: "20%", to: "30%" }} bounds={swatchBox} />

      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <Thread key={angle} d="M160 198c-8-9-8-22 0-31 8 9 8 22 0 31Z" stroke={madder} transform={`rotate(${angle} 160 198)`} range={{ from: `${40 + i * 4}%`, to: `${33 + i * 0.6}%` }} />
      ))}
      {[22.5, 112.5, 202.5, 292.5].map((angle, i) => (
        <Thread key={angle} d="M160 198c-5-5-5-13 0-18 5 5 5 13 0 18Z" stroke={indigo} width={1} transform={`rotate(${angle} 160 198)`} range={{ from: `${74 + i * 4}%`, to: `${38 + i * 0.5}%` }} />
      ))}
      <circle cx="160" cy="198" r="4.5" fill={mustard} className="lp-sew-fade" style={sew({ from: "90%", to: "40%" })} />
      <Thread d="M113 166q8-7 17 0-9 7-17 0Zm17 0 6-4v8Zm-11 0h.01" stroke={indigo} width={1.1} range={{ from: "80%", to: "41%" }} />
      <Thread d="M207 231q-8-7-17 0 9 7 17 0Zm-17 0-6-4v8Zm11 0h.01" stroke={indigo} width={1.1} range={{ from: "80%", to: "41%" }} />
      <Thread d="M195 169a5 5 0 1 0 10 0 5 5 0 1 0-10 0ZM200 160v2M200 176v2M191 169h2M207 169h2M193.6 162.6l1.4 1.4M205 174l1.4 1.4M206.4 162.6 205 164M195 174l-1.4 1.4" stroke={mustard} width={1.1} range={{ from: "84%", to: "42%" }} />
      <Thread d="M118 237V219M118 232l-7-5M118 232l7-5M118 226l-7-5M118 226l7-5M118 219l-3-3M118 219l3-3" stroke={emerald} width={1.1} range={{ from: "84%", to: "42%" }} />
      <Thread d="M132 161q7-5 14 0t14 0 14 0 14 0" stroke={emerald} width={1} range={{ from: "88%", to: "43%" }} />
      <Thread d="M132 236q7 5 14 0t14 0 14 0 14 0" stroke={emerald} width={1} range={{ from: "88%", to: "43%" }} />

      <g className="lp-sew-fade" style={sew({ from: "94%", to: "44%" })}>
        <path d="M213 243 252 276" stroke="var(--color-lp-text)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M213 243 252 276" stroke="var(--color-lp-bg)" strokeWidth=".6" strokeLinecap="round" />
        <circle cx="247.5" cy="272.2" r="1.3" fill="var(--color-lp-bg)" />
      </g>
      <Thread d="M248 272c18-8 0-24-37-31" stroke={madder} width={1.2} range={{ from: "100%", to: "46%" }} />
    </svg>
  );
}

export type Leader = { id: string; d: string; dot: [number, number] };

// The callout leaders, laid over the photograph in its own pixel grid: a dot on the detail and a
// dashed line stitched out towards the label, drawn once the photograph is well into view.
export function Leaders({ box, leaders, className = "" }: { box: string; leaders: Leader[]; className?: string }) {
  return (
    <svg viewBox={box} className={`lp-sew ${className}`} stroke="currentColor" aria-hidden="true">
      {leaders.map((leader, i) => (
        <g key={leader.id}>
          <circle cx={leader.dot[0]} cy={leader.dot[1]} r="7" fill="currentColor" stroke="none" className="lp-sew-fade" style={sew({ from: `${70 + i * 8}%`, to: `${42 + i * 2}%` })} />
          <Stitch id={`vive-lead-${leader.id}`} d={leader.d} stroke="currentColor" width={2.4} dash="9 8" range={{ from: `${74 + i * 8}%`, to: `${44 + i * 2}%` }} bounds={box} />
        </g>
      ))}
    </svg>
  );
}
