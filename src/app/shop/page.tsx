import type { Metadata } from "next";
import { ShopPage } from "../../components/catalog-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | Shop",
  description: "Every piece from ঋ - Ree's first collections: heavy tees, handloom, soft tailoring and satin for the evening.",
};

export default function Page() {
  return <ShopPage />;
}
