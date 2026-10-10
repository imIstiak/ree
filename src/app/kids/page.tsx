import type { Metadata } from "next";
import { DepartmentPage } from "../../components/catalog-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | Kids",
  description: "The ঋ - Ree kids' range arrives with a later drop.",
};

export default function Page() {
  return <DepartmentPage department="kids" />;
}
