"use client";

import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import type { Product } from "../data/products";
import { HoverDetails } from "./hover-details";
import { Icon } from "./landing-icons";
import { ProductShell } from "./product-shell";
import { PurchasePanel } from "./purchase-panel";
import { Price, RelatedProducts, ShopFooter, kicker, pageHeader } from "./shop-ui";
import { SiteHeader } from "./site-header";

// The conventional product page, after the reference layout: details on the left, the photograph
// in the middle, size and add-to-cart on the right, all between faint column rules. The photographs
// not in the main frame sit at the top of the right column (the user asked for them there instead of
// a strip under the photograph); picking one swaps it into the frame. On phones it stacks
// photograph, details, the other photographs, purchase.
export function ProductClassic({ product, related }: { product: Product; related: Product[] }) {
  const [active, setActive] = useState(0);
  const photo = product.images[active];
  const many = product.images.length > 1;
  const step = (delta: number) => setActive((i) => (i + delta + product.images.length) % product.images.length);
  const others = product.images.map((image, index) => ({ image, index })).filter(({ index }) => index !== active);

  return (
    <MotionConfig reducedMotion="user">
      <ProductShell>
        <SiteHeader base="/landing" className={pageHeader} />
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
              {/* The care lines are sewn in like the header menu's links and leave the same way (.ree-pop-row). */}
              <HoverDetails className="group mt-6 border-t border-lp-border pt-4" closeOnLeave={false}>
                <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] tracking-[.12em] uppercase [&::-webkit-details-marker]:hidden">
                  Care
                  <Icon name="plus" className="size-3 transition-transform group-open:rotate-45 motion-reduce:transition-none" />
                </summary>
                <ul className="mt-3 space-y-1 text-[12px] text-lp-muted" style={{ "--last": product.care.length - 1 } as CSSProperties}>
                  {product.care.map((line, i) => (
                    <li key={line} className="ree-pop-row origin-left" style={{ "--i": i } as CSSProperties}>
                      {line}
                    </li>
                  ))}
                </ul>
              </HoverDetails>
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
            </div>

            <div className={`order-3 lg:px-[8%] ${others.length > 0 ? "lg:pt-[18%]" : "lg:pt-[52%]"}`}>
              {others.length > 0 && (
                <div className="mb-10">
                  <p className={kicker}>More views</p>
                  <ul className="mt-3 grid grid-cols-2 gap-3" aria-label="More photographs">
                    {others.map(({ image, index }) => (
                      <motion.li key={image.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                        <button type="button" onClick={() => setActive(index)} aria-label={`Show photograph ${index + 1}`} className="group/view relative block aspect-[3/4] w-full cursor-pointer overflow-hidden bg-lp-surface">
                          <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 12vw, 45vw" className="object-cover transition-transform duration-700 group-hover/view:scale-105 motion-reduce:transition-none" style={{ objectPosition: image.position }} />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
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
