import type { Metadata } from "next";
import { DepartmentPage } from "../../components/catalog-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | Men",
  description: "Men's pieces from ঋ - Ree: heavy tees, soft tailoring and outerwear, with the unisex range.",
};

export default function Page() {
  return <DepartmentPage department="men" />;
}
