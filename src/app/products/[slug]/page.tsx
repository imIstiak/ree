import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductClassic } from "../../../components/product-classic";
import { ProductStory } from "../../../components/product-story";
import { getProduct, products, relatedTo } from "../../../data/products";

// One route, two templates: `product.kind` picks the story-led page or the classic details page.
// Every product in src/data/products.ts is prerendered; unknown slugs are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `ঋ - Ree | ${product.name}`,
    description: product.tagline,
    openGraph: { images: [{ url: product.images[0].src, alt: product.images[0].alt }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedTo(product);
  return product.kind === "story" ? <ProductStory product={product} related={related} /> : <ProductClassic product={product} related={related} />;
}
