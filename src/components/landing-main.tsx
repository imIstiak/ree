import Image from "next/image";
import { BrandLogo } from "./brand-logo";
import { LandingHero } from "./landing-hero";
import { BrandIcon, Icon, type IconName } from "./landing-icons";
import { StoryTiles } from "./story-tiles";
import { Leaders, QuiltSwatch } from "./vive-art";
import Link from "next/link";
import { display, mono } from "./landing-fonts";
import type { CSSProperties, ReactNode } from "react";
import { LANDING_ROOT_ID, ThemeControls, ThemeScript } from "./theme-controls";
import { campaignPhotos } from "../data/campaign-images";
import { values } from "../data/brand";
import { journalPosts as posts } from "../data/journal";

// Visual spec: docs/landing-design-spec.json. Theme tokens live in src/app/globals.css.

type Photo = {
  src: string;
  alt: string;
  position?: string;
};

// Model photographs hotlinked from the reference stores are shared with the product pages
// (src/data/campaign-images.ts). Remaining editorial textures and hero photography are credited
// in docs/landing-image-credits.md.
const photos = {
  storyTee: campaignPhotos.riverTee,
  storyTeeModel: campaignPhotos.teeFront,
  storyDropShoulder: campaignPhotos.deltaTee,
  storyDropShoulderModel: campaignPhotos.basicTee,
  storyFootwear: campaignPhotos.footwear,
  camelCoat: { src: "/landing/style-camel-coat.jpg", alt: "A woman in a camel coat in warm evening light", position: "50% 30%" },
  redBeanie: { src: "/landing/style-red-beanie.jpg", alt: "A woman in a red beanie, tinted glasses and a plaid jacket", position: "50% 25%" },
  pinkFur: { src: "/landing/style-pink-fur.jpg", alt: "A woman in a pale fur coat and gold aviator sunglasses", position: "50% 30%" },
  redGown: { src: "/landing/texture-red-gown.jpg", alt: "", position: "50% 70%" },
  tees: campaignPhotos.basicTee,
  hoodie: campaignPhotos.hoodie,
  suit: campaignPhotos.suit,
  leatherJacket: campaignPhotos.leatherJacket,
  tote: campaignPhotos.toteWide,
  lifeIsShort: campaignPhotos.teeBack,
  sunglasses: campaignPhotos.deltaTee,
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

// "Find your story": five model portraits alternating short / tall, ending with footwear.
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

// Every tab opens its collection's page; Street style, home of the story tee, wears the accent patch.
const collectionTabs = [
  { label: "Casual wear", href: "/collections/casual-wear" },
  { label: "Loungewear", href: "/collections/loungewear" },
  { label: "Street style", href: "/collections/street-style" },
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "Handloom", href: "/collections/handloom" },
  { label: "Formal wear", href: "/collections/formal-wear" },
];

// The collection is a brick wall in running bond. Desktop: six-column base, bricks two columns wide;
// row 2 shifts by one column and is closed with cloth half-bricks (c1, c4); the featured edit is a
// two-by-two stone at c5-6 / r2-3; a cloth call-to-action brick completes row 3. Mobile flows this
// array in order on a four-column base (two bricks, then half + brick + half, ...). `place` holds
// full class literals because Tailwind only sees complete strings.
type Brick =
  | { kind: "product"; id: string; label: string; price: string; photo: Photo; href: string; cloth: string; place: string; featured?: boolean }
  | { kind: "cloth" | "cta"; id: string; cloth: string; place: string };

const bricks: Brick[] = [
  { kind: "product", id: "item-tee", label: "Basic tee", price: "৳ 1,450", photo: photos.tees, href: "/products/basic-tee", cloth: "bg-lp-patch-indigo text-lp-canvas", place: "col-span-2 lg:col-start-1 lg:row-start-1" },
  { kind: "product", id: "item-hoodie", label: "Crop hoodie", price: "৳ 3,200", photo: photos.hoodie, href: "/products/crop-hoodie", cloth: "bg-lp-patch-terracotta text-lp-ink", place: "col-span-2 lg:col-start-3 lg:row-start-1" },
  { kind: "cloth", id: "brick-half-1", cloth: "bg-lp-patch-madder outline-lp-canvas/60", place: "col-span-1 lg:col-start-1 lg:row-start-2" },
  { kind: "product", id: "item-suit", label: "Pinstripe suit", price: "৳ 3,850", photo: photos.suit, href: "/products/pinstripe-suit", cloth: "bg-lp-patch-olive text-lp-canvas", place: "col-span-2 lg:col-start-5 lg:row-start-1" },
  { kind: "cloth", id: "brick-half-2", cloth: "bg-lp-patch-indigo outline-lp-canvas/60", place: "col-span-1 lg:col-start-4 lg:row-start-2" },
  { kind: "product", id: "item-jacket", label: "Leather jacket", price: "৳ 4,600", photo: photos.leatherJacket, href: "/products/leather-jacket", cloth: "bg-lp-patch-mustard text-lp-ink", place: "col-span-2 lg:col-start-2 lg:row-start-2" },
  { kind: "product", id: "item-tote", label: "Canvas tote", price: "৳ 1,950", photo: photos.tote, href: "/products/canvas-tote", cloth: "bg-lp-patch-madder text-lp-canvas", place: "col-span-2 lg:col-start-1 lg:row-start-3" },
  { kind: "product", id: "item-editorial", label: "Life is short", price: "Story", photo: photos.lifeIsShort, href: "/products/life-is-short-tee", cloth: "bg-lp-card text-lp-text", place: "col-span-4 lg:col-span-2 lg:col-start-5 lg:row-span-2 lg:row-start-2", featured: true },
  { kind: "cloth", id: "brick-half-3", cloth: "bg-lp-patch-olive outline-lp-canvas/60", place: "col-span-1 lg:hidden" },
  { kind: "cta", id: "brick-cta", cloth: "bg-lp-patch-mustard outline-lp-ink/40", place: "col-span-2 lg:col-start-3 lg:row-start-3" },
  { kind: "cloth", id: "brick-half-4", cloth: "bg-lp-patch-terracotta outline-lp-ink/40", place: "col-span-1 lg:hidden" },
];

// Cloth bricks: a patch colour with grain and an inset running stitch (the stitch colour rides in `cloth`).
const clothBrick = "outline-1 outline-dashed -outline-offset-4 before:pointer-events-none before:absolute before:inset-0 before:lp-noise before:opacity-25 before:mix-blend-overlay before:content-['']";


// Stagger relative to column width: 0 / 80% / 0 / 55% on desktop, two staggered columns on mobile.
// Each post is a cloth patch: `cloth` is the frame colour, its stitch (text) colour and resting tilt,
// `tag` the tilt of the date patch sewn over its corner. Full class literals, as Tailwind needs.
// The posts themselves (date, photograph, title) live in src/data/journal.ts; each patch links to its
// entry on the /journal page.
const journalPosts = [
  { ...posts[0], offset: "", cloth: "bg-lp-patch-mustard text-lp-ink -rotate-2", tag: "rotate-3" },
  { ...posts[1], offset: "mt-[40%] lg:mt-[80%]", cloth: "bg-lp-patch-indigo text-lp-canvas rotate-[1.5deg]", tag: "-rotate-2" },
  { ...posts[2], offset: "-mt-[40%] lg:mt-0", cloth: "bg-lp-patch-madder text-lp-canvas -rotate-1", tag: "rotate-2" },
  { ...posts[3], offset: "lg:mt-[55%]", cloth: "bg-lp-patch-olive text-lp-canvas rotate-2", tag: "-rotate-3" },
];

const styleWords = ["Streetwear", "Linen sets", "Overshirts", "Handloom", "Outerwear", "Knitwear", "Formal wear"];

// The first piece, ঋ-Vive, told as a story (the user asked for the first product featured this way,
// after the hero-like "EcoTech" / "Nakasei" references: one large object, a big title, small floating
// cards with the facts). Sample copy like the rest of the page: the words live here, the drawn swatch
// and the leaders in vive-art.tsx. The photographs are hotlinked from the reference stores the user
// sent (hosts allowed in next.config.ts, sources and the rights note in docs/product-image-credits.md);
// they are placeholders for the brand's own pictures of ঋ-Vive. Each callout label sits at `at`
// (percent of the framed photograph's box, from the corner it names) and its leader is a path on
// the photograph's pixel grid, from the detail (`dot`) out to the label; the patch callout is
// captioned under the drawn swatch of the quilt.
const viveTee = {
  src: "https://ymvykcvbtnxwszfliaov.supabase.co/storage/v1/object/public/product-images/olive-urdu-tee/3.jpg",
  width: 1200,
  height: 1600,
  alt: "A washed olive drop-shoulder tee with printed cloth patches sewn on the chest, the side and the hem, hanging on a wooden hanger against a white wall",
};
type Callout = { id: string; title: string; detail: string; at: CSSProperties; leader: { d: string; dot: [number, number] }; swatch?: boolean };
type FactCard = { icon: IconName; label: string; value: string; photo: Photo; cloth: string; place: string };

const featuredStory: { tagline: string; lede: string; chapters: { title: string; body: string }[]; callouts: Callout[]; cards: FactCard[]; motifs: string[] } = {
  tagline: "A grandmother's quilt, sewn onto a tee you will wear for years.",
  lede: "Every nakshi kantha begins as worn-out saris, layered and quilted with a running stitch until the cloth is new again. ঋ-Vive takes one quilt's motif, cuts it as a patch, and sews it by hand onto a heavy olive tee.",
  chapters: [
    { title: "The quilt", body: "Old saris folded five deep and quilted with thread pulled from their own borders. Nothing is thrown away; it becomes the next thing." },
    { title: "The stitch", body: "One running stitch, ten thousand times over. The women of Jashore draw the lotus, the fish and the sun from memory, so no two patches match." },
    { title: "The tee", body: "280-gram cotton, garment-dyed olive, dropped two fingers at the shoulder. The patch is whipped on by hand and the quilt's border is block-printed down one sleeve." },
  ],
  callouts: [
    { id: "patch", title: "Kantha patch", detail: "Cut from one quilt, whipped on by hand", at: { left: "-6%", top: "22%" }, leader: { d: "M430 665 180 160", dot: [430, 665] }, swatch: true },
    { id: "collar", title: "Running-stitch collar", detail: "Sewn through the rib by hand", at: { left: "60%", top: "14%" }, leader: { d: "M562 404 716 272", dot: [562, 404] } },
    { id: "sleeve", title: "Block-printed border", detail: "The quilt's edge, down one sleeve", at: { left: "84%", top: "52%" }, leader: { d: "M972 918 1004 876", dot: [972, 918] } },
    { id: "cloth", title: "Garment-dyed olive", detail: "280 g combed cotton, twin-needle hem", at: { right: "52%", top: "88%" }, leader: { d: "M640 1330 580 1446", dot: [640, 1330] } },
  ],
  // Each card carries a photograph from one of the reference stores. Cloth and desktop placement are
  // full class literals, as Tailwind needs.
  cards: [
    {
      icon: "pin",
      label: "Stitched in",
      value: "Jashore, Bengal",
      photo: { src: "https://cdn.shopify.com/s/files/1/0880/2448/2082/files/A3.jpg", alt: "A woven label sewn onto a sky-blue tee, printed with the names of rivers", position: "50% 50%" },
      cloth: "bg-lp-card text-lp-text",
      place: "lg:top-[4%] lg:right-0 -rotate-2",
    },
    {
      icon: "needle",
      label: "Hand-stitching",
      value: "14 h per patch",
      photo: { src: "https://cdn.shopify.com/s/files/1/0940/5576/0157/files/DSC09831.jpg", alt: "A white patch with Urdu calligraphy hand-stitched onto the back of a black tee", position: "50% 45%" },
      cloth: "bg-lp-patch-mustard text-lp-ink",
      place: "lg:top-[72%] lg:right-[1%] rotate-2",
    },
    {
      icon: "tag",
      label: "Edition",
      value: "001 · 100 pieces",
      photo: { src: "https://vylaxclothing.com/wp/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-08-at-6.37.53-PM.jpeg", alt: "A red oversized tee with Urdu script and a cloth band on the sleeve", position: "50% 30%" },
      cloth: "bg-lp-text text-lp-bg",
      place: "lg:top-[95%] lg:left-[6%] -rotate-1",
    },
  ],
  motifs: ["Old saris", "Running stitch", "Lotus", "Fish", "Sun", "Jashore", "Garment-dyed", "280 g", "Drop 001"],
};

const footerLinks = [
  { label: "Home", href: "#top" },
  { label: "About us", href: "/about" },
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/journal" },
  { label: "Contact us", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy policy", href: "/legal/privacy" },
  { label: "Terms & conditions", href: "/legal/terms" },
  { label: "Cookie policy", href: "/legal/cookies" },
];

// Each social patch wears a light tint of its network's colour with the real mark in the brand
// colour, and turns the full brand colour on hover. Brand colours are fixed: they do not follow
// the theme. Full class literals, as Tailwind needs.
const socials = [
  { icon: "instagram", label: "Instagram", cloth: "bg-[#f9d0de] text-[#c2256c] hover:bg-[#d62976] hover:text-white" },
  { icon: "facebook", label: "Facebook", cloth: "bg-[#cfe1fd] text-[#1668e0] hover:bg-[#1877f2] hover:text-white" },
  { icon: "linkedin", label: "LinkedIn", cloth: "bg-[#c6e6ec] text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white" },
  { icon: "x", label: "X", cloth: "bg-[#dadad7] text-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white" },
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

// Every card, button and link is a cloth patch (`lp-patch`: grain + a running stitch in the text
// colour). Clickable patches rest at a slight tilt and straighten on hover; cards also lift.
const patchShadow = "shadow-md shadow-black/35 group-data-[lp-theme=light]/theme:shadow-black/12";
const patchMotion = "transition-[color,background-color,rotate,translate,box-shadow] duration-300 ease-out hover:rotate-0 motion-reduce:transition-none";
const smallPatch = `lp-patch [--lp-stitch-inset:3px] ${patchShadow} ${patchMotion}`;
const cardPatch = `lp-patch ${patchShadow} ${patchMotion} hover:-translate-y-1.5 hover:shadow-xl`;

function Label({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "text" | "outline" }) {
  const tones = {
    accent: "bg-lp-accent text-lp-ink",
    text: "bg-lp-text text-lp-bg",
    outline: "bg-lp-card text-lp-muted",
  };
  return <span className={`lp-patch inline-flex items-center px-2 py-1 text-[10px] leading-tight whitespace-nowrap uppercase [--lp-stitch-inset:2px] sm:px-2.5 sm:py-1.5 ${tones[tone]}`}>{children}</span>;
}

function Button({ href, children, tone = "accent" }: { href: string; children: ReactNode; tone?: "accent" | "text" }) {
  const tones = {
    accent: "bg-lp-accent text-lp-ink hover:bg-lp-text hover:text-lp-bg",
    text: "bg-lp-text text-lp-bg hover:bg-lp-accent hover:text-lp-ink",
  };
  return (
    <Link
      href={href}
      className={`${smallPatch} inline-flex min-h-11 min-w-40 -rotate-1 items-center justify-between gap-6 px-4 text-[11px] font-medium tracking-wide uppercase sm:min-h-10 ${tones[tone]}`}
    >
      {children}
      <Icon name="arrowRight" />
    </Link>
  );
}

function Rail({ href, first, last, label, children }: { href: string; first: string; last: string; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-y border-lp-border px-[3%] py-3">
      <Button href={href}>{children}</Button>
      <div className="flex gap-2">
        <a href={first} aria-label={`First ${label}`} className={`${smallPatch} grid size-11 rotate-2 place-items-center bg-lp-card text-lp-text hover:bg-lp-text hover:text-lp-bg sm:size-10`}>
          <Icon name="chevronLeft" />
        </a>
        <a href={last} aria-label={`Last ${label}`} className={`${smallPatch} grid size-11 -rotate-2 place-items-center bg-lp-accent text-lp-ink hover:bg-lp-text hover:text-lp-bg sm:size-10`}>
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
    <div className={`select-none ${className}`}>
      <BrandLogo variant="wordmark" className="w-full" decorative />
    </div>
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

// `feature` is the larger cut for the featured story's hero-like title.
const titleSizes = {
  section: "text-[clamp(1.4rem,2.45cqw,2.5rem)] leading-[1.15]",
  feature: "text-[clamp(2rem,4.3cqw,4.6rem)] leading-[1.02]",
};

function SectionTitle({ id, children, size = "section", className = "" }: { id: string; children: ReactNode; size?: keyof typeof titleSizes; className?: string }) {
  return (
    <h2 id={id} className={`lp-newsprint font-lp-display tracking-[-.025em] text-lp-text uppercase ${titleSizes[size]} ${className}`}>
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
            <Rail href="/shop" first={`#${storyTiles[0].id}`} last={`#${storyTiles[storyTiles.length - 1].id}`} label="category">
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
          <Wordmark className="lp-drift absolute inset-x-[3%] bottom-[18%] -z-10 opacity-60 lg:top-[60%] lg:bottom-auto" />

          <ul className="lp-drift-x absolute inset-x-0 bottom-[8%] flex justify-between gap-6 overflow-hidden border-y border-lp-border px-[3%] py-2 text-[10px] whitespace-nowrap text-lp-muted uppercase lg:top-[82%] lg:bottom-auto" aria-label="Styles">
            {styleWords.map((word, index) => (
              <li key={word} className={index > 2 && index < 6 ? "hidden lg:block" : ""}>{word}</li>
            ))}
          </ul>

          <figure className="lp-fade lp-unveil lp-patch group absolute top-[24%] left-1/2 z-10 w-[62%] -translate-x-1/2 bg-lp-patch-terracotta p-2 text-lp-ink shadow-2xl shadow-black/60 group-data-[lp-theme=light]/theme:shadow-black/15 sm:p-2.5 sm:[--lp-stitch-inset:5px] lg:top-[30%] lg:w-[31%]">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#7a3a20] lg:aspect-[315/450]">
              <Photo photo={photos.camelCoat} sizes="(min-width: 1024px) 420px, 62vw" className={hoverImage} />
            </div>
            <Link href="/collections/outerwear" className={`${smallPatch} absolute inset-x-[10%] bottom-[7%] flex min-h-10 -rotate-1 items-center justify-between bg-lp-text px-3.5 text-[10px] text-lp-bg uppercase hover:bg-lp-accent hover:text-lp-ink`}>
              Shop this look <Icon name="arrowRight" />
            </Link>
          </figure>

          <article className={`lp-reveal-left ${cardPatch} absolute top-[62%] left-[3%] z-20 flex w-48 -rotate-2 gap-2.5 bg-lp-card p-3 text-lp-text lg:top-[33%] lg:left-[21%] lg:w-[19%]`}>
            <div className="relative aspect-[4/5] w-16 flex-none overflow-hidden">
              <Photo photo={photos.redBeanie} sizes="64px" />
            </div>
            <div className="text-[10px]">
              <h3 className="font-lp-display text-[11px] uppercase">Red beanie</h3>
              <p className="mt-0.5 text-lp-muted">৳ 1,850</p>
              <Link href="/collections/casual-wear" aria-label="Shop Red beanie" className="lp-patch mt-2 grid size-7 place-items-center bg-lp-accent text-lp-ink transition-colors [--lp-stitch-inset:2px] hover:bg-lp-text hover:text-lp-bg motion-reduce:transition-none">
                <Icon name="plus" className="size-3" />
              </Link>
            </div>
          </article>

          <div className="lp-patch absolute top-[20%] right-[6%] z-20 grid aspect-square w-16 rotate-6 place-items-center bg-[#e6d21f] text-[#3a3000] shadow-xl shadow-black/50 group-data-[lp-theme=light]/theme:shadow-black/15 lg:top-[29%] lg:right-auto lg:left-[61%] lg:w-[9.4%]" aria-hidden="true">
            <Icon name="bag" className="size-1/2" />
          </div>

          <article className={`lp-reveal-right ${cardPatch} absolute top-[56%] right-[3%] z-20 w-28 rotate-2 bg-lp-text p-2.5 text-lp-bg lg:top-[62%] lg:right-auto lg:left-[55.5%] lg:w-[10%]`}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Photo photo={photos.pinkFur} sizes="120px" />
            </div>
            <h3 className="mt-2 font-lp-display text-[11px] uppercase">Fur coat</h3>
            <p className="text-[10px] opacity-70">৳ 1,450</p>
            <Link href="/collections/outerwear" aria-label="Shop Fur coat" className="lp-patch mt-1.5 grid size-7 place-items-center bg-lp-bg text-lp-text transition-colors [--lp-stitch-inset:2px] hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none">
              <Icon name="plus" className="size-3" />
            </Link>
          </article>
        </section>

        {/* The first piece, as a story */}
        <section id="featured" aria-labelledby="featured-title" className="relative isolate flex scroll-mt-4 flex-col overflow-hidden bg-lp-bg px-[3%] pt-14 pb-10 lg:grid lg:grid-cols-[35%_1fr] lg:gap-x-[5%] lg:pt-[7%] lg:pb-[5%]">
          {/* A kantha quilt for a background: rows of running stitch in the text colour, the olive cloth's glow behind the tee, and grain. */}
          <div className="lp-kantha lp-drift absolute inset-x-0 -top-[8%] -bottom-[8%] -z-20 bg-lp-text opacity-[.07]" aria-hidden="true" />
          <div
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_46%_32%_at_50%_36%,color-mix(in_oklab,var(--color-lp-patch-olive)_55%,transparent),transparent_70%)] lg:bg-[radial-gradient(ellipse_28%_44%_at_62%_36%,color-mix(in_oklab,var(--color-lp-patch-olive)_55%,transparent),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 lp-noise opacity-25 mix-blend-overlay" aria-hidden="true" />
          <span className="lp-drift pointer-events-none absolute right-[1%] bottom-[1%] -z-10 font-lp-display text-[24cqw] leading-none text-lp-text/5 uppercase select-none lg:bottom-[9%] lg:text-[14cqw]" aria-hidden="true">
            Vive
          </span>

          {/* The words: intro, then the story in three stitches. One column on desktop; on phones the tee sits between them. */}
          <div className="contents lg:flex lg:flex-col lg:gap-9">
            <div className="lp-reveal relative z-10 order-1 max-w-md lg:max-w-none">
              <p className="flex flex-wrap gap-2">
                <Label>Story No. 01</Label>
                <Label tone="outline">Our first piece</Label>
              </p>
              <SectionTitle id="featured-title" size="feature" className="mt-4">
                Naqshi Kantha
                <br />
                ঋ-Vive
              </SectionTitle>
              <p className="mt-4 max-w-sm font-lp-serif text-lg leading-snug text-lp-text italic sm:text-xl">{featuredStory.tagline}</p>
              <p className={`${bodyText} mt-4 max-w-sm`}>{featuredStory.lede}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/contact">Follow the first drop</Button>
                <Button href="/collections/street-style" tone="text">
                  See the collection
                </Button>
              </div>
            </div>
            <ol className="relative z-10 order-4 mt-10 ml-3 grid gap-5 border-l border-dashed border-lp-border pl-6 lg:mt-0 lg:gap-4" aria-label="The story in three stitches">
              {featuredStory.chapters.map((chapter, index) => (
                <li key={chapter.title} className="lp-reveal relative" style={{ "--lp-stagger": index } as CSSProperties}>
                  <span
                    className={`lp-patch absolute top-0 -left-[37px] grid size-6 place-items-center text-[9px] [--lp-stitch-inset:2px] ${["bg-lp-patch-mustard text-lp-ink -rotate-3", "bg-lp-patch-madder text-lp-canvas rotate-2", "bg-lp-patch-indigo text-lp-canvas -rotate-2"][index]}`}
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="font-lp-display text-[12px] uppercase">
                    <span className="sr-only">Stitch {index + 1}: </span>
                    {chapter.title}
                  </h3>
                  <p className={`${bodyText} mt-1 max-w-sm`}>{chapter.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* The stage: the tee, cut out of its photograph, swaying on the page, with the quilt swatch sewing itself in beside it, the details called out around it and the facts floating as cards. */}
          <div className="contents lg:relative lg:block lg:pt-[3%]">
            <div className="lp-fade relative z-10 order-2 mx-auto mt-10 w-[86%] max-w-sm sm:w-[64%] lg:mx-0 lg:ml-[3%] lg:mt-0 lg:w-[63%] lg:max-w-none">
              <div className="lp-float relative text-lp-text">
                {/* The photograph in a cloth frame with a running stitch, like the page's other pictures; the leaders are drawn over the photograph itself. */}
                <div className="lp-patch bg-lp-patch-olive p-2 text-lp-canvas shadow-2xl shadow-black/60 group-data-[lp-theme=light]/theme:shadow-black/20 sm:p-2.5 sm:[--lp-stitch-inset:5px]">
                  <div className="relative overflow-hidden bg-lp-surface text-lp-text">
                    <Image src={viveTee.src} alt={viveTee.alt} width={viveTee.width} height={viveTee.height} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 64vw, 86vw" className="block h-auto w-full" />
                    <Leaders box={`0 0 ${viveTee.width} ${viveTee.height}`} leaders={featuredStory.callouts.map((callout) => ({ id: callout.id, ...callout.leader }))} className="pointer-events-none absolute inset-0 hidden size-full lg:block" />
                  </div>
                </div>
                <div className="absolute top-[2%] -left-[7%] w-[30%] drop-shadow-[0_12px_14px_rgb(0_0_0/.45)] group-data-[lp-theme=light]/theme:drop-shadow-[0_10px_12px_rgb(0_0_0/.18)]" aria-hidden="true">
                  <QuiltSwatch className="block w-full -rotate-3" />
                </div>
                <ul className="hidden lg:contents" aria-label="The details">
                  {featuredStory.callouts.map((callout) => (
                    <li key={callout.id} style={callout.at} className="lp-patch absolute z-10 w-max max-w-44 bg-lp-card px-2.5 py-1.5 text-[10px] leading-snug text-lp-text shadow-md shadow-black/35 [--lp-stitch-inset:3px] group-data-[lp-theme=light]/theme:shadow-black/12">
                      <strong className="block font-lp-display font-normal uppercase">{callout.title}</strong>
                      <span className="text-lp-muted">{callout.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ul className="relative z-20 order-5 mt-8 grid gap-3 sm:grid-cols-3 lg:contents" aria-label="The first piece in numbers">
              {featuredStory.cards.map((card, index) => (
                <li
                  key={card.label}
                  style={{ "--lp-stagger": index } as CSSProperties}
                  className={`lp-reveal-right ${cardPatch} z-20 flex items-center gap-3 p-3 lg:absolute lg:w-[31%] lg:p-3.5 ${card.cloth} ${card.place}`}
                >
                  <span className="lp-patch relative aspect-[4/5] w-11 flex-none overflow-hidden bg-lp-surface [--lp-stitch-inset:2px]">
                    <Photo photo={card.photo} sizes="44px" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[9px] tracking-[.12em] uppercase opacity-70">
                      <Icon name={card.icon} className="size-3" />
                      {card.label}
                    </span>
                    <span className="block font-lp-display text-[13px] leading-tight uppercase">{card.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="relative z-10 order-3 mt-6 grid grid-cols-2 gap-2 lg:hidden" aria-label="The details">
            {featuredStory.callouts.map((callout) => (
              <li key={callout.id} className="lp-patch bg-lp-card px-2.5 py-2 text-[10px] leading-snug text-lp-text [--lp-stitch-inset:3px]">
                <strong className="block font-lp-display font-normal uppercase">{callout.title}</strong>
                <span className="text-lp-muted">{callout.detail}</span>
              </li>
            ))}
          </ul>

          <div className="relative order-6 hidden h-4 lg:col-span-2 lg:mt-[4%] lg:block" aria-hidden="true">
            <Markers className="top-0" />
          </div>
          <ul className="lp-drift-x relative order-7 -mx-[3.2%] mt-10 flex justify-between gap-6 overflow-hidden border-y border-lp-border px-[3%] py-2 text-[10px] whitespace-nowrap text-lp-muted uppercase lg:col-span-2 lg:mt-5" aria-label="Motifs">
            {featuredStory.motifs.map((word, index) => (
              <li key={word} className={index > 2 && index < 7 ? "hidden lg:block" : ""}>{word}</li>
            ))}
          </ul>
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
            <ul className="flex min-w-max justify-between gap-3 py-4">
              {collectionTabs.map((tab, index) => (
                <li key={tab.label}>
                  <Link
                    href={tab.href}
                    className={`${smallPatch} grid min-h-11 place-items-center px-5 text-[11px] uppercase hover:bg-lp-text hover:text-lp-bg sm:min-h-10 ${index === 2 ? "bg-lp-accent text-lp-ink" : "bg-lp-card text-lp-muted"} ${index % 2 ? "rotate-1" : "-rotate-1"}`}
                  >
                    {tab.label}
                  </Link>
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
                  className={`lp-reveal lp-unveil lp-patch group relative scroll-mt-4 [--lp-stitch-inset:3px] sm:[--lp-stitch-inset:4px] ${brick.featured ? "aspect-[2/1] lg:aspect-auto" : "aspect-[5/4]"} ${brick.cloth} ${brick.place}`}
                >
                  {/* The photograph sits inside the cloth frame, clear of the stitch. */}
                  <div className="absolute inset-1.5 overflow-hidden bg-lp-surface sm:inset-2">
                    <Photo photo={brick.photo} sizes={brick.featured ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"} className={hoverImage} />
                  </div>
                  <div className="absolute inset-x-2.5 bottom-2.5 flex items-end justify-between gap-1 sm:inset-x-4 sm:bottom-4 sm:gap-2">
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
                  <Link
                    href="/shop"
                    className={`${smallPatch} relative inline-flex min-h-10 -rotate-1 items-center justify-between gap-4 bg-lp-text px-3.5 text-[11px] font-medium tracking-wide text-lp-bg uppercase hover:bg-lp-accent hover:text-lp-ink`}
                  >
                    Browse more <Icon name="arrowRight" />
                  </Link>
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
                <Button href="/about" tone="text">Learn more</Button>
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

          <Rail href="/journal" first="#journal-post-0" last={`#journal-post-${journalPosts.length - 1}`} label="post">
            Follow us
          </Rail>

          <ul className="grid grid-cols-2 items-start gap-5 px-[3%] pt-[4%] pb-[10%] lg:grid-cols-4 lg:gap-x-[1.6%]">
            {journalPosts.map((post, index) => (
              <li key={post.slug} id={`journal-post-${index}`} style={{ "--lp-stagger": index } as CSSProperties}
                className={`lp-reveal lp-unveil scroll-mt-4 ${post.offset}`}>
                {/* The tilt lives on the patch, not the li, so it does not fight the reveal's transform. */}
                <Link href={`/journal#${post.slug}`} aria-label={`${post.title}, ${post.date}`} className={`${cardPatch} group relative block p-2.5 [--lp-stitch-inset:5px] sm:p-3.5 sm:[--lp-stitch-inset:7px] ${post.cloth}`}>
                  <span className={`absolute -top-3 -left-1 z-10 sm:-left-2 ${patchShadow} ${post.tag}`}>
                    <Label tone="text">{post.date}</Label>
                  </span>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Photo photo={post.photo} sizes="(min-width: 1024px) 320px, 50vw" className={hoverImage} />
                  </div>
                </Link>
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
            <Link href="/landing" aria-label="REE home"><BrandLogo className="w-20 sm:w-24" decorative /></Link>
            <p className={`${bodyText} max-w-sm`}>ঋ - Ree brings stories, symbols, and heritage forward into clothing made for now.</p>
            <ul className="mt-1 flex gap-2">
              {socials.map((social, index) => (
                <li key={social.icon}>
                  {/* Replace with verified profile URLs during integration. */}
                  <a
                    href="#footer"
                    aria-label={social.label}
                    className={`${smallPatch} grid size-11 place-items-center sm:size-10 ${social.cloth} ${index % 2 ? "rotate-3" : "-rotate-3"}`}
                  >
                    <BrandIcon name={social.icon} className="size-[18px] sm:size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-reveal lp-unveil relative mx-auto mt-[4%] aspect-[154/42] w-[94%] overflow-hidden shadow-2xl shadow-black/50 group-data-[lp-theme=light]/theme:shadow-black/15 sm:w-[61%]">
            <Photo photo={photos.redLips} sizes="(min-width: 640px) 61vw, 94vw" />
          </div>

          <ul className="mx-[3%] mt-6 mb-8 flex flex-wrap justify-center gap-3">
            {legalLinks.map((link, index) => (
              <li key={link.href}>
                <Link href={link.href} className={`${smallPatch} block min-w-40 bg-lp-text px-4 py-2.5 text-[10px] text-lp-bg uppercase hover:bg-lp-accent hover:text-lp-ink ${index % 2 ? "rotate-1" : "-rotate-1"}`}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <nav aria-label="Footer" className="overflow-x-auto bg-lp-accent text-lp-ink">
            <ul className="flex min-w-max justify-between gap-3 px-[8%] py-3 text-[11px] uppercase">
              {footerLinks.map((link, index) => (
                <li key={link.label}>
                  {/* Dark patches on the yellow band: ink and accent read the same in both themes. */}
                  <Link href={link.href} className={`${smallPatch} block bg-lp-ink px-4 py-2.5 text-lp-accent hover:bg-lp-card hover:text-lp-text ${index % 2 ? "-rotate-1" : "rotate-1"}`}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bg-linear-to-b from-lp-deep-top to-lp-deep px-[3%] pt-4 pb-2">
            <Wordmark className="w-full" />
          </div>

          <p className="border-t border-lp-border bg-lp-deep px-[3%] py-2.5 text-[10px] text-lp-muted">© 2026 ঋ - Ree. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
