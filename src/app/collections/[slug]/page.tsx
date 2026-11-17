import type { Metadata } from "next";
import { createPageMetadata } from "../../../lib/seo";
import { notFound } from "next/navigation";
import { CollectionPage } from "../../../components/catalog-pages";
import { getCollection, getCollections } from "../../../lib/catalog";

// One page per published collection (Supabase, or the starter set). New ones published in the
// backroom render on their first visit (dynamicParams); the backroom's saves revalidate them.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCollections()).map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = await getCollection((await params).slug);
  if (!collection) notFound();
  return createPageMetadata({
    path: `/collections/${collection.slug}`,
    title: `${collection.name} — Collection Preview`,
    description: collection.blurb || collection.tagline,
    ...(collection.banner ? { image: { url: collection.banner.src, alt: collection.banner.alt } } : {}),
  });
}

export default async function Page({ params }: PageProps<"/collections/[slug]">) {
  const collection = await getCollection((await params).slug);
  if (!collection) notFound();
  return <CollectionPage collection={collection} />;
}
