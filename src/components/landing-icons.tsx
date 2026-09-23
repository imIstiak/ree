// The landing page's line-icon set, shared by landing-main.tsx and the hero header: a 24-unit
// grid, 1px stroke, mitre joins, one path per icon. Draw new icons here in the same style
// (lucide-react has no brand icons, so the socials are hand-drawn too).

export const iconPaths = {
  arrowRight: "M4 12h16M14 6l6 6-6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  arrowDownRight: "M7 7l10 10M17 8v9H8",
  arrowDownLeft: "M17 7 7 17M16 17H7V8",
  arrowUpLeft: "M17 17 7 7M7 16V7h9",
  chevronLeft: "M15 5l-7 7 7 7",
  chevronRight: "M9 5l7 7-7 7",
  plus: "M12 5v14M5 12h14",
  bag: "M5 8h14l-1 13H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2",
  comfort: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-4 13c3-1 5-4 5-8m-2 11c3-2 5-5 5-9",
  quality: "M3 18h18M4 18 3 7l5 4 4-6 4 6 5-4-1 11M8 14l2-2 2 2 2-2 2 2",
  delivery: "M3 12l6-6 6 6-6 6-6-6Zm6 0 6-6 6 6-6 6",
  timeless: "M12 3v8M7.5 5.5a8 8 0 1 0 9 0",
  instagram: "M4 4h16v16H4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM16.5 7.5h.01",
  facebook: "M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z",
  linkedin: "M4 9h4v11H4zM6 4v2M10 9h4v2c1-1.5 2-2 3.5-2 2.5 0 3.5 1.8 3.5 4.5V20h-4v-6c0-1.2-.5-2-1.5-2S14 12.8 14 14v6h-4z",
  x: "M4 4l16 16M20 4 4 20",
  menu: "M4 7h16M4 12h16M4 17h16",
  heart: "M12 20.5S3.5 15.5 3.5 9.3A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.5 2.3c0 6.2-8.5 11.2-8.5 11.2Z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  minus: "M5 12h14",
  arrowLeft: "M20 12H4m6-6-6 6 6 6",
  arrowDown: "M12 4v16m6-6-6 6-6-6",
  play: "M8 5v14l11-7-11-7Z",
};

export type IconName = keyof typeof iconPaths;

export function Icon({ name, className = "size-3.5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinejoin="miter" className={className} aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}
