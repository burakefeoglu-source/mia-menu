-- ============================================================
-- mia.menu — analitik + bildirim (Faz 2.4)
-- ============================================================

-- WhatsApp bildirim ayarları
alter table tenants
  add column notification_phone text,
  add column callmebot_api_key text;

-- Analitik olayları
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  event_type text not null check (event_type in ('menu_view', 'product_click')),
  product_id uuid references products(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_analytics_tenant_date on analytics_events(tenant_id, created_at);
alter table analytics_events enable row level security;
create policy "public_insert_analytics" on analytics_events for insert with check (true);
create policy "staff_read_analytics" on analytics_events for select using (is_tenant_staff(tenant_id));

-- Çalışma saatleri
alter table tenants add column if not exists working_hours text;
