"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

// Deleting is two presses: the first asks, the second deletes. Archiving is usually the better
// choice, so the question says so.
export function DeleteButton({ name, what = "its uploaded photos" }: { name: string; what?: string }) {
  const [asking, setAsking] = useState(false);
  const { pending } = useFormStatus();
  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className="cursor-pointer text-[11px] tracking-[.1em] text-lp-value-delivery uppercase underline-offset-4 hover:underline">
        Delete…
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3 text-[12px]">
      <span>
        Delete <strong className="font-medium">{name}</strong> and {what} for good? Archiving hides it and keeps it.
      </span>
      <button type="submit" disabled={pending} className="lp-patch cursor-pointer bg-lp-patch-madder px-4 py-2 text-[11px] tracking-[.1em] text-lp-canvas uppercase [--lp-stitch-inset:3px] disabled:opacity-60">
        {pending ? "Deleting…" : "Yes, delete"}
      </button>
      <button type="button" onClick={() => setAsking(false)} className="cursor-pointer text-[11px] underline underline-offset-4">
        Keep it
      </button>
    </div>
  );
}
