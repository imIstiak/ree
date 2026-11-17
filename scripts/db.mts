// Database chores for the shop's Supabase Postgres, over a direct connection:
//
//   npm run db:migrate   apply supabase/migrations/*.sql in order, each once (recorded in
//                        ree_private.migrations), each in its own transaction
//   npm run db:seed      fill empty tables from the starter data (products, collections, which
//                        the existing products are filed into by category, and the hero's
//                        slides), and create a backroom account from SEED_ADMIN_EMAIL /
//                        SEED_ADMIN_PASSWORD (optional SEED_ADMIN_NAME) if it does not exist yet.
//                        An existing account is never changed, unless you ask:
//   npm run db:seed -- --reset-password
//                        set the SEED_ADMIN_EMAIL account's password to SEED_ADMIN_PASSWORD (this
//                        signs that account out everywhere)
//   npm run db:images    upload every image a row points at in public/ (a "/…" path) into the
//                        ree-products bucket, in its place (hero/…, <product slug>/…,
//                        collections/<slug>[/<season>]/…), and point the row at the uploaded
//                        file. Photos hotlinked from other sites are left alone. Safe to re-run.
//
// Connection: DATABASE_URL if set; otherwise the project's direct host from SUPABASE_URL
// (db.<ref>.supabase.co:5432, user postgres, database postgres) with DB_PASSWORD. The direct host
// is IPv6-only, so on an IPv4 network set DB_HOST / DB_USER to the session pooler, as .env does
// for this project (aws-1-ap-northeast-1.pooler.supabase.com, user postgres.<ref>). DB_PORT and
// DB_DATABASE override the rest. (DB_NAME in .env is the project's name, not the database's.)
// Secrets are never printed.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { hashPassword } from "../src/lib/password";
import { starterCollectionCategories, starterCollectionRows, starterHeroRows, starterRows } from "../src/lib/starter-rows";

const ROOT = path.join(import.meta.dirname, "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
const BUCKET = "ree-products";
const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

function connection(): pg.ClientConfig & { label: string } {
  // Supabase's certificate chain is its own CA; the connection is encrypted but not verified.
  const ssl = { rejectUnauthorized: false };
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return { connectionString: process.env.DATABASE_URL, ssl, label: url.hostname };
  }
  const ref = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname.split(".")[0] : null;
  if (!ref || !process.env.DB_PASSWORD) throw new Error("Set SUPABASE_URL and DB_PASSWORD (or DATABASE_URL) in .env.");
  const host = process.env.DB_HOST || `db.${ref}.supabase.co`;
  return {
    host,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "postgres",
    ssl,
    connectionTimeoutMillis: 15_000,
    label: host,
  };
}

async function migrate(db: pg.Client) {
  await db.query(`create schema if not exists ree_private;
    create table if not exists ree_private.migrations (name text primary key, applied_at timestamptz not null default now());
    revoke all on schema ree_private from public, anon, authenticated;`);
  const applied = new Set((await db.query<{ name: string }>("select name from ree_private.migrations")).rows.map((row) => row.name));
  const files = (await readdir(MIGRATIONS)).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  ✓ ${file} (already applied)`);
      continue;
    }
    const sql = await readFile(path.join(MIGRATIONS, file), "utf8");
    try {
      await db.query("begin");
      await db.query(sql);
      await db.query("insert into ree_private.migrations (name) values ($1)", [file]);
      await db.query("commit");
      console.log(`  + ${file}`);
    } catch (error) {
      await db.query("rollback");
      throw new Error(`${file} failed: ${(error as Error).message}`);
    }
  }
}

async function seed(db: pg.Client) {
  const { rows } = await db.query<{ count: string }>("select count(*) from public.products");
  if (Number(rows[0].count) > 0) {
    console.log(`  · products: ${rows[0].count} already there, left as they are`);
  } else {
    const products = starterRows();
    await db.query("begin");
    for (const product of products) {
      await db.query(
        `insert into public.products (slug, kind, name, tagline, category, department, price, was_price, colour, sizes, stock, description, details, care, images, status, sort_order)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14, $15::jsonb, $16, $17)`,
        [
          product.slug, product.kind, product.name, product.tagline, product.category, product.department, product.price, product.was_price,
          product.colour, product.sizes, JSON.stringify(product.stock), product.description, product.details, product.care,
          JSON.stringify(product.images), product.status, product.sort_order,
        ],
      );
    }
    await db.query("commit");
    console.log(`  + products: ${products.length} from the starter catalogue`);
  }

  const collections = Number((await db.query<{ count: string }>("select count(*) from public.collections")).rows[0].count);
  if (collections > 0) {
    console.log(`  · collections: ${collections} already there, left as they are`);
  } else {
    await db.query("begin");
    let filed = 0;
    for (const collection of starterCollectionRows()) {
      const { rows } = await db.query<{ id: string }>(
        `insert into public.collections (slug, name, tagline, blurb, banner, status, sort_order) values ($1, $2, $3, $4, $5::jsonb, $6, $7) returning id`, // card_color stays null
        [collection.slug, collection.name, collection.tagline, collection.blurb, null, collection.status, collection.sort_order],
      );
      const result = await db.query("update public.products set collection_id = $1 where collection_id is null and category = any($2::text[])", [rows[0].id, starterCollectionCategories[collection.slug]]);
      filed += result.rowCount ?? 0;
    }
    await db.query("commit");
    console.log(`  + collections: ${starterCollectionRows().length} from the starter set, ${filed} products filed into them by category`);
  }

  const slides = Number((await db.query<{ count: string }>("select count(*) from public.hero_slides")).rows[0].count);
  if (slides > 0) {
    console.log(`  · hero slides: ${slides} already there, left as they are`);
  } else {
    for (const slide of starterHeroRows()) {
      await db.query("insert into public.hero_slides (image, href, label, status, sort_order) values ($1::jsonb, $2, $3, $4, $5)", [JSON.stringify(slide.image), slide.href, slide.label, slide.status, slide.sort_order]);
    }
    console.log(`  + hero slides: ${starterHeroRows().length} from the starter set`);
  }

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("  · admin: skipped (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)");
    return;
  }
  if (password.length < 10) throw new Error("SEED_ADMIN_PASSWORD should be at least 10 characters.");
  const exists = (await db.query("select 1 from public.admins where email = $1", [email])).rowCount;
  if (exists && !process.argv.includes("--reset-password")) {
    console.log(`  · admin: ${email} already exists, left as it is (add --reset-password to set its password from SEED_ADMIN_PASSWORD)`);
    return;
  }
  if (exists) {
    await db.query("update public.admins set password_hash = $2 where email = $1", [email, await hashPassword(password)]);
    console.log(`  + admin: ${email} password reset (signed out everywhere)`);
  } else {
    await db.query("insert into public.admins (email, name, password_hash) values ($1, $2, $3)", [email, process.env.SEED_ADMIN_NAME?.trim() ?? "", await hashPassword(password)]);
    console.log(`  + admin: ${email} created`);
  }
}

type Photo = { src: string; alt: string; [key: string]: unknown };

async function images(db: pg.Client) {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.SUPABASE_URL || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.");
  const storage = createClient(process.env.SUPABASE_URL, key, { auth: { persistSession: false } }).storage.from(BUCKET);
  const publicUrl = (file: string) => `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${file}`;
  let moved = 0;

  // Uploads public/<src> to <folder>/<file name> and returns the photo pointing at it; photos that
  // are not local files (already uploaded, or hotlinked) come back unchanged.
  async function upload(photo: Photo, folder: string): Promise<Photo> {
    if (!photo.src.startsWith("/")) return photo;
    const local = path.join(ROOT, "public", photo.src);
    const type = TYPES[path.extname(local).toLowerCase()];
    if (!type) throw new Error(`${photo.src}: not a JPEG, PNG, WebP or AVIF file`);
    const file = `${folder}/${path.basename(local)}`;
    const { error } = await storage.upload(file, await readFile(local), { contentType: type, cacheControl: "31536000", upsert: true });
    if (error) throw new Error(`${photo.src}: ${error.message}`);
    moved += 1;
    console.log(`  + ${photo.src} → ${BUCKET}/${file}`);
    return { ...photo, src: publicUrl(file) };
  }

  for (const slide of (await db.query<{ id: string; image: Photo }>("select id, image from public.hero_slides")).rows) {
    const image = await upload(slide.image, "hero");
    if (image !== slide.image) await db.query("update public.hero_slides set image = $2::jsonb where id = $1", [slide.id, JSON.stringify(image)]);
  }
  for (const product of (await db.query<{ id: string; slug: string; images: Photo[] }>("select id, slug, images from public.products")).rows) {
    const updated = await Promise.all(product.images.map((photo) => upload(photo, product.slug)));
    if (updated.some((photo, index) => photo !== product.images[index])) await db.query("update public.products set images = $2::jsonb where id = $1", [product.id, JSON.stringify(updated)]);
  }
  for (const collection of (await db.query<{ id: string; slug: string; banner: Photo | null }>("select id, slug, banner from public.collections where banner is not null")).rows) {
    const banner = await upload(collection.banner!, `collections/${collection.slug}`);
    if (banner !== collection.banner) await db.query("update public.collections set banner = $2::jsonb where id = $1", [collection.id, JSON.stringify(banner)]);
  }
  const seasons = await db.query<{ id: string; slug: string; collection: string; banner: Photo | null }>(
    "select s.id, s.slug, c.slug as collection, s.banner from public.seasons s join public.collections c on c.id = s.collection_id where s.banner is not null",
  );
  for (const season of seasons.rows) {
    const banner = await upload(season.banner!, `collections/${season.collection}/${season.slug}`);
    if (banner !== season.banner) await db.query("update public.seasons set banner = $2::jsonb where id = $1", [season.id, JSON.stringify(banner)]);
  }
  console.log(moved ? `  ${moved} image${moved === 1 ? "" : "s"} uploaded` : "  · nothing to upload: every image is in the bucket or hotlinked");
}

const command = process.argv[2];
if (command !== "migrate" && command !== "seed" && command !== "images") {
  console.error("Usage: tsx scripts/db.mts migrate|seed|images");
  process.exit(1);
}
const { label, ...config } = connection();
const db = new pg.Client(config);
try {
  await db.connect();
  console.log(`Connected to ${label}`);
  await (command === "migrate" ? migrate(db) : command === "seed" ? seed(db) : images(db));
  console.log("Done.");
} catch (error) {
  console.error(`✗ ${(error as Error).message}`);
  process.exitCode = 1;
} finally {
  await db.end().catch(() => {});
}
