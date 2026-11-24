"use client";

import { useCallback, useState } from "react";
import { saveCollection } from "../../app/backroom/catalog-actions";
import type { CollectionRow } from "../../lib/supabase";
import { BannerField } from "./banner-field";
import { CardPreview } from "./card-preview";
import { SlugField } from "./slug-field";
import { SwatchPicker } from "./swatch-picker";
import { FormError, StatusSelect } from "./form-bits";
import { fieldLabel, input, panel, primaryButton } from "./ui";
import { useBackroomForm } from "./use-backroom-form";

// A collection: its name, address, copy, banner, its card's colour on /collections (picked from the
// banner, or from its first piece's photo) and whether it is on the shop.
export function CollectionForm({ collection, pieceCover, readOnly = false }: { collection?: CollectionRow; pieceCover?: string; readOnly?: boolean }) {
  const { state, pending, busy, onSubmit } = useBackroomForm(saveCollection, readOnly);
  const [name, setName] = useState(collection?.name ?? "");
  const [cardColor, setCardColor] = useState<string | undefined>(collection?.card_color ?? undefined);
  const [bannerSrc, setBannerSrc] = useState<string | null>(collection?.banner?.src ?? null);
  const onBanner = useCallback((src: string | null) => setBannerSrc(src), []);

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <input type="hidden" name="id" value={collection?.id ?? ""} />
      <fieldset disabled={readOnly} className={`${panel} min-w-0 space-y-5 px-6 py-6`}>
        <label className="block">
          <span className={fieldLabel}>Name</span>
          <input name="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nogor" className={input} />
        </label>
        <SlugField prefix="/collections/" current={collection?.slug} suggested={name} placeholder="nogor" />
        <label className="block">
          <span className={fieldLabel}>Tagline</span>
          <input name="tagline" defaultValue={collection?.tagline} placeholder="The city, worn close." className={input} />
        </label>
        <label className="block">
          <span className={fieldLabel}>About the collection</span>
          <textarea name="blurb" defaultValue={collection?.blurb} rows={4} className={input} />
        </label>
        <BannerField
          name="banner"
          folder="collections/{slug}"
          current={collection?.banner ?? null}
          onPhoto={onBanner}
          label="Banner"
          hint="A wide photograph across the top of the collection's page (about 21 : 8; phones crop it to 4 : 3). Optional."
        />
      </fieldset>

      <fieldset disabled={readOnly} className="min-w-0 space-y-6 xl:sticky xl:top-28">
        <div className={`${panel} space-y-5 px-6 py-6`}>
          <StatusSelect value={collection?.status ?? "draft"} noun="collection" />
          <label className="block">
            <span className={fieldLabel}>Order on the shop</span>
            <input name="sort_order" type="number" step={1} defaultValue={collection?.sort_order ?? 0} className={input} />
          </label>
        </div>
        <div className={`${panel} space-y-4 px-6 py-6`}>
          <input type="hidden" name="card_color" value={cardColor ?? ""} />
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={fieldLabel}>Card colour</span>
              <p className="mt-1 text-[11px] text-lp-muted">The cloth of this collection&apos;s card on /collections. Click the {bannerSrc ? "banner" : "photo"} to take a colour from it.</p>
            </div>
            <CardPreview colour={cardColor} label={name || "Collection"} />
          </div>
          <SwatchPicker src={bannerSrc ?? pieceCover} value={cardColor} onChange={setCardColor} autoLabel={bannerSrc ? "Automatic (palette)" : "Automatic (the first piece's colour)"} />
        </div>
        <FormError message={state?.error} />
        {!readOnly && (
          <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
            {busy ?? (collection ? "Save collection" : "Create collection")}
          </button>
        )}
      </fieldset>
    </form>
  );
}
