import type { Metadata } from "next";
import type { ReactNode } from "react";
import { display, mono } from "../../components/landing-fonts";
import { BACKROOM_ROOT_ID, ThemeScript } from "../../components/theme-controls";

// The admin (/backroom): orders and products. Its own scroll container (globals.css locks body
// scrolling; the header sticks inside it), the shop's fonts, and the theme: light until the
// visitor picks one, then the site's saved choice (ThemeScript applies it before first paint).
// Never indexed.
export const metadata: Metadata = {
  title: "Backroom · Reé",
  robots: { index: false, follow: false },
};

export default function BackroomLayout({ children }: { children: ReactNode }) {
  return (
    <div
      id={BACKROOM_ROOT_ID}
      data-lp-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${mono.variable} group/theme h-svh overflow-y-auto bg-lp-bg font-lp-mono text-lp-text transition-colors duration-300 motion-reduce:transition-none [&_:is(a,summary,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,summary,button,input,select,textarea):focus-visible]:outline-offset-2 [&_:is(a,summary,button,input,select,textarea):focus-visible]:outline-lp-brand`}
    >
      <ThemeScript rootId={BACKROOM_ROOT_ID} />
      {children}
    </div>
  );
}
