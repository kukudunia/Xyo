-- RisetAI schema (jalankan di Supabase SQL editor)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

create table if not exists folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  article_id text not null,
  title text not null,
  authors text[] default '{}',
  year int,
  journal text,
  doi text,
  url text,
  folder_id uuid references folders(id) on delete set null,
  created_at timestamptz default now(),
  unique(user_id, article_id)
);

alter table profiles enable row level security;
alter table folders enable row level security;
alter table bookmarks enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own folders" on folders for all using (auth.uid() = user_id);
create policy "own bookmarks" on bookmarks for all using (auth.uid() = user_id);
