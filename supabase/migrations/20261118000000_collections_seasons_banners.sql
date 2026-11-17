-- ঋ - Reé: collections and their seasons, and the landing page's hero slides.
--
-- A collection is a line (e.g. "Nogor"); a season is one drop of it (S-1, S-2, …), and a product
-- belongs to a collection and, optionally, to one of its seasons (e.g. the DHAKA tee is Nogor S-1).
-- `npm run db:seed` fills empty tables from the starter data (src/data/collections.ts and the
-- hero's starter slides) and files the existing products into their collections by category.

-- ── Collections ──────────────────────────────────────────────────────────────────────────────
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(btrim(name)) > 0),
  tagline text not null default '',
  blurb text not null default '',
  -- The wide photo at the top of the collection's page: { "src", "alt", "position" } or null.
  banner jsonb check (banner is null or jsonb_typeof(banner) = 'object'),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Seasons ──────────────────────────────────────────────────────────────────────────────────
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  number integer not null check (number >= 1),
  -- Optional title shown with the number ("S-1 · Dhaka"); the slug is the address under the
  -- collection (/collections/nogor/s-1).
  name text not null default '',
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tagline text not null default '',
  blurb text not null default '',
  banner jsonb check (banner is null or jsonb_typeof(banner) = 'object'),
  starts_on date,
  ends_on date check (ends_on is null or starts_on is null or ends_on >= starts_on),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection_id, slug),
  unique (collection_id, number)
);

-- ── Products join them ───────────────────────────────────────────────────────────────────────
alter table public.products
  add column collection_id uuid references public.collections (id) on delete set null,
  add column season_id uuid references public.seasons (id) on delete set null;

create index products_collection on public.products (collection_id);
create index products_season on public.products (season_id);

-- A product in a season is always in that season's collection.
create function public.products_follow_season() returns trigger
language plpgsql as $$
begin
  if new.season_id is not null then
    select collection_id into new.collection_id from public.seasons where id = new.season_id;
  end if;
  return new;
end $$;

create trigger products_follow_season before insert or update of season_id, collection_id on public.products
  for each row execute function public.products_follow_season();

-- ── Hero slides (the landing page's banner) ──────────────────────────────────────────────────
-- Each slide is one full-screen photograph (landscape, about 1840 × 1090, the subject's head under
-- the middle frame) with the link its card opens. The slideshow needs three or more to move.
create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image jsonb not null check (jsonb_typeof(image) = 'object' and image ? 'src'),
  href text not null default '/shop' check (href like '/%'),
  label text not null default '',
  status text not null default 'published' check (status in ('published', 'hidden')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger collections_touch before update on public.collections
  for each row execute function public.touch_updated_at();
create trigger seasons_touch before update on public.seasons
  for each row execute function public.touch_updated_at();
create trigger hero_slides_touch before update on public.hero_slides
  for each row execute function public.touch_updated_at();

-- Server-only, like the other tables: RLS on, no policies.
alter table public.collections enable row level security;
alter table public.seasons enable row level security;
alter table public.hero_slides enable row level security;
