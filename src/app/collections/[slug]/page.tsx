import type { Metadata } from "next";
import { createPageMetadata } from "../../../lib/seo";
import { notFound, redirect } from "next/navigation";
import { CollectionPage } from "../../../components/catalog-pages";
import { getCollection, getCollections, getMovedCollection } from "../../../lib/catalog";

// One page per published collection (Supabase, or the starter set). New ones published in the
// backroom render on their first visit (dynamicParams); the backroom's saves revalidate them.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCollections()).map((collection) => ({ slug: collection.slug }));
}

// The collection at this address; an address it had before a rename in the backroom redirects.
async function find(slug: string) {
  const collection = await getCollection(slug);
  if (collection) return collection;
  const moved = await getMovedCollection(slug);
  if (moved) redirect(`/collections/${moved.slug}`);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = await find((await params).slug);
  return createPageMetadata({
    path: `/collections/${collection.slug}`,
    title: `${collection.name} — Collection Preview`,
    description: collection.blurb || collection.tagline,
    ...(collection.banner ? { image: { url: collection.banner.src, alt: collection.banner.alt } } : {}),
  });
}

export default async function Page({ params }: PageProps<"/collections/[slug]">) {
  const collection = await find((await params).slug);
  return <CollectionPage collection={collection} />;
}
