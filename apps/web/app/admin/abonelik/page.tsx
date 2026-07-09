import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AbonelikPage({
  searchParams,
}: {
  searchParams: { slug?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/giris');

  const slug = searchParams.slug;

  const { data: sub } = slug
    ? await supabase
        .from('subscriptions')
        .select('status, trial_ends_at, plan_expires_at')
        .eq('tenant_id', (
          await supabase.from('tenants').select('id').eq('slug', slug).single()
        ).data?.id ?? '')
        .maybeSingle()
    : { data: null };

  const isTrialExpired = sub?.status === 'expired' ||
    (sub?.status === 'trialing' && sub?.trial_ends_at && new Date(sub.trial_ends_at) < new Date());

  const trialEndsAt = sub?.trial_ends_at
    ? new Date(sub.trial_ends_at).toLocaleDateString('tr-TR')
    : null;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-md text-center">
        <div className="text-4xl mb-4">{isTrialExpired ? '⏱️' : '🎉'}</div>

        {isTrialExpired ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">
              Deneme süreniz sona erdi
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              mia.menu'yi kullanmaya devam etmek için abonelik başlatın.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">
              Deneme süreniz devam ediyor
            </h1>
            {trialEndsAt && (
              <p className="text-sm text-gray-500 mb-6">
                Ücretsiz deneme <strong>{trialEndsAt}</strong> tarihinde sona erer.
                Kesintisiz kullanım için abonelik başlatın.
              </p>
            )}
          </>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 text-left">
          <p className="text-xs text-gray-500 mb-3">Yıllık plan</p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold text-gray-900">3.400 ₺</span>
            <span className="text-sm text-gray-500">/ yıl</span>
          </div>
          <p className="text-xs text-gray-400">ya da aylık 300 ₺</p>

          <div className="mt-4 flex flex-col gap-1.5">
            {[
              'Sınırsız ürün ve bölüm',
              'Alerjen & kalori uyumu (Yasal zorunluluk)',
              'QR kod + baskı şablonları',
              'Çoklu dil (TR/EN)',
              'Tasarım özelleştirme',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-emerald-500">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Şimdilik iletişim butonu — iyzico bağlanınca gerçek ödemeye dönüşecek */}
        <a
          href="mailto:info@mia.menu?subject=Abonelik başlatmak istiyorum"
          className="block w-full bg-rose-600 text-white rounded-lg py-3 text-sm font-medium mb-3"
        >
          Abonelik başlat
        </a>

        {slug && (
          <a
            href={`/admin/${slug}`}
            className="block w-full text-sm text-gray-500 py-2"
          >
            ← Panele dön
          </a>
        )}

        <p className="text-[11px] text-gray-400 mt-4">
          Ödeme sistemimiz yakında aktif olacak. Şimdilik{' '}
          <a href="mailto:info@mia.menu" className="underline">info@mia.menu</a>
          {' '}adresinden bize ulaşın.
        </p>
      </div>
    </main>
  );
}
