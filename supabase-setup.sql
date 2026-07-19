-- ============================================================
-- NOMASTER · Supabase kurulum
-- Supabase panelinde: SQL Editor -> New query -> bunu yapıştır -> Run
-- Bu dosyayı tekrar çalıştırmak GÜVENLİDİR; mevcut verilere dokunmaz.
-- ============================================================

-- ============================================================
-- 1) YAZILAR (articles)
-- ============================================================
create table if not exists articles (
  id          text primary key,
  tag         text,
  date        text,
  title       text,
  descr       text,
  body        text,
  sort_order  bigint default 0,
  created_at  timestamptz default now()
);
alter table articles enable row level security;

drop policy if exists "articles_public_read" on articles;
create policy "articles_public_read" on articles for select using (true);
drop policy if exists "articles_auth_insert" on articles;
create policy "articles_auth_insert" on articles for insert to authenticated with check (true);
drop policy if exists "articles_auth_update" on articles;
create policy "articles_auth_update" on articles for update to authenticated using (true);
drop policy if exists "articles_auth_delete" on articles;
create policy "articles_auth_delete" on articles for delete to authenticated using (true);

-- ============================================================
-- 2) FELSEFE (felsefe)
-- ============================================================
create table if not exists felsefe (
  id          text primary key,
  title       text,
  content     text,
  sort_order  bigint default 0,
  created_at  timestamptz default now()
);
alter table felsefe enable row level security;

drop policy if exists "felsefe_public_read" on felsefe;
create policy "felsefe_public_read" on felsefe for select using (true);
drop policy if exists "felsefe_auth_insert" on felsefe;
create policy "felsefe_auth_insert" on felsefe for insert to authenticated with check (true);
drop policy if exists "felsefe_auth_update" on felsefe;
create policy "felsefe_auth_update" on felsefe for update to authenticated using (true);
drop policy if exists "felsefe_auth_delete" on felsefe;
create policy "felsefe_auth_delete" on felsefe for delete to authenticated using (true);

-- ============================================================
-- 3) BİYOGRAFİLER (bios) — bolumler JSON olarak saklanır
-- ============================================================
create table if not exists bios (
  id          text primary key,
  isim        text,
  tarih       text,
  etiket      text,
  ozet        text,
  bolumler    jsonb default '[]'::jsonb,
  sort_order  bigint default 0,
  created_at  timestamptz default now()
);
alter table bios enable row level security;

drop policy if exists "bios_public_read" on bios;
create policy "bios_public_read" on bios for select using (true);
drop policy if exists "bios_auth_insert" on bios;
create policy "bios_auth_insert" on bios for insert to authenticated with check (true);
drop policy if exists "bios_auth_update" on bios;
create policy "bios_auth_update" on bios for update to authenticated using (true);
drop policy if exists "bios_auth_delete" on bios;
create policy "bios_auth_delete" on bios for delete to authenticated using (true);
