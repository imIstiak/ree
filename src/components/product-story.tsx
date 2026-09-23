"use client";

import Image from "next/image";
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { useRef, type RefObject } from "react";
import type { Product, ProductImage, StoryChapter } from "../data/products";
import { Icon } from "./landing-icons";
import { ProductShell } from "./product-shell";
import { PurchasePanel } from "./purchase-panel";
import { ShopHeader } from "./shop-header";
import { RelatedProducts, ShopFooter, cloth, kicker } from "./shop-ui";
import { Illustration } from "./story-illustrations";

// The premium, story-led product page: a header film, a prologue, six illustrated chapters that
// draw themselves in as they scroll into view, the journey from field to street, and an epilogue
// with sizes and the bag. There is no price on this page by design; the story carries it and the
// bag shows the number. Motion is scroll-linked through the page's own scroll container.

const rise: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 16 } },
};
const group: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const inView = { once: true, amount: 0.3 } as const;

const buttonDark =
  "inline-flex min-h-11 items-center gap-3 bg-lp-text px-4 text-[11px] font-medium tracking-[.1em] text-lp-bg uppercase transition-colors hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none";
const buttonGhost =
  "inline-flex min-h-11 items-center gap-3 border border-current/40 px-4 text-[11px] font-medium tracking-[.1em] uppercase transition-colors hover:border-lp-accent hover:text-lp-accent motion-reduce:transition-none";

type Container = RefObject<HTMLDivElement | null>;

export function ProductStory({ product, related }: { product: Product; related: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.2 });
  const { scrollYProgress: heroProgress } = useScroll({ container: scrollRef, target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 140]);
  const heroFade = useTransform(heroProgress, [0, 0.65], [1, 0]);
  const filmScale = useTransform(heroProgress, [0, 1], [1, 1.12]);

  const story = product.story;
  if (!story) return null;
  const { film, chapters, quotes } = story;
  const buyPhoto = product.images[7] ?? product.images[0];

  return (
    <MotionConfig reducedMotion="user">
      <ProductShell ref={scrollRef}>
        <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-lp-accent" aria-hidden="true" />

        {/* Header: the film plays behind the title; the copy drifts and fades as it scrolls away. */}
        <section ref={heroRef} className="relative isolate flex h-svh min-h-[640px] flex-col overflow-hidden">
          <motion.div style={{ scale: reduce ? 1 : filmScale }} className="absolute inset-0 -z-20" aria-hidden="true">
            {reduce ? (
              <Image src={film.poster} alt="" fill priority sizes="100vw" className="object-cover" />
            ) : (
              <video
                // React does not write the `muted` attribute to the HTML, and browsers only autoplay muted video.
                ref={(el) => {
                  if (el) {
                    el.muted = true;
                    el.defaultMuted = true;
                  }
                }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={film.poster}
                className="size-full object-cover"
              >
                <source src={film.src} type="video/mp4" />
              </video>
            )}
          </motion.div>
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-lp-bg)_0%,color-mix(in_oklab,var(--color-lp-bg)_55%,transparent)_40%,color-mix(in_oklab,var(--color-lp-bg)_18%,transparent)_100%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 lp-noise opacity-20 mix-blend-overlay" aria-hidden="true" />
          <ShopHeader />
          <motion.div style={{ y: heroY, opacity: heroFade }} className="mt-auto grid gap-6 px-[3%] pb-[9%] lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className={kicker}>Story No. 01 · {product.category}</p>
              <h1 className="lp-newsprint mt-3 font-lp-display text-[clamp(2.75rem,9.5cqw,8rem)] leading-[.95] tracking-[-.02em] uppercase">{story.headline}</h1>
              <p className="mt-5 max-w-lg font-lp-serif text-lg leading-snug italic sm:text-xl">{product.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <a href="#prologue" className={buttonDark}>
                Read the story <Icon name="arrowDown" />
              </a>
              <a href="#buy" className={buttonGhost}>
                Take it home <Icon name="bag" />
              </a>
            </div>
          </motion.div>
          <p className="absolute right-[3%] bottom-4 hidden items-center gap-2 text-[10px] tracking-[.12em] text-lp-muted uppercase sm:flex">
            <Icon name="play" className="size-3" /> {film.caption}
          </p>
        </section>

        {/* Prologue: why the tee exists, and the story in numbers. */}
        <section id="prologue" aria-labelledby="prologue-title" className="scroll-mt-4 px-[3%] pt-[8%] pb-[3%]">
          <motion.p variants={rise} initial="hidden" whileInView="visible" viewport={inView} className="mx-auto max-w-2xl text-center font-lp-serif text-xl leading-relaxed italic sm:text-2xl">
            {story.intro}
          </motion.p>
          <motion.div variants={group} initial="hidden" whileInView="visible" viewport={inView} className="mx-auto mt-[6%] grid max-w-5xl gap-8 lg:grid-cols-12">
            <motion.p variants={rise} className={`${kicker} lg:col-span-3`}>
              <span id="prologue-title">Why we made it</span>
            </motion.p>
            <motion.p variants={rise} className="text-[14px] leading-[1.85] text-lp-text lg:col-span-8 lg:col-start-5 lg:text-[15px]">
              {story.prologue}
            </motion.p>
          </motion.div>
          <motion.ul variants={group} initial="hidden" whileInView="visible" viewport={inView} className="mx-auto mt-[5%] grid max-w-5xl grid-cols-2 gap-6 border-y border-lp-border py-6 sm:grid-cols-5" aria-label="The story in numbers">
            {story.facts.map((fact) => (
              <motion.li key={fact.label} variants={rise}>
                <p className="lp-newsprint font-lp-display text-2xl leading-none sm:text-3xl">{fact.value}</p>
                <p className="mt-2 text-[11px] leading-snug tracking-[.1em] text-lp-muted uppercase">{fact.label}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>
        <PhotoStrip container={scrollRef} photos={[product.images[0], product.images[2], product.images[3]]} />

        {chapters.map((chapter, index) => (
          <Chapter key={chapter.title} chapter={chapter} index={index} photo={product.images[chapter.photo] ?? product.images[0]} />
        ))}

        <PhotoStrip container={scrollRef} photos={[product.images[6], product.images[8], product.images[1]]} />
        <Journey steps={story.journey} />

        {/* Epilogue: sizes and the bag over the back-print photograph, with no price. */}
        <section id="buy" aria-labelledby="buy-title" className="relative isolate scroll-mt-4 overflow-hidden px-[3%] py-[8%]">
          <div className="absolute inset-0 -z-20">
            <Image src={buyPhoto.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: buyPhoto.position }} />
          </div>
          <div className="absolute inset-0 -z-10 bg-[color-mix(in_oklab,var(--color-lp-bg)_80%,transparent)]" aria-hidden="true" />
          <motion.div variants={group} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-10 lg:grid-cols-12">
            <motion.div variants={rise} className="lg:col-span-6">
              <p className={kicker}>Epilogue · Take it home</p>
              <h2 id="buy-title" className="lp-newsprint mt-3 font-lp-display text-[clamp(1.8rem,4cqw,3.8rem)] leading-[1.02] uppercase">
                If this story is yours
              </h2>
              <p className="mt-4 max-w-lg font-lp-serif text-lg leading-snug italic">{story.epilogue}</p>
              <p className="mt-4 max-w-lg text-[13px] leading-[1.8] text-lp-muted">{product.description}</p>
              <dl className="mt-6 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 text-[12px]">
                <div>
                  <dt className={kicker}>Colour</dt>
                  <dd className="mt-1">{product.colour}</dd>
                </div>
                <div>
                  <dt className={kicker}>Sizes</dt>
                  <dd className="mt-1">{product.sizes.join(" · ")}</dd>
                </div>
              </dl>
              <Accordion title="The cloth and the cut" items={product.details} open />
              <Accordion title="Care" items={product.care} />
            </motion.div>
            <motion.div variants={rise} className="lg:col-span-5 lg:col-start-8">
              <div className="border border-lp-border bg-lp-card p-5 shadow-2xl shadow-black/40 group-data-[lp-theme=light]/theme:shadow-black/15 sm:p-6">
                <p className="font-lp-display text-lg leading-tight uppercase">{product.name}</p>
                <p className="mt-1 text-[11px] text-lp-muted">{product.colour} · unisex</p>
                <div className="mt-6">
                  <PurchasePanel product={product} showPrice={false} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section aria-labelledby="quotes-title" className="px-[3%] py-[8%]">
          <h2 id="quotes-title" className={`${kicker} text-center`}>
            Worn by
          </h2>
          <motion.ul variants={group} initial="hidden" whileInView="visible" viewport={inView} className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-3">
            {quotes.map((quote, i) => (
              <motion.li
                key={quote.who}
                variants={rise}
                className={`relative p-6 ${cloth} ${["-rotate-1 bg-lp-patch-mustard text-lp-ink outline-lp-ink/40", "rotate-1 bg-lp-patch-indigo text-lp-canvas outline-lp-canvas/60", "-rotate-2 bg-lp-patch-madder text-lp-canvas outline-lp-canvas/60"][i % 3]}`}
              >
                <p className="relative font-lp-serif text-lg leading-snug italic">“{quote.text}”</p>
                <p className="relative mt-4 text-[11px] tracking-[.12em] uppercase">— {quote.who}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <RelatedProducts products={related} showPrice={false} />
        <ShopFooter />
      </ProductShell>
    </MotionConfig>
  );
}

function Chapter({ chapter, index, photo }: { chapter: StoryChapter; index: number; photo: ProductImage }) {
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  return (
    <section id={`chapter-${index + 1}`} aria-labelledby={`chapter-${index + 1}-title`} className="relative scroll-mt-4 px-[3%] py-[7%]">
      <span aria-hidden="true" className={`pointer-events-none absolute top-0 font-lp-display text-[20cqw] leading-none text-lp-text/5 select-none ${flip ? "right-[2%]" : "left-[2%]"}`}>
        {number}
      </span>
      <motion.div variants={group} initial="hidden" whileInView="visible" viewport={inView} className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
        <motion.div variants={rise} className={`relative lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
          <div className={`relative bg-lp-card p-6 text-lp-text outline-lp-border sm:p-10 ${cloth} ${flip ? "rotate-1" : "-rotate-1"}`}>
            <Illustration name={chapter.illustration} className="relative mx-auto w-full max-w-sm" />
          </div>
          <motion.div
            variants={rise}
            className={`absolute -bottom-8 w-[34%] border-[6px] border-lp-card bg-lp-card shadow-xl shadow-black/40 group-data-[lp-theme=light]/theme:shadow-black/15 ${flip ? "-left-3 -rotate-3" : "-right-3 rotate-3"}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 14vw, 30vw" className="object-cover" style={{ objectPosition: photo.position }} />
            </div>
          </motion.div>
        </motion.div>
        <div className={`lg:col-span-6 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
          <motion.p variants={rise} className={`${kicker} text-lp-accent`}>
            {chapter.kicker}
          </motion.p>
          <motion.h2 id={`chapter-${index + 1}-title`} variants={rise} className="lp-newsprint mt-3 font-lp-display text-[clamp(1.6rem,3.6cqw,3.4rem)] leading-[1.05] uppercase">
            {chapter.title}
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-lg text-[13px] leading-[1.8] text-lp-muted sm:text-sm">
            {chapter.body}
          </motion.p>
          {chapter.pull && (
            <motion.p variants={rise} className="mt-6 max-w-md border-l-2 border-lp-accent pl-4 font-lp-serif text-lg italic">
              {chapter.pull}
            </motion.p>
          )}
          {chapter.facts && (
            <motion.ul variants={rise} className="mt-6 max-w-lg space-y-1.5 border-t border-lp-border pt-4 text-[12px] leading-relaxed">
              {chapter.facts.map((fact) => (
                <li key={fact} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1 flex-none bg-lp-accent" />
                  {fact}
                </li>
              ))}
            </motion.ul>
          )}
          {chapter.voice && (
            <motion.figure variants={rise} className="mt-6 max-w-md">
              <blockquote className="font-lp-serif text-base leading-snug italic">“{chapter.voice.text}”</blockquote>
              <figcaption className="mt-2 text-[11px] tracking-[.12em] text-lp-muted uppercase">— {chapter.voice.who}</figcaption>
            </motion.figure>
          )}
        </div>
      </motion.div>
    </section>
  );
}

// The making, from field to street, on a running-stitch rail that stitches itself in.
function Journey({ steps }: { steps: string[] }) {
  return (
    <section aria-labelledby="journey-title" className="px-[3%] py-[6%]">
      <h2 id="journey-title" className={`${kicker} text-center`}>
        From the field to the street
      </h2>
      <motion.ol
        variants={group}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="relative mx-auto mt-10 grid max-w-5xl gap-8 before:absolute before:top-0 before:bottom-0 before:left-[9px] before:border-l before:border-dashed before:border-lp-accent sm:grid-cols-6 sm:gap-4 sm:before:hidden"
      >
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.6, ease: "easeInOut" } } }}
          className="absolute top-[9px] right-0 left-0 hidden origin-left border-t border-dashed border-lp-accent sm:block"
          aria-hidden="true"
        />
        {steps.map((step, i) => (
          <motion.li key={step} variants={rise} className="relative pl-8 sm:pt-8 sm:pl-0">
            <span className="absolute top-0 left-0 grid size-5 place-items-center rounded-full border border-lp-accent bg-lp-bg text-[10px] leading-none">{i + 1}</span>
            <p className="text-[12px] leading-snug">{step}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

// Three photographs that drift at different speeds while they cross the viewport.
function PhotoStrip({ container, photos }: { container: Container; photos: ProductImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container, target: ref, offset: ["start end", "end start"] });
  const fast = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const slow = useTransform(scrollYProgress, [0, 1], [30, -30]);
  return (
    <div ref={ref} className="grid grid-cols-3 items-start gap-3 px-[3%] py-[4%]">
      {photos.map((photo, i) => (
        <motion.div key={photo.src} style={{ y: i === 1 ? slow : fast }} className={`relative aspect-[3/4] overflow-hidden bg-lp-surface ${i === 1 ? "mt-[12%]" : ""}`}>
          <Image src={photo.src} alt={photo.alt} fill sizes="33vw" className="object-cover" style={{ objectPosition: photo.position }} />
        </motion.div>
      ))}
    </div>
  );
}

function Accordion({ title, items, open }: { title: string; items: string[]; open?: boolean }) {
  return (
    <details className="group mt-6 border-t border-lp-border pt-4" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] tracking-[.12em] uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <Icon name="plus" className="size-3 transition-transform group-open:rotate-45 motion-reduce:transition-none" />
      </summary>
      <ul className="mt-3 space-y-1.5 text-[12px] leading-relaxed text-lp-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </details>
  );
}
