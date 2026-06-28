-- ============================================================
-- mia.menu — etiketler, favoriler, görüş & yorumlar (Faz 1.3)
-- ============================================================

-- Ürün etiketleri (Vegan, Acılı, Yeni vb.)
create table tags (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table product_tags (
  product_id uuid not null references products(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

create index idx_tags_tenant on tags(tenant_id);

alter table tags enable row level security;
alter table product_tags enable row level security;

create policy public_read_tags on tags
  for select using (true);

create policy public_read_product_tags on product_tags
  for select using (true);

create policy staff_manage_tags on tags
  for all using (is_tenant_staff(tenant_id));

create policy staff_manage_product_tags on product_tags
  for all using (
    is_tenant_staff((select tenant_id from products where products.id = product_id))
  );

-- Favori listesi
alter table products add column is_favorite boolean not null default false;

-- Görüş & yorumlar (müşteriden, admin'e — herkese açık değil)
create table reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  customer_name text,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index idx_reviews_tenant on reviews(tenant_id);

alter table reviews enable row level security;

create policy public_insert_reviews on reviews
  for insert with check (true);

create policy staff_manage_reviews on reviews
  for all using (is_tenant_staff(tenant_id));
