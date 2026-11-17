import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCollection } from "../../../catalog-actions";
import { CollectionForm } from "../../../../../components/backroom/collection-form";
import { CrumbLabel } from "../../../../../components/backroom/crumbs";
import { DeleteButton } from "../../../../../components/backroom/delete-button";
import { Notice, PageHead, panel, primaryButton, quietButton } from "../../../../../components/backroom/ui";
import { seasonLabel } from "../../../../../data/collections";
import { getCollectionSummary, listProducts } from "../../../../../lib/backroom-data";
import { supabaseConfigured } from "../../../../../lib/supabase";

// One collection: its details and banner, then its seasons.
export default async function EditCollectionPage({ params, searchParams }: PageProps<"/backroom/collections/[id]">) {
  const collection = await getCollectionSummary((await params).id);
  if (!collection) notFound();
  const query = await searchParams;
  const live = supabaseConfigured();
  // The photo the shop's card falls back to (its first published piece's), for the card colour
  // picker when there is no banner.
  const pieceCover = (await listProducts()).find((product) => product.collection_id === collection.id && product.status === "published" && product.images.length > 0)?.images[0].src;

  return (
    <>
      <CrumbLabel id={collection.id} label={collection.name} />
      <PageHead kicker={`Collection · ${collection.products} ${collection.products === 1 ? "piece" : "pieces"}`} title={collection.name}>
        {collection.status === "published" && (
          <Link href={`/collections/${collection.slug}`} className={quietButton}>
            View on the shop ↗
          </Link>
        )}
        <Link href="/backroom/collections" className={quietButton}>
          ← All collections
        </Link>
      </PageHead>
      {query.saved && (
        <div className="mb-6">
          <Notice tone="good">{query.saved === "new" ? "Created. Now add its first season below." : "Saved."}</Notice>
        </div>
      )}
      {query["season-deleted"] && (
        <div className="mb-6">
          <Notice tone="good">The season was deleted. Its products stay in {collection.name}, without a season.</Notice>
        </div>
      )}

      <CollectionForm key={collection.updated_at} collection={collection} pieceCover={pieceCover} readOnly={!live} />

      <section aria-labelledby="seasons" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
          <div>
            <p className="text-[10px] tracking-[.16em] text-lp-muted uppercase">S-1, S-2, …</p>
            <h2 id="seasons" className="mt-1 font-lp-display text-2xl uppercase">
              Seasons
            </h2>
          </div>
          {live && (
            <Link href={`/backroom/collections/${collection.id}/seasons/new`} className={primaryButton}>
              + New season
            </Link>
          )}
        </div>
        {collection.seasons.length === 0 ? (
          <p className={`${panel} px-6 py-8 text-[12px] text-lp-muted`}>No seasons yet. A season is one drop of {collection.name}: give it a number, a title, a banner and its pieces.</p>
        ) : (
          <ul className="space-y-3">
            {collection.seasons.map((season) => (
              <li key={season.id}>
                <Link
                  href={`/backroom/collections/${collection.id}/seasons/${season.id}`}
                  className={`${panel} flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none`}
                >
                  <span>
                    <span className="block font-lp-display text-base uppercase">{seasonLabel(season)}</span>
                    <span className="block text-[11px] text-lp-muted">
                      /collections/{collection.slug}/{season.slug} · {season.products} {season.products === 1 ? "piece" : "pieces"}
                      {season.starts_on && ` · from ${season.starts_on}`}
                    </span>
                  </span>
                  <span className="text-[10px] tracking-[.1em] uppercase opacity-70">{season.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {live && (
        <form action={deleteCollection} className="mt-10 border-t border-dashed border-lp-border pt-6">
          <input type="hidden" name="id" value={collection.id} />
          <DeleteButton name={collection.name} what="its seasons and banners (its products stay in the shop)" />
        </form>
      )}
    </>
  );
}
