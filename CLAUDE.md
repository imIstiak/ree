@AGENTS.md

# ঋ - Ree — project context

Marketing site for **ঋ - Ree**, an independent clothing label shaped in Bengal ("Not everything old belongs in the past"). There is no backend, CMS, cart, or auth; all content is hard-coded in the components.

## Commands

- `npm run dev` — dev server (the user usually runs it themselves on :3000; check `lsof -iTCP -sTCP:LISTEN` before starting another — Next refuses a second dev server for the same directory)
- `npm run build` — production build; the cleanest way to verify a change
- `npm run lint` / `npx tsc --noEmit`

No test suite exists.

## Stack

- Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript strict
- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config`; theme lives in CSS `@theme`)
- `lucide-react` 1.x — **has no brand icons** (Instagram, Facebook, etc.); draw those as inline SVG
- Fonts through `next/font/google` only

## Routes

| Route | File | Renders |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | `ComingSoon` (the user toggles between `ComingSoon` and `LandingMain` here by commenting lines — leave that choice alone unless asked) |
| `/landing` | `src/app/landing/page.tsx` | `LandingMain`, kept as a preview route |

## The two page experiences

### `src/components/coming-soon.tsx` — immersive intro (client component)
- Intro gate with thumbnail strip, then five full-viewport scenes with glass hotspots, popovers, pointer parallax and horizontal scene transitions.
- Scene data (copy, hotspot positions, images) is the `scenes` array at the top of the file.
- Styled with **plain global classes** in `src/app/globals.css` (`.intro-gate`, `.scene-media`, `.hotspot` …), not Tailwind utilities.
- Design reference: `docs/Design-Brief.md` (Future Human–inspired motion/glass system).
- Fonts: Plus Jakarta Sans + Spectral, loaded in `src/app/layout.tsx`.

### `src/components/landing-main.tsx` — editorial landing page (server component)
- Sections: hero → categories → "designed for every style" → collection grid → about → journal → footer.
- **Server component, minimal client JS by design**: menu is `<details>/<summary>`, rails and tabs are in-page anchor links. The only client island is the theme switch. Don't add hooks or `"use client"` to this file without being asked.
- Styled with **Tailwind utilities** using `lp-*` tokens (`bg-lp-accent`, `text-lp-muted`, `font-lp-display`…) and utilities `lp-noise`, `lp-texture-text`, `lp-divider`, all defined at the bottom of `globals.css`.
- Uses `@container` + `cqw` units so type and the "REE" wordmarks scale with page width; layout is full-bleed (no outer padding / max-width — the user asked for that).
- Fonts: Alfa Slab One + IBM Plex Mono, declared in the component and exposed through `@theme inline` (`--font-alfa-slab`, `--font-plex-mono`).
- Design references: `docs/landing-page-ui.png` (screenshot mockup) and `docs/landing-design-spec.json` (colors, typography, section ratios, grid placements).
- Content (photos, categories, collection items, journal posts) lives in constants at the top of the file; the `Photo` type carries `objectPosition` for crops.

### `src/components/theme-controls.tsx` — theme + language dock (client)
- Shared by both pages. `ThemeControls rootId={…}` renders a floating dock **fixed to the middle of the right edge** holding the theme button and a language button (`EN`) that is **a placeholder with no locale wiring yet** — see the TODO in the file.
- The theme is scoped to each page's root element (`#ree-landing`, `#ree-coming-soon`) via `data-lp-theme`, **not** `<html>`. Default is `dark`; the choice persists in `localStorage` under `ree-theme` and is shared by both pages.
- `ThemeScript rootId={…}` is an inline script rendered at the top of each root that applies the saved theme before first paint (pattern from `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`); both roots carry `suppressHydrationWarning` for that reason.
- Both roots are `group/theme`, so theme-specific tweaks use `group-data-[lp-theme=light]/theme:`; the dock icons swap that way, with no React state.

### Theming rules
- Landing: `[data-lp-theme="light"]` overrides the `--color-lp-*` tokens. Use tokens, not hex/black:
  - `text-lp-ink` for text on accent (yellow) fills — dark in both themes; `text-lp-bg` only on inverted `bg-lp-text` surfaces.
  - `bg-lp-card`, `bg-lp-deep`, `from-lp-deep-top` for cards and the footer band.
  - Overlays that fade into the page use `color-mix(in_oklab,var(--color-lp-bg)_N%,transparent)`.
- Coming soon: its palette is driven by `--ivory`, `--ivory-rgb`, `--ivory-muted`, `--ivory-bright`, `--stage-dark`, `--surface-rgb`, `--glass`, `--glass-hover-rgb`, `--gate-bg`, `--marker-glow`. Write new rules with those variables (e.g. `rgb(var(--ivory-rgb) / 40%)`) instead of literal colors, or light mode will break. Light mode also lightens the scene photo filter and `.scene-wash` so dark text stays readable over the imagery.

### Landing page motion
- Scroll effects are **CSS scroll-driven animations** (`animation-timeline: view()`) defined at the bottom of `globals.css`, so the page still needs no client JavaScript. They sit inside `@supports (animation-timeline: view())`; unsupported browsers (currently Firefox) just render the final state.
- Classes: `lp-enter` / `lp-enter-fade` (hero entrance on load, staggered with `--lp-delay`), `lp-reveal`, `lp-reveal-left`, `lp-reveal-right`, `lp-fade`, `lp-unveil` (image wipe), `lp-drift` / `lp-drift-x` (slow parallax for wordmarks and the style strip). Grids stagger with `--lp-stagger` (item index) rather than per-item delays, because scroll timelines ignore `animation-delay`.
- **Transform conflicts:** a keyframe animating `transform` overrides Tailwind positioning utilities like `-translate-x-1/2`, and because the animations are `both`-filled it never hands the property back. Use the opacity-only `lp-fade` / `lp-enter-fade` on elements centred that way, and keep `lp-unveil` on `clip-path` so the cards' `group-hover:scale-105` keeps working.
- Every class is switched off under `prefers-reduced-motion: reduce`.

## Gotchas

- `globals.css` sets `body { overflow: hidden }` for the coming-soon stage. `LandingMain` therefore scrolls inside its own `h-svh overflow-y-auto` wrapper — in-page anchors depend on it.
- Element resets in `globals.css` live inside `@layer base`. Keep them there: unlayered rules outrank every Tailwind utility, which previously made `a { color: inherit }` silently override `text-*` on link-styled buttons and `svg { display: block }` override `hidden`.
- CSS Modules reject bare attribute selectors (`[data-x]`); scope under a class.
- The Tailwind dev process caches class candidates. If a build error references a class/asset no file contains anymore (e.g. `./assets/wordmark-texture.webp`), restart the dev server and delete `.next/dev`; `next build` will confirm the source is clean.
- `next/image` in Next 16 only allows `quality` values listed in `images.qualities` (default `[75]`); `next.config.ts` is empty.
- Tailwind only sees complete class strings — keep conditional classes as full literals (see `collectionItems[].place`, `journalPosts[].offset`).
- `tsconfig` path alias `@/*` maps to the repo root, not `src/`; existing code uses relative imports.

## Images

- `public/landing/` (landing page) and `public/coming-soon/` (scenes) are **Unsplash License** photos. When adding or swapping one, record photographer + source URL in `docs/landing-image-credits.md`.
- Unsplash+ (paid) photos return 403 from `https://unsplash.com/photos/<id>/download?force=true&w=…` — a quick way to confirm a photo is free.
- `public/` holds only images the site actually references; unused files were removed. Before adding one, check it is used, and delete it again if the reference goes away.
- `public/landing/campaign-*.webp` are locally generated hero images, not Unsplash; their provenance is in `docs/landing-hero-assets.md`.
- `public/ree-mark.svg` is the brand mark (also the favicon via `layout.tsx` metadata).

## Conventions

- Match surrounding style: data arrays at the top of a component, small local helper components, descriptive `alt` text, `aria-hidden` on decorative layers.
- Respect `prefers-reduced-motion` for any new animation.
- Currency is shown as `৳`; the brand is written `ঋ - Ree` in copy and `ঋ-Ree` in wordmarks.
