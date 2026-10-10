import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { formatPrice, type Product } from "../data/products";
import { Icon } from "./landing-icons";
import { ProductShell } from "./product-shell";
import { ShopFooter, kicker, pageHeader } from "./shop-ui";
import { SiteHeader } from "./site-header";

// The frame and the small pieces for the shop's own pages (shop, men / women / kids, collections,
// about, journal, contact, legal, cart, checkout): the product pages' shell, the shared header and
// the shop footer, with the landing page's patchwork for every card, chip and button (each one a
// cloth patch with a running stitch, resting at a tilt that straightens on hover). No hooks, so
// server pages can use it.

export const patchShadow = "shadow-md shadow-black/35 group-data-[lp-theme=light]/theme:shadow-black/12";
const patchMotion = "transition-[color,background-color,rotate,translate,box-shadow] duration-300 ease-out hover:rotate-0 motion-reduce:transition-none";
export const smallPatch = `lp-patch [--lp-stitch-inset:3px] ${patchShadow} ${patchMotion}`;
export const cardPatch = `lp-patch ${patchShadow} ${patchMotion} hover:-translate-y-1.5 hover:shadow-xl`;
export const hoverImage = "transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100";
export const bodyText = "text-[13px] leading-[1.75] text-lp-muted";
export const sectionTitle = "lp-newsprint font-lp-display text-[clamp(1.4rem,2.6cqw,2.4rem)] leading-[1.05] tracking-[-.02em] uppercase";

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

export function SitePage({ children }: { children: ReactNode }) {
  return (
    <ProductShell>
      <SiteHeader base="/landing" className={pageHeader} />
      <main className="pb-16 lg:pb-[5%]">{children}</main>
      <ShopFooter />
    </ProductShell>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="px-[3%] pt-8 pb-8 lg:pt-[3%] lg:pb-[2.5%]">
      <p className={kicker}>{eyebrow}</p>
      <h1 className="lp-newsprint mt-3 max-w-[16ch] font-lp-display text-[clamp(2.4rem,6.5cqw,6.5rem)] leading-[.95] tracking-[-.025em] uppercase">{title}</h1>
      {children && <div className={`${bodyText} mt-5 max-w-xl`}>{children}</div>}
    </header>
  );
}

export type Chip = { label: string; href: string; count?: number };

// A row of patch links, the one for this page in the accent patch.
export function ChipNav({ label, chips, current }: { label: string; chips: Chip[]; current?: string }) {
  return (
    <nav aria-label={label} className="overflow-x-auto border-y border-lp-border px-[3%] [scrollbar-width:none]">
      <ul className="flex min-w-max gap-3 py-4">
        {chips.map((chip, index) => {
          const active = chip.href === current;
          return (
            <li key={chip.href}>
              <Link
                href={chip.href}
                aria-current={active ? "page" : undefined}
                className={`${smallPatch} flex min-h-11 items-center gap-2 px-5 text-[11px] uppercase sm:min-h-10 ${active ? "bg-lp-accent text-lp-ink" : "bg-lp-card text-lp-muted hover:bg-lp-text hover:text-lp-bg"} ${index % 2 ? "rotate-1" : "-rotate-1"}`}
              >
                {chip.label}
                {chip.count !== undefined && <span className="opacity-60">{chip.count}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PageButton({ href, children, tone = "accent" }: { href: string; children: ReactNode; tone?: "accent" | "text" }) {
  const tones = {
    accent: "bg-lp-accent text-lp-ink hover:bg-lp-text hover:text-lp-bg",
    text: "bg-lp-text text-lp-bg hover:bg-lp-accent hover:text-lp-ink",
  };
  return (
    <Link href={href} className={`${smallPatch} inline-flex min-h-11 min-w-44 -rotate-1 items-center justify-between gap-6 px-4 text-[11px] font-medium tracking-wide uppercase sm:min-h-10 ${tones[tone]}`}>
      {children}
      <Icon name="arrowRight" />
    </Link>
  );
}

// A product as a cloth patch: the photograph in the frame, name and price sewn underneath. The story
// piece shows "Story" instead of a price, as it does on the landing page's wall.
export function ShopCard({ product, index }: { product: Product; index: number }) {
  const photo = product.images[0];
  return (
    <Link href={`/products/${product.slug}`} className={`${cardPatch} group block p-2 [--lp-stitch-inset:4px] sm:p-2.5 ${cloths[index % cloths.length]} ${tilts[index % tilts.length]}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-lp-surface">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 23vw, 46vw" className={`object-cover ${hoverImage}`} style={{ objectPosition: photo.position }} />
      </div>
      <div className="flex items-start justify-between gap-2 px-1 pt-2.5 pb-1 text-[11px] leading-snug uppercase">
        <span>{product.name}</span>
        <span className="whitespace-nowrap opacity-75">{product.kind === "story" ? "Story" : formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

// The tilt lives on the patch, not the li, so it does not fight the reveal's transform.
export function ShopGrid({ products, label }: { products: Product[]; label: string }) {
  return (
    <ul aria-label={label} className="grid grid-cols-2 gap-x-3 gap-y-6 px-[3%] py-8 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:py-[3%]">
      {products.map((product, index) => (
        <li key={product.slug} style={{ "--lp-stagger": index % 4 } as CSSProperties} className="lp-reveal">
          <ShopCard product={product} index={index} />
        </li>
      ))}
    </ul>
  );
}

// An empty shelf (no kids' range yet, an empty bag): a note on a cloth patch and where to go instead.
// `brand` sews it in the logo's emerald with the logo's cream for the words and the stitch (the user
// asked for the empty checkout's card in the logo's green), a deeper emerald on the dark theme.
const noteTones = {
  card: { cloth: "bg-lp-card", body: "text-lp-muted" },
  brand: { cloth: "bg-lp-brand text-lp-brand-base group-data-[lp-theme=dark]/theme:bg-lp-brand-deep", body: "text-lp-brand-base/80" },
};

export function EmptyNote({ title, children, actions, tone = "card" }: { title: string; children: ReactNode; actions: ReactNode; tone?: keyof typeof noteTones }) {
  return (
    <section className="px-[3%] py-10 lg:py-[5%]">
      <div className={`lp-patch ${patchShadow} mx-auto max-w-xl -rotate-1 p-8 text-center [--lp-stitch-inset:7px] sm:p-12 ${noteTones[tone].cloth}`}>
        <h2 className={sectionTitle}>{title}</h2>
        <div className={`mx-auto mt-4 max-w-sm text-[13px] leading-[1.75] ${noteTones[tone].body}`}>{children}</div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>
      </div>
    </section>
  );
}
