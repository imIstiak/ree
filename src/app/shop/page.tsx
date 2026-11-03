import { createPageMetadata } from "../../lib/seo";
import { ShopPage } from "../../components/catalog-pages";

export const metadata = createPageMetadata({
  path: "/shop",
  title: "Shop Preview",
  description: "Preview Reé's upcoming clothing collections from Bangladesh. Explore the design direction before the first drop; products and prices are previews.",
});

export default function Page() {
  return <ShopPage />;
}
