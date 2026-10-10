import type { Metadata } from "next";
import { JournalPage } from "../../components/info-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | Journal",
  description: "Latest looks, behind-the-scenes moments and the people who make every ঋ - Ree collection.",
};

export default function Page() {
  return <JournalPage />;
}
