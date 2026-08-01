import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import SuperAdminClient from './SuperAdminClient';
import BannerManager from './BannerManager';

export const dynamic = 'force-dynamic';
const SUPER_ADMIN_EMAIL = 'burak.efeoglu@gmail.com';

export default async function SuperAdminPage() {
  // Sadece auth kontrolü için anon client
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== SUPER_ADMIN_EMAIL) redirect('/giris');

  // Tüm veri sorgular için service role (RLS bypass)
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { data: tenants },
    { data: banners },
    { count: totalViews },
    { count: totalReviews },
  ] = await Promise.all([
    db.from('tenants').select(`
      id, slug, name, phone, is_active, created_at, admin_notes, referred_by_slug,
      subscriptions(status, trial_ends_at, plan_expires_at)
    `).order('created_at', { ascending: false }),
    db.from('admin_banners').select('*').order('created_at', { ascending: false }),
    db.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'menu_view'),
    db.from('reviews').select('*', { count: 'exact', head: true }),
  ]);

  const activeTenants = (tenants ?? []).filter(t => {
    const sub = Array.isArray(t.subscriptions) ? t.subscriptions[0] : t.subscriptions;
    return t.is_active && sub?.status === 'active';
  }).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-gray-500">mia.menu</p>
            <h1 className="text-xl font-semibold">Super Admin</h1>
          </div>
        </div>
        <SuperAdminClient
          tenants={tenants ?? []}
          stats={{ totalViews: totalViews ?? 0, totalReviews: totalReviews ?? 0, activeTenants }}
        />
        <BannerManager initialBanners={banners ?? []} />
      </div>
    </main>
  );
}
