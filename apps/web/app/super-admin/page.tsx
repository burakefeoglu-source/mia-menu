import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SuperAdminClient from './SuperAdminClient';

export const dynamic = 'force-dynamic';

const SUPER_ADMIN_EMAIL = 'burak.efeoglu@gmail.com';

export default async function SuperAdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== SUPER_ADMIN_EMAIL) {
    redirect('/giris');
  }

  const { data: tenants } = await supabase
    .from('tenants')
    .select(`
      id, slug, name, phone, is_active, created_at,
      subscriptions(status, trial_ends_at, plan_expires_at)
    `)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-gray-500">mia.menu</p>
            <h1 className="text-xl font-semibold">Super Admin</h1>
          </div>
          <div className="text-sm text-gray-500">
            {tenants?.length ?? 0} işletme
          </div>
        </div>
        <SuperAdminClient tenants={tenants ?? []} />
      </div>
    </main>
  );
}
