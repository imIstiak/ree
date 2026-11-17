import Link from "next/link";
import { notFound } from "next/navigation";
import { CrumbLabel } from "../../../../../../../components/backroom/crumbs";
import { SeasonForm } from "../../../../../../../components/backroom/season-form";
import { PageHead, quietButton } from "../../../../../../../components/backroom/ui";
import { getCollectionSummary, listProducts } from "../../../../../../../lib/backroom-data";
import { supabaseConfigured } from "../../../../../../../lib/supabase";
import { seasonProductsFor } from "../season-products";

export default async function NewSeasonPage({ params }: PageProps<"/backroom/collections/[id]/seasons/new">) {
  const collection = await getCollectionSummary((await params).id);
  if (!collection) notFound();
  const products = await listProducts();
  const nextNumber = Math.max(0, ...collection.seasons.map((season) => season.number)) + 1;
  return (
    <>
      <CrumbLabel id={collection.id} label={collection.name} />
      <PageHead kicker={collection.name} title={`New season · S-${nextNumber}`}>
        <Link href={`/backroom/collections/${collection.id}`} className={quietButton}>
          ← {collection.name}
        </Link>
      </PageHead>
      <SeasonForm
        collectionId={collection.id}
        collectionName={collection.name}
        collectionSlug={collection.slug}
        nextNumber={nextNumber}
        products={await seasonProductsFor(products, collection.id, null)}
        readOnly={!supabaseConfigured()}
      />
    </>
  );
}
