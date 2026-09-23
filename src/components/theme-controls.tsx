"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { preloadSilkTransition, startSilkThemeTransition } from "./silk-theme-transition";

// The theme is scoped to a page wrapper rather than <html>, so each experience opts in.
export const LANDING_ROOT_ID = "ree-landing";
export const COMING_SOON_ROOT_ID = "ree-coming-soon";
export const PRODUCT_ROOT_ID = "ree-product";
const STORAGE_KEY = "ree-theme";
const ATTRIBUTE = "data-lp-theme";

type Theme = "dark" | "light";

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

// Runs while the HTML is parsed, before first paint, so a saved theme never flashes.
// It renders as text/plain on the client, so React neither warns about nor re-runs it.
// See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
export function ThemeScript({ rootId }: { rootId: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var r=document.getElementById("${rootId}");if(r&&(t==="light"||t==="dark"))r.setAttribute("${ATTRIBUTE}",t)}catch(e){}})()`,
      }}
    />
  );
}

// Icons cross-fade instead of toggling `display`: globals.css sets an unlayered
// `svg { display: block }` that would beat Tailwind's `hidden`, and fading animates better.
const icon =
  "absolute inset-0 size-full transition-[opacity,transform,color] duration-500 ease-out motion-reduce:transition-none";

// Floating controls pinned to the middle of the right edge.
export function ThemeControls({ rootId, inline = false }: { rootId: string; inline?: boolean }) {
  const stopTransition = useRef<(() => void) | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Covers client-side navigations, where the inline script does not run.
  useLayoutEffect(() => {
    const theme = readStoredTheme();
    if (theme) document.getElementById(rootId)?.setAttribute(ATTRIBUTE, theme);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      preloadSilkTransition();
    }
    return () => {
      stopTransition.current?.();
      stopTransition.current = null;
    };
  }, [rootId]);

  function toggleTheme() {
    if (stopTransition.current) return;
    const root = document.getElementById(rootId);
    if (!root) return;
    const next: Theme = root.getAttribute(ATTRIBUTE) === "light" ? "dark" : "light";
    const applyTheme = () => {
      root.setAttribute(ATTRIBUTE, next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable; the switch still works for this visit.
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme();
      return;
    }

    setIsTransitioning(true);
    stopTransition.current = startSilkThemeTransition(next, applyTheme, () => {
      stopTransition.current = null;
      setIsTransitioning(false);
    });
  }

  return (
    <div className={inline ? "relative" : "lp-dock fixed top-1/2 right-3 z-[110] -translate-y-1/2 sm:right-5"}>
      <div className="flex flex-col items-center gap-0.5 rounded-full border border-white/10 bg-black/70 p-1 shadow-[0_12px_28px_rgb(0_0_0/.4)] backdrop-blur-md group-data-[lp-theme=light]/theme:border-black/10 group-data-[lp-theme=light]/theme:bg-white/75 group-data-[lp-theme=light]/theme:shadow-[0_12px_28px_rgb(60_40_28/.2)]">
        <button
          type="button"
          onClick={toggleTheme}
          aria-disabled={isTransitioning}
          aria-label="Switch between light and dark theme"
          title="Switch theme"
          className="group/btn grid size-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/10 text-lp-accent transition-[transform,background-color,box-shadow] duration-300 ease-out hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_14px_rgb(245_237_158/.35)] active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 group-data-[lp-theme=light]/theme:border-black/10 group-data-[lp-theme=light]/theme:bg-black/5 group-data-[lp-theme=light]/theme:text-[#2c1a0e] group-data-[lp-theme=light]/theme:hover:bg-black/10"
        >
          <span className="relative block size-4">
            {/* Sun: shown in dark mode, meaning "switch to light". */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              className={`${icon} opacity-100 group-data-[lp-theme=light]/theme:rotate-90 group-data-[lp-theme=light]/theme:scale-50 group-data-[lp-theme=light]/theme:opacity-0`}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M5.2 18.8l1.6-1.6M17.2 6.8l1.6-1.6" />
            </svg>
            {/* Moon: shown in light mode, meaning "switch back to dark". */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${icon} -rotate-90 scale-50 opacity-0 group-data-[lp-theme=light]/theme:rotate-0 group-data-[lp-theme=light]/theme:scale-100 group-data-[lp-theme=light]/theme:opacity-100`}
              aria-hidden="true"
            >
              <path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" />
            </svg>
          </span>
        </button>

        {/* TODO: wire up locale switching; for now this only shows the current language. */}
        {!inline && <button
          type="button"
          aria-label="Switch language"
          title="Switch language"
          className="grid size-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/10 text-[9px] font-medium tracking-[.08em] text-white/90 transition-[transform,background-color,box-shadow,color] duration-300 ease-out hover:scale-105 hover:bg-white/20 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 group-data-[lp-theme=light]/theme:border-black/10 group-data-[lp-theme=light]/theme:bg-black/5 group-data-[lp-theme=light]/theme:text-black/80 group-data-[lp-theme=light]/theme:hover:bg-black/10"
        >
          EN
        </button>}
      </div>
    </div>
  );
}
