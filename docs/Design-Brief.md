# Future Human — homepage design and motion brief

Reference: https://www.future-human.de/

Inspected: 12 September 2026. Scope: the root landing page, including its entry screen, first landscape scene, common controls, and the five scenes contained within the same page. No linked booking, brochure, or other destination pages were audited.

This brief separates measured values from visual observations and proposed implementation choices. Desktop measurements were taken at a 1363 × 936 CSS-pixel viewport. Mobile values come from the published responsive CSS, not a live phone test. The first scene and its Program card were visually inspected; the five-scene inventory also uses the page DOM and entry-screen thumbnails.

**Media limitation:** the page uses streamed video, but a browser URL-policy restriction blocked inspection of the compiled script containing the stream configuration. The original `.m3u8` playlist, any MP4 master, and the creator/stock supplier could not be verified. Audio and thumbnail references below were read directly from the page. A `blob:` address is a temporary playback handle, not a reusable video URL.

## 1. What to call this design

An **immersive, cinematic, nature-led website with spatial navigation, editorial typography, and frosted-glass controls**.

The effect comes from a richly textured moving landscape occupying the entire viewport, with a sparse interface floating over it. The first scene shows an overhead meadow with flowers, moving grass, and luminous moving details. The imagery has a CGI-like quality; its production software and author are unverified.

The composition combines:

- Full-viewport environmental video.
- Calm, light-weight serif headlines and restrained sans-serif labels.
- Warm ivory text over dark, earthy imagery.
- Small floating hotspots arranged across the landscape.
- Translucent controls whose apparent color changes with the image behind them.
- A persistent bottom navigation strip, with restrained glow on its active marker.
- An entry sequence that introduces the five scenes before revealing the landscape.

The live page reported `Framer 835d061` as its generator. Its loaded module references include React and Motion. The inspected DOM contained five HTML video elements and no canvas element. The visible landscape therefore does not require a real-time 3D scene to reproduce.

## 2. Landing-page structure

### Entry screen

- Near-black full-screen stage (`#121212`).
- Small centered wordmark at the top; the published logo artwork is an SVG/mask, not merely letter-spaced body text.
- A centered strip of five landscape thumbnails. Desktop maximum strip width: 800px.
- Each thumbnail uses an approximately 1.5:1 aspect ratio, with no gaps between the desktop images.
- A thin ivory SVG path travels visually across the thumbnails. The DOM includes a left-to-right clipping rectangle for its reveal.
- A serif invitation, a short sans-serif supporting line, and a thin outlined pill-shaped Enter control.
- Generous empty space surrounds the central composition.
- The entry content exits upward; the desktop end-state CSS positions its content wrapper above the viewport at `top: -640px`.

### First landscape scene

- The stage fills the viewport; the measured document height equals the viewport height.
- The scene heading sits at the top center, with a short supporting sentence directly beneath it.
- Desktop content padding is `40px 40px 80px`.
- Heading-to-subtitle gap: 4px.
- The area under the heading is an invisible 8-column × 12-row grid, with 20px gaps.
- Hotspots occupy selected grid positions. Their placement appears freeform while retaining alignment.
- The scene is clipped at its edges. The video wrapper extends 40px beyond the horizontal edges and 20px beyond the vertical edges to accommodate pointer movement.

First-scene hotspot positions measured at 1363 × 936:

| Hotspot | Left / top, CSS px | Approximate viewport position |
| --- | --- | --- |
| Program | 40 / 234 | 3% from left, 25% from top |
| Change | 366 / 491 | 27% from left, 52% from top |
| SPÜRSINN | 1017 / 491 | 75% from left, 52% from top |
| Beginning | 692 / 619 | 51% from left, 66% from top |

These are measured positions at one viewport, not universal pixel coordinates. A rebuild should retain responsive positioning.

### Persistent controls

| Element | Desktop geometry / appearance |
| --- | --- |
| Sound control | Bottom left; outer container 40 × 40px; 40px from left and bottom; thin animated waveform |
| Scene navigation | Bottom center, 40px from bottom; wordmark artwork on both sides of five circular markers |
| Scene markers | 16 × 16px; 16px gaps; navigation wrapper has 4px padding |
| Active marker | Soft white and blue-gray glow |
| Navigation hint | Small italic text below the markers |
| Brochure control | Bottom right; 40 × 40px; right offset 100px; book-outline icon |
| Contact control | Bottom right; minimum 40 × 40px; right offset 40px; envelope-outline icon |

The brochure control points to a PDF. The contact control has closed and expanded variants in the published CSS, including a 300px-wide variant; its full interaction was not validated. No form was submitted.

### The five scenes within the homepage

These are root-page scenes, not five separate website pages.

| Scene | Main visual indicated by entry thumbnails / inspection | Hotspot labels |
| --- | --- | --- |
| 1. The Future Is Human | Overhead green meadow, flowers and luminous details | Program; Change; SPÜRSINN; Beginning |
| 2. The Multidimensional Human | Sand-like concentric forms / ripples | Expression; Five movements; Multidimensional |
| 3. The Collective Field | Dark landscape with a warm luminous center | HIGHER WE; FUTURE HUMAN; Love Intelligence |
| 4. The Path & The Sanctuary | A straight path through landscaped greenery | Living field; 8 Modules; The HILLA; Multidimensionality; Between the modules |
| 5. The Circle & The Encounter | Circular architectural form with a connecting walkway | Julia; The Path; Yvonne; Go Deeper; Jennifer |

Internal navigation links use `#room1` through `#room5`. The page has a 500%-width scene container and uses translated scene layers. Wheel input was observed to trigger horizontal transitions. During inspection, some marker clicks changed the hash before the rendered scene caught up, so the completed navigation behavior should be checked again in a local implementation.

## 3. Typography

Measured font families are **Spectral** and **Plus Jakarta Sans**. Inter also appears in the loaded font declarations, but it was not the primary font on the inspected hero and hotspot text.

| Role | Family / weight | Desktop | Tablet | Mobile | Other settings |
| --- | --- | --- | --- | --- | --- |
| Scene headline | Spectral, 300 | 36px | 32px | 28px | Letter spacing −0.04em; line height 100%, tablet 110% |
| Subtitle | Plus Jakarta Sans, 300 | 18px | 18px | 16px | Letter spacing −0.02em; line height 140% |
| Hotspot label | Plus Jakarta Sans, 300 | 12px | 12px | 10px | Letter spacing −0.02em; line height 140% |

The first scene headline is uppercase. Other scene headings mix regular and italic serif words. Avoid globally capitalizing all headings in a rebuild.

The labels look delicate because of their light weight, tight tracking, and small size. For a commercial mobile site, increase the hit area and consider larger labels; that would be an intentional usability adjustment.

## 4. Color, glass and shape

### Verified colors

| Purpose | Value |
| --- | --- |
| Primary warm ivory | `#FFF9EA` |
| Secondary text | `rgba(255,249,234,0.8)` / `#FFF9EACC` |
| Entry-stage dark | `#121212` |
| Additional near-white token | `#FFFEFC` |
| White token | `#FFFFFF` |
| Standard glass tint | `rgba(84,84,84,0.2)` |
| Lighter glass variant observed in DOM | `rgba(194,194,194,0.3)` |

The meadow produces the olive and moss colors seen in the interface. The standard hotspot is not painted a fixed olive green: it has a neutral translucent tint with **20px backdrop blur and 180% saturation**. This distinction is essential to recreating the effect over different footage.

### Hotspot geometry

- Pill radius: 100px.
- Content padding: `4px 12px 4px 4px`.
- Gap between icon and label: 8px.
- Icon control: 26 × 26px.
- Circular outline: 1px warm ivory.
- Center dot: 4 × 4px in the desktop variant.
- Typical closed hotspot height: 34px.
- Width follows its label, approximately 94–108px for the first-scene labels.
- Blur occupies a separate absolute layer, allowing text and icons to remain sharp.

### Expanded hotspot card

The inspected Program hotspot opens a card beneath its trigger while retaining the landscape behind it. It contains small metadata chips, a serif heading, short sans-serif paragraphs, and an outlined pill CTA.

At the measured desktop viewport, the Program card was visually about 480px wide, with an inner text area measured at 440px. This corresponds to approximately 20px horizontal padding. It has rounded corners and stronger visual separation than the closed hotspot. Exact card radius and transition timing were not recovered; do not treat suggested values for them as source measurements.

### Active navigation glow

The selected navigation marker had these outer shadows in its inline style:

```css
box-shadow:
  -2px -4px 16px 0 rgb(255 255 255),
  8px 8px 18px 0 rgb(136 164 191 / 40%);
```

Additional inset shadow entries were transparent in the captured state. Glow is concentrated on navigation rather than applied to every element.

## 5. Animation inventory

### Verified motion settings

| Effect | Trigger / movement | Verified settings |
| --- | --- | --- |
| Intro logo reveal | Opacity about 0 → 1; translateY 40px → 0 | 0.6s duration; 0.2s delay; cubic-bezier(0.52,0,0.48,1) |
| Five intro thumbnails | Opacity about 0 → 1; translateY 200px → 0 | Each 1s; delays 0.4, 0.5, 0.6, 0.7, 0.8s; same easing |
| Enter-control reveal | Scale 0 → 1; translateY 20px → 0; opacity about 0 → 1 | 0.8s duration; 5s delay; same easing |
| Bottom navigation entrance | TranslateY 40px → 0 | Spring; 0.8s configured duration; zero bounce; no delay |
| Room transition | Horizontal translateX between offscreen and onscreen positions | 650ms; cubic-bezier(0.4,0,0.2,1) |
| Video playback | Continuous background movement | HTML video loop enabled; playsInline enabled; preload set to auto |

The entry timings above come from the page's inline Framer appearance configuration. They are not estimates. On mobile, the intro image configuration retains a 90-degree rotation and uses a 20px vertical entrance offset instead of the desktop 200px offset.

### Verified mechanism, exact timing unresolved

| Effect | What was observed / exposed |
| --- | --- |
| Character-level text reveal | Headings and supporting text are split into individual character spans with opacity, blur and transform properties. The settled state is opacity 1, blur 0, and no transform. Exact initial blur, stagger, and duration are unverified. |
| Pointer parallax | The active video's wrapper receives changing translateX and translateY values. Sample offsets included about −17px horizontally and −7px vertically. The precise motion limit and easing are unverified. |
| Entry path reveal | An SVG line with a `leftToRightClip` clipping rectangle. Its exact duration is unverified. |
| Entry-screen dismissal | The introduction moves above the viewport to reveal the scene. Exact exit duration is unverified. |
| Hotspot opening | An anchored card appears beneath the selected hotspot. Exact transition duration and easing are unverified. |
| Navigation hover | A small rounded tooltip appears above a scene marker. |
| Active-marker glow | A white / blue-gray shadow surrounds the selected marker. A pulsing cycle was not verified. |
| Sound icon | The waveform is an SVG path whose `d` value changes over time. A `data-gsap-audio-icon` attribute is present, suggesting GSAP-related implementation, but the relevant bundle was not inspectable. |

The cyan outline around the pointer in some inspection screenshots should not be copied as a verified site effect. The inspected page used an ordinary cursor and exposed no custom cursor element; browser inspection overlays can affect screenshots.

### Suggested values for a new build — not source values

- Character reveal: opacity 0 → 1, blur 6px → 0, y 12px → 0, 0.7–0.9s duration, 20–35ms character stagger.
- Pointer parallax: clamp to about ±20px horizontal and ±12px vertical; interpolate smoothly; disable on coarse pointers.
- Hotspot card: fade plus y 8px → 0 over 250–350ms.
- Tooltip: fade plus y 4px → 0 over 150–200ms.
- Intro dismissal: translate upward and fade over 600–800ms.

These are reconstruction starting points. Keep them clearly separate from the verified timing table.

## 6. Background video findings

The page loads **hls.js 1.4.12** and attaches `blob:https://www.future-human.de/...` sources to its five video elements. Together these indicate an HLS / MediaSource playback setup. A normal MP4 URL is not exposed in the inspected video tags.

The visual media and sound are separate: each video's containing element also has its own audio element. The active scene was observed playing while inactive video elements were paused. Do not copy the five auto-preloaded players blindly into a new site if bandwidth matters.

| Scene | Decoded video dimensions reported by browser | Duration |
| --- | --- | --- |
| 1: Meadow | 2950 × 3840 | 86.7 seconds |
| 2: Sand forms | 2950 × 3841 | 33.33 seconds |
| 3: Collective field | 2950 × 3840 | 53.3 seconds |
| 4: Path | 2950 × 3840 | 3.04 seconds |
| 5: Circular architecture | 2950 × 3840 | 66.67 seconds |

These are properties reported for the currently loaded streams, not verified original master specifications. They do not establish bitrate, file size, frame rate, author, or license.

The video style is:

```css
width: 100%;
height: 100%;
object-fit: cover;
display: block;
```

The second video's outer wrapper includes `transform: scaleY(-1)`. This is a scene-specific orientation adjustment.

The video elements had no poster attribute. Their separate introduction thumbnails are listed below. A rebuild should provide a poster or other still-image fallback as an intentional improvement.

### Original video source: unresolved

The actual stream playlist and original video supplier were not retrievable in this inspection because of the browser policy restriction on the compiled configuration script. The audio CDN domain alone does **not** prove that the videos use the same host.

To supply the missing evidence from your own browser:

1. Open the homepage and Chrome/Edge DevTools → Network.
2. Reload, enter the experience, and filter requests for `m3u8`.
3. Open the matching playlist request and copy its **Request URL**.
4. Share that URL, or a HAR exported from this public page, for further identification.

A playlist can identify the delivery source. It may still not identify the original artist or stock marketplace. Public access also does not establish permission to reuse the footage for a brand site; use owned or appropriately licensed footage.

## 7. Exact media references found on the homepage

These references were read from the page DOM. They identify the audio files and entry thumbnails, not the missing video playlists.

### Separate audio tracks

| Scene | Referenced audio |
| --- | --- |
| 1 | [room1.mp3](https://futurehuman-website.b-cdn.net/room1.mp3) |
| 2 | [room2.mp3](https://futurehuman-website.b-cdn.net/room2.mp3) |
| 3 | [room3.mp3](https://futurehuman-website.b-cdn.net/room3.mp3) |
| 4 | [room4.mp3](https://futurehuman-website.b-cdn.net/room4.mp3) |
| 5 | [room5.mp3](https://futurehuman-website.b-cdn.net/room5.mp3) |

### Entry-screen still images

| Scene | Referenced image |
| --- | --- |
| 1 | [Meadow thumbnail](https://framerusercontent.com/images/byN5JITGDpJS5uPjBYZNgrdYBc.webp?width=1262&height=800) |
| 2 | [Sand-forms thumbnail](https://framerusercontent.com/images/vDbSa7PEB8DwTVdVLCO5S03G0E.webp?width=1262&height=800) |
| 3 | [Collective-field thumbnail](https://framerusercontent.com/images/RS69Ed1spgNQZP5bDKSkypnMeQA.webp?width=1262&height=800) |
| 4 | [Path thumbnail](https://framerusercontent.com/images/nXXbEcLSHkFkWv8SoaEMsCWE2T0.webp?width=1262&height=800) |
| 5 | [Circular-architecture thumbnail](https://framerusercontent.com/images/bPlZYth7cs3PE7DXCGxqj6ZcC8.webp?width=1262&height=800) |

The thumbnail URLs expose 1262 × 800 source dimensions. Responsive 512px and 1024px image candidates also appear in their `srcset` attributes.

The separate brochure link is [FUTURE_HUMAN_BROCHURE.pdf](https://futurehuman-website.b-cdn.net/FUTURE_HUMAN_BROCHURE.pdf). Its contents were outside this audit's scope.

## 8. Responsive behavior

Published layout breakpoints:

- Desktop: 1200px and above.
- Tablet: 810px to 1199.98px.
- Mobile: below 810px.

Published mobile changes:

- Scene content padding changes to `40px 20px 140px`.
- Video container overscan changes to `inset: -400px -250px`; this causes substantial cropping and should be evaluated with your own footage.
- The hotspot elements are reordered in the grid.
- The sound control moves to 20px from the left and bottom.
- Brochure and contact controls move to 20px from the bottom; their right offsets become 80px and 20px.
- The centered scene navigation moves to 72px above the bottom, on its own row.
- The wordmark halves become 80px wide and navigation spacing tightens.
- The entry thumbnails change to a vertical column, with 20px gaps and a maximum width of 80px each; their entrance configuration includes a 90-degree rotation.
- The entry heading wrapper becomes 310px wide.
- Typography scales as shown in the font table.

These settings were inspected in CSS. Mobile rendering, touch gestures, and device-specific media playback remain untested.

## 9. How to adapt it for your brand

Preserve the design system's strongest features: one dominant environment, light typography, generous space, a small number of hotspots, and slow, deliberate motion.

For a fashion brand, an original scene could show a textile landscape, close-up woven fabric, craft materials, or a landscape tied to the collection. Example hotspot labels: **Collection, Craft, Story, Lookbook**. A persistent **Shop** control can keep purchasing easy to find while the scene supports discovery.

For an initial version, build one polished scene. Add further scenes only when each has distinct content and footage. The quality and composition of the background video will contribute more to the resemblance than adding more animation libraries.

Suggested component structure:

```text
LandingExperience
  IntroGate
  SceneStage
    BackgroundVideo
    SceneHeading
    HotspotLayer
      HotspotButton
      HotspotPopover
  SceneNavigation
  SoundToggle
  BrandActions
```

This component list is a proposed architecture, not an extraction of the site's source tree.

Use your existing frontend stack. React plus CSS can implement the layout, parallax, videos, and overlays. Motion is an optional convenient tool for the timed reveals. Add HLS support only if your own delivery format requires it; a well-encoded MP4/WebM loop is enough for a simpler first version. No real-time 3D renderer is required for this approach.

## 10. Reusable CSS foundation

This is a clean reconstruction of the measured design tokens. Component class names are original, and some responsive/accessibility adjustments are intentional recommendations.

```css
:root {
  --ivory: #fff9ea;
  --ivory-muted: rgb(255 249 234 / 80%);
  --stage-dark: #121212;
  --glass-tint: rgb(84 84 84 / 20%);
  --scene-ease: cubic-bezier(.4, 0, .2, 1);
  --intro-ease: cubic-bezier(.52, 0, .48, 1);
}

.scene-stage {
  position: relative;
  height: 100svh;
  overflow: hidden;
  color: var(--ivory);
  background: var(--stage-dark);
}

.scene-video-layer {
  position: absolute;
  inset: -20px -40px;
  pointer-events: none;
}

.scene-video-layer video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scene-content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding: 40px 40px 80px;
}

.scene-heading {
  margin: 0;
  text-align: center;
  font-family: "Spectral", serif;
  font-size: 36px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -.04em;
}

.scene-subtitle {
  margin: 4px 0 0;
  text-align: center;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.4;
  letter-spacing: -.02em;
  color: var(--ivory-muted);
}

.hotspot-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(8, minmax(20px, 1fr));
  grid-template-rows: repeat(12, minmax(0, 1fr));
  gap: 20px;
}

.hotspot {
  position: relative;
  display: inline-flex;
  align-items: center;
  align-self: start;
  justify-self: start;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border: 0;
  border-radius: 100px;
  background: transparent;
  color: var(--ivory-muted);
  font: 300 12px/1.4 "Plus Jakarta Sans", sans-serif;
  letter-spacing: -.02em;
  cursor: pointer;
}

.hotspot::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--glass-tint);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  pointer-events: none;
}

.hotspot > * { position: relative; }

.hotspot-icon {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--ivory);
  border-radius: 50%;
}

.hotspot-icon::after {
  content: "";
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ivory);
}

.scene-panel {
  transition: transform 650ms var(--scene-ease);
}

@media (min-width: 810px) and (max-width: 1199.98px) {
  .scene-heading { font-size: 32px; line-height: 1.1; }
}

@media (max-width: 809.98px) {
  .scene-content { padding: 40px 20px 140px; }
  .scene-heading { font-size: 28px; }
  .scene-subtitle { font-size: 16px; }
  /* Recommendation: retain readable text and enlarge the touch target. */
  .hotspot { min-height: 44px; font-size: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .scene-panel { transition: none; }
  /* Also disable scripted parallax/reveals and show a still-video state. */
}
```

## 11. Brief to give Codex

Build an original landing page for [BRAND NAME] inspired by the visual system documented above. Start with the first full-screen scene and its entry sequence. Use [BRAND LOGO], [BRAND HEADLINE], [BRAND SUBTITLE], and owned or licensed background footage supplied as [VIDEO URL] with [POSTER URL]. Keep the media source configurable; do not use a temporary blob URL or invent a replacement for the unverified reference video.

Create a full-viewport video environment with a centered Spectral 300 headline, Plus Jakarta Sans supporting text, warm-ivory colors, and four independently positioned glass hotspots. Use the measured 20px blur, 180% saturation, neutral translucent tint, pill geometry, and desktop spacing from this brief. Add anchored content popovers and persistent bottom controls. Replace the reference website's branding and copy with the new brand's material.

Implement the verified intro timings and 650ms horizontal scene transition where multiple scenes are enabled. Use subtle pointer parallax on desktop. Treat the suggested text and popover timings as adjustable reconstruction settings. Keep the interface usable before every video asset has loaded.

Use semantic buttons, meaningful labels, visible keyboard focus, Escape-to-close popovers, and at least 44px mobile hit areas. For a modal mobile overlay, manage focus correctly. Respect reduced-motion preferences and handle video autoplay failure with a poster and an explicit play/enter action. Play audio only after a user gesture, and make the sound state clear.

Pause inactive videos. Provide a usable still image while media loads or fails. Use a properly cropped mobile asset if the desktop crop loses the intended subject. Verify that hotspots and popovers remain inside the viewport at desktop, tablet, and mobile widths. Keep a clear primary brand action available throughout the experience.

Validate the entry sequence, hotspot opening/closing, sound toggle, scene switching, browser history behavior, keyboard operation, and media fallback. Report any remaining media placeholders clearly.

## 12. Remaining verification gaps

- Original HLS playlist URLs, MP4 masters, bitrate and frame rate.
- Footage author, production software, original supplier, and reuse license.
- Exact heading character stagger and blur settings.
- Exact pointer smoothing parameters and parallax limits.
- Exact popup animation timing and card corner radius.
- Live mobile rendering, touch navigation, and full contact-panel behavior.
- Completed navigation consistency across every scene; the controller showed delayed scene/hash synchronization during inspection.

All measured facts above come from the rendered homepage, its DOM, its stylesheets, and its inline appearance configuration. Suggested build settings are explicitly labeled.
