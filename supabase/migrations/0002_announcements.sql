-- ============================================================
-- mia.menu — duyurular (Faz 1.1)
-- ============================================================

create table announcements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  kind text not null check (kind in ('poster', 'text')),
  title text,
  message text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_announcements_tenant on announcements(tenant_id);

alter table announcements enable row level security;

create policy public_read_announcements on announcements
  for select using (is_active);

create policy staff_manage_announcements on announcements
  for all using (is_tenant_staff(tenant_id));
