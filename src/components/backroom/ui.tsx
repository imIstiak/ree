import type { ReactNode } from "react";
import type { OrderStatus, PaymentStatus } from "../../lib/order-states";

// Shared pieces for /backroom, hook-free so server pages can use them. The backroom wears the shop's
// patchwork in a quieter cut: light theme tokens, cream panels sewn with a running stitch, emerald
// actions. It follows the site's theme switch (light by default); the inputs darken on the dark theme,
// where the panels turn emerald.

// On the dark theme the shop's cards are emerald, which is also the header's and the buttons'
// colour; here panels take a deep green-black instead so the emerald actions stand out.
export const panel = "lp-patch bg-lp-card text-lp-text shadow-sm shadow-black/10 [--lp-stitch-inset:6px] group-data-[lp-theme=dark]/theme:bg-[#0a1f19] group-data-[lp-theme=dark]/theme:shadow-black/40";
export const fieldLabel = "block text-[10px] tracking-[.14em] text-lp-muted uppercase";
export const input =
  "mt-1.5 block w-full border border-lp-border bg-white/70 px-3 py-2.5 text-[13px] text-lp-text outline-none transition-colors placeholder:text-lp-muted/60 focus:border-lp-brand focus:bg-white motion-reduce:transition-none group-data-[lp-theme=dark]/theme:bg-black/25 group-data-[lp-theme=dark]/theme:focus:border-lp-accent group-data-[lp-theme=dark]/theme:focus:bg-black/40";
export const primaryButton =
  "lp-patch inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-lp-brand-cloth px-5 text-[11px] font-medium tracking-[.12em] text-lp-brand-base uppercase shadow-sm shadow-black/20 [--lp-stitch-inset:4px] transition-colors hover:bg-lp-brand-deep-cloth disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none";
export const quietButton =
  "lp-patch inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-lp-card px-5 text-[11px] tracking-[.12em] text-lp-text uppercase shadow-sm shadow-black/10 [--lp-stitch-inset:4px] transition-colors hover:bg-lp-accent hover:text-lp-ink motion-reduce:transition-none";

export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <p className="text-[10px] tracking-[.16em] text-lp-muted uppercase">{kicker}</p>
        <h1 className="mt-1 font-lp-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none uppercase">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </header>
  );
}

// Order and payment states, each a small cloth chip in the shop's palette.
const statusCloth: Record<OrderStatus, string> = {
  new: "bg-lp-accent text-lp-ink",
  confirmed: "bg-lp-patch-indigo text-lp-canvas",
  packed: "bg-lp-patch-olive text-lp-canvas",
  shipped: "bg-lp-patch-terracotta text-lp-ink",
  delivered: "bg-lp-brand-cloth text-lp-brand-base",
  cancelled: "bg-lp-text/10 text-lp-muted line-through",
};
const paymentCloth: Record<PaymentStatus, string> = {
  unpaid: "bg-lp-text/10 text-lp-text",
  paid: "bg-lp-brand-cloth text-lp-brand-base",
  refunded: "bg-lp-patch-madder text-lp-canvas",
};

export function Chip({ kind, value }: { kind: "status"; value: OrderStatus } | { kind: "payment"; value: PaymentStatus }) {
  const cloth = kind === "status" ? statusCloth[value] : paymentCloth[value];
  return <span className={`lp-patch inline-block px-2 py-1 text-[10px] leading-none tracking-[.1em] whitespace-nowrap uppercase [--lp-stitch-inset:2px] ${cloth}`}>{value}</span>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "good"; children: ReactNode }) {
  const cloth = tone === "warn" ? "bg-lp-patch-mustard/25" : tone === "good" ? "bg-lp-brand/12" : "bg-lp-text/6";
  return <div className={`lp-patch px-4 py-3 text-[12px] leading-relaxed [--lp-stitch-inset:4px] ${cloth}`}>{children}</div>;
}

export const dhakaTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export const dhakaDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
