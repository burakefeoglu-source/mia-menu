-- ============================================================
-- mia.menu — dijital sadakat kartı sistemi
-- ============================================================

create table loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text,
  required_stamps int not null default 10,
  reward_description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  program_id uuid not null references loyalty_programs(id) on delete cascade,
  customer_phone text not null,
  customer_name text,
  stamps int not null default 0,
  completed_count int not null default 0,
  created_at timestamptz not null default now(),
  unique(program_id, customer_phone)
);

create table loyalty_stamps (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references loyalty_cards(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

-- RLS
alter table loyalty_programs enable row level security;
alter table loyalty_cards enable row level security;
alter table loyalty_stamps enable row level security;

create policy "public_read_loyalty_programs" on loyalty_programs for select using (true);
create policy "staff_manage_loyalty_programs" on loyalty_programs for all using (is_tenant_staff(tenant_id));
create policy "public_read_loyalty_cards" on loyalty_cards for select using (true);
create policy "staff_manage_loyalty_cards" on loyalty_cards for all using (is_tenant_staff(tenant_id));
create policy "staff_manage_loyalty_stamps" on loyalty_stamps for all using (
  exists (select 1 from loyalty_cards lc where lc.id = card_id and is_tenant_staff(lc.tenant_id))
);
