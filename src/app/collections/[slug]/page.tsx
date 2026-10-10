import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "../../../components/catalog-pages";
import { collections, getCollection } from "../../../data/collections";

// One page per collection in src/data/collections.ts, all prerendered; unknown slugs are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = getCollection((await params).slug);
  if (!collection) return {};
  return { title: `ঋ - Ree | ${collection.name}`, description: collection.blurb };
}

export default async function Page({ params }: PageProps<"/collections/[slug]">) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  return <CollectionPage collection={collection} />;
}
