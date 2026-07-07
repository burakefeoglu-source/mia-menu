-- ============================================================
-- mia.menu — menü düzeni seçimi (Faz 1.9)
-- ============================================================

alter table tenants add column menu_layout text not null default 'classic'
  check (menu_layout in ('classic', 'dark', 'minimal'));
