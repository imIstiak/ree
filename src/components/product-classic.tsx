"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../data/products";
import { Icon } from "./landing-icons";
import { ProductShell } from "./product-shell";
import { PurchasePanel } from "./purchase-panel";
import { ShopHeader } from "./shop-header";
import { Price, RelatedProducts, ShopFooter, kicker } from "./shop-ui";

// The conventional product page, after the reference layout: details on the left, the photograph
// in the middle, size and add-to-cart on the right, all between faint column rules. On phones it
// stacks photograph, details, purchase.
export function ProductClassic({ product, related }: { product: Product; related: Product[] }) {
  const [active, setActive] = useState(0);
  const photo = product.images[active];
  const many = product.images.length > 1;
  const step = (delta: number) => setActive((i) => (i + delta + product.images.length) % product.images.length);

  return (
    <MotionConfig reducedMotion="user">
      <ProductShell>
        <ShopHeader />
        <main className="px-[3%] pt-2 pb-[4%]">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_1.2fr_1fr] lg:gap-0">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden grid-cols-[1fr_1.2fr_1fr] lg:grid">
              <i className="border-l border-lp-border" />
              <i className="border-x border-lp-border" />
              <i className="border-r border-lp-border" />
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="order-2 lg:order-1 lg:px-[8%] lg:pt-[18%]">
              <p className={kicker}>
                {product.category} · {product.colour}
              </p>
              <h1 className="lp-newsprint mt-3 font-lp-display text-[clamp(2rem,3.6cqw,3.6rem)] leading-[1.02] tracking-[-.02em] uppercase">{product.name}</h1>
              <p className="mt-4 font-lp-serif text-lg leading-snug italic text-lp-muted">{product.tagline}</p>
              <Price product={product} className="mt-5" />

              <h2 className="mt-10 font-lp-display text-sm tracking-[.02em] uppercase">Details</h2>
              <p className="mt-3 text-[13px] leading-[1.8] text-lp-muted">{product.description}</p>
              <ul className="mt-4 space-y-1.5 text-[12px] leading-relaxed">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 size-1 flex-none bg-lp-accent" />
                    {detail}
                  </li>
                ))}
              </ul>
              <details className="group mt-6 border-t border-lp-border pt-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] tracking-[.12em] uppercase [&::-webkit-details-marker]:hidden">
                  Care
                  <Icon name="plus" className="size-3 transition-transform group-open:rotate-45 motion-reduce:transition-none" />
                </summary>
                <ul className="mt-3 space-y-1 text-[12px] text-lp-muted">
                  {product.care.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>

              {product.kind === "classic" && (
                <Link href="/products/life-is-short-tee" className="group/film relative mt-10 block aspect-[16/10] w-48 overflow-hidden bg-lp-surface">
                  <Image src="/products/life-is-short-film.jpg" alt="" fill sizes="192px" className="object-cover transition-transform duration-700 group-hover/film:scale-105 motion-reduce:transition-none" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-9 place-items-center rounded-full bg-lp-text/85 text-lp-bg">
                      <Icon name="play" className="size-3.5" />
                    </span>
                  </span>
                  <span className="absolute inset-x-2 bottom-2 text-[10px] tracking-[.12em] text-white/90 uppercase">Film · Life is short</span>
                </Link>
              )}
            </motion.div>

            <div className="order-1 lg:order-2 lg:px-[5%]">
              <div className="relative aspect-[3/4] overflow-hidden bg-lp-surface">
                <AnimatePresence initial={false}>
                  <motion.div key={photo.src} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="absolute inset-0">
                    <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: photo.position }} />
                  </motion.div>
                </AnimatePresence>
                {many && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 cursor-pointer place-items-center bg-lp-bg/70 text-lp-text backdrop-blur-sm transition-colors hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none">
                      <Icon name="chevronLeft" />
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 cursor-pointer place-items-center bg-lp-bg/70 text-lp-text backdrop-blur-sm transition-colors hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none">
                      <Icon name="chevronRight" />
                    </button>
                  </>
                )}
                <span className="absolute right-3 bottom-3 bg-lp-bg/70 px-1.5 py-0.5 text-[10px] tracking-[.12em] text-lp-text uppercase backdrop-blur-sm">
                  {active + 1} / {product.images.length}
                </span>
              </div>
              {many && (
                <ul className="mt-3 flex gap-2" aria-label="Photographs">
                  {product.images.map((image, i) => (
                    <li key={image.src}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Photograph ${i + 1}`}
                        aria-pressed={i === active}
                        className={`relative block aspect-[3/4] w-14 cursor-pointer overflow-hidden transition-opacity motion-reduce:transition-none ${i === active ? "opacity-100 outline-2 -outline-offset-2 outline-lp-accent" : "opacity-60 hover:opacity-100"}`}
                      >
                        <Image src={image.src} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: image.position }} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="order-3 lg:px-[8%] lg:pt-[52%]">
              <div className="lg:sticky lg:top-6">
                <PurchasePanel product={product} />
              </div>
            </div>
          </div>
        </main>
        <RelatedProducts products={related} />
        <ShopFooter />
      </ProductShell>
    </MotionConfig>
  );
}
