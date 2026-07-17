-- ============================================================
-- mia.menu — super admin geliştirme (Faz 2.5)
-- ============================================================

-- Müşteri notları
alter table tenants add column if not exists admin_notes text;

-- Referans takibi
alter table tenants add column if not exists referred_by_slug text;
