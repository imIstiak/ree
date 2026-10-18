// Brand copy shared by the landing page's About section and the /about and /contact pages.
// The contact details match the coming-soon page's contact window.

import type { IconName } from "../components/landing-icons";

// `tone` colours the icon; full class literals, as Tailwind needs.
export const values: { icon: IconName; title: string; body: string; tone: string; flow?: boolean }[] = [
  { icon: "comfort", title: "Everyday comfort", body: "Soft, breathable fabrics cut for heat, rain, and the long Dhaka day.", tone: "text-lp-value-comfort" },
  { icon: "quality", title: "Premium quality", body: "Handloom cotton and considered finishing, made to outlast the season.", tone: "text-lp-value-quality" },
  { icon: "delivery", title: "Fast delivery", body: "Quick, reliable delivery across Bangladesh, packed without excess.", tone: "text-lp-value-delivery" },
  { icon: "timeless", title: "Timeless design", body: "Quiet silhouettes rooted in heritage that never fall out of step.", tone: "text-lp-value-timeless", flow: true },
];

export const contact = {
  email: "info@ree.bd",
  phone: "+880 17 8989 1616",
  phoneHref: "tel:+8801789891616",
  location: "Dhaka · Bangladesh",
};
