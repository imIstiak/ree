import type { Metadata } from "next";
import { DepartmentPage } from "../../components/catalog-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | Women",
  description: "Women's pieces from ঋ - Ree: satin, hand block print and easy tees, with the unisex range.",
};

export default function Page() {
  return <DepartmentPage department="women" />;
}
