"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "../../lib/supabase";
import { Icon } from "../landing-icons";
import { fieldLabel, input, quietButton } from "./ui";

// One photograph for a collection's or season's banner, or a hero slide: the kept photo travels as
// JSON in `name`, its description in `<name>_alt`, and a replacement picked in `<name>_file` is
// uploaded by the browser when the form is saved (direct-upload.ts, into `folder`) and arrives as
// its address in `<name>_uploaded` (readBanner in lib/backroom-forms.ts reads them).
export function BannerField({
  name,
  current,
  label,
  hint,
  wide = true,
  folder,
  onPhoto,
}: {
  name: string;
  // Where in the photo bucket a new photo goes; `{slug}` is the form's web address.
  folder: string;
  current: Photo | null;
  label: string;
  hint: string;
  wide?: boolean;
  // Told the photo now shown (a new file's preview, the kept photo, or null), e.g. for the card
  // colour picker.
  onPhoto?: (src: string | null) => void;
}) {
  const [kept, setKept] = useState<Photo | null>(current);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState(current?.alt ?? "");
  // The stored photo that has finished loading; until it has, the frame says so (the image
  // optimiser can take seconds over a photo it has not seen yet, and an empty frame read as a
  // failed upload).
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function clear() {
    setKept(null);
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  const shown = preview ?? kept?.src;
  useEffect(() => {
    onPhoto?.(shown ?? null);
  }, [shown, onPhoto]);
  return (
    <div>
      <span className={fieldLabel}>{label}</span>
      <input type="hidden" name={name} value={kept ? JSON.stringify(kept) : ""} />
      <div className={`relative mt-1.5 overflow-hidden border border-dashed border-lp-border bg-lp-surface ${wide ? "aspect-[21/8]" : "aspect-[1840/1090]"}`}>
        {shown ? (
          preview ? (
            // A local preview (object URL), so a plain img: next/image cannot optimise it.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <>
              <Image src={shown} alt="" fill sizes="(min-width: 1280px) 50vw, 90vw" className="object-cover" style={{ objectPosition: kept?.position }} onLoad={() => setLoadedSrc(shown)} />
              {loadedSrc !== shown && (
                <span aria-live="polite" className="absolute inset-0 grid place-items-center text-[11px] tracking-[.1em] text-lp-muted uppercase motion-safe:animate-pulse">
                  Loading photo…
                </span>
              )}
            </>
          )
        ) : (
          <span className="grid size-full place-items-center px-4 text-center text-[11px] text-lp-muted">No photo yet</span>
        )}
        {file && <span className="absolute top-2 left-2 bg-lp-accent px-2 py-1 text-[9px] tracking-[.1em] text-lp-ink uppercase">Uploads when you save</span>}
      </div>
      <p className="mt-1.5 text-[11px] text-lp-muted">{hint}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className={quietButton}>
          <Icon name="plus" /> {shown ? "Replace photo" : "Choose photo"}
          <input
            ref={fileInput}
            type="file"
            name={`${name}_file`}
            data-upload-folder={folder}
            data-upload-as={`${name}_uploaded`}
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="sr-only"
          />
        </label>
        {shown && (
          <button type="button" onClick={clear} className="cursor-pointer text-[11px] underline underline-offset-4">
            Remove photo
          </button>
        )}
      </div>
      <label className="mt-3 block">
        <span className={fieldLabel}>Description for screen readers</span>
        <input name={`${name}_alt`} value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="What the photo shows" className={input} />
      </label>
    </div>
  );
}
