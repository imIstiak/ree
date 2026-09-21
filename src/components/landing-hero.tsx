import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import campaignStage from "../../public/landing/campaign-stage.webp";
import campaignLounge from "../../public/landing/campaign-lounge-wide.webp";
import campaignStairs from "../../public/landing/campaign-stairs-wide.webp";
import styles from "./landing-hero.module.css";

const menuLinks = [
  { label: "Categories", href: "#categories" },
  { label: "Style", href: "#style" },
  { label: "Collection", href: "#collection" },
  { label: "About", href: "#about" },
  { label: "Journal", href: "#journal" },
];

// ── Slideshow timing, in milliseconds ────────────────────────────────────────────
// Edit these to retime the hero; nothing else needs to change. Each beat opens with the
// cards sliding; the background follows `backdropDelay` later, so the two changes run
// almost together with the slide leading, and by default they finish at the same moment.
// Then the card that left fades back in, and everything rests until the next beat. If
// the steps do not fit inside `beat`, they are shortened in proportion so the loop closes.
const timing = {
  beat: 4250, // how often the slideshow advances
  move: 900, // the right card slides into the middle cut-out, the middle card to the left
  backdropDelay: 150, // how long after the cards start the full-screen background begins to change
  backdrop: 750, // how long the background change takes (delay + this = move, so they land together)
  fade: 500, // afterwards, the card that left fades back in on the right
};

// The slides, in the order they take the middle frame; the first is there on load, the
// second starts on the right and the last on the left. Every slide is one full-screen
// photograph: it is the hero's background while its card holds the frame, and the card
// itself only ever shows the cut-out of that photograph that lies under the frame.
// Add a slide by adding an entry (a 1840 × 1090 image, subject's head under the frame).
const slides = [
  {
    src: campaignStage,
    alt: "A model in a tailored herringbone suit and leather gloves, seated in a burgundy lounge chair under a warm spotlight.",
    href: "#categories",
    label: "Shop the curated collections",
  },
  {
    src: campaignLounge,
    alt: "A model in a textured trench coat and burgundy boots on a green velvet bench.",
    href: "#style",
    label: "Discover the new season edit",
  },
  {
    src: campaignStairs,
    alt: "A model in a beige suit walking down sunlit terracotta stairs.",
    href: "#collection",
    label: "Explore tailored essentials",
  },
];

const SCENE_SIZES = "(max-width: 767px) 170vh, 100vw";
const MOVE_EASE = "cubic-bezier(.7, 0, .2, 1)";

// Where a slide sits when beat `beat` begins: 0 in the middle frame, 1 on the right
// (next up), count - 1 on the left, anything else waiting out of sight.
const roleAt = (slide: number, beat: number, count: number) => (((slide - beat) % count) + count) % count;

// Writes the keyframes for every card and backdrop from `timing`, so the loop is still
// plain CSS with no client JavaScript. The slot transforms are the `--slot-*` variables
// in the CSS module. Only `transform` and `opacity` animate, which keeps it on the compositor.
function slideshowCss(count: number) {
  const busy = Math.max(timing.move, timing.backdropDelay + timing.backdrop) + timing.fade;
  const fit = Math.min(1, timing.beat / busy);
  const [move, backdropDelay, backdrop, fade] = [timing.move, timing.backdropDelay, timing.backdrop, timing.fade].map((ms) => ms * fit);
  const loop = timing.beat * count;
  const at = (ms: number) => `${+((ms / loop) * 100).toFixed(3)}%`;
  const card = (ms: number, slot: string, opacity: number, easing?: string) =>
    `${at(ms)}{transform:var(--slot-${slot});opacity:${opacity}${easing ? `;animation-timing-function:${easing}` : ""}}`;
  const scene = (ms: number, opacity: number, scale: number, easing: string) =>
    `${at(ms)}{opacity:${opacity};transform:scale(${scale});animation-timing-function:${easing}}`;
  const rules: string[] = [];

  for (let slide = 0; slide < count; slide++) {
    const cards: string[] = [];
    const scenes: string[] = [];
    for (let beat = 0; beat < count; beat++) {
      const start = beat * timing.beat; // the cards set off
      const moved = start + move;
      const changing = start + backdropDelay; // the background follows a moment later
      const changed = changing + backdrop;
      const settled = Math.max(moved, changed);
      const role = roleAt(slide, beat, count);

      if (role === 0) {
        cards.push(card(start, "middle", 1, MOVE_EASE), card(moved, "left", 1));
      } else if (role === 1) {
        cards.push(card(start, "right", 1, MOVE_EASE), card(moved, "middle", 1));
      } else if (role === count - 1) {
        // Leaves on the left; `step-end` then parks it on the right while it is invisible.
        cards.push(card(start, "left", 1, "ease-in"), card(start + move / 2, "exit", 0, "step-end"));
      } else {
        cards.push(card(start, "right", 0));
      }
      // Two beats before its turn in the middle, a slide fades in on the right.
      if (role === 2) cards.push(card(settled, "right", 0, "ease-out"), card(settled + fade, "right", 1));

      // Backdrops cross over while the cards travel. The later one in the DOM paints on
      // top, so either the incoming backdrop fades in over the old one, or the old one
      // fades away to reveal it - never both, which would let the bare hero show through.
      const incomingOnTop = (beat + 1) % count > beat;
      if (role === 1) {
        scenes.push(
          scene(start, 0, 1.06, "step-end"),
          scene(changing, incomingOnTop ? 0 : 1, 1.06, "ease-out"),
          scene(changed, 1, 1, "step-end"),
        );
      } else if (role === 0) {
        scenes.push(
          scene(start, 1, 1, "step-end"),
          scene(changing, 1, 1, incomingOnTop ? "step-end" : "ease-in-out"),
          scene(changed, 0, 1, "step-end"),
        );
      } else {
        scenes.push(scene(start, 0, 1, "step-end"));
      }
    }
    // Close the loop on the opening state.
    const opening = roleAt(slide, 0, count);
    cards.push(card(loop, opening === 0 ? "middle" : opening === count - 1 ? "left" : "right", opening === 0 || opening === 1 || opening === count - 1 ? 1 : 0));
    scenes.push(scene(loop, opening === 0 ? 1 : 0, 1, "step-end"));
    rules.push(`@keyframes ree-hero-card-${slide}{${cards.join("")}}`, `@keyframes ree-hero-scene-${slide}{${scenes.join("")}}`);
  }
  return rules.join("");
}

function CornerArrow({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 5 14 14M7 19h12V7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LandingHero({ themeControls }: { themeControls?: ReactNode }) {
  return (
    <header
      id="top"
      className={styles.hero}
      aria-labelledby="hero-title"
      style={{ "--hero-beat": `${timing.beat}ms`, "--hero-loop": `${timing.beat * slides.length}ms` } as CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: slideshowCss(slides.length) }} />
      {slides.map((slide, index) => (
        <div
          key={slide.src.src}
          className={`${styles.backdrop} ${index === 0 ? "" : styles.backdropWaiting}`}
          style={{ animationName: `ree-hero-scene-${index}` }}
        >
          <div className={styles.scene}>
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes={SCENE_SIZES}
              preload={index === 0}
              loading={index === 0 ? undefined : "eager"}
              className={styles.sceneImage}
            />
          </div>
        </div>
      ))}
      <div className={styles.shade} aria-hidden="true" />

      <svg className={styles.wordmark} viewBox="0 0 1840 260" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="hero-wordmark-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".06 .19" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <text x="-50" y="243" textLength="1940" lengthAdjust="spacingAndGlyphs">REÉ</text>
        <text x="-50" y="243" textLength="1940" lengthAdjust="spacingAndGlyphs" filter="url(#hero-wordmark-grain)" opacity=".2">REÉ</text>
      </svg>

      <nav className={styles.navigation} aria-label="Primary">
        <details className={styles.menu}>
          <summary className={styles.navLabel}>Menu</summary>
          <div className={styles.menuPanel}>
            <ul>
              {menuLinks.map((link) => (
                <li key={link.href}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
            {themeControls && (
              <div className={styles.menuSettings}>
                <span>Appearance</span>
                {themeControls}
              </div>
            )}
          </div>
        </details>

        <a className={styles.brand} href="#top" aria-label="REÉ home">REÉ</a>

        <details className={styles.cart}>
          <summary className={styles.navLabel}>Cart (0)</summary>
          <div className={styles.cartPanel}>
            <p>Your bag is empty.</p>
            <a href="#collection">Explore the collection <span aria-hidden="true">↗</span></a>
          </div>
        </details>
      </nav>

      {slides.map((slide, index) => {
        const role = roleAt(index, 0, slides.length);
        const slot = role === 0 ? styles.atMiddle : role === slides.length - 1 ? styles.atLeft : role === 1 ? styles.atRight : styles.waiting;
        return (
          <a
            key={slide.src.src}
            href={slide.href}
            className={`${styles.slide} ${slot}`}
            style={{ animationName: `ree-hero-card-${index}` }}
            aria-label={slide.label}
          >
            {/* A brightened copy of the slide's backdrop in a hero-sized box, so that in the
                middle frame it coincides with the background and the model steps out of it. */}
            <div className={styles.stageWindow}>
              <div className={styles.scene}>
                <Image src={slide.src} alt="" fill sizes={SCENE_SIZES} loading="eager" className={styles.sceneImage} />
              </div>
            </div>
          </a>
        );
      })}

      <div className={styles.focusFrame} aria-hidden="true">
        <CornerArrow className={styles.topLeft} />
        <CornerArrow className={styles.topRight} />
        <CornerArrow className={styles.bottomLeft} />
        <CornerArrow className={styles.bottomRight} />
      </div>

      <div className={styles.markers} aria-hidden="true">
        <span>{"// 01"}</span><i /><span>{"// 02"}</span><i /><span>{"// 03"}</span><i /><span>{"// 04"}</span>
      </div>

      <div className={styles.caption}>
        <nav className={styles.categories} aria-label="Shop collections">
          <a href="#collection">Men</a>
          <a href="#categories">Women</a>
          <a href="#category-hoodies">Kids</a>
        </nav>
        <h1 id="hero-title" className={styles.title}>
          <span>Curated collections for</span>
          <span>every occasion</span>
        </h1>
      </div>

      <div className={styles.rules} aria-hidden="true" />
    </header>
  );
}
