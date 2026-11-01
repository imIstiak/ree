import { JsonLd } from "../../components/json-ld";
import { brandPageStructuredData, createPageMetadata } from "../../lib/seo";
import { ContactPage } from "../../components/info-pages";

export const metadata = createPageMetadata({
  path: "/contact",
  title: "Contact Ree in Dhaka, Bangladesh",
  description: "Contact Ree in Dhaka, Bangladesh for launch updates, creative collaborations and press. Connect with our team by email, phone or our official social profiles.",
});

export default function Page() {
  return (
    <>
      <JsonLd data={brandPageStructuredData("/contact", "Contact Ree", metadata.description ?? "")} />
      <ContactPage />
    </>
  );
}
