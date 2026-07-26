import Link from 'next/link';



export default function LandingPage() {
  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600&display=swap');
        .font-anton { font-family: 'Anton', sans-serif; }
        .text-brand { color: #E11D48; }
        .bg-brand { background: #E11D48; }
        .border-brand { border-color: #E11D48; }
        .hover-brand:hover { background: #BE123C; }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="mia.menu" className="h-10 object-contain" />
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#ozellikler">Özellikler</a>
            <a href="#nasil-calisir">Nasıl Çalışır</a>
            <a href="#kullanim">Kullanım Alanları</a>
            <a href="#paketler">Paketler</a>
            <a href="#sss">SSS</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/giris" className="text-sm text-gray-600 hidden md:block">Giriş yap</Link>
            <Link href="/kayit" className="bg-brand text-white text-sm px-5 py-2.5 rounded-xl font-medium hover-brand transition-colors">
              Demo Talep Et
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full mb-6 font-medium">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              T.C. Gıda Mevzuatına Uygun · 14 Resmi Alerjen
            </div>
            <h1 className="font-anton text-5xl md:text-6xl leading-tight mb-6 text-gray-900">
              MENÜNÜZÜ<br />
              <span className="text-brand">DİJİTALE</span><br />
              TAŞIYIN
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              QR menülerinizi kolayca oluşturun, ürünlerinizi yönetin ve menünüzü saniyeler içinde güncelleyin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/kayit" className="bg-brand text-white px-8 py-4 rounded-xl font-semibold text-sm shadow-lg hover-brand transition-all">
                Ücretsiz Demo Al
              </Link>
              <Link href="/menu/mia-bistro-coffee" target="_blank" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-sm">
                Örnek Menüyü İncele →
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-4">5 gün ücretsiz · Kredi kartı gerekmez</p>
          </div>

          {/* Telefon mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Arka dekor */}
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-red-50 rounded-full opacity-60" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gray-100 rounded-full" />
              {/* Telefon */}
              <div className="relative bg-gray-900 rounded-[44px] p-3 shadow-2xl" style={{ width: 300 }}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full z-10" />
                <div className="rounded-[36px] overflow-hidden" style={{ height: 560 }}>
                  <iframe
                    src="/menu/mia-bistro-coffee"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Örnek menü"
                  />
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">↑ Gerçek menü — kaydırın, deneyin</p>
            </div>
          </div>
        </div>
      </section>

      {/* AVANTAJLAR */}
      <section id="ozellikler" className="bg-gray-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Avantajlar</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">NEDEN MIA MENU?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: 'Hızlı Kurulum', desc: 'Menünüz kısa sürede kullanıma hazır hale gelir.' },
              { icon: '✏️', title: 'Kolay Yönetim', desc: 'Ürün, fiyat ve kategori bilgilerinizi kolayca güncelleyin.' },
              { icon: '📱', title: 'Mobil Uyumlu', desc: 'Tüm telefon ve tabletlerde kusursuz görünüm.' },
              { icon: '🔲', title: 'QR Menü Sistemi', desc: 'Temassız, hızlı ve modern menü deneyimi.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Süreç</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-16">3 ADIMDA YAYINDA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Menünüzü Oluşturun', desc: 'Ürünlerinizi, kategorilerinizi ve fiyatlarınızı ekleyin.' },
              { num: '02', title: 'QR Kodunuzu Alın', desc: 'Masanıza, kapınıza veya paketlerinize yerleştirin.' },
              { num: '03', title: 'Anında Güncelleyin', desc: 'Baskı maliyeti olmadan menünüzü dilediğiniz zaman değiştirin.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className="font-anton text-7xl text-brand opacity-10 mb-2 leading-none">{num}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2 -mt-4">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER LİSTESİ */}
      <section className="bg-gray-900 px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Canlı Menü</p>
            <h2 className="font-anton text-4xl text-white mb-8">HER ŞEY KONTROLÜNÜZDE</h2>
            <div className="flex flex-col gap-4">
              {[
                'Ürün fotoğrafları ve açıklama yönetimi',
                'Çoklu dil desteği (50+ dil)',
                'Kategori ve bölüm düzenleme',
                'Kampanyalı ürün gösterimi',
                'Stokta olmayan ürünü gizleme',
                'Sosyal medya bağlantıları',
                'Alerjen ve kalori bilgisi',
                'QR kod özelleştirme',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-gray-800 rounded-[44px] p-3 shadow-2xl" style={{ width: 280 }}>
              <div className="rounded-[36px] overflow-hidden" style={{ height: 520 }}>
                <iframe
                  src="/menu/mia-bistro-coffee"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Canlı menü demo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAYDALAR */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Sonuçlar</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">İŞLETMENİZE KATKISI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '💰', title: 'Baskı maliyetlerini azaltın', desc: 'Her fiyat değişiminde yeni menü bastırmanıza gerek kalmaz.' },
              { icon: '😊', title: 'Müşteri deneyimini geliştirin', desc: 'Misafirleriniz menüye hızlı ve kolay şekilde ulaşır.' },
              { icon: '⚡', title: 'Menünüzü her an yönetin', desc: 'Yeni ürünleri ve kampanyaları anında yayınlayın.' },
              { icon: '🎨', title: 'Markanıza özel görünüm', desc: 'Renklerinize ve kurumsal kimliğinize uygun dijital menü oluşturun.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 border border-gray-100 rounded-2xl hover:border-red-100 hover:bg-red-50 transition-colors">
                <div className="text-3xl flex-shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KULLANIM ALANLARI */}
      <section id="kullanim" className="bg-gray-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Kullanım Alanları</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">HER İŞLETMEYE UYGUN</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🍽️', label: 'Restoranlar' },
              { icon: '☕', label: 'Kafeler' },
              { icon: '🏨', label: 'Oteller' },
              { icon: '🍸', label: 'Barlar' },
              { icon: '🎂', label: 'Pastaneler' },
              { icon: '🏖️', label: 'Beach Club\'lar' },
              { icon: '📦', label: 'Paket Servis' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-gray-700 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAKETLER */}
      <section id="paketler" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">Paketler</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-4">FİYATLANDIRMA</h2>
          <p className="text-center text-gray-500 text-sm mb-12">5 gün ücretsiz deneyin, kredi kartı gerekmez</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Başlangıç', price: '300₺', period: '/ay', badge: null,
                desc: 'Küçük işletmeler için temel dijital menü.',
                features: ['Sınırsız ürün', 'QR kod yönetimi', '14 resmi alerjen', 'Baskı şablonları'],
                cta: 'Başla', href: '/kayit', primary: false,
              },
              {
                name: 'Profesyonel', price: '3.400₺', period: '/yıl', badge: 'En popüler',
                desc: 'Daha fazla özellik ve özelleştirme seçeneği.',
                features: ['Başlangıç\'taki her şey', '50+ dil çevirisi', 'Sadakat kartı sistemi', 'Öncelikli destek'],
                cta: 'Yıllık Başla', href: '/kayit', primary: true,
              },
              {
                name: 'Kurumsal', price: 'Teklif Al', period: '', badge: null,
                desc: 'Birden fazla şubesi bulunan işletmeler için.',
                features: ['Tüm özellikler', 'Çoklu şube yönetimi', 'Özel entegrasyon', 'Dedicatd destek'],
                cta: 'İletişime Geç', href: 'mailto:merhaba@mia.menu', primary: false,
              },
            ].map(({ name, price, period, badge, desc, features, cta, href, primary }) => (
              <div key={name} className={`rounded-2xl p-6 relative ${primary ? 'bg-brand text-white shadow-xl shadow-red-200 scale-105' : 'bg-white border border-gray-200'}`}>
                {badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">{badge}</span>
                )}
                <p className={`text-sm font-semibold mb-1 ${primary ? 'text-red-100' : 'text-gray-500'}`}>{name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-bold ${primary ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  <span className={`text-sm ${primary ? 'text-red-100' : 'text-gray-400'}`}>{period}</span>
                </div>
                <p className={`text-xs mb-5 ${primary ? 'text-red-100' : 'text-gray-500'}`}>{desc}</p>
                <ul className="flex flex-col gap-2 mb-6">
                  {features.map(f => (
                    <li key={f} className={`text-xs flex items-center gap-2 ${primary ? 'text-red-50' : 'text-gray-600'}`}>
                      <span className={`flex-shrink-0 ${primary ? 'text-white' : 'text-brand'}`}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={href} className={`block text-center text-sm py-2.5 rounded-xl font-medium transition-colors ${primary ? 'bg-white text-brand hover:bg-red-50' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="bg-gray-50 px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest text-center mb-3">SSS</p>
          <h2 className="font-anton text-4xl text-center text-gray-900 mb-12">SIK SORULAN SORULAR</h2>
          <div className="flex flex-col gap-4">
            {[
              { q: 'Menüde değişiklik yapabilir miyim?', a: 'Evet, ürün ve fiyat bilgilerinizi istediğiniz zaman güncelleyebilirsiniz. Değişiklikler anında yansır.' },
              { q: 'QR kod değişir mi?', a: 'Hayır. Menünüzü güncelleseniz bile aynı QR kodu kullanmaya devam edebilirsiniz.' },
              { q: 'Kurulum desteği veriliyor mu?', a: 'Evet, menü kurulumu ve kullanım sürecinde destek sağlanır.' },
              { q: 'Birden fazla şube eklenebilir mi?', a: 'Kurumsal paketlerde birden fazla şube yönetilebilir.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{q}</h3>
                <p className="text-sm text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-anton text-5xl text-white mb-4">MENÜNÜZÜ YENİLEMENİN EN KOLAY YOLU</h2>
          <p className="text-red-100 text-lg mb-8">Mia Menu ile modern, hızlı ve yönetilebilir bir dijital menüye geçin.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/kayit" className="bg-white text-brand px-8 py-4 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
              Hemen Başlayın
            </Link>
            <a href="mailto:merhaba@mia.menu" className="border border-white text-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
              Bizimle İletişime Geçin
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="mia.menu" className="h-8 object-contain" />
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#ozellikler" className="hover:text-gray-700">Özellikler</a>
            <a href="#paketler" className="hover:text-gray-700">Paketler</a>
            <a href="#sss" className="hover:text-gray-700">SSS</a>
            <Link href="/giris" className="hover:text-gray-700">Giriş yap</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 Mia Digital Solutions</p>
        </div>
      </footer>
    </main>
  );
}
