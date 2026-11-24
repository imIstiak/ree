"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productCategories } from "../../data/collections";
import { getProductRow } from "../../lib/backroom-data";
import { isUuid, lines, needsSupabase, pickedFiles, readPhotos, removePhotos, repointSlides, slugify, text, uploadPhotos, type FormState } from "../../lib/backroom-forms";
import { backroomSetup, checkCredentials, endSession, requireAdmin, startSession } from "../../lib/backroom-session";
import { starterRows } from "../../lib/starter-rows";
import { orderStatuses, paymentStatuses, supabase, supabaseConfigured, type SeasonRow } from "../../lib/supabase";

// Every action here is a public POST endpoint, so each one checks the session itself
// (requireAdmin) and treats the form as untrusted. Saves revalidate the whole site, so the
// shop's static pages are rebuilt with the new catalogue. Collections, seasons and the hero's
// slides are in catalog-actions.ts.

// ── Signing in and out ───────────────────────────────────────────────────────────────────────
export async function login(_: FormState, form: FormData): Promise<FormState> {
  const setup = backroomSetup();
  if (!setup.supabase || !setup.secret) return { error: "The backroom isn't set up: it needs Supabase and an AUTH_SECRET of 32+ characters in .env." };
  const email = text(form, "email", 200);
  const admin = email ? await checkCredentials(email, String(form.get("password") ?? "").slice(0, 200)) : null;
  if (!admin) {
    // One message for a wrong email or a wrong password, and a pause to slow guessing.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "That email and password don't match an account.", email };
  }
  await startSession(admin);
  redirect("/backroom/orders");
}

export async function logout() {
  await endSession();
  redirect("/backroom/login");
}

// ── Orders ───────────────────────────────────────────────────────────────────────────────────
export async function updateOrder(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const missing = needsSupabase();
  if (missing) return missing;

  const id = text(form, "id", 40);
  const status = text(form, "status", 20);
  const payment = text(form, "payment_status", 20);
  const note = text(form, "admin_note", 2000);
  if (!(orderStatuses as readonly string[]).includes(status) || !(paymentStatuses as readonly string[]).includes(payment)) {
    return { error: "Pick a status and a payment state from the lists." };
  }

  const db = supabase();
  // Status goes through set_order_status(): cancelling puts tracked stock back, and a cancelled
  // order cannot be reopened.
  const { error: statusError } = await db.rpc("set_order_status", { p_id: id, p_status: status });
  if (statusError) {
    return { error: statusError.message.includes("REOPEN") ? "A cancelled order stays cancelled (its stock has gone back on the shelf). Ask the customer to order again." : `Could not change the status: ${statusError.message}` };
  }
  const { error } = await db.from("orders").update({ payment_status: payment, admin_note: note }).eq("id", id);
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath("/backroom/orders", "layout");
  // A cancellation can put sizes back in stock on the shop.
  if (status === "cancelled") revalidatePath("/", "layout");
  return { notice: "Saved." };
}

// ── Products ─────────────────────────────────────────────────────────────────────────────────
const categories = new Set(productCategories);

export async function saveProduct(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const missing = needsSupabase();
  if (missing) return missing;

  const id = text(form, "id", 40);
  const existing = id ? await getProductRow(id) : null;
  if (id && !existing) return { error: "This product no longer exists." };

  const name = text(form, "name", 120);
  // Editable at any time: the database remembers the old slug, so its links redirect here.
  const slug = slugify(text(form, "slug", 80) || name);
  const category = text(form, "category", 60);
  const department = text(form, "department", 10);
  const status = text(form, "status", 10);
  const price = Number(text(form, "price", 10));
  const wasRaw = text(form, "was_price", 10);
  const wasPrice = wasRaw ? Number(wasRaw) : null;
  const sortOrder = Number(text(form, "sort_order", 6) || "0");
  const sizes = [...new Set(text(form, "sizes", 200).split(/[,\s]+/).map((size) => size.trim()).filter(Boolean))].slice(0, 12);

  if (!name) return { error: "Give the product a name." };
  if (!slug) return { error: "The web address needs at least one letter or number." };
  if (!categories.has(category)) return { error: "Pick a category from the list." };
  if (!["women", "men", "unisex"].includes(department)) return { error: "Pick who the piece is cut for." };
  if (!["draft", "published", "archived"].includes(status)) return { error: "Pick a status." };
  if (!Number.isInteger(price) || price < 0) return { error: "The price should be a whole number of taka." };
  if (wasPrice !== null && (!Number.isInteger(wasPrice) || wasPrice <= price)) return { error: "The old price should be a whole number above the price (or left empty)." };
  if (!Number.isInteger(sortOrder)) return { error: "The order should be a whole number." };
  if (sizes.length === 0) return { error: "Add at least one size (e.g. S, M, L, XL — or One size)." };

  // Stock per size: an empty box means "not tracked".
  const stock: Record<string, number> = {};
  for (const size of sizes) {
    const raw = text(form, `stock:${size}`, 6);
    if (raw === "") continue;
    const count = Number(raw);
    if (!Number.isInteger(count) || count < 0) return { error: `Stock for size ${size} should be a whole number (or empty to not track it).` };
    stock[size] = count;
  }

  const kept = readPhotos(text(form, "images", 20000));
  if (!kept) return { error: "The photo list could not be read; reload the page and try again." };

  const db = supabase();
  // Collection, and a season of it (the database keeps the two in step).
  const collectionId = text(form, "collection_id", 40) || null;
  const seasonId = text(form, "season_id", 40) || null;
  if (collectionId && !isUuid(collectionId)) return { error: "Pick a collection from the list." };
  if (seasonId) {
    if (!isUuid(seasonId)) return { error: "Pick a season from the list." };
    const { data: season } = await db.from("seasons").select("collection_id").eq("id", seasonId).maybeSingle();
    if (!season || (season as Pick<SeasonRow, "collection_id">).collection_id !== collectionId) return { error: "That season belongs to another collection; pick the collection first." };
  }

  const files = pickedFiles(form, "photos", 8);
  if (typeof files === "string") return { error: files };
  let uploaded: Awaited<ReturnType<typeof uploadPhotos>> = [];
  try {
    uploaded = await uploadPhotos(files, slug, name);
  } catch (error) {
    return { error: (error as Error).message };
  }
  const images = [...kept, ...uploaded];
  if (status === "published" && images.length === 0) {
    return { error: "A published product needs at least one photo." };
  }

  const row = {
    slug,
    name,
    tagline: text(form, "tagline", 200),
    category,
    department,
    price,
    was_price: wasPrice,
    colour: text(form, "colour", 60),
    sizes,
    stock,
    description: text(form, "description", 4000),
    details: lines(form, "details"),
    care: lines(form, "care"),
    images,
    status,
    sort_order: sortOrder,
    collection_id: collectionId,
    season_id: seasonId,
  };

  const saved = existing
    ? await db.from("products").update(row).eq("id", existing.id).select("id").single()
    : await db.from("products").insert({ ...row, kind: "classic" }).select("id").single();
  if (saved.error) {
    await removePhotos(uploaded.map((photo) => photo.src));
    return { error: saved.error.code === "23505" ? `Another product already uses the address /products/${slug}. Change the web address.` : `Could not save: ${saved.error.message}` };
  }

  if (existing) await repointSlides(`/products/${existing.slug}`, `/products/${slug}`);
  // Photos taken off the product are deleted from storage (only ones this site uploaded).
  if (existing) await removePhotos(existing.images.map((photo) => photo.src).filter((src) => !images.some((photo) => photo.src === src)));

  revalidatePath("/", "layout");
  // Back to the product's page with fresh data (the form is keyed on updated_at, so it reloads).
  redirect(`/backroom/products/${saved.data.id}?saved=${existing ? "1" : "new"}`);
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  if (!supabaseConfigured()) redirect("/backroom/products");
  const product = await getProductRow(text(form, "id", 40));
  if (!product) redirect("/backroom/products");
  // Past orders keep their own copy of the name, size and price (order_items), so they survive.
  const { error } = await supabase().from("products").delete().eq("id", product.id);
  if (error) throw new Error(`Could not delete: ${error.message}`);
  await removePhotos(product.images.map((photo) => photo.src));
  revalidatePath("/", "layout");
  redirect("/backroom/products?deleted=1");
}

export async function importStarterCatalogue(): Promise<void> {
  await requireAdmin();
  if (!supabaseConfigured()) redirect("/backroom/products");
  const db = supabase();
  const { count, error: countError } = await db.from("products").select("id", { count: "exact", head: true });
  if (countError) throw new Error(`Could not read products: ${countError.message}`);
  // Only into an empty table, so a second click cannot duplicate or overwrite anything.
  if ((count ?? 0) === 0) {
    const { error } = await db.from("products").insert(starterRows());
    if (error) throw new Error(`Could not import: ${error.message}`);
    revalidatePath("/", "layout");
  }
  redirect("/backroom/products?imported=1");
}
