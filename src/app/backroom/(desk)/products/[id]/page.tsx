import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "../../../actions";
import { CrumbLabel } from "../../../../../components/backroom/crumbs";
import { DeleteButton } from "../../../../../components/backroom/delete-button";
import { ProductForm } from "../../../../../components/backroom/product-form";
import { Notice, PageHead, quietButton } from "../../../../../components/backroom/ui";
import { productCategories } from "../../../../../data/collections";
import { collectionOptions, getProductRow } from "../../../../../lib/backroom-data";
import { supabaseConfigured } from "../../../../../lib/supabase";

export default async function EditProductPage({ params, searchParams }: PageProps<"/backroom/products/[id]">) {
  const product = await getProductRow((await params).id);
  if (!product) notFound();
  const { saved } = await searchParams;
  const live = supabaseConfigured();

  return (
    <>
      <CrumbLabel id={product.id} label={product.name} />
      <PageHead kicker={product.kind === "story" ? "Product · story page" : "Product"} title={product.name}>
        {product.status === "published" && (
          <Link href={`/products/${product.slug}`} className={quietButton}>
            View on the shop ↗
          </Link>
        )}
        <Link href="/backroom/products" className={quietButton}>
          ← All products
        </Link>
      </PageHead>
      {saved && (
        <div className="mb-6">
          <Notice tone="good">{saved === "new" ? "Created." : "Saved."} {product.status === "published" ? "It's on the shop." : "It's hidden from the shop until you publish it."}</Notice>
        </div>
      )}
      {product.kind === "story" && (
        <div className="mb-6">
          <Notice>This piece has a story page: its chapters, film and quotes are written in code (src/data/products.ts). Everything below still applies to it.</Notice>
        </div>
      )}
      <ProductForm key={product.updated_at} product={product} categories={productCategories} collections={await collectionOptions()} readOnly={!live} />
      {live && (
        <form action={deleteProduct} className="mt-10 border-t border-dashed border-lp-border pt-6">
          <input type="hidden" name="id" value={product.id} />
          <DeleteButton name={product.name} />
        </form>
      )}
    </>
  );
}
