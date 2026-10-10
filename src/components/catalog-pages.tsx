import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { collectionProducts, collections, type Collection } from "../data/collections";
import { products, productsFor, type Department } from "../data/products";
import { ChipNav, EmptyNote, PageButton, PageIntro, ShopGrid, SitePage, cardPatch, cloths, hoverImage, sectionTitle, tilts, type Chip } from "./site-page";

// The shop's listing pages: everything (/shop), one department (/men, /women, /kids), the
// collections (/collections) and one collection (/collections/[slug]). Server components; the
// landing page's links lead here instead of scrolling it. Copy is sample content.

const departmentChips: Chip[] = [
  { label: "All", href: "/shop", count: products.length },
  { label: "Men", href: "/men", count: productsFor("men").length },
  { label: "Women", href: "/women", count: productsFor("women").length },
  { label: "Kids", href: "/kids", count: productsFor("kids").length },
];

const collectionChips: Chip[] = collections.map((collection) => ({ label: collection.name, href: `/collections/${collection.slug}`, count: collectionProducts(collection).length }));

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

function CollectionLinks() {
  return (
    <section aria-labelledby="by-collection" className="pt-6">
      <h2 id="by-collection" className={`${sectionTitle} px-[3%] pb-4`}>
        Shop by collection
      </h2>
      <ChipNav label="Collections" chips={collectionChips} />
    </section>
  );
}

export function ShopPage() {
  return (
    <SitePage>
      <PageIntro eyebrow={`Shop · ${pieces(products.length)}`} title="Shop everything">
        Every piece from our first collections, from the plain tee you buy three of to the satin you save for the evening.
      </PageIntro>
      <ChipNav label="Shop by department" chips={departmentChips} current="/shop" />
      <ShopGrid products={products} label="All pieces" />
      <CollectionLinks />
    </SitePage>
  );
}

export function DepartmentPage({ department }: { department: Department }) {
  const copy = departments[department];
  const items = productsFor(department);
  return (
    <SitePage>
      <PageIntro eyebrow={`Shop · ${pieces(items.length)}`} title={copy.title}>
        {copy.intro}
      </PageIntro>
      <ChipNav label="Shop by department" chips={departmentChips} current={`/${department}`} />
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
      <CollectionLinks />
    </SitePage>
  );
}

export function CollectionsPage() {
  return (
    <SitePage>
      <PageIntro eyebrow={`Collections · ${collections.length}`} title="Collections">
        Six edits for the way we dress in Bengal: everyday cotton, slow weekends, the street, the cold weeks, the handloom workshops and the evenings out.
      </PageIntro>
      <ul className="grid gap-x-5 gap-y-8 border-t border-lp-border px-[3%] py-8 sm:grid-cols-2 lg:grid-cols-3 lg:py-[3%]">
        {collections.map((collection, index) => (
          <li key={collection.slug} style={{ "--lp-stagger": index % 3 } as CSSProperties} className="lp-reveal">
            <CollectionCard collection={collection} index={index} />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 px-[3%] pt-4">
        <PageButton href="/shop">Shop everything</PageButton>
      </div>
    </SitePage>
  );
}

function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const items = collectionProducts(collection);
  const cover = items[0].images[0];
  return (
    <Link href={`/collections/${collection.slug}`} className={`${cardPatch} group block p-2.5 [--lp-stitch-inset:5px] sm:p-3 ${cloths[index % cloths.length]} ${tilts[index % tilts.length]}`}>
      <div className="relative aspect-[5/4] overflow-hidden bg-lp-surface">
        <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 94vw" className={`object-cover ${hoverImage}`} style={{ objectPosition: cover.position }} />
      </div>
      <div className="px-1 pt-3 pb-1">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-lp-display text-[clamp(1.1rem,1.8cqw,1.6rem)] leading-tight uppercase">{collection.name}</h2>
          <span className="text-[11px] whitespace-nowrap uppercase opacity-75">{pieces(items.length)}</span>
        </div>
        <p className="mt-1 font-lp-serif text-[15px] italic opacity-85">{collection.tagline}</p>
      </div>
    </Link>
  );
}

export function CollectionPage({ collection }: { collection: Collection }) {
  const items = collectionProducts(collection);
  return (
    <SitePage>
      <PageIntro eyebrow={`Collection · ${pieces(items.length)}`} title={collection.name}>
        <p className="font-lp-serif text-lg leading-snug text-lp-text italic">{collection.tagline}</p>
        <p className="mt-3">{collection.blurb}</p>
      </PageIntro>
      <ChipNav label="Collections" chips={collectionChips} current={`/collections/${collection.slug}`} />
      <ShopGrid products={items} label={`${collection.name} pieces`} />
      <div className="flex flex-wrap gap-3 px-[3%]">
        <PageButton href="/collections">All collections</PageButton>
        <PageButton href="/shop" tone="text">
          Shop everything
        </PageButton>
      </div>
    </SitePage>
  );
}
