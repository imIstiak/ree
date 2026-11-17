import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { collectionProducts, seasonLabel, seasonProducts, type Banner, type Collection, type Season } from "../data/collections";
import { productsFor, type Department, type Product } from "../data/products";
import { getCatalog, getCollections } from "../lib/catalog";
import { garmentCloth } from "./shop-ui";
import { ChipNav, EmptyNote, PageButton, PageIntro, ShopGrid, SitePage, bodyText, cardPatch, cloths, hoverImage, sectionTitle, tilts, type Chip } from "./site-page";

// The shop's listing pages: everything (/shop), one department (/men, /women, /kids), the
// collections (/collections), one collection (/collections/[slug], its seasons in turn) and one
// season (/collections/[slug]/[season]). Async server components reading the catalogue and the
// collections (src/lib/catalog.ts); the landing page's links lead here instead of scrolling it.

const departmentChips = (products: Product[]): Chip[] => [
  { label: "All", href: "/shop", count: products.length },
  { label: "Men", href: "/men", count: productsFor(products, "men").length },
  { label: "Women", href: "/women", count: productsFor(products, "women").length },
  { label: "Kids", href: "/kids", count: productsFor(products, "kids").length },
];

const collectionChips = (products: Product[], collections: Collection[]): Chip[] =>
  collections.map((collection) => ({ label: collection.name, href: `/collections/${collection.slug}`, count: collectionProducts(products, collection).length }));

const seasonHref = (collection: Collection, season: Season) => `/collections/${collection.slug}/${season.slug}`;
const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" });

// When a season runs, in words ("From 2 March 2027", "2 March – 30 April 2027").
function seasonDates(season: Season) {
  const start = season.startsOn ? longDate.format(new Date(season.startsOn)) : null;
  const end = season.endsOn ? longDate.format(new Date(season.endsOn)) : null;
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return null;
}

// A collection's or season's banner: one wide photograph in an emerald cloth frame, like the
// footer's photo patch.
function PageBanner({ banner }: { banner: Banner }) {
  return (
    <div className="px-[3%] pb-6">
      <div className="lp-patch -rotate-[.4deg] bg-lp-brand p-1.5 text-lp-brand-base shadow-xl shadow-black/30 [--lp-stitch-inset:3px] group-data-[lp-theme=light]/theme:shadow-black/12 sm:p-2 sm:[--lp-stitch-inset:4px]">
        <div className="relative aspect-[4/3] overflow-hidden bg-lp-surface sm:aspect-[21/8]">
          <Image src={banner.src} alt={banner.alt} fill priority sizes="94vw" className="object-cover" style={{ objectPosition: banner.position }} />
        </div>
      </div>
    </div>
  );
}

const departments: Record<Department, { title: string; intro: string }> = {
  men: {
    title: "Men",
    intro: "Heavy tees with words on the back, soft tailoring and the layer that lasts, cut with room for the heat. Unisex pieces are here too.",
  },
  women: {
    title: "Women",
    intro: "Satin for the evening, hand block print for the heat and easy tees for everything in between. Unisex pieces are here too.",
  },
  kids: {
    title: "Kids",
    intro: "Small sizes of the pieces we love most, in the same heavy cotton and hand-finished seams.",
  },
};

const pieces = (count: number) => `${count} ${count === 1 ? "piece" : "pieces"}`;

function CollectionLinks({ products, collections }: { products: Product[]; collections: Collection[] }) {
  return (
    <section aria-labelledby="by-collection" className="pt-6">
      <h2 id="by-collection" className={`${sectionTitle} px-[3%] pb-4`}>
        Shop by collection
      </h2>
      <ChipNav label="Collections" chips={collectionChips(products, collections)} />
    </section>
  );
}

export async function ShopPage() {
  const [products, collections] = await Promise.all([getCatalog(), getCollections()]);
  return (
    <SitePage>
      <PageIntro eyebrow={`Shop · ${pieces(products.length)}`} title="Shop everything">
        Every piece from our first collections, from the plain tee you buy three of to the satin you save for the evening.
      </PageIntro>
      <ChipNav label="Shop by department" chips={departmentChips(products)} current="/shop" />
      <ShopGrid products={products} label="All pieces" />
      <CollectionLinks products={products} collections={collections} />
    </SitePage>
  );
}

export async function DepartmentPage({ department }: { department: Department }) {
  const [products, collections] = await Promise.all([getCatalog(), getCollections()]);
  const copy = departments[department];
  const items = productsFor(products, department);
  return (
    <SitePage>
      <PageIntro eyebrow={`Shop · ${pieces(items.length)}`} title={copy.title}>
        {copy.intro}
      </PageIntro>
      <ChipNav label="Shop by department" chips={departmentChips(products)} current={`/${department}`} />
      {items.length > 0 ? (
        <ShopGrid products={items} label={`${copy.title}'s pieces`} />
      ) : (
        <EmptyNote
          title="Coming with a later drop"
          actions={
            <>
              <PageButton href="/women">Shop women</PageButton>
              <PageButton href="/men" tone="text">
                Shop men
              </PageButton>
            </>
          }
        >
          There is no kids&apos; range yet. Small sizes of our favourite pieces are on the way; until then, the rest of the shop is open.
        </EmptyNote>
      )}
      <CollectionLinks products={products} collections={collections} />
    </SitePage>
  );
}

export async function CollectionsPage() {
  const [products, collections] = await Promise.all([getCatalog(), getCollections()]);
  return (
    <SitePage>
      <PageIntro eyebrow={`Collections · ${collections.length}`} title="Collections">
        Every line we make, each told in seasons: everyday cotton, slow weekends, the street, the cold weeks, the handloom workshops and the evenings out.
      </PageIntro>
      <ul className="grid gap-x-5 gap-y-8 border-t border-lp-border px-[3%] py-8 sm:grid-cols-2 lg:grid-cols-3 lg:py-[3%]">
        {collections.map((collection, index) => (
          <li key={collection.slug} style={{ "--lp-stagger": index % 3 } as CSSProperties} className="lp-reveal">
            <CollectionCard collection={collection} items={collectionProducts(products, collection)} index={index} />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 px-[3%] pt-4">
        <PageButton href="/shop">Shop everything</PageButton>
      </div>
    </SitePage>
  );
}

function CollectionCard({ collection, items, index }: { collection: Collection; items: Product[]; index: number }) {
  // The collection's banner, else its first piece's photo; a collection can be empty while its
  // pieces are hidden in the backroom, and then it keeps a plain cloth.
  const piece = items[0]?.images[0];
  const cover = collection.banner ?? piece;
  // The colour picked in the backroom; else the frame is cut from the garment in the cover photo,
  // like every product card (a banner has no garment, so it keeps the palette cloth).
  const garment = collection.cardColor ? garmentCloth({ swatch: collection.cardColor }) : !collection.banner && piece ? garmentCloth(piece) : undefined;
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={`${cardPatch} group block p-2.5 [--lp-stitch-inset:5px] sm:p-3 ${garment ? "" : cloths[index % cloths.length]} ${tilts[index % tilts.length]}`}
      style={garment}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-lp-surface">
        {cover && <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 94vw" className={`object-cover ${hoverImage}`} style={{ objectPosition: cover.position }} />}
      </div>
      <div className="px-1 pt-3 pb-1">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-lp-display text-[clamp(1.1rem,1.8cqw,1.6rem)] leading-tight uppercase">{collection.name}</h2>
          <span className="text-[11px] whitespace-nowrap uppercase opacity-75">
            {pieces(items.length)}
            {collection.seasons.length > 0 && ` · ${collection.seasons.length} ${collection.seasons.length === 1 ? "season" : "seasons"}`}
          </span>
        </div>
        <p className="mt-1 font-lp-serif text-[15px] italic opacity-85">{collection.tagline}</p>
      </div>
    </Link>
  );
}

export async function CollectionPage({ collection }: { collection: Collection }) {
  const [products, collections] = await Promise.all([getCatalog(), getCollections()]);
  const items = collectionProducts(products, collection);
  // Pieces filed under the collection but no (published) season of it.
  const loose = items.filter((product) => !collection.seasons.some((season) => season.slug === product.season));
  return (
    <SitePage>
      <PageIntro eyebrow={`Collection · ${pieces(items.length)}`} title={collection.name}>
        <p className="font-lp-serif text-lg leading-snug text-lp-text italic">{collection.tagline}</p>
        <p className="mt-3">{collection.blurb}</p>
      </PageIntro>
      {collection.banner && <PageBanner banner={collection.banner} />}
      <ChipNav label="Collections" chips={collectionChips(products, collections)} current={`/collections/${collection.slug}`} />

      {collection.seasons.length === 0 ? (
        <ShopGrid products={items} label={`${collection.name} pieces`} />
      ) : (
        <>
          {collection.seasons.map((season) => {
            const list = seasonProducts(products, collection, season);
            const dates = seasonDates(season);
            return (
              <section key={season.slug} aria-labelledby={`season-${season.slug}`} className="border-t border-lp-border pt-8 lg:pt-[3%]">
                <div className="flex flex-wrap items-end justify-between gap-4 px-[3%]">
                  <div>
                    <p className="text-[11px] tracking-[.16em] text-lp-muted uppercase">
                      Season {season.number}
                      {dates && ` · ${dates}`}
                    </p>
                    <h2 id={`season-${season.slug}`} className={`${sectionTitle} mt-2`}>
                      <Link href={seasonHref(collection, season)} className="underline-offset-8 hover:underline">
                        {seasonLabel(season)}
                      </Link>
                    </h2>
                    {season.tagline && <p className="mt-2 font-lp-serif text-base text-lp-text italic">{season.tagline}</p>}
                  </div>
                  <PageButton href={seasonHref(collection, season)} tone="text">
                    The season
                  </PageButton>
                </div>
                {list.length > 0 ? (
                  <ShopGrid products={list} label={`${collection.name} ${seasonLabel(season)} pieces`} />
                ) : (
                  <p className={`${bodyText} px-[3%] py-8`}>The pieces for this season are on their way.</p>
                )}
              </section>
            );
          })}
          {loose.length > 0 && (
            <section aria-labelledby="more-from" className="border-t border-lp-border pt-8 lg:pt-[3%]">
              <h2 id="more-from" className={`${sectionTitle} px-[3%]`}>
                More from {collection.name}
              </h2>
              <ShopGrid products={loose} label={`More ${collection.name} pieces`} />
            </section>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-3 px-[3%]">
        <PageButton href="/collections">All collections</PageButton>
        <PageButton href="/shop" tone="text">
          Shop everything
        </PageButton>
      </div>
    </SitePage>
  );
}

export async function SeasonPage({ collection, season }: { collection: Collection; season: Season }) {
  const products = await getCatalog();
  const items = seasonProducts(products, collection, season);
  const dates = seasonDates(season);
  const seasonChips: Chip[] = collection.seasons.map((other) => ({
    label: seasonLabel(other),
    href: seasonHref(collection, other),
    count: seasonProducts(products, collection, other).length,
  }));
  return (
    <SitePage>
      <PageIntro eyebrow={`${collection.name} · Season ${season.number}${dates ? ` · ${dates}` : ""}`} title={season.name || `Season ${season.number}`}>
        {season.tagline && <p className="font-lp-serif text-lg leading-snug text-lp-text italic">{season.tagline}</p>}
        {season.blurb && <p className="mt-3">{season.blurb}</p>}
      </PageIntro>
      {season.banner && <PageBanner banner={season.banner} />}
      <ChipNav label={`${collection.name} seasons`} chips={seasonChips} current={seasonHref(collection, season)} />
      {items.length > 0 ? (
        <ShopGrid products={items} label={`${seasonLabel(season)} pieces`} />
      ) : (
        <p className={`${bodyText} px-[3%] py-10`}>The pieces for this season are on their way.</p>
      )}
      <div className="flex flex-wrap gap-3 px-[3%]">
        <PageButton href={`/collections/${collection.slug}`}>All of {collection.name}</PageButton>
        <PageButton href="/collections" tone="text">
          All collections
        </PageButton>
      </div>
    </SitePage>
  );
}
