# mia.menu — kurulum ve yayına alma rehberi

Bu rehber, kod yazmadan, sırayla takip ederek projeyi kendi bilgisayarında çalıştırıp internete açman için hazırlandı. Her adımda terminale yapıştıracağın komutlar var.

---

## 0. Gerekenler (bir kerelik)

- **Node.js** (LTS sürüm) — https://nodejs.org adresinden indir, kur.
- **GitHub hesabı** — https://github.com (ücretsiz)
- **Supabase hesabı** — https://supabase.com (ücretsiz, kredi kartı istemiyor)
- **Vercel hesabı** — https://vercel.com (ücretsiz, GitHub ile giriş yapabilirsin)

---

## 1. Supabase projesi oluştur

1. https://supabase.com → "New project"
2. İsim: `mia-menu`, bölge: Frankfurt/EU (Türkiye'ye en yakın)
3. Proje oluşunca sol menüden **SQL Editor**'e gir.
4. `supabase/migrations/0001_init_core_schema.sql` dosyasının içeriğinin tamamını kopyala, SQL Editor'e yapıştır, **Run**.
5. Aynı şekilde `supabase/seed.sql` dosyasının içeriğini de yapıştır, **Run** — bu, mockup'ta gördüğümüz Mia Bistro demo verisini ekler.

## 2. İlk kullanıcını (owner) oluştur

1. Supabase panelinde sol menüden **Authentication → Users → Add user**.
2. E-posta ve şifre belirle (bu, backoffice'e giriş bilgin olacak).
3. Oluşan kullanıcının **User UID**'sini kopyala.
4. SQL Editor'e dön, şunu çalıştır (UID'yi kendi kopyaladığınla değiştir):

```sql
insert into staff_users (user_id, tenant_id, role)
values ('BURAYA_KOPYALADIĞIN_UID', '11111111-1111-1111-1111-111111111111', 'owner');
```

## 3. Bağlantı bilgilerini al

Supabase panelinde **Project Settings → API**:
- `Project URL` → bunu not al
- `anon public` key → bunu not al

---

## 4. Projeyi bilgisayarında çalıştır

Terminalde:

```bash
cd apps/web
npm install
```

`.env.example` dosyasını kopyalayıp `.env.local` adıyla kaydet (terminalde):

```bash
cp .env.example .env.local
```

`.env.local` dosyasını bir metin editörüyle aç, iki değeri Supabase'den aldığın bilgilerle doldur:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Sonra çalıştır:

```bash
npm run dev
```

Tarayıcıda:
- Müşteri menüsü: http://localhost:3000/menu/miabistro
- Backoffice girişi: http://localhost:3000/admin/miabistro/login (2. adımda oluşturduğun e-posta/şifre ile gir)

Her şey mockup'ta gördüğümüz gibi çalışmalı — bölümleri aç/kapa, fiyat güncelle, sağdaki canlı önizlemede "Yenile"ye bas.

---

## 5. GitHub'a yükle

```bash
git init
git add .
git commit -m "ilk surum"
```

GitHub'da yeni, boş bir repo oluştur (README eklemeden), sonra terminalde GitHub'ın verdiği komutları çalıştır (örnek):

```bash
git remote add origin https://github.com/KULLANICI_ADIN/mia-menu.git
git branch -M main
git push -u origin main
```

---

## 6. Vercel'e yayınla

1. https://vercel.com → "Add New… → Project" → GitHub reponu seç.
2. **Root Directory** alanına `apps/web` yaz (önemli — repo kökü değil).
3. **Environment Variables** kısmına `.env.local`'deki üç değeri aynen ekle (`NEXT_PUBLIC_SITE_URL` için şimdilik Vercel'in vereceği geçici adresi, deploy bittikten sonra güncelleyebilirsin).
4. **Deploy**'a bas.

Birkaç dakika içinde canlı bir adresin olacak (örnek: `mia-menu.vercel.app`).

## 7. Kendi alan adını bağla (mia.menu)

Vercel projende **Settings → Domains** → `mia.menu` (veya `miabistro.mia.menu` gibi bir alt alan adı) ekle. Vercel sana DNS'e ekleyeceğin kayıtları gösterecek — bunları alan adını aldığın yerin (GoDaddy, Namecheap vb.) DNS ayarlarına gireceğiz, o adıma geldiğimizde birlikte yapalım.

---

## Sırada ne var

- Bu ilk sürümde sadece **Bölümler & ürünler**, **Fiyat güncelleme**, **Karekod**, **İşletme ayarları** çalışıyor. Diğer paneller (duyuru, sipariş, çoklu dil vb.) sidebar'da görünüyor ama henüz pasif — bunları sırayla dolduracağız.
- Şu an tek tenant (Mia Bistro) için kurulu; gerçek müşterilerin her biri için `tenants` tablosuna yeni satır + ayrı `staff_users` eklenecek.
- React Native hızlı-yönetim app'inin mockup'ını henüz görmedik — istediğinde ona geçebiliriz.
