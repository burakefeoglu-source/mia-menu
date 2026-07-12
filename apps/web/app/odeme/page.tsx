import Link from 'next/link';

export default function OdemePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Abonelik gerekli</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Menünüzü yayında tutmak için abonelik başlatmanız gerekiyor.
          Ödeme sistemi yakında aktif olacak.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 text-left">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium">Yıllık plan</p>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-md">Önerilen</span>
          </div>
          <p className="text-2xl font-semibold mb-1">3.400 ₺<span className="text-sm font-normal text-gray-500">/yıl</span></p>
          <p className="text-xs text-green-600 mb-3">Aylık 300₺&apos;ye kıyasla 2 ay bedava</p>
          <ul className="text-xs text-gray-600 flex flex-col gap-1.5">
            {['Sınırsız ürün', 'QR kod yönetimi', '14 resmi alerjen', 'Baskı şablonları', 'Öncelikli destek'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-green-600">✓</span>{f}</li>
            ))}
          </ul>
        </div>
        <a
          href="https://wa.me/905XXXXXXXXX?text=Merhaba, mia.menu aboneliği hakkında bilgi almak istiyorum."
          target="_blank"
          rel="noreferrer"
          className="block w-full bg-green-500 text-white rounded-xl py-3 text-sm font-medium mb-3"
        >
          WhatsApp ile iletişime geç
        </a>
        <Link href="/" className="text-xs text-gray-400">Ana sayfaya dön</Link>
      </div>
    </main>
  );
}
