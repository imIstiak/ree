import { createPageMetadata } from "../../lib/seo";
import { CheckoutView } from "../../components/checkout-page";
import { SitePage } from "../../components/site-page";

export const metadata = createPageMetadata({
  path: "/checkout",
  title: "Checkout Preview",
  description: "Ree checkout preview. Orders and payments are not yet available.",
});

export default function Page() {
  return (
    <SitePage>
      <CheckoutView />
    </SitePage>
  );
}
