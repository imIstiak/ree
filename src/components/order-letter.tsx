"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { useId, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { formatPrice } from "../data/products";
import { BrandLogo } from "./brand-logo";
import type { BagLine } from "./cart-page";
import { Icon } from "./landing-icons";
import { hand, script } from "./letter-fonts";
import { PageButton, smallPatch } from "./site-page";

// The order confirmation as a letter (the user asked for this page "as a letter" on textured paper,
// after a scrapbook reference: paper-framed photographs and torn notes with punched holes). The
// section carries `data-paper-page`, which turns the whole page into paper (globals.css); on it lie
// the folded letter with a stamp and postmark, a taped photograph of the first piece and the totals
// on a slip torn from a ring-bound pad. The paper keeps fixed colours in both themes, like the
// header's panels. The P.S. says plainly that nothing has been sent.

export type PlacedOrder = {
  number: string;
  date: string;
  dateShort: string;
  name: string;
  phone: string;
  address: string;
  areaLabel: string;
  payment: string;
  paymentNote: string;
  lines: BagLine[];
  subtotal: number;
  delivery: number;
};

// A torn bottom edge as a clip-path polygon (top and sides straight). Seeded, so the server and the
// browser draw the same tear; `depth` is the deepest bite in percent of the height.
function tornEdge(seed: number, depth: number, steps: number) {
  let state = seed;
  const next = () => (state = (state * 16807) % 2147483647) / 2147483647;
  const bottom = Array.from({ length: steps + 1 }, (_, i) => `${(100 - (i / steps) * 100).toFixed(2)}% ${(100 - depth * (0.3 + 0.7 * next())).toFixed(2)}%`);
  return `polygon(0% 0%, 100% 0%, ${bottom.join(", ")})`;
}

const letterEdge = tornEdge(7, 1.3, 64);
const slipEdge = tornEdge(29, 5, 26);
const ease = [0.2, 0.8, 0.2, 1] as const;

// Printed ink on the paper, shared with the checkout form.
export const ink = "text-[#2b1d15]";
export const faded = "text-[#7a6450]";
export const label = `text-[10px] tracking-[.2em] uppercase ${faded}`;

const counts = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

function list(items: string[]) {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function Postmark({ place, date, className = "" }: { place: string; date: string; className?: string }) {
  const ring = useId();
  return (
    <svg viewBox="0 0 230 120" className={className} aria-hidden="true">
      <defs>
        <path id={ring} d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" />
      </defs>
      <circle cx="60" cy="60" r="53" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text fill="currentColor" fontSize="10.5" letterSpacing="2.6" fontFamily="var(--font-plex-mono), monospace">
        <textPath href={`#${ring}`}>{place}</textPath>
      </text>
      <text x="60" y="64" fill="currentColor" fontSize="10" textAnchor="middle" letterSpacing="1" fontFamily="var(--font-plex-mono), monospace">
        {date}
      </text>
      {[34, 50, 66, 82].map((y) => (
        <path key={y} d={`M122 ${y}q13-8 26 0t26 0t26 0t26 0`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

// The brand mark. The page draws it from the logo sprite; the PDF copy uses the standalone file,
// because a captured page cannot reach an external <use> reference.
function Mark({ className, forPdf }: { className: string; forPdf?: boolean }) {
  return forPdf ? (
    <Image src="/ree-mark.svg" alt="" width={200} height={200} unoptimized loading="eager" className={`h-auto ${className}`} />
  ) : (
    <BrandLogo variant="mark" className={className} decorative />
  );
}

function Letter({ order, forPdf = false }: { order: PlacedOrder; forPdf?: boolean }) {
  const title = useId();
  const firstName = order.name.split(/\s+/)[0] || order.name;
  const pieces = order.lines.map((line) => `${line.product.name.toLowerCase()} in size ${line.size}${line.qty > 1 ? ` (${counts[line.qty] ?? line.qty} of them)` : ""}`);
  // "Inside Dhaka" → "inside Dhaka": only the first letter drops, the city keeps its capital.
  const area = order.areaLabel.charAt(0).toLowerCase() + order.areaLabel.slice(1);
  return (
    <article data-pdf="letter" aria-labelledby={title} className={`ree-letter relative px-6 pt-8 pb-16 sm:px-12 sm:pt-12 sm:pb-24 lg:px-16 ${ink} [--ree-wordmark:#00664f]`} style={{ clipPath: letterEdge }}>
      <header className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <Mark className="w-10 sm:w-12" forPdf={forPdf} />
          <p className={`${label} leading-relaxed`}>
            ঋ - Ree
            <br />
            Dhaka · Bangladesh
          </p>
        </div>
        <div className="relative mr-1 shrink-0 sm:mr-2">
          <div className="rotate-3" style={{ filter: "drop-shadow(0 2px 3px rgb(40 24 10 / .25))" }}>
            <div className="ree-stamp bg-[#f6eedc]">
              <div className="grid w-16 place-items-center gap-1 bg-[#00664f] px-2 pt-2.5 pb-1.5 text-[#ffe7cc] sm:w-20">
                <Mark className="w-full" forPdf={forPdf} />
                <span className="text-[7px] tracking-[.16em] uppercase">Bangladesh</span>
              </div>
            </div>
          </div>
          <Postmark place="DHAKA · BANGLADESH · ঋ-REE · " date={order.dateShort} className="absolute top-8 -left-24 w-44 -rotate-12 text-[#5b3a22]/55 sm:-left-28 sm:w-52" />
        </div>
      </header>

      <div className="mt-10 grid gap-6 text-[13px] leading-relaxed sm:mt-14 sm:grid-cols-2">
        <address className="not-italic">
          <span className={`${label} block`}>To</span>
          <span className="mt-1.5 block">{order.name}</span>
          <span className="block">{order.address}</span>
          <span className="block">
            {order.areaLabel} · {order.phone}
          </span>
        </address>
        <p className="sm:text-right">
          <span className={`${label} block`}>{order.date}</span>
          <span className="mt-1.5 block">Order {order.number}</span>
        </p>
      </div>

      <h1 id={title} className={`${script.className} mt-12 text-[clamp(2.6rem,5.5cqw,4.4rem)] leading-[1.1] text-[#2b1d15]`}>
        Dear {firstName},
      </h1>
      <div className="mt-6 max-w-[62ch] space-y-4 font-lp-serif text-[17px] leading-[1.8] sm:text-[18px]">
        <p>
          Thank you for your order, and for choosing to wear something made slowly. Here is what you picked: your {list(pieces)}.
        </p>
        <p>
          It is bound for {order.address}, {area}, to be paid {order.paymentNote} when it arrives; {order.phone} is the number we have for you. The full reckoning is on the slip beside this letter.
        </p>
        <p>Not everything old belongs in the past. We hope this piece carries a little of it forward with you, worn often and washed soft.</p>
      </div>

      <div className="mt-10">
        <p className="font-lp-serif text-[17px] italic">With warmth,</p>
        <p className={`${script.className} mt-1 -rotate-3 text-[3.4rem] leading-none text-[#00664f]`}>Ree</p>
        <p className={`${label} mt-3`}>The ঋ - Ree studio, Dhaka</p>
      </div>

      <p className={`${hand.className} mt-12 max-w-[46ch] -rotate-1 text-[22px] leading-snug text-[#6b3f22] sm:text-[24px]`}>
        P.S. This is a preview of the shop: your order hasn&apos;t been sent anywhere, and nothing will be delivered or charged yet.
      </p>
    </article>
  );
}

// The totals on a slip of paper with a torn bottom, shared with the checkout form. `punched` tears it
// from a ring-bound pad (a row of holes along the top); without it the top is straight, for the form's
// paper-clipped slip. Fixed paper colours, like the letter.
export function ReceiptSlip({
  meta,
  lines,
  subtotal,
  delivery,
  note,
  punched = false,
  eager = false,
  children,
}: {
  meta: string;
  lines: BagLine[];
  subtotal: number;
  delivery: number;
  note?: string;
  punched?: boolean;
  // Load the prints at once: the PDF copy is rendered off screen, where lazy images never load.
  eager?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="relative" style={{ filter: "drop-shadow(0 12px 16px rgb(40 24 10 / .2))" }}>
      {punched && <span aria-hidden="true" className="ree-punch-shadow absolute inset-x-0 top-0 h-8" />}
      <div data-pdf="slip" className={`ree-paper relative bg-[#e8ddc4] px-6 pb-14 ${punched ? "ree-punched pt-11" : "pt-9"} ${ink}`} style={{ clipPath: slipEdge }}>
        <h2 className="font-lp-serif text-[26px] leading-tight italic">Your order</h2>
        <p className={`${label} mt-1`}>{meta}</p>
        <ul className="mt-5 divide-y divide-dashed divide-[#b5a17c] border-y border-dashed border-[#b5a17c] text-[12px]">
          {lines.map((line, index) => (
            <li key={`${line.slug}-${line.size}`} className="grid grid-cols-[46px_minmax(0,1fr)_auto] items-center gap-3 py-3">
              {/* A small print of the piece, glued on in an ivory border at a slight tilt. */}
              <span className={`block bg-[#fffcf4] p-[3px] shadow-[0_2px_5px_rgb(40_24_10/28%)] ${index % 2 ? "rotate-2" : "-rotate-2"}`}>
                <span className="relative block aspect-[3/4] overflow-hidden bg-[#d9cfba]">
                  <Image src={line.product.images[0].src} alt="" fill sizes="46px" loading={eager ? "eager" : undefined} className="object-cover" style={{ objectPosition: line.product.images[0].position }} />
                </span>
              </span>
              <span className="uppercase">
                {line.product.name}
                <span className={`block text-[11px] normal-case ${faded}`}>
                  Size {line.size} · × {line.qty}
                </span>
              </span>
              <span className="whitespace-nowrap">{formatPrice(line.qty * line.product.price)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className={faded}>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className={faded}>Delivery</dt>
            <dd>{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-[#b5a17c] pt-3 font-lp-display text-xl">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + delivery)}</dd>
          </div>
        </dl>
        {note && <p className={`${label} mt-5`}>{note}</p>}
        {children}
      </div>
    </div>
  );
}

function Snapshot({ line }: { line: BagLine }) {
  const photo = line.product.images[0];
  return (
    <figure className="ree-paper relative mx-auto w-56 -rotate-[4deg] bg-[#fffcf4] p-3 pb-12 shadow-[0_14px_26px_rgb(40_24_10/22%)] sm:w-60">
      <span aria-hidden="true" className="ree-tape absolute -top-3.5 left-1/2 h-7 w-24 -translate-x-1/2 rotate-3 bg-[#00664f]/45" />
      <div className="relative aspect-square overflow-hidden bg-[#e9e1cf]">
        <Image src={photo.src} alt={photo.alt} fill sizes="240px" className="object-cover" style={{ objectPosition: photo.position }} />
      </div>
      <figcaption className={`${hand.className} absolute inset-x-3 bottom-2.5 text-center text-[21px] leading-tight text-[#3a2a1e]`}>{line.product.name}</figcaption>
    </figure>
  );
}

// The PDF is made from a copy of the letter and the slip rendered off screen at desktop widths, so a
// phone gets the same pages (order-pdf.ts). The copy exists only while the PDF is being made.
function PdfCopy({ order }: { order: PlacedOrder }) {
  return (
    <>
      <div className="w-[760px]">
        <Letter order={order} forPdf />
      </div>
      <div className="mt-10 w-[380px]">
        <ReceiptSlip meta={`${order.number} · ${order.dateShort}`} lines={order.lines} subtotal={order.subtotal} delivery={order.delivery} note={order.payment} punched eager />
      </div>
    </>
  );
}

function DownloadButton({ order }: { order: PlacedOrder }) {
  const [status, setStatus] = useState<"idle" | "busy" | "failed">("idle");
  const copy = useRef<HTMLDivElement>(null);

  async function download() {
    if (status === "busy") return;
    // Mount the off-screen copy before measuring it.
    flushSync(() => setStatus("busy"));
    try {
      if (!copy.current) throw new Error("The letter is not ready");
      const { downloadOrderPdf } = await import("./order-pdf");
      await downloadOrderPdf(copy.current, order.number);
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("failed");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={download}
        disabled={status === "busy"}
        aria-busy={status === "busy"}
        className={`${smallPatch} inline-flex min-h-11 min-w-44 rotate-1 cursor-pointer items-center justify-between gap-6 bg-[#fbf6ea] px-4 text-[11px] font-medium tracking-wide text-[#2b1d15] uppercase hover:bg-[#00664f] hover:text-[#fbf6ea] disabled:cursor-wait disabled:opacity-80 sm:min-h-10`}
      >
        {status === "busy" ? "Preparing the PDF…" : status === "failed" ? "Try the PDF again" : "Download as PDF"}
        <Icon name="download" />
      </button>
      <p className="sr-only" aria-live="polite">
        {status === "busy" ? "Preparing your PDF." : status === "failed" ? "The PDF could not be made. Try again." : ""}
      </p>
      {status === "busy" && (
        <div ref={copy} aria-hidden="true" className="ree-pdf-copy pointer-events-none fixed top-0 left-[-10000px]">
          <PdfCopy order={order} />
        </div>
      )}
    </>
  );
}

export function OrderLetter({ order }: { order: PlacedOrder }) {
  return (
    <MotionConfig reducedMotion="user">
      <section data-paper-page aria-label="Your order" className="px-[3%] pt-4 pb-16 lg:pt-[2%] lg:pb-[5%]">
        <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(260px,330px)]">
          <motion.div
            initial={{ opacity: 0, y: 48, rotate: -2.5 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6 }}
            transition={{ duration: 0.9, ease }}
            style={{ filter: "drop-shadow(0 24px 32px rgb(40 24 10 / .24))" }}
          >
            <Letter order={order} />
          </motion.div>
          <div className="grid gap-14 lg:pt-20">
            {order.lines[0] && (
              <motion.div initial={{ opacity: 0, y: -30, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.8, delay: 0.35, ease }}>
                <Snapshot line={order.lines[0]} />
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease }}>
              <div className="rotate-2">
                <ReceiptSlip meta={`${order.number} · ${order.dateShort}`} lines={order.lines} subtotal={order.subtotal} delivery={order.delivery} note={order.payment} punched />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-6xl flex-wrap gap-3">
          <PageButton href="/shop">Continue shopping</PageButton>
          <PageButton href="/landing" tone="text">
            Back home
          </PageButton>
          <DownloadButton order={order} />
        </div>
      </section>
    </MotionConfig>
  );
}
