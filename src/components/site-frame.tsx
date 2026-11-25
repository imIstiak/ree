import type { ReactNode } from "react";
import { CatalogScope } from "./catalog-scope";
import { ProductShell } from "./product-shell";
import { ShopFooter, pageHeader } from "./shop-ui";
import { SiteHeader } from "./site-header";

// The frame of the shop's own pages: the product pages' shell, the shared header and the shop
// footer, inside CatalogScope so the header's bag (and /cart, /checkout) get the catalogue with the
// page. Server only: it reads the catalogue, so it lives apart from site-page.tsx, whose pieces the
// cart and checkout (client components) import.
export function SitePage({ children }: { children: ReactNode }) {
  return (
    <CatalogScope>
      <ProductShell>
        <SiteHeader base="/landing" className={pageHeader} />
        <main className="pb-16 lg:pb-[5%]">{children}</main>
        <ShopFooter />
      </ProductShell>
    </CatalogScope>
  );
}
