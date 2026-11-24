import Image from "next/image";
import Link from "next/link";
import { importStarterCatalogue } from "../../actions";
import { Notice, PageHead, panel, primaryButton } from "../../../../components/backroom/ui";
import { formatPrice } from "../../../../data/products";
import { listProducts } from "../../../../lib/backroom-data";
import { supabaseConfigured } from "../../../../lib/supabase";

const statusCloth = {
  published: "bg-lp-brand-cloth text-lp-brand-base",
  draft: "bg-lp-accent text-lp-ink",
  archived: "bg-lp-text/10 text-lp-muted",
} as const;

// Every product, in the shop's order (the "Order" number on each product), with what a glance
// needs: photo, price, stock and whether it is on the shop.
export default async function ProductsPage({ searchParams }: PageProps<"/backroom/products">) {
  const params = await searchParams;
  const products = await listProducts();
  const live = supabaseConfigured();
  const published = products.filter((product) => product.status === "published").length;

  return (
    <>
      <PageHead kicker={`${published} on the shop · ${products.length} in all`} title="Products">
        {live && (
          <Link href="/backroom/products/new" className={primaryButton}>
            + New product
          </Link>
        )}
      </PageHead>

      {params.deleted && (
        <div className="mb-6">
          <Notice tone="good">The product was deleted. Past orders keep their own copy of it.</Notice>
        </div>
      )}

      {live && products.length === 0 ? (
        <div className={`${panel} px-6 py-12 text-center`}>
          <p className="font-lp-display text-xl uppercase">No products yet</p>
          <p className="mx-auto mt-2 max-w-md text-[12px] text-lp-muted">
            Start from the pieces the site has been showing (the starter catalogue in <code>src/data/products.ts</code>), or add your first product by hand.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <form action={importStarterCatalogue}>
              <button className={primaryButton}>Import the starter catalogue</button>
            </form>
            <Link href="/backroom/products/new" className={primaryButton}>
              + New product
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => {
            const tracked = Object.values(product.stock);
            const left = tracked.reduce((sum, count) => sum + count, 0);
            const cover = product.images[0];
            return (
              <li key={product.id}>
                <Link
                  href={`/backroom/products/${product.id}`}
                  className={`${panel} flex gap-4 p-3 transition-[translate,rotate,box-shadow] hover:-translate-y-0.5 hover:rotate-0 hover:shadow-md motion-reduce:transition-none ${index % 2 ? "rotate-[.4deg]" : "-rotate-[.4deg]"}`}
                >
                  <span className="relative aspect-[4/5] w-20 flex-none overflow-hidden bg-lp-surface">
                    {cover && <Image src={cover.src} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: cover.position }} />}
                  </span>
                  <span className="min-w-0 flex-1 py-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="truncate font-lp-display text-[15px] leading-tight uppercase">{product.name}</span>
                      <span className={`lp-patch flex-none px-1.5 py-0.5 text-[9px] tracking-[.1em] uppercase [--lp-stitch-inset:2px] ${statusCloth[product.status]}`}>{product.status}</span>
                    </span>
                    <span className="mt-1 block text-[11px] text-lp-muted">
                      {product.category} · {product.department}
                    </span>
                    <span className="mt-2 block text-[13px]">
                      {formatPrice(product.price)}
                      {product.was_price && <span className="ml-2 text-lp-muted line-through">{formatPrice(product.was_price)}</span>}
                    </span>
                    <span className="mt-1 block text-[11px] text-lp-muted">
                      {tracked.length === 0 ? `Sizes ${product.sizes.join(" · ")} · stock not tracked` : `${left} left · ${tracked.filter((count) => count === 0).length} sizes sold out`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
