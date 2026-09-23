"use client";

import type { ReactNode, Ref } from "react";
import { display, mono } from "./landing-fonts";
import { PRODUCT_ROOT_ID, ThemeControls, ThemeScript } from "./theme-controls";

// Page root for the product pages: the scroll container (globals.css locks body scrolling for the
// coming-soon stage), the shop's fonts and theme scope, and the theme dock. `ref` is the scroll
// container, which motion's useScroll needs. The inner wrapper clips horizontally without creating
// a scroll container, so sticky columns still work.
export function ProductShell({ children, ref }: { children: ReactNode; ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      id={PRODUCT_ROOT_ID}
      ref={ref}
      data-lp-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${mono.variable} group/theme h-svh overflow-x-hidden overflow-y-auto scroll-smooth bg-lp-bg font-lp-mono text-lp-text transition-colors duration-300 motion-reduce:scroll-auto motion-reduce:transition-none`}
    >
      <ThemeScript rootId={PRODUCT_ROOT_ID} />
      <ThemeControls rootId={PRODUCT_ROOT_ID} />
      <div className="@container relative w-full overflow-x-clip [&_:is(a,summary,button):focus-visible]:outline [&_:is(a,summary,button):focus-visible]:outline-offset-2 [&_:is(a,summary,button):focus-visible]:outline-lp-accent">
        {children}
      </div>
    </div>
  );
}
