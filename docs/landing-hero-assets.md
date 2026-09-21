# Landing hero

The `/landing` hero follows the user-supplied 1840 × 1090 REÉ reference. The typography, navigation, category links, numbered rules, arrows, and image framing are HTML/CSS/SVG. The three photographs are generated approximations of the reference, not the original campaign files.

## Assets

Created with the built-in image generation tool, then compressed to WebP for local delivery:

- `public/landing/campaign-stage.webp`, `campaign-stairs-wide.webp` and `campaign-lounge-wide.webp` — full-width photographs with balanced warm lighting, continuous room details and complete footwear within the image boundaries.
- `assets/hero/campaign-{stage,stairs,lounge}-master.webp` — approved lossless landscape masters. Rebuild the runtime files with `node scripts/build-hero-backdrops.mjs`, which compresses these masters without cropping, stretching, blurring or changing their exposure.
- `assets/hero/campaign-stairs.webp` and `assets/hero/campaign-lounge.webp` — original 580 px portrait references, retained for provenance and future edits. They are not served or used to rebuild the wide images.

The wide stairs and lounge rooms were extended with the built-in imagegen tool; the stage photograph was relit to match. A second framing pass adds headroom and floor margin. The exact edit prompts are in [campaign-image-edit-prompts.md](campaign-image-edit-prompts.md). Static image imports give each revision a content-hashed URL so a browser cannot retain the previous optimized image at the same path.

The original generated PNGs are retained in the tool's generated-images directory. All runtime assets live in `public/landing/`; no external image service or generated-image path is required.

## Generation prompts

### Stage

Use case: photorealistic-natural. Asset type: background photograph for a responsive fashion landing hero. Reference: the user's wide REÉ screenshot (and the hero at top of the narrow full-page design) is the precise composition reference. Ignore the unrelated outdoor folding-chair photo. Recreate ONLY THE UNDERLYING MAIN PHOTOGRAPH, WITHOUT ANY text, logos, inset photos, rectangular bright crop overlays, interface controls, border lines, or corner arrows. Landscape image 1840 by 1090 ratio, high resolution. Scene: dark oxblood burgundy studio room, textured dark red carpet at bottom 23%, nearly black deep brown red walls on left and right. One warm dramatic overhead spotlight spreads into a wide cone down onto the center model and illuminates red wall behind her, strongest in middle. Subject: young adult East Asian woman with slicked-back long straight black hair, narrow dark brown rectangular sunglasses, silver earrings, gray-brown herringbone double-breasted oversized tailored suit with strong angular shoulder pads, dark burgundy elbow-length leather gloves. She sits cross-legged facing camera on low sculptural burgundy upholstered swivel lounge chair with broad curved arms. Both hands folded over knee, head turned slightly toward viewer's left. Precisely match reference: her head top at x50%, y21%, head bottom y34%; shoulder span x43%-59%, shoulders at y37%, crossed arms y53%-64%, knees y68%, long trouser leg and pointed dark heel reach y98%. Chair spans x36% to65%, chair top y51%, base bottom y85%. Figure must be normal human proportions like reference, scaled to occupy 77% of canvas height. Warm sharp cinematic light on face and upper torso, soft dark shadows over legs and chair, long cast floor shadow to lower right. Large negative dark space on both sides. Analog fashion editorial photograph, realistic wool, leather and subtle film grain. Preserve the image composition and tonal palette very closely. No graphic design, no typography, no inset photographs, no other people. Output only the photograph.

### Stairs

Use case photorealistic-natural. Create a standalone vertical fashion photograph in ratio 193:254 to reproduce the LEFT SMALL photograph in the header of reference image 1. Match the same young adult East Asian female model and slicked-back black hair from reference image 2. Full body shot from above, woman walking down terracotta red stairs, looking slightly down, hands in pockets, wearing oversized olive-beige tailored blazer and flowing matching trousers with white high-neck silk blouse and brown leather belt. Dark green painted side wall to left, warm brown wood panels at top left and cream wall with handrail to right. Strong golden sunlight from upper right, cinematic deep warm shadows, analog editorial fashion campaign. Model centered full body fills image from y12% to bottom edge. No sunglasses, no text, no design or frame. Entire output is a single photograph, no collage, no border.

### Lounge

Use case photorealistic-natural. Create standalone vertical fashion photograph in ratio 193:254 to reproduce the RIGHT SMALL photograph in the header of reference image 1. Match same young adult East Asian female model with slicked-back long black hair from reference image 2. She is sitting facing camera on deep green velvet bench in retro lounge. Wearing beige textured wool double-breasted short trench coat with wide lapels and white turtleneck, bare knee and glossy cognac-burgundy knee-high tall leather boots, legs crossed. Her face at x50% y22%, knees y72%, shoulders y42%, hands on lap. Background: deep terracotta-burgundy vertical wooden wall panels, slim brass strips, small pale stone edge at left. Warm direct sunlight falls from upper left, strong shadows, analog editorial fashion photography. Framed top of head to cut off just below knee-high boots. No sunglasses, no words, no graphics, no borders, no collage.

The side-image prompts used `docs/landing-page-ui.png` and the generated stage image as references.

## Behavior

- Desktop proportions use the reference's 1840 × 1090 canvas; mobile receives a separate portrait arrangement with a minimum height of 640 px.
- Menu and empty-cart preview use native disclosures. Links navigate to the existing page sections.
- The three photographs form a slideshow, and every slide works the way the reference's stage slide does: one full-screen photograph is the hero's background, and the card in the middle frame is a brightened cut-out of that same photograph, lined up with it so the model appears to step out of the frame. The thumbnails are those cut-outs, scaled down.
- The scene fills its container without a downward translation or extra zoom. The inset and background use identical geometry, including on mobile. The inset adds only `brightness(1.1) saturate(1.02)` to preserve face and fabric highlights; the frame begins at 19% of the hero height to include the top of the head.
- Each beat opens with the cards: the right card slides into the middle cut-out while the middle card slides to the left and the left card fades out. The full-screen background starts changing a moment later (`backdropDelay`), so the slide leads and the two run almost together, landing at the same time. Afterwards the card that left fades back in on the right.
- Timing lives in the `timing` constants at the top of `src/components/landing-hero.tsx` (milliseconds): `beat` 4250, `move` 900, `backdropDelay` 150, `backdrop` 750, `fade` 500. Keep `backdropDelay + backdrop` equal to `move` if the card should land exactly as its background finishes appearing. The component writes the CSS keyframes from them, so the loop is still plain CSS with no client JavaScript. If the steps do not fit inside `beat` they shrink in proportion. The first change happens one beat after load.
- Slides are the `slides` array in the same file, in the order they take the middle frame. More than three work: extra slides wait out of sight until their turn on the right.
- Focusing a card with the keyboard pauses the loop. With reduced motion requested there is no loop; the opening layout stays on screen.
- The theme control is the floating dock on the right edge (shared with the coming-soon page). The photograph keeps its campaign colors in both themes.
- Hover motion is disabled when reduced motion is requested.
- The `/` coming-soon route remains the selected home experience.
