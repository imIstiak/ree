import type { Metadata } from "next";
import { createPageMetadata } from "../../../../lib/seo";
import { notFound, redirect } from "next/navigation";
import { SeasonPage } from "../../../../components/catalog-pages";
import { seasonLabel } from "../../../../data/collections";
import { getCollection, getCollections, getMovedCollection } from "../../../../lib/catalog";

// One page per published season of a published collection: /collections/nogor/s-1.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCollections()).flatMap((collection) => collection.seasons.map((season) => ({ slug: collection.slug, season: season.slug })));
}

// The season at this address. If the collection or the season was renamed in the backroom, the
// old address redirects to the current one.
async function find(params: PageProps<"/collections/[slug]/[season]">["params"]) {
  const { slug, season: seasonSlug } = await params;
  const collection = (await getCollection(slug)) ?? (await getMovedCollection(slug));
  const season = collection?.seasons.find((candidate) => candidate.slug === seasonSlug) ?? collection?.seasons.find((candidate) => candidate.previousSlugs?.includes(seasonSlug));
  if (!collection || !season) notFound();
  if (collection.slug !== slug || season.slug !== seasonSlug) redirect(`/collections/${collection.slug}/${season.slug}`);
  return { collection, season };
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]/[season]">): Promise<Metadata> {
  const { collection, season } = await find(params);
  return createPageMetadata({
    path: `/collections/${collection.slug}/${season.slug}`,
    title: `${collection.name} ${seasonLabel(season)} — Season Preview`,
    description: season.blurb || season.tagline || collection.blurb,
    ...(season.banner ? { image: { url: season.banner.src, alt: season.banner.alt } } : {}),
  });
}

export default async function Page({ params }: PageProps<"/collections/[slug]/[season]">) {
  const { collection, season } = await find(params);
  return <SeasonPage collection={collection} season={season} />;
}
