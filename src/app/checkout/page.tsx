import type { Metadata } from "next";
import { CheckoutView } from "../../components/checkout-page";
import { SitePage } from "../../components/site-page";

export const metadata: Metadata = {
  title: "ঋ - Ree | Checkout",
  robots: { index: false },
};

export default function Page() {
  return (
    <SitePage>
      <CheckoutView />
    </SitePage>
  );
}
