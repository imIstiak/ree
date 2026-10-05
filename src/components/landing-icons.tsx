// The landing page's line-icon set, shared by landing-main.tsx and the hero header: a 24-unit
// grid, 1px stroke, mitre joins, one path per icon. Draw new icons here in the same style.
// The social marks are the exception: `BrandIcon` below holds the real logos as filled glyphs.

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

// The social networks' own marks (lucide-react has no brand icons): filled glyphs on the same
// 24-unit grid, one path each. Even-odd fill cuts the counters out, so subpath direction is free.
export const brandPaths = {
  instagram:
    "M7.5 1h9A6.5 6.5 0 0 1 23 7.5v9a6.5 6.5 0 0 1-6.5 6.5h-9A6.5 6.5 0 0 1 1 16.5v-9A6.5 6.5 0 0 1 7.5 1ZM7.5 3.1a4.4 4.4 0 0 0-4.4 4.4v9a4.4 4.4 0 0 0 4.4 4.4h9a4.4 4.4 0 0 0 4.4-4.4v-9a4.4 4.4 0 0 0-4.4-4.4ZM12 6.3a5.7 5.7 0 1 0 0 11.4 5.7 5.7 0 0 0 0-11.4ZM12 8.3a3.7 3.7 0 1 1 0 7.4 3.7 3.7 0 0 1 0-7.4ZM17.9 4.75a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7Z",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
};

export type BrandName = keyof typeof brandPaths;

export function BrandIcon({ name, className = "size-4" }: { name: BrandName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" className={className} aria-hidden="true">
      <path d={brandPaths[name]} />
    </svg>
  );
}
