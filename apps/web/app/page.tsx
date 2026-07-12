import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="text-center px-6 pt-16 pb-20 border-b border-gray-100">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="mia.menu" width={120} height={48} className="object-contain" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full mb-6">
          <span>✓</span> T.C. gıda mevzuatına uygun
        </div>
        <h1 className="text-5xl font-semibold text-gray-900 max-w-lg mx-auto leading-tight mb-4">
          Restoranınız için QR menü,<br />5 dakikada hazır
        </h1>
        <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed text-lg">
          Kağıt menü masrafı yok. Alerjen zorunluluğu karşılandı.
          Müşteriniz telefonuyla tarar, anında görür.
        </p>
        <div className="flex gap-3 justify-center flex-wrap mb-14">
          <Link href="/kayit" className="bg-red-500 text-white px-7 py-3.5 rounded-xl font-medium text-sm shadow-sm">
            5 gün ücretsiz dene
          </Link>
          <Link href="/giris" className="bg-gray-100 text-gray-700 px-7 py-3.5 rounded-xl text-sm">
            Giriş yap
          </Link>
        </div>

        {/* Gerçek menü iframe */}
        <div className="mx-auto" style={{ width: 320 }}>
          <div className="relative bg-gray-900 rounded-[40px] p-3 shadow-2xl">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gray-700 rounded-full z-10" />
            <div className="rounded-[32px] overflow-hidden" style={{ height: 580 }}>
              <iframe
                src="/menu/miabistro"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Örnek menü önizlemesi"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">↑ Gerçek menü — kaydırın, deneyin</p>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="px-6 py-16 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-2">Her şey dahil, hiçbir şey karmaşık değil</h2>
        <p className="text-center text-gray-500 text-sm mb-10">Sadece menünüzü girin, biz gerisini halledelim</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            ['🔲', 'QR kod yönetimi', 'Masa başına ayrı QR veya tek genel kod. Logo ekleyin, renk seçin, PDF indirin.'],
            ['🛡️', '14 resmi alerjen', 'Zorunlu 14 alerjen listesi hazır. Her ürüne tek tıkla atayın, yasal bildirimi karşılayın.'],
            ['🌐', 'Türkçe + İngilizce', 'Menünüz iki dilde. Yabancı misafirler için ayrı uygulama gerekmez.'],
            ['🖨️', 'Baskıya hazır', '6 şablon, A3/A4/A5. Renk seçin, PDF alın. Kağıt menü yedeğiniz hazır.'],
            ['🎨', 'Menü tasarımı', '3 farklı düzen, 8 renk teması. Markanıza uygun görünüm.'],
            ['📷', 'Ürün görselleri', 'Fotoğraf yükleyin, biz sıkıştıralım. Hızlı yüklenen WebP formatı.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="text-xl mb-2">{icon}</div>
              <h3 className="text-sm font-medium mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-2">Nasıl çalışır?</h2>
        <p className="text-center text-gray-500 text-sm mb-10">3 adımda yayında</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-xl mx-auto">
          {[
            ['1', 'Kayıt olun', 'İşletme adınızı girin. Menü adresiniz otomatik oluşturulur.'],
            ['2', 'Menünüzü girin', 'Bölüm ve ürünleri ekleyin, görseller yükleyin, alerjenler işaretleyin.'],
            ['3', 'QR kodu asın', 'Masaya QR yapıştırın. Müşterileriniz hemen tarayıp görsün.'],
          ].map(([num, title, desc]) => (
            <div key={title as string} className="text-center">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white text-sm font-medium flex items-center justify-center mx-auto mb-3">{num}</div>
              <h3 className="text-sm font-medium mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FİYATLANDIRMA */}
      <section className="px-6 py-16 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-2">Fiyatlandırma</h2>
        <p className="text-center text-gray-500 text-sm mb-10">5 gün ücretsiz, sonra yıllık abonelik</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium mb-2">Aylık</p>
            <p className="text-3xl font-semibold mb-1">300 <span className="text-base font-normal text-gray-500">₺/ay</span></p>
            <p className="text-xs text-gray-400 mb-4">Her ay yenilenir</p>
            <ul className="flex flex-col gap-2 mb-5 text-xs text-gray-600">
              {['Sınırsız ürün', 'QR kod yönetimi', '14 resmi alerjen', 'Baskı şablonları'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-600">✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/kayit" className="block text-center text-sm border border-gray-200 rounded-lg py-2 text-gray-700">Başla</Link>
          </div>
          <div className="bg-white border-2 border-red-500 rounded-xl p-5 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">En iyi değer</span>
            <p className="text-sm font-medium mb-2">Yıllık</p>
            <p className="text-3xl font-semibold mb-1">3.400 <span className="text-base font-normal text-gray-500">₺/yıl</span></p>
            <p className="text-xs text-green-600 mb-4">2 ay bedava — aylık 283₺&apos;ye</p>
            <ul className="flex flex-col gap-2 mb-5 text-xs text-gray-600">
              {['Aylık plandaki her şey', 'Öncelikli destek', 'Tek ödeme, sorunsuz yıl'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-600">✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/kayit" className="block text-center text-sm bg-red-500 text-white rounded-lg py-2 font-medium">Yıllık başla</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 text-center">
        <Image src="/logo.png" alt="mia.menu" width={80} height={32} className="object-contain mx-auto mb-3" />
        <p className="text-xs text-gray-400">Mia Digital Solutions © 2026</p>
        <div className="flex gap-4 justify-center mt-3">
          <Link href="/giris" className="text-xs text-red-500">Giriş yap</Link>
          <Link href="/kayit" className="text-xs text-red-500 font-medium">Ücretsiz başla</Link>
        </div>
      </footer>

    </main>
  );
}
