-- ============================================================
-- mia.menu — abonelik yönetimi (Faz 2.0)
-- ============================================================

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references tenants(id) on delete cascade,
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'expired', 'cancelled')),
  trial_ends_at timestamptz not null default (now() + interval '5 days'),
  plan_starts_at timestamptz,
  plan_expires_at timestamptz,
  plan text check (plan in ('yearly')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

create index idx_subscriptions_tenant on subscriptions(tenant_id);
create index idx_subscriptions_status on subscriptions(status);

alter table subscriptions enable row level security;

create policy staff_read_own_subscription on subscriptions
  for select using (is_tenant_staff(tenant_id));

create policy service_manage_subscriptions on subscriptions
  for all using (auth.role() = 'service_role');
