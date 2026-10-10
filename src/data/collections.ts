// The six collections the landing page's tabs name, each with its own page (/collections/[slug]).
// A collection gathers products by `category`, and every product belongs to exactly one. Copy is
// sample content, like the rest of the catalogue.
import { products, type Product } from "./products";

export type Collection = { slug: string; name: string; tagline: string; blurb: string; categories: string[] };

export const collections: Collection[] = [
  {
    slug: "casual-wear",
    name: "Casual wear",
    tagline: "For the long Dhaka day.",
    blurb: "Tees and easy blouses in breathable cotton and crepe, cut with a little room for the heat and the rickshaw ride home.",
    categories: ["Casual wear"],
  },
  {
    slug: "loungewear",
    name: "Loungewear",
    tagline: "Soft enough to stay in.",
    blurb: "Brushed fleece and dropped shoulders for slow mornings, late nights and the rainy afternoons in between.",
    categories: ["Loungewear"],
  },
  {
    slug: "street-style",
    name: "Street style",
    tagline: "Words on your back, a bag on your shoulder.",
    blurb: "Hand-pulled prints, heavy jersey and canvas, made to be worn hard across the city and washed a hundred times.",
    categories: ["Drop-shoulder", "Street style"],
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    tagline: "The layer that lasts.",
    blurb: "Leather and heavy cloth that soften with every season you wear them, for the few cold weeks and the long monsoon.",
    categories: ["Outerwear"],
  },
  {
    slug: "handloom",
    name: "Handloom",
    tagline: "Made by hand, slightly different every time.",
    blurb: "Block prints and woven cotton from Bengal's workshops, where the hand that stamps the cloth leaves its mark on every piece.",
    categories: ["Handloom"],
  },
  {
    slug: "formal-wear",
    name: "Formal wear",
    tagline: "Dressed up, never stiff.",
    blurb: "Soft tailoring, tweed and satin for weddings, evenings out and the days that ask a little more of you.",
    categories: ["Formal wear", "Evening"],
  },
];

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function collectionProducts(collection: Collection) {
  return products.filter((product) => collection.categories.includes(product.category));
}

export function collectionOf(product: Product) {
  return collections.find((collection) => collection.categories.includes(product.category));
}
