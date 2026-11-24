import "server-only";
import { requireAdmin } from "./backroom-session";
import { starterCollectionRows, starterHeroRows, starterRows } from "./starter-rows";
import {
  orderStatuses,
  supabase,
  supabaseConfigured,
  type CollectionRow,
  type HeroSlideRow,
  type OrderItemRow,
  type OrderRow,
  type OrderStatus,
  type ProductRow,
  type SeasonRow,
} from "./supabase";

// Everything the backroom reads. Each function checks the session first. Without Supabase the
// backroom is a read-only preview: products come from the starter file and there are no orders.

const previewProducts = (): ProductRow[] =>
  starterRows().map((row) => ({ ...row, id: row.slug, previous_slugs: [], collection_id: null, season_id: null, created_at: "", updated_at: "" }));

export async function listProducts(): Promise<ProductRow[]> {
  await requireAdmin();
  if (!supabaseConfigured()) return previewProducts();
  const { data, error } = await supabase().from("products").select("*").order("sort_order").order("created_at");
  if (error) throw new Error(`Could not read products: ${error.message}`);
  return data as ProductRow[];
}

export async function getProductRow(id: string): Promise<ProductRow | null> {
  await requireAdmin();
  if (!supabaseConfigured()) return previewProducts().find((row) => row.id === id) ?? null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await supabase().from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not read the product: ${error.message}`);
  return data as ProductRow | null;
}

export type OrderSummary = OrderRow & { items: number };

export async function listOrders({ status, q }: { status?: string; q?: string }): Promise<OrderSummary[]> {
  await requireAdmin();
  if (!supabaseConfigured()) return [];
  let query = supabase().from("orders").select("*, order_items(qty)").order("created_at", { ascending: false }).limit(200);
  if (status && (orderStatuses as readonly string[]).includes(status)) query = query.eq("status", status);
  const term = q?.trim().replace(/[%_,()]/g, " ").trim();
  if (term) query = query.or(`number.ilike.%${term}%,customer_name.ilike.%${term}%,phone.ilike.%${term}%`);
  const { data, error } = await query;
  if (error) throw new Error(`Could not read orders: ${error.message}`);
  return (data as (OrderRow & { order_items: { qty: number }[] })[]).map(({ order_items, ...order }) => ({
    ...order,
    items: order_items.reduce((sum, item) => sum + item.qty, 0),
  }));
}

export async function orderCounts(): Promise<Record<OrderStatus | "all", number>> {
  await requireAdmin();
  const counts = Object.fromEntries([...orderStatuses, "all"].map((status) => [status, 0])) as Record<OrderStatus | "all", number>;
  if (!supabaseConfigured()) return counts;
  const { data, error } = await supabase().from("orders").select("status");
  if (error) throw new Error(`Could not count orders: ${error.message}`);
  for (const row of data as { status: OrderStatus }[]) {
    counts[row.status] += 1;
    counts.all += 1;
  }
  return counts;
}

export async function getOrder(id: string): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  await requireAdmin();
  if (!supabaseConfigured() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const db = supabase();
  const { data: order, error } = await db.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not read the order: ${error.message}`);
  if (!order) return null;
  const { data: items, error: itemsError } = await db.from("order_items").select("*").eq("order_id", id);
  if (itemsError) throw new Error(`Could not read the order's items: ${itemsError.message}`);
  return { order: order as OrderRow, items: items as OrderItemRow[] };
}

// ── Collections and seasons ──────────────────────────────────────────────────────────────────
export type CollectionSummary = CollectionRow & { seasons: (SeasonRow & { products: number })[]; products: number };

export async function listCollections(): Promise<CollectionSummary[]> {
  await requireAdmin();
  if (!supabaseConfigured()) {
    return starterCollectionRows().map((row) => ({ ...row, id: row.slug, previous_slugs: [], created_at: "", updated_at: "", seasons: [], products: 0 }));
  }
  const db = supabase();
  const [collections, seasons, products] = await Promise.all([
    db.from("collections").select("*").order("sort_order").order("created_at"),
    db.from("seasons").select("*").order("number"),
    db.from("products").select("collection_id, season_id"),
  ]);
  for (const result of [collections, seasons, products]) if (result.error) throw new Error(`Could not read collections: ${result.error.message}`);
  const links = products.data as Pick<ProductRow, "collection_id" | "season_id">[];
  return (collections.data as CollectionRow[]).map((collection) => ({
    ...collection,
    products: links.filter((link) => link.collection_id === collection.id).length,
    seasons: (seasons.data as SeasonRow[])
      .filter((season) => season.collection_id === collection.id)
      .map((season) => ({ ...season, products: links.filter((link) => link.season_id === season.id).length })),
  }));
}

export async function getCollectionSummary(id: string): Promise<CollectionSummary | null> {
  return (await listCollections()).find((collection) => collection.id === id) ?? null;
}

export async function getSeasonRow(id: string): Promise<SeasonRow | null> {
  await requireAdmin();
  if (!supabaseConfigured() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await supabase().from("seasons").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not read the season: ${error.message}`);
  return data as SeasonRow | null;
}

// Collections with their seasons, for the product form's pickers.
export type CollectionOption = { id: string; name: string; seasons: { id: string; label: string }[] };

export async function collectionOptions(): Promise<CollectionOption[]> {
  return (await listCollections()).map((collection) => ({
    id: collection.id,
    name: collection.name,
    seasons: collection.seasons.map((season) => ({ id: season.id, label: season.name ? `S-${season.number} · ${season.name}` : `S-${season.number}` })),
  }));
}

// ── Hero slides ──────────────────────────────────────────────────────────────────────────────
export async function listHeroSlides(): Promise<HeroSlideRow[]> {
  await requireAdmin();
  if (!supabaseConfigured()) return starterHeroRows().map((row, index) => ({ ...row, id: `starter-${index}`, created_at: "", updated_at: "" }));
  const { data, error } = await supabase().from("hero_slides").select("*").order("sort_order").order("created_at");
  if (error) throw new Error(`Could not read the hero slides: ${error.message}`);
  return data as HeroSlideRow[];
}

