-- ============================================================
-- mia.menu — duyuru zamanlama + google review linki (Faz 2.1)
-- ============================================================

-- Duyuru zamanlama
alter table announcements
  add column starts_at timestamptz,
  add column ends_at timestamptz;

-- Google review linki
alter table tenants
  add column google_review_url text;
