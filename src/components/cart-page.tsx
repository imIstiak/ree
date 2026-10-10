"use client";

import Image from "next/image";
import Link from "next/link";
import { FREE_DELIVERY_FROM, deliveryAreas } from "../data/checkout";
import { formatPrice, getProduct, type Product } from "../data/products";
import { Icon } from "./landing-icons";
import { useHydrated, useShop, type CartLine } from "./shop-store";
import { EmptyNote, PageButton, PageIntro, ShopGrid, bodyText, cloths, patchShadow, sectionTitle } from "./site-page";

// The bag (/cart): every line as a cloth patch with a quantity stepper, a summary with the delivery
// promise, and the saved pieces underneath. It reads the localStorage store, so it renders after
// hydration; there is no backend.

const MAX_QTY = 10;

export type BagLine = CartLine & { product: Product };

export function useBag() {
  const shop = useShop();
  const lines: BagLine[] = shop.cart.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ ...line, product }] : [];
  });
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.product.price, 0);
  return { ...shop, lines, count, subtotal };
}

export function CartView() {
  const hydrated = useHydrated();
  const { lines, count, subtotal, wishlist, setQty, removeLine } = useBag();
  const saved = wishlist.flatMap((slug) => getProduct(slug) ?? []);
  const toFree = Math.max(0, FREE_DELIVERY_FROM - subtotal);
  const cheapest = Math.min(...deliveryAreas.map((area) => area.fee));

  return (
    <>
      <PageIntro eyebrow={hydrated ? `Your bag · ${count} ${count === 1 ? "item" : "items"}` : "Your bag"} title="Your bag" />

      {!hydrated ? (
        <div className="min-h-[40vh] border-t border-lp-border" aria-hidden="true" />
      ) : lines.length === 0 ? (
        <EmptyNote
          title="Your bag is empty"
          actions={
            <>
              <PageButton href="/shop">Shop everything</PageButton>
              <PageButton href="/collections" tone="text">
                See the collections
              </PageButton>
            </>
          }
        >
          Pick a size on any piece and add it to your bag; it will wait for you here.
        </EmptyNote>
      ) : (
        <div className="grid items-start gap-10 border-t border-lp-border px-[3%] py-8 lg:grid-cols-[1fr_minmax(320px,380px)] lg:gap-[5%] lg:py-[3%]">
          <ul aria-label="Items in your bag" className="space-y-5">
            {lines.map((line, index) => (
              <li
                key={`${line.slug}-${line.size}`}
                className={`lp-patch ${patchShadow} grid grid-cols-[84px_1fr] gap-4 p-3 [--lp-stitch-inset:5px] sm:grid-cols-[108px_1fr] sm:p-4 ${cloths[index % cloths.length]} ${index % 2 ? "rotate-[.4deg]" : "-rotate-[.4deg]"}`}
              >
                <Link href={`/products/${line.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-lp-surface" tabIndex={-1} aria-hidden="true">
                  <Image src={line.product.images[0].src} alt="" fill sizes="108px" className="object-cover" style={{ objectPosition: line.product.images[0].position }} />
                </Link>
                <div className="flex min-w-0 flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${line.slug}`} className="font-lp-display text-[15px] leading-tight uppercase hover:underline sm:text-base">
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-[11px] uppercase opacity-75">
                        {line.product.colour} · Size {line.size} · {formatPrice(line.product.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.slug, line.size)}
                      aria-label={`Remove ${line.product.name}, size ${line.size}`}
                      className="grid size-9 flex-none cursor-pointer place-items-center border border-current/40 transition-colors hover:bg-current/15 motion-reduce:transition-none"
                    >
                      <Icon name="x" className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-center" role="group" aria-label={`Quantity of ${line.product.name}, size ${line.size}`}>
                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                        aria-label={line.qty === 1 ? `Remove ${line.product.name}` : "One fewer"}
                        className="grid size-9 cursor-pointer place-items-center border border-current/40 transition-colors hover:bg-current/15 motion-reduce:transition-none"
                      >
                        <Icon name="minus" className="size-3.5" />
                      </button>
                      <span className="grid h-9 min-w-10 place-items-center border-y border-current/40 text-[13px]" aria-live="polite">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.size, Math.min(MAX_QTY, line.qty + 1))}
                        disabled={line.qty >= MAX_QTY}
                        aria-label="One more"
                        className="grid size-9 cursor-pointer place-items-center border border-current/40 transition-colors hover:bg-current/15 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                      >
                        <Icon name="plus" className="size-3.5" />
                      </button>
                    </div>
                    <p className="font-lp-display text-base">{formatPrice(line.qty * line.product.price)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside aria-labelledby="summary-title" className="lg:sticky lg:top-6">
            <div className={`lp-patch ${patchShadow} rotate-[.6deg] bg-lp-card p-6 text-lp-text [--lp-stitch-inset:6px]`}>
              <h2 id="summary-title" className={sectionTitle}>
                Summary
              </h2>
              <dl className="mt-5 space-y-2.5 text-[13px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-lp-muted">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-lp-muted">Delivery</dt>
                  <dd>{toFree === 0 ? "Free" : `From ${formatPrice(cheapest)}`}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-lp-border pt-3 font-lp-display text-lg">
                  <dt>Total</dt>
                  <dd>{formatPrice(subtotal + (toFree === 0 ? 0 : cheapest))}</dd>
                </div>
              </dl>
              <p className={`${bodyText} mt-3`}>
                {toFree === 0 ? "Your order ships free across Bangladesh." : `Add ${formatPrice(toFree)} more for free delivery across Bangladesh. The fee for your area is set at checkout.`}
              </p>
              <Link
                href="/checkout"
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 bg-lp-text px-4 text-[11px] font-medium tracking-[.1em] text-lp-bg uppercase transition-colors hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none"
              >
                Checkout <Icon name="arrowRight" />
              </Link>
              <Link href="/shop" className="mt-4 block text-center text-[11px] tracking-[.1em] text-lp-muted uppercase underline-offset-4 hover:text-lp-text hover:underline">
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}

      {hydrated && saved.length > 0 && (
        <section aria-labelledby="saved-title" className="border-t border-lp-border pt-8">
          <h2 id="saved-title" className={`${sectionTitle} px-[3%]`}>
            Saved for later
          </h2>
          <ShopGrid products={saved} label="Saved pieces" />
        </section>
      )}
    </>
  );
}
