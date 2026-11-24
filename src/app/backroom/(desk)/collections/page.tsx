import Image from "next/image";
import Link from "next/link";
import { Notice, PageHead, panel, primaryButton } from "../../../../components/backroom/ui";
import { seasonLabel } from "../../../../data/collections";
import { listCollections } from "../../../../lib/backroom-data";
import { supabaseConfigured } from "../../../../lib/supabase";

const statusCloth = {
  published: "bg-lp-brand-cloth text-lp-brand-base",
  draft: "bg-lp-accent text-lp-ink",
  archived: "bg-lp-text/10 text-lp-muted",
} as const;

// Every collection in the shop's order, with its seasons and how many pieces are filed in each.
export default async function CollectionsPage({ searchParams }: PageProps<"/backroom/collections">) {
  const params = await searchParams;
  const collections = await listCollections();
  const live = supabaseConfigured();
  return (
    <>
      <PageHead kicker={`${collections.filter((collection) => collection.status === "published").length} on the shop · ${collections.length} in all`} title="Collections">
        {live && (
          <Link href="/backroom/collections/new" className={primaryButton}>
            + New collection
          </Link>
        )}
      </PageHead>
      {params.deleted && (
        <div className="mb-6">
          <Notice tone="good">The collection was deleted, with its seasons. Its products are still in the shop, without a collection.</Notice>
        </div>
      )}
      {collections.length === 0 ? (
        <div className={`${panel} px-6 py-12 text-center`}>
          <p className="font-lp-display text-xl uppercase">No collections yet</p>
          <p className="mt-2 text-[12px] text-lp-muted">A collection is a line, like Nogor; its seasons (S-1, S-2…) hold the pieces.</p>
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {collections.map((collection, index) => (
            <li key={collection.id}>
              <Link
                href={`/backroom/collections/${collection.id}`}
                className={`${panel} block p-3 transition-[translate,rotate,box-shadow] hover:-translate-y-0.5 hover:rotate-0 hover:shadow-md motion-reduce:transition-none ${index % 2 ? "rotate-[.3deg]" : "-rotate-[.3deg]"}`}
              >
                <span className="relative block aspect-[21/8] overflow-hidden bg-lp-surface">
                  {collection.banner ? (
                    <Image src={collection.banner.src} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" style={{ objectPosition: collection.banner.position }} />
                  ) : (
                    <span className="grid size-full place-items-center text-[11px] text-lp-muted">No banner</span>
                  )}
                </span>
                <span className="flex items-start justify-between gap-3 px-1 pt-3">
                  <span className="min-w-0">
                    <span className="block truncate font-lp-display text-lg leading-tight uppercase">{collection.name}</span>
                    <span className="block text-[11px] text-lp-muted">
                      /collections/{collection.slug} · {collection.products} {collection.products === 1 ? "piece" : "pieces"}
                    </span>
                  </span>
                  <span className={`lp-patch flex-none px-1.5 py-0.5 text-[9px] tracking-[.1em] uppercase [--lp-stitch-inset:2px] ${statusCloth[collection.status]}`}>{collection.status}</span>
                </span>
                <span className="flex flex-wrap gap-1.5 px-1 pt-3 pb-1">
                  {collection.seasons.length === 0 ? (
                    <span className="text-[11px] text-lp-muted">No seasons yet</span>
                  ) : (
                    collection.seasons.map((season) => (
                      <span key={season.id} className={`lp-patch px-2 py-1 text-[10px] tracking-[.06em] [--lp-stitch-inset:2px] ${season.status === "published" ? "bg-lp-brand/12" : "bg-lp-text/6 text-lp-muted"}`}>
                        {seasonLabel(season)} · {season.products}
                      </span>
                    ))
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
