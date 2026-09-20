# ঋ - Ree

Website for **ঋ - Ree**, an independent clothing label shaped in Bengal. The site currently ships two experiences:

- **Coming soon** (`/`) — an immersive intro with five full-screen scenes, glass hotspots and parallax.
- **Landing page** (`/landing`) — an editorial storefront-style page: hero, categories, collections, about, journal and footer.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```text
.
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, global fonts (Plus Jakarta Sans, Spectral), metadata
│   │   ├── page.tsx            # "/" — renders <ComingSoon /> (swap to <LandingMain /> to launch)
│   │   ├── landing/
│   │   │   └── page.tsx        # "/landing" — preview route for <LandingMain />
│   │   ├── globals.css         # Tailwind import, coming-soon styles, landing theme tokens (lp-*)
│   │   ├── icon.svg
│   │   └── favicon.ico
│   └── components/
│       ├── coming-soon.tsx     # Client component: intro gate, scenes, hotspots, parallax
│       ├── landing-main.tsx    # Server component: editorial landing page
│       ├── theme-controls.tsx  # Client island: floating theme + language buttons (both pages)
│       └── silk-theme-transition.ts # The silk sweep that plays when the theme changes (WebGL)
├── public/
│   ├── ree-mark.svg            # Brand mark / favicon
│   ├── coming-soon/            # Scene photos for the coming-soon page
│   └── landing/                # Photos for the landing page
├── docs/
│   ├── Design-Brief.md         # Motion and glass design brief behind the coming-soon page
│   ├── landing-page-ui.png     # Landing page mockup
│   ├── landing-design-spec.json# Landing page colors, type, layout ratios and grid placement
│   └── landing-image-credits.md# Photographer credits and sources for all photos
├── AGENTS.md / CLAUDE.md       # Context for AI coding agents
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── tsconfig.json
```

## How the pages are built

### Coming soon — `src/components/coming-soon.tsx`

- All scene content (titles, hotspot copy and positions, images) lives in the `scenes` array at the top of the file.
- Styling uses plain global classes in `src/app/globals.css`.
- Motion follows `docs/Design-Brief.md` and respects `prefers-reduced-motion`.
- Colors come from CSS variables (`--ivory`, `--stage-dark`, `--glass` and friends), so the light theme can override them. Use those variables rather than literal colors when editing.
- Shares the floating control dock described below.

### Landing page — `src/components/landing-main.tsx`

- Content such as photos, categories, collection items and journal posts is defined as constants at the top of the file.
- Styled with Tailwind utilities and the `lp-*` design tokens declared at the bottom of `globals.css`, following `docs/landing-design-spec.json`.
- Keeps client-side JavaScript to a minimum: the menu uses `<details>`, and sliders and tabs are in-page links.
- Shares the floating control dock described below.
- Typography: Alfa Slab One (display) and IBM Plex Mono (body), loaded with `next/font`.
- Sections animate as they scroll into view (headings and cards rise in, images wipe upward, the oversized wordmarks drift). These use CSS scroll-driven animations, so no JavaScript is involved; browsers without support show the finished layout, and the motion is disabled for visitors who prefer reduced motion.

### Theme and language controls

Both pages show a floating dock fixed to the middle of the right edge (`src/components/theme-controls.tsx`):

- **Theme switch** — toggles light and dark. Dark is the default; the visitor's choice is saved in the browser and shared by both pages, and applied before the page paints so there is no flash. Light colors live under `[data-lp-theme="light"]` in `globals.css`.
- **Silk transition** — changing the theme sweeps a sheet of waving silk from the top-right corner to the bottom-left, and the new theme appears underneath it: ivory silk when switching to light, dark satin when switching to dark. The cloth is drawn live by a small WebGL shader (`src/components/silk-theme-transition.ts`), so there is no image or video to download. Visitors who prefer reduced motion, or whose browser has no hardware WebGL, simply get the theme change.
- **Language button** — a placeholder that shows `EN`. It has no behaviour yet; locale support is still to be built.

### Switching the home page

`src/app/page.tsx` decides what `/` shows. Replace `<ComingSoon />` with `<LandingMain />` (and update the import) to make the landing page the home page.

## Images and credits

Photos in `public/landing/` and `public/coming-soon/` come from [Unsplash](https://unsplash.com) and are used under the [Unsplash License](https://unsplash.com/license). Photographers and source links are listed in [`docs/landing-image-credits.md`](docs/landing-image-credits.md); please update that file whenever an image is added or replaced.

## Deployment

The app is a standard Next.js project, and both routes prerender as static pages. Deploy it to any platform that supports Next.js (for example [Vercel](https://vercel.com)), or run `npm run build && npm run start` on your own server.
