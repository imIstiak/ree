"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCollectionSummary, getSeasonRow } from "../../lib/backroom-data";
import { cleaningUploads, isUuid, needsSupabase, readBanner, removePhotos, repointSlides, slugify, text, type FormState } from "../../lib/backroom-forms";
import { requireAdmin } from "../../lib/backroom-session";
import { supabase, supabaseConfigured, type HeroSlideRow } from "../../lib/supabase";

// The backroom's actions for collections, their seasons and the landing hero's slides. Public POST
// endpoints like every server action: each checks the session and treats the form as untrusted.
// Saves revalidate the whole site, so the shop's static pages are rebuilt.

const STATUSES = ["draft", "published", "archived"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function done(path: string): never {
  revalidatePath("/", "layout");
  redirect(path);
}

// ── Collections ──────────────────────────────────────────────────────────────────────────────
export async function saveCollection(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return cleaningUploads(form, ["banner_uploaded"], () => writeCollection(form));
}

async function writeCollection(form: FormData): Promise<FormState> {
  await requireAdmin();
  const missing = needsSupabase();
  if (missing) return missing;

  const id = text(form, "id", 40);
  const existing = id ? await getCollectionSummary(id) : null;
  if (id && !existing) return { error: "This collection no longer exists." };

  const name = text(form, "name", 80);
  // Editable at any time: the database remembers the old slug, so its links redirect here.
  const slug = slugify(text(form, "slug", 80) || name);
  const status = text(form, "status", 10);
  const sortOrder = Number(text(form, "sort_order", 6) || "0");
  if (!name) return { error: "Give the collection a name." };
  if (!slug) return { error: "The web address needs at least one letter or number." };
  if (!STATUSES.includes(status)) return { error: "Pick a status." };
  if (!Number.isInteger(sortOrder)) return { error: "The order should be a whole number." };

  let banner;
  try {
    banner = await readBanner(form, "banner", `collections/${slug}`, name, existing?.banner ?? null);
  } catch (error) {
    return { error: (error as Error).message };
  }
  if ("error" in banner) return { error: banner.error };

  const cardColor = text(form, "card_color", 7).toLowerCase() || null;
  if (cardColor && !/^#[0-9a-f]{6}$/.test(cardColor)) return { error: "The card colour could not be read; pick it again." };

  const row = { slug, name, tagline: text(form, "tagline", 200), blurb: text(form, "blurb", 2000), banner: banner.banner, card_color: cardColor, status, sort_order: sortOrder };
  const db = supabase();
  const saved = existing
    ? await db.from("collections").update(row).eq("id", existing.id).select("id").single()
    : await db.from("collections").insert(row).select("id").single();
  if (saved.error) {
    await removePhotos([banner.uploaded?.src]);
    return { error: saved.error.code === "23505" ? `Another collection already uses /collections/${slug}. Change the web address.` : `Could not save: ${saved.error.message}` };
  }
  await removePhotos([banner.replaced?.src]);
  if (existing) await repointSlides(`/collections/${existing.slug}`, `/collections/${slug}`);
  done(`/backroom/collections/${saved.data.id}?saved=${existing ? "1" : "new"}`);
}

export async function deleteCollection(form: FormData) {
  await requireAdmin();
  if (!supabaseConfigured()) redirect("/backroom/collections");
  const collection = await getCollectionSummary(text(form, "id", 40));
  if (!collection) redirect("/backroom/collections");
  // Its seasons go with it; its products stay, just without a collection.
  const { error } = await supabase().from("collections").delete().eq("id", collection.id);
  if (error) throw new Error(`Could not delete: ${error.message}`);
  await removePhotos([collection.banner?.src, ...collection.seasons.map((season) => season.banner?.src)]);
  done("/backroom/collections?deleted=1");
}

// ── Seasons ──────────────────────────────────────────────────────────────────────────────────
export async function saveSeason(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return cleaningUploads(form, ["banner_uploaded"], () => writeSeason(form));
}

async function writeSeason(form: FormData): Promise<FormState> {
  await requireAdmin();
  const missing = needsSupabase();
  if (missing) return missing;

  const id = text(form, "id", 40);
  const existing = id ? await getSeasonRow(id) : null;
  if (id && !existing) return { error: "This season no longer exists." };
  const collection = await getCollectionSummary(existing?.collection_id ?? text(form, "collection_id", 40));
  if (!collection) return { error: "This season's collection no longer exists." };

  const number = Number(text(form, "number", 4));
  const name = text(form, "name", 80);
  const slug = slugify(text(form, "slug", 80)) || `s-${number}`;
  const startsOn = text(form, "starts_on", 10) || null;
  const endsOn = text(form, "ends_on", 10) || null;
  const status = text(form, "status", 10);
  if (!Number.isInteger(number) || number < 1) return { error: "The season number should be 1 or more." };
  if (!STATUSES.includes(status)) return { error: "Pick a status." };
  if ((startsOn && !DATE.test(startsOn)) || (endsOn && !DATE.test(endsOn))) return { error: "The dates could not be read." };
  if (startsOn && endsOn && endsOn < startsOn) return { error: "The season can't end before it starts." };

  let banner;
  try {
    banner = await readBanner(form, "banner", `collections/${collection.slug}/${slug}`, `${collection.name} S-${number}${name ? ` · ${name}` : ""}`, existing?.banner ?? null);
  } catch (error) {
    return { error: (error as Error).message };
  }
  if ("error" in banner) return { error: banner.error };

  const row = {
    collection_id: collection.id,
    number,
    name,
    slug,
    tagline: text(form, "tagline", 200),
    blurb: text(form, "blurb", 2000),
    banner: banner.banner,
    starts_on: startsOn,
    ends_on: endsOn,
    status,
  };
  const db = supabase();
  const saved = existing
    ? await db.from("seasons").update(row).eq("id", existing.id).select("id").single()
    : await db.from("seasons").insert(row).select("id").single();
  if (saved.error) {
    await removePhotos([banner.uploaded?.src]);
    return {
      error:
        saved.error.code === "23505"
          ? `${collection.name} already has a season ${number} or a season at /${slug}. Pick another number or address.`
          : `Could not save: ${saved.error.message}`,
    };
  }
  await removePhotos([banner.replaced?.src]);
  if (existing) await repointSlides(`/collections/${collection.slug}/${existing.slug}`, `/collections/${collection.slug}/${slug}`);

  // The ticked products join this season (and so its collection); untick to take one out (it
  // stays in the collection).
  const seasonId = saved.data.id as string;
  const picked = form.getAll("product").map(String).filter(isUuid).slice(0, 500);
  const { data: current } = await db.from("products").select("id").eq("season_id", seasonId);
  const leaving = ((current ?? []) as { id: string }[]).map((product) => product.id).filter((productId) => !picked.includes(productId));
  if (leaving.length) await db.from("products").update({ season_id: null }).in("id", leaving);
  if (picked.length) {
    const { error } = await db.from("products").update({ season_id: seasonId }).in("id", picked);
    if (error) return { error: `Saved the season, but could not file its products: ${error.message}`, keepUploads: true };
  }

  done(`/backroom/collections/${collection.id}/seasons/${seasonId}?saved=${existing ? "1" : "new"}`);
}

export async function deleteSeason(form: FormData) {
  await requireAdmin();
  if (!supabaseConfigured()) redirect("/backroom/collections");
  const season = await getSeasonRow(text(form, "id", 40));
  if (!season) redirect("/backroom/collections");
  // Its products stay in the collection, without a season.
  const { error } = await supabase().from("seasons").delete().eq("id", season.id);
  if (error) throw new Error(`Could not delete: ${error.message}`);
  await removePhotos([season.banner?.src]);
  done(`/backroom/collections/${season.collection_id}?season-deleted=1`);
}

// ── Hero slides ──────────────────────────────────────────────────────────────────────────────
export async function saveSlide(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  return cleaningUploads(form, ["image_uploaded"], () => writeSlide(form));
}

async function writeSlide(form: FormData): Promise<FormState> {
  await requireAdmin();
  const missing = needsSupabase();
  if (missing) return missing;

  const id = text(form, "id", 40);
  const db = supabase();
  const existing = id && isUuid(id) ? ((await db.from("hero_slides").select("*").eq("id", id).maybeSingle()).data as HeroSlideRow | null) : null;
  if (id && !existing) return { error: "This slide no longer exists." };

  const href = text(form, "href", 200) || "/shop";
  const label = text(form, "label", 120);
  const status = text(form, "status", 10);
  const sortOrder = Number(text(form, "sort_order", 6) || "0");
  if (!href.startsWith("/") || href.startsWith("//")) return { error: "The link should be a page on this site, starting with / (e.g. /collections/nogor)." };
  if (!["published", "hidden"].includes(status)) return { error: "Pick whether the slide is shown." };
  if (!Number.isInteger(sortOrder)) return { error: "The order should be a whole number." };

  let image;
  try {
    image = await readBanner(form, "image", "hero", label || "A campaign photograph", existing?.image ?? null);
  } catch (error) {
    return { error: (error as Error).message };
  }
  if ("error" in image) return { error: image.error };
  if (!image.banner) return { error: "A slide needs a photograph." };

  const row = { image: image.banner, href, label, status, sort_order: sortOrder };
  const saved = existing ? await db.from("hero_slides").update(row).eq("id", existing.id).select("id").single() : await db.from("hero_slides").insert(row).select("id").single();
  if (saved.error) {
    await removePhotos([image.uploaded?.src]);
    return { error: `Could not save: ${saved.error.message}` };
  }
  await removePhotos([image.replaced?.src]);
  done(`/backroom/banners?saved=${saved.data.id}`);
}

export async function deleteSlide(form: FormData) {
  await requireAdmin();
  if (!supabaseConfigured()) redirect("/backroom/banners");
  const id = text(form, "id", 40);
  if (!isUuid(id)) redirect("/backroom/banners");
  const { data } = await supabase().from("hero_slides").delete().eq("id", id).select("image").maybeSingle();
  await removePhotos([(data as Pick<HeroSlideRow, "image"> | null)?.image.src]);
  done("/backroom/banners?deleted=1");
}

