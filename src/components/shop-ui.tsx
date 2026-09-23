import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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

export function ProductCard({ product, showPrice = true }: { product: Product; showPrice?: boolean }) {
  const photo = product.images[0];
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-lp-surface">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 22vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ objectPosition: photo.position }}
        />
        {product.kind === "story" && (
          <span className="absolute top-2 left-2">
            <Tag>Story</Tag>
          </span>
        )}
      </div>
      <div className="mt-2 flex items-start justify-between gap-2 text-[11px] uppercase">
        <span>{product.name}</span>
        {showPrice ? <span className="text-lp-muted">{formatPrice(product.price)}</span> : <span className="text-lp-muted">{product.category}</span>}
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
        <Link href="/landing#collection" className="text-[11px] whitespace-nowrap uppercase hover:text-lp-accent">
          Browse all →
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} showPrice={showPrice} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ShopFooter() {
  return (
    <footer className="border-t border-lp-border px-[3%] py-8 text-[11px] tracking-[.1em] text-lp-muted uppercase">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span>ঋ - Ree · Not everything old belongs in the past</span>
        <nav aria-label="Shop" className="flex gap-5">
          <Link href="/landing" className="hover:text-lp-text">Home</Link>
          <Link href="/landing#collection" className="hover:text-lp-text">Collections</Link>
          <Link href="/landing#journal" className="hover:text-lp-text">Journal</Link>
        </nav>
      </div>
    </footer>
  );
}
