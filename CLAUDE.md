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
- `motion` 13 (Framer Motion's current package; import from `motion/react`) — used by `story-tiles.tsx` and the product pages; the landing page itself stays a server component
- `lucide-react` 1.x — **has no brand icons** (Instagram, Facebook, etc.); draw those as inline SVG
- Fonts through `next/font/google` only

## Routes

| Route | File | Renders |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | `ComingSoon` (the user toggles between `ComingSoon` and `LandingMain` here by commenting lines — leave that choice alone unless asked) |
| `/landing` | `src/app/landing/page.tsx` | `LandingMain`, kept as a preview route |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx` | One of two product-page templates, picked by `product.kind` (see **Product pages**); every slug in `src/data/products.ts` is prerendered |

## The two page experiences

### `src/components/coming-soon.tsx` — immersive intro (client component)
- Intro gate with thumbnail strip, then five full-viewport scenes with glass hotspots, popovers, pointer parallax and horizontal scene transitions.
- Scene data (copy, hotspot positions, images) is the `scenes` array at the top of the file.
- Styled with **plain global classes** in `src/app/globals.css` (`.intro-gate`, `.scene-media`, `.hotspot` …), not Tailwind utilities.
- Design reference: `docs/Design-Brief.md` (Future Human–inspired motion/glass system).
- Fonts: Plus Jakarta Sans + Spectral, loaded in `src/app/layout.tsx`.

### `src/components/landing-main.tsx` — editorial landing page (server component)
- Sections: hero → categories → "designed for every style" → collection grid → about → journal → footer.
- The categories section (`#categories`, titled "Find your story") follows the user's hand-drawn sketch: five tiles alternating short / tall (T-shirt product, worn, drop-shoulder product, worn, footwear); the middle short tile hangs from the bottom of the row with its label above (`shape: "hung"` in `storyTiles`). Its intro copy is set as a patchwork of stitched cloth patches (`patchwork` + `Patchwork`), not a plain paragraph. The tiles themselves are rendered by `src/components/story-tiles.tsx` (client, Framer Motion): each image sits in a coloured cloth frame (`--color-lp-patch-*` tokens, `frame` class literals in `storyTiles`) with a running stitch, a resting `tilt`, a lift-and-straighten hover, and a staggered rise-in via `whileInView`; `MotionConfig reducedMotion="user"` covers reduced motion. They deliberately don't use the CSS `lp-reveal` / `lp-unveil` classes (transform conflict).
- **Everything card-like or clickable is a cloth patch** (the user asked for every card, button and link to be patchwork with a stitched border): the `lp-patch` utility in `globals.css` lays cloth grain over the element's own fill and sews an inset running stitch in its text colour (`--lp-stitch-inset` moves it; it is an `outline`, so the focus ring replaces it while focused). `smallPatch` / `cardPatch` at the top of the file add the shadow, the resting tilt's hover-straighten and, for cards, a lift. `Label`, `Button`, the `Rail` arrows, collection tabs, style-section cards, product bricks, journal posts and all footer links use them. Put the tilt on the patch itself (not on an `li` carrying `lp-reveal`) and give new cards / links the same treatment. The theme dock is shared with the other pages and stays glass.
- The journal posts are tilted cloth-framed patches (`cloth` / `tag` class literals in `journalPosts`) with the date sewn over the top-left corner.
- The collection section is a brick wall in running bond (`bricks` array: products, cloth half-bricks and a cloth call-to-action brick, in mobile DOM order with explicit `lg:` placement). Bricks are 5:4 with the photo inside a cloth frame (`cloth`) and the label and price overlaid; the featured edit is a two-by-two stone. See the `collection` entry in `docs/landing-design-spec.json` for the cell map.
- **Server component, minimal client JS by design**: menu is `<details>/<summary>`, rails and tabs are in-page anchor links. Client islands: the theme switch, `story-tiles.tsx` (the Find-your-story tiles, added at the user's request) and the shared header, `site-header.tsx`, inside the hero. Don't add hooks or `"use client"` to this file without being asked.
- Styled with **Tailwind utilities** using `lp-*` tokens (`bg-lp-accent`, `text-lp-muted`, `font-lp-display`…) and utilities `lp-noise`, `lp-texture-text`, `lp-newsprint` (section headings: a grain + dot-screen `mask-image` so the page colour speckles through the ink; a mask, not a fill, so it follows the theme), `lp-divider`, all defined at the bottom of `globals.css`.
- Uses `@container` + `cqw` units so type and the "REE" wordmarks scale with page width; layout is full-bleed (no outer padding / max-width — the user asked for that).
- Fonts: Alfa Slab One + IBM Plex Mono, declared once in `src/components/landing-fonts.ts` (shared with the product pages) and exposed through `@theme inline` (`--font-alfa-slab`, `--font-plex-mono`; `--font-lp-serif` maps the root layout's Spectral for pull quotes).
- Design references: `docs/landing-page-ui.png` (screenshot mockup) and `docs/landing-design-spec.json` (colors, typography, section ratios, grid placements).
- Content (photos, categories, collection items, journal posts) lives in constants at the top of the file; the `Photo` type carries `objectPosition` for crops.

### `src/components/landing-hero.tsx` + `landing-hero.module.css` — landing hero (server component)
- Written by the user against a 1840 × 1090 reference; styled with a **CSS module**, not Tailwind. Its colours are fixed (it does not follow the theme).
- The header is the shared `site-header.tsx` (see **Site header**); the hero only positions it with `.navigation`. The Men / Women / Kids links carry the same running stitch.
- The photographs are a **CSS-only slideshow** - no `"use client"` in this file. Every slide (the `slides` array, in the order they take the middle frame) is one full-screen photograph: a `.backdrop` layer shows it as the hero background, and the slide's card holds `.stageWindow`, a hero-sized box with a brightened copy of the same photograph. In the middle slot that copy lines up with the background, so the card reads as a bright cut-out the model steps out of; the thumbs are the same card scaled by `--thumb-scale`. Keep `.scene` / `.sceneImage` identical for both copies or the alignment breaks.
- Each beat: right card slides into the middle while middle goes left and left fades out; the next slide's backdrop starts changing `backdropDelay` later (the user asked for the slide to lead and the two to run almost together) and by default finishes with the move -> then the card that left fades back in on the right. **Timing is the `timing` object at the top of the TSX** (`beat`, `move`, `backdropDelay`, `backdrop`, `fade`, in ms). `slideshowCss()` writes the `ree-hero-card-N` / `ree-hero-scene-N` keyframes from it into an inline `<style>`; the module only supplies `--hero-beat` / `--hero-loop` plumbing, slot geometry and the opening layout (`.atLeft` / `.atMiddle` / `.atRight` / `.waiting`). Only `transform` and `opacity` animate.
- Backdrops never cross-fade both ways: the later one in the DOM paints on top, so the generator either fades the incoming one in over the old one or fades the old one out to reveal it.
- Slot geometry is the unitless `--frame-*` / `--thumb-*` variables on `.hero` (the mobile media query only overrides those); `.focusFrame` reads the same variables.
- The three campaign images are compressed from lossless `assets/hero/campaign-*-master.webp` landscape masters by `node scripts/build-hero-backdrops.mjs` (sharp). Keep the complete scene, headroom and footwear; do not stretch the original portrait edges. The component statically imports the runtime files for content-hashed image URLs. The inset uses a modest 1.1 brightness lift, and both copies fill their containers without a downward transform.
- The build drops a name-less `animation:` shorthand in CSS modules - `.slide` and `.backdrop` use longhands for that reason.
- Headless screenshots: seeking paused animations (`currentTime = ...`) can composite stale layers and show false blends. Capture in real time instead.

### `src/components/site-header.tsx` + `site-header.module.css` — the one header (client)
- **The same header everywhere** (the user asked for the landing header, menu included, on every page): the landing hero and both product templates render `SiteHeader`. `base` is `""` on the landing page (in-page anchors) and `"/landing"` elsewhere; `overMedia` keeps the logo light over a photograph or film; `className` positions the bar (the hero's `.navigation`, or `pageHeader` from `shop-ui.tsx` on product pages) and must make it a containing block. The coming-soon page keeps its own stage header.
- Menu and bag are small tilted yellow tiles (`--header-tile` / `--header-tile-ink`, the bag tile from the style section) with a running stitch, carrying icons from `landing-icons.tsx` (hamburger ↔ close via `.menu[open]`, bag with a `.navCount` badge). They straighten on hover / open. Colours are fixed in the module; only the logo follows the theme.
- The panels are **light patchwork** (the user asked for a light background): a canvas backing with a stitch, each link a lighter cloth patch (`--patch` / `--tilt` per `li`). Each comes out of its own side of the window, leaning as it travels: the menu from beyond the left edge (the user's correction; it is not a slide from the right), the bag from beyond the right (`panelIn` with `--panel-from` / `--panel-lean`, links staggered by `patchIn`), and they **leave the same way they arrive** (the user asked for that): `panelOut` / `patchOut` are the entrance played backwards with the same total time, so retime both together.
- `hover-details.tsx` sets `data-closing` when the tile is pressed or the mouse has been away for 0.6 s, waits for the exit animations to finish (`getAnimations`, so no duration is duplicated in JS) and only then closes the `<details>`. Opening is still the native summary toggle.
- The bag panel reads `shop-store.ts` (`useShop()`, localStorage `ree-shop`): lines with a remove button, subtotal, and the saved (wishlist) pieces underneath. There is no separate wishlist control or "go back" link in the header any more.

### `src/components/theme-controls.tsx` — theme + language dock (client)
- Shared by both pages. `ThemeControls rootId={…}` renders a floating dock **fixed to the middle of the right edge** holding the theme button and a language button (`EN`) that is **a placeholder with no locale wiring yet** — see the TODO in the file.
- The theme is scoped to each page's root element (`#ree-landing`, `#ree-coming-soon`) via `data-lp-theme`, **not** `<html>`. Default is `dark`; the choice persists in `localStorage` under `ree-theme` and is shared by both pages.
- `ThemeScript rootId={…}` is an inline script rendered at the top of each root that applies the saved theme before first paint (pattern from `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`); both roots carry `suppressHydrationWarning` for that reason.
- Both roots are `group/theme`, so theme-specific tweaks use `group-data-[lp-theme=light]/theme:`; the dock icons swap that way, with no React state.

### `src/components/silk-theme-transition.ts` — the theme-change sweep
- Toggling the theme sweeps a sheet of silk from the top-right corner to the bottom-left; the new theme is revealed under the cloth's opaque centre. The cloth wears the logo's colours (the user asked for this): silk in the logo's base, `#ffe7cc`, for → light and deep emerald satin (from the logo's `#00664f`) for → dark (`uTone`; `base` / `deep` / `spec` in the shader). The shader sits in a template literal, so its comments cannot contain backticks.
- The cloth is a **WebGL fragment shader, not an image**: a moving height field re-lit every frame, which is what makes it shiny and makes it wave. An earlier version stretched a 640px GIF across the screen and looked matte and choppy; don't go back to an image or video.
- One clock: the reveal is a WAAPI `clip-path` animation on `::view-transition-new(root)`, and each `requestAnimationFrame` reads that animation's eased progress (`effect.getComputedTiming().progress`) to place the cloth. Don't drive the seam with per-frame CSS custom properties on `<html>` — they are inherited, so every frame restyles the whole document.
- `.silk-veil` carries `view-transition-name: ree-silk` so it paints above the page snapshots; the rules are next to the dock styles in `globals.css`. All default view-transition animations are switched off there.
- `FRONT` / `BACK` / `OVERHANG` in the TS file size the cloth and its off-screen parking; `FRONT` and `BACK` are injected into the shader, and `OVERHANG` must cover the hem-wave amplitudes plus the shadow width if those change. The band `solid` in the shader must stay fully opaque around the seam (`a = 0`).
- One shared canvas/context for the page's lifetime (compiled at idle by `preloadSilkTransition`), capped at 1.6 MP. Fallbacks: no hardware WebGL or reduced motion → instant theme change; no View Transitions API → colours cross-fade while the cloth passes.
- To look at it without a browser window: Brave is installed, and `--headless=new --remote-debugging-port=…` plus CDP `Page.captureScreenshot` captures mid-transition frames (plain `--screenshot` hangs).

### Product pages — `src/app/products/[slug]` + `src/components/product-*.tsx`
- **Two templates, one route.** `src/data/products.ts` is the catalogue (no backend); `kind: "classic"` renders `product-classic.tsx` (details, price, size, add to cart, gallery, after `docs/product-details.webp`), `kind: "story"` renders `product-story.tsx` (header film, prologue and facts strip, six illustrated chapters with specifics and a maker's voice, a field-to-street journey rail, an epilogue with sizes and the bag, quotes; after the flow of `docs/flower-ui.webp`). **The story page shows no price anywhere** (the user asked for the story instead): `PurchasePanel showPrice={false}` and `RelatedProducts showPrice={false}`; the bag panel still shows prices. Both are **client components by design** (Framer Motion via `motion/react`, size/gallery state); the route file stays a server component with `generateStaticParams` and `dynamicParams = false`.
- **Shell:** `product-shell.tsx` is the page root: the scroll container (body scrolling is locked globally), the shop fonts, the theme scope (`PRODUCT_ROOT_ID`, shares the saved theme) and the dock. Its `ref` is what `useScroll({ container })` reads. The inner wrapper uses `overflow-x-clip`, not `overflow-hidden`, so sticky columns work.
- **Chrome:** the shared `site-header.tsx`, placed with `pageHeader` from `shop-ui.tsx`; `purchase-panel.tsx` (size pills, size chart, add to cart, wishlist) and `shop-ui.tsx` (hook-free bits: `Tag`, `Price`, `ProductCard`, `RelatedProducts`, `ShopFooter`, the `cloth` patch classes).
- **Logo colours:** `--color-lp-brand` (`#00664f`, the logo's emerald) and `--color-lp-brand-base` (`#ffe7cc`) are fixed tokens, the same in both themes. The story page's chapter cards are emerald with the drawing in the base colour, and the small photo beside them has a base-colour frame (the user asked for the logo's green instead of the coffee `bg-lp-card` there).
- **Illustrations:** `story-illustrations.tsx` holds the chapter drawings as path data on a 240-unit grid (icon-set style, 1.25 stroke); each path draws itself with `pathLength` on `whileInView`. Add a drawing there and name it in `IllustrationName` (in the data file).
- **The film:** `story.film` in the data file. `youtube` (a video id) wins when set: `FilmEmbed` in `product-story.tsx` plays it through YouTube's own embedded player (`youtube-nocookie.com`, muted, looping, no controls, oversized by a third so the player's title bar and logo are cropped) and fades it in once the player reports it is playing; the video's thumbnail shows until then and under reduced motion. The user picked the current video, a third party's commercial for another clothing brand, so it is **embedded, never downloaded or re-hosted**, and it is a placeholder for the brand's own film. Without `youtube` the page plays the self-hosted `src` (`public/products/life-is-short-film.mp4`, a Pexels clip; provenance in `docs/product-image-credits.md`) in a `<video>` that sets `muted` through a ref because React does not write the attribute. The user asked for real footage here, not a slideshow of stills.
- **Photos:** `public/products/` holds the brand's own campaign photographs (provenance in `docs/product-image-credits.md`), not Unsplash. The landing's collection bricks link to these pages; the wall's feature stone is the story tee.

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
- Tailwind only sees complete class strings — keep conditional classes as full literals (see `bricks[].place`, `journalPosts[].offset`).
- `tsconfig` path alias `@/*` maps to the repo root, not `src/`; existing code uses relative imports.

## Images

- `public/landing/` (landing page) and `public/coming-soon/` (scenes) are **Unsplash License** photos. When adding or swapping one, record photographer + source URL in `docs/landing-image-credits.md`.
- Unsplash+ (paid) photos return 403 from `https://unsplash.com/photos/<id>/download?force=true&w=…` — a quick way to confirm a photo is free.
- `public/` holds only images the site actually references; unused files were removed. Before adding one, check it is used, and delete it again if the reference goes away.
- `public/landing/campaign-*.webp` are locally generated hero images, not Unsplash; their provenance is in `docs/landing-hero-assets.md`. Edit the lossless landscape masters in `assets/hero/` and re-run `node scripts/build-hero-backdrops.mjs`. The original portraits are retained only as references.
- `public/ree-mark.svg` is the brand mark (also the favicon via `layout.tsx` metadata).
- `public/products/` holds the brand's own photographs and the generated story film; provenance in `docs/product-image-credits.md`.

## Conventions

- Match surrounding style: data arrays at the top of a component, small local helper components, descriptive `alt` text, `aria-hidden` on decorative layers.
- Line icons live in `src/components/landing-icons.tsx` (`iconPaths` + `Icon`: 24-unit grid, 1px stroke, mitre joins), shared by the landing page, the hero header and the product pages. Add new icons there in the same style. The social networks are the exception: the user asked for the real logos, so `brandPaths` + `BrandIcon` in the same file hold them as filled glyphs, and each footer patch wears a light tint of its network's colour (`cloth` in `socials`; fixed brand colours, not theme tokens).
- Respect `prefers-reduced-motion` for any new animation.
- Currency is shown as `৳`; the brand is written `ঋ - Ree` in copy and `ঋ-Ree` in wordmarks.
