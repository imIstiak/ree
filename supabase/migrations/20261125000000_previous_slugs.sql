-- Web addresses can be changed in the backroom. Each row keeps the slugs it had before, so an old
-- link redirects to the new address (the shop's pages look here when a slug is not found), a bag
-- saved under the old slug still finds the piece, and a story piece keeps its chapters
-- (src/data/products.ts keys them by the slug it started with).
alter table public.products add column previous_slugs text[] not null default '{}';
alter table public.collections add column previous_slugs text[] not null default '{}';
alter table public.seasons add column previous_slugs text[] not null default '{}';

-- Filled by the database, whatever changed the slug: the old one is added, and the new one taken
-- out (so renaming back to an earlier address leaves no loop).
create function public.remember_previous_slug() returns trigger
language plpgsql as $$
begin
  if new.slug is distinct from old.slug then
    new.previous_slugs = array_append(array_remove(old.previous_slugs, new.slug), old.slug);
  end if;
  return new;
end $$;

create trigger products_previous_slug before update of slug on public.products
  for each row execute function public.remember_previous_slug();
create trigger collections_previous_slug before update of slug on public.collections
  for each row execute function public.remember_previous_slug();
create trigger seasons_previous_slug before update of slug on public.seasons
  for each row execute function public.remember_previous_slug();

-- Looked up by the pages when a slug is not found.
create index products_previous_slugs on public.products using gin (previous_slugs);
create index collections_previous_slugs on public.collections using gin (previous_slugs);
