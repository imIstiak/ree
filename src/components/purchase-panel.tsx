"use client";

import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { formatPrice, type Product } from "../data/products";
import { HoverDetails } from "./hover-details";
import { Icon } from "./landing-icons";
import { useShop } from "./shop-store";

// The size chart is light patchwork like the header's bag: a canvas panel that comes in from beyond
// the right edge of the window, leaning, with each size a lighter cloth patch sewn on after it, and
// leaves the same way (the .ree-pop rules in globals.css). It closes 0.6 s after the mouse leaves,
// like the menu and the bag. Colours are fixed, as the header's panels are. Full class literals.
const chartPatches = ["bg-[#fffdf3] -rotate-[1.2deg]", "bg-[#f5ed9e] rotate-[.9deg]", "bg-[#f1d9bd] -rotate-[.7deg]", "bg-[#dfe3bd] rotate-[1.3deg]", "bg-[#f6e0d6] -rotate-1"];
const row = (i: number) => ({ "--i": i }) as CSSProperties;

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
        <HoverDetails className="group/chart relative">
          <summary className="cursor-pointer list-none text-[10px] tracking-[.12em] text-lp-muted uppercase underline-offset-4 group-open/chart:text-lp-text group-open/chart:underline hover:text-lp-text hover:underline [&::-webkit-details-marker]:hidden">Size chart</summary>
          <div
            className="ree-pop lp-patch absolute top-[calc(100%+12px)] right-0 z-20 w-60 origin-top-right bg-[#e9dfc4] p-3 text-[11px] text-[#2a1408] shadow-[0_16px_40px_rgb(0_0_0/35%)] [--lp-stitch-inset:6px] [--pop-from:150%] [--pop-lean:9deg] [--pop-tilt:1.5deg] [--row-from:40px] [--row-lean:5deg]"
            style={{ "--last": product.sizes.length + 1 } as CSSProperties}
          >
            <p className="ree-pop-row px-1 pt-1 text-[10px] opacity-70" style={row(0)}>
              Approximate, in centimetres
            </p>
            <div role="table" aria-label="Size chart in centimetres" className="mt-1">
              <div role="row" className="ree-pop-row grid grid-cols-3 px-3 py-1.5 text-[10px] tracking-[.1em] uppercase opacity-70" style={row(1)}>
                <span role="columnheader">Size</span>
                <span role="columnheader">Chest</span>
                <span role="columnheader">Length</span>
              </div>
              <div role="rowgroup" className="grid gap-[7px]">
                {product.sizes.map((label, i) => (
                  <div key={label} role="row" className={`ree-pop-row lp-patch grid grid-cols-3 px-3 py-2 shadow-[0_2px_6px_rgb(42_20_8/20%)] [--lp-stitch-inset:3px] ${chartPatches[i % chartPatches.length]}`} style={row(i + 2)}>
                    <span role="cell">{label}</span>
                    <span role="cell">{product.sizes.length === 1 ? "—" : 44 + i * 4}</span>
                    <span role="cell">{product.sizes.length === 1 ? "—" : 62 + i * 2}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HoverDetails>
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
