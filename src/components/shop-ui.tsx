import Image from "next/image";
import { BrandLogo } from "./brand-logo";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { formatPrice, type Product } from "../data/products";

// Small pieces shared by both product page templates. No hooks here, so server and client
// components can both import it.

export function Tag({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "text" | "outline" }) {
  const tones = {
    accent: "bg-lp-accent text-lp-ink",
    text: "bg-lp-text text-lp-bg",
    outline: "border border-lp-border text-lp-muted",
  };
  return <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] leading-tight whitespace-nowrap uppercase ${tones[tone]}`}>{children}</span>;
}

// A cloth patch: grain plus an inset running stitch. Pair with a colour and a stitch colour.
export const cloth =
  "outline-1 outline-dashed -outline-offset-4 before:pointer-events-none before:absolute before:inset-0 before:lp-noise before:opacity-20 before:mix-blend-overlay before:content-['']";

export const kicker = "text-[11px] tracking-[.14em] text-lp-muted uppercase";

// Where the shared site header sits on a product page: the landing hero's insets, in flow, tall
// enough to clear the centred logo.
export const pageHeader = "relative z-20 mx-[2.72%] mt-[1.57cqw] min-h-24 max-md:mx-5 max-md:mt-[18px]";

export function Price({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <p className={`flex items-baseline gap-3 ${className}`}>
      <span className="font-lp-display text-2xl">{formatPrice(product.price)}</span>
      {product.wasPrice && (
        <s className="text-sm text-lp-muted">
          <span className="sr-only">Was </span>
          {formatPrice(product.wasPrice)}
        </s>
      )}
    </p>
  );
}

// The shop's patchwork (shared with site-page.tsx, which re-exports it): every card, chip and button
// is a cloth patch with a running stitch, resting at a tilt that straightens on hover.
export const patchShadow = "shadow-md shadow-black/35 group-data-[lp-theme=light]/theme:shadow-black/12";
const patchMotion = "transition-[color,background-color,rotate,translate,box-shadow] duration-300 ease-out hover:rotate-0 motion-reduce:transition-none";
export const smallPatch = `lp-patch [--lp-stitch-inset:3px] ${patchShadow} ${patchMotion}`;
export const cardPatch = `lp-patch ${patchShadow} ${patchMotion} hover:-translate-y-1.5 hover:shadow-xl`;
export const hoverImage = "transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100";
// Card cloths and resting tilts, cycled through a grid. Full class literals, as Tailwind needs.
export const cloths = [
  "bg-lp-card text-lp-text",
  "bg-lp-patch-indigo text-lp-canvas",
  "bg-lp-patch-olive text-lp-canvas",
  "bg-lp-patch-terracotta text-lp-ink",
  "bg-lp-patch-madder text-lp-canvas",
  "bg-lp-patch-mustard text-lp-ink",
];
export const tilts = ["-rotate-1", "rotate-1", "rotate-[.6deg]", "-rotate-[.7deg]"];

// The darker or lighter of the page's two inks, whichever contrasts more with `hex`.
export function inkOn(hex: string) {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lum = 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
  // #1c0a06 has a luminance of about .005, #fffdf0 about .97.
  return (lum + 0.05) / 0.055 >= 1.02 / (lum + 0.05) ? "#1c0a06" : "#fffdf0";
}

// Every product card's frame is cut from the colour of the garment in its photo (the user asked for
// it on every product card, on every page): the photo's measured `swatch` (campaign-images.ts) as the
// cloth, with the ink that reads best on it, which the running stitch follows. Without a swatch the
// card keeps its palette cloth class.
export function garmentCloth(photo?: { swatch?: string }): CSSProperties | undefined {
  if (!photo?.swatch) return undefined;
  const ink = inkOn(photo.swatch);
  // The stitch: frames that sew with an outline colour class (the story tiles) take the ink too.
  return { backgroundColor: photo.swatch, color: ink, outlineColor: `color-mix(in oklab, ${ink} 60%, transparent)` };
}

// A product as a cloth patch: the photograph in the frame, name and price sewn underneath. The story
// piece shows "Story" instead of a price, as it does on the landing page's wall; without prices (the
// story page) the category is sewn on instead.
export function ShopCard({ product, index, showPrice = true }: { product: Product; index: number; showPrice?: boolean }) {
  const photo = product.images[0];
  const garment = garmentCloth(photo);
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`${cardPatch} group block p-2 [--lp-stitch-inset:4px] sm:p-2.5 ${garment ? "" : cloths[index % cloths.length]} ${tilts[index % tilts.length]}`}
      style={garment}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-lp-surface">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 23vw, 46vw" className={`object-cover ${hoverImage}`} style={{ objectPosition: photo.position }} />
      </div>
      <div className="flex items-start justify-between gap-2 px-1 pt-2.5 pb-1 text-[11px] leading-snug uppercase">
        <span>{product.name}</span>
        <span className="whitespace-nowrap opacity-75">{!showPrice ? product.category : product.kind === "story" ? "Story" : formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

export function RelatedProducts({ products, showPrice = true }: { products: Product[]; showPrice?: boolean }) {
  return (
    <section aria-labelledby="related-title" className="px-[3%] py-[6%]">
      <div className="flex items-end justify-between gap-4 border-b border-lp-border pb-4">
        <h2 id="related-title" className="lp-newsprint font-lp-display text-[clamp(1.3rem,2.2cqw,2rem)] uppercase">
          More from the collection
        </h2>
        <Link href="/shop" className="text-[11px] whitespace-nowrap uppercase hover:text-lp-accent">
          Browse all →
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-4">
        {/* Each frame is cut from the colour of the garment in its photo (the user asked for that). */}
        {products.map((product, index) => (
          <li key={product.slug}>
            <ShopCard product={product} index={index + 1} showPrice={showPrice} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const footerLinks = [
  { label: "Home", href: "/landing" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function ShopFooter() {
  return (
    <footer className="border-t border-lp-border px-[3%] py-8 text-[11px] tracking-[.1em] text-lp-muted uppercase">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/landing" aria-label="REE home"><BrandLogo className="w-12" decorative /></Link>
          <span>Not everything old belongs in the past</span>
        </div>
        <nav aria-label="Shop" className="flex flex-wrap gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-lp-text">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
