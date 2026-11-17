import { getCatalog } from "../../../lib/catalog";

// The published catalogue for the browser: the bag in the header, /cart and /checkout look pieces
// up by slug here (useCatalog in catalog-client.ts). Story chapters are left out; only the story
// pages use them, and those are server-rendered. GET handlers are dynamic, so this reads fresh data.
export async function GET() {
  const products = (await getCatalog()).map(({ story, ...product }) => {
    void story;
    return product;
  });
  return Response.json(products, { headers: { "Cache-Control": "no-store" } });
}
