import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import PreviewPanel from '@/components/PreviewPanel';
import TrialBanner from '@/components/TrialBanner';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/giris');

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!tenant) redirect('/giris');

  const { data: staff } = await supabase
    .from('staff_users')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenant.id)
    .maybeSingle();

  if (!staff) redirect('/giris');

  return (
    <div className="min-h-screen bg-gray-50">
      <TrialBanner tenantId={tenant.id} />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-5">
          <div>
            <p className="text-xs text-gray-500">Backoffice</p>
            <p className="text-lg font-medium">{tenant.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/menu/${params.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm bg-amber-100 text-amber-800 px-3 py-1.5 rounded-md"
            >
              Ziyaretçi sayfanız ↗
            </a>
            <LogoutButton />
          </div>
        </div>
        <div className="flex gap-5 items-start">
          <Sidebar slug={params.slug} />
          <div className="flex-1 min-w-0">{children}</div>
          <PreviewPanel slug={params.slug} />
        </div>
      </div>
    </div>
  );
}
