-- ঋ - Reé: the shop's catalogue, its orders and the product photos bucket.
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste this file → Run.
-- (Or with the Supabase CLI: `supabase db push`.) It is safe to run on an empty project only;
-- it does not drop anything.
--
-- Access model: the site talks to Supabase only from the server, with the service-role key
-- (SUPABASE_SERVICE_ROLE_KEY). Row level security is switched on with no policies, so the public
-- anon key can read and write nothing. The photos bucket is public for reading only.

create extension if not exists pgcrypto;

-- ── Products ─────────────────────────────────────────────────────────────────────────────────
-- Mirrors the Product type in src/data/products.ts. Story chapters stay in code (keyed by slug).
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null default 'classic' check (kind in ('classic', 'story')),
  name text not null check (length(btrim(name)) > 0),
  tagline text not null default '',
  category text not null,
  department text not null check (department in ('women', 'men', 'unisex')),
  price integer not null check (price >= 0),
  was_price integer check (was_price is null or was_price > price),
  colour text not null default '',
  sizes text[] not null default '{}',
  -- Pieces left per size, e.g. {"S": 4, "M": 0}. A size missing from the map is not tracked
  -- (never sells out); 0 shows the size as sold out.
  stock jsonb not null default '{}'::jsonb check (jsonb_typeof(stock) = 'object'),
  description text not null default '',
  details text[] not null default '{}',
  care text[] not null default '{}',
  -- [{ "src": "...", "alt": "...", "position": "50% 0%", "swatch": "#aabbcc" }, ...]
  images jsonb not null default '[]'::jsonb check (jsonb_typeof(images) = 'array'),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_order on public.products (status, sort_order, created_at);

-- ── Orders ───────────────────────────────────────────────────────────────────────────────────
create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique default ('REE-' || nextval('public.order_number_seq')),
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null check (payment_method in ('cod', 'mobile')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  customer_name text not null,
  phone text not null,
  email text,
  area text not null check (area in ('dhaka', 'outside')),
  address text not null,
  city text not null,
  note text,
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_created on public.orders (created_at desc);
create index orders_status on public.orders (status, created_at desc);

-- What was bought, copied at the moment of the order so later product edits never change it.
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  slug text not null,
  name text not null,
  size text not null,
  qty integer not null check (qty between 1 and 20),
  unit_price integer not null check (unit_price >= 0),
  image text
);

create index order_items_order on public.order_items (order_id);

-- ── updated_at ───────────────────────────────────────────────────────────────────────────────
create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- ── Row level security: on, with no policies (server-only access) ────────────────────────────
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- ── Placing an order ─────────────────────────────────────────────────────────────────────────
-- One transaction: prices come from the products table (never from the browser), tracked stock
-- is checked and taken, and the delivery fee is free from p_free_from. Errors are raised with a
-- code the site turns into a message: EMPTY_BAG, UNAVAILABLE:<slug>, BAD_SIZE:<slug>:<size>,
-- SOLD_OUT:<slug>:<size>.
create function public.place_order(p_order jsonb, p_items jsonb, p_area_fee integer, p_free_from integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_product public.products;
  v_size text;
  v_qty integer;
  v_left integer;
  v_subtotal integer := 0;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_BAG';
  end if;

  insert into public.orders (payment_method, customer_name, phone, email, area, address, city, note)
  values (
    p_order->>'payment_method',
    p_order->>'customer_name',
    p_order->>'phone',
    nullif(p_order->>'email', ''),
    p_order->>'area',
    p_order->>'address',
    p_order->>'city',
    nullif(p_order->>'note', '')
  )
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_size := v_item->>'size';
    v_qty := (v_item->>'qty')::integer;

    select * into v_product from public.products
    where slug = v_item->>'slug' and status = 'published'
    for update;
    if not found then
      raise exception 'UNAVAILABLE:%', v_item->>'slug';
    end if;
    if not (v_size = any (v_product.sizes)) then
      raise exception 'BAD_SIZE:%:%', v_product.slug, v_size;
    end if;

    if v_product.stock ? v_size then
      v_left := (v_product.stock->>v_size)::integer - v_qty;
      if v_left < 0 then
        raise exception 'SOLD_OUT:%:%', v_product.slug, v_size;
      end if;
      update public.products set stock = jsonb_set(stock, array[v_size], to_jsonb(v_left))
      where id = v_product.id;
    end if;

    insert into public.order_items (order_id, product_id, slug, name, size, qty, unit_price, image)
    values (v_order.id, v_product.id, v_product.slug, v_product.name, v_size, v_qty, v_product.price,
            v_product.images->0->>'src');
    v_subtotal := v_subtotal + v_qty * v_product.price;
  end loop;

  update public.orders
  set subtotal = v_subtotal,
      delivery_fee = case when v_subtotal >= p_free_from then 0 else p_area_fee end,
      total = v_subtotal + case when v_subtotal >= p_free_from then 0 else p_area_fee end
  where id = v_order.id
  returning * into v_order;

  return to_jsonb(v_order);
end $$;

-- ── Changing an order's status ───────────────────────────────────────────────────────────────
-- Cancelling puts tracked stock back. A cancelled order stays cancelled (raises REOPEN).
create function public.set_order_status(p_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item public.order_items;
begin
  select * into v_order from public.orders where id = p_id for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;
  if v_order.status = p_status then
    return to_jsonb(v_order);
  end if;
  if v_order.status = 'cancelled' then
    raise exception 'REOPEN';
  end if;

  if p_status = 'cancelled' then
    for v_item in select * from public.order_items where order_id = p_id loop
      update public.products
      set stock = jsonb_set(stock, array[v_item.size], to_jsonb((stock->>v_item.size)::integer + v_item.qty))
      where id = v_item.product_id and stock ? v_item.size;
    end loop;
  end if;

  update public.orders set status = p_status where id = p_id returning * into v_order;
  return to_jsonb(v_order);
end $$;

-- Supabase lets the public roles call functions in `public` by default; these are server-only.
revoke all on function public.place_order(jsonb, jsonb, integer, integer) from public, anon, authenticated;
revoke all on function public.set_order_status(uuid, text) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, jsonb, integer, integer) to service_role;
grant execute on function public.set_order_status(uuid, text) to service_role;

-- ── Product photos ───────────────────────────────────────────────────────────────────────────
-- Public for reading (the shop shows the photos); only the server's service-role key uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ree-products', 'ree-products', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;
