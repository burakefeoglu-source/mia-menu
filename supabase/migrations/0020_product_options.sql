-- ============================================================
-- mia.menu — ürün ek seçenekleri
-- ============================================================

create table product_option_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  is_required boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table product_option_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references product_option_groups(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  is_default boolean not null default false,
  sort_order int not null default 0
);

alter table product_option_groups enable row level security;
alter table product_option_items enable row level security;

create policy "public_read_option_groups" on product_option_groups for select using (true);
create policy "public_read_option_items" on product_option_items for select using (true);
create policy "staff_manage_option_groups" on product_option_groups
  for all using (exists (
    select 1 from products p where p.id = product_id and is_tenant_staff(p.tenant_id)
  ));
create policy "staff_manage_option_items" on product_option_items
  for all using (exists (
    select 1 from product_option_groups g
    join products p on p.id = g.product_id
    where g.id = group_id and is_tenant_staff(p.tenant_id)
  ));

-- Section nav'a list seçeneği için migration yok, mevcut kolon string zaten
-- tenants.section_nav 'list' değerini kabul edecek
