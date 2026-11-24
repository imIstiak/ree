"use server";

import { randomUUID } from "node:crypto";
import { IMAGE_TYPES, MAX_PHOTO, needsSupabase, slugify } from "../../lib/backroom-forms";
import { requireAdmin } from "../../lib/backroom-session";
import { PHOTO_BUCKET, photoUrl, supabase } from "../../lib/supabase";

// Photos go from the browser straight into the `ree-products` bucket (direct-upload.ts), not
// through a server action: Vercel refuses a request body over 4.5 MB, which a single camera photo
// can pass. This hands the browser a one-time signed upload address for a fresh path; the save
// action then receives only the photo's public address. Admin only, like every backroom action.
export type UploadTicket = { url: string; src: string } | { error: string };

export async function startPhotoUpload(folder: string, type: string, size: number, fileName: string): Promise<UploadTicket> {
  await requireAdmin();
  const missing = needsSupabase();
  if (missing?.error) return { error: missing.error };
  const name = String(fileName).slice(0, 120) || "The photo";
  const extension = IMAGE_TYPES[type];
  if (!extension) return { error: `${name} isn't a JPEG, PNG, WebP or AVIF photo.` };
  if (!(Number(size) > 0) || Number(size) > MAX_PHOTO) return { error: `${name} is over 8 MB even after shrinking; please make it smaller.` };
  const place = String(folder).split("/").map(slugify).filter(Boolean).slice(0, 3).join("/") || "uploads";
  const path = `${place}/${randomUUID()}.${extension}`;
  const { data, error } = await supabase().storage.from(PHOTO_BUCKET).createSignedUploadUrl(path);
  if (error) return { error: `Could not start the upload: ${error.message}` };
  return { url: data.signedUrl, src: photoUrl(path) };
}
