-- ============================================================
-- mia.menu — demo seed verisi (mockup'ta test ettiğimiz Mia Bistro)
-- Yerel geliştirmede: supabase db reset  (migration + seed otomatik çalışır)
-- ============================================================

insert into tenants (id, slug, name, phone, address, default_locale)
values (
  '11111111-1111-1111-1111-111111111111',
  'miabistro',
  'Mia Bistro',
  '+90 216 555 01 23',
  'Bağdat Cd. No:124, Kadıköy, İstanbul',
  'tr'
);

-- Bölümler
insert into menu_sections (id, tenant_id, name, sort_order) values
  ('21111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Kahvaltı', 1),
  ('21111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Başlangıçlar', 2),
  ('21111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Ana Yemekler', 3),
  ('21111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'Tatlılar', 4),
  ('21111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111111', 'İçecekler', 5);

-- Ürünler
insert into products (id, tenant_id, section_id, name, description, price, calories) values
  ('31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', 'Serpme Kahvaltı', 'Peynir çeşitleri, zeytin, bal, tereyağı, simit, yumurta', 450, 680),
  ('31111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', 'Menemen', 'Domates, biber, yumurta, baharat', 180, 320),
  ('31111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', 'Mercimek Çorbası', 'Mercimek, soğan, tereyağı, baharat', 120, 210),
  ('31111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', 'Humus Tabağı', 'Nohut, tahin, zeytinyağı, limon', 140, 290),
  ('31111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111113', 'Izgara Köfte', 'Dana kıyma, soğan, galeta unu, baharat', 320, 540),
  ('31111111-1111-1111-1111-111111111116', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111113', 'Tavuk Şiş', 'Tavuk but, biber, domates, baharat', 280, 460),
  ('31111111-1111-1111-1111-111111111117', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111114', 'Künefe', 'Kadayıf, peynir, şerbet, fıstık', 220, 610),
  ('31111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111114', 'Sütlaç', 'Süt, pirinç, şeker, vanilya', 160, 280),
  ('31111111-1111-1111-1111-111111111119', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111115', 'Türk Kahvesi', 'Kahve, su', 90, 5),
  ('31111111-1111-1111-1111-11111111111a', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111115', 'Taze Sıkılmış Portakal Suyu', 'Portakal', 110, 120);

-- Alerjen eşleştirmeleri (allergens tablosu migration'da zaten seed edildi)
insert into product_allergens (product_id, allergen_id)
select '31111111-1111-1111-1111-111111111111'::uuid, id from allergens where code in ('gluten','milk','egg')
union all
select '31111111-1111-1111-1111-111111111112'::uuid, id from allergens where code = 'egg'
union all
select '31111111-1111-1111-1111-111111111114'::uuid, id from allergens where code = 'sesame'
union all
select '31111111-1111-1111-1111-111111111115'::uuid, id from allergens where code = 'gluten'
union all
select '31111111-1111-1111-1111-111111111117'::uuid, id from allergens where code in ('gluten','milk','nuts')
union all
select '31111111-1111-1111-1111-111111111118'::uuid, id from allergens where code = 'milk';

-- Masa / QR
insert into tables (tenant_id, label) values
  ('11111111-1111-1111-1111-111111111111', 'Masa 1'),
  ('11111111-1111-1111-1111-111111111111', 'Masa 2'),
  ('11111111-1111-1111-1111-111111111111', 'Masa 3'),
  ('11111111-1111-1111-1111-111111111111', 'Masa 4'),
  ('11111111-1111-1111-1111-111111111111', 'Masa 5');

-- Not: staff_users kaydı auth.users içinde gerçek bir kullanıcı oluşturulduktan
-- sonra eklenmeli, örnek:
-- insert into staff_users (user_id, tenant_id, role)
-- values ('<auth.users.id>', '11111111-1111-1111-1111-111111111111', 'owner');
