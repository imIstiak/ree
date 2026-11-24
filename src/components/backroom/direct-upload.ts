import { startPhotoUpload } from "../../app/backroom/upload-actions";

// The backroom's photo uploads, done in the browser before a form is saved. Every file input with
// `data-upload-folder` (and `data-upload-as`, the field the save action reads) has its picked files
// shrunk, sent straight to the photo bucket through a signed address (upload-actions.ts), and
// replaced in the form data by their public addresses. The save request then carries only text,
// so Vercel's 4.5 MB request limit and the bucket's 8 MB file limit stop mattering for camera
// photos. `{slug}` in the folder is the form's web address. If the save then fails, the action
// deletes what was sent (cleaningUploads), and the next save uploads afresh.

const LONGEST_SIDE = 2560;
const SMALL_ENOUGH = 1_500_000;

// A photo redrawn with its longest side at most 2560 px, as WebP (JPEG where the browser cannot
// write WebP). One that is already small, or that this browser cannot decode, is sent as it is.
export async function shrinkPhoto(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }
  const scale = Math.min(1, LONGEST_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= SMALL_ENOUGH) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  let blob = await encode("image/webp");
  // Older Safari hands back a PNG when asked for WebP.
  if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg");
  return blob && blob.size < file.size ? blob : file;
}

async function sendPhoto(file: File, folder: string) {
  const photo = await shrinkPhoto(file);
  const ticket = await startPhotoUpload(folder, photo.type, photo.size, file.name);
  if ("error" in ticket) throw new Error(ticket.error);
  let response: Response;
  try {
    response = await fetch(ticket.url, {
      method: "PUT",
      headers: { "content-type": photo.type, "cache-control": "max-age=31536000", "x-upsert": "false" },
      body: photo,
    });
  } catch {
    throw new Error(`Could not upload ${file.name}; check the connection and try again.`);
  }
  if (!response.ok) throw new Error(`Could not upload ${file.name} (the photo store answered ${response.status}).`);
  return ticket.src;
}

// Uploads the form's picked photos and swaps them in `data` for their addresses. `onProgress` is
// told "1 of 3" and so on. Throws a readable message when a photo cannot be sent.
export async function uploadPickedPhotos(form: HTMLFormElement, data: FormData, onProgress?: (label: string) => void) {
  const slug = String(data.get("slug") ?? "");
  const fields = [...form.querySelectorAll<HTMLInputElement>('input[type="file"][data-upload-folder][data-upload-as]')];
  const jobs = fields.flatMap((field) => {
    const files = data.getAll(field.name).filter((value): value is File => value instanceof File && value.size > 0);
    data.delete(field.name);
    const folder = (field.dataset.uploadFolder ?? "").replace("{slug}", slug);
    return files.map((file) => ({ file, folder, as: field.dataset.uploadAs! }));
  });
  for (const [index, job] of jobs.entries()) {
    onProgress?.(jobs.length > 1 ? `${index + 1} of ${jobs.length}` : "");
    data.append(job.as, await sendPhoto(job.file, job.folder));
  }
  return jobs.length;
}
