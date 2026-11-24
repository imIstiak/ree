"use client";

import { useState } from "react";
import { fieldLabel, input } from "./ui";

// The same rule as the server's slugify (lib/backroom-forms.ts), for the preview under the field.
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// A product's, collection's or season's web address. A new one follows `suggested` (its name, or
// the season's number) until something is typed; a saved one starts at its current slug and can be
// changed at any time: the database keeps the old one (previous_slugs), so old links redirect to the
// new address and bags saved under it still find the piece. Empty falls back to `suggested`, as the
// server does.
export function SlugField({ prefix, current, suggested, placeholder }: { prefix: string; current?: string; suggested: string; placeholder?: string }) {
  const [typed, setTyped] = useState<string | null>(null);
  const value = typed ?? current ?? slugify(suggested);
  const address = slugify(value) || slugify(suggested);
  const moved = Boolean(current && address && address !== current);
  return (
    <label className="block">
      <span className={fieldLabel}>Web address</span>
      <input name="slug" value={value} onChange={(event) => setTyped(event.target.value)} placeholder={placeholder} spellCheck={false} autoCapitalize="none" className={input} />
      <span className="mt-1 block text-[11px] break-all text-lp-muted">
        {prefix}
        <strong className="font-medium text-lp-text">{address || "…"}</strong>
        {moved && <> · the old address, {prefix + current}, will lead here</>}
      </span>
    </label>
  );
}
