"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { logout } from "../../app/backroom/actions";
import { HoverDetails } from "../hover-details";
import { Icon } from "../landing-icons";

// The signed-in account in the header: an initial on a cream patch, opening a panel that comes out
// from the right and sews its rows on like every other dropdown (.ree-pop in globals.css).
const row = (i: number) => ({ "--i": i }) as CSSProperties;
const item =
  "ree-pop-row lp-patch flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-4 text-[11px] tracking-[.1em] uppercase [--lp-stitch-inset:3px] transition-colors hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none";

export function ProfileMenu({ name, email }: { name: string; email: string }) {
  const shown = name || email;
  return (
    <HoverDetails className="relative">
      <summary
        aria-label={`Account: ${shown}`}
        className="flex cursor-pointer list-none items-center gap-2.5 [&::-webkit-details-marker]:hidden"
      >
        <span className="lp-patch grid size-9 rotate-2 place-items-center bg-lp-brand-base font-lp-display text-[15px] text-lp-brand uppercase shadow-[0_2px_5px_rgb(0_0_0/.3)] [--lp-stitch-inset:2px] transition-[rotate] hover:rotate-0 motion-reduce:transition-none">
          {shown.charAt(0)}
        </span>
        <span className="hidden max-w-40 truncate text-[11px] tracking-[.08em] sm:block">{shown}</span>
        <Icon name="chevronRight" className="hidden size-3 rotate-90 opacity-70 sm:block" />
      </summary>
      <div
        className="ree-pop lp-patch absolute top-[calc(100%+18px)] right-0 z-40 w-64 origin-top-right bg-[#f3e9d6] p-3 text-[#063a2d] shadow-[0_16px_40px_rgb(0_0_0/30%)] [--lp-stitch-inset:6px] [--pop-from:140%] [--pop-lean:8deg] [--pop-tilt:1deg] [--row-from:40px] [--row-lean:5deg]"
        style={{ "--last": 3 } as CSSProperties}
      >
        <div className="ree-pop-row px-2 pt-1 pb-3" style={row(0)}>
          <p className="truncate font-lp-display text-base uppercase">{name || "Backroom"}</p>
          <p className="truncate text-[11px] opacity-70">{email}</p>
        </div>
        <div className="space-y-2">
          <Link href="/shop" className={`${item} -rotate-[.6deg] bg-[#ffe7cc]`} style={row(1)}>
            View the shop <Icon name="arrowUpRight" />
          </Link>
          <Link href="/backroom/orders" className={`${item} rotate-[.5deg] bg-[#d3ebdf]`} style={row(2)}>
            Orders <Icon name="arrowRight" />
          </Link>
          <form action={logout}>
            <button type="submit" className={`${item} -rotate-[.4deg] bg-[#fff4e6]`} style={row(3)}>
              Sign out <Icon name="arrowRight" />
            </button>
          </form>
        </div>
      </div>
    </HoverDetails>
  );
}
