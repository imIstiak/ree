import { starterCollections } from "../data/collections";
import { starterHeroSlides } from "../data/hero-slides";
import { starterCatalogue, type Product } from "../data/products";
import type { CollectionRow, HeroSlideRow, ProductRow } from "./supabase";

// No "server-only" here: the backroom (preview, "Import the starter catalogue") and the seed
// script (scripts/db.mts) both use it.
// The starter catalogue as table rows, for the preview and for "Import the starter catalogue".
// Collection and season links are set by the seed after the collections exist (by category).
export function starterRows(): Omit<ProductRow, "id" | "created_at" | "updated_at" | "collection_id" | "season_id">[] {
  return starterCatalogue.map((product: Product, index) => ({
    slug: product.slug,
    kind: product.kind,
    name: product.name,
    tagline: product.tagline,
    category: product.category,
    department: product.department,
    price: product.price,
    was_price: product.wasPrice ?? null,
    colour: product.colour,
    sizes: product.sizes,
    stock: {},
    description: product.description,
    details: product.details,
    care: product.care,
    // Cut-outs stay in the starter file (matched by URL); the table keeps what the backroom edits.
    images: product.images.map(({ src, alt, position, swatch }) => ({ src, alt, ...(position ? { position } : {}), ...(swatch ? { swatch } : {}) })),
    status: "published" as const,
    sort_order: (index + 1) * 10,
  }));
}

export function starterCollectionRows(): Omit<CollectionRow, "id" | "created_at" | "updated_at">[] {
  return starterCollections.map((collection, index) => ({
    slug: collection.slug,
    name: collection.name,
    tagline: collection.tagline,
    blurb: collection.blurb,
    banner: null,
    card_color: null,
    status: "published" as const,
    sort_order: (index + 1) * 10,
  }));
}

// The categories each starter collection gathers, for filing existing products into it.
export const starterCollectionCategories = Object.fromEntries(starterCollections.map((collection) => [collection.slug, collection.categories ?? []]));

export function starterHeroRows(): Omit<HeroSlideRow, "id" | "created_at" | "updated_at">[] {
  return starterHeroSlides.map((slide, index) => ({
    image: { src: slide.src, alt: slide.alt },
    href: slide.href,
    label: slide.label,
    status: slide.hidden ? ("hidden" as const) : ("published" as const),
    sort_order: (index + 1) * 10,
  }));
}
