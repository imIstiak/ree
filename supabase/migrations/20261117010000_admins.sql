-- ঋ - Reé: backroom accounts. One row per person who can sign in to /backroom.
--
-- Passwords are stored only as scrypt hashes (src/lib/password.ts); the session cookie is signed
-- over the hash, so changing a password or deleting the row signs that person out everywhere.
-- Create accounts with `npm run db:seed` (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD), never by hand
-- with a plain password.

create table public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(btrim(email)) and email like '%@%'),
  name text not null default '',
  password_hash text not null check (password_hash like 'scrypt$%'),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admins_touch before update on public.admins
  for each row execute function public.touch_updated_at();

-- Server-only, like the other tables: RLS on, no policies.
alter table public.admins enable row level security;
