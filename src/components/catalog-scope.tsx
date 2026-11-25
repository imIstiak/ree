import type { ReactNode } from "react";
import { getCatalogEntries } from "../lib/catalog";
import { CatalogProvider } from "./catalog-client";

// Hands the published catalogue to the browser with the page, for the bag (catalog-client.tsx).
// Wraps every page that carries the shared header: the landing page, SitePage and the product
// pages. Server-rendered with the page, so there is no catalogue API for the browser to call.
export async function CatalogScope({ children }: { children: ReactNode }) {
  return <CatalogProvider products={await getCatalogEntries()}>{children}</CatalogProvider>;
}
