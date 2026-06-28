-- ============================================================
-- mia.menu — resmi 14 alerjen listesi (Faz 1.6)
-- ============================================================

alter table allergens add column description text;

-- Mevcut 8 kaydı resmi isim/kod/açıklamaya güncelliyoruz (id'ler aynı kalıyor,
-- böylece zaten atanmış ürün-alerjen eşleşmeleri bozulmuyor)

update allergens set
  code = 'gluten',
  name_tr = 'Gluten içeren tahıllar',
  name_en = 'Cereals containing gluten',
  description = 'Buğday (ör. kılçıksız buğday ve kamut), çavdar, arpa, yulaf veya bunların hibrit türleri ve bunların ürünleri'
where code = 'gluten';

update allergens set
  code = 'milk',
  name_tr = 'Süt (laktoz dahil)',
  name_en = 'Milk (including lactose)',
  description = 'Süt ve süt ürünleri (laktoz dahil)'
where code = 'milk';

update allergens set
  code = 'egg',
  name_tr = 'Yumurta',
  name_en = 'Egg',
  description = 'Yumurta ve yumurta ürünleri'
where code = 'egg';

update allergens set
  code = 'tree_nuts',
  name_tr = 'Sert kabuklu meyveler',
  name_en = 'Tree nuts',
  description = 'Badem, fındık, ceviz, kaju fıstığı, pikan cevizi, brezilya fındığı, antep fıstığı, macadamia ve Queensland fındığı ve bunların ürünleri'
where code = 'nuts';

update allergens set
  code = 'sesame',
  name_tr = 'Susam tohumu',
  name_en = 'Sesame seeds',
  description = 'Susam tohumu ve susam tohumu ürünleri'
where code = 'sesame';

update allergens set
  code = 'soy',
  name_tr = 'Soya fasulyesi',
  name_en = 'Soybeans',
  description = 'Soya fasulyesi ve soya fasulyesi ürünleri'
where code = 'soy';

update allergens set
  code = 'fish',
  name_tr = 'Balık',
  name_en = 'Fish',
  description = 'Balık ve balık ürünleri'
where code = 'fish';

update allergens set
  code = 'crustacea',
  name_tr = 'Kabuklular',
  name_en = 'Crustaceans',
  description = 'Kabuklular (Crustacea) ve bunların ürünleri'
where code = 'shellfish';

-- Eksik 6 kalemi ekliyoruz (sadece tenant_id null olan global standart liste)
insert into allergens (code, name_tr, name_en, description) values
  ('peanuts', 'Yerfıstığı', 'Peanuts', 'Yerfıstığı ve yerfıstığı ürünleri'),
  ('celery', 'Kereviz', 'Celery', 'Kereviz ve kereviz ürünleri'),
  ('mustard', 'Hardal', 'Mustard', 'Hardal ve hardal ürünleri'),
  ('sulphites', 'Kükürt dioksit ve sülfitler', 'Sulphur dioxide and sulphites',
   'Tüketime hazır veya üreticilerin talimatlarına göre hazırlanan ürünler için, toplam SO2 cinsinden hesaplanan konsantrasyonu 10 mg/kg veya 10 mg/L''den daha fazla olanlar'),
  ('lupin', 'Acı bakla', 'Lupin', 'Acı bakla ve acı bakla ürünleri'),
  ('molluscs', 'Yumuşakçalar', 'Molluscs', 'Yumuşakçalar ve ürünleri');
