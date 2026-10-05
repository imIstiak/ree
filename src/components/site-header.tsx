"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { formatPrice, getProduct } from "../data/products";
import { BrandLogo } from "./brand-logo";
import { HoverDetails } from "./hover-details";
import { Icon } from "./landing-icons";
import { useShop } from "./shop-store";
import styles from "./site-header.module.css";

// The site's one header, shared by the landing hero and the product pages: a tilted menu tile,
// the brand in the middle and the bag tile. Both panels are light patchwork that slides in from
// its own side of the window and leaves the same way (site-header.module.css, hover-details.tsx).
// The bag reads the localStorage store, so its count and lines follow the visitor between pages;
// saved pieces are listed under the bag.
const menuLinks = [
  { label: "Categories", hash: "#categories" },
  { label: "Style", hash: "#style" },
  { label: "Collection", hash: "#collection" },
  { label: "About", hash: "#about" },
  { label: "Journal", hash: "#journal" },
];

// On the landing page the links are in-page anchors, which its own scroll container handles;
// from anywhere else they are routes back to it.
function NavLink({ href, className, children, label }: { href: string; className?: string; children: ReactNode; label?: string }) {
  return href.startsWith("#") ? (
    <a href={href} className={className} aria-label={label}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} aria-label={label}>
      {children}
    </Link>
  );
}

export function SiteHeader({
  base = "",
  overMedia = false,
  className = "",
  settings,
}: {
  // "" on the landing page itself, "/landing" everywhere else.
  base?: string;
  // Over a photograph or film the logo keeps its light colour instead of following the theme.
  overMedia?: boolean;
  // Positions the bar; it must make it a containing block (`relative` / `absolute`).
  className?: string;
  // Optional controls shown under the menu links.
  settings?: ReactNode;
}) {
  const { cart, wishlist, removeLine } = useShop();
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.qty * (getProduct(line.slug)?.price ?? 0), 0);
  const saved = wishlist.flatMap((slug) => getProduct(slug) ?? []);

  return (
    <nav className={`${styles.bar} ${overMedia ? styles.overMedia : ""} ${className}`} aria-label="Primary">
      <HoverDetails className={styles.menu}>
        <summary className={styles.navLabel} aria-label="Menu">
          <Icon name="menu" className={`${styles.navIcon} ${styles.navIconClosed}`} />
          <Icon name="x" className={`${styles.navIcon} ${styles.navIconOpen}`} />
        </summary>
        <div className={styles.menuPanel}>
          <ul>
            {menuLinks.map((link) => (
              <li key={link.hash}>
                <NavLink href={`${base}${link.hash}`}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
          {settings && (
            <div className={styles.menuSettings}>
              <span>Appearance</span>
              {settings}
            </div>
          )}
        </div>
      </HoverDetails>

      <NavLink href={base || "#top"} className={styles.brand} label="REE home">
        <BrandLogo decorative />
      </NavLink>

      <HoverDetails className={styles.cart}>
        <summary className={styles.navLabel} aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}>
          <Icon name="bag" className={styles.navIcon} />
          <span className={styles.navCount} aria-hidden="true">
            {count}
          </span>
        </summary>
        <div className={styles.cartPanel}>
          {cart.length === 0 ? (
            <>
              <p className={styles.empty}>Your bag is empty.</p>
              <NavLink href={`${base}#collection`} className={styles.panelLink}>
                Explore the collection <Icon name="arrowUpRight" className={styles.panelIcon} />
              </NavLink>
            </>
          ) : (
            <>
              <ul className={styles.lines}>
                {cart.map((line) => {
                  const name = getProduct(line.slug)?.name ?? line.slug;
                  return (
                    <li key={`${line.slug}-${line.size}`}>
                      <Link href={`/products/${line.slug}`} className={styles.line}>
                        {name}
                        <small>
                          Size {line.size} · × {line.qty}
                        </small>
                      </Link>
                      <button type="button" className={styles.remove} onClick={() => removeLine(line.slug, line.size)} aria-label={`Remove ${name}, size ${line.size}`}>
                        <Icon name="x" className={styles.panelIcon} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className={styles.total}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </p>
              <p className={styles.note}>Checkout is coming soon.</p>
            </>
          )}
          {saved.length > 0 && (
            <>
              <p className={styles.saved}>Saved · {saved.length}</p>
              <ul className={styles.lines}>
                {saved.map((product) => (
                  <li key={product.slug}>
                    <Link href={`/products/${product.slug}`} className={styles.line}>
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </HoverDetails>
    </nav>
  );
}
