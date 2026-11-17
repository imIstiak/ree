import "server-only";
import { randomUUID } from "node:crypto";
import { PHOTO_BUCKET, photoPath, photoUrl, supabase, supabaseConfigured, type Photo, type ProductRow } from "./supabase";

// Shared by the backroom's server actions (app/backroom/actions.ts, catalog-actions.ts): reading
// untrusted form fields, and uploading and removing photos in the `ree-products` bucket.

// `email` comes back from a failed sign-in so the form can put it back (React resets it).
export type FormState = { error?: string; notice?: string; email?: string } | undefined;

export const text = (form: FormData, key: string, max = 2000) => String(form.get(key) ?? "").trim().slice(0, max);

export const lines = (form: FormData, key: string) =>
  text(form, key, 6000)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const isUuid = (value: string) => /^[0-9a-f-]{36}$/i.test(value);

export function needsSupabase(): FormState | null {
  return supabaseConfigured() ? null : { error: "Connect Supabase first (SUPABASE_URL and SUPABASE_SECRET_KEY in .env); until then the backroom is read-only." };
}

// ── Photos ───────────────────────────────────────────────────────────────────────────────────
export const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
export const MAX_PHOTO = 8 * 1024 * 1024;

type ProductPhoto = ProductRow["images"][number];

function cleanPhoto(item: unknown): ProductPhoto | null {
  if (!item || typeof item !== "object") return null;
  const { src, alt, position, swatch } = item as Record<string, unknown>;
  if (typeof src !== "string" || !(src.startsWith("https://") || src.startsWith("/"))) return null;
  return {
    src,
    alt: typeof alt === "string" ? alt.trim().slice(0, 200) : "",
    ...(typeof position === "string" && position ? { position: position.slice(0, 20) } : {}),
    ...(typeof swatch === "string" && /^#[0-9a-f]{6}$/i.test(swatch) ? { swatch } : {}),
  };
}

// A JSON list of photos from a hidden field; null when it cannot be read.
export function readPhotos(raw: string): ProductPhoto[] | null {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return null;
    return parsed.slice(0, 20).flatMap((item) => cleanPhoto(item) ?? []);
  } catch {
    return null;
  }
}

// One photo (a banner) from a hidden field: the photo, null for none, or undefined if unreadable.
export function readPhoto(raw: string): Photo | null | undefined {
  if (!raw) return null;
  try {
    const photo = cleanPhoto(JSON.parse(raw));
    return photo ? { src: photo.src, alt: photo.alt, ...(photo.position ? { position: photo.position } : {}) } : undefined;
  } catch {
    return undefined;
  }
}

// The files picked in `key`, checked; an error message when one is not acceptable.
export function pickedFiles(form: FormData, key: string, max: number): File[] | string {
  const files = form.getAll(key).filter((file): file is File => file instanceof File && file.size > 0);
  if (files.length > max) return `Upload at most ${max} photo${max === 1 ? "" : "s"} at a time.`;
  for (const file of files) {
    if (!IMAGE_TYPES[file.type]) return `${file.name} isn't a JPEG, PNG, WebP or AVIF photo.`;
    if (file.size > MAX_PHOTO) return `${file.name} is over 8 MB; please make it smaller.`;
  }
  return files;
}

// Uploads into `<folder>/<uuid>.<ext>`; on a failure removes what it already uploaded and throws.
export async function uploadPhotos(files: File[], folder: string, alt: string): Promise<Photo[]> {
  const uploaded: Photo[] = [];
  for (const file of files) {
    const path = `${folder}/${randomUUID()}.${IMAGE_TYPES[file.type]}`;
    const { error } = await supabase().storage.from(PHOTO_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) {
      await removePhotos(uploaded.map((photo) => photo.src));
      throw new Error(`Could not upload ${file.name}: ${error.message}`);
    }
    uploaded.push({ src: photoUrl(path), alt });
  }
  return uploaded;
}

// Deletes the given photos from storage, only the ones this site uploaded.
export async function removePhotos(srcs: (string | undefined)[]) {
  const paths = srcs.map((src) => (src ? photoPath(src) : null)).filter((path): path is string => Boolean(path));
  if (paths.length) await supabase().storage.from(PHOTO_BUCKET).remove(paths);
}

// A banner field (banner-field.tsx): the kept photo as JSON in `<key>`, a replacement file in
// `<key>_file`, and `<key>_alt`. Returns the banner to store (or null), the photo it replaces (to
// delete after the save), and an error when something is wrong.
export async function readBanner(form: FormData, key: string, folder: string, fallbackAlt: string, previous: Photo | null) {
  const kept = readPhoto(text(form, key, 2000));
  if (kept === undefined) return { error: "The banner could not be read; reload the page and try again." } as const;
  const files = pickedFiles(form, `${key}_file`, 1);
  if (typeof files === "string") return { error: files } as const;
  const alt = text(form, `${key}_alt`, 200) || fallbackAlt;
  let banner: Photo | null = kept ? { ...kept, alt } : null;
  let uploaded: Photo | null = null;
  if (files.length) {
    [uploaded] = await uploadPhotos(files, folder, alt);
    banner = uploaded;
  }
  const replaced = previous && previous.src !== banner?.src ? previous : null;
  return { banner, uploaded, replaced } as const;
}
