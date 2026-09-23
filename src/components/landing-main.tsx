import Image from "next/image";
import { LandingHero } from "./landing-hero";
import { Icon } from "./landing-icons";
import { StoryTiles } from "./story-tiles";
import Link from "next/link";
import { display, mono } from "./landing-fonts";
import type { CSSProperties, ReactNode } from "react";
import { LANDING_ROOT_ID, ThemeControls, ThemeScript } from "./theme-controls";

// Visual spec: docs/landing-design-spec.json. Theme tokens live in src/app/globals.css.

type Photo = {
  src: string;
  alt: string;
  position?: string;
};

// Unsplash License photos; credits in docs/landing-image-credits.md.
const photos = {
  storyTee: { src: "/landing/story-tee.jpg", alt: "A white T-shirt on a hanger beside straw hats and a woven bag", position: "50% 50%" },
  storyTeeModel: { src: "/landing/story-tee-model.jpg", alt: "A woman in a plain black T-shirt with her arms crossed against a patterned backdrop", position: "50% 25%" },
  storyDropShoulder: { src: "/landing/story-drop-shoulder.jpg", alt: "Two coral printed T-shirts hanging on a wooden pegboard", position: "35% 50%" },
  storyDropShoulderModel: { src: "/landing/story-drop-shoulder-model.jpg", alt: "A man in a black T-shirt and sunglasses beside a sunlit wall", position: "50% 30%" },
  storyFootwear: { src: "/landing/story-footwear.jpg", alt: "A close-up of a beige sneaker mid-step over fallen leaves", position: "50% 50%" },
  camelCoat: { src: "/landing/style-camel-coat.jpg", alt: "A woman in a camel coat in warm evening light", position: "50% 30%" },
  redBeanie: { src: "/landing/style-red-beanie.jpg", alt: "A woman in a red beanie, tinted glasses and a plaid jacket", position: "50% 25%" },
  pinkFur: { src: "/landing/style-pink-fur.jpg", alt: "A woman in a pale fur coat and gold aviator sunglasses", position: "50% 30%" },
  redGown: { src: "/landing/texture-red-gown.jpg", alt: "", position: "50% 70%" },
  tees: { src: "/landing/collection-tees.jpg", alt: "Black crew-neck T-shirts on hangers", position: "50% 40%" },
  hoodie: { src: "/landing/collection-hoodie.jpg", alt: "A woman in a peach hoodie and glasses", position: "50% 40%" },
  suit: { src: "/landing/collection-suit.jpg", alt: "A close-up of a pinstripe suit jacket and a ringed hand", position: "50% 50%" },
  leatherJacket: { src: "/landing/collection-leather-jacket.jpg", alt: "A man in a black leather jacket and sunglasses", position: "50% 35%" },
  tote: { src: "/landing/collection-tote.jpg", alt: "A canvas tote bag hanging beside a wooden door", position: "35% 50%" },
  lifeIsShort: { src: "/products/life-is-short-tee-08.jpg", alt: "The back of the Life is short tee, printed LIFE IS SHORT, in a lounge with arched niches", position: "50% 35%" },
  sunglasses: { src: "/landing/about-sunglasses.jpg", alt: "A woman in round sunglasses and a navy blazer", position: "50% 30%" },
  journalBeanie: { src: "/landing/journal-red-beanie.jpg", alt: "A woman in a red beanie and mirrored sunglasses", position: "50% 30%" },
  journalBeret: { src: "/landing/journal-red-beret.jpg", alt: "A woman in a red beret and white shirt", position: "50% 25%" },
  journalLeather: { src: "/landing/journal-leather.jpg", alt: "A young man in a black leather jacket", position: "50% 30%" },
  journalSuit: { src: "/landing/journal-suit.jpg", alt: "A black-and-white portrait of a woman in a suit on a stool", position: "50% 40%" },
  redLips: { src: "/landing/footer-red-lips.jpg", alt: "A close-up portrait of a woman with red lipstick", position: "50% 47%" },
  fur: { src: "/landing/footer-fur.jpg", alt: "", position: "50% 40%" },
} satisfies Record<string, Photo>;

type StoryTile = {
  id: string;
  photo: Photo;
  // short: image with its caption below. tall: worn shot, no caption. hung: short tile aligned to the
  // bottom of the row with its caption above (the sketch's middle tile).
  shape: "short" | "tall" | "hung";
  // Resting tilt in degrees (hover straightens it) and the cloth + stitch colours as full class literals.
  tilt: number;
  frame: string;
  caption?: { label: string; count: string };
};

// "Find your story": five columns alternating short / tall — product shot, worn, product shot, worn, footwear.
// Rendered by story-tiles.tsx as tilted cloth patches with Framer Motion hover and scroll-in animation.
const storyTiles: StoryTile[] = [
  { id: "story-tee", photo: photos.storyTee, shape: "short", tilt: -2, frame: "bg-lp-patch-mustard outline-lp-ink/45", caption: { label: "T-shirt", count: "24 items" } },
  { id: "story-tee-model", photo: photos.storyTeeModel, shape: "tall", tilt: 1.4, frame: "bg-lp-patch-indigo outline-lp-canvas/70" },
  { id: "story-drop-shoulder", photo: photos.storyDropShoulder, shape: "hung", tilt: -1.6, frame: "bg-lp-patch-madder outline-lp-canvas/70", caption: { label: "Drop-shoulder", count: "18 items" } },
  { id: "story-drop-shoulder-model", photo: photos.storyDropShoulderModel, shape: "tall", tilt: 1.8, frame: "bg-lp-patch-olive outline-lp-canvas/70" },
  { id: "story-footwear", photo: photos.storyFootwear, shape: "short", tilt: -1.2, frame: "bg-lp-patch-terracotta outline-lp-ink/40", caption: { label: "Footwear", count: "12 items" } },
];

// The section intro set as a patchwork: each phrase is a cloth patch with an inset running stitch,
// overlapping its neighbours at slight angles. Colours are theme tokens so both themes work.
const patchwork = [
  { text: "We create", className: "bg-lp-accent text-lp-ink -rotate-2" },
  { text: "timeless clothing", className: "-ml-1.5 bg-lp-card text-lp-text rotate-1" },
  { text: "that blends", className: "-mt-1 ml-2 bg-lp-spotlight text-lp-text rotate-2" },
  { text: "heritage craft", className: "-mt-1.5 -ml-1 bg-lp-olive text-lp-ink -rotate-1" },
  { text: "with everyday comfort.", className: "-mt-1 ml-5 bg-lp-deep text-lp-text rotate-1" },
];

const collectionTabs = [
  { label: "Casual wear", href: "#item-tee" },
  { label: "Loungewear", href: "#item-hoodie" },
  { label: "Street style", href: "#item-editorial" },
  { label: "Outerwear", href: "#item-jacket" },
  { label: "Handloom", href: "#item-tote" },
  { label: "Formal wear", href: "#item-suit" },
];

// The collection is a brick wall in running bond. Desktop: six-column base, bricks two columns wide;
// row 2 shifts by one column and is closed with cloth half-bricks (c1, c4); the featured edit is a
// two-by-two stone at c5-6 / r2-3; a cloth call-to-action brick completes row 3. Mobile flows this
// array in order on a four-column base (two bricks, then half + brick + half, ...). `place` holds
// full class literals because Tailwind only sees complete strings.
type Brick =
  | { kind: "product"; id: string; label: string; price: string; photo: Photo; href: string; place: string; featured?: boolean }
  | { kind: "cloth" | "cta"; id: string; cloth: string; place: string };

const bricks: Brick[] = [
  { kind: "product", id: "item-tee", label: "Basic tee", price: "৳ 1,450", photo: photos.tees, href: "/products/basic-tee", place: "col-span-2 lg:col-start-1 lg:row-start-1" },
  { kind: "product", id: "item-hoodie", label: "Crop hoodie", price: "৳ 3,200", photo: photos.hoodie, href: "/products/crop-hoodie", place: "col-span-2 lg:col-start-3 lg:row-start-1" },
  { kind: "cloth", id: "brick-half-1", cloth: "bg-lp-patch-madder outline-lp-canvas/60", place: "col-span-1 lg:col-start-1 lg:row-start-2" },
  { kind: "product", id: "item-suit", label: "Pinstripe suit", price: "৳ 3,850", photo: photos.suit, href: "/products/pinstripe-suit", place: "col-span-2 lg:col-start-5 lg:row-start-1" },
  { kind: "cloth", id: "brick-half-2", cloth: "bg-lp-patch-indigo outline-lp-canvas/60", place: "col-span-1 lg:col-start-4 lg:row-start-2" },
  { kind: "product", id: "item-jacket", label: "Leather jacket", price: "৳ 4,600", photo: photos.leatherJacket, href: "/products/leather-jacket", place: "col-span-2 lg:col-start-2 lg:row-start-2" },
  { kind: "product", id: "item-tote", label: "Canvas tote", price: "৳ 1,950", photo: photos.tote, href: "/products/canvas-tote", place: "col-span-2 lg:col-start-1 lg:row-start-3" },
  { kind: "product", id: "item-editorial", label: "Life is short", price: "Story", photo: photos.lifeIsShort, href: "/products/life-is-short-tee", place: "col-span-4 lg:col-span-2 lg:col-start-5 lg:row-span-2 lg:row-start-2", featured: true },
  { kind: "cloth", id: "brick-half-3", cloth: "bg-lp-patch-olive outline-lp-canvas/60", place: "col-span-1 lg:hidden" },
  { kind: "cta", id: "brick-cta", cloth: "bg-lp-patch-mustard outline-lp-ink/40", place: "col-span-2 lg:col-start-3 lg:row-start-3" },
  { kind: "cloth", id: "brick-half-4", cloth: "bg-lp-patch-terracotta outline-lp-ink/40", place: "col-span-1 lg:hidden" },
];

// Cloth bricks: a patch colour with grain and an inset running stitch (the stitch colour rides in `cloth`).
const clothBrick = "outline-1 outline-dashed -outline-offset-4 before:pointer-events-none before:absolute before:inset-0 before:lp-noise before:opacity-25 before:mix-blend-overlay before:content-['']";

const values = [
  { icon: "comfort", title: "Everyday comfort", body: "Soft, breathable fabrics cut for heat, rain, and the long Dhaka day." },
  { icon: "quality", title: "Premium quality", body: "Handloom cotton and considered finishing, made to outlast the season." },
  { icon: "delivery", title: "Fast delivery", body: "Quick, reliable delivery across Bangladesh, packed without excess." },
  { icon: "timeless", title: "Timeless design", body: "Quiet silhouettes rooted in heritage that never fall out of step." },
] as const;

// Stagger relative to column width: 0 / 80% / 0 / 55% on desktop, two staggered columns on mobile.
const journalPosts = [
  { date: "12 Sep 2026", photo: photos.journalBeanie, offset: "" },
  { date: "08 Sep 2026", photo: photos.journalBeret, offset: "mt-[40%] lg:mt-[80%]" },
  { date: "02 Sep 2026", photo: photos.journalLeather, offset: "-mt-[40%] lg:mt-0" },
  { date: "27 Aug 2026", photo: photos.journalSuit, offset: "lg:mt-[55%]" },
];

const styleWords = ["Streetwear", "Linen sets", "Overshirts", "Handloom", "Outerwear", "Knitwear", "Formal wear"];

const footerLinks = [
  { label: "Home", href: "#top" },
  { label: "About us", href: "#about" },
  { label: "Collections", href: "#collection" },
  { label: "Shop", href: "#categories" },
  { label: "Journal", href: "#journal" },
  { label: "Contact us", href: "#footer" },
];

const legalLinks = ["Privacy policy", "Terms & conditions", "Cookie policy"];

const socials = [
  { icon: "instagram", label: "Instagram" },
  { icon: "facebook", label: "Facebook" },
  { icon: "linkedin", label: "LinkedIn" },
  { icon: "x", label: "X" },
] as const;

function Photo({ photo, sizes, priority, className = "" }: { photo: Photo; sizes: string; priority?: boolean; className?: string }) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      style={{ objectPosition: photo.position }}
    />
  );
}

// Card images scale slightly while their `group` parent is hovered.
const hoverImage = "transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100";

const bodyText = "text-xs leading-[1.65] text-lp-muted sm:text-[13px]";

function Label({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "text" | "outline" }) {
  const tones = {
    accent: "bg-lp-accent text-lp-ink",
    text: "bg-lp-text text-lp-bg",
    outline: "border border-lp-border text-lp-muted",
  };
  return <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] leading-tight whitespace-nowrap uppercase ${tones[tone]}`}>{children}</span>;
}

function Button({ href, children, tone = "accent" }: { href: string; children: ReactNode; tone?: "accent" | "text" }) {
  const tones = {
    accent: "bg-lp-accent text-lp-ink hover:bg-lp-text hover:text-lp-bg",
    text: "bg-lp-text text-lp-bg hover:bg-lp-accent hover:text-lp-ink",
  };
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 min-w-40 items-center justify-between gap-6 px-3.5 text-[11px] font-medium tracking-wide uppercase transition-colors motion-reduce:transition-none sm:min-h-9 ${tones[tone]}`}
    >
      {children}
      <Icon name="arrowRight" />
    </a>
  );
}

function Rail({ href, first, last, label, children }: { href: string; first: string; last: string; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-y border-lp-border px-[3%] py-3">
      <Button href={href}>{children}</Button>
      <div className="flex gap-1.5">
        <a href={first} aria-label={`First ${label}`} className="grid size-11 place-items-center border border-lp-border text-lp-text transition-colors hover:border-lp-accent sm:size-8">
          <Icon name="chevronLeft" />
        </a>
        <a href={last} aria-label={`Last ${label}`} className="grid size-11 place-items-center bg-lp-accent text-lp-ink transition-colors hover:bg-lp-text hover:text-lp-bg sm:size-8">
          <Icon name="chevronRight" />
        </a>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-6 lp-divider sm:h-10" aria-hidden="true" />;
}

function Wordmark({ className }: { className: string }) {
  return (
    <p className={`flex justify-between font-lp-display leading-[.8] uppercase select-none ${className}`} aria-hidden="true">
      <span>R</span>
      <span>E</span>
      <span>E</span>
    </p>
  );
}

function Markers({ className }: { className: string }) {
  const marker = "text-[10px] tracking-[.12em] text-lp-muted";
  return (
    <div className={`pointer-events-none absolute inset-x-[3%] hidden items-center gap-3 lg:flex ${className}`} aria-hidden="true">
      <span className={marker}>{`// 01`}</span>
      <i className="h-px flex-1 bg-lp-border" />
      <span className={marker}>{`// 02`}</span>
      <span className="flex-[1.9]" />
      <span className={marker}>{`// 03`}</span>
      <i className="h-px flex-1 bg-lp-border" />
      <span className={marker}>{`// 04`}</span>
    </div>
  );
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="lp-newsprint font-lp-display text-[clamp(1.4rem,2.45cqw,2.5rem)] leading-[1.15] tracking-[-.025em] text-lp-text uppercase">
      {children}
    </h2>
  );
}

function Patchwork() {
  return (
    <p className="flex max-w-72 flex-wrap items-start text-[11px] leading-snug sm:max-w-80 sm:text-xs">
      {patchwork.map((patch) => (
        <span
          key={patch.text}
          className={`relative px-3 py-2 whitespace-nowrap outline-1 outline-dashed -outline-offset-4 outline-current/45 shadow-md shadow-black/30 group-data-[lp-theme=light]/theme:shadow-black/10 before:pointer-events-none before:absolute before:inset-0 before:lp-noise before:opacity-20 before:mix-blend-overlay before:content-[''] ${patch.className}`}
        >
          {patch.text}{" "}
        </span>
      ))}
    </p>
  );
}

export function LandingMain() {
  return (
    // globals.css locks body scrolling for the coming-soon page, so this wrapper is the scroll container.
    // It also carries the landing theme (data-lp-theme); see landing-theme-toggle.tsx.
    <div
      id={LANDING_ROOT_ID}
      data-lp-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${mono.variable} group/theme h-svh overflow-x-hidden overflow-y-auto scroll-smooth bg-lp-bg font-lp-mono text-lp-text transition-colors duration-300 motion-reduce:scroll-auto motion-reduce:transition-none`}
    >
      <ThemeScript rootId={LANDING_ROOT_ID} />
      {/* Floating dock on the right edge, same control as the coming-soon page. */}
      <ThemeControls rootId={LANDING_ROOT_ID} />
      <main className="@container w-full overflow-hidden bg-lp-bg [&_:is(a,summary):focus-visible]:outline [&_:is(a,summary):focus-visible]:outline-offset-2 [&_:is(a,summary):focus-visible]:outline-lp-accent">
        <LandingHero />

        {/* Find your story */}
        <section id="categories" aria-labelledby="categories-title" className="scroll-mt-4 bg-lp-surface pt-[8.6%]">
          <div className="lp-reveal flex flex-col justify-between gap-6 px-[3%] pb-[3%] sm:flex-row sm:items-end">
            <SectionTitle id="categories-title">Find<br />your story</SectionTitle>
            <Patchwork />
          </div>

          <StoryTiles
            tiles={storyTiles.map((tile) => ({
              id: tile.id,
              shape: tile.shape,
              tilt: tile.tilt,
              frame: tile.frame,
              caption: tile.caption && (
                <div className="flex items-center justify-between gap-2">
                  <Label>{tile.caption.label}</Label>
                  <Label tone="outline">{tile.caption.count}</Label>
                </div>
              ),
              image: <Photo photo={tile.photo} sizes="(min-width: 1024px) 20vw, 50vw" />,
            }))}
          />

          <div className="pb-[10%]">
            <Rail href="#collection" first={`#${storyTiles[0].id}`} last={`#${storyTiles[storyTiles.length - 1].id}`} label="category">
              Browse all
            </Rail>
          </div>
        </section>

        {/* Designed for every style */}
        <section id="style" aria-labelledby="style-title" className="relative isolate min-h-[760px] scroll-mt-4 overflow-hidden bg-lp-bg lg:aspect-[254/198] lg:min-h-0">
          <div className="absolute -inset-[10%] -z-20 scale-y-50 -rotate-12 opacity-40 blur-2xl saturate-150" aria-hidden="true">
            <Photo photo={photos.redGown} sizes="100vw" />
          </div>
          <div className="absolute inset-0 -z-10 lp-noise opacity-25 mix-blend-overlay" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-lp-bg)_92%,transparent)_20%,color-mix(in_oklab,var(--color-lp-bg)_45%,transparent)_65%,color-mix(in_oklab,var(--color-lp-bg)_10%,transparent))]" aria-hidden="true" />

          <div className="lp-reveal absolute inset-x-[3%] top-[6%] z-10 grid justify-items-center gap-3 text-center lg:top-[13%]">
            <SectionTitle id="style-title">Designed<br />for every style</SectionTitle>
            <p className={`${bodyText} max-w-80`}>We create timeless pieces that shift across seasons and everyday moments.</p>
          </div>

          <Markers className="top-[54%]" />
          <Wordmark className="lp-drift absolute inset-x-[3%] bottom-[18%] -z-10 lp-texture-text text-[23.8cqw] opacity-60 lg:top-[60%] lg:bottom-auto" />

          <ul className="lp-drift-x absolute inset-x-0 bottom-[8%] flex justify-between gap-6 overflow-hidden border-y border-lp-border px-[3%] py-2 text-[10px] whitespace-nowrap text-lp-muted uppercase lg:top-[82%] lg:bottom-auto" aria-label="Styles">
            {styleWords.map((word, index) => (
              <li key={word} className={index > 2 && index < 6 ? "hidden lg:block" : ""}>{word}</li>
            ))}
          </ul>

          <figure className="lp-fade lp-unveil group absolute top-[24%] left-1/2 z-10 w-[62%] -translate-x-1/2 overflow-hidden bg-[#7a3a20] shadow-2xl shadow-black/60 group-data-[lp-theme=light]/theme:shadow-black/15 lg:top-[30%] lg:w-[31%]">
            <div className="relative aspect-[3/4] lg:aspect-[315/450]">
              <Photo photo={photos.camelCoat} sizes="(min-width: 1024px) 420px, 62vw" className={hoverImage} />
            </div>
            <a href="#collection" className="absolute inset-x-[8%] bottom-[5%] flex min-h-9 items-center justify-between bg-lp-text px-3 text-[10px] text-lp-bg uppercase transition-colors hover:bg-lp-accent hover:text-lp-ink">
              Shop this look <Icon name="arrowRight" />
            </a>
          </figure>

          <article className="lp-reveal-left absolute top-[62%] left-[3%] z-20 flex w-44 gap-2 bg-lp-card p-2 text-lp-text shadow-xl shadow-black/50 group-data-[lp-theme=light]/theme:shadow-black/15 lg:top-[33%] lg:left-[22%] lg:w-[18%]">
            <div className="relative aspect-[4/5] w-16 flex-none overflow-hidden">
              <Photo photo={photos.redBeanie} sizes="64px" />
            </div>
            <div className="text-[10px]">
              <h3 className="font-lp-display text-[11px] uppercase">Red beanie</h3>
              <p className="mt-0.5 text-lp-muted">৳ 1,850</p>
              <a href="#item-tee" aria-label="Shop Red beanie" className="mt-2 grid size-4 place-items-center bg-lp-accent text-lp-ink">
                <Icon name="plus" className="size-2.5" />
              </a>
            </div>
          </article>

          <div className="absolute top-[20%] right-[6%] z-20 grid aspect-square w-16 rotate-6 place-items-center bg-[#e6d21f] text-[#3a3000] shadow-xl shadow-black/50 group-data-[lp-theme=light]/theme:shadow-black/15 lg:top-[29%] lg:right-auto lg:left-[61%] lg:w-[9.4%]" aria-hidden="true">
            <Icon name="bag" className="size-1/2" />
          </div>

          <article className="lp-reveal-right absolute top-[56%] right-[3%] z-20 w-24 bg-lp-text p-1.5 text-lp-bg shadow-xl shadow-black/50 group-data-[lp-theme=light]/theme:shadow-black/15 lg:top-[62%] lg:right-auto lg:left-[55.5%] lg:w-[9%]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Photo photo={photos.pinkFur} sizes="120px" />
            </div>
            <h3 className="mt-2 font-lp-display text-[11px] uppercase">Fur coat</h3>
            <p className="text-[10px] opacity-70">৳ 1,450</p>
            <a href="#item-tee" aria-label="Shop Fur coat" className="mt-1.5 grid size-4 place-items-center bg-lp-bg text-lp-text">
              <Icon name="plus" className="size-2.5" />
            </a>
          </article>
        </section>

        {/* Collection */}
        <section id="collection" aria-labelledby="collection-title" className="scroll-mt-4 bg-lp-bg pt-[8%] pb-[10%]">
          <div className="lp-reveal flex flex-col justify-between gap-5 px-[3%] sm:flex-row sm:items-end">
            <div>
              <SectionTitle id="collection-title">Exclusive collections made<br className="hidden sm:block" /> for every moment</SectionTitle>
              <p className={`${bodyText} mt-3 max-w-md`}>Browse our curated collections of premium pieces designed for everyday style, comfort, and heritage.</p>
            </div>
          </div>

          <nav aria-label="Collection" className="mt-[4%] overflow-x-auto border-b border-lp-border px-[3%] [scrollbar-width:none]">
            <ul className="flex min-w-max justify-between gap-8">
              {collectionTabs.map((tab, index) => (
                <li key={tab.label}>
                  <a
                    href={tab.href}
                    aria-current={index === 2 ? "true" : undefined}
                    className="relative block py-4 text-[11px] text-lp-muted uppercase transition-colors hover:text-lp-text aria-[current]:text-lp-text aria-[current]:after:absolute aria-[current]:after:inset-x-[-20%] aria-[current]:after:-bottom-px aria-[current]:after:h-0.5 aria-[current]:after:bg-lp-text"
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="mt-[2.5%] grid grid-cols-4 gap-2 px-[3%] sm:gap-3 lg:grid-cols-6">
            {bricks.map((brick, index) =>
              brick.kind === "product" ? (
                <li
                  key={brick.id}
                  id={brick.id}
                  style={{ "--lp-stagger": index % 3 } as CSSProperties}
                  className={`lp-reveal lp-unveil group relative scroll-mt-4 overflow-hidden bg-lp-surface ${brick.featured ? "aspect-[2/1] lg:aspect-auto" : "aspect-[5/4]"} ${brick.place}`}
                >
                  <Photo photo={brick.photo} sizes={brick.featured ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"} className={hoverImage} />
                  <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2">
                    <Label>{brick.label}</Label>
                    <Label tone="text">{brick.price}</Label>
                  </div>
                  <Link href={brick.href} aria-label={`${brick.label}, ${brick.price}`} className="absolute inset-0 z-10" />
                </li>
              ) : brick.kind === "cta" ? (
                <li key={brick.id} className={`lp-reveal relative flex aspect-[5/4] flex-col justify-between p-3 text-lp-ink sm:p-4 ${clothBrick} ${brick.cloth} ${brick.place}`}>
                  <p className="relative text-[11px] leading-snug uppercase">
                    New pieces
                    <br />
                    every month
                  </p>
                  <a
                    href="#journal"
                    className="relative inline-flex min-h-9 items-center justify-between gap-4 bg-lp-text px-3 text-[11px] font-medium tracking-wide text-lp-bg uppercase transition-colors hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none"
                  >
                    Browse more <Icon name="arrowRight" />
                  </a>
                </li>
              ) : (
                <li key={brick.id} aria-hidden="true" className={`lp-fade relative ${clothBrick} ${brick.cloth} ${brick.place}`} />
              ),
            )}
          </ul>
        </section>

        <Divider />

        {/* About */}
        <section id="about" aria-labelledby="about-title" className="relative isolate scroll-mt-4 overflow-hidden bg-lp-surface px-[3%] py-16 lg:grid lg:aspect-[254/205] lg:grid-cols-[1fr_.9fr] lg:gap-[6%] lg:py-[6%]">
          <div className="absolute -top-[20%] -right-[10%] -z-10 h-[70%] w-[75%] scale-y-50 rotate-12 opacity-45 blur-2xl saturate-150" aria-hidden="true">
            <Photo photo={photos.redGown} sizes="60vw" />
          </div>

          <div>
            <SectionTitle id="about-title">The perfect blend<br />of style and comfort</SectionTitle>
            <p className={`${bodyText} mt-3 max-w-md`}>Our collections bring together modern cuts and Bengali craft for fashion that feels as good as it looks.</p>

            <div className="lp-reveal-left lp-unveil relative mx-6 mt-12 max-w-[440px] lg:ml-[10%]">
              <Icon name="arrowDownRight" className="absolute -top-6 -left-6 size-3.5 text-lp-muted" />
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={3} strokeDasharray="3 3" className="absolute -top-10 -right-8 z-10 size-12 text-lp-signal" aria-hidden="true">
                <path d="M44 4 8 40M8 18v22h22" />
              </svg>
              <div className="relative aspect-square overflow-hidden bg-black">
                <Photo photo={photos.sunglasses} sizes="(min-width: 1024px) 440px, 90vw" />
              </div>
              <Icon name="arrowUpRight" className="absolute -left-6 size-3.5 text-lp-muted" />
              <Icon name="arrowUpLeft" className="absolute -right-6 size-3.5 text-lp-muted" />
              <div className="mt-6 grid place-items-center border-y border-lp-border py-4">
                <Button href="#journal" tone="text">Learn more</Button>
              </div>
            </div>
          </div>

          <ul className="mt-14 lg:mt-0">
            {values.map((value, index) => (
              <li key={value.title} style={{ "--lp-stagger": index } as CSSProperties} className="lp-reveal-right grid grid-cols-[40px_1fr] items-center gap-5 border-b border-lp-border py-8 first:pt-0 last:border-b-0 sm:grid-cols-[56px_1fr] lg:py-[9%]">
                <Icon name={value.icon} className="size-10 text-lp-text sm:size-12" />
                <div>
                  <h3 className="font-lp-display text-[clamp(1rem,1.6cqw,1.4rem)] leading-[1.15] uppercase">{value.title}</h3>
                  <p className={`${bodyText} mt-2 max-w-72`}>{value.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Journal */}
        <section id="journal" aria-labelledby="journal-title" className="scroll-mt-4 bg-lp-bg pt-[7%]">
          <div className="lp-reveal grid justify-items-center gap-3 px-[3%] pb-[3%] text-center">
            <SectionTitle id="journal-title">Follow our style journey</SectionTitle>
            <p className={`${bodyText} max-w-md`}>Explore our latest looks, behind-the-scenes moments, and stay connected with every new collection.</p>
          </div>

          <Rail href="#footer" first="#journal-post-0" last={`#journal-post-${journalPosts.length - 1}`} label="post">
            Follow us
          </Rail>

          <ul className="grid grid-cols-2 items-start gap-4 px-[3%] pt-[3%] pb-[10%] lg:grid-cols-4 lg:gap-x-[1.6%]">
            {journalPosts.map((post, index) => (
              <li key={post.date} id={`journal-post-${index}`} style={{ "--lp-stagger": index } as CSSProperties}
                className={`lp-reveal lp-unveil group grid scroll-mt-4 justify-items-start gap-2 ${post.offset}`}>
                <Label tone="text">{post.date}</Label>
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Photo photo={post.photo} sizes="(min-width: 1024px) 320px, 50vw" className={hoverImage} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* Footer */}
        <footer id="footer" className="relative isolate overflow-hidden bg-lp-bg pt-[7%] text-center">
          <div className="absolute -inset-x-[10%] -top-[10%] bottom-[30%] -z-20 scale-y-50 -rotate-12 opacity-50 blur-2xl saturate-150" aria-hidden="true">
            <Photo photo={photos.fur} sizes="100vw" />
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,color-mix(in_oklab,var(--color-lp-bg)_90%,transparent)_20%,color-mix(in_oklab,var(--color-lp-bg)_40%,transparent)_70%)]" aria-hidden="true" />

          <div className="lp-reveal grid justify-items-center gap-3 px-[3%]">
            <p className="font-lp-display text-[clamp(1.6rem,3.4cqw,3rem)] leading-none uppercase">ঋ-Ree</p>
            <p className={`${bodyText} max-w-sm`}>ঋ - Ree brings stories, symbols, and heritage forward into clothing made for now.</p>
            <ul className="mt-1 flex gap-2">
              {socials.map((social, index) => (
                <li key={social.icon}>
                  {/* Replace with verified profile URLs during integration. */}
                  <a
                    href="#footer"
                    aria-label={social.label}
                    className={`grid size-11 place-items-center transition-colors hover:bg-lp-accent hover:text-lp-ink sm:size-6 ${index === 0 ? "bg-lp-accent text-lp-ink" : "text-lp-text"}`}
                  >
                    <Icon name={social.icon} className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-reveal lp-unveil relative mx-auto mt-[4%] aspect-[154/42] w-[94%] overflow-hidden shadow-2xl shadow-black/50 group-data-[lp-theme=light]/theme:shadow-black/15 sm:w-[61%]">
            <Photo photo={photos.redLips} sizes="(min-width: 640px) 61vw, 94vw" />
          </div>

          <ul className="mx-[3%] mt-5 mb-7 flex flex-wrap justify-center gap-2">
            {legalLinks.map((link) => (
              <li key={link}>
                <a href="#footer" className="block min-w-36 bg-lp-text px-3 py-0.5 text-[10px] text-lp-bg uppercase hover:bg-lp-accent hover:text-lp-ink">{link}</a>
              </li>
            ))}
          </ul>

          <nav aria-label="Footer" className="overflow-x-auto bg-lp-accent text-lp-ink">
            <ul className="flex min-w-max justify-between gap-8 px-[8%] py-3.5 text-[11px] uppercase">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:opacity-60">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bg-linear-to-b from-lp-deep-top to-lp-deep px-[3%] pt-4 pb-2">
            <Wordmark className="lp-texture-text text-[23.8cqw]" />
          </div>

          <p className="border-t border-lp-border bg-lp-deep px-[3%] py-2.5 text-[10px] text-lp-muted">© 2026 ঋ - Ree. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
