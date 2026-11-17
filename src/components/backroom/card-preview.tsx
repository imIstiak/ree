import { inkOn } from "../shop-ui";

// A little card in the chosen colour, sewn in the ink the shop would pick for it, so the admin sees
// how the frame and its label will read. Without a colour it shows the automatic cloth's look.
export function CardPreview({ colour, label }: { colour?: string; label: string }) {
  const ink = colour ? inkOn(colour) : undefined;
  return (
    <span
      aria-hidden="true"
      className="lp-patch block w-28 flex-none rotate-2 p-1.5 shadow-md shadow-black/20 [--lp-stitch-inset:3px]"
      style={colour ? { backgroundColor: colour, color: ink, outlineColor: `color-mix(in oklab, ${ink} 60%, transparent)` } : { backgroundColor: "var(--color-lp-card)" }}
    >
      <span className="block aspect-[4/3] bg-black/15" />
      <span className="block truncate px-0.5 pt-1.5 text-[9px] leading-tight uppercase">{label}</span>
    </span>
  );
}
