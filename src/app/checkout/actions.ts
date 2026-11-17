"use server";

import { revalidatePath } from "next/cache";
import { FREE_DELIVERY_FROM, deliveryAreas } from "../../data/checkout";
import { getCatalogProduct } from "../../lib/catalog";
import { supabase, supabaseConfigured, type OrderItemRow, type OrderRow } from "../../lib/supabase";

// Places an order from /checkout. Anyone can call this, so it takes only what the customer chose
// (slugs, sizes, quantities and the form) and nothing it could lie about: prices, stock and the
// delivery fee are worked out in the database by place_order() (supabase/migrations/…_backroom.sql).
// Without Supabase configured it answers `offline`, and checkout keeps its preview letter.

export type PlaceOrderInput = {
  name: string;
  phone: string;
  email: string;
  area: string;
  address: string;
  city: string;
  note: string;
  payment: string;
  lines: { slug: string; size: string; qty: number }[];
};

export type PlaceOrderResult =
  | { ok: true; number: string; createdAt: string; subtotal: number; delivery: number; prices: Record<string, number> }
  | { ok: false; offline: true }
  | { ok: false; offline?: false; error: string };

const PHONE = /^(\+?88)?[\s-]*01[3-9]([\s-]*[0-9]){8}$/;
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (!supabaseConfigured()) return { ok: false, offline: true };

  const name = clean(input.name, 80);
  const phone = clean(input.phone, 24);
  const email = clean(input.email, 120);
  const address = clean(input.address, 400);
  const city = clean(input.city, 80);
  const note = clean(input.note, 200);
  const area = deliveryAreas.find((option) => option.id === input.area);
  const payment = input.payment === "mobile" ? "mobile" : input.payment === "cod" ? "cod" : null;

  if (!name || !address || !city) return { ok: false, error: "Please fill in your name, address and city." };
  if (!PHONE.test(phone)) return { ok: false, error: "Please give a Bangladeshi mobile number, like 01712 345678." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "That email address doesn't look right." };
  if (!area || !payment) return { ok: false, error: "Please choose a delivery area and a way to pay." };

  const lines = Array.isArray(input.lines) ? input.lines.slice(0, 20) : [];
  const items = lines
    .map((line) => ({ slug: clean(line.slug, 80), size: clean(line.size, 12), qty: Math.trunc(Number(line.qty)) }))
    .filter((line) => line.slug && line.size && line.qty >= 1 && line.qty <= 10);
  if (items.length === 0 || items.length !== lines.length) return { ok: false, error: "Your bag is empty or has a line we can't read. Please check it and try again." };

  const db = supabase();
  const { data, error } = await db.rpc("place_order", {
    p_order: { payment_method: payment, customer_name: name, phone, email, area: area.id, address, city, note },
    p_items: items,
    p_area_fee: area.fee,
    p_free_from: FREE_DELIVERY_FROM,
  });
  if (error) return { ok: false, error: await explain(error.message) };

  const order = data as OrderRow;
  const { data: rows } = await db.from("order_items").select("slug, size, unit_price").eq("order_id", order.id);
  const prices = Object.fromEntries(((rows ?? []) as Pick<OrderItemRow, "slug" | "size" | "unit_price">[]).map((row) => [row.slug, row.unit_price]));

  // Tracked stock may have changed: rebuild the pages that show these pieces' sizes.
  for (const slug of new Set(items.map((item) => item.slug))) revalidatePath(`/products/${slug}`);

  return { ok: true, number: order.number, createdAt: order.created_at, subtotal: order.subtotal, delivery: order.delivery_fee, prices };
}

// place_order() raises CODE:slug[:size]; say it in words.
async function explain(message: string) {
  const [code, slug, size] = (message.match(/(EMPTY_BAG|UNAVAILABLE|BAD_SIZE|SOLD_OUT)(?::([^:\s]+))?(?::([^:\s]+))?/) ?? []).slice(1);
  const name = slug ? ((await getCatalogProduct(slug))?.name ?? "One of the pieces") : "One of the pieces";
  switch (code) {
    case "EMPTY_BAG":
      return "Your bag is empty.";
    case "UNAVAILABLE":
      return `${name} is no longer available. Please remove it from your bag.`;
    case "BAD_SIZE":
      return `${name} doesn't come in size ${size} any more. Please pick another size.`;
    case "SOLD_OUT":
      return `Size ${size} of ${name} has just sold out. Please lower the quantity or pick another size.`;
    default:
      console.error("place_order failed:", message);
      return "We couldn't place your order just now. Please try again in a minute, or call us.";
  }
}
