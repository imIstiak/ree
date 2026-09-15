import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./landing-hero.module.css";

const menuLinks = [
  { label: "Categories", href: "#categories" },
  { label: "Style", href: "#style" },
  { label: "Collection", href: "#collection" },
  { label: "About", href: "#about" },
  { label: "Journal", href: "#journal" },
];

function CornerArrow({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 5 14 14M7 19h12V7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LandingHero({ themeControls }: { themeControls?: ReactNode }) {
  return (
    <header id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.scene}>
        <Image
          src="/landing/campaign-stage.webp"
          alt="A model in a tailored herringbone suit and leather gloves, seated in a burgundy lounge chair under a warm spotlight."
          fill
          sizes="(max-width: 767px) 170vh, 100vw"
          preload
          className={styles.sceneImage}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.exposure} aria-hidden="true">
        <div className={styles.scene}>
          <Image
            src="/landing/campaign-stage.webp"
            alt=""
            fill
            sizes="(max-width: 767px) 170vh, 100vw"
            loading="eager"
            className={styles.sceneImage}
          />
        </div>
      </div>

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

      <a href="#collection" className={`${styles.sideImage} ${styles.leftImage}`} aria-label="Explore tailored essentials">
        <Image src="/landing/campaign-stairs.webp" alt="A model in a beige suit walking down sunlit terracotta stairs." fill sizes="(max-width: 767px) 22vw, 11vw" loading="eager" />
      </a>

      <div className={styles.focusFrame} aria-hidden="true">
        <CornerArrow className={styles.topLeft} />
        <CornerArrow className={styles.topRight} />
        <CornerArrow className={styles.bottomLeft} />
        <CornerArrow className={styles.bottomRight} />
      </div>

      <a href="#style" className={`${styles.sideImage} ${styles.rightImage}`} aria-label="Discover the new season edit">
        <Image src="/landing/campaign-lounge.webp" alt="A model in a textured trench coat and burgundy boots on a green velvet bench." fill sizes="(max-width: 767px) 22vw, 11vw" loading="eager" />
      </a>

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
