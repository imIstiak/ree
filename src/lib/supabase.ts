import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { OrderStatus, PaymentStatus } from "./order-states";

export { orderStatuses, paymentStatuses, type OrderStatus, type PaymentStatus } from "./order-states";

// The one Supabase client, server-only. It uses the secret key (SUPABASE_SECRET_KEY, Supabase's
// newer name for the service-role key; SUPABASE_SERVICE_ROLE_KEY also works), which bypasses row
// level security: every table has RLS on with no policies, so nothing is reachable from a browser
// and this key must never reach one (no NEXT_PUBLIC_ prefix). Schema and bucket:
// supabase/migrations/.

export const PHOTO_BUCKET = "ree-products";

const secretKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && secretKey());
}

let client: SupabaseClient | null = null;

export function supabase() {
  if (!supabaseConfigured()) {
    throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SECRET_KEY in .env");
  }
  client ??= createClient(process.env.SUPABASE_URL!, secretKey()!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

// Rows as they come back from the tables.
export type ProductRow = {
  id: string;
  slug: string;
  kind: "classic" | "story";
  name: string;
  tagline: string;
  category: string;
  department: "women" | "men" | "unisex";
  price: number;
  was_price: number | null;
  colour: string;
  sizes: string[];
  stock: Record<string, number>;
  description: string;
  details: string[];
  care: string[];
  images: { src: string; alt: string; position?: string; swatch?: string }[];
  status: "draft" | "published" | "archived";
  sort_order: number;
  collection_id: string | null;
  season_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Photo = { src: string; alt: string; position?: string };

export type CollectionRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  banner: Photo | null;
  // The card's cloth on /collections; null for the automatic colour.
  card_color: string | null;
  status: "draft" | "published" | "archived";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SeasonRow = {
  id: string;
  collection_id: string;
  number: number;
  name: string;
  slug: string;
  tagline: string;
  blurb: string;
  banner: Photo | null;
  starts_on: string | null;
  ends_on: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

export type HeroSlideRow = {
  id: string;
  image: Photo;
  href: string;
  label: string;
  status: "published" | "hidden";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  number: string;
  status: OrderStatus;
  payment_method: "cod" | "mobile";
  payment_status: PaymentStatus;
  customer_name: string;
  phone: string;
  email: string | null;
  area: "dhaka" | "outside";
  address: string;
  city: string;
  note: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  admin_note: string;
  created_at: string;
  updated_at: string;
};

export type AdminRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  slug: string;
  name: string;
  size: string;
  qty: number;
  unit_price: number;
  image: string | null;
};

// A public URL for a file in the photos bucket.
export function photoUrl(path: string) {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

// The bucket path of a photo URL, or null when the photo lives elsewhere (a hotlinked placeholder,
// a file in /public). Used to delete only the files this site uploaded.
export function photoPath(src: string) {
  const prefix = `${process.env.SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/`;
  return src.startsWith(prefix) ? src.slice(prefix.length) : null;
}
