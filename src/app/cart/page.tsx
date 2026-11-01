import { createPageMetadata } from "../../lib/seo";
import { CartView } from "../../components/cart-page";
import { SitePage } from "../../components/site-page";

export const metadata = createPageMetadata({
  path: "/cart",
  title: "Your Bag",
  description: "Review your saved Ree pieces. The store is currently a preview and does not take orders.",
});

export default function Page() {
  return (
    <SitePage>
      <CartView />
    </SitePage>
  );
}
