"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { formatPrice, type Product } from "../data/products";
import { Icon } from "./landing-icons";
import { useShop } from "./shop-store";

// Size choice, add to bag and wishlist, shared by both product page templates.
export function PurchasePanel({ product, showPrice = true }: { product: Product; showPrice?: boolean }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [added, setAdded] = useState(false);
  const [nudge, setNudge] = useState(false);
  const saved = wishlist.includes(product.slug);

  function add() {
    if (!size) {
      setNudge(true);
      setTimeout(() => setNudge(false), 500);
      return;
    }
    addToCart(product.slug, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-lp-display text-sm tracking-[.02em] uppercase">Choose size</h2>
        <details className="group/chart relative">
          <summary className="cursor-pointer list-none text-[10px] tracking-[.12em] text-lp-muted uppercase underline-offset-4 hover:text-lp-text hover:underline [&::-webkit-details-marker]:hidden">Size chart</summary>
          <table className="absolute right-0 z-20 mt-2 w-56 border border-lp-border bg-lp-card text-[11px] shadow-xl">
            <caption className="px-3 pt-2 text-left text-[10px] text-lp-muted">Approximate, in centimetres</caption>
            <thead>
              <tr className="text-left text-lp-muted">
                <th className="px-3 py-1.5 font-normal">Size</th>
                <th className="px-3 py-1.5 font-normal">Chest</th>
                <th className="px-3 py-1.5 font-normal">Length</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes.map((label, i) => (
                <tr key={label} className="border-t border-lp-border">
                  <td className="px-3 py-1.5">{label}</td>
                  <td className="px-3 py-1.5">{product.sizes.length === 1 ? "—" : 44 + i * 4}</td>
                  <td className="px-3 py-1.5">{product.sizes.length === 1 ? "—" : 62 + i * 2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>

      <motion.ul animate={nudge ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.45 }} className="mt-3 flex flex-wrap gap-2" aria-label="Sizes">
        {product.sizes.map((label) => {
          const selected = size === label;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => setSize(label)}
                aria-pressed={selected}
                className={`grid min-w-11 cursor-pointer place-items-center rounded-full border px-3 text-[11px] leading-none transition-colors motion-reduce:transition-none ${selected ? "border-lp-text bg-lp-text text-lp-bg" : "border-lp-border text-lp-muted hover:border-lp-text hover:text-lp-text"} h-11`}
              >
                {label}
              </button>
            </li>
          );
        })}
      </motion.ul>
      <p className="mt-2 min-h-4 text-[11px] text-lp-muted" aria-live="polite">
        {size ? `Size ${size}` : "Pick a size to continue"}
      </p>

      <button
        type="button"
        onClick={add}
        className={`mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 px-4 text-[11px] font-medium tracking-[.1em] uppercase transition-colors motion-reduce:transition-none ${added ? "bg-lp-accent text-lp-ink" : "bg-lp-text text-lp-bg hover:bg-lp-accent hover:text-lp-ink"}`}
      >
        <Icon name={added ? "check" : "plus"} />
        {added ? "Added to your bag" : showPrice ? `Add to cart · ${formatPrice(product.price)}` : "Add to bag"}
      </button>
      <button
        type="button"
        onClick={() => toggleWishlist(product.slug)}
        aria-pressed={saved}
        className="mt-2 flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 border border-lp-border px-4 text-[11px] font-medium tracking-[.1em] uppercase transition-colors hover:border-lp-text motion-reduce:transition-none"
      >
        <Icon name="heart" className={`size-3.5 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved to wishlist" : "Add to wishlist"}
      </button>
      <ul className="mt-4 space-y-1 text-[11px] text-lp-muted">
        <li>{showPrice ? "Free delivery across Bangladesh on orders over ৳ 3,000" : "Free delivery across Bangladesh"}</li>
        <li>Seven-day exchange, unworn with tags</li>
      </ul>
    </div>
  );
}
