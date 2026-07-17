-- ============================================================
-- mia.menu — super admin geliştirme (Faz 2.5)
-- ============================================================

-- Müşteri notları
alter table tenants add column if not exists admin_notes text;

-- Referans takibi
alter table tenants add column if not exists referred_by_slug text;

-- Yeni sosyal medya alanları
alter table tenants
  add column if not exists facebook_url text,
  add column if not exists tiktok_url text,
  add column if not exists linkedin_url text,
  add column if not exists twitter_url text,
  add column if not exists youtube_url text;
