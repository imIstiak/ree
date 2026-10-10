import Image from "next/image";
import type { CSSProperties } from "react";
import { contact, values } from "../data/brand";
import { campaignPhotos } from "../data/campaign-images";
import { journalPosts } from "../data/journal";
import { Icon } from "./landing-icons";
import { PageButton, PageIntro, SitePage, bodyText, cardPatch, cloths, patchShadow, sectionTitle, smallPatch, tilts } from "./site-page";
import { kicker } from "./shop-ui";

// The brand's own pages: /about, /journal, /contact and the legal pages (/legal/[slug]). Server
// components. Copy is sample content, like the landing page's; the legal pages are placeholders
// until the real policies are written.

const making = [
  { title: "The cloth", body: "Heavy cotton, handloom voile and brushed fleece: cloth that can take the heat, the rain and a hundred washes." },
  { title: "The hands", body: "Prints pulled by hand, patches whipped on, collars sewn flat by people we know by name, paid by the hour." },
  { title: "The city", body: "Words from old signboards, motifs from our grandmothers' quilts, cut for a city that never sits still." },
];

export function AboutPage() {
  return (
    <SitePage>
      <PageIntro eyebrow="About ঋ - Ree" title="Not everything old belongs in the past">
        ঋ - Ree is an independent clothing label shaped in Bengal. We bring stories, symbols and heritage forward into clothes made for now.
      </PageIntro>

      <section className="grid gap-10 border-t border-lp-border px-[3%] py-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-[6%] lg:py-[5%]">
        <div className="space-y-5 lg:pt-[4%]">
          <h2 className={sectionTitle}>The perfect blend of style and comfort</h2>
          <p className={bodyText}>
            We grew up with the running stitch of a nakshi kantha, the lettering on old Dhaka signboards and prints pulled by hand in small workshops. ঋ - Ree takes those things out of the past and sews them into what we wear every day.
          </p>
          <p className={bodyText}>
            Everything starts with cloth that can take the long Dhaka day. We cut it with room to move, finish it by hand where hands do it better, and make in small runs so nothing sits unworn.
          </p>
          <p className={bodyText}>Our collections bring together modern cuts and Bengali craft for fashion that feels as good as it looks.</p>
          <div className="flex flex-wrap gap-3 pt-3">
            <PageButton href="/shop">Shop the collection</PageButton>
            <PageButton href="/journal" tone="text">
              Read the journal
            </PageButton>
          </div>
        </div>
        <figure className={`lp-patch ${patchShadow} mx-auto w-full max-w-md rotate-1 bg-lp-patch-olive p-2.5 text-lp-canvas [--lp-stitch-inset:6px] sm:p-3`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-lp-surface">
            <Image src={campaignPhotos.kurti.src} alt={campaignPhotos.kurti.alt} fill sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" style={{ objectPosition: campaignPhotos.kurti.position }} />
          </div>
        </figure>
      </section>

      <section aria-labelledby="making-title" className="border-t border-lp-border px-[3%] py-10 lg:py-[4%]">
        <h2 id="making-title" className={sectionTitle}>
          How we make
        </h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-3">
          {making.map((step, index) => (
            <li key={step.title} style={{ "--lp-stagger": index } as CSSProperties} className="lp-reveal">
              <div className={`lp-patch ${patchShadow} h-full p-6 [--lp-stitch-inset:6px] ${cloths[(index + 1) % cloths.length]} ${tilts[index % tilts.length]}`}>
                <p className="text-[11px] tracking-[.14em] uppercase opacity-70">0{index + 1}</p>
                <h3 className="mt-3 font-lp-display text-xl uppercase">{step.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.7] opacity-85">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="values-title" className="border-t border-lp-border px-[3%] py-10 lg:py-[4%]">
        <h2 id="values-title" className={sectionTitle}>
          What we promise
        </h2>
        <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
          {values.map((value) => (
            <li key={value.title} className="grid grid-cols-[40px_1fr] items-center gap-5 border-b border-lp-border py-7 sm:grid-cols-[52px_1fr]">
              <Icon name={value.icon} className="size-10 text-lp-text sm:size-12" />
              <div>
                <h3 className="font-lp-display text-[clamp(1rem,1.5cqw,1.3rem)] leading-[1.15] uppercase">{value.title}</h3>
                <p className={`${bodyText} mt-1.5`}>{value.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SitePage>
  );
}

export function JournalPage() {
  return (
    <SitePage>
      <PageIntro eyebrow={`Journal · ${journalPosts.length} stories`} title="Follow our style journey">
        Our latest looks, behind-the-scenes moments and the people who make every collection.
      </PageIntro>
      <ul className="grid gap-x-[5%] gap-y-12 border-t border-lp-border px-[3%] py-10 sm:grid-cols-2 lg:py-[4%]">
        {journalPosts.map((post, index) => (
          <li key={post.slug}>
            <article id={post.slug} aria-labelledby={`${post.slug}-title`} className="scroll-mt-6">
              <div className={`lp-patch ${patchShadow} relative p-2.5 [--lp-stitch-inset:5px] sm:p-3 ${cloths[(index + 5) % cloths.length]} ${tilts[index % tilts.length]}`}>
                <span className={`lp-patch absolute -top-3 -left-1 z-10 inline-flex rotate-2 items-center bg-lp-text px-2.5 py-1.5 text-[10px] text-lp-bg uppercase [--lp-stitch-inset:2px] ${patchShadow}`}>{post.date}</span>
                <div className="relative aspect-[4/3] overflow-hidden bg-lp-surface">
                  <Image src={post.photo.src} alt={post.photo.alt} fill sizes="(min-width: 640px) 46vw, 94vw" className="object-cover" style={{ objectPosition: post.photo.position }} />
                </div>
              </div>
              <h2 id={`${post.slug}-title`} className={`${sectionTitle} mt-6`}>
                {post.title}
              </h2>
              <p className={`${bodyText} mt-3 max-w-lg`}>{post.excerpt}</p>
            </article>
          </li>
        ))}
      </ul>
    </SitePage>
  );
}

const ways = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, cloth: "bg-lp-accent text-lp-ink" },
  { label: "Call", value: contact.phone, href: contact.phoneHref, cloth: "bg-lp-text text-lp-bg" },
];

export function ContactPage() {
  return (
    <SitePage>
      <PageIntro eyebrow="Contact · ঋ - Ree" title="Let's stay in touch">
        For the first drop, collaborations, press, or anything else, choose how you&apos;d like to reach us.
      </PageIntro>
      <section className="grid gap-5 border-t border-lp-border px-[3%] py-10 sm:grid-cols-3 lg:py-[4%]">
        {ways.map((way, index) => (
          <a key={way.label} href={way.href} className={`${cardPatch} group flex min-h-40 flex-col justify-between p-6 [--lp-stitch-inset:6px] ${way.cloth} ${tilts[index % tilts.length]}`}>
            <span className="text-[11px] tracking-[.14em] uppercase opacity-70">{way.label}</span>
            <span className="flex items-end justify-between gap-4">
              <span className="font-lp-display text-[clamp(1.1rem,2cqw,1.6rem)] leading-tight">{way.value}</span>
              <Icon name="arrowUpRight" className="size-5 flex-none" />
            </span>
          </a>
        ))}
        <div className={`lp-patch ${patchShadow} flex min-h-40 flex-col justify-between bg-lp-card p-6 text-lp-text [--lp-stitch-inset:6px] ${tilts[2]}`}>
          <span className="text-[11px] tracking-[.14em] uppercase opacity-70">Studio</span>
          <span className="flex items-end justify-between gap-4">
            <span className="font-lp-display text-[clamp(1.1rem,2cqw,1.6rem)] leading-tight uppercase">{contact.location}</span>
            <Icon name="pin" className="size-5 flex-none" />
          </span>
        </div>
      </section>
      <section className="px-[3%]">
        <p className={`${bodyText} max-w-lg`}>Want to hear when the first drop lands? Write to us and we&apos;ll keep you posted.</p>
        <a href={`mailto:${contact.email}?subject=${encodeURIComponent("Keep me posted about the first drop")}`} className={`${smallPatch} mt-5 inline-flex min-h-11 min-w-44 -rotate-1 items-center justify-between gap-6 bg-lp-accent px-4 text-[11px] font-medium tracking-wide text-lp-ink uppercase hover:bg-lp-text hover:text-lp-bg sm:min-h-10`}>
          Join the list <Icon name="arrowRight" />
        </a>
      </section>
    </SitePage>
  );
}

// Placeholders until the real policies are written: they say what the site does today and where to ask.
export const legalPages = [
  {
    slug: "privacy",
    title: "Privacy policy",
    body: [
      "ঋ - Ree's full privacy policy will be published here before the shop opens.",
      "Today the site keeps your bag, your saved pieces and your theme choice in your own browser's local storage. Checkout does not send your details anywhere yet.",
      `Questions about your data: write to ${contact.email}.`,
    ],
  },
  {
    slug: "terms",
    title: "Terms & conditions",
    body: [
      "The terms of sale will be published here before the shop opens.",
      "Until then, the products, prices and delivery fees on this site are previews, and no orders are taken or charged.",
      `Questions: write to ${contact.email}.`,
    ],
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    body: [
      "The site sets no cookies of its own. It remembers your theme, your bag and your saved pieces in your browser's local storage, which you can clear at any time.",
      "Some photographs and the story page's film are loaded from other services, which may keep their own records of the request.",
      `Questions: write to ${contact.email}.`,
    ],
  },
];

export function LegalPage({ page }: { page: (typeof legalPages)[number] }) {
  return (
    <SitePage>
      <PageIntro eyebrow="Legal" title={page.title} />
      <section className="border-t border-lp-border px-[3%] py-10 lg:py-[4%]">
        <div className="max-w-2xl space-y-4">
          {page.body.map((paragraph) => (
            <p key={paragraph} className={bodyText}>
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="mt-10 flex flex-wrap gap-3" aria-label="Legal pages">
          {legalPages.map((other) => (
            <li key={other.slug}>
              <PageButton href={`/legal/${other.slug}`} tone={other.slug === page.slug ? "accent" : "text"}>
                {other.title}
              </PageButton>
            </li>
          ))}
        </ul>
        <p className={`${kicker} mt-10`}>Last updated: not yet published</p>
      </section>
    </SitePage>
  );
}
