-- ============================================================
-- NOMASTER · Supabase kurulum
-- Supabase panelinde: SQL Editor -> New query -> bunu yapıştır -> Run
-- ============================================================

-- 1) Yazı tablosu
create table if not exists articles (
  id          text primary key,   -- kısa etiket (slug), ör: "ideoloji"
  tag         text,
  date        text,
  title       text,
  descr       text,               -- kart altındaki kısa açıklama
  body        text,               -- paragraflar (boş satırla ayrılır)
  sort_order  bigint default 0,   -- sıralama (büyük olan üstte)
  created_at  timestamptz default now()
);

-- 2) Satır bazlı güvenlik (RLS) aç
alter table articles enable row level security;

-- 3) Politikalar
--    Okuma: herkese açık (site yazıları gösterebilsin)
drop policy if exists "articles_public_read" on articles;
create policy "articles_public_read"
  on articles for select
  using (true);

--    Yazma/güncelleme/silme: yalnızca giriş yapmış kullanıcı
drop policy if exists "articles_auth_insert" on articles;
create policy "articles_auth_insert"
  on articles for insert to authenticated
  with check (true);

drop policy if exists "articles_auth_update" on articles;
create policy "articles_auth_update"
  on articles for update to authenticated
  using (true);

drop policy if exists "articles_auth_delete" on articles;
create policy "articles_auth_delete"
  on articles for delete to authenticated
  using (true);
