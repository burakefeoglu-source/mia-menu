-- ============================================================
-- mia.menu — super admin reklam bandı yönetimi (Faz 2.3)
-- ============================================================

create table admin_banners (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  bg_color text not null default '#c2185b',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- Örnek kayıt
insert into admin_banners (text, bg_color, is_active)
values (
  '🎉 Mia Digital ile sosyal medyanı yönet — 1 yıl boyunca üyeliğin hediye!',
  '#c2185b',
  true
);
