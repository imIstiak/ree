import type { Metadata } from "next";
import { LandingMain } from "../../components/landing-main";

export const metadata: Metadata = {
  title: "ঋ - Ree | Collections",
  description: "Curated collections for every occasion. Explore considered tailoring, everyday essentials, and a new perspective on personal style.",
};

export default function LandingPage() {
  return <LandingMain />;
}
