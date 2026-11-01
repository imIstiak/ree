
import { ComingSoon } from "../components/coming-soon";
import { JsonLd } from "../components/json-ld";
import { site } from "../data/site";
import { createPageMetadata, homeStructuredData } from "../lib/seo";

export const metadata = createPageMetadata({ path: "/", description: site.description });

export default function Home() {
  return (
    <>
      <JsonLd data={homeStructuredData} />
      <ComingSoon />
    </>
  );
}
