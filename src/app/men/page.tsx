import { createPageMetadata } from "../../lib/seo";
import { DepartmentPage } from "../../components/catalog-pages";

export const metadata = createPageMetadata({
  path: "/men",
  title: "Men's Clothing Preview",
  description: "Preview upcoming men's and unisex clothing from Ree, a Bangladeshi fashion label inspired by heritage and contemporary life.",
});

export default function Page() {
  return <DepartmentPage department="men" />;
}
