"use client";

import Image from "next/image";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { saveProduct } from "../../app/backroom/actions";
import type { CollectionOption } from "../../lib/backroom-data";
import type { ProductRow } from "../../lib/supabase";
import { Icon } from "../landing-icons";
import { CardPreview } from "./card-preview";
import { SwatchPicker } from "./swatch-picker";
import { fieldLabel, input, panel, primaryButton, quietButton } from "./ui";

type Photo = ProductRow["images"][number];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const splitSizes = (value: string) => [...new Set(value.split(/[,\s]+/).map((size) => size.trim()).filter(Boolean))];

// Create or edit a product. Every field is held in state and the form is submitted through a
// transition (not the form's `action`), so a validation error from the server leaves the edits in
// place instead of resetting the form. The saved product's page reloads with fresh data
// (saveProduct redirects, and the page keys this form on updated_at).
export function ProductForm({ product, categories, collections, readOnly = false }: { product?: ProductRow; categories: string[]; collections: CollectionOption[]; readOnly?: boolean }) {
  const [state, formAction, pending] = useActionState(saveProduct, undefined);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [sizesText, setSizesText] = useState(product?.sizes.join(", ") ?? "S, M, L, XL");
  const [stock, setStock] = useState<Record<string, string>>(() => Object.fromEntries(Object.entries(product?.stock ?? {}).map(([size, count]) => [size, String(count)])));
  const [photos, setPhotos] = useState<Photo[]>(product?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [collectionId, setCollectionId] = useState(product?.collection_id ?? "");
  const [seasonId, setSeasonId] = useState(product?.season_id ?? "");
  const seasons = collections.find((collection) => collection.id === collectionId)?.seasons ?? [];
  const fileInput = useRef<HTMLInputElement>(null);
  const sizes = splitSizes(sizesText);
  const address = product ? product.slug : slugTouched ? slugify(slug) : slugify(name);

  // Previews of the photos picked but not uploaded yet.
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  function syncFileInput(next: File[]) {
    setFiles(next);
    if (!fileInput.current) return;
    const transfer = new DataTransfer();
    next.forEach((file) => transfer.items.add(file));
    fileInput.current.files = transfer.files;
  }

  function move(index: number, by: number) {
    setPhotos((current) => {
      const next = [...current];
      const [photo] = next.splice(index, 1);
      next.splice(Math.max(0, Math.min(next.length, index + by)), 0, photo);
      return next;
    });
  }

  function edit(index: number, change: Partial<Photo>) {
    setPhotos((current) => current.map((photo, i) => (i === index ? { ...photo, ...change } : photo)));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly || pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={submit} encType="multipart/form-data" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="images" value={JSON.stringify(photos)} />

      <fieldset disabled={readOnly} className="min-w-0 space-y-6">
        <section aria-labelledby="basics" className={`${panel} space-y-5 px-6 py-6`}>
          <h2 id="basics" className="font-lp-display text-lg uppercase">
            The piece
          </h2>
          <label className="block">
            <span className={fieldLabel}>Name</span>
            <input name="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Heavy cotton tee" className={input} />
          </label>
          <label className="block">
            <span className={fieldLabel}>Web address</span>
            {product ? (
              <span className="mt-1.5 block text-[13px]">
                /products/<strong className="font-medium">{product.slug}</strong>
                <span className="ml-2 text-[11px] text-lp-muted">(fixed once created, so links and bags keep working)</span>
              </span>
            ) : (
              <>
                <input
                  name="slug"
                  value={slugTouched ? slug : address}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(event.target.value);
                  }}
                  placeholder="heavy-cotton-tee"
                  className={input}
                />
                <span className="mt-1 block text-[11px] text-lp-muted">/products/{address || "…"} · can&apos;t be changed later</span>
              </>
            )}
          </label>
          <label className="block">
            <span className={fieldLabel}>Tagline</span>
            <input name="tagline" defaultValue={product?.tagline} placeholder="One line under the name" className={input} />
          </label>
          <label className="block">
            <span className={fieldLabel}>Description</span>
            <textarea name="description" defaultValue={product?.description} rows={5} className={input} />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={fieldLabel}>Details · one per line</span>
              <textarea name="details" defaultValue={product?.details.join("\n")} rows={5} placeholder={"240 gsm cotton jersey\nDropped shoulder"} className={input} />
            </label>
            <label className="block">
              <span className={fieldLabel}>Care · one per line</span>
              <textarea name="care" defaultValue={product?.care.join("\n")} rows={5} placeholder={"Cold wash inside out\nDry in the shade"} className={input} />
            </label>
          </div>
        </section>

        <section aria-labelledby="photos" className={`${panel} px-6 py-6`}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="photos" className="font-lp-display text-lg uppercase">
              Photos
            </h2>
            <p className="text-[11px] text-lp-muted">The first is the cover. JPEG, PNG, WebP or AVIF, up to 8 MB each.</p>
          </div>

          {photos.length === 0 && files.length === 0 && <p className="mt-4 text-[12px] text-lp-muted">No photos yet. A published product needs at least one.</p>}

          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {photos.map((photo, index) => (
              <li key={photo.src} className="lp-patch flex gap-3 bg-lp-bg p-2.5 [--lp-stitch-inset:3px]">
                <span className="relative aspect-[4/5] w-24 flex-none overflow-hidden bg-lp-surface">
                  <Image src={photo.src} alt="" fill sizes="96px" className="object-cover" style={{ objectPosition: photo.position }} />
                  {index === 0 && <span className="absolute top-1 left-1 bg-lp-brand px-1.5 py-0.5 text-[9px] tracking-[.1em] text-lp-brand-base uppercase">Cover</span>}
                </span>
                <span className="min-w-0 flex-1 space-y-2">
                  <label className="block">
                    <span className={fieldLabel}>Description for screen readers</span>
                    <input value={photo.alt} onChange={(event) => edit(index, { alt: event.target.value })} className={`${input} py-1.5 text-[12px]`} />
                  </label>
                  <span className="flex gap-1.5">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move earlier" className="grid size-8 cursor-pointer place-items-center border border-lp-border disabled:opacity-30">
                      <Icon name="arrowLeft" />
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === photos.length - 1} aria-label="Move later" className="grid size-8 cursor-pointer place-items-center border border-lp-border disabled:opacity-30">
                      <Icon name="arrowRight" />
                    </button>
                    <button type="button" onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))} aria-label="Remove photo" className="ml-auto grid size-8 cursor-pointer place-items-center border border-lp-border hover:bg-lp-patch-madder hover:text-lp-canvas">
                      <Icon name="x" />
                    </button>
                  </span>
                </span>
              </li>
            ))}
            {previews.map((preview, index) => (
              <li key={preview.url} className="lp-patch flex gap-3 bg-lp-accent/25 p-2.5 [--lp-stitch-inset:3px]">
                {/* A local preview (object URL), so a plain img: next/image cannot optimise it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt="" className="aspect-[4/5] w-24 flex-none object-cover" />
                <span className="min-w-0 flex-1 text-[12px]">
                  <span className="block truncate">{preview.file.name}</span>
                  <span className="block text-[11px] text-lp-muted">Uploads when you save · {(preview.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  <button type="button" onClick={() => syncFileInput(files.filter((_, i) => i !== index))} className="mt-2 cursor-pointer text-[11px] underline underline-offset-2">
                    Don&apos;t upload
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <label className={`${quietButton} mt-5`}>
            <Icon name="plus" /> Add photos
            <input
              ref={fileInput}
              type="file"
              name="photos"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => syncFileInput([...files, ...Array.from(event.target.files ?? [])].slice(0, 8))}
              className="sr-only"
            />
          </label>
        </section>
      </fieldset>

      <fieldset disabled={readOnly} className="min-w-0 space-y-6 xl:sticky xl:top-8">
        <section aria-labelledby="selling" className={`${panel} space-y-5 px-6 py-6`}>
          <h2 id="selling" className="font-lp-display text-lg uppercase">
            On the shop
          </h2>
          <label className="block">
            <span className={fieldLabel}>Status</span>
            <select name="status" defaultValue={product?.status ?? "draft"} className={input}>
              <option value="draft">Draft · hidden while you work on it</option>
              <option value="published">Published · on the shop</option>
              <option value="archived">Archived · hidden, kept for the record</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={fieldLabel}>Price (৳)</span>
              <input name="price" type="number" min={0} step={1} required defaultValue={product?.price} className={input} />
            </label>
            <label className="block">
              <span className={fieldLabel}>Old price (৳)</span>
              <input name="was_price" type="number" min={0} step={1} defaultValue={product?.was_price ?? ""} placeholder="Optional" className={input} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={fieldLabel}>Category</span>
              <select name="category" defaultValue={product?.category ?? categories[0]} className={input}>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={fieldLabel}>Cut for</span>
              <select name="department" defaultValue={product?.department ?? "unisex"} className={input}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="unisex">Unisex</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={fieldLabel}>Collection</span>
              <select
                name="collection_id"
                value={collectionId}
                onChange={(event) => {
                  setCollectionId(event.target.value);
                  setSeasonId("");
                }}
                className={input}
              >
                <option value="">None</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={fieldLabel}>Season</span>
              <select name="season_id" value={seasonId} onChange={(event) => setSeasonId(event.target.value)} disabled={seasons.length === 0} className={input}>
                <option value="">{collectionId ? (seasons.length ? "No season" : "No seasons yet") : "Pick a collection"}</option>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={fieldLabel}>Colour</span>
              <input name="colour" defaultValue={product?.colour} placeholder="Cream" className={input} />
            </label>
            <label className="block">
              <span className={fieldLabel}>Order on the shop</span>
              <input name="sort_order" type="number" step={1} defaultValue={product?.sort_order ?? 0} className={input} />
            </label>
          </div>
        </section>

        <section aria-labelledby="card-colour" className={`${panel} space-y-4 px-6 py-6`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="card-colour" className="font-lp-display text-lg uppercase">
                Card colour
              </h2>
              <p className="mt-1 text-[11px] text-lp-muted">The cloth the product&apos;s card is cut from on the shop. Click the cover photo to take a colour from it.</p>
            </div>
            <CardPreview colour={photos[0]?.swatch} label={name || "Product"} />
          </div>
          <SwatchPicker
            src={photos[0]?.src ?? previews[0]?.url}
            value={photos[0]?.swatch}
            onChange={(swatch) => (photos.length ? edit(0, { swatch }) : undefined)}
            autoLabel={photos.length ? "Automatic (the shop's palette)" : "Save a photo first"}
          />
        </section>

        <section aria-labelledby="stock" className={`${panel} space-y-4 px-6 py-6`}>
          <h2 id="stock" className="font-lp-display text-lg uppercase">
            Sizes &amp; stock
          </h2>
          <label className="block">
            <span className={fieldLabel}>Sizes · separated by commas</span>
            <input name="sizes" value={sizesText} onChange={(event) => setSizesText(event.target.value)} placeholder="S, M, L, XL" className={input} />
          </label>
          {sizes.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <label key={size} className="block">
                  <span className={fieldLabel}>{size}</span>
                  <input
                    name={`stock:${size}`}
                    type="number"
                    min={0}
                    step={1}
                    value={stock[size] ?? ""}
                    onChange={(event) => setStock((current) => ({ ...current, [size]: event.target.value }))}
                    placeholder="—"
                    className={input}
                  />
                </label>
              ))}
            </div>
          )}
          <p className="text-[11px] leading-relaxed text-lp-muted">Pieces left per size. Leave a box empty not to track that size; 0 shows it as sold out. Orders take stock off; cancelling one puts it back.</p>
        </section>

        {state?.error && (
          <p role="alert" className="lp-patch bg-lp-patch-madder/12 px-4 py-3 text-[12px] text-lp-value-delivery [--lp-stitch-inset:3px]">
            {state.error}
          </p>
        )}
        {!readOnly && (
          <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
            {pending ? (files.length ? "Uploading and saving…" : "Saving…") : product ? "Save changes" : "Create product"}
          </button>
        )}
      </fieldset>
    </form>
  );
}
