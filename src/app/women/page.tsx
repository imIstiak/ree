import { createPageMetadata } from "../../lib/seo";
import { DepartmentPage } from "../../components/catalog-pages";

export const metadata = createPageMetadata({
  path: "/women",
  title: "Women's Clothing Preview",
  description: "Preview upcoming women's and unisex clothing from Ree, with silhouettes inspired by Bengali craft, heritage and contemporary life.",
});

export default function Page() {
  return <DepartmentPage department="women" />;
}
