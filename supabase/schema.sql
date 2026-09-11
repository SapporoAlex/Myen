-- Run this in the Supabase SQL editor for a new project before setting
-- VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Uses Supabase's built-in
-- email/password auth (enabled by default - no extra config needed).
--
-- If you already ran an earlier version of this file (without user_id),
-- drop the table first: drop table if exists entries;

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date date not null,
  amount integer not null,
  category text not null check (category in ('main', 'web_freelance', 'misc', 'translation')),
  created_at timestamptz not null default now()
);

alter table entries enable row level security;

-- Each signed-in user can only see and modify their own entries.
create policy "individuals manage their own entries" on entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
