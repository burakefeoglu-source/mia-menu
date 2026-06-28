-- ============================================================
-- mia.menu — karekod stil tercihi (Faz 1.2)
-- ============================================================

alter table tenants
  add column qr_style text not null default 'square' check (qr_style in ('square', 'rounded', 'dot'));
