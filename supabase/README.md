# mia.menu — Supabase çekirdek şema (Faz 1)

## Çalıştırma

```bash
supabase init                 # proje içinde Supabase henüz kurulmadıysa
supabase start                # yerel Supabase'i başlat
supabase db reset             # migrations/ + seed.sql sırayla çalışır
```

Supabase Cloud projesine push etmek için:

```bash
supabase link --project-ref <proje-ref>
supabase db push
```

## Bu migration ne kuruyor

- `tenants`, `locations` — işletme ve şube
- `menu_sections`, `products` — mockup'ta gördüğümüz bölüm/ürün yapısı
- `allergens`, `product_allergens` — 1 Temmuz 2026 yönetmeliği kapsamındaki alerjen alanları (standart 8 alerjen önceden seed edildi)
- `translations` — ürün/bölüm/tenant adlarının ek dillere çevirisi (TR varsayılan, diğerleri bu tabloda)
- `tables` — masa bazlı QR (`qr_token` otomatik üretiliyor)
- `staff_users` — panel kullanıcıları, Supabase Auth (`auth.users`) ile birebir eşleşir, `role`: owner / manager / staff

## RLS mantığı

- **Public okuma**: `is_active = true` olan tenant/bölüm/ürün herkese (anon dahil) açık — public menü sayfası buradan okuyacak.
- **Yazma**: sadece `staff_users` tablosunda o tenant'a kayıtlı kullanıcı (`is_tenant_staff()` fonksiyonu `auth.uid()` üzerinden kontrol ediyor).

## seed.sql

Mockup'ta test ettiğimiz "Mia Bistro" demo verisini (5 bölüm, 10 ürün, alerjen eşleştirmeleri, 5 masa) gerçek şemaya aktarır — yerel ortamda hemen görsel doğrulama yapabilmek için.

## Sıradaki adım

Bir gerçek kullanıcı (owner) oluşturup `staff_users` tablosuna eklemeyi unutma — `seed.sql` içinde örnek satır yorum olarak bırakıldı.

Sonraki migration (Faz 2): `price_lists`, `modifier_groups`, `orders` — sipariş modülüne geçtiğimizde.
