"use client";

import { saveSlide } from "../../app/backroom/catalog-actions";
import type { HeroSlideRow } from "../../lib/supabase";
import { BannerField } from "./banner-field";
import { FormError } from "./form-bits";
import { fieldLabel, input, panel, primaryButton } from "./ui";
import { useBackroomForm } from "./use-backroom-form";

// One hero slide (or a new one): the photograph, where its card leads, its label for screen
// readers, whether it is shown and where it falls in the order.
export function SlideForm({ slide, readOnly = false, saved = false, children }: { slide?: HeroSlideRow; readOnly?: boolean; saved?: boolean; children?: React.ReactNode }) {
  const { state, pending, busy, onSubmit } = useBackroomForm(saveSlide, readOnly);
  return (
    <div className={`${panel} px-5 py-5`}>
      <form onSubmit={onSubmit} encType="multipart/form-data" className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <input type="hidden" name="id" value={slide?.id ?? ""} />
        <fieldset disabled={readOnly} className="min-w-0">
          <BannerField folder="hero" name="image" current={slide?.image ?? null} wide={false} label={slide ? "Photograph" : "New slide's photograph"} hint="Landscape, about 1840 × 1090, with the subject's head in the middle (the frame in the hero's centre shows that part)." />
        </fieldset>
        <fieldset disabled={readOnly} className="min-w-0 space-y-4">
          <label className="block">
            <span className={fieldLabel}>Opens</span>
            <input name="href" defaultValue={slide?.href ?? "/collections"} placeholder="/collections/nogor" className={input} />
          </label>
          <label className="block">
            <span className={fieldLabel}>Label (read out for the link)</span>
            <input name="label" defaultValue={slide?.label} placeholder="Shop Nogor S-1" className={input} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={fieldLabel}>Shown</span>
              <select name="status" defaultValue={slide?.status ?? "published"} className={input}>
                <option value="published">On the hero</option>
                <option value="hidden">Hidden</option>
              </select>
            </label>
            <label className="block">
              <span className={fieldLabel}>Order</span>
              <input name="sort_order" type="number" step={1} defaultValue={slide?.sort_order ?? 100} className={input} />
            </label>
          </div>
          <FormError message={state?.error} />
          {saved && !state?.error && (
            <p role="status" className="text-[12px] text-lp-brand group-data-[lp-theme=dark]/theme:text-lp-accent">
              Saved.
            </p>
          )}
          {!readOnly && (
            <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
              {busy ?? (slide ? "Save slide" : "Add slide")}
            </button>
          )}
        </fieldset>
      </form>
      {children}
    </div>
  );
}
