"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent, PointerEvent, ReactNode } from "react";

// A <details> that leaves the way it came. Closing it, whether through its <summary> or because
// the mouse has been off it for `delay` ms, first sets `data-closing` so CSS can play the exit
// animations, and only shuts the <details> once they have all finished (at once under reduced
// motion, where there are none). Used by the header's menu and bag, the size chart and the product
// pages' accordions (`closeOnLeave={false}`: inline content should not shut under the reader).
// Opening is still the native <summary> toggle, and without JavaScript it is a plain <details>.
export function HoverDetails({ className, delay = 600, closeOnLeave = true, open, children }: { className?: string; delay?: number; closeOnLeave?: boolean; open?: boolean; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const cancel = () => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
  };

  // Once the way out has started it runs to the end; only the wait before it can be cancelled.
  const close = () => {
    const element = details.current;
    if (!element?.open || element.hasAttribute("data-closing")) return;
    cancel();
    element.setAttribute("data-closing", "");
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)).then(() => {
      element.open = false;
      element.removeAttribute("data-closing");
    });
  };

  const scheduleClose = (event: PointerEvent<HTMLDetailsElement>) => {
    if (!closeOnLeave || event.pointerType !== "mouse" || !details.current?.open) return;
    cancel();
    timer.current = window.setTimeout(close, delay);
  };

  // The summary would shut an open panel at once; play the way out instead.
  const closeFromSummary = (event: MouseEvent<HTMLDetailsElement>) => {
    if (!details.current?.open || !(event.target as Element).closest("summary")) return;
    event.preventDefault();
    close();
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <details ref={details} className={className} open={open} onClick={closeFromSummary} onPointerEnter={cancel} onPointerLeave={scheduleClose}>
      {children}
    </details>
  );
}
