import { ViewTransition, type ReactNode } from "react";

// Page to page, the new page is laid over the old one like a fresh length of cloth: the old page
// settles back and dims while the new one rises from the bottom edge, cut along its leading edge with
// pinking shears (a zigzag), a soft shadow under the cut (the user asked for beautiful page
// transitions). Next's navigations are React transitions, so this <ViewTransition> runs on every
// route change; the motion is the `.ree-page-in` / `.ree-page-out` rules in globals.css.
//
// It is rendered by app/template.tsx (a new top-level page) and by the templates in products/,
// collections/ and legal/ (a new slug under the same section): a template only remounts when its
// own segment changes, and enter / exit only fire on a remount. `default="none"` keeps it still for
// everything else, the silk theme change included.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="ree-page-in" exit="ree-page-out" default="none">
      {children}
    </ViewTransition>
  );
}
