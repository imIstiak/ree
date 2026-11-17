"use client";

import Image from "next/image";
import { useState } from "react";
import { saveSeason } from "../../app/backroom/catalog-actions";
import type { SeasonRow } from "../../lib/supabase";
import { BannerField } from "./banner-field";
import { FormError, StatusSelect } from "./form-bits";
import { fieldLabel, input, panel, primaryButton } from "./ui";
import { useBackroomForm } from "./use-backroom-form";

export type SeasonProduct = { id: string; name: string; image?: string; status: string; where: "this" | "collection" | "elsewhere"; note: string };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// A season of a collection: its number and title, address, copy, banner, dates, status, and the
// products in it (ticked). Ticking a product that is elsewhere moves it into this season.
export function SeasonForm({
  collectionId,
  collectionName,
  collectionSlug,
  season,
  nextNumber,
  products,
  readOnly = false,
}: {
  collectionId: string;
  collectionName: string;
  collectionSlug: string;
  season?: SeasonRow;
  nextNumber: number;
  products: SeasonProduct[];
  readOnly?: boolean;
}) {
  const { state, pending, onSubmit } = useBackroomForm(saveSeason, readOnly);
  const [number, setNumber] = useState(String(season?.number ?? nextNumber));
  const [slug, setSlug] = useState<string | null>(null);
  const address = season ? season.slug : slugify(slug ?? `s-${number}`);
  const groups = [
    { key: "this", title: "In this season" },
    { key: "collection", title: `In ${collectionName}, no season yet` },
    { key: "elsewhere", title: "Elsewhere (ticking one moves it here)" },
  ] as const;

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <input type="hidden" name="id" value={season?.id ?? ""} />
      <input type="hidden" name="collection_id" value={collectionId} />

      <div className="min-w-0 space-y-6">
        <fieldset disabled={readOnly} className={`${panel} space-y-5 px-6 py-6`}>
          <div className="grid gap-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <label className="block">
              <span className={fieldLabel}>Season number</span>
              <input name="number" type="number" min={1} step={1} required value={number} onChange={(event) => setNumber(event.target.value)} className={input} />
            </label>
            <label className="block">
              <span className={fieldLabel}>Title (optional)</span>
              <input name="name" defaultValue={season?.name} placeholder="Dhaka" className={input} />
            </label>
          </div>
          <label className="block">
            <span className={fieldLabel}>Web address</span>
            {season ? (
              <span className="mt-1.5 block text-[13px]">
                /collections/{collectionSlug}/<strong className="font-medium">{season.slug}</strong>
                <span className="ml-2 text-[11px] text-lp-muted">(fixed once created)</span>
              </span>
            ) : (
              <>
                <input name="slug" value={slug ?? address} onChange={(event) => setSlug(event.target.value)} className={input} />
                <span className="mt-1 block text-[11px] text-lp-muted">
                  /collections/{collectionSlug}/{address || "…"} · can&apos;t be changed later
                </span>
              </>
            )}
          </label>
          <label className="block">
            <span className={fieldLabel}>Tagline</span>
            <input name="tagline" defaultValue={season?.tagline} placeholder="Old Dhaka, worn close." className={input} />
          </label>
          <label className="block">
            <span className={fieldLabel}>About the season</span>
            <textarea name="blurb" defaultValue={season?.blurb} rows={4} className={input} />
          </label>
          <BannerField name="banner" current={season?.banner ?? null} label="Banner" hint="A wide photograph across the top of the season's page (about 21 : 8). Optional." />
        </fieldset>

        <fieldset disabled={readOnly} className={`${panel} px-6 py-6`}>
          <legend className="float-left w-full font-lp-display text-lg uppercase">Products</legend>
          <p className="clear-both pt-1 text-[11px] text-lp-muted">Tick the pieces in this season. Unticking one leaves it in {collectionName}, without a season.</p>
          {groups.map((group) => {
            const list = products.filter((product) => product.where === group.key);
            if (list.length === 0) return null;
            return (
              <div key={group.key} className="mt-5">
                <p className={fieldLabel}>{group.title}</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {list.map((product) => (
                    <li key={product.id}>
                      <label className="lp-patch flex cursor-pointer items-center gap-3 bg-lp-bg p-2 [--lp-stitch-inset:3px] has-checked:bg-lp-brand/12">
                        <input type="checkbox" name="product" value={product.id} defaultChecked={product.where === "this"} className="size-4 accent-[#00664f]" />
                        <span className="relative aspect-[4/5] w-9 flex-none overflow-hidden bg-lp-surface">
                          {product.image && <Image src={product.image} alt="" fill sizes="36px" className="object-cover" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[12px]">{product.name}</span>
                          <span className="block truncate text-[10px] text-lp-muted">
                            {product.note}
                            {product.status !== "published" && ` · ${product.status}`}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </fieldset>
      </div>

      <fieldset disabled={readOnly} className="min-w-0 space-y-6 xl:sticky xl:top-28">
        <div className={`${panel} space-y-5 px-6 py-6`}>
          <StatusSelect value={season?.status ?? "draft"} noun="season" />
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={fieldLabel}>Starts</span>
              <input name="starts_on" type="date" defaultValue={season?.starts_on ?? ""} className={input} />
            </label>
            <label className="block">
              <span className={fieldLabel}>Ends</span>
              <input name="ends_on" type="date" defaultValue={season?.ends_on ?? ""} className={input} />
            </label>
          </div>
          <p className="text-[11px] text-lp-muted">Dates are shown on the season&apos;s page; they don&apos;t hide or show it. Use the status for that.</p>
        </div>
        <FormError message={state?.error} />
        {!readOnly && (
          <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
            {pending ? "Saving…" : season ? "Save season" : "Create season"}
          </button>
        )}
      </fieldset>
    </form>
  );
}
