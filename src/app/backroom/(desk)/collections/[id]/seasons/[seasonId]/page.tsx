import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteSeason } from "../../../../../catalog-actions";
import { CrumbLabel } from "../../../../../../../components/backroom/crumbs";
import { DeleteButton } from "../../../../../../../components/backroom/delete-button";
import { SeasonForm } from "../../../../../../../components/backroom/season-form";
import { Notice, PageHead, quietButton } from "../../../../../../../components/backroom/ui";
import { seasonLabel } from "../../../../../../../data/collections";
import { getCollectionSummary, getSeasonRow, listProducts } from "../../../../../../../lib/backroom-data";
import { supabaseConfigured } from "../../../../../../../lib/supabase";
import { seasonProductsFor } from "../season-products";

export default async function EditSeasonPage({ params, searchParams }: PageProps<"/backroom/collections/[id]/seasons/[seasonId]">) {
  const { id, seasonId } = await params;
  const [collection, season] = await Promise.all([getCollectionSummary(id), getSeasonRow(seasonId)]);
  if (!collection || !season || season.collection_id !== collection.id) notFound();
  const { saved } = await searchParams;
  const live = supabaseConfigured();
  const shown = collection.status === "published" && season.status === "published";

  return (
    <>
      <CrumbLabel id={collection.id} label={collection.name} />
      <CrumbLabel id={season.id} label={seasonLabel(season)} />
      <PageHead kicker={`${collection.name} · Season ${season.number}`} title={season.name || `Season ${season.number}`}>
        {shown && (
          <Link href={`/collections/${collection.slug}/${season.slug}`} className={quietButton}>
            View on the shop ↗
          </Link>
        )}
        <Link href={`/backroom/collections/${collection.id}`} className={quietButton}>
          ← {collection.name}
        </Link>
      </PageHead>
      {saved && (
        <div className="mb-6">
          <Notice tone="good">
            {saved === "new" ? "Created." : "Saved."} {shown ? "It's on the shop." : `It's hidden from the shop until both the season and ${collection.name} are published.`}
          </Notice>
        </div>
      )}
      <SeasonForm
        key={season.updated_at}
        collectionId={collection.id}
        collectionName={collection.name}
        collectionSlug={collection.slug}
        season={season}
        nextNumber={season.number}
        products={await seasonProductsFor(await listProducts(), collection.id, season.id)}
        readOnly={!live}
      />
      {live && (
        <form action={deleteSeason} className="mt-10 border-t border-dashed border-lp-border pt-6">
          <input type="hidden" name="id" value={season.id} />
          <DeleteButton name={`${collection.name} ${seasonLabel(season)}`} what="its banner (its products stay in the collection)" />
        </form>
      )}
    </>
  );
}
