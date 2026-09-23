"use client";

import Link from "next/link";
import { formatPrice, getProduct } from "../data/products";
import { Icon } from "./landing-icons";
import { useShop } from "./shop-store";

// The product pages' header, after the landing hero's: yellow tiles for the menu and the bag,
// the brand in the middle, a "go back" link and the wishlist. The bag and wishlist panels read
// the localStorage store, so counts follow the visitor between pages.
const menuLinks = [
  { label: "Find your story", href: "/landing#categories" },
  { label: "Collections", href: "/landing#collection" },
  { label: "About", href: "/landing#about" },
  { label: "Journal", href: "/landing#journal" },
];

const tile =
  "grid size-11 cursor-pointer list-none place-items-center bg-[#e6d21f] text-[#3a3000] shadow-lg shadow-black/30 transition-[transform,background-color,color] duration-200 select-none hover:bg-lp-text hover:text-lp-bg motion-reduce:transition-none [&::-webkit-details-marker]:hidden";
const panel = "absolute top-full z-30 mt-3 w-64 border border-lp-border bg-lp-card p-4 text-[12px] shadow-2xl shadow-black/40 group-data-[lp-theme=light]/theme:shadow-black/15";

export function ShopHeader() {
  const { cart, wishlist, removeLine } = useShop();
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.qty * (getProduct(line.slug)?.price ?? 0), 0);

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-[3%] py-4">
      <div className="flex items-center gap-4">
        <details className="relative">
          <summary className={`${tile} -rotate-3 open:rotate-0`} aria-label="Menu">
            <Icon name="menu" className="size-5" />
          </summary>
          <div className={`${panel} left-0`}>
            <ul>
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-2.5 uppercase hover:text-lp-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </details>
        <Link href="/landing#collection" className="hidden items-center gap-1.5 text-[11px] tracking-[.1em] uppercase hover:text-lp-accent sm:inline-flex">
          <Icon name="chevronLeft" className="size-3" /> Go back
        </Link>
      </div>

      <Link href="/landing" aria-label="REÉ home" className="absolute left-1/2 -translate-x-1/2 font-lp-display text-2xl leading-none tracking-[-.025em] sm:text-3xl">
        REÉ
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        <details className="relative">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[11px] tracking-[.1em] uppercase select-none hover:text-lp-accent [&::-webkit-details-marker]:hidden" aria-label={`Wishlist, ${wishlist.length} saved`}>
            <Icon name="heart" className={`size-4 ${wishlist.length ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">Wishlist</span>
            <span>({wishlist.length})</span>
          </summary>
          <div className={`${panel} right-0`}>
            {wishlist.length === 0 ? (
              <p className="text-lp-muted">Nothing saved yet.</p>
            ) : (
              <ul>
                {wishlist.map((slug) => {
                  const product = getProduct(slug);
                  return product ? (
                    <li key={slug}>
                      <Link href={`/products/${slug}`} className="flex justify-between gap-3 py-2.5 hover:text-lp-accent">
                        <span>{product.name}</span>
                        <span className="text-lp-muted">{formatPrice(product.price)}</span>
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
        </details>

        <details className="relative">
          <summary className={`${tile} rotate-3 open:rotate-0`} aria-label={`Bag, ${count} items`}>
            <Icon name="bag" className="size-5" />
            <span className="absolute -top-2 -right-2 grid h-[18px] min-w-[18px] place-items-center border border-lp-border bg-lp-card px-1 text-[10px] leading-none text-lp-text" aria-hidden="true">
              {count}
            </span>
          </summary>
          <div className={`${panel} right-0 w-72`}>
            {cart.length === 0 ? (
              <p className="text-lp-muted">Your bag is empty.</p>
            ) : (
              <>
                <ul className="divide-y divide-lp-border">
                  {cart.map((line) => {
                    const product = getProduct(line.slug);
                    return (
                      <li key={`${line.slug}-${line.size}`} className="flex items-center justify-between gap-3 py-2.5">
                        <div>
                          <Link href={`/products/${line.slug}`} className="hover:text-lp-accent">{product?.name ?? line.slug}</Link>
                          <p className="text-[11px] text-lp-muted">
                            Size {line.size} · × {line.qty}
                          </p>
                        </div>
                        <button type="button" onClick={() => removeLine(line.slug, line.size)} aria-label={`Remove ${product?.name ?? line.slug}, size ${line.size}`} className="grid size-7 cursor-pointer place-items-center border border-lp-border hover:border-lp-accent">
                          <Icon name="x" className="size-3" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 flex justify-between border-t border-lp-border pt-3">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </p>
                <p className="mt-2 text-[11px] text-lp-muted">Checkout is coming soon.</p>
              </>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
