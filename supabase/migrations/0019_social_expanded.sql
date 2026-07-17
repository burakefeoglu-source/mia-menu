-- Genişletilmiş sosyal medya
alter table tenants
  add column if not exists linkedin_url text,
  add column if not exists facebook_url text,
  add column if not exists tiktok_url text,
  add column if not exists youtube_url text,
  add column if not exists twitter_url text,
  add column if not exists links_logo_url text;

-- Duyurular: birden fazla text duyurusu için limit kaldırma (uygulama katmanında)
