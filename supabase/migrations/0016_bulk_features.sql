-- ============================================================
-- mia.menu — toplu fiyat, duyuru ikonu, diyet rozetleri, günün menüsü
-- ============================================================

-- Duyuru ikonu
alter table announcements
  add column icon_type text not null default 'duyuru'
  check (icon_type in ('duyuru', 'kampanya'));

-- Diyet rozetleri + günün menüsü
alter table products
  add column is_vegan boolean not null default false,
  add column is_vegetarian boolean not null default false,
  add column is_gluten_free boolean not null default false,
  add column is_daily_special boolean not null default false;

-- Tag ikonları
alter table tags add column icon text;
