"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "../landing-icons";
import { primaryButton } from "./ui";

// An "add" button that opens its form in a window (the user asked for new slides, products and
// collections to open as a modal from a button, instead of a form left open on the page). The
// window comes in like every other dropdown and modal (.ree-pop in globals.css: from beyond the
// right edge, leaning) and leaves the same way: Escape or the close button marks it closing, the
// exit animations finish, then it closes. The form is mounted on first opening and kept, so closing
// by accident loses nothing; a successful save redirects, and the page re-keys or leaves this.
export function CreateModal({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [used, setUsed] = useState(false);
  const titleId = useId();

  function open() {
    setUsed(true);
    const node = dialog.current;
    node?.removeAttribute("data-closing");
    node?.showModal();
  }

  function close() {
    const node = dialog.current;
    if (!node?.open || node.hasAttribute("data-closing")) return;
    node.setAttribute("data-closing", "");
    // Only the exit animations: an endless one (a loading pulse inside) would never finish.
    const exits = node.getAnimations({ subtree: true }).filter((animation) => animation.effect?.getComputedTiming().endTime !== Infinity);
    Promise.allSettled(exits.map((animation) => animation.finished)).then(() => {
      node.close();
      node.removeAttribute("data-closing");
    });
  }

  return (
    <>
      <button type="button" onClick={open} className={primaryButton}>
        <Icon name="plus" /> {label}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        className="ree-modal m-auto h-fit max-h-[calc(100dvh-2rem)] w-[min(1200px,calc(100vw-2rem))] max-w-none overflow-visible bg-transparent p-0 text-lp-text backdrop:bg-black/55"
      >
        <div className="ree-pop lp-patch max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-lp-bg px-4 pt-5 pb-6 shadow-[0_24px_60px_rgb(0_0_0/.35)] [--lp-stitch-inset:7px] [--pop-from:120%] [--pop-lean:5deg] [--pop-tilt:0deg] sm:px-6">
          <header className="mb-5 flex items-center justify-between gap-4">
            <h2 id={titleId} className="font-lp-display text-[clamp(1.4rem,2.6vw,2rem)] leading-none uppercase">
              {title}
            </h2>
            <button type="button" onClick={close} aria-label="Close" className="lp-patch grid size-10 flex-none cursor-pointer place-items-center bg-lp-card [--lp-stitch-inset:3px] hover:bg-lp-accent hover:text-lp-ink">
              <Icon name="x" />
            </button>
          </header>
          {used && children}
        </div>
      </dialog>
    </>
  );
}
