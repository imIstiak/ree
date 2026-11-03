import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./moss-wordmark.module.css";

// One continuous photograph stays at full brightness inside the wordmark.
// The logo paths (public/ree-logo.svg, #ree-wordmark) cut the letters out of the dark overlay.
const VIEW = { x: -6, y: -18, w: 212, h: 78 }; // room above for the acute
const WORDMARK = [
  "M0 0h25c14 0 20 5 20 13 0 7-6 11-15 12 10 1 13 6 13 15v8c0 3 2 4 6 2l1 1c-3 2-5 2-8 2-8 0-11-4-11-12v-7c0-6-3-8-10-8h-3v25h7v1H0v-1h7V1H0V0Zm18 1v24h5c8 0 10-4 10-12S30 1 23 1h-5Z",
  "M82 0h40v15h-1C118 5 114 1 105 1h-5v24h2c7 0 10-3 11-10h1v21h-1c-1-7-4-10-11-10h-2v25h5c10 0 15-5 18-17h1v18H82v-1h7V1h-7V0Z",
  "M158 0h40v15h-1c-3-10-7-14-16-14h-5v24h2c7 0 10-3 11-10h1v21h-1c-1-7-4-10-11-10h-2v25h5c10 0 15-5 18-17h1v18h-42v-1h7V1h-7V0Z",
  "M172.6-1.85 180.9-13A2.2 2.2 0 0 1 184.1-10L173.4-1.15A.55.55 0 0 1 172.6-1.85Z", // the acute (Reé)
];

export function MossWordmark({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.panorama}>
      <Image src="/landing/footer-forest-wide.webp" alt="" fill sizes="100vw" className={styles.forest} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        className={styles.stage}
        role="img"
        aria-label="Reé"
      >
        <defs>
          <mask id="moss-cut" maskUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="#fff" />
            {WORDMARK.map((d) => (
              <path key={d} d={d} fill="#000" />
            ))}
          </mask>
        </defs>

        {/* Darken only the surroundings; the photograph inside Reé is untouched. */}
        <rect
          x={VIEW.x}
          y={VIEW.y}
          width={VIEW.w}
          height={VIEW.h}
          fill="#050d08"
          fillOpacity={0.68}
          mask="url(#moss-cut)"
          pointerEvents="none"
        />
      </svg>
      {children}
    </div>
  );
}
