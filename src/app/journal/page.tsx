import { createPageMetadata } from "../../lib/seo";
import { JournalPage } from "../../components/info-pages";

export const metadata = createPageMetadata({
  path: "/journal",
  title: "Journal Preview",
  description: "Preview the Ree journal: upcoming stories about cloth, tradition, design and the inspiration behind our Bangladeshi fashion label.",
});

export default function Page() {
  return <JournalPage />;
}
