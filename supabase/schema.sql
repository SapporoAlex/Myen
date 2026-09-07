-- Run this in the Supabase SQL editor for a new project before setting
-- VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  amount integer not null,
  category text not null check (category in ('main', 'web_freelance', 'misc', 'translation')),
  created_at timestamptz not null default now()
);

alter table entries enable row level security;

-- Practice-project policy: anyone with the anon key can read/write all rows
-- (there's no per-user auth in this app). Fine for a single-user learning
-- project; if you add real users later, scope these to auth.uid() instead.
create policy "anon full access" on entries
  for all
  using (true)
  with check (true);
