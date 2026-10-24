import type { CSSProperties } from "react";

// The dashed leaders of the featured story (landing-main.tsx), run from the DHAKA tee's details to
// their labels. A server component: every stitch draws with the `lp-sew` scroll-driven animation in
// globals.css (`--lp-sew-from` / `--lp-sew-to` say where in the SVG's passage it runs). Dashed
// stitches are a solid path drawn through a dashed mask of itself, so they grow stitch by stitch.
// Browsers without scroll-driven animations, and reduced motion, show everything finished.

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
