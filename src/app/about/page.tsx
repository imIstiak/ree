import { JsonLd } from "../../components/json-ld";
import { brandPageStructuredData, createPageMetadata } from "../../lib/seo";
import { AboutPage } from "../../components/info-pages";

export const metadata = createPageMetadata({
  path: "/about",
  title: "Our Story: Bengali Heritage & Rural Craft",
  description: "Meet Reé, a luxury fashion label from Bangladesh. Discover how rural craft, Bengali tradition and living history shape our belief that old is gold.",
});

export default function Page() {
  return (
    <>
      <JsonLd data={brandPageStructuredData("/about", "Our story", metadata.description ?? "")} />
      <AboutPage />
    </>
  );
}
