-- ============================================================
-- mia.menu — link sayfası (Faz 2.2)
-- ============================================================

alter table tenants
  add column instagram_url text,
  add column whatsapp_number text,
  add column google_maps_url text,
  add column links_bio text;

create table tenant_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text not null,
  subtitle text,
  url text not null,
  icon text not null default 'link',
  color text not null default '#6b7280',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table tenant_links enable row level security;

create policy public_read_tenant_links on tenant_links
  for select using (true);

create policy staff_manage_tenant_links on tenant_links
  for all using (is_tenant_staff(tenant_id));
