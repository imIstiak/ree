import type { Metadata } from "next";
import { CartView } from "../../components/cart-page";
import { SitePage } from "../../components/site-page";

export const metadata: Metadata = {
  title: "ঋ - Ree | Your bag",
  robots: { index: false },
};

export default function Page() {
  return (
    <SitePage>
      <CartView />
    </SitePage>
  );
}
