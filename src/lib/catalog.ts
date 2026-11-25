import "server-only";
import { cache } from "react";
import { starterCollections, type Collection, type Season } from "../data/collections";
import { starterHeroSlides, type HeroSlide } from "../data/hero-slides";
import { starterCatalogue, type CatalogEntry, type Product, type ProductImage } from "../data/products";
import { supabase, supabaseConfigured, type CollectionRow, type HeroSlideRow, type ProductRow, type SeasonRow } from "./supabase";

// What the storefront shows, all from Supabase: published products, collections and their
// seasons, and the landing hero's slides, in the backroom's order. Until SUPABASE_URL /
// SUPABASE_SECRET_KEY are set, the starter data in src/data/ stands in, so the site keeps working
// before the database exists.
//
// Pages built from this are static; the backroom's actions (and a placed order, which changes
// stock) call revalidatePath so they are rebuilt with the new data.

const starterBySlug = new Map(starterCatalogue.map((product) => [product.slug, product]));
const starterImages = new Map(starterCatalogue.flatMap((product) => product.images.map((image) => [image.src, image] as const)));

function read<T>(result: { data: unknown; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`Could not read ${what}: ${result.error.message}`);
  return result.data as T;
}

// ── Collections and seasons ──────────────────────────────────────────────────────────────────
function rowToSeason(row: SeasonRow): Season {
  return {
    slug: row.slug,
    previousSlugs: row.previous_slugs,
    number: row.number,
    name: row.name,
    tagline: row.tagline,
    blurb: row.blurb,
    banner: row.banner ?? undefined,
    startsOn: row.starts_on ?? undefined,
    endsOn: row.ends_on ?? undefined,
  };
}

// Published collections with their published seasons, plus the id → slug maps products need.
const getCollectionData = cache(async () => {
  const db = supabase();
  const [collections, seasons] = await Promise.all([
    db.from("collections").select("*").eq("status", "published").order("sort_order").order("created_at"),
    db.from("seasons").select("*").eq("status", "published").order("number"),
  ]);
  const collectionRows = read<CollectionRow[]>(collections, "collections");
  const seasonRows = read<SeasonRow[]>(seasons, "seasons").filter((season) => collectionRows.some((collection) => collection.id === season.collection_id));
  return {
    collections: collectionRows.map(
      (row): Collection => ({
        slug: row.slug,
        previousSlugs: row.previous_slugs,
        name: row.name,
        tagline: row.tagline,
        blurb: row.blurb,
        banner: row.banner ?? undefined,
        cardColor: row.card_color ?? undefined,
        seasons: seasonRows.filter((season) => season.collection_id === row.id).map(rowToSeason),
      }),
    ),
    collectionSlug: new Map(collectionRows.map((row) => [row.id, row.slug])),
    seasonSlug: new Map(seasonRows.map((row) => [row.id, row.slug])),
  };
});

export const getCollections = cache(async (): Promise<Collection[]> => {
  if (!supabaseConfigured()) return starterCollections;
  return (await getCollectionData()).collections;
});

export async function getCollection(slug: string) {
  return (await getCollections()).find((collection) => collection.slug === slug);
}

// The published collection that had this address before a rename (its page redirects there).
export async function getMovedCollection(slug: string) {
  return (await getCollections()).find((collection) => collection.previousSlugs?.includes(slug));
}

// ── Products ─────────────────────────────────────────────────────────────────────────────────
// A table row as the Product the components already render. What the table does not hold comes
// from the starter file: a story page's chapters (by slug, the current one or an earlier one, so a
// renamed story piece keeps them) and a photo's tee cut-out (by URL).
export function rowToProduct(row: ProductRow, links?: { collection?: string; season?: string }): Product {
  const story = [row.slug, ...(row.previous_slugs ?? [])].map((slug) => starterBySlug.get(slug)?.story).find(Boolean);
  const images: ProductImage[] = row.images.map((image) => {
    const known = starterImages.get(image.src);
    return { ...image, cutout: known?.cutout, swatch: image.swatch || known?.swatch };
  });
  return {
    slug: row.slug,
    previousSlugs: row.previous_slugs,
    kind: row.kind === "story" && story ? "story" : "classic",
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    department: row.department,
    collection: links?.collection,
    season: links?.season,
    price: row.price,
    wasPrice: row.was_price ?? undefined,
    colour: row.colour,
    sizes: row.sizes,
    stock: row.stock,
    description: row.description,
    details: row.details,
    care: row.care,
    images,
    story,
  };
}

export const getCatalog = cache(async (): Promise<Product[]> => {
  if (!supabaseConfigured()) {
    // The starter pieces join the starter collections by category.
    return starterCatalogue.map((product) => ({ ...product, collection: starterCollections.find((collection) => collection.categories?.includes(product.category))?.slug }));
  }
  const [products, links] = await Promise.all([
    supabase().from("products").select("*").eq("status", "published").order("sort_order").order("created_at"),
    getCollectionData(),
  ]);
  // A product needs at least one photo to be shown anywhere in the shop. It only links to a
  // collection or season that is published.
  return read<ProductRow[]>(products, "the catalogue")
    .filter((row) => row.images.length > 0)
    .map((row) => {
      const collection = row.collection_id ? links.collectionSlug.get(row.collection_id) : undefined;
      return rowToProduct(row, { collection, season: collection && row.season_id ? links.seasonSlug.get(row.season_id) : undefined });
    });
});

export async function getCatalogProduct(slug: string) {
  return (await getCatalog()).find((product) => product.slug === slug);
}

// The catalogue as the browser gets it with a page (CatalogScope): only what the bag, /cart,
// /checkout and the saved pieces show, and at most two photos a piece.
export const getCatalogEntries = cache(async (): Promise<CatalogEntry[]> =>
  (await getCatalog()).map(({ slug, previousSlugs, kind, name, category, price, colour, images }) => ({
    slug,
    ...(previousSlugs?.length ? { previousSlugs } : {}),
    kind,
    name,
    category,
    price,
    colour,
    images: images.slice(0, 2),
  })),
);

// The published product that had this address before a rename (its page redirects there).
export async function getMovedProduct(slug: string) {
  return (await getCatalog()).find((product) => product.previousSlugs?.includes(slug));
}

// ── The landing hero ─────────────────────────────────────────────────────────────────────────
export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  if (!supabaseConfigured()) return starterHeroSlides.filter((slide) => !slide.hidden);
  const rows = read<HeroSlideRow[]>(await supabase().from("hero_slides").select("*").eq("status", "published").order("sort_order").order("created_at"), "the hero slides");
  return rows.map((row) => ({ src: row.image.src, alt: row.image.alt, href: row.href, label: row.label }));
});
