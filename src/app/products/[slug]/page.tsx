import type { Metadata } from "next";
import { createPageMetadata } from "../../../lib/seo";
import { notFound, redirect } from "next/navigation";
import { CatalogScope } from "../../../components/catalog-scope";
import { ProductClassic } from "../../../components/product-classic";
import { ProductStory } from "../../../components/product-story";
import { relatedTo } from "../../../data/products";
import { getCatalog, getCatalogProduct, getMovedProduct } from "../../../lib/catalog";

// One route, two templates: `product.kind` picks the story-led page or the classic details page.
// Every published product is prerendered; one published later in the backroom is rendered on its
// first visit and cached (dynamicParams), and the backroom's saves revalidate these pages.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCatalog()).map((product) => ({ slug: product.slug }));
}

// The product at this address; an address it had before a rename in the backroom redirects.
// Temporary (307), not permanent: browsers cache a 308, and renaming back would then loop.
async function find(slug: string) {
  const product = await getCatalogProduct(slug);
  if (product) return product;
  const moved = await getMovedProduct(slug);
  if (moved) redirect(`/products/${moved.slug}`);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await find((await params).slug);
  return createPageMetadata({
    path: `/products/${product.slug}`,
    title: `${product.name} — Preview`,
    description: `${product.tagline} Preview the upcoming Reé collection from Bangladesh.`,
    image: { url: product.images[0].src, alt: product.images[0].alt },
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = await find((await params).slug);
  const related = relatedTo(await getCatalog(), product);
  return <CatalogScope>{product.kind === "story" ? <ProductStory product={product} related={related} /> : <ProductClassic product={product} related={related} />}</CatalogScope>;
}
