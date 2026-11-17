import "server-only";
import { listCollections } from "../../../../../../lib/backroom-data";
import type { ProductRow } from "../../../../../../lib/supabase";
import type { SeasonProduct } from "../../../../../../components/backroom/season-form";

// Every product, sorted for the season form's checklist: in this season, in this collection
// without a season, and elsewhere (with where it is now).
export async function seasonProductsFor(products: ProductRow[], collectionId: string, seasonId: string | null): Promise<SeasonProduct[]> {
  const collections = await listCollections();
  const where = (product: ProductRow): SeasonProduct["where"] => (seasonId && product.season_id === seasonId ? "this" : product.collection_id === collectionId && !product.season_id ? "collection" : "elsewhere");
  return products.map((product) => {
    const collection = collections.find((candidate) => candidate.id === product.collection_id);
    const season = collection?.seasons.find((candidate) => candidate.id === product.season_id);
    return {
      id: product.id,
      name: product.name,
      image: product.images[0]?.src,
      status: product.status,
      where: where(product),
      note: collection ? `${collection.name}${season ? ` · S-${season.number}` : ""}` : "No collection",
    };
  });
}
