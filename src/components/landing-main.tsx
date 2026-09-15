import Image from "next/image";
import { LandingHero } from "./landing-hero";
import { Alfa_Slab_One, IBM_Plex_Mono } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { LANDING_ROOT_ID, ThemeControls, ThemeScript } from "./theme-controls";

// Visual spec: docs/landing-design-spec.json. Theme tokens live in src/app/globals.css.

const display = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

type Photo = {
  src: string;
  alt: string;
  position?: string;
};

// Unsplash License photos; credits in docs/landing-image-credits.md.
const photos = {
  pinkHoodie: { src: "/landing/category-pink-hoodie.jpg", alt: "A woman in a pink hoodie and sunglasses under blossoms", position: "50% 12%" },
  sneakers: { src: "/landing/category-sneakers.jpg", alt: "A pair of pastel running sneakers on a white surface", position: "50% 45%" },
  orangeHoodie: { src: "/landing/category-orange-hoodie.jpg", alt: "A man in an orange hoodie against a teal wall", position: "55% 30%" },
  blueBag: { src: "/landing/category-blue-bag.jpg", alt: "A woman in a red dress holding a navy leather handbag", position: "50% 70%" },
  camelCoat: { src: "/landing/style-camel-coat.jpg", alt: "A woman in a camel coat in warm evening light", position: "50% 30%" },
  redBeanie: { src: "/landing/style-red-beanie.jpg", alt: "A woman in a red beanie, tinted glasses and a plaid jacket", position: "50% 25%" },
  pinkFur: { src: "/landing/style-pink-fur.jpg", alt: "A woman in a pale fur coat and gold aviator sunglasses", position: "50% 30%" },
  redGown: { src: "/landing/texture-red-gown.jpg", alt: "", position: "50% 70%" },
  tees: { src: "/landing/collection-tees.jpg", alt: "Black crew-neck T-shirts on hangers", position: "50% 40%" },
  hoodie: { src: "/landing/collection-hoodie.jpg", alt: "A woman in a peach hoodie and glasses", position: "50% 40%" },
  suit: { src: "/landing/collection-suit.jpg", alt: "A close-up of a pinstripe suit jacket and a ringed hand", position: "50% 50%" },
  leatherJacket: { src: "/landing/collection-leather-jacket.jpg", alt: "A man in a black leather jacket and sunglasses", position: "50% 35%" },
  tote: { src: "/landing/collection-tote.jpg", alt: "A canvas tote bag hanging beside a wooden door", position: "35% 50%" },
  bucketHat: { src: "/landing/collection-bucket-hat.jpg", alt: "A low-angle portrait of a woman in a black bucket hat and coat between city buildings", position: "50% 40%" },
  sunglasses: { src: "/landing/about-sunglasses.jpg", alt: "A woman in round sunglasses and a navy blazer", position: "50% 30%" },
  journalBeanie: { src: "/landing/journal-red-beanie.jpg", alt: "A woman in a red beanie and mirrored sunglasses", position: "50% 30%" },
  journalBeret: { src: "/landing/journal-red-beret.jpg", alt: "A woman in a red beret and white shirt", position: "50% 25%" },
  journalLeather: { src: "/landing/journal-leather.jpg", alt: "A young man in a black leather jacket", position: "50% 30%" },
  journalSuit: { src: "/landing/journal-suit.jpg", alt: "A black-and-white portrait of a woman in a suit on a stool", position: "50% 40%" },
  redLips: { src: "/landing/footer-red-lips.jpg", alt: "A close-up portrait of a woman with red lipstick", position: "50% 47%" },
  fur: { src: "/landing/footer-fur.jpg", alt: "", position: "50% 40%" },
} satisfies Record<string, Photo>;

const categories = [
  { id: "category-streetwear", name: "Streetwear", link: "24 items", photo: photos.pinkHoodie, featured: false },
  { id: "category-sneakers", name: "Sneakers", link: "18 items", photo: photos.sneakers, featured: false },
  { id: "category-hoodies", name: "Hoodies", link: "12 items", photo: photos.orangeHoodie, featured: true },
  { id: "category-bags", name: "Bags", link: "14 items", photo: photos.blueBag, featured: false },
];

const collectionTabs = [
  { label: "Casual wear", href: "#item-tee" },
  { label: "Loungewear", href: "#item-hoodie" },
  { label: "Street style", href: "#item-editorial" },
  { label: "Outerwear", href: "#item-jacket" },
  { label: "Handloom", href: "#item-tote" },
  { label: "Formal wear", href: "#item-suit" },
];

// Desktop placement: tee r1c1, hoodie r1c3, suit r1c4, jacket r2c2, tote r3c1, editorial r2-r3/c3-c4.
const collectionItems = [
  { id: "item-tee", label: "Basic tee", price: "৳ 1,450", photo: photos.tees, place: "lg:col-start-1 lg:row-start-1", featured: false },
  { id: "item-hoodie", label: "Crop hoodie", price: "৳ 3,200", photo: photos.hoodie, place: "lg:col-start-3 lg:row-start-1", featured: false },
  { id: "item-suit", label: "Pinstripe suit", price: "৳ 3,850", photo: photos.suit, place: "lg:col-start-4 lg:row-start-1", featured: false },
  { id: "item-jacket", label: "Leather jacket", price: "৳ 4,600", photo: photos.leatherJacket, place: "lg:col-start-2 lg:row-start-2", featured: false },
  { id: "item-tote", label: "Canvas tote", price: "৳ 1,950", photo: photos.tote, place: "lg:col-start-1 lg:row-start-3", featured: false },
  { id: "item-editorial", label: "Winter edit", price: "Shop", photo: photos.bucketHat, place: "col-span-2 lg:col-start-3 lg:row-start-2 lg:row-span-2", featured: true },
];

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

const iconPaths = {
  arrowRight: "M4 12h16M14 6l6 6-6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  arrowDownRight: "M7 7l10 10M17 8v9H8",
  arrowDownLeft: "M17 7 7 17M16 17H7V8",
  arrowUpLeft: "M17 17 7 7M7 16V7h9",
  chevronLeft: "M15 5l-7 7 7 7",
  chevronRight: "M9 5l7 7-7 7",
  plus: "M12 5v14M5 12h14",
  bag: "M5 8h14l-1 13H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2",
  comfort: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-4 13c3-1 5-4 5-8m-2 11c3-2 5-5 5-9",
  quality: "M3 18h18M4 18 3 7l5 4 4-6 4 6 5-4-1 11M8 14l2-2 2 2 2-2 2 2",
  delivery: "M3 12l6-6 6 6-6 6-6-6Zm6 0 6-6 6 6-6 6",
  timeless: "M12 3v8M7.5 5.5a8 8 0 1 0 9 0",
  instagram: "M4 4h16v16H4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM16.5 7.5h.01",
  facebook: "M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z",
  linkedin: "M4 9h4v11H4zM6 4v2M10 9h4v2c1-1.5 2-2 3.5-2 2.5 0 3.5 1.8 3.5 4.5V20h-4v-6c0-1.2-.5-2-1.5-2S14 12.8 14 14v6h-4z",
  x: "M4 4l16 16M20 4 4 20",
};

type IconName = keyof typeof iconPaths;

function Icon({ name, className = "size-3.5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinejoin="miter" className={className} aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}

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
    <h2 id={id} className="font-lp-display text-[clamp(1.4rem,2.45cqw,2.5rem)] leading-[1.15] tracking-[-.025em] text-lp-text uppercase">
      {children}
    </h2>
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

        {/* Categories */}
        <section id="categories" aria-labelledby="categories-title" className="scroll-mt-4 bg-lp-surface pt-[8.6%]">
          <div className="lp-reveal flex flex-col justify-between gap-4 px-[3%] pb-[3%] sm:flex-row sm:items-end">
            <SectionTitle id="categories-title">Browse<br />by category</SectionTitle>
            <p className={`${bodyText} max-w-72`}>We create timeless clothing that blends heritage craft with everyday comfort.</p>
          </div>

          <ul className="grid grid-cols-2 items-start gap-4 border-t border-lp-border px-[3%] py-[2%] lg:grid-cols-4 lg:gap-x-[1.6%]">
            {categories.map((category, index) => (
              <li key={category.id} id={category.id} style={{ "--lp-stagger": index } as CSSProperties} className="lp-reveal lp-unveil group scroll-mt-4">
                <a href="#collection" className="block">
                  <div className={`relative overflow-hidden ${category.featured ? "aspect-[57/75]" : "aspect-[57/48]"}`}>
                    <Photo photo={category.photo} sizes="(min-width: 1024px) 320px, 50vw" className={hoverImage} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Label>{category.name}</Label>
                    {category.featured ? <Icon name="arrowRight" /> : <Label tone="outline">{category.link}</Label>}
                  </div>
                  {category.featured && (
                    <h3 className="mt-2 font-lp-display text-[clamp(1rem,1.8cqw,1.65rem)] leading-[1.15] uppercase">{category.name}</h3>
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="pb-[10%]">
            <Rail href="#collection" first={`#${categories[0].id}`} last={`#${categories[categories.length - 1].id}`} label="category">
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
            <Button href="#journal">Browse more</Button>
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

          <ul className="mt-[2.5%] grid grid-cols-2 gap-4 px-[3%] lg:grid-cols-4 lg:gap-x-[1.6%] lg:gap-y-6">
            {collectionItems.map((item, index) => (
              <li key={item.id} id={item.id} style={{ "--lp-stagger": index % 3 } as CSSProperties} className={`lp-reveal lp-unveil group flex scroll-mt-4 flex-col ${item.place}`}>
                <div className={`relative overflow-hidden bg-lp-surface ${item.featured ? "aspect-[4/5] lg:aspect-auto lg:flex-1" : "aspect-[57/81]"}`}>
                  <Photo photo={item.photo} sizes={item.featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, 50vw"} className={hoverImage} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Label>{item.label}</Label>
                  <Label tone="text">{item.price}</Label>
                </div>
              </li>
            ))}
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
