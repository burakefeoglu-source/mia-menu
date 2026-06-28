-- ============================================================
-- mia.menu — çekirdek şema (Faz 1 / MVP)
-- Kapsam: tenant, şube, menü bölümü, ürün, alerjen, çeviri,
-- masa/QR, panel kullanıcıları + temel RLS politikaları
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- updated_at otomatik güncelleme yardımcı fonksiyonu
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------
-- tenants — her restoran/işletme bir kayıt
-- ------------------------------------------------------------
create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                 -- subdomain: slug.mia.menu
  name text not null,
  phone text,
  address text,
  logo_url text,
  default_locale text not null default 'tr',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_tenants_updated_at
  before update on tenants
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- locations — bir tenant'ın birden fazla şubesi olabilir
-- ------------------------------------------------------------
create table locations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  created_at timestamptz not null default now()
);

create index idx_locations_tenant on locations(tenant_id);

-- ------------------------------------------------------------
-- menu_sections — Kahvaltı, Başlangıçlar, Ana Yemekler vb.
-- ------------------------------------------------------------
create table menu_sections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_sections_tenant on menu_sections(tenant_id);

-- ------------------------------------------------------------
-- products — menü ürünleri
-- ------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  section_id uuid not null references menu_sections(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  calories int,                              -- 1 Temmuz 2026 yönetmeliği kapsamı
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_tenant on products(tenant_id);
create index idx_products_section on products(section_id);

create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- allergens — standart alerjen sözlüğü (tüm tenant'lar ortak kullanır)
-- ------------------------------------------------------------
create table allergens (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_tr text not null,
  name_en text not null
);

insert into allergens (code, name_tr, name_en) values
  ('gluten', 'Gluten', 'Gluten'),
  ('milk', 'Süt', 'Milk'),
  ('egg', 'Yumurta', 'Egg'),
  ('nuts', 'Fındık', 'Nuts'),
  ('sesame', 'Susam', 'Sesame'),
  ('soy', 'Soya', 'Soy'),
  ('fish', 'Balık', 'Fish'),
  ('shellfish', 'Kabuklu deniz ürünleri', 'Shellfish');

-- ------------------------------------------------------------
-- product_allergens — ürün-alerjen ilişkisi
-- ------------------------------------------------------------
create table product_allergens (
  product_id uuid not null references products(id) on delete cascade,
  allergen_id uuid not null references allergens(id) on delete cascade,
  primary key (product_id, allergen_id)
);

-- ------------------------------------------------------------
-- translations — ürün/bölüm/tenant içeriğinin diğer dillere çevirisi
-- (varsayılan dil products/menu_sections/tenants tablosunda tutulur)
-- ------------------------------------------------------------
create table translations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  entity_type text not null check (entity_type in ('product', 'section', 'tenant')),
  entity_id uuid not null,
  locale text not null,
  field text not null,                       -- 'name' | 'description'
  value text not null,
  unique (entity_type, entity_id, locale, field)
);

create index idx_translations_lookup on translations(entity_type, entity_id, locale);

-- ------------------------------------------------------------
-- tables — masa bazlı karekod
-- ------------------------------------------------------------
create table tables (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  location_id uuid references locations(id) on delete set null,
  label text not null,                       -- 'Masa 1'
  qr_token text unique not null default encode(gen_random_bytes(8), 'hex'),
  created_at timestamptz not null default now()
);

create index idx_tables_tenant on tables(tenant_id);

-- ------------------------------------------------------------
-- staff_users — panel kullanıcıları (Supabase auth.users ile eşleşir)
-- ------------------------------------------------------------
create table staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  role text not null check (role in ('owner', 'manager', 'staff')),
  created_at timestamptz not null default now()
);

create index idx_staff_tenant on staff_users(tenant_id);

-- ============================================================
-- RLS — Row Level Security
-- ============================================================

create or replace function is_tenant_staff(target_tenant uuid)
returns boolean as $$
  select exists (
    select 1 from staff_users
    where staff_users.user_id = auth.uid()
      and staff_users.tenant_id = target_tenant
  );
$$ language sql security definer stable;

alter table tenants enable row level security;
alter table locations enable row level security;
alter table menu_sections enable row level security;
alter table products enable row level security;
alter table allergens enable row level security;
alter table product_allergens enable row level security;
alter table translations enable row level security;
alter table tables enable row level security;
alter table staff_users enable row level security;

-- Herkes (müşteri / public menü sayfası) aktif tenant ve içerikleri okuyabilir
create policy public_read_allergens on allergens
  for select using (true);

create policy public_read_tenants on tenants
  for select using (is_active);

create policy public_read_sections on menu_sections
  for select using (is_active);

create policy public_read_products on products
  for select using (is_active);

create policy public_read_product_allergens on product_allergens
  for select using (true);

create policy public_read_translations on translations
  for select using (true);

create policy public_read_tables on tables
  for select using (true);

-- Sadece ilgili tenant'ın staff_users üyeleri yazabilir (owner/manager/staff)
create policy staff_write_tenants on tenants
  for update using (is_tenant_staff(id));

create policy staff_manage_locations on locations
  for all using (is_tenant_staff(tenant_id));

create policy staff_manage_sections on menu_sections
  for all using (is_tenant_staff(tenant_id));

create policy staff_manage_products on products
  for all using (is_tenant_staff(tenant_id));

create policy staff_manage_product_allergens on product_allergens
  for all using (
    is_tenant_staff((select tenant_id from products where products.id = product_id))
  );

create policy staff_manage_translations on translations
  for all using (is_tenant_staff(tenant_id));

create policy staff_manage_tables on tables
  for all using (is_tenant_staff(tenant_id));

-- staff_users: kullanıcı sadece kendi tenant'ındaki listeyi görebilir
create policy staff_read_own_tenant_staff on staff_users
  for select using (is_tenant_staff(tenant_id));
