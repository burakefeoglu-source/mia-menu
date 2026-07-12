# mia.menu — QR Dijital Menü SaaS

## Proje Özeti
Restoranlar için QR menü SaaS platformu. Next.js 14 + Supabase + Vercel.

---

## Teknoloji Yığını
- **Web:** Next.js 14.2.35, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Storage + RLS)
- **Deploy:** Vercel Pro ($20/ay) + Supabase Pro ($25/ay)
- **Repo:** https://github.com/burakefeoglu-source/mia-menu
- **Canlı:** https://mia-menu.vercel.app
- **Supabase URL:** https://idkcrpdjlfcfwdninygj.supabase.co

---

## Klasör Yapısı
```
mia-menu/
  apps/web/              → Next.js uygulaması
    app/
      page.tsx           → Landing page (ana sayfa)
      kayit/             → Kayıt sayfası + actions
      giris/             → Giriş sayfası
      odeme/             → Ödeme placeholder sayfası
      super-admin/       → Super admin paneli
      admin/[slug]/      → Backoffice
        (protected)/     → Korumalı admin sayfaları
          layout.tsx     → Admin layout (TrialBanner + LogoutButton)
          page.tsx       → Bölümler & Ürünler
          prices/        → Fiyat güncelleme
          tags/          → Ürün etiketleri
          allergens/     → Alerjen listesi
          favorites/     → Favori listesi
          import/        → Excel/CSV içeri aktar
          announcements/ → Duyurular (zamanlama dahil)
          reviews/       → Görüş & yorumlar
          design/        → Menü tasarım (layout + renk + bölüm stili)
          print/         → Baskı (6 şablon, A3/A4/A5)
          qr/            → Karekod yönetimi
          language/      → Dil ayarları
          locations/     → Adres/şube
          settings/      → İşletme ayarları
      menu/[slug]/       → Müşteri menüsü (public)
        print/           → Baskıya hazır menü sayfası
      api/upload/        → Görsel yükleme (sharp sıkıştırma)
    components/
      Sidebar.tsx        → Admin sol menü
      PreviewPanel.tsx   → Canlı önizleme (BroadcastChannel)
      SectionsList.tsx   → Bölüm/ürün CRUD + sürükle-bırak sıralama
      PriceEditor.tsx    → Fiyat güncelleme
      TagAssignGrid.tsx  → Etiket-ürün grid
      AllergenAssignGrid.tsx → Alerjen-ürün grid
      FavoriteToggleList.tsx → Favori aç/kapa
      ImportWizard.tsx   → Excel/CSV içeri aktarma (3 adım)
      ThemePicker.tsx    → Renk teması seçici
      LayoutPicker.tsx   → Menü düzeni seçici (classic/dark/minimal)
      SectionNavPicker.tsx → Bölüm nav (tabs/grid)
      SectionStyleList.tsx → Bölüm iç görünüm
      PrintPanel.tsx     → Baskı seçenekleri paneli
      QrCard.tsx         → Tek QR kartı (PNG/SVG/PDF indir)
      QrManager.tsx      → QR yönetimi + renk + logo
      ImageUploader.tsx  → Görsel yükleme bileşeni
      TrialBanner.tsx    → Trial/abonelik uyarı bandı
      LogoutButton.tsx   → Çıkış butonu
      TranslationEditor.tsx → Dil çevirisi
      LocationEditRow.tsx → Şube düzenleme satırı
    lib/
      menuThemes.ts      → 8 renk teması tanımları
      allergenIcons.tsx  → 14 alerjen SVG ikonları (lucide-react)
      previewChannel.ts  → BroadcastChannel preview refresh
      translate.ts       → Anthropic API çeviri (kapalı, hazır)
    middleware.ts        → Auth koruması (/admin/* rotaları)
    types/database.ts    → TypeScript tipleri
  supabase/
    migrations/          → 0001–0013 arası SQL migration dosyaları
```

---

## Supabase Migration Sırası

| # | Dosya | İçerik |
|---|---|---|
| 0001 | init_core_schema.sql | tenants, locations, menu_sections, products, allergens, product_allergens, translations, tables, staff_users + RLS |
| 0002 | announcements.sql | announcements tablosu |
| 0003 | orders.sql | orders, order_items (kapalı) |
| 0004 | qr_style.sql | tenants.qr_style kolonu |
| 0005 | tags_favorites_reviews.sql | tags, product_tags, is_favorite, reviews |
| 0006 | cover_image.sql | tenants.cover_image_url kolonu |
| 0007 | custom_allergens.sql | allergens.tenant_id (özel alerjen) |
| 0008 | full_allergen_list.sql | 14 resmi alerjen + description kolonu |
| 0009 | menu_design.sql | tenants.theme_color, menu_sections.display_style |
| 0010 | storage.sql | menu-images Storage bucket |
| 0011 | menu_layout.sql | tenants.menu_layout, tenants.section_nav |
| 0012 | subscriptions.sql | subscriptions tablosu (trial/active/expired) |
| 0013 | features.sql | announcements.starts_at/ends_at, tenants.google_review_url |

---

## Tamamlanan Özellikler

### Backoffice (/admin/[slug])
- ✅ Bölüm & ürün CRUD (ekle/düzenle/sil)
- ✅ Ürün sürükle-bırak sıralama
- ✅ Ürün fotoğrafı yükleme (sharp → WebP) + silme
- ✅ Fiyat güncelleme
- ✅ Ürün etiketleri (grid checkbox)
- ✅ 14 resmi alerjen (T.C. mevzuatı) + özel alerjen + SVG ikonlar
- ✅ Favori listesi
- ✅ Duyurular (metin/poster) + zamanlama (starts_at/ends_at)
- ✅ Görüş & yorumlar
- ✅ Dil ayarları (TR/EN manuel + otomatik çeviri hazır ama kapalı)
- ✅ QR kod: stil (kare/yuvarlatılmış/yuvarlak), renk seçici, logo upload, masa yönetimi, PNG/SVG/PDF
- ✅ Menü tasarım: 3 layout, 2 bölüm nav, 8 renk teması, bölüm iç tasarım
- ✅ Baskı: 6 şablon (Klasik/2sütun/Fotoğraflı/Modern bistro/Retro diner/Tahta B), A3/A4/A5, aksan renk seçici
- ✅ Excel/CSV içeri aktar (3 adım: yükle → eşleştir → önizle → aktar)
- ✅ Adres/şube ayarları
- ✅ İşletme ayarları (ad, telefon, adres, kapak fotoğrafı, Google review URL)
- ✅ Canlı önizleme (BroadcastChannel — değişince otomatik yenilenir)
- ✅ Trial banner (5 gün / kalan gün / süresi doldu)
- ✅ Çıkış butonu
- ✅ Middleware (giriş yapmadanlar /admin'e giremez)

### Müşteri Menüsü (/menu/[slug])
- ✅ 3 layout: Classic (temalı header), Dark (koyu), Minimal (beyaz)
- ✅ 2 bölüm navigasyonu: Tabs (yatay sekmeler) veya Grid (2'li kart ızgara)
- ✅ 8 renk teması
- ✅ Favoriler satırı
- ✅ Arama
- ✅ Alerjen rozetleri (SVG ikonlar)
- ✅ Ürün detay modalı (görsel, etiket, alerjen, kalori)
- ✅ Görüş bırakma formu (1-5 yıldız)
- ✅ Google 5 yıldız yönlendirme butonu (Google logo ikonu)
- ✅ Çoklu dil (TR/EN)
- ✅ Kapak fotoğrafı
- ✅ Duyuru banner (zamanlama filtreli)

### Baskı Sayfası (/menu/[slug]/print)
- ✅ 6 şablon: klasik | iki-sutun | fotografli | modern | retro | tahta
- ✅ A3/A4/A5 kağıt boyutu
- ✅ Aksan rengi seçici
- ✅ İçerik seçenekleri: fiyat/açıklama/görsel/alerjen

### SaaS Altyapısı
- ✅ Landing page (logo dahil, iframe önizleme)
- ✅ /kayit sayfası (self-service kayıt → 5 günlük trial → backoffice)
- ✅ /giris sayfası
- ✅ /odeme placeholder (WhatsApp yönlendirmeli)
- ✅ Subscriptions tablosu
- ✅ Super admin paneli (/super-admin — sadece burak.efeoglu@gmail.com)
- ✅ Middleware auth koruması

---

## Bekleyen / Devam Edecek

### Yakın vadeli
- 🔲 Linktree tarzı kısa link sayfası
- 🔲 Görüş bildirimi (e-posta/WhatsApp)
- 🔲 iyzico / Akbank Sanal POS ödeme entegrasyonu
- 🔲 Otomatik çeviri (ANTHROPIC_API_KEY Vercel'e eklenince açılır)

### Kapalı / İleride
- 🔲 Sipariş modülü (kod hazır, 0003_orders.sql çalıştırıldı)
- 🔲 Menü saati kontrolü (kahvaltı bölümü sadece 07-11 arası)
- 🔲 Ürün "tükendi" işaretleme
- 🔲 Alan adı (mia.menu) Vercel'e bağlama

---

## Önemli Kararlar
- **Fiyat:** Aylık 300₺ / Yıllık 3.400₺
- **Ödeme:** Akbank Sanal POS (entegrasyon bekliyor)
- **Altyapı:** Vercel Pro + Supabase Pro ($45/ay), 20+ müşteride self-host değerlendir
- **Super admin e-posta:** burak.efeoglu@gmail.com
- **Otomatik çeviri:** lib/translate.ts hazır, ANTHROPIC_API_KEY Vercel'e eklenince TranslationEditor'a geri bağlanır

---

## Deploy Akışı
```bash
# Geliştirme
cd ~/Downloads/mia-menu/apps/web
npm install
npm run dev

# Canlıya alma
cd ~/Downloads/mia-menu
git add .
git commit -m "..."
git push
# Vercel otomatik deploy eder
```

Vercel Root Directory: `apps/web`

## Vercel Env Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://idkcrpdjlfcfwdninygj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZRXgmNeywdMdJc3W0zvpiQ_xMJEivE5
NEXT_PUBLIC_SITE_URL=https://mia-menu.vercel.app
# ANTHROPIC_API_KEY=sk-ant-...  ← otomatik çeviri için, henüz eklenmedi
```
