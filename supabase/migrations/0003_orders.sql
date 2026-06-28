-- ============================================================
-- mia.menu — sipariş modülü (Faz 2)
-- ============================================================

create table orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  table_id uuid references tables(id) on delete set null,
  order_type text not null check (order_type in ('dine_in', 'takeaway')),
  table_note text,                 -- QR'dan masa tespit edilemediyse müşterinin yazdığı masa no
  customer_name text,
  customer_phone text,
  status text not null default 'new' check (status in ('new', 'preparing', 'ready', 'completed', 'cancelled')),
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_tenant on orders(tenant_id);
create index idx_orders_status on orders(tenant_id, status);

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,      -- sipariş anındaki ad (ürün sonra silinse/değişse bile bozulmasın)
  unit_price numeric(10,2) not null,
  quantity int not null default 1
);

create index idx_order_items_order on order_items(order_id);

alter table orders enable row level security;
alter table order_items enable row level security;

-- Müşteri (anon) sipariş oluşturabilir ama mevcut siparişleri okuyamaz
create policy public_insert_orders on orders
  for insert with check (true);

create policy public_insert_order_items on order_items
  for insert with check (true);

-- Personel kendi tenant'ının siparişlerini görüp yönetebilir
create policy staff_manage_orders on orders
  for all using (is_tenant_staff(tenant_id));

create policy staff_manage_order_items on order_items
  for all using (
    is_tenant_staff((select tenant_id from orders where orders.id = order_id))
  );
