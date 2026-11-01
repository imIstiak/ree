import { createPageMetadata } from "../../lib/seo";
import { DepartmentPage } from "../../components/catalog-pages";

export const metadata = createPageMetadata({
  path: "/kids",
  title: "Kids' Collection: Coming Later",
  description: "Ree's children's clothing range is planned for a later drop. Follow our Bangladeshi fashion label for future collection updates.",
});

export default function Page() {
  return <DepartmentPage department="kids" />;
}
