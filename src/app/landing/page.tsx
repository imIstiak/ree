import { createPageMetadata } from "../../lib/seo";
import { LandingMain } from "../../components/landing-main";

export const metadata = createPageMetadata({
  path: "/landing",
  title: "Collection & Brand Preview",
  description: "Preview Reé's design direction: contemporary fashion inspired by Bengali heritage, rural craft and the stories of Bangladesh. Our first collection is coming soon.",
});

export default function LandingPage() {
  return <LandingMain />;
}
