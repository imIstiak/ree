-- ঋ - Reé: a collection's card colour on /collections (the cloth its card is cut from), picked in
-- the backroom from the banner or a piece's photo. Null keeps the automatic colour.
alter table public.collections
  add column card_color text check (card_color is null or card_color ~ '^#[0-9a-f]{6}$');
