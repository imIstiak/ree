import type { Metadata } from "next";
import { createPageMetadata } from "../../../lib/seo";
import { notFound } from "next/navigation";
import { ProductClassic } from "../../../components/product-classic";
import { ProductStory } from "../../../components/product-story";
import { relatedTo } from "../../../data/products";
import { getCatalog, getCatalogProduct } from "../../../lib/catalog";

// One route, two templates: `product.kind` picks the story-led page or the classic details page.
// Every published product is prerendered; one published later in the backroom is rendered on its
// first visit and cached (dynamicParams), and the backroom's saves revalidate these pages.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCatalog()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  return createPageMetadata({
    path: `/products/${product.slug}`,
    title: `${product.name} — Preview`,
    description: `${product.tagline} Preview the upcoming Reé collection from Bangladesh.`,
    image: { url: product.images[0].src, alt: product.images[0].alt },
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  const related = relatedTo(await getCatalog(), product);
  return product.kind === "story" ? <ProductStory product={product} related={related} /> : <ProductClassic product={product} related={related} />;
}
