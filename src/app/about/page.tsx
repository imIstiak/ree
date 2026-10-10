import type { Metadata } from "next";
import { AboutPage } from "../../components/info-pages";

export const metadata: Metadata = {
  title: "ঋ - Ree | About",
  description: "ঋ - Ree is an independent clothing label shaped in Bengal. Not everything old belongs in the past.",
};

export default function Page() {
  return <AboutPage />;
}
