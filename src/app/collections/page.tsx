import { createPageMetadata } from "../../lib/seo";
import { CollectionsPage } from "../../components/catalog-pages";

export const metadata = createPageMetadata({
  path: "/collections",
  title: "Collection Previews",
  description: "Explore Ree's upcoming collections, from everyday silhouettes to handloom-inspired pieces. A preview of contemporary fashion shaped by Bengali heritage.",
});

export default function Page() {
  return <CollectionsPage />;
}
