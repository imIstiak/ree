# Silk transition asset

> **Not used by the site any more.** The theme transition now draws the silk live with a
> WebGL shader (`src/components/silk-theme-transition.ts`), and the generated GIF was removed
> from `public/`. This source image and `scripts/generate-silk-gif.mjs` are kept for reference.

`silk-source.png` was created using the built-in image-generation tool. The final
animation is `public/transitions/silk-drift.gif`: 68 frames at 50 ms per frame,
3.4 seconds, transparent background. GIF uses binary transparency; the browser
applies the translucent cloth opacity above the existing page.

Regenerate the GIF with `node scripts/generate-silk-gif.mjs`. Then optimize it with
`npx --yes --package gifsicle gifsicle -O3 --lossy=60 public/transitions/silk-drift.gif -o /tmp/silk-drift.gif`
and copy the optimized file back to `public/transitions/silk-drift.gif`. The shipped
file is about 2 MB. The script uses the Sharp installation supplied with the
application. It gently displaces the
photographic folds with independent billows and ripples, preserving the source
texture. The website adds the larger top-right to bottom-left drift and reveal.

## Original image prompt

Create a photorealistic isolated cloth asset for a luxury fashion website transition.
A single large, weightless sheet of very fine ivory champagne silk organza drifting
in a gentle breeze. Broad organic asymmetric folds, delicate curled and scalloped
edges, subtle fine weave, physically believable tension and soft diffuse highlights,
matte translucent gauze rather than glossy metal. The fabric fills most of a
landscape 3:2 image, flowing diagonally from upper right toward lower left, with one
lifted corner at upper right and a wide trailing edge at lower left. Several deep
sweeping curved folds and little wrinkles, irregular and natural, not repetitive
sinusoidal waves. Soft studio lighting. Actual transparent alpha background around
the isolated fabric, no backdrop or ground or cast shadow. Keep all outer cloth
edges visible with a small transparent margin. No text, no person, no extra
objects, no border, no checkerboard painted in. Output high resolution PNG with
transparency. This will be deformed gently into an animated GIF overlay.
