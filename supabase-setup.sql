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

-- ============================================================
-- 4) AFORİZMALAR (konular)
--    Felsefe bölümüyle aynı yapıda: başlık + içerik.
--    Site menüsündeki adı src/constants.js içindeki SEKME_ADI ile belirlenir.
-- ============================================================
create table if not exists konular (
  id          text primary key,
  baslik      text,
  content     text,
  sort_order  bigint default 0,
  created_at  timestamptz default now()
);

-- Bu tabloyu daha önce eski (bölümlü) sürümle oluşturduysan eksik sütunu ekler.
-- Zaten varsa hiçbir şey yapmaz.
alter table konular add column if not exists baslik  text;
alter table konular add column if not exists content text;

-- Eski sürümde "bölümler" olarak girdiğin içerik varsa, onu yeni içerik
-- alanına taşır. Yeni alanı zaten dolu olan kayıtlara DOKUNMAZ.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'konular' and column_name = 'bolumler'
  ) then
    update konular
    set content = (
      select string_agg(
               case
                 when coalesce(trim(b->>'baslik'), '') = ''
                   then coalesce(b->>'icerik', '')
                 else (b->>'baslik') || E'\n\n' || coalesce(b->>'icerik', '')
               end,
               E'\n\n'
             )
      from jsonb_array_elements(bolumler) b
    )
    where coalesce(content, '') = ''
      and jsonb_array_length(coalesce(bolumler, '[]'::jsonb)) > 0;
  end if;
end $$;

alter table konular enable row level security;

drop policy if exists "konular_public_read" on konular;
create policy "konular_public_read" on konular for select using (true);
drop policy if exists "konular_auth_insert" on konular;
create policy "konular_auth_insert" on konular for insert to authenticated with check (true);
drop policy if exists "konular_auth_update" on konular;
create policy "konular_auth_update" on konular for update to authenticated using (true);
drop policy if exists "konular_auth_delete" on konular;
create policy "konular_auth_delete" on konular for delete to authenticated using (true);
