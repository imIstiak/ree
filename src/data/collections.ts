// Collections and their seasons. A collection is a line (e.g. "Nogor"); a season is one drop of it
// (S-1, S-2, …), and a product belongs to a collection and optionally one of its seasons. The live
// ones are the `collections` / `seasons` tables (read through src/lib/catalog.ts, edited in
// /backroom/collections). The six below are the starter set: they seed the table (`npm run
// db:seed`, which files existing products into them by `categories`) and stand in until Supabase
// is configured. Copy is sample content.
import type { Product } from "./products";

export type Banner = { src: string; alt: string; position?: string };

export type Season = {
  slug: string;
  number: number;
  name: string;
  tagline: string;
  blurb: string;
  banner?: Banner;
  startsOn?: string;
  endsOn?: string;
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  banner?: Banner;
  // The card's cloth on /collections, picked in the backroom; without it the card takes the colour
  // of its first piece's garment (or the palette, under a banner).
  cardColor?: string;
  seasons: Season[];
  // Starter set only: the categories whose products the seed files into the collection.
  categories?: string[];
};

// A product's garment type (shown on its card and page); independent of its collection.
export const productCategories = ["Casual wear", "Loungewear", "Drop-shoulder", "Street style", "Outerwear", "Handloom", "Formal wear", "Evening"];

export const starterCollections: Collection[] = [
  {
    slug: "casual-wear",
    name: "Casual wear",
    tagline: "For the long Dhaka day.",
    blurb: "Tees and easy blouses in breathable cotton and crepe, cut with a little room for the heat and the rickshaw ride home.",
    seasons: [],
    categories: ["Casual wear"],
  },
  {
    slug: "loungewear",
    name: "Loungewear",
    tagline: "Soft enough to stay in.",
    blurb: "Brushed fleece and dropped shoulders for slow mornings, late nights and the rainy afternoons in between.",
    seasons: [],
    categories: ["Loungewear"],
  },
  {
    slug: "street-style",
    name: "Street style",
    tagline: "Words on your back, a bag on your shoulder.",
    blurb: "Hand-pulled prints, heavy jersey and canvas, made to be worn hard across the city and washed a hundred times.",
    seasons: [],
    categories: ["Drop-shoulder", "Street style"],
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    tagline: "The layer that lasts.",
    blurb: "Leather and heavy cloth that soften with every season you wear them, for the few cold weeks and the long monsoon.",
    seasons: [],
    categories: ["Outerwear"],
  },
  {
    slug: "handloom",
    name: "Handloom",
    tagline: "Made by hand, slightly different every time.",
    blurb: "Block prints and woven cotton from Bengal's workshops, where the hand that stamps the cloth leaves its mark on every piece.",
    seasons: [],
    categories: ["Handloom"],
  },
  {
    slug: "formal-wear",
    name: "Formal wear",
    tagline: "Dressed up, never stiff.",
    blurb: "Soft tailoring, tweed and satin for weddings, evenings out and the days that ask a little more of you.",
    seasons: [],
    categories: ["Formal wear", "Evening"],
  },
];

export function collectionProducts(products: Product[], collection: Collection) {
  return products.filter((product) => product.collection === collection.slug);
}

export function seasonProducts(products: Product[], collection: Collection, season: Season) {
  return products.filter((product) => product.collection === collection.slug && product.season === season.slug);
}

// "S-1" or "S-1 · Dhaka".
export function seasonLabel(season: Pick<Season, "number" | "name">) {
  return season.name ? `S-${season.number} · ${season.name}` : `S-${season.number}`;
}
