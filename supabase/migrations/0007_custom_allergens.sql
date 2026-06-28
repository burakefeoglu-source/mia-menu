-- ============================================================
-- mia.menu — özel alerjen ekleyebilme (Faz 1.5)
-- ============================================================

-- tenant_id null = standart/yasal liste (silinemez), dolu = işletmenin kendi eklediği
alter table allergens add column tenant_id uuid references tenants(id) on delete cascade;
alter table allergens alter column code drop not null;
alter table allergens alter column name_en drop not null;

create policy staff_manage_own_allergens on allergens
  for all using (tenant_id is not null and is_tenant_staff(tenant_id))
  with check (tenant_id is not null and is_tenant_staff(tenant_id));
