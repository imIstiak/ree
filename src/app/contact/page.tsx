import type { Metadata } from "next";
import { ContactPage } from "../../components/info-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | Contact",
  description: "Reach ঋ - Ree about the first drop, collaborations or press.",
};

export default function Page() {
  return <ContactPage />;
}
