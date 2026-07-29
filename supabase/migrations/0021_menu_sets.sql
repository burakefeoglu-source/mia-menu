-- section_nav constraint'e 'list' ekle
alter table tenants drop constraint if exists tenants_section_nav_check;
alter table tenants add constraint tenants_section_nav_check
  check (section_nav in ('tabs', 'grid', 'list'));

-- ============================================================
-- mia.menu — Menü setleri (combo/paket)
-- ============================================================

create table menu_sets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table menu_set_items (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references menu_sets(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity int not null default 1
);

alter table menu_sets disable row level security;
alter table menu_set_items disable row level security;
