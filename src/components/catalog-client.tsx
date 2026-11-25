"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CatalogEntry } from "../data/products";

// The catalogue in the browser, rendered on the server with the page (CatalogScope wraps the
// landing page, the shop pages and the product pages), so the header's bag, /cart and /checkout look
// pieces up without a request of their own. It is as fresh as the page: every backroom save and
// placed order revalidates the pages that carry it.
const CatalogContext = createContext<CatalogEntry[]>([]);

export function CatalogProvider({ products, children }: { products: CatalogEntry[]; children: ReactNode }) {
  return <CatalogContext value={products}>{children}</CatalogContext>;
}

export function useCatalog() {
  const products = useContext(CatalogContext);
  // A piece renamed in the backroom is still found under its old slugs (bags saved before the
  // rename); old slugs go in first, so a current slug always wins over another piece's old one.
  const bySlug = useMemo(
    () => new Map([...products.flatMap((product) => (product.previousSlugs ?? []).map((slug) => [slug, product] as const)), ...products.map((product) => [product.slug, product] as const)]),
    [products],
  );
  return { products, find: (slug: string) => bySlug.get(slug) };
}
