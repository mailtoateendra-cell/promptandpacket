-- Run this in Supabase → SQL Editor → New query → Run.
-- Fully re-runnable: safe to run again anytime (drops policies before recreating).

-- ── Posts ──
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text default '',
  tags text[] default '{}',
  category text default 'blog',
  cover_image_url text,
  body_html text default '',
  read_mins int default 5,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table posts enable row level security;

drop policy if exists "public read published" on posts;
create policy "public read published"
  on posts for select using (published = true);

drop policy if exists "authenticated full access" on posts;
create policy "authenticated full access"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── Media storage bucket (cover + inline images) ──
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media"
  on storage.objects for select using (bucket_id = 'media');

drop policy if exists "authenticated upload media" on storage.objects;
create policy "authenticated upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "authenticated delete own media" on storage.objects;
create policy "authenticated delete own media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ── Editable site content (hero, about, socials, footer) ──
create table if not exists site_settings (
  id int primary key default 1,
  brand text default 'Prompt & Packet',
  hero_headline text default 'Decoding AI and Core Engineering',
  hero_sub text default 'Deep-dive tutorials, prompt architecture, and clean code.',
  about_body text default 'Prompt & Packet sits at the seam between the prompts that steer modern AI systems and the packets that carry everything underneath.',
  youtube_url text default '#',
  github_url text default '#',
  x_url text default '#',
  footer_tagline text default 'Signal over noise. One email a week.',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

alter table site_settings enable row level security;

drop policy if exists "public read settings" on site_settings;
create policy "public read settings"
  on site_settings for select using (true);

drop policy if exists "authenticated write settings" on site_settings;
create policy "authenticated write settings"
  on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── Channel videos (managed from admin: paste a YouTube URL) ──
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title text default '',
  thumbnail_url text default '',
  duration text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table videos enable row level security;

drop policy if exists "public read videos" on videos;
create policy "public read videos"
  on videos for select using (true);

drop policy if exists "authenticated write videos" on videos;
create policy "authenticated write videos"
  on videos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── Editable hero eyebrow line ──
alter table site_settings add column if not exists hero_eyebrow text
  default 'Deep-dive tutorials · Prompt architecture · Clean code';
