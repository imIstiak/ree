import Link from "next/link";
import { ProductForm } from "../../../../../components/backroom/product-form";
import { PageHead, quietButton } from "../../../../../components/backroom/ui";
import { productCategories } from "../../../../../data/collections";
import { collectionOptions } from "../../../../../lib/backroom-data";
import { requireAdmin } from "../../../../../lib/backroom-session";
import { supabaseConfigured } from "../../../../../lib/supabase";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <PageHead kicker="Products" title="New product">
        <Link href="/backroom/products" className={quietButton}>
          ← All products
        </Link>
      </PageHead>
      <ProductForm categories={productCategories} collections={await collectionOptions()} readOnly={!supabaseConfigured()} />
    </>
  );
}
