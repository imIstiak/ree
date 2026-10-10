import type { Metadata } from "next";
import { CollectionsPage } from "../../components/catalog-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | Collections",
  description: "Six edits from ঋ - Ree: casual wear, loungewear, street style, outerwear, handloom and formal wear.",
};

export default function Page() {
  return <CollectionsPage />;
}
