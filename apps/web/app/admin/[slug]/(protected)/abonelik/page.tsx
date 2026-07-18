import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AbonelikPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: tenant } = await supabase
    .from('tenants').select('id, name').eq('slug', params.slug).single();

  const { data: sub } = await supabase
    .from('subscriptions').select('*')
    .eq('tenant_id', tenant!.id).maybeSingle();

  const now = new Date();

  function getStatus() {
    if (!sub) return { label: 'Abonelik bulunamadı', color: 'text-gray-500', daysLeft: null };
    if (sub.status === 'active' && sub.plan_expires_at) {
      const d = Math.ceil((new Date(sub.plan_expires_at).getTime() - now.getTime()) / 86400000);
      return { label: 'Aktif', color: 'text-green-600', daysLeft: d, expires: sub.plan_expires_at };
    }
    if (sub.status === 'trialing' && sub.trial_ends_at) {
      const d = Math.ceil((new Date(sub.trial_ends_at).getTime() - now.getTime()) / 86400000);
      if (d <= 0) return { label: 'Deneme süresi doldu', color: 'text-red-600', daysLeft: 0, expires: sub.trial_ends_at };
      return { label: 'Deneme süresi', color: 'text-blue-600', daysLeft: d, expires: sub.trial_ends_at };
    }
    if (sub.status === 'expired') return { label: 'Süresi doldu', color: 'text-red-600', daysLeft: 0, expires: sub.plan_expires_at };
    return { label: sub.status, color: 'text-gray-500', daysLeft: null, expires: null };
  }

  const status = getStatus();

  return (
    <div>
      <h2 className="text-base font-medium mb-5">Abonelik</h2>

      <div className="max-w-sm flex flex-col gap-4">
        {/* Mevcut durum */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">Mevcut plan</p>
          <p className={`text-2xl font-semibold mb-1 ${status.color}`}>{status.label}</p>
          {status.daysLeft !== null && status.daysLeft > 0 && (
            <p className="text-sm text-gray-500">{status.daysLeft} gün kaldı</p>
          )}
          {(status as { expires?: string | null }).expires && (
            <p className="text-xs text-gray-400 mt-1">
              {sub?.status === 'trialing' ? 'Deneme bitiş' : 'Plan bitiş'}:{' '}
              {new Date((status as { expires: string }).expires).toLocaleDateString('tr-TR', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Plan bilgisi */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-3">Plan detayları</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            {['Sınırsız ürün ve bölüm', 'QR kod yönetimi', '14 resmi alerjen', 'Baskı şablonları (A3/A4/A5)', 'Çoklu dil desteği', 'Canlı önizleme', 'İstatistik & raporlama'].map(f => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>{f}
              </li>
            ))}
          </ul>
        </div>

        {/* Yenileme / Abonelik */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
          <p className="text-sm font-medium mb-1">
            {sub?.status === 'active' ? 'Aboneliği yenile' : 'Abonelik başlat'}
          </p>
          <p className="text-2xl font-semibold mb-1">3.400 ₺<span className="text-sm font-normal text-gray-500">/yıl</span></p>
          <p className="text-xs text-green-600 mb-4">Aylık 283₺&apos;ye — 2 ay bedava</p>
          <a
            href="https://wa.me/905XXXXXXXXX?text=Merhaba, mia.menu aboneliği hakkında bilgi almak istiyorum."
            target="_blank" rel="noreferrer"
            className="block w-full bg-green-500 text-white rounded-lg py-2.5 text-sm font-medium text-center"
          >
            WhatsApp ile iletişime geç
          </a>
          <p className="text-xs text-gray-400 text-center mt-2">
            veya <a href="mailto:merhaba@mia.menu" className="text-rose-600">merhaba@mia.menu</a>
          </p>
        </div>
      </div>
    </div>
  );
}
