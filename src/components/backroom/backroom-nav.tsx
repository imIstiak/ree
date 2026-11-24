"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "../landing-icons";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/backroom/orders", label: "Orders", icon: "bag" },
  { href: "/backroom/products", label: "Products", icon: "tag" },
  { href: "/backroom/collections", label: "Collections", icon: "layers" },
  { href: "/backroom/banners", label: "Banners", icon: "image" },
];

// The sidebar's sections; the current one is a cream patch on the emerald, the others only their
// running stitch on the bare sidebar (the user asked for outlined, see-through tabs).
export function BackroomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Backroom" className="grid grid-cols-2 gap-2 px-4 pb-4 sm:flex lg:block lg:space-y-2 lg:px-4 lg:pb-0">
      {links.map((link, index) => {
        const current = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={`flex min-h-11 flex-1 items-center gap-3 px-4 text-[12px] tracking-[.1em] uppercase transition-[background-color,rotate] motion-reduce:transition-none ${index % 2 ? "rotate-[.6deg]" : "-rotate-[.6deg]"} ${current ? "lp-patch rotate-0 bg-lp-brand-base text-lp-brand [--lp-stitch-inset:3px]" : "bg-transparent [outline:1px_dashed_color-mix(in_oklab,currentColor_60%,transparent)] [outline-offset:-3px] hover:bg-lp-brand-base/10"}`}
          >
            <Icon name={link.icon} className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
