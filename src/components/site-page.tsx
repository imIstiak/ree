import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Product } from "../data/products";
import { Icon } from "./landing-icons";
import { ProductShell } from "./product-shell";
import { ShopCard, ShopFooter, kicker, pageHeader, patchShadow, smallPatch } from "./shop-ui";

// The patch classes and the product patch live in shop-ui.tsx (the product pages use them too).
export { ShopCard, cardPatch, cloths, hoverImage, patchShadow, smallPatch, tilts } from "./shop-ui";
import { SiteHeader } from "./site-header";

// The frame and the small pieces for the shop's own pages (shop, men / women / kids, collections,
// about, journal, contact, legal, cart, checkout): the product pages' shell, the shared header and
// the shop footer, with the landing page's patchwork for every card, chip and button (each one a
// cloth patch with a running stitch, resting at a tilt that straightens on hover). No hooks, so
// server pages can use it.

export const bodyText = "text-[13px] leading-[1.75] text-lp-muted";
export const sectionTitle = "lp-newsprint font-lp-display text-[clamp(1.4rem,2.6cqw,2.4rem)] leading-[1.05] tracking-[-.02em] uppercase";

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
