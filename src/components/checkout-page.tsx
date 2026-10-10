"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { useState, type FormEvent, type ReactNode } from "react";
import { FREE_DELIVERY_FROM, deliveryAreas, deliveryFee, type DeliveryArea } from "../data/checkout";
import { formatPrice } from "../data/products";
import { BrandLogo } from "./brand-logo";
import { useBag } from "./cart-page";
import { Icon } from "./landing-icons";
import { hand, script } from "./letter-fonts";
import { OrderLetter, ReceiptSlip, faded, ink, label, type PlacedOrder } from "./order-letter";
import { useHydrated } from "./shop-store";
import { EmptyNote, PageButton } from "./site-page";
import { PRODUCT_ROOT_ID } from "./theme-controls";

// Checkout (/checkout) as a printed order form on paper, to match the letter that answers it (the
// user asked for "a physical application form style, same as the thank you page"): a sheet torn
// off its pad, numbered sections, answers written in blue ballpoint on the lines, printed tick
// boxes, and a declaration signed with the name as it is typed, closed by a stamp. The bag rides
// beside it on a paper-clipped slip. The section's `data-paper-page` turns the page into paper
// (globals.css). There is no backend, so placing the order empties the bag and shows the letter
// (order-letter.tsx), whose P.S. says nothing was sent; no payment details are ever asked for.
// Delivery fees come from src/data/checkout.ts.

const payments = [
  { id: "cod", label: "Cash on delivery", note: "Pay the rider in cash when your order arrives.", phrase: "in cash" },
  { id: "mobile", label: "bKash or Nagad on delivery", note: "Pay the rider by mobile payment when your order arrives.", phrase: "by bKash or Nagad" },
] as const;

const ease = [0.2, 0.8, 0.2, 1] as const;

// Answers are written in blue ballpoint on a printed line; the focused line gets a highlighter wash.
const pen = `${hand.className} text-[23px] text-[#1f3b73] placeholder:text-[#7a6450]/40`;
const line = `${pen} w-full leading-[1.25] border-0 border-b border-[#2b1d15]/45 bg-transparent px-1 pt-1 pb-0.5 transition-colors focus:border-[#00664f] focus:bg-[#f5ed9e]/35 focus:outline-none user-invalid:border-[#b4402c] motion-reduce:transition-none`;

function Section({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-10 grid gap-6 border-t-[3px] border-double border-[#2b1d15]/55 pt-5">
      <legend className="float-left flex items-center gap-3 font-lp-display text-[15px] tracking-[.04em] uppercase">
        <span aria-hidden="true" className="grid size-7 place-items-center rounded-full border border-current font-lp-mono text-[12px]">
          {number}
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ code, title, optional, hint, children }: { code: string; title: string; optional?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="grid content-start gap-1">
      <span className={label}>
        <span aria-hidden="true">{code} · </span>
        {title}
        {optional ? <span className="tracking-[.1em] normal-case"> (optional)</span> : <span aria-hidden="true" className="text-[#b4402c]"> *</span>}
      </span>
      {children}
      {hint && <span className={`text-[11px] ${faded}`}>{hint}</span>}
    </label>
  );
}

// A printed tick box; the chosen one gets a ballpoint tick drawn in.
function Tick({ name, value, checked, onChange, title, note }: { name: string; value: string; checked: boolean; onChange: () => void; title: string; note: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3.5 py-1">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span aria-hidden="true" className="relative mt-0.5 size-6 flex-none border-[1.5px] border-[#2b1d15]/70 bg-[#fffdf6] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#00664f]">
        {checked && (
          <svg viewBox="0 0 28 28" className="absolute -top-2 -left-0.5 size-8 overflow-visible text-[#1f3b73]">
            <motion.path d="M5 15c2.6 2.2 4.4 4.6 6 7.4C13.8 15 18.6 8.2 25 3" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: "easeOut" }} />
          </svg>
        )}
      </span>
      <span>
        <span className="block text-[13px] tracking-[.06em] uppercase">{title}</span>
        <span className={`block text-[12px] ${faded}`}>{note}</span>
      </span>
    </label>
  );
}

function Paperclip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 76" className={className} aria-hidden="true">
      <path d="M11 20v38a7 7 0 0 0 14 0V12a9 9 0 0 0-18 0v44" fill="none" stroke="#8c8a86" strokeWidth="3" strokeLinecap="round" />
      <path d="M11 20v38a7 7 0 0 0 14 0V12a9 9 0 0 0-18 0v44" fill="none" stroke="#e7e5e1" strokeWidth="1" strokeLinecap="round" transform="translate(-.6 -.6)" />
    </svg>
  );
}

export function CheckoutView() {
  const hydrated = useHydrated();
  const { lines, subtotal, clearCart } = useBag();
  const [area, setArea] = useState<DeliveryArea>("dhaka");
  const [payment, setPayment] = useState<(typeof payments)[number]["id"]>("cod");
  const [signature, setSignature] = useState("");
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const delivery = deliveryFee(subtotal, area);
  const free = subtotal >= FREE_DELIVERY_FROM;
  const areaLabel = deliveryAreas.find((option) => option.id === area)?.label ?? "";

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    const now = new Date();
    const chosen = payments.find((option) => option.id === payment) ?? payments[0];
    setPlaced({
      number: `REE-${now.getTime().toString(36).slice(-6).toUpperCase()}`,
      date: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(now),
      dateShort: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(now).toUpperCase(),
      name: text("name"),
      phone: text("phone"),
      address: [text("address"), text("city")].filter(Boolean).join(", "),
      areaLabel,
      payment: chosen.label,
      paymentNote: chosen.phrase,
      lines,
      subtotal,
      delivery,
    });
    clearCart();
    document.getElementById(PRODUCT_ROOT_ID)?.scrollTo({ top: 0 });
  }

  if (placed) return <OrderLetter order={placed} />;

  return (
    <MotionConfig reducedMotion="user">
      <section data-paper-page aria-label="Checkout" className="px-[3%] pt-4 pb-16 lg:pt-[2%] lg:pb-[5%]">
        {!hydrated ? (
          <div className="min-h-[60vh]" aria-hidden="true" />
        ) : lines.length === 0 ? (
          <EmptyNote tone="brand" title="Nothing to check out" actions={<PageButton href="/shop">Shop everything</PageButton>}>
            Your bag is empty. Add a piece or two and come back.
          </EmptyNote>
        ) : (
          <form onSubmit={placeOrder} className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(260px,330px)]">
            <motion.div
              initial={{ opacity: 0, y: 48, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -0.4 }}
              transition={{ duration: 0.9, ease }}
              style={{ filter: "drop-shadow(0 24px 32px rgb(40 24 10 / .22))" }}
            >
              <div className={`ree-paper ree-perforated bg-[#fbf6ea] px-6 pt-10 pb-12 sm:px-12 sm:pt-12 lg:px-14 ${ink} [--ree-wordmark:#00664f]`}>
                <header>
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <BrandLogo variant="mark" className="w-10 sm:w-12" decorative />
                      <p className={`${label} leading-relaxed`}>
                        ঋ - Ree
                        <br />
                        Dhaka · Bangladesh
                      </p>
                    </div>
                    <p className={`${label} border border-[#2b1d15]/45 px-3 py-2 text-right leading-relaxed`}>
                      Form R-01
                      <br />
                      Drop 001
                    </p>
                  </div>
                  <h1 className="mt-10 font-lp-display text-[clamp(2.2rem,5cqw,3.6rem)] leading-none tracking-[-.01em] uppercase">Order form</h1>
                  <p className={`mt-3 max-w-[56ch] font-lp-serif text-[16px] leading-relaxed italic ${faded}`}>
                    Please fill in every line marked <span className="text-[#b4402c] not-italic">*</span>. The pieces in your bag are on the slip clipped to this form.
                  </p>
                </header>

                <Section number={1} title="Contact">
                  <Field code="1.1" title="Full name">
                    <input name="name" required autoComplete="name" onChange={(event) => setSignature(event.target.value)} className={line} />
                  </Field>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field code="1.2" title="Mobile number" hint="We call to confirm every order.">
                      <input
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="01712 345678"
                        pattern="(\+?88)?[\s\-]*01[3-9]([\s\-]*[0-9]){8}"
                        title="A Bangladeshi mobile number, like 01712 345678"
                        className={line}
                      />
                    </Field>
                    <Field code="1.3" title="Email" optional>
                      <input name="email" type="email" autoComplete="email" className={line} />
                    </Field>
                  </div>
                </Section>

                <Section number={2} title="Delivery">
                  <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2" role="radiogroup" aria-label="Delivery area">
                    {deliveryAreas.map((option) => (
                      <Tick
                        key={option.id}
                        name="area"
                        value={option.id}
                        checked={area === option.id}
                        onChange={() => setArea(option.id)}
                        title={option.label}
                        note={`${free ? "Free" : formatPrice(option.fee)} · ${option.days}`}
                      />
                    ))}
                  </div>
                  <Field code="2.1" title="Address" hint="House, road, area and any landmark the rider should know.">
                    {/* Ruled like the rest of the form: the lines scroll with the writing. */}
                    <textarea
                      name="address"
                      required
                      rows={3}
                      autoComplete="street-address"
                      className={`${pen} block w-full resize-none border-0 bg-transparent bg-[linear-gradient(transparent_calc(100%-1px),rgb(43_29_21/.45)_calc(100%-1px))] [background-size:100%_2.1rem] bg-local px-1 py-0 leading-[2.1rem] transition-colors focus:bg-[#f5ed9e]/35 focus:outline-none motion-reduce:transition-none`}
                    />
                  </Field>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field code="2.2" title="City or district">
                      <input name="city" required autoComplete="address-level2" className={line} />
                    </Field>
                    <Field code="2.3" title="Note for the rider" optional>
                      <input name="note" className={line} />
                    </Field>
                  </div>
                </Section>

                <Section number={3} title="Payment">
                  <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2" role="radiogroup" aria-label="Payment">
                    {payments.map((option) => (
                      <Tick key={option.id} name="payment" value={option.id} checked={payment === option.id} onChange={() => setPayment(option.id)} title={option.label} note={option.note} />
                    ))}
                  </div>
                  <p className={`text-[12px] ${faded}`}>You pay when your order arrives; this form never asks for card details.</p>
                </Section>

                <Section number={4} title="Declaration">
                  <p className="max-w-[60ch] font-lp-serif text-[16px] leading-relaxed">
                    I would like ঋ - Ree to deliver the pieces on the attached slip to the address above, {areaLabel.charAt(0).toLowerCase() + areaLabel.slice(1)}, for{" "}
                    <strong className="font-semibold">{formatPrice(subtotal + delivery)}</strong> payable on delivery.
                  </p>
                  <div className="flex flex-wrap items-end justify-between gap-8">
                    <div className="min-w-56 flex-1">
                      {/* The name, as typed in 1.1, signs the form. */}
                      <p aria-hidden="true" className={`${script.className} min-h-14 truncate border-b border-[#2b1d15]/45 px-1 text-[2.6rem] leading-[1.35] text-[#1f3b73]`}>
                        {signature}
                      </p>
                      <p className={`${label} mt-1.5`}>Signature</p>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex -rotate-2 cursor-pointer items-center gap-3 border-[3px] border-double border-[#00664f] px-5 py-3 font-lp-display text-[15px] tracking-[.05em] text-[#00664f] uppercase transition-[rotate,background-color,color] duration-300 hover:rotate-0 hover:bg-[#00664f] hover:text-[#fbf6ea] focus-visible:rotate-0 motion-reduce:transition-none"
                    >
                      Place order · {formatPrice(subtotal + delivery)} <Icon name="arrowRight" />
                    </button>
                  </div>
                </Section>

                <div aria-hidden="true" className={`mt-12 ml-auto grid max-w-sm grid-cols-3 border border-dashed border-[#2b1d15]/40 text-[9px] tracking-[.16em] uppercase ${faded}`}>
                  <p className="col-span-3 border-b border-dashed border-[#2b1d15]/40 px-3 py-1.5">For office use only</p>
                  {["Received", "Packed", "Dispatched"].map((step) => (
                    <p key={step} className="h-14 border-r border-dashed border-[#2b1d15]/40 px-2 py-1.5 last:border-r-0">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.aside
              aria-label="Order summary"
              initial={{ opacity: 0, y: 40, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 1.5 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="relative lg:sticky lg:top-8 lg:mt-24"
            >
              <Paperclip className="absolute -top-9 left-8 z-10 w-6 -rotate-6" />
              <ReceiptSlip meta="Clipped to form R-01" lines={lines} subtotal={subtotal} delivery={delivery} note={`${areaLabel} · ${payments.find((option) => option.id === payment)?.label}`}>
                <Link href="/cart" className={`${label} mt-6 inline-block underline decoration-dotted underline-offset-4 hover:text-[#2b1d15]`}>
                  Change the pieces
                </Link>
              </ReceiptSlip>
            </motion.aside>
          </form>
        )}
      </section>
    </MotionConfig>
  );
}
